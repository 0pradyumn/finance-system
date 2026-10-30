/* backend/core/nav.js - Sidebar menu registry (each route file adds its own link)  [Part 1: Core & Authentication] */

const items = [];

module.exports = {
  add: (role, href, label, order) => items.push({ role, href, label, order }),
  forRole: role => items.filter(i => i.role === role).sort((a, b) => a.order - b.order)
};
