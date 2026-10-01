import { cp, mkdir, rm } from 'node:fs/promises';
import { join } from 'node:path';

const webDir = 'www';
await rm(webDir, { recursive: true, force: true });
await mkdir(webDir, { recursive: true });

for (const file of ['index.html', 'styles.css', 'manifest.webmanifest', 'service-worker.js']) {
  await cp(file, join(webDir, file));
}
await cp('src', join(webDir, 'src'), { recursive: true });
await cp('assets/icons', join(webDir, 'assets/icons'), { recursive: true });
console.log('Web assets copied to www/.');
