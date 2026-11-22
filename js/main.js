// ============================================================
// main.js — Entry point
// Topics covered: 25 (import / export — ES Modules)
// All other topics are imported from their respective modules.
// ============================================================


// ── 25. import / export ───────────────────────────────────────
// ES Modules allow splitting code across files.
// export marks something as available for other files to import.
// import brings named exports into this file's scope.

// Named imports — import specific exported names from each module
import { APP_NAME, isTruthy, formatTaskLabel, formatDate } from "./helpers.js";
import { Task }                                             from "./Task.js";
import {
  addTask, removeTask, toggleTask,
  setTasks, getAllTasks,
  getFilteredTasks, getStats,
  clearCompleted, clearAll,
  appState,
} from "./taskUtils.js";
import { loadInitialTasks }                      from "./api.js";
import { saveTasks, loadTasks, getStorageInfo }  from "./storage.js";


// ── DOM References ─────────────────────────────────────────────
const taskForm      = document.getElementById("taskForm");
const taskListEl    = document.getElementById("taskList");
const statsEl       = document.getElementById("stats");
const loadingMsg    = document.getElementById("loadingMsg");
const filterBtns    = document.querySelectorAll(".filter-btn[data-filter]");
const categoryBtns  = document.querySelectorAll(".cat-btn[data-category]");


// ── Render ─────────────────────────────────────────────────────

function renderTasks() {
  const { activeFilter, activeCategory } = appState; // ── 18. Destructuring ──

  const filtered = getFilteredTasks(activeFilter, activeCategory);

  if (filtered.length === 0) {
    taskListEl.innerHTML = `<p class="empty">No tasks here. Add one above!</p>`;
    return;
  }

  // ── 7. map to build HTML strings, 21. template literals ───
  taskListEl.innerHTML = filtered
    .map((task) => `
      <div class="task-card ${task.completed ? "completed" : ""} priority-${task.priority}" data-id="${task.id}">
        <div class="task-info">
          <span class="task-category">${task.category}</span>
          <h3 class="task-title">${task.title}</h3>
          <span class="task-meta">
            ${task.priority} priority · ${formatDate(task.createdAt)}
          </span>
        </div>
        <div class="task-actions">
          <button class="btn-toggle" data-id="${task.id}">
            ${task.completed ? "↩ Undo" : "✓ Done"}
          </button>
          <button class="btn-delete" data-id="${task.id}">✕</button>
        </div>
      </div>
    `)
    .join("");

  // Event delegation for dynamically created buttons
  taskListEl.querySelectorAll(".btn-toggle").forEach((btn) => {
    btn.addEventListener("click", () => handleToggle(btn.dataset.id));
  });
  taskListEl.querySelectorAll(".btn-delete").forEach((btn) => {
    btn.addEventListener("click", () => handleDelete(btn.dataset.id));
  });
}

function renderStats() {
  const stats = getStats(); // ── 7. reduce (inside getStats) ──

  // ── 5. Truthy check — only show high count badge if > 0 ──
  const highBadge = stats.byPriority.high
    ? `<span>🔴 High: ${stats.byPriority.high}</span>`
    : "";

  statsEl.innerHTML = `
    <span>📋 Total: ${stats.total}</span>
    <span>✅ Done: ${stats.completed}</span>
    <span>⏳ Pending: ${stats.pending}</span>
    ${highBadge}
  `;
}

function render() {
  renderTasks();
  renderStats();
  // Persist current state to localStorage after every change
  saveTasks(getAllTasks().map((t) => t.toJSON())); // ── 7. map, 10. toJSON ──
}


// ── Event Handlers ─────────────────────────────────────────────

function handleToggle(id) {
  toggleTask(id);
  render();
}

function handleDelete(id) {
  removeTask(id);
  render();
}

taskForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const title    = document.getElementById("taskTitle").value.trim();
  const priority = document.getElementById("taskPriority").value;
  const category = document.getElementById("taskCategory").value;

  // ── 5. Truthy/Falsy — empty string is falsy, guard against it ──
  if (!isTruthy(title)) return;

  addTask({ title, priority, category }); // ── 27. Task class used inside addTask ──
  taskForm.reset();
  render();
});

// Status filter buttons
filterBtns.forEach((btn) => {
  btn.addEventListener("click", () => {
    filterBtns.forEach((b) => b.classList.remove("active"));
    btn.classList.add("active");
    appState.activeFilter = btn.dataset.filter; // ── 10. Object.seal (appState) ──
    render();
  });
});

// Category filter buttons
categoryBtns.forEach((btn) => {
  btn.addEventListener("click", () => {
    categoryBtns.forEach((b) => b.classList.remove("active"));
    btn.classList.add("active");
    appState.activeCategory = btn.dataset.category;
    render();
  });
});

document.getElementById("clearCompleted").addEventListener("click", () => {
  clearCompleted();
  render();
});

document.getElementById("clearAll").addEventListener("click", () => {
  if (confirm("Clear ALL tasks? This cannot be undone.")) {
    clearAll();
    render();
  }
});

document.getElementById("showStats").addEventListener("click", () => {
  const stats    = getStats();
  const info     = getStorageInfo();
  const allTasks = getAllTasks();

  // ── 10. Object.entries, 7. forEach ──
  console.group("Task Stats");
  console.table(stats.byPriority);
  console.log("Storage:", info);

  // ── 14. HOF: createPriorityFilter used inline ──
  const highTasks = allTasks.filter((t) => t.priority === "high");
  console.log("High priority tasks:", highTasks.map((t) => t.title));

  // ── 7. some / every ──
  console.log("Has any high priority?", allTasks.some((t) => t.priority === "high"));
  console.log("All completed?",         allTasks.every((t) => t.completed));
  console.groupEnd();

  alert(`Stats logged to console!\nTotal: ${stats.total} | Done: ${stats.completed} | Pending: ${stats.pending}`);
});


// ── App Initialization (async/await entry point) ───────────────

async function init() {
  document.title = APP_NAME; // ── 1. const APP_NAME used here ──

  // ── 26. Try localStorage first ───────────────────────────
  const saved = loadTasks();

  if (saved && saved.length > 0) {
    // ── 7. map, 27. Task.fromJSON ─────────────────────────
    const restored = saved.map((json) => Task.fromJSON(json));
    setTasks(restored);
    loadingMsg?.remove();
    render();
    return;
  }

  // ── 23. async/await, 24. try/catch/finally ───────────────
  try {
    const seedData = await loadInitialTasks(); // ── 22. Promise resolved here ──
    // ── 13. Callback in forEach ───────────────────────────
    seedData.forEach((data) => addTask(data));
  } catch (err) {
    console.error("Initialization error:", err.message);
  } finally {
    loadingMsg?.remove();
    render();
  }
}

init();
