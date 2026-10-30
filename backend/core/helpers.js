/* backend/core/helpers.js - Validation + calculation helpers  [Part 1: Core & Authentication] */

const crypto = require('crypto');
const { db, save, nid } = require('./db');

const err = (s, m) => { throw { s, m }; };
const today = () => new Date().toISOString().slice(0, 10);
const pos = (v, n) => { v = Number(v); if (!isFinite(v) || v <= 0) err(400, n + ' must be a positive number'); return Math.round(v * 100) / 100; };
const str = (v, n, max = 60) => { v = String(v ?? '').trim(); if (!v) err(400, n + ' is required'); return v.slice(0, max); };
const dt = v => { if (!/^\d{4}-\d{2}-\d{2}$/.test(v || '')) err(400, 'A valid date is required'); return v; };
const own = (arr, uid) => arr.filter(x => x.userId === uid);
const sum = a => Math.round(a.reduce((s, x) => s + x, 0) * 100) / 100;
const bal = a => sum([a.opening, ...db.transactions.filter(t => t.accountId === a.id).map(t => t.type === 'income' ? t.amount : -t.amount)]);
const pub = u => ({ id: u.id, name: u.name, email: u.email, role: u.role, active: u.active, created: u.created });
function txIn(u, b) {
  const acc = db.accounts.find(a => a.id === +b.accountId && a.userId === u.id);
  if (!acc) err(400, 'Select a valid account');
  if (!['income', 'expense'].includes(b.type)) err(400, 'Invalid transaction type');
  return { accountId: acc.id, type: b.type, category: str(b.category, 'Category', 30), amount: pos(b.amount, 'Amount'), date: dt(b.date), note: String(b.note || '').slice(0, 120) };
}
function newSession(u) {
  const t = crypto.randomBytes(32).toString('hex');
  db.sessions[t] = { uid: u.id, exp: Date.now() + 7 * 864e5 }; save(); return t;
}
const catSpend = (uid, cat, month) => sum(db.transactions.filter(t => t.userId === uid && t.type === 'expense' && t.category.toLowerCase() === cat.toLowerCase() && t.date.startsWith(month)).map(t => t.amount));


module.exports = { err, today, pos, str, dt, own, sum, bal, pub, txIn, newSession, catSpend };
