"""Extract authentic AirBridge® imagery from client presentations (PPTX + PDF).

- PPTX: unzips `ppt/media/*` (raster images).
- PDF : PyMuPDF embedded images.
- Deduplicates by SHA-256 and reports dimensions (via Pillow).
"""
import os
import zipfile
import hashlib

import fitz
from PIL import Image

SRC = r"D:\Airbridge_NEW_DeepSeek\Materials from Galiya"
OUT = r"D:\Airbridge_NEW_DeepSeek\scripts\_extract"
os.makedirs(OUT, exist_ok=True)

seen = {}  # hash -> (path, w, h)


def save(data: bytes, ext: str, prefix: str):
    if ext in ("jpeg",):
        ext = "jpg"
    h = hashlib.sha256(data).hexdigest()[:12]
    if h in seen:
        return
    fn = f"{prefix}_{h}.{ext}"
    path = os.path.join(OUT, fn)
    with open(path, "wb") as fh:
        fh.write(data)
    try:
        with Image.open(path) as im:
            w, hh = im.size
    except Exception:
        w, hh = 0, 0
    seen[h] = (path, w, hh)


# --- PPTX ---
pptx = os.path.join(SRC, "AirBridge by CDC - V7.pptx")
with zipfile.ZipFile(pptx) as z:
    for name in z.namelist():
        if name.startswith("ppt/media/") and not name.endswith("/"):
            data = z.read(name)
            ext = os.path.splitext(name)[1].lstrip(".").lower()
            if ext in ("jpg", "jpeg", "png", "gif", "bmp", "webp", "tif", "tiff"):
                save(data, ext, "pptx")

# --- PDFs ---
for fn in ["CDC Red Sea Global- V5.pdf", "Discovery Land Company V5.pdf"]:
    pdf = os.path.join(SRC, fn)
    doc = fitz.open(pdf)
    tag = "".join(c for c in fn if c.isalnum())[:10]
    for pno in range(len(doc)):
        for img in doc.get_page_images(pno):
            xref = img[0]
            info = doc.extract_image(xref)
            save(info["image"], info["ext"], f"pdf{tag}{pno:02d}")
    doc.close()

print("TOTAL:", len(seen))
print("=" * 70)
for h, (path, w, hh) in sorted(seen.items(), key=lambda kv: -(kv[1][1] * kv[1][2])):
    name = os.path.basename(path)
    size = os.path.getsize(path)
    print(f"{name:45s} {w:>5}x{hh:<5} {size:>9} bytes")
