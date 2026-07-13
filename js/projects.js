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

      const hasVideo = !!p.video;
      const videoBtn = hasVideo
        ? `<button class="video-btn" data-video="${p.video}" aria-label="Watch demo video">
             <i data-lucide="play" class="icon-sm"></i> Watch Demo
           </button>`
        : "";

      return `
      <article class="project-card glass glass-hover reveal" style="--delay: ${i * 0.1}s">
        <div class="thumb ${hasVideo ? 'has-video' : ''}">
          <img src="${p.image}" alt="${p.title}" loading="lazy" />
          ${hasVideo ? `<div class="video-overlay"><i data-lucide="play-circle"></i></div>` : ""}
        </div>
        <div class="content">
          <h3>${p.title}</h3>
          <p class="desc">${p.description}</p>
          <div class="tag-row">
            ${p.tags.map((t) => `<span class="tag">${t}</span>`).join("")}
          </div>
          <div class="project-links">
            ${videoBtn}
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

  // ── Video modal ──
  const modal = document.getElementById("video-modal");
  const modalVideo = document.getElementById("modal-video");
  const modalClose = document.getElementById("modal-close");

  if (modal && modalVideo) {
    grid.querySelectorAll(".video-btn, .video-overlay").forEach((trigger) => {
      trigger.addEventListener("click", () => {
        const videoSrc = trigger.closest(".project-card").querySelector(".video-btn")?.dataset.video
          || trigger.dataset.video;
        if (!videoSrc) return;
        modalVideo.src = videoSrc;
        modal.classList.add("open");
        document.body.style.overflow = "hidden";
        modalVideo.play().catch(() => {});
      });
    });

    function closeModal() {
      modal.classList.remove("open");
      document.body.style.overflow = "";
      modalVideo.pause();
      modalVideo.src = "";
    }

    modalClose?.addEventListener("click", closeModal);
    modal.addEventListener("click", (e) => { if (e.target === modal) closeModal(); });
    document.addEventListener("keydown", (e) => { if (e.key === "Escape") closeModal(); });
  }

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