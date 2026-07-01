const fs = require('fs');
const files = fs.readdirSync('seeds').filter(f => f.endsWith('_ext5.sql'));
files.forEach(f => {
  let text = fs.readFileSync('seeds/' + f, 'utf8');
  let original = text;
  
  // replace double quotes inside explanations or anywhere except inside options array
  text = text.replace(/"([^"]+)"/g, (match, p1) => {
    if (p1.startsWith('[') || p1.includes('","')) return match; // looks like JSON array
    return "''" + p1 + "''"; 
  });
  
  // fix unmatched bracket ending a line
  text = text.replace(/,'hard'\},\r?\n/g, ",'hard'),\n");
  
  if (text !== original) {
    fs.writeFileSync('seeds/' + f, text, 'utf8');
    console.log('Sanitized:', f);
  }
});
