// ============================================================
// api.js
// Topics covered: 22 (Promises), 23 (async/await), 24 (try/catch/finally)
// ============================================================


// Seed data to simulate a remote API response
const SEED_TASKS = [
  { title: "Learn JavaScript Promises", priority: "high",   category: "learning" },
  { title: "Build a React project",     priority: "medium", category: "learning" },
  { title: "Review pull requests",      priority: "high",   category: "work"     },
  { title: "Morning run",               priority: "low",    category: "personal" },
  { title: "Read documentation",        priority: "medium", category: "learning" },
];

// Helper: wraps setTimeout in a Promise so we can await it
const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));


// ── 22. Promises ──────────────────────────────────────────────
// A Promise is an object that represents a value not yet available.
// It has three states: pending → fulfilled (resolved) or rejected.
//
// new Promise((resolve, reject) => { ... })
//   resolve(value) → marks the promise as fulfilled
//   reject(error)  → marks the promise as rejected

export function fetchTasksPromise() {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const networkOk = true; // flip to false to simulate a failure

      if (networkOk) {
        resolve(SEED_TASKS);        // success path
      } else {
        reject(new Error("Network error: could not load tasks")); // failure path
      }
    }, 700);
  });
}

// Promise chaining with .then() / .catch() / .finally()
// Each .then() returns a NEW promise, allowing chaining.
export function fetchAndTransform() {
  return fetchTasksPromise()
    .then((tasks) => {
      console.log("Step 1 — received tasks:", tasks.length);
      return tasks.map((t) => ({ ...t, source: "remote" })); // transform
    })
    .then((tasks) => {
      console.log("Step 2 — filtering low priority");
      return tasks.filter((t) => t.priority !== "low");      // filter
    })
    .catch((err) => {
      console.error("Promise chain caught:", err.message);
      return []; // fallback
    })
    .finally(() => {
      console.log("Promise chain settled (always runs)");
    });
}


// ── 23. async / await ─────────────────────────────────────────
// async/await is syntactic sugar over Promises — same thing, cleaner syntax.
//
// async before a function means it always returns a Promise.
// await before a Promise pauses execution of this async function until
// the promise resolves, then returns its value.

export async function loadInitialTasks() {
  // ── 24. try / catch / finally ─────────────────────────────
  // try    → code that might throw or reject
  // catch  → runs if an error is thrown (catches Promise rejections too)
  // finally → ALWAYS runs, whether success or failure — use for cleanup

  try {
    console.log("Fetching tasks...");

    const tasks = await fetchTasksPromise(); // pauses here until resolved/rejected
    await wait(100);                         // simulate a bit of processing time

    console.log(`Loaded ${tasks.length} tasks successfully`);
    return tasks;

  } catch (error) {
    // If the Promise rejects, error lands here
    console.error("Failed to load tasks:", error.message);
    return []; // return empty array as a safe fallback

  } finally {
    // This runs no matter what — good for hiding loaders, closing connections
    console.log("loadInitialTasks: finished (finally block)");
  }
}


// Running two Promises in parallel with Promise.all
// If ANY of the promises rejects, Promise.all rejects immediately.
export async function loadResources() {
  try {
    const [tasks, config] = await Promise.all([
      fetchTasksPromise(),
      Promise.resolve({ version: "1.0.0", theme: "dark" }), // already-resolved promise
    ]);

    return { tasks, config };
  } catch (err) {
    throw new Error(`Resource load failed: ${err.message}`); // re-throw with context
  }
}
