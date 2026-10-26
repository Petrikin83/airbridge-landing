"""Asset optimisation used for the mobile performance pass.

- airbridge-module-clean.png -> WebP (max width 1100, q82) for the technology block
- Goodly-Regular.otf -> WOFF2 (292 KB -> ~50 KB)
- hero-pendulum.mp4 -> 720p mobile variant (2.0 MB -> ~0.4 MB)
- Font Awesome solid -> subset with the 19 glyphs used by assets/css/icons.css

Run: python scripts/optimize_assets.py
"""
import os
import subprocess
import sys

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from _lib import enable_utf8, file_kb, path  # noqa: E402

try:
    from PIL import Image
    from fontTools.ttLib import TTFont
except ImportError as exc:  # pragma: no cover - environment guard
    print("Missing dependency '%s'. Install: pip install pillow fonttools brotli" % exc.name)
    raise SystemExit(2)

IMAGES = path("assets", "images")
FONTS = path("assets", "fonts")
MEDIA = path("assets", "media")


def report(label, src, dst):
    print("%s: %d KB -> %d KB" % (label, file_kb(src), file_kb(dst)))


def module_webp():
    src = os.path.join(IMAGES, "airbridge-module-clean.png")
    dst = os.path.join(IMAGES, "airbridge-module-clean.webp")
    image = Image.open(src).convert("RGBA")
    if image.width > 1100:
        height = round(image.height * 1100 / image.width)
        image = image.resize((1100, height), Image.LANCZOS)
    image.save(dst, "WEBP", quality=82, method=6)
    report("module webp", src, dst)


def goodly_woff2():
    src = os.path.join(FONTS, "Goodly-Regular.otf")
    dst = os.path.join(FONTS, "Goodly-Regular.woff2")
    font = TTFont(src, recalcTimestamp=False)  # deterministic output
    font.flavor = "woff2"
    font.save(dst)
    report("goodly woff2", src, dst)


def hero_mobile():
    src = os.path.join(MEDIA, "hero-pendulum.mp4")
    dst = os.path.join(MEDIA, "hero-pendulum-mobile.mp4")
    subprocess.run(
        [
            "ffmpeg", "-y", "-v", "error", "-i", src,
            "-vf", "scale=720:-2:flags=lanczos",
            "-c:v", "libx264", "-profile:v", "high", "-pix_fmt", "yuv420p",
            "-crf", "28", "-preset", "slow", "-movflags", "+faststart", "-an",
            dst,
        ],
        check=True,
    )
    report("hero mobile mp4", src, dst)


def fa_subset():
    """Keep only the 18 glyphs used by assets/css/icons.css (153 KB -> ~5 KB)."""
    from fontTools import subset

    src = os.path.join(FONTS, "fa-solid-900.ttf")
    dst = os.path.join(FONTS, "fa-solid-subset.woff2")
    unicodes = [
        0xF08E, 0xF0E0, 0xF04B, 0xF3C5, 0xF0AC, 0xF81D, 0xF5A2, 0xF06C, 0xE4F0,
        0xF245, 0xF76C, 0xF078, 0xF201, 0xF0A3, 0xF0E7, 0xE097, 0xF4D8, 0xF519,
        0xF058,  # check-circle used by .ab-solution__list li::before
    ]
    font = subset.load_font(src, subset.Options())
    subsetter = subset.Subsetter(options=subset.Options())
    subsetter.populate(unicodes=unicodes)
    subsetter.subset(font)
    font.flavor = "woff2"
    font.save(dst)
    report("fa subset", src, dst)


STEPS = (module_webp, goodly_woff2, hero_mobile, fa_subset)


def main():
    enable_utf8()
    for step in STEPS:
        step()
    return 0


if __name__ == "__main__":
    sys.exit(main())
