"""Extract text from client PDF presentations into airbridge_materials/texts/.

PDF source is looked up in:
  1. airbridge_materials/presentations/  (curated copies)
  2. Materials from Galiya/              (raw client drop, gitignored)

Run: python scripts/extract_pdf_text.py
Exit code: 0 on success, 2 when no PDF source folder is available.
"""
import os
import sys

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from _lib import enable_utf8, path, rel, write_text  # noqa: E402

import fitz  # PyMuPDF  # noqa: E402

CANDIDATES = (
    path("airbridge_materials", "presentations"),
    path("Materials from Galiya"),
)
TEXTS = path("airbridge_materials", "texts")


def find_source_dir():
    """First existing folder that actually contains PDF files."""
    for candidate in CANDIDATES:
        if os.path.isdir(candidate) and any(n.lower().endswith(".pdf") for n in os.listdir(candidate)):
            return candidate
    return None


def extract(pdf_path):
    doc = fitz.open(pdf_path)
    parts = []
    for number, page in enumerate(doc, start=1):
        parts.append("\n\n===== SLIDE %d =====\n" % number)
        parts.append(page.get_text("text"))
    doc.close()
    return "".join(parts)


def main():
    enable_utf8()
    source = find_source_dir()
    if source is None:
        print("No PDF source folder found (checked: %s)" % ", ".join(rel(item) for item in CANDIDATES))
        return 2

    for name in sorted(os.listdir(source)):
        if not name.lower().endswith(".pdf"):
            continue
        pdf_path = os.path.join(source, name)
        out_path = os.path.join(TEXTS, os.path.splitext(name)[0] + ".txt")
        try:
            text = extract(pdf_path)
        except Exception as exc:  # noqa: BLE001
            text = "[ERROR extracting %s]: %s" % (name, exc)
        write_text(out_path, text)
        print("WROTE %s (%d chars)" % (rel(out_path), len(text)))
    return 0


if __name__ == "__main__":
    sys.exit(main())
