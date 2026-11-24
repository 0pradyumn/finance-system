/* backend/core/helpers.js - Validation + calculation helpers  [Part 1: Core & Authentication] */

const crypto = require('crypto');
const { db, save, nid } = require('./db');

const err = (s, m) => { throw { s, m }; };
const today = () => new Date().toISOString().slice(0, 10);
const cents = (v, n) => {
  v = Number(v);
  if (!Number.isFinite(v)) err(400, n + ' must be a valid number');
  const value = Math.round(v * 100);
  if (!Number.isSafeInteger(value)) err(400, n + ' is too large');
  return value / 100;
};
const decimal = (v, n, fallback) => (v === '' || v === undefined) && fallback !== undefined ? fallback : cents(v, n);
const pos = (v, n) => {
  const rounded = cents(v, n);
  if (rounded <= 0) err(400, n + ' must be at least 0.01');
  return rounded;
};
const nonNegative = (v, n, fallback) => {
  if ((v === '' || v === undefined) && fallback !== undefined) return fallback;
  const numeric = Number(v);
  if (!Number.isFinite(numeric) || numeric < 0) err(400, n + ' must be zero or a positive number');
  return cents(numeric, n);
};
const signed = (v, n) => {
  const rounded = cents(v, n);
  if (rounded === 0) err(400, n + ' must be at least 0.01 or -0.01');
  return rounded;
};
const str = (v, n, max = 60) => {
  v = String(v ?? '').trim();
  if (!v) err(400, n + ' is required');
  if (v.length > max) err(400, n + ' must be no more than ' + max + ' characters');
  return v;
};
const dt = v => {
  const parsed = /^\d{4}-\d{2}-\d{2}$/.test(v || '') ? new Date(v + 'T00:00:00.000Z') : null;
  if (!parsed || !Number.isFinite(parsed.getTime()) || parsed.toISOString().slice(0, 10) !== v) err(400, 'A valid date is required');
  return v;
};
const own = (arr, uid) => arr.filter(x => x.userId === uid);
const sum = a => Math.round(a.reduce((s, x) => s + x, 0) * 100) / 100;
const bal = a => sum([a.opening, ...db.transactions.filter(t => t.accountId === a.id).map(t => t.type === 'income' ? t.amount : -t.amount)]);
const pub = u => ({ id: u.id, name: u.name, email: u.email, role: u.role, active: u.active, created: u.created });
function txIn(u, b) {
  const acc = db.accounts.find(a => a.id === +b.accountId && a.userId === u.id);
  if (!acc) err(400, 'Select a valid account');
  if (!['income', 'expense'].includes(b.type)) err(400, 'Invalid transaction type');
  const note = String(b.note || '');
  if (note.length > 120) err(400, 'Note must be no more than 120 characters');
  return { accountId: acc.id, type: b.type, category: str(b.category, 'Category', 30), amount: pos(b.amount, 'Amount'), date: dt(b.date), note };
}
function newSession(u) {
  const t = crypto.randomBytes(32).toString('hex');
  db.sessions[t] = { uid: u.id, exp: Date.now() + 7 * 864e5 }; save(); return t;
}
const catSpend = (uid, cat, month) => sum(db.transactions.filter(t => t.userId === uid && t.type === 'expense' && t.category.toLowerCase() === cat.toLowerCase() && t.date.startsWith(month)).map(t => t.amount));


module.exports = { err, today, pos, decimal, nonNegative, signed, str, dt, own, sum, bal, pub, txIn, newSession, catSpend };
