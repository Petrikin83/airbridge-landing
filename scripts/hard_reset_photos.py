"""Hard reset slider photos from the user's exact local Windows folders.

Deletes the current project slider folders, recreates them empty, then copies
ALL image files directly (as-is — no optimization, no content sorting) from:
  - C:\\Users\\Артем\\Downloads\\solutions\\passenger material ropeways
  - C:\\Users\\Артем\\Downloads\\solutions\\cable_cranes
"""
import json
import os
import shutil

ROOT = r"D:\Airbridge_NEW_DeepSeek"
DEST_BASE = os.path.join(ROOT, "assets", "images", "solutions")

# (source_dir, dest_dir)
SOURCES = {
    "passenger-material": (
        r"C:\Users\Артем\Downloads\solutions\passenger material ropeways",
        os.path.join(DEST_BASE, "passengers_material"),
    ),
    "cable": (
        r"C:\Users\Артем\Downloads\solutions\cable_cranes",
        os.path.join(DEST_BASE, "cable_cranes"),
    ),
}

IMAGE_EXT = (".jpg", ".jpeg", ".png", ".webp")


def main() -> None:
    js = {}
    for key, (src_dir, dest_dir) in SOURCES.items():
        print(f"\n=== [{key}] ===")
        print(f"source: {src_dir}")
        print(f"dest:   {dest_dir}")

        # 1) delete old folder
        if os.path.isdir(dest_dir):
            shutil.rmtree(dest_dir)
            print("  -> deleted old dest folder")

        # 2) recreate empty
        os.makedirs(dest_dir, exist_ok=True)

        # 3) copy ALL image files directly (skip desktop.ini / non-images)
        files = sorted(
            f for f in os.listdir(src_dir)
            if os.path.isfile(os.path.join(src_dir, f)) and f.lower().endswith(IMAGE_EXT)
        )
        paths = []
        for f in files:
            shutil.copy2(os.path.join(src_dir, f), os.path.join(dest_dir, f))
            print(f"  COPIED  {f}  ({os.path.getsize(os.path.join(dest_dir, f)) // 1024} KB)")
            paths.append(f"assets/images/solutions/{os.path.basename(dest_dir)}/{f}")
        js[key] = paths

    print("\n=== SOLUTION_IMAGES (paste into main.js) ===")
    print(json.dumps(js, indent=2))


if __name__ == "__main__":
    main()
