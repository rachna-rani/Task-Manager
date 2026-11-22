// ============================================================
// Task.js
// Topics covered: 27 (Classes), 18 (Destructuring)
// ============================================================

import { generateId, formatTaskLabel } from "./helpers.js";


// ── 27. Classes ───────────────────────────────────────────────
// Classes are a blueprint for creating objects.
// Under the hood they are still prototype-based (syntactic sugar).

export class Task {

  // Static property: belongs to the class itself, not to any instance
  static count = 0;

  // ── 18. Destructuring in parameters ───────────────────────
  // Instead of: constructor(options) { const title = options.title; ... }
  // We destructure the options object directly in the parameter list,
  // and set default values for optional fields.
  constructor({ title, priority = "medium", category = "personal", id = null, completed = false, createdAt = null }) {
    Task.count++;
    this.id        = id || generateId();
    this.title     = title;
    this.priority  = priority;
    this.category  = category;
    this.completed = completed;
    this.createdAt = createdAt || new Date().toISOString();
  }

  // Instance method
  toggle() {
    this.completed = !this.completed;
    return this; // return this allows method chaining
  }

  // Getter: accessed like a property, not called as a method
  get label() {
    return formatTaskLabel(this.title, this.priority, this.category);
  }

  // ── 18. Destructuring in method body ──────────────────────
  // Pick only the fields needed for a plain JSON object
  toJSON() {
    const { id, title, priority, category, completed, createdAt } = this;
    return { id, title, priority, category, completed, createdAt };
  }

  // Static method: called on the class, not on an instance
  // Task.fromJSON(data) — useful for rebuilding from localStorage
  static fromJSON(data) {
    return new Task(data);
  }

  // Static method to reset the counter (used in tests / reloads)
  static resetCount() {
    Task.count = 0;
  }
}
