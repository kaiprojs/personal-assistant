const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '..');
const publicDir = path.join(root, 'public');
const source = path.join(root, 'node_modules', 'coi-serviceworker', 'coi-serviceworker.min.js');
const target = path.join(publicDir, 'coi-serviceworker.js');

fs.mkdirSync(publicDir, { recursive: true });
fs.writeFileSync(path.join(publicDir, '.nojekyll'), '');

if (!fs.existsSync(source)) {
  console.warn('coi-serviceworker not installed; skipping public asset sync');
  process.exit(0);
}

fs.copyFileSync(source, target);
console.log('Synced coi-serviceworker.js to public/');
