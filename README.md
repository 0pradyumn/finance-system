# Banking and Personal Finance Management System
GLA University, Mathura - B.Tech CSE 3rd Year

**Frontend: HTML + CSS only.  Backend: Node.js (JavaScript) + JSON database.**

## Run
1. Install Node.js 16.7+ (https://nodejs.org).
2. In the project folder (the one with `server.js`): `node server.js`
3. Open http://localhost:3000  (other port: `PORT=8080 node server.js`; PowerShell: `$env:PORT=8080; node server.js`)

No `npm install` needed. Database file `bank-data.json` is created automatically (delete it to reset).

## Logins
- Admin: `admin@bank.com` / `Admin@123` (change after first login: Admin > Users > Reset)
- Customer: click **Register** on the login page.

## Features
**Customer:** Dashboard, Accounts, Transactions (add/edit/delete/filter), Budgets, Savings Goals, Reports + CSV export.
**Admin:** Overview, Users (enable/disable, reset password, delete), All Transactions.

## Folder structure
```
finance-system/
├── server.js                 entry point (backend)
├── package.json  .gitignore  combine-parts.js
├── backend/                  ALL JavaScript lives here
│   ├── core/    config, db, helpers, response, view (template engine), nav, static, components, router
│   └── routes/  auth, accounts, transactions, dashboard, budgets, goals, reports,
│                admin-overview, admin-users, admin-transactions
├── frontend/                 ONLY HTML + CSS
│   ├── views/   layout-app, layout-auth, login, register, error, dashboard, accounts, transactions,
│   │            budgets, goals, reports, admin-overview, admin-users, admin-transactions
│   │   └── partials/   small reusable HTML pieces (rows, cards, progress bar, ...)
│   └── css/     base, layout, components, auth  + pages/ (transactions, budgets-goals, reports)
├── docs/        TEAM_SPLIT.md, parts/PART_1..4.md
└── tools/       setup-git.js
```

## How it works
Browser -> HTML form / link -> Node route (`backend/routes/*.js`) -> validates + reads/writes `bank-data.json`
-> fills an HTML template (`frontend/views/*.html`) -> sends finished HTML to the browser. No JavaScript runs in the browser.
Security: scrypt-hashed passwords, HttpOnly session cookie (7 days), per-user ownership checks, admin-only routes, HTML-escaped output.
The system manages records only; it does not execute real banking transactions.

Team split and GitHub steps: `docs/TEAM_SPLIT.md`.
