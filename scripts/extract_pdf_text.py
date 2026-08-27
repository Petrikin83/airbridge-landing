"""Extract text from client PDF presentations into airbridge_materials/texts/."""
import os
import sys

import fitz  # PyMuPDF

BASE = r"D:\Airbridge_NEW_DeepSeek"
PRES = os.path.join(BASE, "airbridge_materials", "presentations")
TEXTS = os.path.join(BASE, "airbridge_materials", "texts")


def extract(pdf_path: str) -> str:
    doc = fitz.open(pdf_path)
    parts = []
    for i, page in enumerate(doc, start=1):
        parts.append(f"\n\n===== SLIDE {i} =====\n")
        parts.append(page.get_text("text"))
    doc.close()
    return "".join(parts)


def main():
    for name in os.listdir(PRES):
        if not name.lower().endswith(".pdf"):
            continue
        pdf_path = os.path.join(PRES, name)
        out_name = os.path.splitext(name)[0] + ".txt"
        out_path = os.path.join(TEXTS, out_name)
        try:
            text = extract(pdf_path)
        except Exception as e:  # noqa: BLE001
            text = f"[ERROR extracting {name}]: {e}"
        with open(out_path, "w", encoding="utf-8") as fh:
            fh.write(text)
        print(f"WROTE {out_path} ({len(text)} chars)")


if __name__ == "__main__":
    main()
