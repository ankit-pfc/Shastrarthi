#!/usr/bin/env python3
"""
Extract URLs from extract-data-2026-02-12.csv and download each unique URL
into seed-data/downloads/. Run from the seed-data directory:
  cd shastrarthi/seed-data && python3 download_from_csv.py

If you see SSL certificate errors (common on macOS), run:
  SKIP_SSL_VERIFY=1 python3 download_from_csv.py
"""
import csv
import os
import re
import ssl
import urllib.request

IN = "extract-data-2026-02-12.csv"
OUT = "downloads"
url_re = re.compile(r"https?://[^\s,\"]+")
seen = set()

# Optional: skip SSL verification when system certs fail (e.g. macOS)
if os.environ.get("SKIP_SSL_VERIFY"):
    ctx = ssl.create_default_context()
    ctx.check_hostname = False
    ctx.verify_mode = ssl.CERT_NONE
    urllib.request.install_opener(
        urllib.request.build_opener(urllib.request.HTTPSHandler(context=ctx))
    )

os.makedirs(OUT, exist_ok=True)

with open(IN, newline="", encoding="utf-8", errors="ignore") as f:
    for row in csv.DictReader(f):
        for k, v in row.items():
            if not v:
                continue
            for url in url_re.findall(v):
                if url in seen:
                    continue
                seen.add(url)
                fn = url.split("/")[-1] or "download"
                fn = re.sub(r"[^A-Za-z0-9._-]+", "_", fn)[:180]
                path = os.path.join(OUT, fn)
                print("GET", url, "->", path)
                try:
                    urllib.request.urlretrieve(url, path)
                except Exception as e:
                    print("  ERROR:", e)
