# Aleksander Kozdra – Uczę się po swojemu

Przyjazna aplikacja do nauki dla ucznia klasy 5. Postępy są zapisywane lokalnie w przeglądarce; aplikacja nie wymaga konta.

## Uruchomienie wersji internetowej

To statyczna aplikacja. Otwórz `index.html` w przeglądarce albo uruchom lokalny serwer w katalogu projektu, na przykład:

```sh
npx serve .
```

Netlify może nadal publikować projekt z katalogu głównego repozytorium. Pliki `manifest.webmanifest` i `service-worker.js` zapewniają instalację PWA i buforowanie podstawowych zasobów do pracy offline.

## Przygotowanie Androida

Wymagane są Node.js 20 lub nowszy, npm, JDK 21 oraz Android SDK (Android Studio nie jest konieczne). Zainstaluj Android SDK Command-line Tools, platform-tools, platformę Android API 36 i Build Tools 36.0.0. Ustaw `JAVA_HOME`, `ANDROID_HOME` i dodaj katalogi `bin` JDK, `platform-tools` oraz `cmdline-tools/latest/bin` do `PATH`.

```sh
npm install
npx cap add android
npx cap sync android
```

Projekt Android korzysta z tej samej aplikacji webowej i tych samych materiałów. Oficjalna grafika w `assets/icon.png` jest źródłem ikon; rozmiary PWA są dołączone w repozytorium. Po dodaniu platformy wygeneruj zasoby Androida z tej grafiki:

```sh
npm run android:icons
```

## Budowanie APK

Po przygotowaniu środowiska Android zbuduj debug APK:

```sh
npm run android:debug
```

Gotowy plik będzie w `android/app/build/outputs/apk/debug/app-debug.apk`. Skrypt `android:debug` odświeża webowe pliki i synchronizuje je przed kompilacją. W repozytorium dołączono również kopię `Aleksander-Kozdra-Ucze-sie-po-swojemu.apk` w katalogu głównym.

Identyfikator aplikacji: `pl.tomagro.aleksanderuczesie`.
