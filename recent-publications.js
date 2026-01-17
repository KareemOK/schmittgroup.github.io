document.addEventListener("DOMContentLoaded", () => {
  const container = document.getElementById("recent-publications");
  if (!container) return;

  // Create CTA element (like Meet the Team card)
  const cta = document.createElement("div");
  cta.className = "recent-pub-cta";
  cta.innerHTML = `
    <a href="publications.html" class="pub-cta-link">
      <div class="pub-cta-icon">→</div>
      <div class="pub-cta-text">View all publications</div>
    </a>
  `;

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

      // Clear before rebuilding
      container.innerHTML = "";

      // Sort newest → oldest
      const sorted = [...items].sort((a, b) => (b.year || 0) - (a.year || 0));

      // Show 2 articles, CTA = 3rd card
      const recent = sorted.slice(0, 2);

      recent.forEach(pub => {
        const div = document.createElement("div");
        div.className = "recent-pub-item";

        const authors = pub.authors || pub.Authors || "";
        const journal = pub.journal || pub.venue || "";
        const year = pub.year || "";
        const volume = pub.volume || "";
        const pages = pub.pages || "";
        const doi = (pub.doi || "").trim();
        const link = (pub.link || "").trim();

        let titleHTML = pub.title || "Untitled";
        if (doi) {
          titleHTML = `<a href="https://doi.org/${encodeURIComponent(doi)}" target="_blank" rel="noopener">${pub.title}</a>`;
        } else if (link) {
          titleHTML = `<a href="${link}" target="_blank" rel="noopener">${pub.title}</a>`;
        }

        div.innerHTML = `
          <div class="pub-title">${titleHTML}</div>
          ${authors ? `<div class="pub-authors">${authors}</div>` : ""}
          <div class="pub-info">
            ${journal ? `<em>${journal}</em>` : ""}${journal && year ? ", " : ""}${year}${
              volume ? `, <strong>${volume}</strong>` : ""
            }${pages ? `, ${pages}` : ""}
          </div>
        `;

        container.appendChild(div);
      });

      // Append CTA as 3rd card
      container.appendChild(cta);
    })
    .catch(err => {
      console.error(err);
      container.innerHTML = "<p>Unable to load recent publications.</p>";
    });
});



