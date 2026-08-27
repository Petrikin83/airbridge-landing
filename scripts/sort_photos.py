"""Sort AirBridge® imagery into 3 thematic solution folders.

- Copies the authentic tracked-module frames (airbridge-*.jpg/png) by category.
- Copies original CDC solution photos (from Clone_CDC uploads) by filename pattern,
  skipping WordPress resized variants (-WxH) and decorative/non-solution assets.
"""
import os
import re
import shutil

SOL = r"D:\Airbridge_NEW_DeepSeek\assets\images\solutions"
IMG = r"D:\Airbridge_NEW_DeepSeek\assets\images"
UP = r"D:\Clone_CDC\site\wp-content\uploads"

# 1) Authentic PPTX frames (AirBridge by CDC - V7.pptx), by solution
PPTX = {
    "passenger_ropeways": [
        "airbridge-passenger-1.jpg",
        "airbridge-passenger-2.jpg",
        "airbridge-passenger-3.jpg",
        "airbridge-passenger-4.jpg",
    ],
    "material_ropeways": [
        "airbridge-material-1.png",
        "airbridge-material-2.png",
        "airbridge-material-3.png",
        "airbridge-material-4.jpg",
    ],
    "cable_cranes": [
        "airbridge-cable-1.png",
        "airbridge-cable-2.jpg",
        "airbridge-cable-3.jpg",
        "airbridge-cable-4.jpg",
        "airbridge-cable-5.jpg",
    ],
}

for folder, files in PPTX.items():
    for f in files:
        src = os.path.join(IMG, f)
        if os.path.exists(src):
            shutil.copy(src, os.path.join(SOL, folder, f))
            print(f"PPTX -> {folder}/{f}")

# 2) CDC solution originals (full-size, skip -WxH resized)
PATTERNS = {
    "passenger_ropeways": re.compile(r"(passenger|ropways)", re.I),
    "material_ropeways": re.compile(r"material-ropeways", re.I),
    "cable_cranes": re.compile(r"(cablecrane|cable-crane|cable-cranes|airbridge-cablecranes)", re.I),
}
RESIZE = re.compile(r"-\d+x\d+\.(png|jpe?g|avif|webp)$", re.I)
EXT = (".png", ".jpg", ".jpeg", ".avif", ".webp")

seen = set()
for root, _dirs, files in os.walk(UP):
    for name in files:
        if not name.lower().endswith(EXT):
            continue
        if RESIZE.search(name):
            continue
        for folder, pat in PATTERNS.items():
            if pat.search(name):
                src = os.path.join(root, name)
                key = name.lower() + "|" + str(os.path.getsize(src))
                if key in seen:
                    continue
                seen.add(key)
                shutil.copy(src, os.path.join(SOL, folder, name))
                print(f"CDC  -> {folder}/{name}")
                break

# 3) Report
print("\n===== RESULT =====")
for folder in sorted(os.listdir(SOL)):
    path = os.path.join(SOL, folder)
    files = sorted(os.listdir(path))
    print(f"\n[{folder}] ({len(files)} files)")
    for f in files:
        print(f"  {f}  ({os.path.getsize(os.path.join(path, f))} bytes)")
