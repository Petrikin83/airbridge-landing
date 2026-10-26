"""Extract visible text from key CDC HTML pages into airbridge_materials/texts/.

The CDC reference site is READ-ONLY. Override its location with the CDC_SITE
environment variable (default: D:\\Clone_CDC\\site).

Run: python scripts/extract_html_text.py
Exit code: 0 on success, 2 when the CDC site folder is missing.
"""
import os
import re
import sys

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from _lib import enable_utf8, path, read_text, rel, write_text  # noqa: E402

from bs4 import BeautifulSoup  # noqa: E402

BASE = os.environ.get("CDC_SITE", r"D:\Clone_CDC\site")
OUT = path("airbridge_materials", "texts")

PAGES = {
    "innovation": "innovation/index.html",
    "passenger-ropeways": "passenger-ropeways/index.html",
    "material-ropeways": "material-ropeways/index.html",
    "cable-cranes": "cable-cranes/index.html",
    "home": "index.html",
}


def visible_text(html: str) -> str:
    soup = BeautifulSoup(html, "lxml")
    for tag in soup(["script", "style", "noscript", "link", "meta", "svg"]):
        tag.decompose()
    text = soup.get_text("\n")
    lines = [line.strip() for line in text.splitlines() if line.strip()]
    out = []
    for line in lines:
        if re.fullmatch(r"[^A-Za-z0-9]{1,3}", line):
            continue
        out.append(line)
    return "\n".join(out)


def main():
    enable_utf8()
    if not os.path.isdir(BASE):
        print("CDC site folder not found: " + BASE)
        return 2

    for name, page in PAGES.items():
        source = os.path.join(BASE, page)
        if not os.path.exists(source):
            print("MISSING " + source)
            continue
        text = visible_text(read_text(source))
        out_path = os.path.join(OUT, "cdc-%s.txt" % name)
        write_text(out_path, text)
        print("WROTE %s (%d chars)" % (rel(out_path), len(text)))
    return 0


if __name__ == "__main__":
    sys.exit(main())
