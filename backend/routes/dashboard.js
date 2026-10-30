/* backend/routes/dashboard.js - Route: dashboard  [Part 3: Dashboard, Budgets & Savings Goals] */

const { db } = require('../core/db');
const { own, today, bal, sum, catSpend } = require('../core/helpers');
const { render, money } = require('../core/view');
const { page, card, barRow, txTable, empty } = require('../core/components');

module.exports = function (R) {
  R.nav('customer', '/dashboard', 'Dashboard', 1);

  R('GET', '/dashboard', 'customer', ctx => {
    const u = ctx.user, month = today().slice(0, 7);
    const accs = own(db.accounts, u.id), names = Object.fromEntries(accs.map(a => [a.id, a.name]));
    const all = own(db.transactions, u.id), mt = all.filter(t => t.date.startsWith(month));
    const income = sum(mt.filter(t => t.type === 'income').map(t => t.amount)), expense = sum(mt.filter(t => t.type === 'expense').map(t => t.amount));
    const recent = all.sort((a, b) => b.date.localeCompare(a.date) || b.id - a.id).slice(0, 6).map(t => ({ ...t, account: names[t.accountId] }));
    const budgets = own(db.budgets, u.id).map(b => barRow(b.category, money(catSpend(u.id, b.category, month)) + ' / ' + money(b.limit), catSpend(u.id, b.category, month), b.limit));
    const goals = own(db.goals, u.id).map(g => barRow(g.name, money(g.saved) + ' / ' + money(g.target), g.saved, g.target));
    return page(ctx, 'Welcome, ' + u.name, render('dashboard', {
      cards: card('Total Balance', money(sum(accs.map(bal)))) + card('Income (this month)', money(income), 'pos') + card('Expenses (this month)', money(expense), 'neg') + card('Net (this month)', money(income - expense)),
      recent: txTable(recent), budgets: budgets.join('') || empty('No budgets set.'), goals: goals.join('') || empty('No goals yet.')
    }));
  });
};
