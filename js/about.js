/* About page: render skills + hobbies from data.js, animate skill bars on scroll. */

document.addEventListener("DOMContentLoaded", () => {
  // Skills
  const skillsWrap = document.getElementById("skills-list");
  if (skillsWrap) {
    skillsWrap.innerHTML = skills
      .map(
        (s, i) => `
        <div class="skill">
          <div class="skill-row font-mono">
            <span>${s.name}</span>
            <span class="pct">${s.level}%</span>
          </div>
          <div class="skill-track">
            <div class="skill-fill" data-level="${s.level}" style="--delay: ${i * 0.1}s"></div>
          </div>
        </div>`
      )
      .join("");

    // Animate widths when the skills card scrolls into view.
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.querySelectorAll(".skill-fill").forEach((bar) => {
            bar.style.width = bar.dataset.level + "%";
          });
          observer.unobserve(entry.target);
        });
      },
      { threshold: 0.3 }
    );

    observer.observe(skillsWrap);
  }

  // Hobbies
  const hobbiesWrap = document.getElementById("hobbies-list");
  if (hobbiesWrap) {
    hobbiesWrap.innerHTML = hobbies.map((h) => `<li>${h}</li>`).join("");
  }
});
