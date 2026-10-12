"""Verification-level guard for every code card in the AWS course.

The course has no AWS account behind it, so "every result on screen came from a real run" — the
rule the SQL and Spark repos hold — cannot be the rule here. Instead every code card DECLARES how it
was verified, in its filename, after a middle dot:

    cost_ledger.py · runs locally
    head-object.sh · model-checked
    s3.HeadObject.json · model-checked
    versioning.py · emulated
    failover.txt · doc-cited
    sketch.txt · illustrative

and this script proves the declaration is true. A card with no level, or an unknown one, fails.

  runs locally    a `.sql` card runs in a fresh database on the local PostgreSQL 16 cluster and must
                  equal its `<id>-out` card (errors included). A `.py` card is executed with `python3 -I`; it must exit 0, and if the scene holds a
                  code node with id `<id>-out`, that node's text must equal the program's stdout.
  model-checked   checked against the AWS service models botocore ships (the same JSON the CLI and
                  SDKs are generated from):
                    `.sh`    parses with `bash -n`, and every `aws <service> <operation> --param …` line names a real service,
                             operation and input member; CLI customisations (`aws sso login`,
                             `aws configure …`, high-level `aws s3 …`) are reported as unchecked.
                    `<service>.<Operation>.request.json`   a request body, validated in full by
                             botocore's ParamValidator (nested members, required, types, enums).
                    `<service>.<Operation>.json`   a response: valid JSON whose top-level keys are
                             all members of that operation's output shape.
                    other `.json`   valid JSON; an IAM-style policy (has "Statement") must give each
                             statement an Effect of Allow/Deny and an Action/NotAction, and pass
                             parliament's checks for unknown actions, condition keys and ARNs.
                    `.asl.json`   a Step Functions definition: StartAt, every Next/Default/Catch
                             target, Task Resources, Next-or-End, Retry/Catch fields.
                    `.yaml` / `.yml`   a CloudFormation template, linted with cfn-lint.
  emulated        a `.py` card run against moto's in-process AWS emulator — executed like
                  `runs locally`; the label tells the viewer the behaviour came from an emulator,
                  not from AWS.
  doc-cited       not executable; the scene file must carry a `// source: https://…` comment.
  illustrative    nothing is checked. Reported, so the count of unverified cards stays visible.

Hidden verifications: every `verify/**/*.py` runs and must exit 0 (see the end of main()).

Run: npm run check:aws   (needs `pip install -r scripts/requirements-check.txt`)
"""

from __future__ import annotations

import json
import re
import shlex
import subprocess
import sys
import tempfile
from pathlib import Path

LEVELS = {"runs locally", "model-checked", "emulated", "doc-cited", "illustrative"}
# Options the CLI accepts on every command; they are not input members of any operation.
GLOBAL_OPTS = {
    "region", "profile", "output", "query", "debug", "endpoint-url", "no-cli-pager", "no-paginate",
    "no-verify-ssl", "cli-read-timeout", "cli-connect-timeout", "color", "no-sign-request",
    "cli-input-json", "cli-input-yaml", "generate-cli-skeleton", "cli-binary-format",
}
# CLI service names that differ from the botocore service name.
CLI_TO_BOTOCORE = {"s3api": "s3", "configservice": "config"}
# Hand-written CLI commands with no single API operation behind them.
CUSTOMISATIONS = {("sso", "login"), ("sso", "logout"), ("configure", None), ("s3", None)}

ROOT = Path(__file__).resolve().parent.parent
# parliament findings that mean the policy is WRONG, not merely broad. (Its style findings — e.g.
# RESOURCE_STAR on a deliberately broad guardrail — are teaching choices and are not failures.)
PARLIAMENT_ERRORS = {
    "UNKNOWN_ACTION", "UNKNOWN_PREFIX", "UNKNOWN_CONDITION_FOR_ACTION", "RESOURCE_MISMATCH",
    "MALFORMED", "MALFORMED_JSON", "INVALID_ARN", "UNKNOWN_OPERATOR", "MISMATCHED_TYPE",
    "BAD_PATTERN_FOR_MFA", "NO_VERSION", "INVALID_VERSION",
}
problems: list[str] = []
tally: dict[str, int] = {lvl: 0 for lvl in LEVELS}
notes: list[str] = []


def load_scenes() -> dict:
    out = subprocess.run(["node", "scripts/dump-scenes.mjs"], cwd=ROOT, capture_output=True, text=True)
    if out.returncode:
        sys.exit(f"✗ could not load scenes:\n{out.stderr}")
    return json.loads(out.stdout)


def walk(nodes):
    for n in nodes:
        yield n
        yield from walk(n.get("children") or [])


def scene_source(scene_id: str) -> str:
    for f in (ROOT / "src/scenes").rglob("*.ts"):
        text = f.read_text()
        if re.search(rf"id:\s*'{re.escape(scene_id)}'", text):
            return text
    return ""


# --- botocore models ------------------------------------------------------------------------------
_session = None


def model(service: str):
    global _session
    import botocore.session

    _session = _session or botocore.session.get_session()
    try:
        return _session.get_service_model(service)
    except Exception:
        return None


def xform(name: str) -> str:
    from botocore import xform_name

    return xform_name(name).replace("_", "-")


def check_cli(where: str, text: str) -> None:
    # Join backslash continuations, drop comments and prompts, keep the `aws …` lines.
    joined = re.sub(r"\\\n\s*", " ", text)
    for raw in joined.splitlines():
        line = raw.strip().removeprefix("$ ").strip()
        if not line.startswith("aws "):
            continue
        line = line.split(" #", 1)[0]
        words = shlex.split(line)
        cli_service = words[1]
        op = words[2] if len(words) > 2 and not words[2].startswith("-") else None
        if (cli_service, op) in CUSTOMISATIONS or (cli_service, None) in CUSTOMISATIONS:
            notes.append(f"{where}: `aws {cli_service} {op or ''}`".rstrip() + " is a CLI customisation, not model-checked")
            continue
        svc = model(CLI_TO_BOTOCORE.get(cli_service, cli_service))
        if svc is None:
            problems.append(f"{where}: no AWS service model named '{cli_service}'")
            continue
        ops = {xform(o): o for o in svc.operation_names}
        if op not in ops:
            problems.append(f"{where}: '{cli_service}' has no operation '{op}'")
            continue
        shape = svc.operation_model(ops[op]).input_shape
        members = {xform(m) for m in (shape.members if shape else {})}
        for w in words[3:]:
            if not w.startswith("--"):
                continue
            p = w[2:].split("=", 1)[0]
            p = p.removeprefix("no-") if p.removeprefix("no-") in members else p
            if p not in members and p not in GLOBAL_OPTS:
                problems.append(f"{where}: `aws {cli_service} {op}` has no parameter --{p}")


def check_bash(where: str, text: str) -> None:
    """Every shell card must at least parse: `bash -n` catches a broken continuation or quote."""
    body = "\n".join(l[2:] if l.startswith("$ ") else l for l in text.split("\n"))
    r = subprocess.run(["bash", "-n"], input=body, capture_output=True, text=True)
    if r.returncode:
        problems.append(f"{where}: bash -n: {r.stderr.strip()}")


def check_response(where: str, service: str, operation: str, text: str) -> None:
    svc = model(service)
    if svc is None or operation not in svc.operation_names:
        problems.append(f"{where}: no operation {service}.{operation} in the AWS models")
        return
    try:
        body = json.loads(text)
    except json.JSONDecodeError as e:
        problems.append(f"{where}: not valid JSON ({e})")
        return
    out = svc.operation_model(operation).output_shape
    members = set(out.members) if out else set()
    for k in body:
        if k not in members:
            problems.append(f"{where}: '{k}' is not in the {service}.{operation} response shape")


def check_request(where: str, service: str, operation: str, text: str) -> None:
    """A request body, validated IN FULL by botocore's own ParamValidator — the same check the SDK runs
    before sending: every nested member exists, required members are present, types and enums fit."""
    from botocore.validate import ParamValidator

    svc = model(service)
    if svc is None or operation not in svc.operation_names:
        problems.append(f"{where}: no operation {service}.{operation} in the AWS models")
        return
    try:
        body = json.loads(text)
    except json.JSONDecodeError as e:
        problems.append(f"{where}: not valid JSON ({e})")
        return
    report = ParamValidator().validate(body, svc.operation_model(operation).input_shape)
    if report.has_errors():
        problems.append(f"{where}: invalid {service}.{operation} request\n{report.generate_report()}")


ASL_TYPES = {"Task", "Choice", "Wait", "Succeed", "Fail", "Parallel", "Map", "Pass"}
RETRY_KEYS = {"ErrorEquals", "IntervalSeconds", "MaxAttempts", "BackoffRate", "MaxDelaySeconds", "JitterStrategy", "Comment"}
CATCH_KEYS = {"ErrorEquals", "Next", "ResultPath", "Comment", "Output", "Assign"}


def check_asl(where: str, text: str) -> None:
    """Structural check of an Amazon States Language definition: what the console's validator would
    reject first — a missing StartAt, a Next/Default/Catch target that names no state, a Task without
    a Resource, a non-terminal state with neither Next nor End, or an unknown Retry/Catch field."""
    try:
        sm = json.loads(text)
    except json.JSONDecodeError as e:
        problems.append(f"{where}: not valid JSON ({e})")
        return

    def walk(machine, path):
        states = machine.get("States") or {}
        if machine.get("StartAt") not in states:
            problems.append(f"{where}: {path}StartAt '{machine.get('StartAt')}' names no state")
        for name, st in states.items():
            at = f"{path}{name}"
            t = st.get("Type")
            if t not in ASL_TYPES:
                problems.append(f"{where}: {at} has unknown Type {t!r}")
                continue
            targets = [st.get("Next"), st.get("Default")]
            targets += [c.get("Next") for c in st.get("Catch", [])]
            targets += [c.get("Next") for c in st.get("Choices", [])]
            for tgt in filter(None, targets):
                if tgt not in states:
                    problems.append(f"{where}: {at} goes to '{tgt}', which is not a state")
            if t == "Task" and "Resource" not in st:
                problems.append(f"{where}: {at} is a Task without a Resource")
            if t not in ("Succeed", "Fail", "Choice") and not st.get("Next") and st.get("End") is not True:
                problems.append(f"{where}: {at} has neither Next nor End: true")
            for r in st.get("Retry", []):
                if set(r) - RETRY_KEYS or "ErrorEquals" not in r:
                    problems.append(f"{where}: {at} Retry has fields {sorted(set(r) - RETRY_KEYS)} or no ErrorEquals")
            for c in st.get("Catch", []):
                if set(c) - CATCH_KEYS or "ErrorEquals" not in c or "Next" not in c:
                    problems.append(f"{where}: {at} Catch is malformed")
            for i, br in enumerate(st.get("Branches", [])):
                walk(br, f"{at}.Branches[{i}].")

    walk(sm, "")


def check_json(where: str, text: str) -> None:
    try:
        doc = json.loads(text)
    except json.JSONDecodeError as e:
        problems.append(f"{where}: not valid JSON ({e})")
        return
    if isinstance(doc, dict) and "Statement" in doc:
        stmts = doc["Statement"] if isinstance(doc["Statement"], list) else [doc["Statement"]]
        for i, s in enumerate(stmts):
            if s.get("Effect") not in ("Allow", "Deny"):
                problems.append(f"{where}: statement {i} has Effect {s.get('Effect')!r}")
            if "Action" not in s and "NotAction" not in s:
                problems.append(f"{where}: statement {i} has no Action or NotAction")
        # parliament carries AWS's IAM action/resource/condition-key reference offline: an action that
        # does not exist, or a resource ARN no listed action can apply to, is a real defect on screen.
        from parliament import analyze_policy_string

        # A role TRUST policy has a Principal and no Resource (the role itself is the resource).
        # parliament reads every document as an identity policy, so give it the implied Resource
        # rather than report a valid trust policy as malformed.
        def actions(st):
            a = st.get("Action", [])
            return a if isinstance(a, list) else [a]

        trust = all("Principal" in st and actions(st) and all(x.startswith("sts:") for x in actions(st)) for st in stmts)
        if trust:
            text = json.dumps({**doc, "Statement": [{**st, "Resource": "*"} for st in stmts]})
        for f in analyze_policy_string(text).findings:
            if f.issue in PARLIAMENT_ERRORS:
                problems.append(f"{where}: parliament {f.issue} — {f.detail}")


def run_python(where: str, text: str, expected: str | None) -> None:
    with tempfile.TemporaryDirectory() as d:
        f = Path(d) / "card.py"
        f.write_text(text)
        r = subprocess.run([sys.executable, "-I", str(f)], cwd=d, capture_output=True, text=True, timeout=120)
    if r.returncode:
        problems.append(f"{where}: exited {r.returncode}\n{r.stderr.strip()[-600:]}")
        return
    if expected is not None and r.stdout.rstrip() != expected.rstrip():
        problems.append(
            f"{where}: the output card does not match the program's real output\n"
            f"--- card ---\n{expected.rstrip()}\n--- run ---\n{r.stdout.rstrip()}"
        )


def run_sql(where: str, text: str, expected: str | None) -> None:
    """A `.sql` card runs in real PostgreSQL (the local 16 cluster), in a FRESH database created for
    this card and dropped after, so cards cannot see each other's tables. Errors are part of the
    output: a script that demonstrates a rejected statement shows psql's terse ERROR line."""
    import uuid

    db = "awsct_" + uuid.uuid4().hex[:10]
    if subprocess.run(["createdb", db], capture_output=True).returncode:
        problems.append(f"{where}: cannot create a PostgreSQL database (is the local cluster running?)")
        return
    try:
        r = subprocess.run(
            ["psql", "-X", "-q", "-d", db, "-P", "pager=off", "-v", "VERBOSITY=terse"],
            input=text, stdout=subprocess.PIPE, stderr=subprocess.STDOUT, text=True, timeout=120,
        )
    finally:
        subprocess.run(["dropdb", db], capture_output=True)
    if expected is not None and r.stdout.rstrip() != expected.rstrip():
        problems.append(
            f"{where}: the output card does not match PostgreSQL's real output\n"
            f"--- card ---\n{expected.rstrip()}\n--- run ---\n{r.stdout.rstrip()}"
        )


def check_yaml(where: str, text: str) -> None:
    with tempfile.TemporaryDirectory() as d:
        f = Path(d) / "template.yaml"
        f.write_text(text)
        r = subprocess.run([sys.executable, "-m", "cfnlint", str(f)], capture_output=True, text=True)
    if r.returncode:
        problems.append(f"{where}: cfn-lint\n{r.stdout.strip()[-800:]}")


def main() -> None:
    scenes = load_scenes()
    for sid, scene in scenes.items():
        nodes = list(walk(scene["nodes"]))
        by_id = {n["id"]: n for n in nodes}
        for n in nodes:
            if n.get("kind") != "code":
                continue
            where = f"{sid}/{n['id']}"
            fname = n.get("filename") or ""
            if n["id"].endswith("-out") and n["id"][:-4] in by_id:
                continue  # an output card: checked through its program
            if " · " not in fname:
                problems.append(f"{where}: filename '{fname}' declares no verification level (`name · level`)")
                continue
            name, level = (s.strip() for s in fname.rsplit(" · ", 1))
            if level not in LEVELS:
                problems.append(f"{where}: unknown verification level '{level}' (one of {sorted(LEVELS)})")
                continue
            tally[level] += 1
            text = n["label"]
            if level == "runs locally" and name.endswith(".sql"):
                out = by_id.get(n["id"] + "-out")
                run_sql(where, text, out["label"] if out else None)
            elif level in ("runs locally", "emulated"):
                if not name.endswith(".py"):
                    problems.append(f"{where}: '{level}' needs a .py card, got {name}")
                    continue
                out = by_id.get(n["id"] + "-out")
                run_python(where, text, out["label"] if out else None)
            elif level == "model-checked":
                req = re.fullmatch(r"([a-z0-9-]+)\.([A-Z][A-Za-z0-9]+)\.request\.json", name)
                m = re.fullmatch(r"([a-z0-9-]+)\.([A-Z][A-Za-z0-9]+)\.json", name)
                if req:
                    check_request(where, req.group(1), req.group(2), text)
                elif m:
                    check_response(where, m.group(1), m.group(2), text)
                elif name.endswith(".sh"):
                    check_bash(where, text)
                    check_cli(where, text)
                elif name.endswith(".asl.json"):
                    check_asl(where, text)
                elif name.endswith(".json"):
                    check_json(where, text)
                elif name.endswith((".yaml", ".yml")):
                    check_yaml(where, text)
                else:
                    problems.append(f"{where}: nothing can model-check a '{name}' card")
            elif level == "doc-cited":
                if not re.search(r"//\s*source:\s*https://", scene_source(sid)):
                    problems.append(f"{where}: doc-cited, but scene '{sid}' has no `// source: https://…` comment")

    # Hidden verifications: claims a board makes that no card can run on screen (which request a
    # policy allows, implicitly denies or explicitly denies). Each verify/*.py runs and must exit 0;
    # they assert with moto, so they are emulator evidence, as the board's caption must say.
    vdir = ROOT / "verify"
    hidden = sorted(vdir.rglob("*.py")) if vdir.exists() else []
    for f in hidden:
        r = subprocess.run([sys.executable, "-I", str(f)], capture_output=True, text=True, timeout=300)
        if r.returncode:
            problems.append(f"{f.relative_to(ROOT)}: failed\n{(r.stdout + r.stderr).strip()[-800:]}")
    print("  " + "  ".join(f"{lvl}: {tally[lvl]}" for lvl in sorted(LEVELS)) + f"  hidden verifications: {len(hidden)}")
    for n in notes:
        print("  · " + n)
    if problems:
        print(f"\n✗ {len(problems)} verification problem(s):", file=sys.stderr)
        for p in problems:
            print("  " + p, file=sys.stderr)
        sys.exit(1)
    print("✓ every code card's verification level holds")


main()
