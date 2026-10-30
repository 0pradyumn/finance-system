# Team Split & GitHub Workflow

**Rule of this project:** the frontend (`frontend/`) is **only HTML and CSS**. All JavaScript is backend code (Node.js) in `backend/` and `server.js`.
Pages are HTML files with `{{placeholders}}`; the server fills them and sends them to the browser. Forms use normal HTML `<form>` + HTML5 validation.

| Part | Title | Backend (JS) | Frontend (HTML + CSS) |
|---|---|---|---|
| 1 | Core & Authentication | server.js, backend/core/*, routes/auth | layouts, login, register, error, shared partials, base/layout/components/auth CSS |
| 2 | Accounts & Transactions | routes/accounts, routes/transactions | accounts.html, transactions.html, their partials, transactions.css |
| 3 | Dashboard, Budgets & Goals | routes/dashboard, budgets, goals | dashboard.html, budgets.html, goals.html, partials, budgets-goals.css |
| 4 | Reports & Admin Panel | routes/reports, admin-overview, admin-users, admin-transactions | reports.html, admin-*.html, partials, reports.css |

Per-part file lists: `docs/parts/PART_1.md` ... `PART_4.md`.

## No manual wiring
- Every file in `backend/routes/` is auto-loaded and adds its own sidebar link (`R.nav(...)`).
- Every CSS file in `frontend/css/pages/` is auto-linked into the pages.
So combining = copying the four parts into one folder.

## Combine the 4 parts
```
node part1-core-and-auth/combine-parts.js finance-system part1-core-and-auth part2-accounts-transactions part3-dashboard-budgets-goals part4-reports-admin
cd finance-system
node server.js
```

## Git: main + 4 feature branches
Run once in the project root (needs Git + `git config --global user.name/email`):
```
node tools/setup-git.js https://github.com/YOUR-USERNAME/YOUR-REPO.git
```
Creates `main` (complete project, tag v1.0) and `feature/part-1-core-auth`, `feature/part-2-accounts-transactions`,
`feature/part-3-dashboard-budgets-goals`, `feature/part-4-reports-admin` (each holds only its own files).
Afterwards each member works on their branch and opens a Pull Request into `main`.
