/* backend/core/response.js - send(), redirect(), cookies  [Part 1: Core & Authentication] */

const COOKIE = 'HttpOnly; SameSite=Lax; Path=/';

function send(res, status, data, type = 'text/html', extra = {}) {
  res.writeHead(status, { 'Content-Type': type + '; charset=utf-8', 'X-Content-Type-Options': 'nosniff', ...extra });
  res.end(data);
}
function redirect(res, url, cookie) {
  const h = { Location: url }; if (cookie) h['Set-Cookie'] = cookie;
  res.writeHead(302, h); res.end();
}
const sessionCookie = token => `sid=${token}; ${COOKIE}; Max-Age=604800`;
const clearCookie = `sid=; ${COOKIE}; Max-Age=0`;

module.exports = { send, redirect, sessionCookie, clearCookie };
