/* backend/routes/auth.js - Routes: login, register, logout, home  [Part 1: Core & Authentication] */

const crypto = require('crypto');
const { db, save, nid, hashPw, mkUser } = require('../core/db');
const { err, str, newSession } = require('../core/helpers');
const { render } = require('../core/view');
const { authPage } = require('../core/components');

const home = u => u.role === 'admin' ? '/admin' : '/dashboard';

module.exports = function (R) {
  R('GET', '/', false, ({ user }) => ({ redirect: user ? home(user) : '/login' }));
  R('GET', '/login', false, ctx => ctx.user ? { redirect: home(ctx.user) } : authPage(ctx, 'Login', render('login')));
  R('GET', '/register', false, ctx => ctx.user ? { redirect: home(ctx.user) } : authPage(ctx, 'Register', render('register')));

  R('POST', '/register', false, ({ b }) => {
    const name = str(b.name, 'Name', 50), email = str(b.email, 'Email', 80).toLowerCase();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) err(400, 'Enter a valid email');
    if (String(b.password || '').length < 6) err(400, 'Password must be at least 6 characters');
    if (db.users.some(u => u.email === email)) err(409, 'Email is already registered');
    const u = mkUser(name, email, b.password, 'customer');
    db.accounts.push({ id: nid(), userId: u.id, name: 'Main Account', type: 'Savings', opening: 0 });
    return { redirect: '/dashboard', cookie: newSession(u), ok: 'Account created. Welcome, ' + u.name + '!' };
  });

  R('POST', '/login', false, ({ b }) => {
    const u = db.users.find(x => x.email === String(b.email || '').trim().toLowerCase());
    const ok = u && crypto.timingSafeEqual(Buffer.from(hashPw(String(b.password || ''), u.salt), 'hex'), Buffer.from(u.hash, 'hex'));
    if (!ok) err(401, 'Invalid email or password');
    if (!u.active) err(403, 'This account has been disabled. Contact the administrator.');
    return { redirect: home(u), cookie: newSession(u), ok: 'Welcome back, ' + u.name };
  });

  R('POST', '/logout', true, ({ sid }) => { delete db.sessions[sid]; save(); return { redirect: '/login', clearCookie: true, ok: 'You have been logged out' }; });
};
