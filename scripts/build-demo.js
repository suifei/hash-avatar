// Inlines src/hash-avatar.js into demo/page.html and writes a single self-contained dist/index.html.
const fs = require('fs'), path = require('path');

const root = path.join(__dirname, '..');
const tag = '<script src="../src/hash-avatar.js"></script>';
const page = fs.readFileSync(path.join(root, 'demo/page.html'), 'utf8');
const lib = fs.readFileSync(path.join(root, 'src/hash-avatar.js'), 'utf8');

if (!page.includes(tag)) throw new Error('demo/page.html no longer contains: ' + tag);
if (/<\/script/i.test(lib)) throw new Error('library source contains "</script" and cannot be inlined safely');

fs.mkdirSync(path.join(root, 'dist'), { recursive: true });
fs.writeFileSync(path.join(root, 'dist/index.html'), page.replace(tag, () => '<script>\n' + lib + '</script>'));
console.log('wrote dist/index.html');
