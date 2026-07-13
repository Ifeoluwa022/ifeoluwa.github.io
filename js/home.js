/* Home page: typing terminal animation + ambient audio toggle. */

const TERMINAL_LINES = [
  { prompt: "$ whoami", output: "ifeoluwa-salau" },
  { prompt: "$ cat role.txt", output: "Software Engineering Student — Miva Open University" },
  { prompt: "$ ls skills/", output: "html  css  javascript  python  git" },
  { prompt: "$ ./build_future.sh", output: "Compiling dreams... done ✓", ok: true },
];

function typeTerminal() {
  const body = document.getElementById("terminal-body");
  if (!body) return;

  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // Reduced motion: render everything at once.
  if (reducedMotion) {
    body.innerHTML = TERMINAL_LINES.map(
      (l) =>
        `<div><span class="prompt">${l.prompt}</span></div>` +
        `<div><span class="${l.ok ? "ok" : "output"}">${l.output}</span></div>`
    ).join("");
    return;
  }

  let lineIndex = 0;

  function typeLine() {
    if (lineIndex >= TERMINAL_LINES.length) {
      // Loop: pause, clear, restart.
      setTimeout(() => {
        body.innerHTML = "";
        lineIndex = 0;
        typeLine();
      }, 4000);
      return;
    }

    const line = TERMINAL_LINES[lineIndex];
    const promptEl = document.createElement("div");
    const promptSpan = document.createElement("span");
    promptSpan.className = "prompt";
    promptEl.appendChild(promptSpan);

    const cursor = document.createElement("span");
    cursor.className = "terminal-cursor";
    promptEl.appendChild(cursor);
    body.appendChild(promptEl);

    let charIndex = 0;

    const interval = setInterval(() => {
      promptSpan.textContent = line.prompt.slice(0, ++charIndex);

      if (charIndex >= line.prompt.length) {
        clearInterval(interval);
        cursor.remove();

        setTimeout(() => {
          const outputEl = document.createElement("div");
          const outputSpan = document.createElement("span");
          outputSpan.className = line.ok ? "ok" : "output";
          outputSpan.textContent = line.output;
          outputEl.appendChild(outputSpan);
          body.appendChild(outputEl);

          lineIndex++;
          setTimeout(typeLine, 500);
        }, 350);
      }
    }, 55);
  }

  typeLine();
}

// ── Ambient audio toggle ──
function initAmbientAudio() {
  const audio = document.getElementById("ambient-audio");
  const toggle = document.getElementById("ambient-toggle");
  const icon = document.getElementById("ambient-icon");
  if (!audio || !toggle || !icon) return;

  let isPlaying = false;

  // Browsers block autoplay, so we start muted and wait for user interaction.
  audio.volume = 0.15;

  toggle.addEventListener("click", () => {
    if (isPlaying) {
      audio.pause();
      toggle.classList.remove("playing");
      icon.setAttribute("data-lucide", "volume-x");
      isPlaying = false;
    } else {
      audio.play().then(() => {
        toggle.classList.add("playing");
        icon.setAttribute("data-lucide", "volume-2");
        isPlaying = true;
      }).catch(() => {
        // Autoplay blocked or file failed to load.
        toast.error("Could not play audio");
      });
    }
    if (window.lucide) lucide.createIcons({ nameAttr: "data-lucide" });
  });

  // If the audio fails to load, hide the toggle so it doesn't confuse visitors.
  audio.addEventListener("error", () => {
    toggle.style.display = "none";
  });
}

document.addEventListener("DOMContentLoaded", () => {
  typeTerminal();
  initAmbientAudio();
});