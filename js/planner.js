/* Academic Planner: localStorage-backed task CRUD (replaces the React Planner). */

const STORAGE_KEY = "ifeoluwa_academic_tasks";

const PRIORITIES = {
  high: { label: "High", color: "#EF4444" },
  medium: { label: "Medium", color: "#F59E0B" },
  low: { label: "Low", color: "#10B981" },
};

let tasks = [];
let selectedPriority = "medium";

function loadTasks() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : [];
  } catch {
    return [];
  }
}

function saveTasks() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
}

function renderStats() {
  const total = tasks.length;
  const done = tasks.filter((t) => t.completed).length;
  document.getElementById("stat-total").textContent = total;
  document.getElementById("stat-done").textContent = done;
  document.getElementById("stat-pending").textContent = total - done;
}

function escapeHtml(str) {
  const div = document.createElement("div");
  div.textContent = str;
  return div.innerHTML;
}

function renderTasks() {
  const emptyState = document.getElementById("empty-state");
  const tableWrap = document.getElementById("table-wrap");
  const tbody = document.getElementById("task-tbody");

  renderStats();

  if (tasks.length === 0) {
    emptyState.style.display = "";
    tableWrap.style.display = "none";
    return;
  }

  emptyState.style.display = "none";
  tableWrap.style.display = "";

  tbody.innerHTML = tasks
    .map((task) => {
      const p = PRIORITIES[task.priority];
      return `
      <tr data-id="${task.id}">
        <td>
          <button class="toggle-btn ${task.completed ? "done" : ""}" data-action="toggle" title="Toggle complete" aria-label="Toggle complete">
            <i data-lucide="${task.completed ? "check-circle-2" : "circle"}"></i>
          </button>
        </td>
        <td class="task-title ${task.completed ? "done" : ""}">${escapeHtml(task.title)}</td>
        <td class="task-due hide-sm">${escapeHtml(task.due)}</td>
        <td>
          <span class="priority-pill" style="color: ${p.color}">
            <span class="dot" style="background-color: ${p.color}"></span>
            ${p.label}
          </span>
        </td>
        <td class="actions">
          <button class="delete-btn" data-action="delete" title="Delete task" aria-label="Delete task">
            <i data-lucide="trash-2" class="icon-sm"></i>
          </button>
        </td>
      </tr>`;
    })
    .join("");

  if (window.lucide) lucide.createIcons({ nameAttr: "data-lucide" });
}

function addTask(e) {
  e.preventDefault();

  const titleInput = document.getElementById("task-title");
  const dueInput = document.getElementById("task-due");
  const title = titleInput.value.trim();

  if (!title) {
    toast.error("Please enter a task title");
    return;
  }

  tasks.unshift({
    id: Date.now(),
    title,
    due: dueInput.value || "—",
    priority: selectedPriority,
    completed: false,
  });

  saveTasks();
  renderTasks();

  // Animate the newly added row in.
  const firstRow = document.querySelector("#task-tbody tr");
  if (firstRow) {
    firstRow.classList.add("entering");
    requestAnimationFrame(() =>
      requestAnimationFrame(() => firstRow.classList.remove("entering"))
    );
  }

  titleInput.value = "";
  dueInput.value = "";
  setPriority("medium");
  toast.success("Task added");
}

function setPriority(key) {
  selectedPriority = key;
  document.querySelectorAll(".priority-btn").forEach((btn) => {
    const isSelected = btn.dataset.priority === key;
    btn.classList.toggle("selected", isSelected);
    btn.style.backgroundColor = isSelected ? PRIORITIES[key].color : "";
  });
}

document.addEventListener("DOMContentLoaded", () => {
  tasks = loadTasks();
  renderTasks();
  setPriority("medium");

  document.getElementById("task-form").addEventListener("submit", addTask);

  document.querySelectorAll(".priority-btn").forEach((btn) => {
    btn.addEventListener("click", () => setPriority(btn.dataset.priority));
  });

  // Event delegation for toggle/delete on table rows.
  document.getElementById("task-tbody").addEventListener("click", (e) => {
    const btn = e.target.closest("button[data-action]");
    if (!btn) return;

    const row = btn.closest("tr");
    const id = Number(row.dataset.id);

    if (btn.dataset.action === "toggle") {
      tasks = tasks.map((t) =>
        t.id === id ? { ...t, completed: !t.completed } : t
      );
      saveTasks();
      renderTasks();
    } else if (btn.dataset.action === "delete") {
      row.classList.add("leaving");
      setTimeout(() => {
        tasks = tasks.filter((t) => t.id !== id);
        saveTasks();
        renderTasks();
        toast.success("Task deleted");
      }, 250);
    }
  });
});
