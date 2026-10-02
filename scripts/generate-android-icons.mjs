import { createRequire } from 'node:module';
import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { join } from 'node:path';

// Resize the supplied original artwork; do not generate or redraw the character/letters.
const require = createRequire(import.meta.resolve('@capacitor/assets'));
const sharp = require('sharp');
const root = fileURLToPath(new URL('..', import.meta.url));
const source = await readFile(join(root, 'assets/android/icon-cat.png'));
const res = join(root, 'android/app/src/main/res');
const densities = { ldpi: 0.75, mdpi: 1, hdpi: 1.5, xhdpi: 2, xxhdpi: 3, xxxhdpi: 4 };
// Sample an existing green area of the original for the adaptive background.
const sample = await sharp(source).resize(128, 128).removeAlpha().raw().toBuffer();
const offset = (12 * 128 + 64) * 3;
const background = { r: sample[offset], g: sample[offset + 1], b: sample[offset + 2], alpha: 1 };

for (const [density, scale] of Object.entries(densities)) {
  const directory = join(res, `mipmap-${density}`);
  await mkdir(directory, { recursive: true });
  const size = Math.round(48 * scale);
  const icon = await sharp(source).resize(size, size, { fit: 'contain', background }).png().toBuffer();
  await writeFile(join(directory, 'ic_launcher.png'), icon);
  const circle = Buffer.from(`<svg width="${size}" height="${size}"><circle cx="${size / 2}" cy="${size / 2}" r="${size / 2}" fill="white"/></svg>`);
  await sharp(icon).ensureAlpha().composite([{ input: circle, blend: 'dest-in' }]).png().toFile(join(directory, 'ic_launcher_round.png'));

  const canvas = Math.round(108 * scale);
  const contentSize = Math.round(64 * scale);
  const artwork = await sharp(source).resize(contentSize, contentSize, { fit: 'contain' }).png().toBuffer();
  const margin = Math.floor((canvas - contentSize) / 2);
  await sharp({ create: { width: canvas, height: canvas, channels: 4, background: { r: 0, g: 0, b: 0, alpha: 0 } } })
    .composite([{ input: artwork, left: margin, top: margin }]).png().toFile(join(directory, 'ic_launcher_foreground.png'));
  await sharp({ create: { width: canvas, height: canvas, channels: 4, background } })
    .png().toFile(join(directory, 'ic_launcher_background.png'));
}

const adaptive = `<?xml version="1.0" encoding="utf-8"?>
<adaptive-icon xmlns:android="http://schemas.android.com/apk/res/android">
    <background android:drawable="@mipmap/ic_launcher_background" />
    <foreground android:drawable="@mipmap/ic_launcher_foreground" />
</adaptive-icon>
`;
const adaptiveDirectory = join(res, 'mipmap-anydpi-v26');
await mkdir(adaptiveDirectory, { recursive: true });
await writeFile(join(adaptiveDirectory, 'ic_launcher.xml'), adaptive);
await writeFile(join(adaptiveDirectory, 'ic_launcher_round.xml'), adaptive);
// Retire the unused Android-template foreground vector containing the old letter.
await writeFile(join(res, 'drawable-v24/ic_launcher_foreground.xml'), `<?xml version="1.0" encoding="utf-8"?>
<bitmap xmlns:android="http://schemas.android.com/apk/res/android"
    android:src="@mipmap/ic_launcher_foreground" android:gravity="center" />
`);
console.log('Android cat icons prepared for 6 densities; APK was not built.');
