"""Run the project's automated checks in one go.

1. check_site.py          — local asset references, anchors, markup invariants
2. fact_index.py          — page claims vs client materials
3. find_unused_assets.py  — files under assets/ that nothing loads (report only)

Usage: python scripts/run_checks.py
Exit code: 0 when every check passes, 1 otherwise.
"""
import os
import sys

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from _lib import enable_utf8  # noqa: E402

import check_site  # noqa: E402
import fact_index  # noqa: E402
import find_unused_assets  # noqa: E402


def section(title):
    print("\n" + "=" * 62)
    print(title)
    print("=" * 62)


def main():
    enable_utf8()
    results = []

    section("1/3 site structure")
    results.append(("check_site", check_site.main()))

    section("2/3 claims vs client materials")
    results.append(("fact_index", fact_index.main()))

    section("3/3 unused assets (report only)")
    results.append(("find_unused_assets", find_unused_assets.main([])))

    section("summary")
    for name, code in results:
        print("%-20s %s" % (name, "OK" if code == 0 else "FAILED (%d)" % code))

    failed = [name for name, code in results if code != 0]
    print("\n" + ("ALL CHECKS PASSED" if not failed else "FAILED: " + ", ".join(failed)))
    return 1 if failed else 0


if __name__ == "__main__":
    sys.exit(main())