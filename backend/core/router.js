/* backend/core/router.js - Request router: cookies, sessions, forms, roles, errors  [Part 1: Core & Authentication] */

const fs = require('fs'), path = require('path');
const { db } = require('./db');
const { ROUTES_DIR } = require('./config');
const { send, redirect, sessionCookie, clearCookie } = require('./response');
const { render } = require('./view');
const { authPage } = require('./components');
const nav = require('./nav');

const routes = [];
// R(method, path, auth, handler)   auth: false = public | true = any user | 'customer' | 'admin'
// handler(ctx) returns  { html } | { redirect, ok, cookie, clearCookie } | { csv, filename }   (or throws err())
const R = (m, p, auth, fn) => routes.push({ m, auth, fn, re: new RegExp('^' + p.replace(/:(\w+)/g, '(?<$1>[^/]+)') + '$') });
R.nav = nav.add;  // R.nav(role, href, label, order) -> sidebar link

function loadRoutes() {
  fs.readdirSync(ROUTES_DIR).filter(f => f.endsWith('.js')).sort().forEach(f => { require(path.join(ROUTES_DIR, f))(R); console.log('  [route] ' + f); });
}

const home = u => u.role === 'admin' ? '/admin' : '/dashboard';
const readBody = req => new Promise(r => { let d = ''; req.on('data', c => { d += c; if (d.length > 1e6) req.destroy(); }); req.on('end', () => r(d)); });
const parseCookies = h => Object.fromEntries((h || '').split(';').map(c => c.trim().split('=')).filter(c => c[0]).map(([k, ...v]) => [k, decodeURIComponent(v.join('='))]));

function reply(res, r) {
  if (r.redirect) {
    const url = r.redirect + (r.ok ? (r.redirect.includes('?') ? '&' : '?') + 'ok=' + encodeURIComponent(r.ok) : '');
    return redirect(res, url, r.clearCookie ? clearCookie : r.cookie ? sessionCookie(r.cookie) : null);
  }
  if (r.csv !== undefined) return send(res, 200, r.csv, 'text/csv', { 'Content-Disposition': `attachment; filename="${r.filename || 'export.csv'}"` });
  send(res, r.status || 200, r.html);
}

async function handle(req, res, u) {
  try {
    const b = Object.fromEntries(new URLSearchParams(await readBody(req)));
    const sid = parseCookies(req.headers.cookie).sid, s = db.sessions[sid];
    const user = s && s.exp > Date.now() ? db.users.find(x => x.id === s.uid && x.active) || null : null;
    let hit = null, p = {};
    for (const r of routes) { const m = r.m === req.method && r.re.exec(u.pathname); if (m) { hit = r; p = m.groups || {}; break; } }
    if (!hit) throw { s: 404, m: 'Page not found' };
    if (hit.auth) {
      if (!user) return redirect(res, '/login?err=' + encodeURIComponent('Please log in first'));
      if (hit.auth !== true && user.role !== hit.auth) return redirect(res, home(user) + '?err=' + encodeURIComponent('Access denied'));
    }
    reply(res, hit.fn({ user, sid, b, p, q: Object.fromEntries(u.searchParams), path: u.pathname }));
  } catch (e) {
    if (!(e && e.s)) { console.error(e); e = { s: 500, m: 'Server error' }; }
    if (req.method === 'POST') {   // form error -> go back to the page with a red message
      let back = '/' + u.pathname.split('/')[1]; try { back = new URL(req.headers.referer).pathname; } catch { }   // fallback: the page's own section
      return redirect(res, back + '?err=' + encodeURIComponent(e.m));
    }
    send(res, e.s, authPage({ q: {} }, 'Error', render('error', { code: e.s, msg: e.m })).html);
  }
}

module.exports = { loadRoutes, handle };
