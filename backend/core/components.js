/* backend/core/components.js - Reusable HTML pieces + page layouts  [Part 1: Core & Authentication] */

const { render, each, money } = require('./view');
const nav = require('./nav');
const { pageStyles } = require('./static');

const flash = q => (q.ok ? render('partials/flash-ok', { msg: q.ok }) : '') + (q.err ? render('partials/flash-err', { msg: q.err }) : '');
const bar = (v, max) => { const p = max > 0 ? Math.min(100, v / max * 100) : 0; return render('partials/progress', { cls: v > max ? 'over' : p > 80 ? 'warn' : '', pct: p.toFixed(1) }); };
const card = (label, value, cls = '') => render('partials/card', { label, value, cls });
const barRow = (label, value, v, max) => render('partials/bar-row', { label, value, bar: bar(v, max) });
const empty = msg => render('partials/empty', { msg });
const emptyRow = (cols, msg) => render('partials/empty-row', { cols, msg });

// Transactions table. controls=true adds Edit/Delete buttons (customer Transactions page only).
function txTable(rows, o = {}) {
  if (!rows.length) return empty('No transactions found.');
  const body = each(o.controls ? 'partials/tx-row-ctl' : 'partials/tx-row', rows.map(t => ({
    id: t.id, date: t.date, who: t.account || t.user || '', category: t.category, note: t.note,
    cls: t.type === 'income' ? 'pos' : 'neg', amount: (t.type === 'income' ? '+' : '-') + money(t.amount)
  })));
  return render('partials/tx-table', { col2: o.col2 || 'Account', ctlHead: o.controls ? '<th></th>' : '', rows: body });
}

// Full page for logged-in users (sidebar + content)
function page(ctx, title, content) {
  const u = ctx.user;
  return { html: render('layout-app', {
    title, content, pageStyles: pageStyles(), flash: flash(ctx.q), name: u.name, email: u.email,
    roleLabel: u.role === 'admin' ? 'ADMIN PANEL' : 'CUSTOMER PANEL',
    nav: each('partials/nav-item', nav.forRole(u.role).map(n => ({ href: n.href, label: n.label, cls: ctx.path === n.href ? 'on' : '' })))
  }) };
}
// Centered page for login / register / errors
const authPage = (ctx, title, content) => ({ html: render('layout-auth', { title, content, flash: flash(ctx.q || {}), pageStyles: pageStyles() }) });

module.exports = { flash, bar, card, barRow, empty, emptyRow, txTable, page, authPage };
