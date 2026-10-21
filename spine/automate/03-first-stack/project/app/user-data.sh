#!/bin/bash
# Runs once, as root, on a new app server's first boot.
set -euo pipefail
RELEASE=order-api-1.4.2

dnf -y install python3-pip
pip3 install boto3==1.43.117
aws s3 cp "s3://shop-releases-111122223333/$RELEASE.tar.gz" /tmp/
mkdir -p /opt/order-api && tar -xzf "/tmp/$RELEASE.tar.gz" -C /opt/order-api
useradd --system order-api

cat > /etc/systemd/system/order-api.service <<'UNIT'
[Service]
User=order-api
ExecStart=/usr/bin/python3 /opt/order-api/app/server.py
Restart=always
[Install]
WantedBy=multi-user.target
UNIT
systemctl enable --now order-api
