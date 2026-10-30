/* backend/routes/admin-overview.js - Route: admin overview  [Part 4: Reports & Admin Panel] */

const { db } = require('../core/db');
const { sum, pub } = require('../core/helpers');
const { render, each, money } = require('../core/view');
const { page, card, emptyRow } = require('../core/components');

module.exports = function (R) {
  R.nav('admin', '/admin', 'Overview', 1);

  R('GET', '/admin', 'admin', ctx => {
    const cust = db.users.filter(u => u.role === 'customer'), total = type => sum(db.transactions.filter(t => t.type === type).map(t => t.amount));
    const recent = cust.slice(-5).reverse().map(pub).map(u => ({ name: u.name, email: u.email, joined: u.created.slice(0, 10), status: u.active ? 'Active' : 'Disabled' }));
    return page(ctx, 'Admin Overview', render('admin-overview', {
      cards: card('Customers', cust.length) + card('Active customers', cust.filter(u => u.active).length) + card('Accounts', db.accounts.length) + card('Transactions', db.transactions.length)
        + card('Total income recorded', money(total('income')), 'pos') + card('Total expenses recorded', money(total('expense')), 'neg') + card('Budgets', db.budgets.length) + card('Savings goals', db.goals.length),
      rows: recent.length ? each('partials/user-mini-row', recent) : emptyRow(4, 'No customers yet.')
    }));
  });
};
