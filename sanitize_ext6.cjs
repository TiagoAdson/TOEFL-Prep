const fs = require('fs');
const files = fs.readdirSync('seeds').filter(f => f.endsWith('_ext6.sql') || f.endsWith('_ext5.sql'));
let changed = [];
files.forEach(f => {
  let text = fs.readFileSync('seeds/' + f, 'utf8');
  let original = text;
  text = text.replace(/"([^"]+)"/g, (match, p1) => {
    if (p1.startsWith('[') || p1.includes('","')) return match;
    return "''" + p1 + "''";
  });
  if (text !== original) {
    fs.writeFileSync('seeds/' + f, text, 'utf8');
    changed.push(f);
  }
});
console.log('Sanitized:', changed.length, 'files');
changed.forEach(f => console.log(' -', f));
