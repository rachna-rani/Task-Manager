# JS Playground — Task Manager

A fully working **Task Manager** web app built to demonstrate all **27 core JavaScript concepts** in one project.

🔗 **Live Demo:** [https://YOUR_USERNAME.github.io/js-playground-github](https://YOUR_USERNAME.github.io/js-playground-github)

---

## What This Project Is

This is not just a task manager — every feature is intentionally built to show a specific JavaScript concept in action. When you click a button, filter tasks, or refresh the page, real JavaScript topics are running behind the scenes.

---

## 27 JavaScript Concepts Covered

| # | Topic | Where it runs |
|---|-------|--------------|
| 1 | Variables (`const`, `let`) | App name, task array |
| 2 | Data Types | Task object fields |
| 3 | Type Coercion | `helpers.js` demo |
| 4 | `==` vs `===` | All comparisons |
| 5 | Truthy & Falsy | Add button — blocks empty input |
| 6 | Arrays | The entire task list |
| 7 | Array Methods (`map` `filter` `reduce` `find` `some` `every` `forEach`) | Rendering, filtering, stats |
| 8 | `slice` vs `splice` | Delete button, recent tasks |
| 9 | Objects | Priority config lookup |
| 10 | Object Methods (`keys` `values` `entries` `assign` `freeze` `seal`) | App state, config |
| 11 | Functions | All button handlers |
| 12 | Arrow Functions | Short utilities |
| 13 | Callback Functions | Every event listener |
| 14 | Higher Order Functions | `createPriorityFilter()` |
| 15 | Scope | Private task array |
| 16 | Hoisting | Function called before definition |
| 17 | Closure | Private operation counter |
| 18 | Destructuring | Task constructor |
| 19 | Spread Operator | Safe array copy, object merge |
| 20 | Rest Operator | `logWithLabel(label, ...items)` |
| 21 | Template Literals | Every task card's HTML |
| 22 | Promises | Seed data fetch on first load |
| 23 | `async` / `await` | Page initialization |
| 24 | `try` / `catch` / `finally` | Error handling + loading state |
| 25 | `import` / `export` (ES Modules) | All 6 JS files |
| 26 | `localStorage` & `sessionStorage` | Tasks saved across refreshes |
| 27 | Classes | Every task is a `Task` instance |

---

## Features

- Add tasks with title, priority, and category
- Mark tasks as done / undo completion
- Delete individual tasks
- Filter by status — All / Active / Completed
- Filter by category — Work / Personal / Learning
- Stats bar — total, done, pending counts
- Tasks saved to `localStorage` — survive page refresh
- Seed data loads on first visit using Promises + async/await
- Fully responsive — works on mobile and desktop

---

## Project Structure

```
js-playground-github/
│
├── index.html          → Page structure
├── style.css           → All styling + mobile responsive
├── package.json        → npm start script
│
├── GUIDE.md            → Full explanation of all 27 topics
├── UI_GUIDE.md         → Every UI section and button explained
│
└── js/
    ├── main.js         → Entry point (Topic 25 — ES Modules)
    ├── Task.js         → Task class (Topic 27, 18)
    ├── taskUtils.js    → Core logic (Topics 6–17)
    ├── helpers.js      → Utilities (Topics 1–5, 19–21)
    ├── api.js          → Async data (Topics 22–24)
    └── storage.js      → localStorage (Topic 26)
```

---

## How to Run Locally

```bash
# Clone the repo
git clone https://github.com/YOUR_USERNAME/js-playground-github.git

# Go into the folder
cd js-playground-github

# Start local server
npm start

# Open in browser
http://localhost:3000
```

> This project uses ES Modules (`import`/`export`). You must run it through a local server — opening `index.html` directly will not work.

---

## How to View on Mobile

**Option 1 — Real phone (same WiFi):**
1. Find your laptop IP: run `ipconfig getifaddr en0` in terminal
2. Open `http://YOUR_LAPTOP_IP:3000` on your phone browser

**Option 2 — Simulate on laptop:**
1. Open `http://localhost:3000`
2. Press `F12` → click the mobile icon or press `Ctrl+Shift+M`
3. Pick a device like iPhone 14 (390 × 844)

---

## Screenshots

> Add screenshots here after deploying

---

## Tech Stack

| Technology | Usage |
|-----------|-------|
| HTML5 | Page structure |
| CSS3 | Styling, CSS variables, Grid, Flexbox, media queries |
| Vanilla JavaScript (ES2022) | All logic, no frameworks |
| ES Modules | File structure |
| localStorage API | Data persistence |

---

## Learning Purpose

This project was built as a JavaScript learning reference. Every concept is annotated in the source code with comments like:

```js
// ── 17. Closure ───────────────────────────────────────────────
function makeCounter(label) {
  let count = 0; // this variable is "closed over"
  return {
    increment: () => ++count,
    getCount:  () => count,
  };
}
```

Read `GUIDE.md` for a full topic-by-topic explanation.
Read `UI_GUIDE.md` for a full breakdown of every UI element and button.

---

## License

MIT — free to use and learn from.
