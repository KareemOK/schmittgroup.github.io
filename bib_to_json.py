import json
import bibtexparser
from bibtexparser.bparser import BibTexParser
from bibtexparser.customization import convert_to_unicode

# 1. Load the BibTeX file
with open("publications.bib", encoding="utf-8") as f:
    parser = BibTexParser(common_strings=True)
    parser.customization = convert_to_unicode
    bib_db = bibtexparser.load(f, parser=parser)

publications = []

for entry in bib_db.entries:
    # Basic fields from BibTeX
    year    = entry.get("year", "")
    title   = entry.get("title", "").strip("{}")
    authors = entry.get("author", "")
    journal = entry.get("journal") or entry.get("booktitle") or ""
    volume  = entry.get("volume", "")
    pages   = entry.get("pages", "")
    doi     = entry.get("doi", "")
    url     = entry.get("url", "")

    # Match the shape expected by publications.js
    pub_obj = {
        "year": year,
        "title": title,
        "authors": authors,
        "journal": journal,
        "volume": volume,
        "pages": pages,
        "doi": doi,
        # prefer explicit link if present, otherwise build from DOI
        "link": url or (f"https://doi.org/{doi}" if doi else "")
    }

    publications.append(pub_obj)

# Optional: sort newest → oldest by year
def year_key(p):
    try:
        return int(p["year"])
    except (ValueError, TypeError):
        return 0

publications.sort(key=year_key, reverse=True)

# 3. Write publications.json
with open("publications.json", "w", encoding="utf-8") as f:
    json.dump(publications, f, indent=2, ensure_ascii=False)

print(f"Wrote {len(publications)} publications to publications.json")

