/* backend/core/db.js - JSON database, password hashing, default admin  [Part 1: Core & Authentication] */

const fs = require('fs'), crypto = require('crypto');
const { DBF } = require('./config');

let db = { users: [], accounts: [], transactions: [], budgets: [], goals: [], sessions: {}, seq: 1 };
if (fs.existsSync(DBF)) db = Object.assign(db, JSON.parse(fs.readFileSync(DBF, 'utf8')));
const save = () => fs.writeFileSync(DBF, JSON.stringify(db, null, 1));
const nid = () => db.seq++;
const hashPw = (p, s) => crypto.scryptSync(p, s, 32).toString('hex');
function mkUser(name, email, pw, role) {
  const salt = crypto.randomBytes(16).toString('hex');
  const u = { id: nid(), name, email: email.toLowerCase(), salt, hash: hashPw(pw, salt), role, active: true, created: new Date().toISOString() };
  db.users.push(u); return u;
}
if (!db.users.some(u => u.role === 'admin')) { mkUser('Administrator', 'admin@bank.com', 'Admin@123', 'admin'); save(); }


module.exports = { db, save, nid, hashPw, mkUser };
