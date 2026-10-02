import test, { before } from 'node:test';
import assert from 'node:assert/strict';
import { readFile, stat, cp, mkdtemp, writeFile, rm } from 'node:fs/promises';
import { execFileSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import vm from 'node:vm';
import { resolve } from 'node:path';
import { tmpdir } from 'node:os';

const root = resolve(import.meta.dirname, '..');
const read = (path) => readFile(resolve(root, path));
const sha = (bytes) => createHash('sha256').update(bytes).digest('hex');
let release;
before(async () => {
  execFileSync(process.execPath, ['scripts/build-web.mjs'], { cwd: root });
  release = JSON.parse(await read('www/updates/latest.json'));
});

test('published release is complete, versioned, compatible, and identical to web assets', async () => {
  assert.match(release.version, /^[a-f0-9]{64}$/);
  assert.equal(release.appId, 'pl.tomagro.aleksanderuczesie');
  assert.equal(release.nativeApi, 1);
  assert.equal(release.transport, 'raw-files-v1');
  assert.equal(release.dataSchema, 2);
  assert.equal(release.basePath, `/updates/releases/${release.version}/`);
  assert.ok(release.files.length <= 128);
  assert.equal(new Set(release.files.map((f) => f.path)).size, release.files.length);
  let total = 0;
  for (const file of release.files) {
    assert.match(file.path, /^(index\.html|styles\.css|manifest\.webmanifest|service-worker\.js|app-version\.json|src\/[\w-]+\.js|assets\/icons\/[\w-]+\.png)$/);
    const bytes = await read(`www${release.basePath}${file.path}.bin`);
    assert.equal(bytes.length, file.size);
    assert.equal(sha(bytes), file.sha256);
    assert.ok(file.size <= 4 * 1024 * 1024);
    total += file.size;
    assert.deepEqual(bytes, await read(`www/${file.path}`));
  }
  assert.ok(total <= 16 * 1024 * 1024);
  const runtime = JSON.parse(await read('www/app-version.json'));
  assert.equal(runtime.version, release.version);
  for (const file of ['src/app.js', 'src/subjects.js', 'src/expanded-content.js', 'styles.css', 'manifest.webmanifest']) {
    assert.deepEqual(await read(file), await read(`www/${file}`));
  }
  const html = (await read('www/index.html')).toString();
  for (const [, path] of html.matchAll(/(?:src|href)="((?:src|assets)\/[^"?#]+)"/g)) {
    assert.ok(release.files.some((file) => file.path === path), `Missing HTML resource: ${path}`);
  }
});

test('identical inputs produce identical version and checksums', async () => {
  const first = await read('www/updates/latest.json');
  execFileSync(process.execPath, ['scripts/build-web.mjs'], { cwd: root });
  assert.deepEqual(await read('www/updates/latest.json'), first);
});

test('adding a material automatically changes the release and PWA version without changing project sources', async () => {
  const fixture = await mkdtemp(resolve(tmpdir(), 'aleksander-build-test-'));
  try {
    for (const path of ['scripts', 'src', 'assets/icons', 'index.html', 'styles.css', 'service-worker.js', 'manifest.webmanifest', 'app-release.json']) {
      await cp(resolve(root, path), resolve(fixture, path), { recursive: true });
    }
    const materials = await read('src/subjects.js');
    await writeFile(resolve(fixture, 'src/subjects.js'), Buffer.concat([materials, Buffer.from('\n// new material publication fixture\n')]));
    execFileSync(process.execPath, ['scripts/build-web.mjs'], { cwd: fixture });
    const next = JSON.parse(await readFile(resolve(fixture, 'www/updates/latest.json')));
    assert.notEqual(next.version, release.version);
    assert.ok((await readFile(resolve(fixture, 'www/service-worker.js'), 'utf8')).includes(`aleksander-app-shell-${next.version}`));
    assert.deepEqual(await read('src/subjects.js'), materials);
  } finally { await rm(fixture, { recursive: true, force: true }); }
});

function browserContext(native, rendered = true) {
  const events = {};
  const calls = [];
  const forbidStorage = new Proxy({}, { get() { throw new Error('Update code accessed user storage'); } });
  const window = {
    addEventListener(name, callback) { events[name] = callback; },
    NaukaZMamaSubjects: [],
    Capacitor: native ? { isNativePlatform: () => true, Plugins: { AndroidUpdates: { ready: (value) => calls.push(value) } } } : undefined,
  };
  const context = { window, navigator: {}, document: { querySelector: () => ({ children: rendered ? [{}] : [] }) },
    console, localStorage: forbidStorage, sessionStorage: forbidStorage,
    fetch: async () => ({ ok: true, json: async () => ({ version: release.version }) }) };
  vm.createContext(context);
  return { context, calls, events };
}

test('native startup acknowledges actual release without reading or writing user storage', async () => {
  const { context, calls, events } = browserContext(true);
  vm.runInContext((await read('src/android-updates.js')).toString(), context);
  await context.window.NaukaZMamaAndroidReady();
  assert.equal(calls.length, 1);
  assert.equal(calls[0].version, release.version);
});

test('broken or unrendered startup cannot acknowledge a candidate release', async () => {
  for (const rendered of [true, false]) {
    const { context, calls, events } = browserContext(true, rendered);
    vm.runInContext((await read('src/android-updates.js')).toString(), context);
    if (rendered) events.error();
    await context.window.NaukaZMamaAndroidReady();
    assert.equal(calls.length, 0);
  }
});

test('web browser never calls native updater and Android never registers PWA worker', async () => {
  const web = browserContext(false);
  vm.runInContext((await read('src/android-updates.js')).toString(), web.context);
  assert.equal(web.events.load, undefined);
  assert.equal(web.context.window.NaukaZMamaAndroidReady, undefined);
  const native = browserContext(true);
  native.context.navigator.serviceWorker = { register() { throw new Error('Native registered a PWA worker'); } };
  vm.runInContext((await read('src/register-service-worker.js')).toString(), native.context);
  assert.equal(native.events.load, undefined);
});

test('PWA gets release-specific cache and checks on reconnect and resume without reloading a lesson', async () => {
  const worker = (await read('www/service-worker.js')).toString();
  assert.ok(worker.includes(`aleksander-app-shell-${release.version}`));
  assert.ok(!worker.includes('self.skipWaiting()'));
  assert.ok(!worker.includes('self.clients.claim()'));
  const cacheFiles = vm.runInNewContext(worker.slice(0, worker.indexOf("self.addEventListener")) + '; APP_FILES');
  for (const path of cacheFiles) {
    if (path !== './') assert.ok((await stat(resolve(root, 'www', path))).isFile());
  }
  let checks = 0, registrations = 0;
  const events = {}, documentEvents = {};
  const context = { window: { addEventListener: (name, callback) => { events[name] = callback; } },
    document: { hidden: false, addEventListener: (name, callback) => { documentEvents[name] = callback; } },
    navigator: { serviceWorker: { register: async (url, options) => {
      registrations++;
      assert.equal(options.updateViaCache, 'none');
      return { update: async () => { checks++; } };
    } } }, location: { protocol: 'https:' }, console };
  vm.runInNewContext((await read('src/register-service-worker.js')).toString(), context);
  events.load();
  await new Promise((resolve) => setImmediate(resolve));
  events.online(); documentEvents.visibilitychange();
  assert.equal(registrations, 1);
  assert.equal(checks, 2);
});

test('native update code never clears user storage or changes origin', async () => {
  for (const name of ['MainActivity', 'AndroidReleaseManager', 'UpdateState', 'AndroidUpdatesPlugin']) {
    const java = (await read(`android/app/src/main/java/pl/tomagro/aleksanderuczesie/${name}.java`)).toString();
    assert.doesNotMatch(java, /localStorage\.(?:clear|removeItem|setItem)|deleteDatabase|deleteAllData|clearCache\(|\.clear\(\)|CAP_SERVER_PATH/);
  }
  const config = JSON.parse(await read('capacitor.config.json'));
  assert.equal(config.appId, release.appId);
  assert.equal(config.server, undefined);
});

test('Android retires only PWA caches before acknowledging a newly loaded release', async () => {
  const java = (await read('android/app/src/main/java/pl/tomagro/aleksanderuczesie/MainActivity.java')).toString();
  const expression = java.slice(java.indexOf('webView.evaluateJavascript('), java.indexOf(', null);', java.indexOf('webView.evaluateJavascript(')));
  const script = [...expression.matchAll(/"((?:\\.|[^"\\])*)"/g)].map((match) => JSON.parse(`"${match[1]}"`)).join('');
  let workerRegistered = true, reloads = 0, acknowledgements = 0;
  const cacheNames = new Set(['aleksander-app-shell-v9', 'unrelated-user-cache']);
  const context = {
    window: { NaukaZMamaAndroidReady: async () => { acknowledgements++; } },
    navigator: { serviceWorker: { getRegistrations: async () => workerRegistered ? [{ unregister: async () => { workerRegistered = false; } }] : [] } },
    caches: { keys: async () => [...cacheNames], delete: async (name) => cacheNames.delete(name) },
    location: { reload: () => { reloads++; } },
    localStorage: new Proxy({}, { get() { throw new Error('User storage touched'); } }),
  };
  // Browser exposes caches both globally and on window.
  context.window.caches = context.caches;
  vm.createContext(context);
  await vm.runInContext(script, context);
  assert.equal(reloads, 1);
  assert.equal(acknowledgements, 0);
  assert.deepEqual([...cacheNames], ['unrelated-user-cache']);
  await vm.runInContext(script, context);
  assert.equal(reloads, 1);
  assert.equal(acknowledgements, 1);
});

test('PWA keeps a coherent offline release while a newer release is waiting', async () => {
  const source = (await read('service-worker.js')).toString();
  const storage = new Map();
  const key = (request) => new URL(typeof request === 'string' ? request : request.url, 'https://site.test/').href;
  let network = 'A';
  const fetch = async (request) => {
    if (!network) throw new Error('offline');
    const response = { ok: true, body: `${network}:${key(request)}`, clone() { return this; } };
    return response;
  };
  const caches = {
    async open(name) {
      if (!storage.has(name)) storage.set(name, new Map());
      const entries = storage.get(name);
      return {
        async match(request) { return entries.get(key(request)); },
        async put(request, response) { entries.set(key(request), response); },
        async addAll(requests) {
          const responses = await Promise.all(requests.map(fetch));
          requests.forEach((request, i) => entries.set(key(request), responses[i]));
        },
      };
    },
    async keys() { return [...storage.keys()]; },
    async delete(name) { return storage.delete(name); },
  };
  function createWorker(version) {
    const events = {};
    const self = { location: { origin: 'https://site.test' }, addEventListener: (name, callback) => { events[name] = callback; } };
    class Request { constructor(url) { this.url = key(url); } }
    vm.runInNewContext(source.replace('aleksander-app-shell-v10', `aleksander-app-shell-${version}`), { self, caches, fetch, Request, URL });
    return {
      async lifecycle(name) { let promise; events[name]({ waitUntil: (p) => { promise = p; } }); await promise; },
      async request(path, mode = 'cors') {
        let promise;
        events.fetch({ request: { url: key(path), method: 'GET', mode }, respondWith: (p) => { promise = p; } });
        return await promise;
      },
    };
  }
  const old = createWorker('A');
  await old.lifecycle('install'); await old.lifecycle('activate');
  network = 'B';
  const next = createWorker('B'); await next.lifecycle('install');
  assert.ok((await old.request('/', 'navigate')).body.startsWith('A:'));
  assert.ok((await old.request('/src/subjects.js')).body.startsWith('A:'));
  network = null;
  assert.ok((await old.request('/src/app.js')).body.startsWith('A:'));
  await next.lifecycle('activate');
  assert.ok((await next.request('/', 'navigate')).body.startsWith('B:'));
  assert.ok((await next.request('/src/subjects.js')).body.startsWith('B:'));
  assert.deepEqual(await caches.keys(), ['aleksander-app-shell-B']);
});
