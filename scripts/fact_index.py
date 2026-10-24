"""Fact-check the landing page against client source materials.

Scans only client materials (airbridge_materials/texts/*.txt) and reports which
source confirms each claim used on index.html. Project documentation (MEMORY.md,
TECH_SPEC.md, README.md) is deliberately excluded: it is not evidence.

Usage: python scripts/fact_index.py
Exit code: 0 when every claim is confirmed, 1 when at least one is missing.
"""
import os
import re
import sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
MATERIALS = os.path.join(ROOT, "airbridge_materials", "texts")

# claim -> regex as it appears in the client source materials
CLAIMS = {
    "patent WO2017064014": r"WO2017064014",
    "52 innovations (technical/patented)": r"52 (technical |patented )?innovations",
    "60° max slope": r"60°",
    "40 tons / 40t": r"40 (ton|t)",
    "3 km span": r"3 km",
    "8 m/s speed": r"8 m/s",
    "3× CAPEX": r"3 ?×|3x|3×",
    "70% OPEX": r"70%",
    "100% utilization": r"100%",
    "EU Regulation 2016/424": r"2016/424",
    "Neology": r"Neology",
    "ammonia": r"ammonia",
    "diesel": r"diesel",
    "electric": r"electric",
    "ItalDesign": r"ItalDesign",
    "Audi/Bugatti/Ferrari/Lamborghini": r"Audi|Bugatti|Ferrari|Lamborghini",
    "ISO 9001": r"ISO 9001",
    "ISO 14001": r"ISO 14001",
    "ISO 45001": r"ISO 45001",
    "NEOM Trojena": r"Trojena|NEOM",
    "AlUla": r"AlUla",
    "Soudah Peaks": r"Soudah",
    "Caspian Sea": r"Caspian",
    "Offshore": r"[Oo]ffshore",
    "Marine": r"Marine",
    "Mining": r"[Mm]ining",
    "Power Line": r"[Pp]ower [Ll]ine",
    "pylon": r"pylon",
    "Faraday cage": r"Faraday",
    "boarding at any point": r"[Bb]oarding",
    "cable crane": r"crane",
    "20+ years": r"20\+ years",
    "200+ projects": r"200\+ projects",
    "+500% growth": r"500%",
    "4,000 m altitude": r"4,?000",
    "Financial Times": r"Financial Times",
    "Statista": r"Statista",
    "Leader della Crescita": r"Leader della Crescita",
    "Il Sole 24 Ore": r"Il Sole 24 Ore",
    "Top 3 Europe": r"Top 3",
    "feasibility studies": r"feasibility",
    "estimates": r"estimate",
    "Helicopter installation": r"[Hh]elicopter",
    "minimal ground impact": r"minim(?:al|izing)\b[^.]{0,60}ground impact",
}

# Industry reference values used in the comparison table (not client claims).
BENCHMARKS = {
    "Conventional ropeway (5 km)": r"5 km",
    "3S ropeway (1.5 km)": r"3S|1\.5 km",
}

def load_sources():
    """Return [(file name, text)] for every client material text file."""
    if not os.path.isdir(MATERIALS):
        sys.exit("Materials folder not found: " + MATERIALS)
    names = sorted(n for n in os.listdir(MATERIALS) if n.lower().endswith((".txt", ".md")))
    if not names:
        sys.exit("No source texts found in " + MATERIALS)
    sources = []
    for name in names:
        with open(os.path.join(MATERIALS, name), encoding="utf-8", errors="ignore") as fh:
            sources.append((name, fh.read()))
    return sources


def main():
    if hasattr(sys.stdout, "reconfigure"):
        sys.stdout.reconfigure(encoding="utf-8", errors="replace")

    sources = load_sources()
    print("=== FACT INDEX (client materials only) ===")
    print("sources: " + ", ".join(name for name, _ in sources))

    missing = []
    for claim, pattern in CLAIMS.items():
        rx = re.compile(pattern)
        hits = [name for name, text in sources if rx.search(text)]
        if hits:
            print("\n[" + claim + "]\n  -> " + ", ".join(hits))
        else:
            missing.append(claim)
            print("\n[" + claim + "]\n  -> *** NOT FOUND ***")

    total = len(CLAIMS)
    print("\n=== SUMMARY: %d/%d claims confirmed ===" % (total - len(missing), total))
    if missing:
        print("unconfirmed: " + "; ".join(missing))

    print("\n=== INDUSTRY BENCHMARKS (comparison table, not client claims) ===")
    for label, pattern in BENCHMARKS.items():
        rx = re.compile(pattern)
        hits = [name for name, text in sources if rx.search(text)]
        print("[%s] -> %s" % (label, ", ".join(hits) if hits else "not in client materials (industry reference)"))

    return 1 if missing else 0


if __name__ == "__main__":
    sys.exit(main())
