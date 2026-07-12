/* Home page: typing terminal animation. */

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

// ── Welcome audio player ──
function initAudioPlayer() {
  const audio = document.getElementById("welcome-audio");
  const playBtn = document.getElementById("audio-play-btn");
  const player = document.querySelector(".audio-player");
  if (!audio || !playBtn || !player) return;

  const progressFill = document.getElementById("audio-progress-fill");
  const progressWrap = document.getElementById("audio-progress-wrap");
  const currentEl = document.getElementById("audio-current");
  const totalEl = document.getElementById("audio-total");
  const durationEl = document.getElementById("audio-duration");

  let hasError = false;

  function fmt(sec) {
    if (!sec || !isFinite(sec)) return "0:00";
    const m = Math.floor(sec / 60);
    const s = Math.floor(sec % 60);
    return m + ":" + String(s).padStart(2, "0");
  }

  // Handle missing audio file gracefully
  audio.addEventListener("error", () => {
    hasError = true;
    player.classList.add("has-error");
  });

  audio.addEventListener("loadedmetadata", () => {
    const dur = fmt(audio.duration);
    if (totalEl) totalEl.textContent = dur;
    if (durationEl) durationEl.textContent = dur;
  });

  audio.addEventListener("timeupdate", () => {
    if (!audio.duration) return;
    const pct = (audio.currentTime / audio.duration) * 100;
    if (progressFill) progressFill.style.width = pct + "%";
    if (currentEl) currentEl.textContent = fmt(audio.currentTime);
  });

  audio.addEventListener("ended", () => {
    player.classList.remove("is-playing");
    playBtn.classList.remove("playing");
    updatePlayIcon(false);
    if (progressFill) progressFill.style.width = "0%";
    if (currentEl) currentEl.textContent = "0:00";
  });

  function updatePlayIcon(isPlaying) {
    const icon = document.getElementById("play-icon");
    if (icon) icon.setAttribute("data-lucide", isPlaying ? "pause" : "play");
    if (window.lucide) lucide.createIcons({ nameAttr: "data-lucide" });
  }

  playBtn.addEventListener("click", () => {
    if (hasError) return;
    if (audio.paused) {
      audio.play().then(() => {
        player.classList.add("is-playing");
        playBtn.classList.add("playing");
        updatePlayIcon(true);
      }).catch(() => {});
    } else {
      audio.pause();
      player.classList.remove("is-playing");
      playBtn.classList.remove("playing");
      updatePlayIcon(false);
    }
  });

  // Click on progress bar to seek
  if (progressWrap) {
    const bar = progressWrap.querySelector(".audio-progress-bar");
    if (bar) {
      bar.addEventListener("click", (e) => {
        if (hasError || !audio.duration) return;
        const rect = bar.getBoundingClientRect();
        const pct = (e.clientX - rect.left) / rect.width;
        audio.currentTime = pct * audio.duration;
      });
    }
  }
}

document.addEventListener("DOMContentLoaded", () => {
  typeTerminal();
  initAudioPlayer();
});
