/* backend/routes/reports.js - Routes: reports + CSV export  [Part 4: Reports & Admin Panel] */

const { db } = require('../core/db');
const { own, today, sum } = require('../core/helpers');
const { render, each, money } = require('../core/view');
const { page, card, barRow, empty } = require('../core/components');

function build(user, q) {
  const to = q.to || today(), from = q.from || to.slice(0, 8) + '01', all = own(db.transactions, user.id);
  const ts = all.filter(t => t.date >= from && t.date <= to);
  const group = type => { const o = {}; ts.filter(t => t.type === type).forEach(t => o[t.category] = sum([o[t.category] || 0, t.amount])); return Object.entries(o).sort((a, b) => b[1] - a[1]); };
  const income = sum(ts.filter(t => t.type === 'income').map(t => t.amount)), expense = sum(ts.filter(t => t.type === 'expense').map(t => t.amount));
  const d = new Date(), monthly = [];
  for (let i = 5; i >= 0; i--) {
    const k = new Date(d.getFullYear(), d.getMonth() - i, 1).toISOString().slice(0, 7), mm = all.filter(t => t.date.startsWith(k));
    monthly.push({ month: k, income: sum(mm.filter(t => t.type === 'income').map(t => t.amount)), expense: sum(mm.filter(t => t.type === 'expense').map(t => t.amount)) });
  }
  return { from, to, ts, income, expense, expenseByCat: group('expense'), incomeByCat: group('income'), monthly };
}

module.exports = function (R) {
  R.nav('customer', '/reports', 'Reports', 6);

  R('GET', '/reports', 'customer', ctx => {
    const r = build(ctx.user, ctx.q), ex = r.expense || 1, mx = Math.max(1, ...r.monthly.flatMap(m => [m.income, m.expense]));
    return page(ctx, 'Reports', render('reports', {
      from: r.from, to: r.to,
      cards: card('Income', money(r.income), 'pos') + card('Expenses', money(r.expense), 'neg') + card('Net Savings', money(r.income - r.expense)) + card('Transactions', r.ts.length),
      expenses: r.expenseByCat.map(c => barRow(c[0], money(c[1]) + ' (' + Math.round(c[1] / ex * 100) + '%)', c[1], ex)).join('') || empty('No expenses in range.'),
      income: each('partials/simple-row', r.incomeByCat.map(c => ({ label: c[0], value: money(c[1]) }))) || empty('No income in range.'),
      trend: each('partials/trend-col', r.monthly.map(m => ({ label: m.month.slice(2), inH: (m.income / mx * 100).toFixed(1), outH: (m.expense / mx * 100).toFixed(1), inTitle: money(m.income), outTitle: money(m.expense) })))
    }));
  });

  R('GET', '/reports/export.csv', 'customer', ({ user, q }) => {
    const r = build(user, q), names = Object.fromEntries(own(db.accounts, user.id).map(a => [a.id, a.name]));
    const cell = v => '"' + String(v ?? '').replace(/"/g, '""') + '"';
    const rows = r.ts.sort((a, b) => a.date.localeCompare(b.date)).map(t => [t.date, names[t.accountId], t.type, t.category, t.amount, t.note].map(cell).join(','));
    return { csv: ['Date,Account,Type,Category,Amount,Note', ...rows].join('\n'), filename: `transactions_${r.from}_to_${r.to}.csv` };
  });
};
