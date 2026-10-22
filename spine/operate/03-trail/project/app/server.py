"""The order API: product pages, read from the catalog bucket."""
import json
import os
import signal
import threading
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer

import boto3

BUCKET = os.environ.get("CATALOG_BUCKET", "shop-catalog-111122223333")
s3 = boto3.client("s3")


class OrderApi(BaseHTTPRequestHandler):
    def do_GET(self):
        if self.path == "/health":
            return self.reply(200, {"status": "ok"})
        if self.path.startswith("/products/"):
            key = "products/" + self.path.removeprefix("/products/") + ".json"
            try:
                product = s3.get_object(Bucket=BUCKET, Key=key)["Body"].read()
            except s3.exceptions.NoSuchKey:
                return self.reply(404, {"error": "no such product"})
            return self.reply(200, json.loads(product))
        self.reply(404, {"error": "not found"})

    def reply(self, status, doc):
        body = json.dumps(doc).encode()
        self.send_response(status)
        self.send_header("Content-Type", "application/json")
        self.send_header("Content-Length", str(len(body)))
        self.end_headers()
        self.wfile.write(body)


def stop(signum, frame):
    print("SIGTERM: no new requests; finishing those in flight", flush=True)
    threading.Thread(target=server.shutdown).start()


if __name__ == "__main__":
    server = ThreadingHTTPServer(("", 8080), OrderApi)
    signal.signal(signal.SIGTERM, stop)
    print("order API listening on :8080", flush=True)
    server.serve_forever()
    server.server_close()  # waits for request threads to finish
    print("stopped cleanly", flush=True)
