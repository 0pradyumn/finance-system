/* backend/routes/goals.js - Routes: savings goals  [Part 3: Dashboard, Budgets & Savings Goals] */

const { db, save, nid } = require('../core/db');
const { own, pos, str, sum, err } = require('../core/helpers');
const { render, each, money } = require('../core/view');
const { page, bar, empty } = require('../core/components');

module.exports = function (R) {
  R.nav('customer', '/goals', 'Savings Goals', 5);

  R('GET', '/goals', 'customer', ctx => {
    const items = own(db.goals, ctx.user.id).map(g => ({ id: g.id, name: g.name, saved: money(g.saved), target: money(g.target), pct: Math.min(100, Math.round(g.saved / g.target * 100)), deadline: g.deadline ? ' · by ' + g.deadline : '', bar: bar(g.saved, g.target) }));
    return page(ctx, 'Savings Goals', render('goals', { items: items.length ? each('partials/goal-item', items) : empty('No goals yet.') }));
  });

  R('POST', '/goals', 'customer', ({ user, b }) => {
    db.goals.push({ id: nid(), userId: user.id, name: str(b.name, 'Goal name', 40), target: pos(b.target, 'Target'), saved: Math.max(0, Number(b.saved) || 0), deadline: b.deadline || '' });
    save(); return { redirect: '/goals', ok: 'Goal added' };
  });

  R('POST', '/goals/:id/add', 'customer', ({ user, p, b }) => {
    const g = db.goals.find(x => x.id === +p.id && x.userId === user.id); if (!g) err(404, 'Goal not found');
    g.saved = Math.max(0, sum([g.saved, Number(b.amount) || 0])); save(); return { redirect: '/goals', ok: 'Goal updated' };
  });

  R('POST', '/goals/:id/delete', 'customer', ({ user, p }) => { db.goals = db.goals.filter(x => !(x.id === +p.id && x.userId === user.id)); save(); return { redirect: '/goals', ok: 'Goal deleted' }; });
};
