# Part 4: Reports & Admin Panel
Suggested owner: ______________________

**Depends on:** Part 1 must be present (reports read data created by Parts 2 and 3).

## Files
| File | Purpose |
|---|---|
| `backend/routes/admin-overview.js` | Route: admin overview |
| `backend/routes/admin-transactions.js` | Route: admin all-transactions view |
| `backend/routes/admin-users.js` | Routes: admin user management |
| `backend/routes/reports.js` | Routes: reports + CSV export |
| `frontend/css/pages/reports.css` | Reports 6-month trend chart |
| `frontend/views/admin-overview.html` | Admin overview page |
| `frontend/views/admin-transactions.html` | Admin transactions page |
| `frontend/views/admin-users.html` | Admin users page |
| `frontend/views/partials/admin-delete.html` | Delete user with confirmation |
| `frontend/views/partials/admin-toggle.html` | Enable/Disable button |
| `frontend/views/partials/admin-user-row.html` | User table row with actions |
| `frontend/views/partials/trend-col.html` | Trend chart column |
| `frontend/views/partials/user-mini-row.html` | Recent user row |
| `frontend/views/reports.html` | Reports page |

## Test your part
`node combine-parts.js test part1-core-and-auth <your-part-folder>` then `cd test && node server.js` (http://localhost:3000).

## Rules
- JavaScript only in `backend/` (never in `frontend/`). HTML pages use `{{name}}` (escaped) and `{{{name}}}` (trusted HTML) placeholders.
- A route file exports `function (R)`: `R.nav(role, href, label, order)` adds a sidebar link, `R(method, path, auth, handler)` adds a route.
- Edit only your own files; shared files belong to Part 1.
