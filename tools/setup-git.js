#!/usr/bin/env node
/* tools/setup-git.js - builds the Git history: one working `main` branch + four feature branches.
   Run ONCE from the project root (folder containing server.js), after installing Git:
       node tools/setup-git.js                      -> creates the local repository
       node tools/setup-git.js <github-repo-url>    -> creates it AND pushes all branches to GitHub
   Result:  main (complete working project)  +  feature/part-1 ... feature/part-4
   Each feature branch contains only its own part's files; main = all four merged together.  */
const { execFileSync } = require('child_process'), fs = require('fs');

const SKELETON = ["README.md", ".gitignore", "package.json", "docs/TEAM_SPLIT.md", "tools/setup-git.js"];
const PARTS = [
  {
    "branch": "feature/part-1-core-auth",
    "msg": "Part 1: core, authentication, shared layout and project tooling",
    "files": [
      "backend/core/components.js",
      "backend/core/config.js",
      "backend/core/db.js",
      "backend/core/helpers.js",
      "backend/core/nav.js",
      "backend/core/response.js",
      "backend/core/router.js",
      "backend/core/static.js",
      "backend/core/view.js",
      "backend/routes/auth.js",
      "combine-parts.js",
      "docs/parts/PART_1.md",
      "frontend/css/auth.css",
      "frontend/css/base.css",
      "frontend/css/components.css",
      "frontend/css/layout.css",
      "frontend/views/error.html",
      "frontend/views/layout-app.html",
      "frontend/views/layout-auth.html",
      "frontend/views/login.html",
      "frontend/views/partials/bar-row.html",
      "frontend/views/partials/card.html",
      "frontend/views/partials/css-link.html",
      "frontend/views/partials/empty-row.html",
      "frontend/views/partials/empty.html",
      "frontend/views/partials/flash-err.html",
      "frontend/views/partials/flash-ok.html",
      "frontend/views/partials/nav-item.html",
      "frontend/views/partials/option.html",
      "frontend/views/partials/progress.html",
      "frontend/views/partials/simple-row.html",
      "frontend/views/partials/tx-row.html",
      "frontend/views/partials/tx-table.html",
      "frontend/views/register.html",
      "server.js"
    ]
  },
  {
    "branch": "feature/part-2-accounts-transactions",
    "msg": "Part 2: accounts and transactions",
    "files": [
      "backend/routes/accounts.js",
      "backend/routes/transactions.js",
      "docs/parts/PART_2.md",
      "frontend/css/pages/transactions.css",
      "frontend/views/accounts.html",
      "frontend/views/partials/account-row.html",
      "frontend/views/partials/cancel-link.html",
      "frontend/views/partials/tx-row-ctl.html",
      "frontend/views/transactions.html"
    ]
  },
  {
    "branch": "feature/part-3-dashboard-budgets-goals",
    "msg": "Part 3: dashboard, budgets and savings goals",
    "files": [
      "backend/routes/budgets.js",
      "backend/routes/dashboard.js",
      "backend/routes/goals.js",
      "docs/parts/PART_3.md",
      "frontend/css/pages/budgets-goals.css",
      "frontend/views/budgets.html",
      "frontend/views/dashboard.html",
      "frontend/views/goals.html",
      "frontend/views/partials/budget-item.html",
      "frontend/views/partials/goal-item.html"
    ]
  },
  {
    "branch": "feature/part-4-reports-admin",
    "msg": "Part 4: reports and admin panel",
    "files": [
      "backend/routes/admin-overview.js",
      "backend/routes/admin-transactions.js",
      "backend/routes/admin-users.js",
      "backend/routes/reports.js",
      "docs/parts/PART_4.md",
      "frontend/css/pages/reports.css",
      "frontend/views/admin-overview.html",
      "frontend/views/admin-transactions.html",
      "frontend/views/admin-users.html",
      "frontend/views/partials/admin-delete.html",
      "frontend/views/partials/admin-toggle.html",
      "frontend/views/partials/admin-user-row.html",
      "frontend/views/partials/trend-col.html",
      "frontend/views/partials/user-mini-row.html",
      "frontend/views/reports.html"
    ]
  }
];

const git = (...a) => execFileSync('git', a, { stdio: 'inherit' });
const out = (...a) => execFileSync('git', a, { encoding: 'utf8' }).trim();
const fail = m => { console.error('\nERROR: ' + m + '\n'); process.exit(1); };

try { execFileSync('git', ['--version'], { stdio: 'ignore' }); } catch { fail('Git is not installed. Install it from https://git-scm.com/downloads, then reopen the terminal.'); }
if (!fs.existsSync('server.js')) fail('Run this from the project root (the folder that contains server.js).');
if (fs.existsSync('.git')) fail('This folder is already a Git repository. Use a fresh copy of the project.');
let name = '', email = '';
try { name = out('config', 'user.name'); email = out('config', 'user.email'); } catch { }
if (!name || !email) fail('Set your Git identity first:\n  git config --global user.name "Your Name"\n  git config --global user.email "you@example.com"');
const missing = [...SKELETON, ...PARTS.flatMap(p => p.files)].filter(f => !fs.existsSync(f));
if (missing.length) fail('Missing files:\n  ' + missing.join('\n  '));

const commit = (files, msg) => { git('add', '--', ...files); git('commit', '-q', '-m', msg); };

git('init', '-q'); git('symbolic-ref', 'HEAD', 'refs/heads/main');
commit(SKELETON, 'Initial commit: README, team docs, package.json, .gitignore');
const base = out('rev-parse', 'HEAD');                    // every feature branch starts from this same point

PARTS.forEach(p => {
  git('checkout', '-q', '-b', p.branch, base);             // branch holds ONLY the shared docs + this part's files
  commit(p.files, p.msg);
  git('checkout', '-q', 'main');
  git('merge', '--no-ff', '-q', '-m', 'Merge ' + p.branch + ' into main', p.branch);
});
git('tag', '-a', 'v1.0', '-m', 'Complete working project');

console.log('\nBranches:'); git('branch');
console.log('\nHistory:'); git('log', '--oneline', '--graph', '--all');

const remote = process.argv[2];
if (remote) {
  git('remote', 'add', 'origin', remote);
  git('push', '-u', 'origin', '--all'); git('push', 'origin', '--tags');
  console.log('\nPushed main + 4 feature branches to ' + remote);
} else {
  console.log('\nTo publish on GitHub: create an EMPTY repository, then run:\n  git remote add origin <repo-url>\n  git push -u origin --all\n  git push origin --tags');
}
console.log('\nDone. You are on branch: ' + out('branch', '--show-current') + '  (run: node server.js)');
