document.addEventListener("DOMContentLoaded", () => {
  const container = document.getElementById("recent-publications");
  if (!container) return;

  // grab the CTA (if present)
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

      // clear everything before we rebuild
      container.innerHTML = "";

      // sort newest → oldest
      const sorted = [...items].sort((a, b) => (b.year || 0) - (a.year || 0));

      // take the top 2, since the CTA will be the 3rd card
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

        // Title: prefer DOI link, then link, else plain text
        let titleHTML = pub.title || "Untitled";
        if (doi) {
          titleHTML = `<a href="https://doi.org/${encodeURIComponent(
            doi
          )}" target="_blank" rel="noopener">${pub.title}</a>`;
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

      // re-attach CTA as the last grid item (3rd card)
      if (cta) {
        container.appendChild(cta);
      }
    })
    .catch(err => {
      console.error(err);
      container.innerHTML =
        "<p>Unable to load recent publications.</p>";
    });
});


