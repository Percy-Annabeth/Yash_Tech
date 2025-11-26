// scan-css-comments.js
// Usage: node scan-css-comments.js
// Scans all .css files under current directory and prints files with:
//  - nested comment openings (depth > 1)
//  - unmatched comment start (open but not closed) or unmatched comment end
// It prints filename, line number and preview.

const fs = require('fs');
const path = require('path');

function walk(dir, list=[]) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const e of entries) {
    if (e.name.startsWith('node_modules')) continue;
    const full = path.join(dir, e.name);
    if (e.isDirectory()) walk(full, list);
    else if (e.isFile() && full.endsWith('.css')) list.push(full);
  }
  return list;
}

function analyze(file) {
  const text = fs.readFileSync(file, 'utf8');
  let depth = 0;
  const issues = [];
  let line = 1;
  for (let i = 0; i < text.length; i++) {
    const ch = text[i];
    if (ch === '\n') line++;
    // detect comment start
    if (text[i] === '/' && text[i+1] === '*') {
      depth++;
      if (depth > 1) {
        // find snippet
        const start = Math.max(0, i-40);
        const snippet = text.slice(start, Math.min(text.length, i+80))
                           .replace(/\n/g, '⏎');
        issues.push({
          type: 'nested-start',
          at: i,
          line,
          snippet
        });
      }
      i++;
      continue;
    }
    // detect comment end
    if (text[i] === '*' && text[i+1] === '/') {
      if (depth === 0) {
        const start = Math.max(0, i-40);
        const snippet = text.slice(start, Math.min(text.length, i+80))
                           .replace(/\n/g, '⏎');
        issues.push({ type: 'orphan-end', at: i, line, snippet });
      } else {
        depth = Math.max(0, depth-1);
      }
      i++;
      continue;
    }
  }

  if (depth > 0) {
    issues.push({ type: 'unclosed-start', line: 'EOF', snippet: 'File ended while comment depth > 0' });
  }
  return issues;
}

const cssFiles = walk(process.cwd());
let total = 0;
for (const f of cssFiles) {
  const issues = analyze(f);
  if (issues.length) {
    total++;
    console.log('----------------------------------------');
    console.log('File:', f);
    for (const it of issues) {
      console.log('  Issue:', it.type, 'line:', it.line);
      console.log('  Snippet preview:', it.snippet);
      console.log('');
    }
  }
}

if (total === 0) {
  console.log('No nested/unclosed comment issues found in any .css file in project tree.');
  console.log('If build still fails, also check generated build/static/css/main.*.css (scanner checks source files only).');
}
