// ============================================================
// storage.js
// Topics covered: 26 (localStorage & sessionStorage)
// ============================================================


// ── 26. localStorage ──────────────────────────────────────────
// localStorage persists data with NO expiry — survives browser restarts.
// Stored as key-value pairs where both key and value must be strings.
// Use JSON.stringify / JSON.parse to store objects/arrays.

const LS_TASKS_KEY   = "jsplayground_tasks";
const LS_FILTERS_KEY = "jsplayground_filters";

export function saveTasks(tasks) {
  localStorage.setItem(LS_TASKS_KEY, JSON.stringify(tasks));
}

export function loadTasks() {
  const raw = localStorage.getItem(LS_TASKS_KEY);
  return raw ? JSON.parse(raw) : null;
}

export function saveFilters(filters) {
  localStorage.setItem(LS_FILTERS_KEY, JSON.stringify(filters));
}

export function loadFilters() {
  const raw = localStorage.getItem(LS_FILTERS_KEY);
  return raw ? JSON.parse(raw) : null;
}

export function clearStorage() {
  localStorage.removeItem(LS_TASKS_KEY);
  localStorage.removeItem(LS_FILTERS_KEY);
}


// ── 26. sessionStorage ────────────────────────────────────────
// sessionStorage works exactly like localStorage but is CLEARED when
// the browser tab is closed (session ends). Good for temporary state.

const SS_SESSION_KEY = "jsplayground_session";

export function saveSession(data) {
  sessionStorage.setItem(SS_SESSION_KEY, JSON.stringify(data));
}

export function loadSession() {
  const raw = sessionStorage.getItem(SS_SESSION_KEY);
  return raw ? JSON.parse(raw) : null;
}

export function clearSession() {
  sessionStorage.removeItem(SS_SESSION_KEY);
}


// Storage info (useful for debugging)
export function getStorageInfo() {
  const raw = localStorage.getItem(LS_TASKS_KEY);
  return {
    hasData:   !!raw,
    taskCount: raw ? JSON.parse(raw).length : 0,
    sizeBytes: raw ? new Blob([raw]).size : 0,
  };
}
