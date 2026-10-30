/* backend/core/view.js - Template engine for the HTML files  [Part 1: Core & Authentication] */

const fs = require('fs'), path = require('path');
const { VIEWS_DIR } = require('./config');

const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const money = n => '₹' + Number(n).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
const load = name => fs.readFileSync(path.join(VIEWS_DIR, name + '.html'), 'utf8').replace(/^<!--[\s\S]*?-->\n/, '');

// Template engine:  {{name}} = HTML-escaped value   |   {{{name}}} = trusted HTML (already rendered)
const render = (name, data = {}) => load(name).replace(/\{\{\{(\w+)\}\}\}|\{\{(\w+)\}\}/g, (m, rawKey, escKey) => rawKey ? String(data[rawKey] ?? '') : esc(data[escKey] ?? ''));
const each = (name, rows) => rows.map(r => render(name, r)).join('');
const sel = (a, b) => String(a) === String(b) ? 'selected' : '';

module.exports = { esc, money, render, each, sel };
