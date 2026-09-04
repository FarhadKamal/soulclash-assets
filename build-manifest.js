// Regenerates asset-manifest.json - run this (`node build-manifest.js`)
// after adding/changing/removing any file under assets/, then commit and
// push both the changed asset(s) and the updated manifest together.
//
// Each entry maps a path (e.g. "assets/portraits/blade.jpg") to a short
// content hash (MD5 of the file's bytes, first 10 hex chars) - NOT a
// timestamp, so it only changes when a file's actual content changes.
// The game client (assetVersion.js) fetches this manifest once on page
// load and appends each file's own hash as that file's cache-busting
// query string, so an unchanged file keeps the exact same URL (stays
// browser-cached) while a changed file gets a new URL and a real re-fetch.
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const ASSET_MANIFEST_EXTENSIONS = new Set(['.jpg', '.jpeg', '.png', '.svg', '.ico', '.mp3', '.wav']);
const assetsRoot = path.join(__dirname, 'assets');
const manifest = {};

function walk(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      walk(fullPath);
      continue;
    }
    const ext = path.extname(entry.name).toLowerCase();
    if (!ASSET_MANIFEST_EXTENSIONS.has(ext)) continue;
    const bytes = fs.readFileSync(fullPath);
    const hash = crypto.createHash('md5').update(bytes).digest('hex').slice(0, 10);
    const key = 'assets/' + path.relative(assetsRoot, fullPath).split(path.sep).join('/');
    manifest[key] = hash;
  }
}

walk(assetsRoot);
fs.writeFileSync(path.join(__dirname, 'asset-manifest.json'), JSON.stringify(manifest, null, 2));
console.log(`Manifest built with ${Object.keys(manifest).length} entries`);
