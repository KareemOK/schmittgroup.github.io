<script>
fetch('publications.json')
  .then(response => response.json())
  .then(pubs => {
    const container = document.getElementById('recent-publications');
    if (!container || pubs.length === 0) return;

    pubs
      .sort((a, b) => b.year - a.year)
      .slice(0, 3)
      .forEach(pub => {
        const div = document.createElement('div');
        div.className = 'recent-pub-item';
        div.innerHTML = `
          <div class="pub-title">${pub.title}</div>
          <div class="pub-authors">${pub.authors}</div>
          <div class="pub-info"><i>${pub.journal}</i>, ${pub.year}</div>
          <div class="pub-links">
            <a href="${pub.doi}" target="_blank">
              <img src="assets/doi.svg" alt="DOI">
            </a>
          </div>
        `;
        container.appendChild(div);
      });
  });
</script>
