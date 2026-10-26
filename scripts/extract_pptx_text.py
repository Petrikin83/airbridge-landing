"""Extract text from client PPTX presentations into airbridge_materials/texts/.

PPTX is a ZIP container: slide text lives in `ppt/slides/slideN.xml` as <a:t> runs.
The extracted .txt files become fact-check sources for scripts/fact_index.py.

Source folder: Materials from Galiya/ (raw client drop, gitignored).

Run: python scripts/extract_pptx_text.py
Exit code: 0 on success, 2 when the source folder is missing.
"""
import html
import os
import re
import sys
import zipfile

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from _lib import enable_utf8, path, rel, write_text  # noqa: E402

SRC = path("Materials from Galiya")
TEXTS = path("airbridge_materials", "texts")

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
    enable_utf8()
    if not os.path.isdir(SRC):
        print("Source folder not found: " + rel(SRC))
        return 2

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
        write_text(out_path, text)
        print("WROTE %s (%d chars)" % (rel(out_path), len(text)))
    return 0


if __name__ == "__main__":
    sys.exit(main())
