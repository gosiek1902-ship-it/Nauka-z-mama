package pl.tomagro.aleksanderuczesie;

import android.media.AudioAttributes;
import android.media.AudioManager;
import android.os.Bundle;
import android.os.Handler;
import android.os.Looper;
import android.speech.tts.TextToSpeech;
import android.speech.tts.UtteranceProgressListener;
import android.speech.tts.Voice;
import com.getcapacitor.Plugin;
import com.getcapacitor.PluginCall;
import com.getcapacitor.PluginMethod;
import com.getcapacitor.annotation.CapacitorPlugin;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.Locale;
import java.util.Set;
import java.util.HashSet;

/** One fragment at a time. Resolve only after playback, never just after queueing. */
@CapacitorPlugin(name = "AndroidSpeech")
public class AndroidSpeechPlugin extends Plugin {
    private final Handler main = new Handler(Looper.getMainLooper());
    private TextToSpeech engine;
    private boolean ready;
    private PluginCall pending;
    private String utteranceId;
    private long generation;
    private final Set<String> failedVoices = new HashSet<>();
    private final Runnable timeout = () -> fail("Silnik mowy nie odpowiedział. Sprawdź ustawienia zamiany tekstu na mowę w telefonie.");

    @PluginMethod public void speak(PluginCall call) {
        TtsDiagnostics.record("PLUGIN speak received; lang=" + call.getString("lang", "") + " chars=" + call.getString("text", "").length());
        main.post(() -> {
            cancel();
            String text = call.getString("text", "");
            String lang = call.getString("lang", "");
            if (text.trim().isEmpty() || !lang.matches("(pl|en|de)(-[A-Za-z]{2})?")) {
                call.reject("Brak tekstu lub nieprawidłowe jawne oznaczenie języka.");
                return;
            }
            pending = call;
            failedVoices.clear();
            main.postDelayed(timeout, 15_000);
            if (ready) speakReady();
            else if (engine == null) initialize();
        });
    }

    private void initialize() {
        final long initGeneration = ++generation;
        try {
            engine = new TextToSpeech(getContext(), status -> main.post(() -> {
                TtsDiagnostics.record("PLUGIN onInit: " + TtsDiagnosticStatus.init(status) + " generation=" + initGeneration + "/" + generation);
                if (initGeneration != generation) return;
                if (status != TextToSpeech.SUCCESS) {
                    fail("Nie udało się uruchomić czytania. Sprawdź ustawienia zamiany tekstu na mowę w telefonie.");
                    shutdown();
                    return;
                }
                ready = true;
                engine.setOnUtteranceProgressListener(new UtteranceProgressListener() {
                    @Override public void onStart(String id) { main.post(() -> {
                        TtsDiagnostics.record("PLUGIN onStart: " + id);
                        if (id.equals(utteranceId)) {
                            main.removeCallbacks(timeout);
                            main.postDelayed(timeout, 180_000);
                        }
                    }); }
                    @Override public void onDone(String id) { main.post(() -> finish(id)); }
                    @Override public void onError(String id) { onError(id, TextToSpeech.ERROR); }
                    @Override public void onError(String id, int code) { main.post(() -> {
                        TtsDiagnostics.record("PLUGIN onError: code=" + code + " id=" + id);
                        if (!id.equals(utteranceId)) return;
                        Voice voice = engine.getVoice();
                        if ((code == TextToSpeech.ERROR_NOT_INSTALLED_YET || code == TextToSpeech.ERROR_SYNTHESIS)
                            && voice != null && failedVoices.add(voice.getName())) {
                            utteranceId = null;
                            main.removeCallbacks(timeout);
                            main.postDelayed(timeout, 15_000);
                            speakReady();
                        } else fail("Błąd odtwarzania mowy (" + code + "). Sprawdź głos i ustawienia zamiany tekstu na mowę w telefonie.");
                    }); }
                    @Override public void onStop(String id, boolean interrupted) { TtsDiagnostics.record("PLUGIN onStop: " + id + " interrupted=" + interrupted); }
                });
                speakReady();
            }));
        } catch (RuntimeException error) {
            fail("Nie udało się uruchomić silnika mowy. Sprawdź ustawienia zamiany tekstu na mowę w telefonie.");
            shutdown();
        }
    }

    private void speakReady() {
        if (pending == null) return;
        try {
            Locale locale = Locale.forLanguageTag(pending.getString("lang", "pl-PL"));
            // Never substitute a different language. Prefer an installed offline voice.
            ArrayList<Voice> voices = new ArrayList<>();
            Set<Voice> available = engine.getVoices();
            if (available != null) for (Voice voice : available) {
                if (voice.getLocale().getLanguage().equals(locale.getLanguage())
                    && !failedVoices.contains(voice.getName())
                    && (voice.getFeatures() == null || !voice.getFeatures().contains(TextToSpeech.Engine.KEY_FEATURE_NOT_INSTALLED))) voices.add(voice);
            }
            voices.sort(Comparator.comparing(Voice::isNetworkConnectionRequired)
                .thenComparing(v -> !v.getLocale().equals(locale)).thenComparing(Voice::getName));
            boolean selected = false;
            for (Voice voice : voices) {
                int availableCode = engine.isLanguageAvailable(voice.getLocale());
                TtsDiagnostics.record("PLUGIN available " + voice.getLocale() + ": " + TtsDiagnosticStatus.language(availableCode));
                if (availableCode >= TextToSpeech.LANG_AVAILABLE) {
                    int voiceCode = engine.setVoice(voice);
                    TtsDiagnostics.record("PLUGIN setVoice " + voice.getName() + ": " + TtsDiagnosticStatus.init(voiceCode));
                    if (voiceCode == TextToSpeech.SUCCESS) { selected = true; break; }
                }
            }
            if (!selected && engine.isLanguageAvailable(locale) >= TextToSpeech.LANG_AVAILABLE
                && diagnosticSetLanguage(locale) >= TextToSpeech.LANG_AVAILABLE) {
                TtsDiagnostics.record("PLUGIN setLanguage fallback succeeded: " + locale);
                Voice voice = engine.getVoice();
                selected = voice != null && voice.getLocale().getLanguage().equals(locale.getLanguage())
                    && !failedVoices.contains(voice.getName())
                    && (voice.getFeatures() == null || !voice.getFeatures().contains(TextToSpeech.Engine.KEY_FEATURE_NOT_INSTALLED));
            }
            TtsDiagnostics.record("PLUGIN language=" + locale + " selected=" + selected + " (setLanguage only used as fallback)");
            if (!selected) {
                fail("Brak dostępnego głosu dla języka " + locale.getLanguage() + ". Zainstaluj ten język w ustawieniach zamiany tekstu na mowę telefonu.");
                return;
            }
            AudioManager audio = (AudioManager) getContext().getSystemService(android.content.Context.AUDIO_SERVICE);
            if (audio != null && audio.getStreamVolume(AudioManager.STREAM_MUSIC) == 0) {
                fail("Głośność multimediów wynosi zero. Zwiększ ją przyciskami głośności telefonu i ponownie naciśnij Przeczytaj.");
                return;
            }
            if (engine.setAudioAttributes(new AudioAttributes.Builder().setUsage(AudioAttributes.USAGE_MEDIA)
                .setContentType(AudioAttributes.CONTENT_TYPE_SPEECH).build()) != TextToSpeech.SUCCESS) {
                fail("Nie udało się ustawić wyjścia dźwięku dla mowy."); return;
            }
            Bundle parameters = new Bundle();
            parameters.putFloat(TextToSpeech.Engine.KEY_PARAM_VOLUME, 1f);
            parameters.putInt(TextToSpeech.Engine.KEY_PARAM_STREAM, AudioManager.STREAM_MUSIC);
            utteranceId = "fragment-" + (++generation);
            int speakCode = engine.speak(pending.getString("text", ""), TextToSpeech.QUEUE_FLUSH, parameters, utteranceId);
            TtsDiagnostics.record("PLUGIN speak: " + TtsDiagnosticStatus.init(speakCode) + " id=" + utteranceId);
            if (speakCode != TextToSpeech.SUCCESS) {
                fail("Silnik mowy nie przyjął tekstu. Sprawdź ustawienia zamiany tekstu na mowę w telefonie.");
            }
        } catch (RuntimeException error) {
            fail("Błąd silnika mowy. Sprawdź ustawienia zamiany tekstu na mowę w telefonie.");
        }
    }

    private void finish(String id) {
        TtsDiagnostics.record("PLUGIN onDone: " + id);
        if (!id.equals(utteranceId) || pending == null) return;
        PluginCall call = pending;
        pending = null; utteranceId = null;
        main.removeCallbacks(timeout);
        call.resolve();
    }
    private void fail(String message) {
        PluginCall call = pending;
        pending = null; utteranceId = null;
        main.removeCallbacks(timeout);
        if (engine != null) TtsDiagnostics.record("PLUGIN stop: " + TtsDiagnosticStatus.init(engine.stop()));
        if (call != null) call.reject(message);
        shutdown(); // A failed/disconnected engine must be initialized again on the next click.
    }
    private void cancel() {
        TtsDiagnostics.record("PLUGIN cancel; active=" + utteranceId + " pending=" + (pending != null));
        PluginCall call = pending;
        pending = null; utteranceId = null;
        main.removeCallbacks(timeout);
        if (engine != null) TtsDiagnostics.record("PLUGIN stop: " + TtsDiagnosticStatus.init(engine.stop()));
        if (call != null) call.reject("Czytanie zatrzymane.");
    }
    private void shutdown() {
        ++generation;
        ready = false;
        if (engine != null) { engine.shutdown(); engine = null; }
    }
    private int diagnosticSetLanguage(Locale locale) {
        int code = engine.setLanguage(locale);
        TtsDiagnostics.record("PLUGIN setLanguage " + locale + ": " + TtsDiagnosticStatus.language(code));
        return code;
    }
    @PluginMethod public void stop(PluginCall call) {
        TtsDiagnostics.record("PLUGIN stop request from WebView");
        main.post(() -> { cancel(); call.resolve(); });
    }
    @Override protected void handleOnDestroy() { main.post(() -> { cancel(); shutdown(); }); }
}
