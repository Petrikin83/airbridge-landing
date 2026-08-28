"""Strict physical sync of slider images from the user's exact source folders.

Source of truth (user disk paths):
  1) D:\\Airbridge_NEW_DeepSeek\\assets\\images\\solutions\\passenger & material ropeways
  2) D:\\Airbridge_NEW_DeepSeek\\assets\\images\\solutions\\cable_cranes

The source folders are re-organized into two clean web directories that are
published with the site:
  - assets/images/solutions/passengers_material/   (passenger + material frames ONLY)
  - assets/images/solutions/cable_cranes/          (cable crane frames ONLY)

Routing is by content (filename semantics) because the source folders were
cross-contaminated (material frames were found inside the cable folder, etc.).
Any final frame that is missing from the source folders falls back to the
already-committed web copy in assets/images/.
"""
import os
import shutil
import zipfile

from PIL import Image

ROOT = r"D:\Airbridge_NEW_DeepSeek"
SOL = os.path.join(ROOT, "assets", "images", "solutions")
IMG = os.path.join(ROOT, "assets", "images")
STAGE = os.path.join(ROOT, "scripts", "_staging")

SOURCE_DIRS = [
    os.path.join(SOL, "passenger & material ropeways"),
    os.path.join(SOL, "cable_cranes"),
]

# (category_key, source_filename, final_web_filename)
ROUTING = [
    ("passenger-material", "airbridge-passenger-1.jpg", "airbridge-passenger-1.jpg"),
    ("passenger-material", "airbridge-passenger-3.jpg", "airbridge-passenger-3.jpg"),
    ("passenger-material", "airbridge-material-4.jpg", "airbridge-material-4.jpg"),
    ("passenger-material", "airbridge-material-2.png", "airbridge-material-2.jpg"),
    ("passenger-material", "airbridge-material-3.png", "airbridge-material-3.jpg"),
    ("passenger-material", "material-hero-module-mountain.jpg", "material-hero-module-mountain.jpg"),
    ("cable", "airbridge-cable-2.jpg", "airbridge-cable-2.jpg"),
    ("cable", "airbridge-cable-1.png", "airbridge-cable-1.jpg"),
    ("cable", "airbridge-cable-3.jpg", "airbridge-cable-3.jpg"),
    ("cable", "cdc-airbridge-cablecranes.jpeg", "cable-airbridge.jpg"),
]

DEST_DIR = {
    "passenger-material": os.path.join(SOL, "passengers_material"),
    "cable": os.path.join(SOL, "cable_cranes"),
}


def optimize(src: str, dst: str, max_dim: int = 1600, quality: int = 82) -> None:
    im = Image.open(src)
    if im.mode in ("RGBA", "LA", "P"):
        im = im.convert("RGBA")
        bg = Image.new("RGB", im.size, (255, 255, 255))
        bg.paste(im, mask=im.split()[-1])
        im = bg
    else:
        im = im.convert("RGB")
    w, h = im.size
    longest = max(w, h)
    if longest > max_dim:
        s = max_dim / longest
        im = im.resize((max(1, int(w * s)), max(1, int(h * s))), Image.LANCZOS)
    im.save(dst, "JPEG", quality=quality, optimize=True, progressive=True)


def find_source(filename: str):
    for base in SOURCE_DIRS:
        p = os.path.join(base, filename)
        if os.path.isfile(p):
            return p
    return None


def main() -> None:
    # 0) Extract any stray zips still present (so their files are visible).
    for base in SOURCE_DIRS:
        if not os.path.isdir(base):
            continue
        for name in os.listdir(base):
            if name.lower().endswith(".zip"):
                with zipfile.ZipFile(os.path.join(base, name)) as z:
                    z.extractall(base)

    # 1) Stage the final web files (from source folders first, else fallback).
    if os.path.isdir(STAGE):
        shutil.rmtree(STAGE)
    os.makedirs(STAGE, exist_ok=True)

    js = {"passenger-material": [], "cable": []}
    print("=== SYNC ===")
    for key, src_name, web_name in ROUTING:
        src = find_source(src_name)
        staged = os.path.join(STAGE, web_name)
        if src is not None:
            optimize(src, staged)
            print(f"[from source] {src_name} -> {key}/{web_name}")
        else:
            fallback = os.path.join(IMG, web_name)
            if os.path.isfile(fallback):
                shutil.copy2(fallback, staged)
                print(f"[fallback]   {web_name} (not found in source folders, used committed copy)")
            else:
                print(f"[warn]       {web_name} — no source and no fallback!")
                continue
        js[key].append("assets/images/solutions/" + os.path.basename(DEST_DIR[key]) + "/" + web_name)

    # 2) Clear the whole solutions/ tree, then recreate the two clean dirs.
    for name in os.listdir(SOL):
        shutil.rmtree(os.path.join(SOL, name))
    for key, d in DEST_DIR.items():
        os.makedirs(d, exist_ok=True)

    # 3) Move staged files into the clean dirs.
    for key, items in js.items():
        for path in items:
            src = os.path.join(STAGE, os.path.basename(path))
            dst = os.path.join(DEST_DIR[key], os.path.basename(path))
            shutil.move(src, dst)

    shutil.rmtree(STAGE, ignore_errors=True)

    # 4) Report + safety check.
    print("\n=== RESULT DIRS ===")
    for key, d in DEST_DIR.items():
        files = sorted(os.listdir(d))
        print(f"[{key}] {d}  ({len(files)} files)")
        for f in files:
            print("   -", f)

    print("\n=== SOLUTION_IMAGES ===")
    import json
    print(json.dumps(js, indent=2))

    crane_leak = [p for p in js["passenger-material"] if "cable" in p or "crane" in p]
    passenger_leak = [p for p in js["cable"] if "passenger" in p or "material" in p]
    print("\n=== SAFETY CHECK ===")
    print("crane leakage into passenger-material:", crane_leak or "NONE")
    print("passenger/material leakage into cable:", passenger_leak or "NONE")


if __name__ == "__main__":
    main()
