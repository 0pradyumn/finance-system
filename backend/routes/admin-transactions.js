/* backend/routes/admin-transactions.js - Route: admin all-transactions view  [Part 4: Reports & Admin Panel] */

const { db } = require('../core/db');
const { render } = require('../core/view');
const { page, txTable } = require('../core/components');

module.exports = function (R) {
  R.nav('admin', '/admin/transactions', 'All Transactions', 3);

  R('GET', '/admin/transactions', 'admin', ctx => {
    const names = Object.fromEntries(db.users.map(u => [u.id, u.name]));
    const rows = [...db.transactions].sort((a, b) => b.date.localeCompare(a.date) || b.id - a.id).slice(0, 300).map(t => ({ ...t, user: names[t.userId] }));
    return page(ctx, 'All Transactions', render('admin-transactions', { table: txTable(rows, { col2: 'User' }) }));
  });
};
