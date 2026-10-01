import { access } from 'node:fs/promises';

// Gotowe rozmiary ikon są zapisane w repozytorium i pochodzą z assets/icon.png.
// Dzięki temu instalacja nie wymaga natywnych bibliotek do obróbki grafiki.
for (const path of [
  'assets/icons/favicon-16.png',
  'assets/icons/favicon-32.png',
  'assets/icons/icon-192.png',
  'assets/icons/icon-512.png',
  'assets/icons/icon-maskable-512.png',
]) {
  await access(path);
}
