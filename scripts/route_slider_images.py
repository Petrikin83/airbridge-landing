"""Strict slider image routing for the AirBridge landing page.

Scans the two source folders under assets/images/solutions/, extracts any
.zip archives, and verifies that the final web-optimized images are present in
assets/images/. Prints the SOLUTION_IMAGES array for assets/js/main.js.

Category separation is by content (filename semantics):
  - passenger & material ropeways -> passenger + material frames (NO cranes)
  - cable_cranes                 -> cable crane frames only
"""
import json
import os
import zipfile

from PIL import Image

ROOT = r"D:\Airbridge_NEW_DeepSeek"
SOL = os.path.join(ROOT, "assets", "images", "solutions")
IMG = os.path.join(ROOT, "assets", "images")

# Final routing: (source filename inside solutions/, final web filename in assets/images/)
ROUTING = {
    "passenger & material ropeways": [
        ("airbridge-passenger-1.jpg", "airbridge-passenger-1.jpg"),
        ("airbridge-passenger-3.jpg", "airbridge-passenger-3.jpg"),
        ("airbridge-material-4.jpg", "airbridge-material-4.jpg"),
        ("airbridge-material-2.png", "airbridge-material-2.jpg"),
        ("airbridge-material-3.png", "airbridge-material-3.jpg"),
        ("material-hero-module-mountain.jpg", "material-hero-module-mountain.jpg"),
    ],
    "cable_cranes": [
        ("airbridge-cable-2.jpg", "airbridge-cable-2.jpg"),
        ("airbridge-cable-1.png", "airbridge-cable-1.jpg"),
        ("airbridge-cable-3.jpg", "airbridge-cable-3.jpg"),
        ("cdc-airbridge-cablecranes.jpeg", "cable-airbridge.jpg"),
    ],
}

KEY_MAP = {"passenger & material ropeways": "passenger-material", "cable_cranes": "cable"}


def find_source(filename: str) -> str | None:
    """Recursively find a source file by name inside the solutions tree."""
    for dirpath, _dirs, files in os.walk(SOL):
        for f in files:
            if f == filename:
                return os.path.join(dirpath, f)
    return None


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


def main() -> None:
    # 1) Extract zips inside source folders.
    for folder in sorted(os.listdir(SOL)):
        fpath = os.path.join(SOL, folder)
        if not os.path.isdir(fpath):
            continue
        for name in os.listdir(fpath):
            if name.lower().endswith(".zip"):
                with zipfile.ZipFile(os.path.join(fpath, name)) as z:
                    z.extractall(fpath)
                print(f"[zip] extracted -> {folder}")

    # 2) Report source folders.
    print("\n=== SOURCE FOLDERS ===")
    for folder in sorted(os.listdir(SOL)):
        fpath = os.path.join(SOL, folder)
        if not os.path.isdir(fpath):
            continue
        files = [f for f in os.listdir(fpath) if not f.lower().endswith(".zip")]
        print(f"\n[{folder}] ({len(files)} media files)")
        for f in sorted(files):
            print("   -", f)

    # 3) Route + ensure optimized copies.
    print("\n=== ROUTING ===")
    js = {"passenger-material": [], "cable": []}
    for folder, items in ROUTING.items():
        for src_name, dst_name in items:
            src = find_source(src_name)
            dst = os.path.join(IMG, dst_name)
            if os.path.exists(dst):
                print(f"[ok]   {dst_name}  ({os.path.getsize(dst) // 1024} KB)")
                js[KEY_MAP[folder]].append("assets/images/" + dst_name)
            elif src is not None:
                optimize(src, dst)
                print(f"[copy] {src_name} -> {dst_name}  ({os.path.getsize(dst) // 1024} KB)")
                js[KEY_MAP[folder]].append("assets/images/" + dst_name)
            else:
                print(f"[warn] web copy + source missing: {src_name}")

    print("\n=== SOLUTION_IMAGES ===")
    print(json.dumps(js, indent=2))

    crane_leak = [p for p in js["passenger-material"] if "cable" in p or "crane" in p]
    passenger_leak = [p for p in js["cable"] if "passenger" in p or "material" in p]
    print("\n=== SAFETY CHECK ===")
    print("crane leakage into passenger-material:", crane_leak or "NONE")
    print("passenger/material leakage into cable:", passenger_leak or "NONE")


if __name__ == "__main__":
    main()
