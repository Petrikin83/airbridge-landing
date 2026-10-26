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

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from _lib import ROOT, enable_utf8, read_text, rel  # noqa: E402

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


def check_references(html):
    """Return (sorted local refs, missing-asset problems)."""
    refs = sorted(local_refs(html))
    problems = []
    for ref in refs:
        if not os.path.exists(os.path.join(ROOT, ref.replace("/", os.sep))):
            problems.append("missing asset: " + ref)
    return refs, problems


def check_anchors(html):
    """Return (sorted in-page anchors, broken-anchor problems)."""
    ids = set(ID_RE.findall(html))
    anchors = sorted(set(ANCHOR_RE.findall(html)))
    problems = ["broken anchor: #" + anchor for anchor in anchors if anchor not in ids]
    return anchors, problems


def check_markup(html):
    """Return (videos, problems) for the basic markup invariants."""
    problems = []

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

    return videos, problems


def main():
    enable_utf8()
    html = read_text(PAGE)

    refs, reference_problems = check_references(html)
    anchors, anchor_problems = check_anchors(html)
    videos, markup_problems = check_markup(html)
    problems = reference_problems + anchor_problems + markup_problems

    print("=== SITE CHECK: %s ===" % rel(PAGE))
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
