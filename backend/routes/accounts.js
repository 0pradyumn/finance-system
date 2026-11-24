/* backend/routes/accounts.js - Routes: accounts  [Part 2: Accounts & Transactions] */

const { db, save, nid } = require('../core/db');
const { str, decimal, own, bal, err } = require('../core/helpers');
const { render, each, money } = require('../core/view');
const { page, emptyRow } = require('../core/components');

module.exports = function (R) {
  R.nav('customer', '/accounts', 'Accounts', 2);

  R('GET', '/accounts', 'customer', ctx => {
    const rows = own(db.accounts, ctx.user.id).map(a => ({ id: a.id, name: a.name, type: a.type, opening: money(a.opening), balance: money(bal(a)) }));
    return page(ctx, 'Accounts', render('accounts', { rows: rows.length ? each('partials/account-row', rows) : emptyRow(5, 'No accounts yet.') }));
  });

  R('POST', '/accounts', 'customer', ({ user, b }) => {
    const type = str(b.type || 'Savings', 'Type', 20);
    if (!['Savings', 'Current', 'Cash', 'Credit Card', 'Wallet'].includes(type)) err(400, 'Select a valid account type');
    db.accounts.push({ id: nid(), userId: user.id, name: str(b.name, 'Account name', 40), type, opening: decimal(b.opening, 'Opening balance', 0) });
    save(); return { redirect: '/accounts', ok: 'Account added' };
  });

  R('POST', '/accounts/:id/delete', 'customer', ({ user, p }) => {
    const a = db.accounts.find(x => x.id === +p.id && x.userId === user.id); if (!a) err(404, 'Account not found');
    db.accounts = db.accounts.filter(x => x !== a); db.transactions = db.transactions.filter(t => t.accountId !== a.id);
    save(); return { redirect: '/accounts', ok: 'Account deleted' };
  });
};
