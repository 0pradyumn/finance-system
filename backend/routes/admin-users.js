/* backend/routes/admin-users.js - Routes: admin user management  [Part 4: Reports & Admin Panel] */

const crypto = require('crypto');
const { db, save, hashPw } = require('../core/db');
const { err, pub } = require('../core/helpers');
const { render, each } = require('../core/view');
const { page } = require('../core/components');

const endSessions = id => Object.keys(db.sessions).forEach(k => db.sessions[k].uid === id && delete db.sessions[k]);

module.exports = function (R) {
  R.nav('admin', '/admin/users', 'Users', 2);

  R('GET', '/admin/users', 'admin', ctx => {
    const rows = db.users.map(u => ({
      ...pub(u), accounts: db.accounts.filter(a => a.userId === u.id).length, transactions: db.transactions.filter(t => t.userId === u.id).length,
      status: u.active ? 'Active' : 'Disabled', tagCls: u.active ? '' : 'bad',
      toggle: u.id !== ctx.user.id ? render('partials/admin-toggle', { id: u.id, label: u.active ? 'Disable' : 'Enable' }) : '',
      delete: u.role === 'customer' ? render('partials/admin-delete', { id: u.id }) : ''
    }));
    return page(ctx, 'User Management', render('admin-users', { rows: each('partials/admin-user-row', rows) }));
  });

  R('POST', '/admin/users/:id/toggle', 'admin', ({ user, p }) => {
    const u = db.users.find(x => x.id === +p.id); if (!u) err(404, 'User not found');
    if (u.id === user.id) err(400, 'You cannot disable yourself');
    u.active = !u.active; if (!u.active) endSessions(u.id);
    save(); return { redirect: '/admin/users', ok: u.name + (u.active ? ' enabled' : ' disabled') };
  });

  R('POST', '/admin/users/:id/password', 'admin', ({ p, b }) => {
    const u = db.users.find(x => x.id === +p.id); if (!u) err(404, 'User not found');
    if (String(b.password || '').length < 6) err(400, 'Password must be at least 6 characters');
    u.salt = crypto.randomBytes(16).toString('hex'); u.hash = hashPw(b.password, u.salt);
    save(); return { redirect: '/admin/users', ok: 'Password updated for ' + u.name };
  });

  R('POST', '/admin/users/:id/delete', 'admin', ({ user, p }) => {
    const u = db.users.find(x => x.id === +p.id); if (!u) err(404, 'User not found');
    if (u.id === user.id || u.role === 'admin') err(400, 'Admin accounts cannot be deleted');
    for (const k of ['accounts', 'transactions', 'budgets', 'goals']) db[k] = db[k].filter(x => x.userId !== u.id);
    db.users = db.users.filter(x => x !== u); endSessions(u.id);
    save(); return { redirect: '/admin/users', ok: 'User and all their data deleted' };
  });
};
