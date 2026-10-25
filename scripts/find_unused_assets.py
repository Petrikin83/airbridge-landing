"""Report files under assets/ that are not referenced by the shipped page.

The landing ships: index.html, assets/js/main.js, assets/css/{landing,fonts,icons,cdc-tokens}.css.
Reference kits (Divi, jQuery, Font Awesome full build) are kept in git history only.

Run: python scripts/find_unused_assets.py
"""
import io
import os

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
RUNTIME = [
    "index.html",
    "assets/js/main.js",
    "assets/css/landing.css",
    "assets/css/fonts.css",
    "assets/css/icons.css",
    "assets/css/cdc-tokens.css",
]
ASSETS = os.path.join(ROOT, "assets")

# Build inputs: not requested at runtime, but needed to regenerate assets.
BUILD_INPUTS = {
    os.path.join("assets", "fonts", "fa-solid-900.ttf"),
}


def main():
    sys = __import__("sys")
    if hasattr(sys.stdout, "reconfigure"):
        sys.stdout.reconfigure(encoding="utf-8", errors="replace")
    delete = "--delete" in sys.argv

    haystack = ""
    for rel in RUNTIME:
        path = os.path.join(ROOT, rel)
        if os.path.exists(path):
            haystack += io.open(path, encoding="utf-8", errors="ignore").read()

    unused = []
    kept = []
    for dirpath, _dirs, files in os.walk(ASSETS):
        for name in files:
            path = os.path.join(dirpath, name)
            rel = os.path.relpath(path, ROOT)
            if name in haystack:
                continue
            if rel in BUILD_INPUTS:
                kept.append(rel)
                continue
            unused.append((rel, os.path.getsize(path)))

    unused.sort(key=lambda item: -item[1])
    total = sum(size for _path, size in unused)
    print("Unused files: %d (%.2f MB)" % (len(unused), total / 1024 / 1024))
    for rel, size in unused:
        print("  %7.1f KB  %s" % (size / 1024, rel))
        if delete:
            os.remove(os.path.join(ROOT, rel))
    if delete and unused:
        print("Deleted %d files (recoverable from git history)." % len(unused))
    if kept:
        print("Kept as build inputs: %s" % ", ".join(kept))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
