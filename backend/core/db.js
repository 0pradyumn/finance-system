/* backend/core/db.js - JSON database, password hashing, default admin  [Part 1: Core & Authentication] */

const crypto = require('crypto');
const fs = require('fs');
const jsonServer = require('json-server');
const { DBF } = require('./config');

if (!fs.existsSync(DBF)) fs.writeFileSync(DBF, JSON.stringify({ users: [], accounts: [], transactions: [], budgets: [], goals: [], sessions: {}, seq: { value: 1 } }, null, 1));
const initialState = JSON.parse(fs.readFileSync(DBF, 'utf8'));
if (!initialState.seq || typeof initialState.seq !== 'object') {
  initialState.seq = { value: Number(initialState.seq) || 1 };
  fs.writeFileSync(DBF, JSON.stringify(initialState, null, 1));
}
const router = jsonServer.router(DBF);
const store = router.db;
const db = Object.assign({ users: [], accounts: [], transactions: [], budgets: [], goals: [], sessions: {}, seq: { value: 1 } }, store.getState());
const save = () => { store.setState(db); store.write(); };
const nid = () => db.seq.value++;
const hashPw = (p, s) => crypto.scryptSync(p, s, 32).toString('hex');
function mkUser(name, email, pw, role) {
  const salt = crypto.randomBytes(16).toString('hex');
  const u = { id: nid(), name, email: email.toLowerCase(), salt, hash: hashPw(pw, salt), role, active: true, created: new Date().toISOString() };
  db.users.push(u); return u;
}
if (!db.users.some(u => u.role === 'admin')) { mkUser('Administrator', 'admin@bank.com', 'Admin@123', 'admin'); save(); }


module.exports = { db, save, nid, hashPw, mkUser };
