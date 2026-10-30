# Part 1: Core & Authentication
Suggested owner: ______________________

**Depends on:** Nothing - base of the project. Alone it gives working login/register (panels have no pages yet).

## Files
| File | Purpose |
|---|---|
| `.gitignore` | Git ignore |
| `README.md` | README |
| `backend/core/components.js` | Reusable HTML pieces + page layouts |
| `backend/core/config.js` | Server settings |
| `backend/core/db.js` | JSON database, password hashing, default admin |
| `backend/core/helpers.js` | Validation + calculation helpers |
| `backend/core/nav.js` | Sidebar menu registry (each route file adds its own link) |
| `backend/core/response.js` | send(), redirect(), cookies |
| `backend/core/router.js` | Request router: cookies, sessions, forms, roles, errors |
| `backend/core/static.js` | Serves frontend/css files |
| `backend/core/view.js` | Template engine for the HTML files |
| `backend/routes/auth.js` | Routes: login, register, logout, home |
| `combine-parts.js` | Merge tool |
| `frontend/css/auth.css` | Login / register screen |
| `frontend/css/base.css` | Reset, typography, inputs, buttons |
| `frontend/css/components.css` | Cards, grids, tables, forms, progress bars, tags |
| `frontend/css/layout.css` | Sidebar + main layout, responsive rules |
| `frontend/views/error.html` | Error page |
| `frontend/views/layout-app.html` | Page layout: sidebar + content |
| `frontend/views/layout-auth.html` | Layout for login / register / error pages |
| `frontend/views/login.html` | Login page |
| `frontend/views/partials/bar-row.html` | Label + value + progress bar |
| `frontend/views/partials/card.html` | Stat card |
| `frontend/views/partials/css-link.html` | Stylesheet link |
| `frontend/views/partials/empty-row.html` | Empty table row |
| `frontend/views/partials/empty.html` | Empty message |
| `frontend/views/partials/flash-err.html` | Red message |
| `frontend/views/partials/flash-ok.html` | Green message |
| `frontend/views/partials/nav-item.html` | Sidebar link |
| `frontend/views/partials/option.html` | Select option |
| `frontend/views/partials/progress.html` | Progress bar |
| `frontend/views/partials/simple-row.html` | Label + value |
| `frontend/views/partials/tx-row.html` | Transaction row (read-only) |
| `frontend/views/partials/tx-table.html` | Transactions table |
| `frontend/views/register.html` | Register page |
| `package.json` | npm start |
| `server.js` | Entry point: node server.js |

## Test your part
`node combine-parts.js test part1-core-and-auth <your-part-folder>` then `cd test && node server.js` (http://localhost:3000).

## Rules
- JavaScript only in `backend/` (never in `frontend/`). HTML pages use `{{name}}` (escaped) and `{{{name}}}` (trusted HTML) placeholders.
- A route file exports `function (R)`: `R.nav(role, href, label, order)` adds a sidebar link, `R(method, path, auth, handler)` adds a route.
- Edit only your own files; shared files belong to Part 1.
