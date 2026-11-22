// ============================================================
// helpers.js
// Topics covered: 1 (Variables), 2 (Data Types), 3 (Type Coercion),
//                 4 (== vs ===), 5 (Truthy & Falsy),
//                 19 (Spread Operator), 20 (Rest Operator),
//                 21 (Template Literals)
// ============================================================


// ── 1. Variables ──────────────────────────────────────────────
// const  → block-scoped, cannot be reassigned, use for fixed values
// let    → block-scoped, can be reassigned, use for changing values
// var    → function-scoped, hoisted — avoid in modern JS

export const APP_NAME = "JS Playground";   // const: never reassigned
let _idCounter = 0;                        // let:   changes over time


// ── 2. Data Types ─────────────────────────────────────────────
// JavaScript has 7 primitive types + 1 structural type (object/array/function)

export const PRIORITY_WEIGHTS = {
  string:    "hello world",          // string
  number:    42,                     // number  (integers and floats are both "number")
  float:     3.14,                   // number
  boolean:   true,                   // boolean
  nothing:   null,                   // null    (intentional absence of value)
  missing:   undefined,              // undefined (value not assigned)
  unique:    Symbol("task_id"),      // symbol  (always unique)
  bigNumber: 9007199254740993n,      // bigint  (for numbers beyond Number.MAX_SAFE_INTEGER)
  object:    { a: 1 },              // object
  array:     [1, 2, 3],             // array   (also an object under the hood)
};


// ── 3. Type Coercion ──────────────────────────────────────────
// JavaScript automatically converts types when needed (implicit coercion).
// You can also convert manually (explicit coercion).

export function coercionExamples() {
  const implicit1 = "5" + 3;           // "53"  — number coerces to string (+ prefers string)
  const implicit2 = "5" - 3;           // 2     — string coerces to number (- forces numeric)
  const implicit3 = true + 1;          // 2     — true coerces to 1

  const explicit1 = Number("42");      // 42    — string → number
  const explicit2 = String(100);       // "100" — number → string
  const explicit3 = Boolean(0);        // false — 0 is falsy
  const explicit4 = Boolean("hello");  // true  — non-empty string is truthy

  return { implicit1, implicit2, implicit3, explicit1, explicit2, explicit3, explicit4 };
}


// ── 4. == vs === ──────────────────────────────────────────────
// ==  (loose equality)  → converts types before comparing
// === (strict equality) → no type conversion, checks type AND value

export function equalityExamples() {
  const loose1  = (5 == "5");    // true  — "5" is coerced to 5
  const strict1 = (5 === "5");   // false — different types

  const loose2  = (null == undefined);   // true  — special rule in JS
  const strict2 = (null === undefined);  // false — different types

  const loose3  = (0 == false);   // true  — false coerces to 0
  const strict3 = (0 === false);  // false — number vs boolean

  return { loose1, strict1, loose2, strict2, loose3, strict3 };
}


// ── 5. Truthy & Falsy ─────────────────────────────────────────
// Every value in JS is either truthy or falsy when used in a boolean context.

// All falsy values in JavaScript (there are exactly 6):
export const FALSY_VALUES  = [false, 0, "", null, undefined, NaN];
// Everything else is truthy — including empty arrays [] and empty objects {}
export const TRUTHY_VALUES = [true, 1, "hello", [], {}, -1, "false"];

// !! is a quick way to convert any value to its boolean equivalent
export const isTruthy = (val) => !!val;


// ── 19. Spread Operator ───────────────────────────────────────
// ... unpacks an array or object into individual elements

export function mergeDefaults(defaults, overrides) {
  // Spread object: copies all keys; later keys overwrite earlier ones
  return { ...defaults, ...overrides };
}

export function combineArrays(arr1, arr2) {
  // Spread array: concatenates without mutation
  return [...arr1, ...arr2];
}

// Spread in function calls: Math.max expects individual args, not an array
export const maxOf = (nums) => Math.max(...nums);


// ── 20. Rest Operator ─────────────────────────────────────────
// ... in a function parameter collects remaining arguments into an array
// (same syntax as spread, opposite direction: spread = expand, rest = collect)

export function logWithLabel(label, ...items) {
  // items is now an array of all args after label
  return `[${label}] ${items.join(", ")}`;
}

export function firstAndRest(first, ...rest) {
  return { first, rest };
}


// ── 21. Template Literals ─────────────────────────────────────
// Backtick strings that allow embedded expressions with ${}

export function formatTaskLabel(title, priority, category) {
  const priorityIcon = priority === "high" ? "🔴" : priority === "medium" ? "🟡" : "🟢";
  // Multi-line and expression embedding — no string concatenation needed
  return `${priorityIcon} [${priority.toUpperCase()}] ${title} · ${category}`;
}

export function formatDate(isoString) {
  const date = new Date(isoString);
  return `${date.toLocaleDateString()} at ${date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}`;
}

export function generateId() {
  return `task_${Date.now()}_${++_idCounter}`;
}
