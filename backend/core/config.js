/* backend/core/config.js - Server settings  [Part 1: Core & Authentication] */

const path = require('path');
const ROOT = path.join(__dirname, '..', '..');

module.exports = {
  PORT: process.env.PORT || 3000,
  DBF: path.join(ROOT, 'bank-data.json'),                 // JSON database (auto-created)
  VIEWS_DIR: path.join(ROOT, 'frontend', 'views'),        // HTML pages + partials
  CSS_DIR: path.join(ROOT, 'frontend', 'css'),            // stylesheets
  ROUTES_DIR: path.join(ROOT, 'backend', 'routes')        // every file here is auto-loaded
};
