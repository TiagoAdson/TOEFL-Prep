const fs = require('fs');
['seeds/seed_07_present_perfect_ext5.sql', 'seeds/seed_09_conditional_1_ext5.sql'].forEach(f => {
  let text = fs.readFileSync(f, 'utf8');
  let original = text;
  
  // Find all JSON arrays in single quotes: e.g. '["A","B"]'
  let noJson = text.replace(/'\[.*?\]'/g, "JSON_ARRAY_PLACEHOLDER");
  let doubleQuotes = (noJson.match(/"/g) || []).length;
  console.log(f, 'Double quotes outside JSON:', doubleQuotes);
  
  // Replace double quotes outside JSON with ''
  let newText = text.replace(/'\[.*?\]'/g, match => match.replace(/"/g, 'QUOTE_PLACEHOLDER'));
  newText = newText.replace(/"/g, "''");
  newText = newText.replace(/QUOTE_PLACEHOLDER/g, '"');
  
  if (text !== newText) {
    fs.writeFileSync(f, newText, 'utf8');
    console.log('Sanitized:', f);
  }
});
