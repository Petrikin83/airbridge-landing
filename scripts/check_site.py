"""Static sanity check for the landing page (standard library only).

Verifies that every local asset referenced by index.html exists, that every
in-page anchor points to a real id, and that basic markup invariants hold
(single h1, images have alt text, videos have a <source>).

Usage: python scripts/check_site.py
Exit code: 0 when the page is consistent, 1 otherwise.
"""
import os
import re
import sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
PAGE = os.path.join(ROOT, "index.html")

REF_RE = re.compile(r'(?:src|href)="([^"]+)"')
ID_RE = re.compile(r'\bid="([^"]+)"')
ANCHOR_RE = re.compile(r'href="#([^"]+)"')
IMG_RE = re.compile(r"<img\b[^>]*>", re.IGNORECASE)
VIDEO_RE = re.compile(r"<video\b.*?</video>", re.IGNORECASE | re.DOTALL)
H1_RE = re.compile(r"<h1\b", re.IGNORECASE)

EXTERNAL_PREFIXES = ("http://", "https://", "mailto:", "tel:", "//", "data:", "#")


def local_refs(html):
    """Yield unique local file references (query/hash stripped)."""
    seen = set()
    for ref in REF_RE.findall(html):
        if ref.startswith(EXTERNAL_PREFIXES):
            continue
        path = ref.split("?")[0].split("#")[0]
        if path and path not in seen:
            seen.add(path)
            yield path


def main():
    if hasattr(sys.stdout, "reconfigure"):
        sys.stdout.reconfigure(encoding="utf-8", errors="replace")

    with open(PAGE, encoding="utf-8") as fh:
        html = fh.read()

    problems = []

    refs = sorted(local_refs(html))
    for ref in refs:
        if not os.path.exists(os.path.join(ROOT, ref.replace("/", os.sep))):
            problems.append("missing asset: " + ref)

    ids = set(ID_RE.findall(html))
    anchors = sorted(set(ANCHOR_RE.findall(html)))
    for anchor in anchors:
        if anchor not in ids:
            problems.append("broken anchor: #" + anchor)

    h1_count = len(H1_RE.findall(html))
    if h1_count != 1:
        problems.append("expected exactly one <h1>, found %d" % h1_count)

    for tag in IMG_RE.findall(html):
        if "alt=" not in tag:
            problems.append("image without alt: " + tag[:80])

    videos = VIDEO_RE.findall(html)
    for video in videos:
        if "<source" not in video:
            problems.append("video without <source>: " + video[:80])

    print("=== SITE CHECK: %s ===" % os.path.relpath(PAGE, ROOT).replace(os.sep, "/"))
    print("local references: %d | in-page anchors: %d | videos: %d"
          % (len(refs), len(anchors), len(videos)))

    if problems:
        print("\nPROBLEMS:")
        for problem in problems:
            print("  - " + problem)
        return 1

    print("\nOK: all references resolve, anchors match, markup invariants hold")
    return 0


if __name__ == "__main__":
    sys.exit(main())
