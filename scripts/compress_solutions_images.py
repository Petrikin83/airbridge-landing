"""Compress slider images in assets/images/solutions/ to web-friendly weight.

Walks all image files, flattens alpha, resizes to max 1920px and re-encodes
as JPEG (quality 82) while KEEPING the original filename so main.js does not
need to change.
"""
import os

from PIL import Image

ROOT = r"D:\Airbridge_NEW_DeepSeek"
SOL = os.path.join(ROOT, "assets", "images", "solutions")
MAX_DIM = 1920
QUALITY = 82
IMAGE_EXT = (".jpg", ".jpeg", ".png", ".webp")


def compress(src: str) -> tuple[int, int]:
    before = os.path.getsize(src)
    with Image.open(src) as im:
        im.load()
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
            s = MAX_DIM / longest
            im = im.resize((max(1, int(w * s)), max(1, int(h * s))), Image.LANCZOS)

        tmp = src + ".tmp"
        im.save(tmp, "JPEG", quality=QUALITY, optimize=True, progressive=True)
    os.replace(tmp, src)
    after = os.path.getsize(src)
    return before, after


def main() -> None:
    total_before = 0
    total_after = 0
    count = 0
    for dirpath, _dirs, files in os.walk(SOL):
        for f in sorted(files):
            if not f.lower().endswith(IMAGE_EXT):
                continue
            fp = os.path.join(dirpath, f)
            before, after = compress(fp)
            total_before += before
            total_after += after
            count += 1
            print(f"{f}: {before // 1024} KB -> {after // 1024} KB")
    print(f"\nFiles: {count}")
    print(f"Total: {total_before / 1_000_000:.2f} MB -> {total_after / 1_000_000:.2f} MB")


if __name__ == "__main__":
    main()
