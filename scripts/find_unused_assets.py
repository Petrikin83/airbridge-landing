"""Report files under assets/ that are not referenced by the shipped page.

The landing ships: index.html, assets/js/main.js, assets/css/{landing,fonts,icons,cdc-tokens}.css.
Reference kits (Divi, jQuery, Font Awesome full build) are kept in git history only.

Run: python scripts/find_unused_assets.py [--delete]
Exit code: 0 always (report tool), 2 when assets/ is missing.
"""
import os
import sys

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from _lib import ROOT, enable_utf8, read_text, rel  # noqa: E402

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
    "assets/fonts/fa-solid-900.ttf",
}


def collect_haystack():
    """Concatenated text of every file the page actually loads."""
    return "".join(read_text(os.path.join(ROOT, item)) for item in RUNTIME
                   if os.path.exists(os.path.join(ROOT, item)))


def find_unused(haystack):
    """Return (unused [(rel, size)], kept_build_inputs [rel])."""
    unused = []
    kept = []
    for dirpath, _dirs, files in os.walk(ASSETS):
        for name in files:
            full = os.path.join(dirpath, name)
            item = rel(full)
            if name in haystack:
                continue
            if item in BUILD_INPUTS:
                kept.append(item)
                continue
            unused.append((item, os.path.getsize(full)))
    unused.sort(key=lambda entry: -entry[1])
    return unused, kept


def main(argv):
    enable_utf8()
    delete = "--delete" in argv

    if not os.path.isdir(ASSETS):
        print("Assets folder not found: " + ASSETS)
        return 2

    unused, kept = find_unused(collect_haystack())
    total = sum(size for _item, size in unused)
    print("Unused files: %d (%.2f MB)" % (len(unused), total / 1024 / 1024))

    for item, size in unused:
        print("  %7.1f KB  %s" % (size / 1024, item.replace("/", os.sep)))
        if delete:
            os.remove(os.path.join(ROOT, item))

    if delete and unused:
        print("Deleted %d files (recoverable from git history)." % len(unused))
    if kept:
        print("Kept as build inputs: %s" % ", ".join(kept))
    return 0


if __name__ == "__main__":
    sys.exit(main(sys.argv[1:]))
