// ============================================================
// taskUtils.js
// Topics covered:
//   6  (Arrays),  7  (Array Methods),  8  (slice vs splice),
//   9  (Objects), 10 (Object Methods),
//   11 (Functions), 12 (Arrow Functions), 13 (Callback Functions),
//   14 (Higher Order Functions), 15 (Scope), 16 (Hoisting), 17 (Closure)
// ============================================================

import { Task } from "./Task.js";


// ── 16. Hoisting ──────────────────────────────────────────────
// Function DECLARATIONS are hoisted — you can call them before the definition.
// This works because the JS engine moves function declarations to the top
// of their scope before executing any code.

console.log("Hoisting demo:", getAppVersion()); // called BEFORE the definition below — works!

function getAppVersion() {
  return "v1.0.0";
}

// Arrow functions and function expressions are NOT hoisted the same way:
// calling taskSorter before this line would throw ReferenceError
const taskSorter = (a, b) => a.createdAt.localeCompare(b.createdAt);


// ── 15. Scope ─────────────────────────────────────────────────
// Block scope: let/const are only accessible inside the {} they're declared in.
// Module scope: everything declared at top level here is private to this module
//               unless exported.

{
  let blockOnly = "I only exist in this block";
  const alsoBlockOnly = 42;
  // These are not accessible outside the {}
}
// console.log(blockOnly); // ReferenceError


// ── 6. Arrays — the main data store ──────────────────────────
let tasks = [];   // module-level array — private to this module


// ── 17. Closure ───────────────────────────────────────────────
// A closure is a function that "remembers" variables from its outer scope
// even after the outer function has returned.
//
// makeCounter() returns an object of functions.
// Each returned function closes over the `count` variable —
// they all share the same `count` and can read/modify it.

function makeCounter(label) {
  let count = 0; // this variable is "enclosed" — lives as long as the returned fns do

  return {
    increment: () => ++count,
    decrement: () => Math.max(0, --count),
    reset:     () => { count = 0; },
    getCount:  () => count,
    label,
  };
}

export const operationLog = makeCounter("operations");


// ── 11. Functions ─────────────────────────────────────────────
// Standard function declaration — named, hoisted

export function addTask(taskData) {
  const task = new Task(taskData);
  tasks.push(task);
  operationLog.increment();
  return task;
}

export function removeTask(id) {
  // ── 8. splice — MUTATES the original array ────────────────
  // splice(startIndex, deleteCount) removes elements in place
  const index = tasks.findIndex((t) => t.id === id);
  if (index !== -1) {
    tasks.splice(index, 1); // removes exactly 1 element at `index`
    operationLog.increment();
  }
}

export function setTasks(newTasks) {
  tasks = newTasks;
}

export function getAllTasks() {
  // Return a shallow copy so callers can't directly mutate the internal array
  return [...tasks];
}


// ── 12. Arrow Functions ───────────────────────────────────────
// Shorter syntax, no own `this` binding — great for one-liners and callbacks

export const getTaskById    = (id)  => tasks.find((t) => t.id === id);
export const toggleTask     = (id)  => { const t = getTaskById(id); if (t) t.toggle(); return t; };
export const clearCompleted = ()    => { tasks = tasks.filter((t) => !t.completed); };
export const clearAll       = ()    => { tasks = []; };


// ── 7. Array Methods ──────────────────────────────────────────

// map — returns a NEW array by transforming every element
export const getTaskTitles = () =>
  tasks.map((t) => t.title);

// filter — returns a NEW array with only matching elements
export const getActiveTasks    = () => tasks.filter((t) => !t.completed);
export const getCompletedTasks = () => tasks.filter((t) => t.completed);

// reduce — collapses array into a single value (here: an object)
export const getStats = () =>
  tasks.reduce(
    (acc, task) => {
      acc.total++;
      task.completed ? acc.completed++ : acc.pending++;
      acc.byPriority[task.priority] = (acc.byPriority[task.priority] || 0) + 1;
      return acc;
    },
    { total: 0, completed: 0, pending: 0, byPriority: {} }
  );

// forEach — runs a function for each element, returns undefined (side-effects only)
export const logAllTasks = () =>
  tasks.forEach((t) => console.log(t.label));

// find — returns the FIRST element that matches, or undefined
export const findByPriority = (p) => tasks.find((t) => t.priority === p);

// some — returns true if AT LEAST ONE element matches
export const hasHighPriority = () => tasks.some((t) => t.priority === "high");

// every — returns true if ALL elements match
export const allCompleted = () =>
  tasks.length > 0 && tasks.every((t) => t.completed);

// ── 8. slice — returns a NEW array, no mutation ───────────────
// slice(start, end) — does NOT modify the original
export const getRecentTasks = (n = 3) => tasks.slice(-n);  // last n tasks
export const getFirstTask   = ()      => tasks.slice(0, 1); // copy of first item


// ── 9. Objects ────────────────────────────────────────────────
// Plain objects used as config/lookup tables

const PRIORITY_META = {
  low:    { icon: "🟢", weight: 1, label: "Low" },
  medium: { icon: "🟡", weight: 2, label: "Medium" },
  high:   { icon: "🔴", weight: 3, label: "High" },
};

const CATEGORY_META = {
  work:     { icon: "💼", color: "#6366f1" },
  personal: { icon: "🏠", color: "#22c55e" },
  learning: { icon: "📚", color: "#f59e0b" },
};


// ── 10. Object Methods ────────────────────────────────────────

// Object.keys()    → array of key names
export const getPriorityKeys = () => Object.keys(PRIORITY_META);       // ["low","medium","high"]

// Object.values()  → array of values
export const getPriorityMeta = () => Object.values(PRIORITY_META);     // [{icon,weight,...}, ...]

// Object.entries() → array of [key, value] pairs
export const getPriorityList = () => Object.entries(PRIORITY_META);    // [["low",{...}], ...]

// Object.assign()  → copies properties from source(s) into target
export const enrichTask = (task) =>
  Object.assign({}, task.toJSON(), { icon: PRIORITY_META[task.priority].icon });

// Object.freeze()  → prevents any changes (add/update/delete) — throws in strict mode
export const DEFAULT_FILTERS = Object.freeze({ status: "all", category: "all" });
// DEFAULT_FILTERS.status = "active"; // silently fails (or throws in strict mode)

// Object.seal()    → no new properties can be added/removed, but existing values CAN change
export const appState = Object.seal({ activeFilter: "all", activeCategory: "all" });
// appState.newProp = "x"; // silently fails
// appState.activeFilter = "active"; // ✓ this works


// ── 13. Callback Functions ────────────────────────────────────
// A callback is a function passed as an argument to another function.
// The receiving function calls it at the right time.

export function filterTasks(callbackFn) {
  // callbackFn is called for each task — it's a callback
  return tasks.filter(callbackFn);
}

// Usage: filterTasks(task => task.priority === "high")


// ── 14. Higher Order Functions ────────────────────────────────
// A higher-order function either:
//   a) takes a function as argument (like filter, map, reduce — all HOFs), OR
//   b) returns a new function

// createPriorityFilter is a HOF — it RETURNS a function
export function createPriorityFilter(priority) {
  return (task) => task.priority === priority; // the returned function is a closure
}

// createCategoryFilter is also a HOF
export const createCategoryFilter = (category) => (task) => task.category === category;

// getFilteredTasks uses both callbacks and HOFs internally
export const getFilteredTasks = (status = "all", category = "all") =>
  tasks
    .filter((t) => {
      if (status === "active")    return !t.completed;
      if (status === "completed") return t.completed;
      return true;
    })
    .filter((t) => category === "all" || t.category === category);
