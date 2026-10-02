import { cp, mkdir, rm, readFile, writeFile, readdir } from 'node:fs/promises';
import { join, resolve } from 'node:path';
import { createHash } from 'node:crypto';
import { fileURLToPath } from 'node:url';

const root = resolve(fileURLToPath(new URL('..', import.meta.url)));
const webDir = join(root, 'www');
await rm(webDir, { recursive: true, force: true });
await mkdir(webDir, { recursive: true });

for (const file of ['index.html', 'styles.css', 'manifest.webmanifest', 'service-worker.js']) {
  await cp(join(root, file), join(webDir, file));
}
await cp(join(root, 'src'), join(webDir, 'src'), { recursive: true });
await cp(join(root, 'assets/icons'), join(webDir, 'assets/icons'), { recursive: true });

async function listFiles(directory, prefix = '') {
  const entries = await readdir(directory, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    const name = prefix + entry.name;
    if (entry.isDirectory()) files.push(...await listFiles(join(directory, entry.name), `${name}/`));
    else if (entry.isFile()) files.push(name);
    else throw new Error(`Unsupported web asset: ${name}`);
  }
  return files.sort();
}
const sha256 = (data) => createHash('sha256').update(data).digest('hex');
const compatibility = JSON.parse(await readFile(join(root, 'app-release.json'), 'utf8'));
// The version changes with file contents, without manually bumping lesson versions.
const sourceFiles = await listFiles(webDir);
const fingerprint = [];
for (const path of sourceFiles) fingerprint.push([path, sha256(await readFile(join(webDir, path)))]);
const version = sha256(JSON.stringify({ compatibility, fingerprint }));
const runtimeVersion = { ...compatibility, version };
await writeFile(join(webDir, 'app-version.json'), JSON.stringify(runtimeVersion, null, 2));
const worker = await readFile(join(webDir, 'service-worker.js'), 'utf8');
await writeFile(join(webDir, 'service-worker.js'), worker.replace("'aleksander-app-shell-v10'", `'aleksander-app-shell-${version}'`));

const paths = await listFiles(webDir);
const files = [];
const releaseDirectory = join(webDir, 'updates/releases', version);
for (const path of paths) {
  const bytes = await readFile(join(webDir, path));
  files.push({ path, size: bytes.length, sha256: sha256(bytes) });
  await mkdir(resolve(releaseDirectory, path, '..'), { recursive: true });
  await writeFile(join(releaseDirectory, path), bytes);
}
const manifest = { ...runtimeVersion, basePath: `/updates/releases/${version}/`, files };
await writeFile(join(releaseDirectory, 'release.json'), JSON.stringify(manifest, null, 2));
await writeFile(join(webDir, 'updates/latest.json'), JSON.stringify(manifest, null, 2));
console.log(`Web/PWA and Android update prepared: ${version.slice(0, 12)}`);
