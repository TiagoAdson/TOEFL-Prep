const fs = require('fs');
['seeds/seed_06_be_going_to_ext5.sql', 'seeds/seed_08_past_perfect_ext5.sql'].forEach(f => {
  let text = fs.readFileSync(f, 'utf8');
  // replace double quotes inside explanations or anywhere except inside options array
  // options array looks like '["...", "..."]'
  // So we only replace " if it's not preceded by [ or , or followed by , or ]
  text = text.replace(/"/g, (match, offset, str) => {
    const context = str.substring(offset - 2, offset + 3);
    if (context.includes('["') || context.includes('"]') || context.includes('","')) {
      return match;
    }
    return "''";
  });
  fs.writeFileSync(f, text);
});
