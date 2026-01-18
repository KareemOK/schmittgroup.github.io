document.addEventListener("DOMContentLoaded", () => {
  const container = document.getElementById("recent-publications");
  if (!container) return;

  // Grab CTA card (the "→ View all publications" block) if present
  const cta = container.querySelector(".recent-pub-cta");

  fetch("publications.json?v=1")
    .then(res => {
      if (!res.ok) throw new Error("Failed to load publications.json");
      return res.json();
    })
    .then(items => {
      if (!Array.isArray(items) || items.length === 0) {
        container.innerHTML = "<p>No publications found.</p>";
        return;
      }

      // Clear existing content (we’ll re-append CTA manually)
      container.innerHTML = "";

      // newest → oldest
      const sorted = [...items].sort((a, b) => (b.year || 0) - (a.year || 0));

      // two most recent + CTA = 3 cards
      const recent = sorted.slice(0, 2);

      recent.forEach(pub => {
        const div = document.createElement("div");
        div.className = "recent-pub-item";

        const title = pub.title || "Untitled";

        const rawAuthors = pub.authors || pub.Authors || "";
        const authorsACS = formatAuthorsACS(rawAuthors); // <<< ACS-style, no "and"

        const journal = pub.journal || pub.venue || "";
        const year = pub.year || "";
        const volume = pub.volume || "";
        const pages = pub.pages || "";
        const doi = (pub.doi || "").trim();

        // Build ACS-ish line:
        // *Journal* Year, Volume, pages.
        const infoBits = [];
        if (journal) infoBits.push(`<em>${journal}</em>`);
        if (year) infoBits.push(year);
        if (volume) infoBits.push(`<strong>${volume}</strong>`);
        if (pages) infoBits.push(pages);

        const infoLine = infoBits.join(", ");

        div.innerHTML = `
          <div class="pub-title">${title}</div>
          ${authorsACS ? `<div class="pub-authors">${authorsACS}.</div>` : ""}
          <div class="pub-info">
            ${infoLine ? `${infoLine}.` : ""}
            ${doi
  ? ` <a href="https://doi.org/${encodeURIComponent(
      doi
    )}" target="_blank" rel="noopener" class="pub-doi-link">
        <img src="assets/doi.svg" alt="DOI link">
      </a>`
  : ""}

          </div>
        `;

        container.appendChild(div);
      });

      // Re-attach CTA card as last grid item
      if (cta) {
        container.appendChild(cta);
      }
    })
    .catch(err => {
      console.error(err);
      container.innerHTML = "<p>Unable to load recent publications.</p>";
    });

  // ---------- Helper: ACS-style authors ----------
  function formatAuthorsACS(raw) {
    if (!raw) return "";

    // Your JSON uses "... and ... and ...", so split on that
    const parts = raw
      .split(/\s+and\s+/i)
      .map(p => p.trim())
      .filter(Boolean);

    if (!parts.length) return "";

    const formatted = parts.map(author => {
      // Expect "Surname, Firstname Middlename"
      const chunks = author.split(",");
      if (chunks.length < 2) {
        // If it's not in that form, just return as-is
        return author.trim();
      }

      const surname = chunks[0].trim();
      const givenNames = chunks.slice(1).join(",").trim();

      if (!givenNames) return surname;

      // First letters of each given name → initials
      const initials = givenNames
        .split(/\s+/)
        .filter(Boolean)
        .map(name => name[0].toUpperCase() + ".")
        .join(" ");

      // ACS: "Surname, A. B."
      return `${surname}, ${initials}`;
    });

    // ACS: semicolons between authors, no “and”
    return formatted.join("; ");
  }
});






