"""A password rotation, and the server that cached the old one.
The database is a stand-in dict; the secret is the emulator's."""
import boto3

sm = boto3.client("secretsmanager")
sm.create_secret(Name="orders-db-app", SecretString="pw-v1")
database = {"password": "pw-v1"}                      # what PostgreSQL accepts


def connect(at: str, password: str) -> bool:
    ok = password == database["password"]
    print(f"{at}  connect with {password}: {'ok' if ok else 'auth failed'}")
    return ok


cached = sm.get_secret_value(SecretId="orders-db-app")["SecretString"]
connect("09:00", cached)                              # read once, at start-up

sm.put_secret_value(SecretId="orders-db-app", SecretString="pw-v2")
database["password"] = "pw-v2"                        # 09:30: rotation runs
print("09:30  rotated; AWSCURRENT is now pw-v2")

if not connect("09:30", cached):                      # the cached copy fails
    cached = sm.get_secret_value(SecretId="orders-db-app")["SecretString"]
    connect("09:31", cached)                          # re-read on auth failure
