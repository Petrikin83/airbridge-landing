"""Extract text from client PPTX presentations into airbridge_materials/texts/.

PPTX is a ZIP container: slide text lives in `ppt/slides/slideN.xml` as <a:t> runs.
The extracted .txt files become fact-check sources for scripts/fact_index.py.
"""
import html
import os
import re
import sys
import zipfile

BASE = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SRC = os.path.join(BASE, "Materials from Galiya")
TEXTS = os.path.join(BASE, "airbridge_materials", "texts")

SLIDE_RE = re.compile(r"ppt/slides/slide(\d+)\.xml$")
TEXT_RE = re.compile(r"<a:t>(.*?)</a:t>", re.DOTALL)


def slide_text(zf: zipfile.ZipFile, name: str) -> str:
    xml = zf.read(name).decode("utf-8", "ignore")
    runs = [html.unescape(t).strip() for t in TEXT_RE.findall(xml)]
    return "\n".join(run for run in runs if run)


def extract(pptx_path: str) -> str:
    with zipfile.ZipFile(pptx_path) as zf:
        slides = []
        for name in zf.namelist():
            match = SLIDE_RE.match(name)
            if match:
                slides.append((int(match.group(1)), name))
        parts = []
        for number, name in sorted(slides):
            parts.append("\n\n===== SLIDE %d =====\n" % number)
            parts.append(slide_text(zf, name))
    return "".join(parts)


def main():
    if hasattr(sys.stdout, "reconfigure"):
        sys.stdout.reconfigure(encoding="utf-8", errors="replace")

    if not os.path.isdir(SRC):
        sys.exit("Source folder not found: " + SRC)
    os.makedirs(TEXTS, exist_ok=True)

    for name in sorted(os.listdir(SRC)):
        if not name.lower().endswith(".pptx"):
            continue
        pptx_path = os.path.join(SRC, name)
        out_path = os.path.join(TEXTS, os.path.splitext(name)[0] + ".txt")
        try:
            text = extract(pptx_path)
        except Exception as exc:  # noqa: BLE001
            text = "[ERROR extracting %s]: %s" % (name, exc)
        with open(out_path, "w", encoding="utf-8") as fh:
            fh.write(text)
        print("WROTE %s (%d chars)" % (os.path.relpath(out_path, BASE), len(text)))


if __name__ == "__main__":
    main()
