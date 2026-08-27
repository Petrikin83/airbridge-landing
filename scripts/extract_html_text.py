"""Extract visible text from key CDC HTML pages into airbridge_materials/texts/."""
import os
import re

from bs4 import BeautifulSoup

BASE = r"D:\Clone_CDC\site"
OUT = r"D:\Airbridge_NEW_DeepSeek\airbridge_materials\texts"

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
    lines = [ln.strip() for ln in text.splitlines() if ln.strip()]
    # collapse repeated blank lines and remove lone punctuation lines
    out = []
    for ln in lines:
        if re.fullmatch(r"[^A-Za-z0-9]{1,3}", ln):
            continue
        out.append(ln)
    return "\n".join(out)


def main():
    for name, rel in PAGES.items():
        path = os.path.join(BASE, rel)
        if not os.path.exists(path):
            print(f"MISSING {path}")
            continue
        with open(path, "r", encoding="utf-8") as fh:
            html = fh.read()
        text = visible_text(html)
        out_path = os.path.join(OUT, f"cdc-{name}.txt")
        with open(out_path, "w", encoding="utf-8") as fh:
            fh.write(text)
        print(f"WROTE {out_path} ({len(text)} chars)")


if __name__ == "__main__":
    main()
