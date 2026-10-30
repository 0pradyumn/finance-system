/* backend/routes/transactions.js - Routes: transactions (list, filter, add, edit, delete)  [Part 2: Accounts & Transactions] */

const { db, save, nid } = require('../core/db');
const { own, today, txIn, err } = require('../core/helpers');
const { render, each, sel } = require('../core/view');
const { page, txTable } = require('../core/components');

module.exports = function (R) {
  R.nav('customer', '/transactions', 'Transactions', 3);

  R('GET', '/transactions', 'customer', ({ user, q, path, ...rest }) => {
    const accs = own(db.accounts, user.id), names = Object.fromEntries(accs.map(a => [a.id, a.name]));
    let t = own(db.transactions, user.id);
    if (q.type) t = t.filter(x => x.type === q.type);
    if (q.category) t = t.filter(x => x.category.toLowerCase().includes(q.category.toLowerCase()));
    if (q.from) t = t.filter(x => x.date >= q.from);
    if (q.to) t = t.filter(x => x.date <= q.to);
    t = t.sort((a, b) => b.date.localeCompare(a.date) || b.id - a.id).map(x => ({ ...x, account: names[x.accountId] }));
    const ed = q.edit && db.transactions.find(x => x.id === +q.edit && x.userId === user.id);   // edit mode pre-fills the form
    const f = ed || { type: 'expense', date: today(), accountId: accs[0] && accs[0].id, category: '', amount: '', note: '' };
    return page({ user, q, path, ...rest }, 'Transactions', render('transactions', {
      action: ed ? `/transactions/${ed.id}/update` : '/transactions', submit: ed ? 'Update' : 'Add',
      cancel: ed ? render('partials/cancel-link') : '',
      accountOptions: each('partials/option', accs.map(a => ({ value: a.id, label: a.name, sel: sel(a.id, f.accountId) }))),
      expSel: sel(f.type, 'expense'), incSel: sel(f.type, 'income'), category: f.category, amount: f.amount, date: f.date, note: f.note,
      fInc: sel(q.type, 'income'), fExp: sel(q.type, 'expense'), fCategory: q.category || '', fFrom: q.from || '', fTo: q.to || '',
      table: txTable(t, { controls: true })
    }));
  });

  R('POST', '/transactions', 'customer', ({ user, b }) => { db.transactions.push({ id: nid(), userId: user.id, ...txIn(user, b) }); save(); return { redirect: '/transactions', ok: 'Transaction added' }; });

  R('POST', '/transactions/:id/update', 'customer', ({ user, p, b }) => {
    const t = db.transactions.find(x => x.id === +p.id && x.userId === user.id); if (!t) err(404, 'Transaction not found');
    Object.assign(t, txIn(user, b)); save(); return { redirect: '/transactions', ok: 'Transaction updated' };
  });

  R('POST', '/transactions/:id/delete', 'customer', ({ user, p }) => {
    const n = db.transactions.length; db.transactions = db.transactions.filter(x => !(x.id === +p.id && x.userId === user.id));
    if (n === db.transactions.length) err(404, 'Transaction not found');
    save(); return { redirect: '/transactions', ok: 'Transaction deleted' };
  });
};
