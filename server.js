/* server.js - Entry point: node server.js  [Part 1: Core & Authentication] */

const http = require('http');
const { PORT } = require('./backend/core/config');
const { loadRoutes, handle } = require('./backend/core/router');
const { serveCss } = require('./backend/core/static');

console.log('\n Loading route modules...');
loadRoutes();

http.createServer((req, res) => {
  const u = new URL(req.url, 'http://localhost');
  if (u.pathname.startsWith('/css/')) return serveCss(req, res, u);
  handle(req, res, u);
}).listen(PORT, () => console.log(`\n Finance system running:  http://localhost:${PORT}\n Admin login: admin@bank.com / Admin@123\n`))
  .on('error', e => console.error(e.code === 'EADDRINUSE' ? `Port ${PORT} is busy. Try: PORT=8080 node server.js` : e));
