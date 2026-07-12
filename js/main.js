/* ═══════════════════════════════════════════════
   MAIN — Clean, purposeful interactions only
   ═══════════════════════════════════════════════ */

// ── Toasts ──
const toast = (() => {
  let container = null;

  function ensureContainer() {
    if (!container) {
      container = document.createElement("div");
      container.id = "toast-container";
      document.body.appendChild(container);
    }
    return container;
  }

  function show(message, type) {
    const el = document.createElement("div");
    el.className = `toast ${type}`;
    el.setAttribute("role", "status");
    const icon = type === "success"
      ? '<i data-lucide="check-circle-2" class="icon-sm"></i>'
      : '<i data-lucide="x-circle" class="icon-sm"></i>';
    el.innerHTML = `${icon}<span>${message}</span>`;
    ensureContainer().appendChild(el);
    if (window.lucide) lucide.createIcons({ nameAttr: "data-lucide" });
    requestAnimationFrame(() => el.classList.add("show"));
    setTimeout(() => {
      el.classList.remove("show");
      el.addEventListener("transitionend", () => el.remove(), { once: true });
    }, 3200);
  }

  return {
    success: (msg) => show(msg, "success"),
    error: (msg) => show(msg, "error"),
  };
})();

// ── Lenis smooth scroll ──
function initLenis() {
  if (typeof Lenis === "undefined") return;
  const lenis = new Lenis({ duration: 1.2, easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)) });

  function raf(time) { lenis.raf(time); requestAnimationFrame(raf); }
  requestAnimationFrame(raf);

  if (window.ScrollTrigger) {
    lenis.on("scroll", ScrollTrigger.update);
    gsap.ticker.add((time) => lenis.raf(time * 1000));
    gsap.ticker.lagSmoothing(0);
  }
}

// ── Preloader ──
function initPreloader() {
  const preloader = document.querySelector(".preloader");
  if (!preloader || !window.gsap) { afterPreloader(); return; }

  const tl = gsap.timeline({ onComplete: () => { preloader.style.pointerEvents = "none"; afterPreloader(); } });
  tl.to(".preloader-logo", { opacity: 1, y: 0, duration: .5, ease: "power2.out" })
    .to(".preloader-bar", { opacity: 1, duration: .2 })
    .to(".preloader-bar-fill", { width: "100%", duration: .8, ease: "power2.inOut" })
    .to(preloader, { opacity: 0, duration: .4, ease: "power2.inOut", delay: .15 });
}

function afterPreloader() {
  initPageAnimations();
  initScrollReveals();
}

// ── Custom cursor ──
function initCursor() {
  const dot = document.querySelector(".cursor-dot");
  const ring = document.querySelector(".cursor-ring");
  if (!dot || !ring || !window.gsap || window.matchMedia("(pointer: coarse)").matches || window.innerWidth <= 1024) return;

  let mx = 0, my = 0, dx = 0, dy = 0, rx = 0, ry = 0;

  document.addEventListener("mousemove", (e) => { mx = e.clientX; my = e.clientY; });

  gsap.ticker.add(() => {
    dx += (mx - dx) * .85;
    dy += (my - dy) * .85;
    rx += (mx - rx) * .12;
    ry += (my - ry) * .12;
    dot.style.left = dx + "px"; dot.style.top = dy + "px";
    ring.style.left = rx + "px"; ring.style.top = ry + "px";
  });

  const targets = document.querySelectorAll("a, button, input, textarea, .project-card, .info-card");
  targets.forEach((el) => {
    el.addEventListener("mouseenter", () => { dot.classList.add("hovering"); ring.classList.add("hovering"); });
    el.addEventListener("mouseleave", () => { dot.classList.remove("hovering"); ring.classList.remove("hovering"); });
  });
}

// ── Navbar: mobile toggle + hide on scroll ──
function initNavbar() {
  const toggle = document.querySelector(".nav-toggle");
  const mobile = document.querySelector(".nav-mobile");
  const navbar = document.querySelector(".navbar");

  if (toggle && mobile) {
    toggle.addEventListener("click", () => {
      const open = mobile.classList.toggle("open");
      toggle.setAttribute("aria-expanded", String(open));
    });
  }

  if (!navbar) return;
  let lastY = 0;
  window.addEventListener("scroll", () => {
    const y = window.scrollY;
    if (y > 80) {
      navbar.classList.toggle("hidden", y > lastY + 4);
      if (y < lastY - 4) navbar.classList.remove("hidden");
    } else {
      navbar.classList.remove("hidden");
    }
    lastY = y;
  }, { passive: true });
}

// ── GSAP scroll reveals ──
function initScrollReveals() {
  if (!window.gsap || !window.ScrollTrigger) { initRevealsFallback(); return; }
  gsap.registerPlugin(ScrollTrigger);

  document.querySelectorAll(".reveal").forEach((el) => {
    const delay = parseFloat(getComputedStyle(el).getPropertyValue("--delay")) || 0;
    gsap.fromTo(el,
      { opacity: 0, y: 36 },
      { opacity: 1, y: 0, duration: .8, delay, ease: "power3.out",
        scrollTrigger: { trigger: el, start: "top 88%", once: true },
        onComplete: () => el.classList.add("visible") });
  });
}

function initRevealsFallback() {
  const obs = new IntersectionObserver((entries) => {
    entries.forEach((e) => { if (e.isIntersecting) { e.target.classList.add("visible"); obs.unobserve(e.target); } });
  }, { rootMargin: "-50px 0px" });
  document.querySelectorAll(".reveal").forEach((el) => obs.observe(el));
}

// ── Page entrance animations ──
function initPageAnimations() {
  if (!window.gsap) return;

  // Hero page
  const heroTitle = document.querySelector(".hero-title");
  if (heroTitle) {
    const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
    tl.fromTo(".hero-id", { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: .6 })
      .fromTo(".status-pill", { opacity: 0, y: 12 }, { opacity: 1, y: 0, duration: .5 }, "-=.3")
      .fromTo(heroTitle, { opacity: 0, y: 40 }, { opacity: 1, y: 0, duration: .7 }, "-=.25")
      .fromTo(".hero-bio", { opacity: 0, y: 24 }, { opacity: 1, y: 0, duration: .6 }, "-=.35")
      .fromTo(".hero-actions .btn", { opacity: 0, y: 16 }, { opacity: 1, y: 0, duration: .5, stagger: .1 }, "-=.3")
      .fromTo(".hero-stats", { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: .6 }, "-=.25")
      .fromTo(".terminal", { opacity: 0, y: 30, scale: .97 }, { opacity: 1, y: 0, scale: 1, duration: .7 }, "-=.5");
    return;
  }

  // Inner pages
  const eyebrow = document.querySelector(".eyebrow");
  const pageTitle = document.querySelector(".page-title");
  if (pageTitle) {
    const tl = gsap.timeline({ defaults: { ease: "power3.out" }, delay: .15 });
    if (eyebrow) tl.fromTo(eyebrow, { opacity: 0, x: -12 }, { opacity: 1, x: 0, duration: .5 });
    tl.fromTo(pageTitle, { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: .6 }, eyebrow ? "-=.25" : 0);
    const sub = document.querySelector(".page-sub");
    if (sub) tl.fromTo(sub, { opacity: 0, y: 16 }, { opacity: 1, y: 0, duration: .5 }, "-=.25");
  }
}

// ── Counter animation ──
function initCounters() {
  if (!window.gsap || !window.ScrollTrigger) return;

  document.querySelectorAll(".hero-stats .num, .stat-card .value").forEach((el) => {
    const text = el.textContent.trim();
    const m = text.match(/^(\d+)/);
    if (!m) return;
    const target = parseInt(m[1], 10);
    const suffix = text.replace(m[1], "");

    ScrollTrigger.create({
      trigger: el, start: "top 90%", once: true,
      onEnter: () => {
        gsap.fromTo({ v: 0 }, { v: 0 }, {
          v: target, duration: 1.2, ease: "power2.out",
          onUpdate() { el.textContent = Math.round(this.targets()[0].v) + suffix; }
        });
      }
    });
  });
}

// ── No code rain ──
function initCodeRain() { /* removed — clean design doesn't need Matrix effects */ }

// ── Boot ──
document.addEventListener("DOMContentLoaded", () => {
  if (window.lucide) lucide.createIcons({ nameAttr: "data-lucide" });
  initNavbar();
  initLenis();
  initCursor();

  const year = document.getElementById("year");
  if (year) year.textContent = new Date().getFullYear();

  if (window.gsap) {
    gsap.registerPlugin(ScrollTrigger);
    initPreloader();
    initCounters();
  } else {
    initRevealsFallback();
  }
});
