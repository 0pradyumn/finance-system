# Part 3: Dashboard, Budgets & Savings Goals
Suggested owner: ______________________

**Depends on:** Part 1 must be present (Part 2 adds the transaction data shown on the dashboard).

## Files
| File | Purpose |
|---|---|
| `backend/routes/budgets.js` | Routes: budgets |
| `backend/routes/dashboard.js` | Route: dashboard |
| `backend/routes/goals.js` | Routes: savings goals |
| `frontend/css/pages/budgets-goals.css` | Budget and goal panels |
| `frontend/views/budgets.html` | Budgets page |
| `frontend/views/dashboard.html` | Dashboard page |
| `frontend/views/goals.html` | Savings goals page |
| `frontend/views/partials/budget-item.html` | One budget |
| `frontend/views/partials/goal-item.html` | One savings goal |

## Test your part
`node combine-parts.js test part1-core-and-auth <your-part-folder>` then `cd test && node server.js` (http://localhost:3000).

## Rules
- JavaScript only in `backend/` (never in `frontend/`). HTML pages use `{{name}}` (escaped) and `{{{name}}}` (trusted HTML) placeholders.
- A route file exports `function (R)`: `R.nav(role, href, label, order)` adds a sidebar link, `R(method, path, auth, handler)` adds a route.
- Edit only your own files; shared files belong to Part 1.
