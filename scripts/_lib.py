"""Shared helpers for the project scripts.

Goal: one place for repo paths, UTF-8 output, reading/writing and size formatting,
so the individual scripts do not duplicate them (see graphify-out/GRAPH_REPORT.md:
`kb()`, duplicated `main()` wrappers and hardcoded paths were the top offenders).

No third-party dependencies. Import from a script:

    import os
    import sys
    sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
    from _lib import ROOT, path, read_text, write_text, rel, enable_utf8, file_kb
"""
import os
import sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))


def path(*parts):
    """Absolute path inside the repository."""
    return os.path.join(ROOT, *parts)


def rel(target):
    """Repository-relative path with forward slashes (for reports)."""
    return os.path.relpath(target, ROOT).replace(os.sep, "/")


def enable_utf8():
    """Make Cyrillic/×/° printable on Windows consoles (cp1251 by default)."""
    for stream in (sys.stdout, sys.stderr):
        if hasattr(stream, "reconfigure"):
            stream.reconfigure(encoding="utf-8", errors="replace")


def file_kb(target):
    """File size in kilobytes (rounded)."""
    return round(os.path.getsize(target) / 1024)


def read_text(target):
    """Read a UTF-8 text file, ignoring undecodable bytes."""
    with open(target, encoding="utf-8", errors="ignore") as fh:
        return fh.read()


def write_text(target, text):
    """Write UTF-8 text, creating parent directories when needed."""
    parent = os.path.dirname(target)
    if parent:
        os.makedirs(parent, exist_ok=True)
    with open(target, "w", encoding="utf-8") as fh:
        fh.write(text)


def iter_files(directory, suffixes=None):
    """Yield files under a directory (sorted), optionally filtered by suffix."""
    for dirpath, _dirs, files in os.walk(directory):
        for name in sorted(files):
            if suffixes and not name.lower().endswith(tuple(suffixes)):
                continue
            yield os.path.join(dirpath, name)
