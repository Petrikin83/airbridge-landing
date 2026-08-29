"""Force-copy ALL files from the user's exact folders — AS IS, no sorting.

Reads every image file physically present in each folder and reports them.
Files are used exactly as they are (no filename-based re-routing).
"""
import json
import os

ROOT = r"D:\Airbridge_NEW_DeepSeek"
SOL = os.path.join(ROOT, "assets", "images", "solutions")

# exact user folders (source == published web folder)
FOLDERS = {
    "passenger-material": "passengers_material",
    "cable": "cable_cranes",
}

IMAGE_EXT = (".jpg", ".jpeg", ".png", ".webp")


def main() -> None:
    js = {}
    print("=== FORCE USER FOLDERS (AS-IS) ===")
    for key, folder in FOLDERS.items():
        d = os.path.join(SOL, folder)
        if not os.path.isdir(d):
            print(f"[warn] folder missing: {d}")
            js[key] = []
            continue
        files = sorted(
            f for f in os.listdir(d)
            if os.path.isfile(os.path.join(d, f)) and f.lower().endswith(IMAGE_EXT)
        )
        print(f"\n[{folder}]  ({len(files)} files)")
        paths = []
        for f in files:
            fp = os.path.join(d, f)
            print(f"   - {f}  ({os.path.getsize(fp) // 1024} KB)")
            paths.append(f"assets/images/solutions/{folder}/{f}")
        js[key] = paths

    print("\n=== SOLUTION_IMAGES (ALL files, as-is) ===")
    print(json.dumps(js, indent=2))


if __name__ == "__main__":
    main()
