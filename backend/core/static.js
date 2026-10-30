/* backend/core/static.js - Serves frontend/css files  [Part 1: Core & Authentication] */

const fs = require('fs'), path = require('path');
const { CSS_DIR } = require('./config');
const { send } = require('./response');
const { each } = require('./view');

// <link> tags for every stylesheet in frontend/css/pages (each team member adds their own file)
function pageStyles() {
  const dir = path.join(CSS_DIR, 'pages'); if (!fs.existsSync(dir)) return '';
  return each('partials/css-link', fs.readdirSync(dir).filter(f => f.endsWith('.css')).sort().map(f => ({ href: '/css/pages/' + f })));
}

function serveCss(req, res, u) {
  const fp = path.join(CSS_DIR, decodeURIComponent(u.pathname.slice(5)));
  if (!fp.startsWith(CSS_DIR + path.sep) || !fs.existsSync(fp) || !fp.endsWith('.css')) return send(res, 404, 'Not found', 'text/plain');
  send(res, 200, fs.readFileSync(fp), 'text/css');
}

module.exports = { pageStyles, serveCss };
