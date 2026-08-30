"""Scan local project materials and index confirmed facts.

Reads every .txt/.md material, then searches for key terms that appear on the
landing page, reporting which source files confirm each term (or NONE).
"""
import os
import re

ROOT = r"D:\Airbridge_NEW_DeepSeek"

# material files to index
SOURCES = []
for dirpath, dirs, files in os.walk(ROOT):
    dirs[:] = [d for d in dirs if d not in (".git", "node_modules", "__pycache__", ".vscode")]
    for f in files:
        if f.lower().endswith((".txt", ".md")):
            SOURCES.append(os.path.join(dirpath, f))

# key terms appearing on the site (claim -> normalized regex)
TERMS = {
    "patent WO2017064014": r"WO2017064014",
    "52 innovations (technical/patented)": r"52 (technical |patented )?innovations",
    "90°": r"90°",
    "60°": r"60°",
    "40 tons / 40t": r"40 (ton|t)",
    "3 km span": r"3 km",
    "10 m/s": r"10 m/s",
    "8 m/s": r"8 m/s",
    "3× CAPEX": r"3 ?×|3x|3×",
    "70% OPEX": r"70%",
    "100% utilization": r"100%",
    "below 10% utilization": r"10%",
    "EU Regulation 2016/424": r"2016/424",
    "Neology": r"Neology",
    "ammonia": r"ammonia",
    "hybrid": r"hybrid",
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
    "THE RIG": r"THE RIG",
    "NEOM Magna": r"Magna",
    "Red Sea Global": r"Red Sea Global",
    "Offshore": r"[Oo]ffshore",
    "Marine": r"Marine",
    "Mining": r"[Mm]ining",
    "Power Line": r"[Pp]ower [Ll]ine",
    "pylon": r"pylon",
    "Construction Logistics": r"[Cc]onstruction [Ll]ogistics",
    "Faraday cage": r"Faraday",
    "boarding at any point": r"[Bb]oarding",
    "built-in crane": r"crane",
    "20+ years": r"20\+ years",
    "200+ projects": r"200\+ projects",
    "$50M": r"50M",
    "+500% growth": r"500%",
    "4,000 m altitude": r"4,?000",
    "Financial Times": r"Financial Times",
    "Statista": r"Statista",
    "Leader della Crescita": r"Leader della Crescita",
    "Il Sole 24 Ore": r"Il Sole 24 Ore",
    "Top 3 Europe": r"Top 3",
    "feasibility studies": r"feasibility",
    "estimates": r"estimate",
    "Conventional Ropeway (5 km)": r"5 km",
    "3S Ropeway (1.5 km)": r"3S|1\.5 km",
    "Helicopter installation": r"[Hh]elicopter",
    "zero ground impact": r"zero ground",
}

print("=== FACT INDEX (which source files confirm each term) ===")
for label, pattern in TERMS.items():
    rx = re.compile(pattern)
    hits = []
    for src in SOURCES:
        with open(src, encoding="utf-8", errors="ignore") as fh:
            text = fh.read()
        if rx.search(text):
            hits.append(os.path.relpath(src, ROOT))
    status = ", ".join(hits) if hits else "*** NOT FOUND ***"
    print(f"\n[{label}]\n  -> {status}")
