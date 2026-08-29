"""Rename .png files (containing JPEG content) to .jpg and update main.js paths."""
import os

ROOT = r"D:\Airbridge_NEW_DeepSeek"
SOL = os.path.join(ROOT, "assets", "images", "solutions")
MAIN_JS = os.path.join(ROOT, "assets", "js", "main.js")


def main() -> None:
    renames = []
    for dirpath, _dirs, files in os.walk(SOL):
        for f in files:
            if f.lower().endswith(".png"):
                old_path = os.path.join(dirpath, f)
                new_name = f[:-4] + ".jpg"
                new_path = os.path.join(dirpath, new_name)
                if os.path.exists(new_path):
                    print(f"[skip] target already exists: {new_name}")
                    continue
                os.rename(old_path, new_path)
                renames.append((f, new_name))
                print(f"renamed: {f} -> {new_name}")

    if renames:
        with open(MAIN_JS, encoding="utf-8") as fh:
            js = fh.read()
        for old, new in renames:
            js = js.replace(old, new)
        with open(MAIN_JS, "w", encoding="utf-8") as fh:
            fh.write(js)
        print(f"\nUpdated {len(renames)} paths in main.js")
    else:
        print("No .png files to rename.")


if __name__ == "__main__":
    main()
