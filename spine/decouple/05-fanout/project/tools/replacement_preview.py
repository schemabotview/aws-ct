"""What would an update to a template replace? Read from AWS's own resource
schemas (shipped with cfn-lint): changing a createOnlyProperty replaces the
resource, and so does pointing a createOnly property at a replaced one."""
import json
import sys
from pathlib import Path

import cfnlint
from cfnlint.decode import decode

data = Path(cfnlint.__file__).parent / "data" / "schemas"
index = json.loads((data / "providers" / "eu-west-2.json").read_text())


def create_only(kind):
    schema = (data / "resources" / f"{index[kind]}.json").read_text()
    schema = json.loads(schema)
    return {p.split("/")[-1] for p in schema.get("createOnlyProperties", [])}


old, new = (decode(path)[0]["Resources"] for path in sys.argv[1:3])
replaced = set()
for name, res in new.items():  # templates list dependencies first
    before, after = old[name].get("Properties", {}), res.get("Properties", {})
    changed = {k for k in before.keys() | after.keys()
               if before.get(k) != after.get(k)}
    refs = {k for k, v in after.items()  # !Ref or !GetAtt of a replaced one
            if any(f'"{r}"' in json.dumps(v) for r in replaced)}
    forced = (changed | refs) & create_only(res["Type"])
    if forced:
        replaced.add(name)
        print(f"{name:8} Replace   {', '.join(sorted(forced))}")
    elif changed:
        print(f"{name:8} Modify    {', '.join(sorted(changed))}")
print(f"{len(replaced)} of {len(new)} resources replaced")
