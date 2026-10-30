# Part 2: Accounts & Transactions
Suggested owner: ______________________

**Depends on:** Part 1 must be present.

## Files
| File | Purpose |
|---|---|
| `backend/routes/accounts.js` | Routes: accounts |
| `backend/routes/transactions.js` | Routes: transactions (list, filter, add, edit, delete) |
| `frontend/css/pages/transactions.css` | Transactions page filters |
| `frontend/views/accounts.html` | Accounts page |
| `frontend/views/partials/account-row.html` | Account table row |
| `frontend/views/partials/cancel-link.html` | Cancel edit link |
| `frontend/views/partials/tx-row-ctl.html` | Transaction row with Edit/Delete |
| `frontend/views/transactions.html` | Transactions page |

## Test your part
`node combine-parts.js test part1-core-and-auth <your-part-folder>` then `cd test && node server.js` (http://localhost:3000).

## Rules
- JavaScript only in `backend/` (never in `frontend/`). HTML pages use `{{name}}` (escaped) and `{{{name}}}` (trusted HTML) placeholders.
- A route file exports `function (R)`: `R.nav(role, href, label, order)` adds a sidebar link, `R(method, path, auth, handler)` adds a route.
- Edit only your own files; shared files belong to Part 1.
