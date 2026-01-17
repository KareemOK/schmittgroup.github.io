<script>
document.addEventListener("DOMContentLoaded", () => {
  const container = document.getElementById("pub-list");
  if (!container) return;

  // convert "A and B and C" → "A; B; C"
  const formatAuthors = (str = "") => {
    return str.split(/\s+and\s+/).join("; ");
  };

  fetch("publications.json")
    .then(res => {
      if (!res.ok) throw new Error("Failed to load publications.json");
      return res.json();
    })
    .then(items => {
      // group by year
      const byYear = {};
      items.forEach(pub => {
        const year = pub.year || "Other";
        if (!byYear[year]) byYear[year] = [];
        byYear[year].push(pub);
      });

      const sortedYears = Object.keys(byYear)
        .sort((a, b) => parseInt(b) - parseInt(a));

      sortedYears.forEach(year => {
        const yearHeading = document.createElement("h2");
        yearHeading.textContent = year;
        container.appendChild(yearHeading);

        byYear[year].forEach(pub => {
          const div = document.createElement("div");
          div.className = "publication-item";

          const metaParts = [];
          if (pub.journal) metaParts.push(`<em>${pub.journal}</em>`);
          if (pub.volume) metaParts.push(pub.volume);
          if (pub.pages) metaParts.push(pub.pages);

          const metaLine = metaParts.join(", ");

          div.innerHTML = `
            <p class="pub-title">${pub.title || ""}</p>
            <p class="pub-authors">${formatAuthors(pub.authors || "")}</p>
            ${metaLine ? `<p class="pub-journal">${metaLine}</p>` : ""}
            <div class="pub-links">
              ${pub.link ? `<a href="${pub.link}" target="_blank" rel="noopener">Link</a>` : ""}
              ${pub.doi && !pub.link ? `<a href="https://doi.org/${pub.doi}" target="_blank" rel="noopener">DOI</a>` : ""}
            </div>
          `;

          container.appendChild(div);
        });
      });
    })
    .catch(err => {
      console.error(err);
      container.innerHTML = "<p>Unable to load publications.</p>";
    });
});
</script>






