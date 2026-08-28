"""Finalize curated solution photos: normalize names, optimize, place into assets/images/."""
import os

from PIL import Image

SOL = r"D:\Airbridge_NEW_DeepSeek\assets\images\solutions"
IMG = r"D:\Airbridge_NEW_DeepSeek\assets\images"
MAX_DIM = 1600
QUALITY = 82

# (source_rel_path_in_solutions, dest_name_in_assets_images) — order defines slider order
MAPPING = {
    "passenger_ropeways": [
        ("airbridge-passenger-1.jpg", "airbridge-passenger-1.jpg"),
        ("airbridge-passenger-3.jpg", "airbridge-passenger-3.jpg"),
        ("render-passenger-harbor.jpg", "passenger-render-harbor.jpg"),
        ("render-passenger-river.jpg", "passenger-render-river.jpg"),
        ("render-passenger-sunset.jpg", "passenger-render-sunset.jpg"),
    ],
    "material_ropeways": [
        ("airbridge-material-4.jpg", "airbridge-material-4.jpg"),
        ("airbridge-material-2.png", "airbridge-material-2.jpg"),
        ("airbridge-material-3.png", "airbridge-material-3.jpg"),
        ("material-hero-module-mountain.jpg", "material-hero-module-mountain.jpg"),
        ("2 cam.jpg", "material-cam.jpg"),
        ("ChatGPT Image 20 de ago. de 2026, 12_26_48.png", "material-render-ai.jpg"),
        ("crane-desert-tower.jpg", "material-crane-desert.jpg"),
        ("material-ropeways-cdc-4.jpeg", "material-ropeways-cdc-4.jpg"),
    ],
    "cable_cranes": [
        ("airbridge-cable-2.jpg", "airbridge-cable-2.jpg"),
        ("airbridge-cable-1.png", "airbridge-cable-1.jpg"),
        ("airbridge-cable-3.jpg", "airbridge-cable-3.jpg"),
        ("Cable-Crane-1.jpg", "cable-crane-1.jpg"),
        ("cdc-airbridge-cablecranes.jpeg", "cable-airbridge.jpg"),
        ("cdc-cablecrane-15.png", "cable-crane-15.jpg"),
        ("cdc-cablecrane-16.png", "cable-crane-16.jpg"),
        ("cdc-cablecranes.jpg", "cable-cranes.jpg"),
    ],
}


def optimize(src: str, dst: str) -> None:
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
    if longest > MAX_DIM:
        scale = MAX_DIM / longest
        im = im.resize((max(1, int(w * scale)), max(1, int(h * scale))), Image.LANCZOS)

    im.save(dst, "JPEG", quality=QUALITY, optimize=True, progressive=True)


def main():
    report = {}
    for folder, items in MAPPING.items():
        report[folder] = []
        for src_rel, dst_name in items:
            src = os.path.join(SOL, folder, src_rel)
            dst = os.path.join(IMG, dst_name)
            if not os.path.exists(src):
                print(f"MISSING: {src}")
                continue
            optimize(src, dst)
            size = os.path.getsize(dst)
            report[folder].append((dst_name, size))
            print(f"OK {folder}/{src_rel} -> {dst_name} ({size // 1024} KB)")

    print("\n===== FINAL LISTS (JSON-ish) =====")
    import json
    print(json.dumps({k: [n for n, _ in v] for k, v in report.items()}, indent=2))


if __name__ == "__main__":
    main()
