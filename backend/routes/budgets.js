/* backend/routes/budgets.js - Routes: budgets  [Part 3: Dashboard, Budgets & Savings Goals] */

const { db, save, nid } = require('../core/db');
const { own, today, pos, str, catSpend } = require('../core/helpers');
const { render, each, money } = require('../core/view');
const { page, bar, empty } = require('../core/components');

module.exports = function (R) {
  R.nav('customer', '/budgets', 'Budgets', 4);

  R('GET', '/budgets', 'customer', ctx => {
    const u = ctx.user, items = own(db.budgets, u.id).map(b => {
      const spent = catSpend(u.id, b.category, today().slice(0, 7)), over = spent > b.limit;
      return { id: b.id, category: b.category, spent: money(spent), limit: money(b.limit), tagCls: over ? 'bad' : '', status: over ? 'Over budget' : money(b.limit - spent) + ' left', bar: bar(spent, b.limit) };
    });
    return page(ctx, 'Budgets', render('budgets', { items: items.length ? each('partials/budget-item', items) : empty('No budgets yet. Add one above.') }));
  });

  R('POST', '/budgets', 'customer', ({ user, b }) => {
    const category = str(b.category, 'Category', 30), limit = pos(b.limit, 'Limit');
    const x = db.budgets.find(y => y.userId === user.id && y.category.toLowerCase() === category.toLowerCase());
    if (x) x.limit = limit; else db.budgets.push({ id: nid(), userId: user.id, category, limit });
    save(); return { redirect: '/budgets', ok: 'Budget saved' };
  });

  R('POST', '/budgets/:id/delete', 'customer', ({ user, p }) => { db.budgets = db.budgets.filter(x => !(x.id === +p.id && x.userId === user.id)); save(); return { redirect: '/budgets', ok: 'Budget removed' }; });
};
