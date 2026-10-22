"""Answer 'who changed this, when, from where?' from CloudTrail records:
the writes (readOnly false) to one resource, oldest first."""
import json
import sys

path, resource = sys.argv[1:3]
records = json.load(open(path))["Records"]
writes = [r for r in records if not r["readOnly"]
          and resource in json.dumps(r.get("requestParameters", {}))]
for r in sorted(writes, key=lambda r: r["eventTime"]):
    who = r["userIdentity"]["arn"].rsplit("/", 1)[-1]
    role = r["userIdentity"]["sessionContext"]["sessionIssuer"]["userName"]
    print(f"{r['eventTime']}  {r['eventName']}  by {who}")
    print(f"  as {role.rsplit('_', 1)[0]}, from {r['sourceIPAddress']}")
print(f"{len(records) - len(writes)} other record(s): reads or other resources")
