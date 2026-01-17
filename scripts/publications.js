<script>
document.addEventListener("DOMContentLoaded", () => {
  const container = document.getElementById("pub-list");
  if (!container) return;

  // Turn "A and B and C" → "A; B; C"
  const formatAuthors = (str = "") => {
    return str.split(/\s+and\s+/).join("; ");
  };

  const buildCitation = (pub) => {
    const authorsRaw = pub.authors || "";
    const authors = formatAuthors(authorsRaw);

    let citation = "";

    if (authors) {
      citation += authors + ". ";
    }

    if (pub.title) {
      citation += pub.title + ". ";
    }

    // Journal + year + volume/issue + pages
    const journalBits = [];

    if (pub.journal) {
      journalBits.push(`<em>${pub.journal}</em>`);
    }

    if (pub.year) {
      journalBits.push(pub.year);
    }

    const volIssue = [];
    if (pub.volume) {
      volIssue.push(pub.volume);
    }

    const issue = pub.issue || pub.number;
    if (issue) {
      volIssue.push("(" + issue + ")");
    }

    if (volIssue.length) {
      journalBits.push(volIssue.join(" "));
    }

    if (pub.pages) {
      journalBits.push(pub.pages);
    }

    if (journalBits.length) {
      citation += journalBits.join(", ") + ". ";
    }

    if (pub.doi) {
      citation += `DOI: ${pub.doi}.`;
    }

    return citation;
  };

  // Add ?cb=... so we always get the latest JSON
  fetch("publications.json?cb=" + Date.now())
    .then(res => {
      if (!res.ok) throw new Error("Failed to load publications.json");
      return res.json();
    })
    .then(items => {
      if (!Array.isArray(items) || items.length === 0) {
        container.innerHTML = "<li>No publications found.</li>";
        return;
      }

      // Sort newest → oldest
      const sorted = [...items].sort((a, b) => (b.year || 0) - (a.year || 0));

      sorted.forEach(pub => {
        const li = document.createElement("li");
        li.className = "publication-item";

        const citationHTML = buildCitation(pub);

        li.innerHTML = `
          <p class="pub-citation">${citationHTML}</p>
          <div class="pub-links">
            ${pub.link ? `<a href="${pub.link}" target="_blank" rel="noopener">Link</a>` : ""}
            ${pub.doi && !pub.link ? `<a href="https://doi.org/${pub.doi}" target="_blank" rel="noopener">DOI</a>` : ""}
          </div>
        `;

        container.appendChild(li);
      });
    })
    .catch(err => {
      console.error(err);
      container.innerHTML = "<p>Unable to load publications.</p>";
    });
});
</script>









