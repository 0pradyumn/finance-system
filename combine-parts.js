/* combine-parts.js - merges the 4 team parts into one working project.   [Part 1]
   Usage:  node combine-parts.js <output-folder> <part1-folder> <part2-folder> <part3-folder> <part4-folder>
   Example: node combine-parts.js finance-system part1 part2 part3 part4 */
const fs = require('fs'), path = require('path');
const [outArg, ...parts] = process.argv.slice(2);
if (!outArg || parts.length < 1) { console.log('Usage: node combine-parts.js <output-folder> <part-folder> [<part-folder> ...]'); process.exit(1); }
const out = path.resolve(outArg); let files = 0;
for (const p of parts) {
  if (!fs.existsSync(p)) { console.error('Folder not found: ' + p); process.exit(1); }
  fs.cpSync(path.resolve(p), out, {
    recursive: true,
    filter: (s, d) => {
      if (['.git', 'node_modules', 'bank-data.json'].includes(path.basename(s))) return false;
      if (fs.statSync(s).isFile()) {
        files++;
        if (fs.existsSync(d) && !fs.readFileSync(s).equals(fs.readFileSync(d))) console.warn('  CONFLICT (later part wins): ' + path.relative(out, d));
      }
      return true;
    }
  });
}
console.log('Combined ' + files + ' files into ' + out + '\nNow run:  cd ' + outArg + '  &&  node server.js');
