/* Projects page: render project cards from data.js. */

document.addEventListener("DOMContentLoaded", () => {
  const grid = document.getElementById("projects-grid");
  if (!grid) return;

  grid.innerHTML = projects
    .map((p, i) => {
      const isInternal = !p.demo.startsWith("http") && p.demo !== "#";
      const demoAttrs = isInternal
        ? `href="${p.demo}"`
        : `href="${p.demo}" target="_blank" rel="noopener noreferrer"`;

      return `
      <article class="project-card glass glass-hover reveal" style="--delay: ${i * 0.1}s">
        <div class="thumb">
          <img src="${p.image}" alt="${p.title}" loading="lazy" />
        </div>
        <div class="content">
          <h3>${p.title}</h3>
          <p class="desc">${p.description}</p>
          <div class="tag-row">
            ${p.tags.map((t) => `<span class="tag">${t}</span>`).join("")}
          </div>
          <div class="project-links">
            <a class="demo" ${demoAttrs}>
              <i data-lucide="external-link" class="icon-sm"></i> Live Demo
            </a>
            <a class="source" href="${p.source}" target="_blank" rel="noopener noreferrer">
              <i data-lucide="github" class="icon-sm"></i> Source
            </a>
          </div>
        </div>
      </article>`;
    })
    .join("");

  if (window.lucide) lucide.createIcons({ nameAttr: "data-lucide" });

  // Re-run reveal observer for the dynamically added cards.
  grid.querySelectorAll(".reveal").forEach((el) => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { rootMargin: "-50px 0px" }
    );
    observer.observe(el);
  });
});
