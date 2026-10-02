# Aktualizacje Android i PWA

Android zachowuje nazwę, ikonę, `pl.tomagro.aleksanderuczesie` oraz dotychczasowy origin Capacitor (`https://localhost`). Nie przełącza WebView na Netlify. Profile i postępy pozostają w dotychczasowym localStorage; aktualizator nie czyta, nie zapisuje i nie resetuje danych użytkownika.

## Publikacja

Netlify musi mieć podłączone repozytorium `gosiek1902-ship-it/Nauka-z-mama` i gałąź produkcyjną `main`. `netlify.toml` ustawia budowanie przez `node scripts/build-web.mjs` i publikację `www`. Konfiguracja wyłącza przekształcanie plików po obliczeniu sum kontrolnych.

Skrypt nie zmienia źródeł lekcji. Generuje identyfikator SHA-256 na podstawie zawartości plików i kontraktu `app-release.json`. Publikuje stronę/PWA, `/updates/latest.json` i `/updates/releases/<wersja>/...`. Każdy plik ma rozmiar i SHA-256. Nie trzeba ręcznie zwiększać wersji po dodaniu materiałów. Pojedynczy deploy zawiera cały pakiet. Jeśli podczas pobierania Netlify publikuje kolejną wersję i poprzednie pliki przestają być dostępne, pobieranie nie jest zatwierdzane; następne sprawdzenie pobierze aktualny pakiet.

## Android

1. Startuje ostatnia zweryfikowana lokalna wersja lub wersja dołączona do APK.
2. Aktualizator sprawdza HTTPS przy starcie, wznowieniu i potwierdzonym odzyskaniu internetu. Zwykłe sprawdzenia są ograniczone do jednego na minutę. Odzyskanie internetu wymusza ponowne sprawdzenie, również gdy poprzednie pobieranie jeszcze kończy się błędem; nie wymaga pracy w tle przy zamkniętej aplikacji.
3. Weryfikuje certyfikat TLS, przypiętą domenę, HTTP 200 (bez przekierowań), package ID, wersję protokołu, API natywne i schemat danych. SHA-256 wykrywa niekompletne/uszkodzone pliki; źródłem zaufania jest HTTPS i kontrola konta/repozytorium Netlify, nie odrębny podpis wydania.
4. Pobiera do prywatnego katalogu tymczasowego. Ograniczenia: 128 plików, 4 MiB na plik, 16 MiB razem, manifest 128 KiB. Nie rozpakowuje archiwów ani nie akceptuje ścieżek poza listą zasobów webowych.
5. Po ponownym sprawdzeniu wszystkich plików atomowo przenosi katalog i zapisuje wskaźnik przygotowanej wersji. Obecna lekcja działa dalej.
6. Wersja jest stosowana przy kolejnym **nowym uruchomieniu Activity**. Samo wyjście na ekran główny i powrót do tej samej sesji nie przeładowuje lekcji; można zamknąć aplikację z listy ostatnich aplikacji i otworzyć ponownie.
7. Nowy kod potwierdza zgodność identyfikatora wydania i poprawne wyrenderowanie panelu, bez błędu JavaScript podczas startu. Brak potwierdzenia przez 30 sekund powoduje powrót do poprzednich plików. Zabicie procesu podczas niepotwierdzonego startu również powoduje powrót przy następnym uruchomieniu. Błędne wydanie nie jest ponownie próbowane, dopóki nie zmieni się jego identyfikator.

Poprzednie kompletne wydania pozostają w prywatnym katalogu aplikacji; ta implementacja nie usuwa automatycznie starych wydań. Wraz z liczbą aktualizacji rośnie użycie miejsca. Nie należy używać systemowego „Wyczyść dane” ani odinstalowywać aplikacji, jeśli mają pozostać lokalne postępy. Mechanizm nie synchronizuje danych między telefonem a przeglądarką.

## PWA i lokalne dane

Android nie rejestruje service workera. Przy ładowaniu usuwa wyłącznie wcześniejsze rejestracje workera w swoim lokalnym origin i cache o prefiksie `aleksander-app-shell-`; nigdy localStorage, IndexedDB ani całego magazynu WebView. Wersja w przeglądarce nadal rejestruje service worker. Cache PWA otrzymuje automatyczny identyfikator wydania, pobiera komplet zasobów i aktywuje nową wersję po zamknięciu starych okien aplikacji. Nie przeładowuje automatycznie rozpoczętego sprawdzianu. Bez internetu PWA korzysta z kompletnej ostatnio zapisanej wersji.

## Zgodność i pierwsza instalacja

Kontrakt początkowy: protokół 1, `nativeApi: 1`, `dataSchema: 2`. Zmiana zależności natywnych, origin, package ID lub niezgodna migracja danych wymaga osobnego planu i ewentualnie nowego APK; publikacja niezgodnego kontraktu nie jest przyjmowana przez ten aktualizator.

Przed jednorazowym zbudowaniem APK należy uruchomić `node scripts/build-web.mjs` i synchronizację Capacitor. APK musi być podpisany kluczem zgodnym z już zainstalowaną aplikacją, mieć większy versionCode i być instalowany jako aktualizacja, bez odinstalowania. Tego klucza nie należy zmieniać. Ta implementacja nie buduje APK i nie zwiększa jeszcze versionCode.

## Weryfikacja

`node --test tests/updates.test.mjs` sprawdza publikowany pakiet, sumy kontrolne, PWA, niezmienione źródła i granice danych. `android/gradlew.bat :app:testDebugUnitTest :app:compileDebugJavaWithJavac` sprawdza logikę bezpieczeństwa oraz kompilację Java, bez assemble/package APK.

Przed instalacją na głównym telefonie wymagany jest test urządzenia: aktualizacja z A do B, odcięcie sieci w trakcie pobierania, start offline, błędne wydanie, odzyskanie internetu, profile i postępy przed/po aktualizacji, PL/EN/DE oraz wyszukiwanie. Testy JVM nie zastępują rzeczywistego Android WebView. Trzeba również potwierdzić opublikowanie `/updates/latest.json` na właściwej domenie Netlify po push.
