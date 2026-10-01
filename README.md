# Aleksander Kozdra – Uczę się po swojemu

Przyjazna aplikacja do nauki dla ucznia klasy 5. Postępy są zapisywane lokalnie w przeglądarce; aplikacja nie wymaga konta.

## Uruchomienie wersji internetowej

To statyczna aplikacja. Otwórz `index.html` w przeglądarce albo uruchom lokalny serwer w katalogu projektu, na przykład:

```sh
npx serve .
```

Netlify może nadal publikować projekt z katalogu głównego repozytorium. Pliki `manifest.webmanifest` i `service-worker.js` zapewniają instalację PWA i buforowanie podstawowych zasobów do pracy offline.

## Przygotowanie Androida

Wymagane są Node.js 20 lub nowszy, npm, Android Studio oraz Android SDK/JDK skonfigurowane w Android Studio.

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

Gotowy plik będzie w `android/app/build/outputs/apk/debug/app-debug.apk`. Skrypt `android:debug` odświeża webowe pliki i synchronizuje je przed kompilacją. APK nie jest przechowywany w repozytorium.

Identyfikator aplikacji: `pl.tomagro.aleksanderuczesie`.
