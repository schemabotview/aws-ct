#!/usr/bin/env python3
"""Replay every spine step and compare its terminal transcript with what the commands really print.

The spine is the course's one project, `shop-on-aws`, kept as real files: one snapshot per step in
spine/<course>/<step>/project/. Each step's session.txt is the terminal pane a scene shows — `$ `
lines are commands, everything else is their output. Scenes import these files with Vite's `?raw`,
so a frame can only show what this script has replayed.

  python3 scripts/spine.py            check every step (exit 1 on any difference)
  python3 scripts/spine.py --write    re-run every step and rewrite its session.txt / captures
  python3 scripts/spine.py start/05   only the steps whose path starts with an argument

There is no AWS account behind the course. Each step runs against a FRESH local moto server — the
real AWS CLI v2 and boto3, pointed at an emulator by AWS_ENDPOINT_URL — so what a pane shows is
emulated AWS behaviour, labelled as such on screen, and never presented as AWS's own output.

Each step is replayed in a fresh temp copy named shop-on-aws inside a temp "home", by ONE bash
process per command with state carried over, so `cd`, `source` and exported variables persist as in
a real terminal. Temp paths are rewritten to /home/alex/shop-on-aws, the path the frames show.

What makes a replay deterministic — all of it about the MACHINE, never the commands:
  - The pinned AWS CLI v2 (AWSCLI below) is installed once into .spine-cache/awscli; the Python side
    (moto server, boto3, libfaketime) once into .spine-cache/tools from spine/requirements.txt. A
    step's .venv, when it asks for one, borrows that site-packages through a .pth file.
  - The clock is FROZEN by libfaketime for the emulator and for every command: it starts at the
    step's `time` (default 2026-10-12 09:30:00 UTC) and runs at 1/1000 speed, so a timestamp, an
    X-Amz-Date and a SigV4 signature come out the same on every run.
  - moto's random ids are SEEDED (POST /moto-api/seed), so vpc-…, i-… and request ids repeat exactly.
  - The emulator listens on localhost:5000, the address `env.sh` names. In OUTPUT, that address is
    replaced by the regional endpoint the same call has on AWS (https://<service>.eu-west-2.amazonaws.com,
    the service read from `aws <service>` or step.json's `endpoint`) — except on a line that sets
    AWS_ENDPOINT_URL, which is shown as written. Nothing else in an output is edited.

step.json (all keys optional):
  {"project": "name"}           the folder's name (default shop-on-aws): Course 2's demo is not the spine
  {"venv": true}                create .venv (borrowing boto3) and start with it activated
  {"env": true}                 `source env.sh` silently before the session, as a learner's shell would have
  {"setup": ["cmd", ...]}       run first, silently, in the project (state a frame needs but does not show being made)
  {"account": "111122223333"}   the emulator's account id (MOTO_ACCOUNT_ID)
  {"moto": {"VAR": "value"}}    extra emulator settings, e.g. INITIAL_NO_AUTH_ACTION_COUNT for IAM enforcement
  {"time": "2026-10-12 09:30:00"}  the frozen clock's start
  {"endpoint": "s3"}            the service whose endpoint a non-`aws` command (a Python script) prints
  {"capture": ["path", ...]}    files the session creates that a scene shows; saved to captured/
  {"columns": 100}              the pane's width: 84 in an IDE frame's terminal (default), 100 in a map frame's side pane
"""
import json
import os
import re
import shutil
import socket
import subprocess
import sys
import tempfile
import time
import urllib.request
import zipfile
from pathlib import Path

REPO = Path(__file__).resolve().parent.parent
ROOT = REPO / 'spine'
CACHE = REPO / '.spine-cache'
SHOWN_HOME = '/home/alex'
PROJECT = 'shop-on-aws'
AWSCLI = '2.38.4'
PORT = 5000
ENDPOINT = f'http://localhost:{PORT}'
CLOCK = '2026-10-12 09:30:00'
ACCOUNT = '111122223333'
REGION = 'eu-west-2'
SEED = 42
MARK = '__SPINE_MARK__'
# The terminal pane's width in characters (src/scenes/ide.ts): output is wrapped there, as a real
# terminal of that width wraps it, and COLUMNS tells the tools that do their own layout.
COLUMNS = 84
SERVICE_ENDPOINT = {'s3api': 's3', 's3': 's3', 'logs': 'logs', 'iam': 'iam', 'sts': 'sts'}


def awscli() -> Path:
    """The pinned AWS CLI v2, installed once from AWS's own installer zip."""
    bin_dir = CACHE / 'awscli' / 'bin'
    stamp = CACHE / 'awscli' / 'version'
    if not stamp.exists() or stamp.read_text() != AWSCLI:
        shutil.rmtree(CACHE / 'awscli', ignore_errors=True)
        (CACHE / 'awscli').mkdir(parents=True)
        archive = CACHE / 'awscli' / 'awscliv2.zip'
        urllib.request.urlretrieve(f'https://awscli.amazonaws.com/awscli-exe-linux-x86_64-{AWSCLI}.zip', archive)
        with zipfile.ZipFile(archive) as z:
            z.extractall(CACHE / 'awscli' / 'src')
        for f in (CACHE / 'awscli' / 'src').rglob('*'):
            if f.is_file():
                f.chmod(0o755)
        subprocess.run([str(CACHE / 'awscli' / 'src' / 'aws' / 'install'), '-i', str(CACHE / 'awscli' / 'v2'), '-b', str(bin_dir)],
                       check=True, capture_output=True)
        shutil.rmtree(CACHE / 'awscli' / 'src')
        archive.unlink()
        stamp.write_text(AWSCLI)
    return bin_dir


def tools() -> Path:
    """The Python environment for the emulator and for the project's scripts (built once)."""
    requirements = ROOT / 'requirements.txt'
    stamp = CACHE / 'tools' / 'requirements.txt'
    if not stamp.exists() or stamp.read_text() != requirements.read_text():
        shutil.rmtree(CACHE / 'tools', ignore_errors=True)
        subprocess.run([sys.executable, '-m', 'venv', str(CACHE / 'tools')], check=True)
        subprocess.run([str(CACHE / 'tools' / 'bin' / 'pip'), 'install', '-q', '--disable-pip-version-check', '-r', str(requirements)], check=True)
        shutil.copy(requirements, stamp)
    return CACHE / 'tools'


def faketime_env(venv: Path, start: str) -> dict:
    src = next(venv.glob('lib/python3*/site-packages/libfaketime/vendor/libfaketime/src'))
    return {'LD_LIBRARY_PATH': str(src), 'LD_PRELOAD': 'libfaketime.so.1', 'DONT_FAKE_MONOTONIC': '1',
            'FAKETIME_NO_CACHE': '1', 'FAKETIME': f'@{start} x0.001'}


def start_moto(venv: Path, config: dict) -> subprocess.Popen:
    env = {**os.environ, **faketime_env(venv, config.get('time', CLOCK)), 'MOTO_ACCOUNT_ID': config.get('account', ACCOUNT),
           **config.get('moto', {})}
    server = subprocess.Popen([str(venv / 'bin' / 'moto_server'), '-H', '127.0.0.1', '-p', str(PORT)], env=env,
                              stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
    for _ in range(200):
        try:
            with socket.create_connection(('127.0.0.1', PORT), timeout=0.2):
                break
        except OSError:
            time.sleep(0.05)
    else:
        server.kill()
        raise SystemExit(f'moto did not start on port {PORT} — is another replay running?')
    req = urllib.request.Request(f'http://127.0.0.1:{PORT}/moto-api/seed?a={SEED}', method='POST')
    urllib.request.urlopen(req).read()
    return server


def commands(session: str, columns: int) -> list[str]:
    """The `$ ` lines of a transcript. A command longer than the pane was wrapped like any other
    line, so a `$ ` line exactly `columns` long continues on the next line."""
    lines = session.splitlines()
    out = []
    for i, line in enumerate(lines):
        if line.startswith('$ '):
            cmd = line
            j = i
            while len(lines[j]) == columns and j + 1 < len(lines):
                j += 1
                cmd += lines[j]
            out.append(cmd[2:])
    return out


def endpoint_for(cmd: str, config: dict) -> str | None:
    words = cmd.split()
    if 'aws' in words and words.index('aws') + 1 < len(words):
        svc = words[words.index('aws') + 1]
        return f'https://{SERVICE_ENDPOINT.get(svc, svc)}.{REGION}.amazonaws.com'
    if config.get('endpoint'):
        return f"https://{config['endpoint']}.{REGION}.amazonaws.com"
    return None


def real_endpoints(output: str, cmd: str, config: dict) -> str:
    target = endpoint_for(cmd, config)
    if not target:
        return output
    return '\n'.join(l if 'AWS_ENDPOINT_URL' in l else l.replace(ENDPOINT, target) for l in output.split('\n'))


def replay(step: Path) -> tuple[str, dict[str, str]]:
    config = json.loads((step / 'step.json').read_text()) if (step / 'step.json').exists() else {}
    session = (step / 'session.txt').read_text()
    venv = tools()
    aws_bin = awscli()
    with tempfile.TemporaryDirectory() as tmp:
        home = Path(tmp) / 'home'
        name = config.get('project', PROJECT)
        project = home / name
        home.mkdir()
        if (step / 'project').exists():
            shutil.copytree(step / 'project', project)
        else:
            project.mkdir()
        env = {k: v for k, v in os.environ.items() if not k.startswith(('AWS_', 'VIRTUAL_ENV', 'PYTHON'))}
        env.update({'HOME': str(home), 'NO_COLOR': '1', 'TERM': 'dumb', 'PS1': '', 'TZ': 'UTC', 'COLUMNS': str(config.get('columns', COLUMNS)),
                    'PIP_DISABLE_PIP_VERSION_CHECK': '1', 'PATH': f"{aws_bin}:{venv / 'bin'}:/usr/bin:/bin",
                    'AWS_PAGER': '', 'AWS_CLI_AUTO_PROMPT': 'off'})
        if config.get('venv'):
            subprocess.run([sys.executable, '-m', 'venv', '.venv'], cwd=project, check=True)
            site = next((project / '.venv' / 'lib').glob('python3*/site-packages'))
            borrowed = next(venv.glob('lib/python3*/site-packages'))
            (site / '_spine_base.pth').write_text(str(borrowed) + '\n')
            env['PATH'] = f"{project / '.venv' / 'bin'}:{env['PATH']}"
            env['VIRTUAL_ENV'] = str(project / '.venv')
        server = start_moto(venv, config)
        try:
            state = home / '.spine-state'
            prelude = 'source env.sh >/dev/null 2>&1\n' if config.get('env') else ''
            for cmd in config.get('setup', []):
                subprocess.run(['bash', '-c', prelude + cmd], cwd=project, env={**env, **faketime_env(venv, config.get('time', CLOCK))},
                               check=True, capture_output=True)
            if prelude:
                subprocess.run(['bash', '-c', f'cd {project}\n{prelude}export -p > {state}'], env=env, check=True)
            cwd = project
            blocks: list[str] = []
            for cmd in commands(session, config.get('columns', COLUMNS)):
                script = f'cd {cwd!s}\n{{ {cmd}\n}} 2>&1\necho "{MARK}$PWD"\n'
                if state.exists():
                    script = state.read_text() + '\n' + script
                r = subprocess.run(['bash', '-c', script + f'export -p > {state}'], env={**env, **faketime_env(venv, config.get('time', CLOCK))},
                                   capture_output=True, text=True)
                output, _, after = r.stdout.partition(MARK)
                if after:
                    cwd = Path(after.split('\n')[0])
                output = real_endpoints(output.rstrip('\n'), cmd, config)
                blocks.append(f'$ {cmd}' + (f'\n{output}' if output else ''))
            transcript = '\n'.join(blocks)
            captured = {n: (project / n).read_text() for n in config.get('capture', [])}
        finally:
            server.kill()
            server.wait()
    shown = f'{SHOWN_HOME}'
    fix = lambda s: s.replace(str(home), shown).replace(str(Path(tmp).resolve() / 'home'), shown)
    return wrap(fix(transcript), config.get('columns', COLUMNS)).rstrip('\n') + '\n', {k: fix(v) for k, v in captured.items()}


def wrap(text: str, columns: int) -> str:
    """Hard-wrap at the terminal pane's width, as a real terminal of that width does."""
    out = []
    for line in text.split('\n'):
        while len(line) > columns:
            out.append(line[:columns])
            line = line[columns:]
        out.append(line)
    return '\n'.join(out)


def main() -> int:
    write = '--write' in sys.argv
    only = [a for a in sys.argv[1:] if not a.startswith('--')]
    steps = sorted(p.parent for p in ROOT.glob('*/*/session.txt'))
    steps = [s for s in steps if not only or any(str(s.relative_to(ROOT)).startswith(o) for o in only)]
    problems = 0
    for step in steps:
        transcript, captured = replay(step)
        name = step.relative_to(ROOT)
        if write:
            (step / 'session.txt').write_text(transcript)
            for file, text in captured.items():
                target = step / 'captured' / file
                target.parent.mkdir(parents=True, exist_ok=True)
                target.write_text(text)
            print(f'wrote {name}')
            continue
        expected = (step / 'session.txt').read_text()
        if transcript != expected:
            problems += 1
            print(f'✗ {name}: the terminal pane differs from a real run')
            import difflib
            sys.stdout.writelines(difflib.unified_diff(expected.splitlines(True), transcript.splitlines(True), 'session.txt', 'real run'))
        for file, text in captured.items():
            if (step / 'captured' / file).read_text() != text:
                problems += 1
                print(f'✗ {name}: captured/{file} differs from a real run')
    if not write:
        print(f"{'✗' if problems else '✓'} {len(steps)} spine step(s) replayed, {problems} difference(s)")
    return 1 if problems else 0


if __name__ == '__main__':
    sys.exit(main())
