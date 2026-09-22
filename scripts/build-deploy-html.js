// Build step for deploying this site to GoDeploy (devgogroup.com).
//
// GoDeploy's /upload endpoint corrupts raw binary multipart parts: it decodes
// them as UTF-8 text server-side, so any non-ASCII byte gets replaced with the
// U+FFFD replacement character, mangling every PNG/WEBP/JPG asset (SVG, HTML,
// CSS and JS survive because they're already valid UTF-8/ASCII text).
//
// Workaround: inline every assets/img/* reference in index.html as a base64
// data URI before uploading. Base64 is pure ASCII, so it survives the buggy
// pipeline intact. This script never touches the tracked index.html — it
// writes a standalone build to .scratch/deploy/index.html, which is what gets
// uploaded to GoDeploy (together with assets/styles.css, assets/script.js and
// assets/favicon.svg, which are plain text and safe to upload as-is).
//
// Usage: node scripts/build-deploy-html.js
const fs = require('fs');
const path = require('path');

const projectRoot = path.join(__dirname, '..');
const srcHtmlPath = path.join(projectRoot, 'index.html');
const outDir = path.join(projectRoot, '.scratch', 'deploy');
const outHtmlPath = path.join(outDir, 'index.html');

const mimeByExt = {
  '.png': 'image/png',
  '.webp': 'image/webp',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.svg': 'image/svg+xml',
};

let html = fs.readFileSync(srcHtmlPath, 'utf8');

const refs = new Set();
const re = /assets\/img\/[^"')\s]+/g;
let m;
while ((m = re.exec(html))) refs.add(m[0]);

let replaced = 0;
for (const ref of refs) {
  const filePath = path.join(projectRoot, ref);
  const ext = path.extname(filePath).toLowerCase();
  const mime = mimeByExt[ext];
  if (!mime) {
    console.error('Unknown extension, skipping:', ref);
    continue;
  }
  const bytes = fs.readFileSync(filePath);
  const dataUri = `data:${mime};base64,${bytes.toString('base64')}`;
  const before = html.length;
  html = html.split(ref).join(dataUri);
  if (html.length !== before) replaced++;
}

fs.mkdirSync(outDir, { recursive: true });
fs.writeFileSync(outHtmlPath, html, 'utf8');

console.log(`Refs found: ${refs.size} | replaced: ${replaced}`);
console.log(`Output size: ${Math.round(Buffer.byteLength(html, 'utf8') / 1024)} KB`);
console.log(`Written to: ${outHtmlPath}`);
console.log('\nUpload this file as "index.html" to GoDeploy, alongside assets/favicon.svg,');
console.log('assets/script.js and assets/styles.css (no assets/img/* needed — inlined above).');
