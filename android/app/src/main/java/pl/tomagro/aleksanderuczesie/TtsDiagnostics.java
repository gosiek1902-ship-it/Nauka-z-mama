package pl.tomagro.aleksanderuczesie;

import android.app.Activity;
import android.media.AudioAttributes;
import android.media.AudioManager;
import android.os.Bundle;
import android.os.Handler;
import android.os.Looper;
import android.speech.tts.TextToSpeech;
import android.speech.tts.UtteranceProgressListener;
import android.util.Log;
import android.view.Gravity;
import android.view.ViewGroup;
import android.widget.Button;
import android.widget.FrameLayout;
import android.widget.LinearLayout;
import android.widget.TextView;
import java.util.Locale;
import java.util.function.Consumer;

/** Temporary native diagnostic; no WebView, JavaScript or user data is involved. */
final class TtsDiagnostics {
    private static Consumer<String> display;
    private final Handler main = new Handler(Looper.getMainLooper());
    private TextToSpeech testEngine;
    private final Activity activity;
    private final TextView result;
    private final StringBuilder history = new StringBuilder();
    private int run;
    private String initStatus = "TTS INIT: NOT RUN";
    private String languageStatus = "LANGUAGE: NOT RUN";
    private String speakStatus = "SPEAK: NOT RUN";
    private final Runnable initTimeout = () -> record("TTS INIT: NO CALLBACK after 15s");

    static void record(String event) {
        Log.i("NaukaTTS", android.os.SystemClock.elapsedRealtime() + "ms " + event);
        Consumer<String> sink = display;
        if (sink != null) sink.accept(event);
    }

    TtsDiagnostics(Activity activity) {
        this.activity = activity;
        LinearLayout box = new LinearLayout(activity);
        box.setOrientation(LinearLayout.VERTICAL);
        box.setBackgroundColor(0xffeeeeee);
        TextView title = new TextView(activity);
        title.setText("DIAGNOSTYKA APLIKACJI");
        title.setTextSize(18);
        box.addView(title);
        Button button = new Button(activity);
        button.setText("🔊 TEST GŁOSU");
        Button printButton = new Button(activity);
        printButton.setText("🖨️ TEST DRUKOWANIA");
        result = new TextView(activity);
        result.setTextSize(12);
        result.setMaxLines(9);
        result.setText("Natywna diagnostyka TTS — gotowa");
        box.addView(button);
        box.addView(printButton);
        box.addView(result);
        FrameLayout.LayoutParams params = new FrameLayout.LayoutParams(ViewGroup.LayoutParams.MATCH_PARENT,
            ViewGroup.LayoutParams.WRAP_CONTENT, Gravity.BOTTOM);
        activity.addContentView(box, params);
        display = event -> main.post(() -> {
            if (event.startsWith("TTS INIT:")) initStatus = event;
            if (event.startsWith("LANGUAGE pl-PL:")) languageStatus = event;
            if (event.startsWith("SPEAK:")) speakStatus = event;
            history.append(event).append('\n');
            if (history.length() > 3000) history.delete(0, history.length() - 3000);
            String[] lines = history.toString().split("\n");
            result.setText(initStatus + "\n" + languageStatus + "\n" + speakStatus + "\n"
                + String.join("\n", java.util.Arrays.copyOfRange(lines, Math.max(0, lines.length - 6), lines.length)));
        });
        button.setOnClickListener(view -> test());
        printButton.setOnClickListener(view -> {
            try {
                android.print.PrintManager printer = (android.print.PrintManager) activity.getSystemService(Activity.PRINT_SERVICE);
                if (printer == null) { record("PRINT: ERROR — brak usługi drukowania"); return; }
                android.print.PrintJob job = printer.print("Nauka z mamą — test drukowania", new DiagnosticPrintAdapter(activity), null);
                record("PRINT: systemowy ekran " + (job == null ? "ERROR" : "OPEN; job=" + job.getId()));
            } catch (RuntimeException error) { record("PRINT: ERROR " + error.getClass().getSimpleName() + ": " + error.getMessage()); }
        });
    }

    private void test() {
        final int request = ++run;
        initStatus = "TTS INIT: WAITING";
        languageStatus = "LANGUAGE: NOT RUN";
        speakStatus = "SPEAK: NOT RUN";
        main.removeCallbacks(initTimeout);
        if (testEngine != null) { record("TEST previous engine STOP: " + testEngine.stop()); testEngine.shutdown(); }
        record("TEST button: Java directly; TTS INIT: WAITING; LANGUAGE: NOT RUN; SPEAK: NOT RUN");
        main.postDelayed(initTimeout, 15_000);
        try {
            testEngine = new TextToSpeech(activity, status -> main.post(() -> {
                if (request != run) return;
                main.removeCallbacks(initTimeout);
                record("TTS INIT: " + TtsDiagnosticStatus.init(status));
                if (status != TextToSpeech.SUCCESS) return;
                record("ENGINE: " + testEngine.getDefaultEngine());
                testEngine.setOnUtteranceProgressListener(new UtteranceProgressListener() {
                    @Override public void onStart(String id) { record("TEST onStart: " + id); }
                    @Override public void onDone(String id) { record("TEST onDone: " + id); }
                    @Override public void onError(String id) { onError(id, TextToSpeech.ERROR); }
                    @Override public void onError(String id, int code) { record("TEST onError: " + code + " id=" + id); }
                    @Override public void onStop(String id, boolean interrupted) { record("TEST onStop: " + id + " interrupted=" + interrupted); }
                });
                try {
                    for (String tag : new String[]{"pl-PL", "en-GB", "de-DE"}) {
                        Locale locale = Locale.forLanguageTag(tag);
                        record("AVAILABLE " + tag + ": " + TtsDiagnosticStatus.language(testEngine.isLanguageAvailable(locale)));
                        record("setLanguage " + tag + ": " + TtsDiagnosticStatus.language(testEngine.setLanguage(locale)));
                    }
                    int language = testEngine.setLanguage(Locale.forLanguageTag("pl-PL"));
                    record("LANGUAGE pl-PL: " + TtsDiagnosticStatus.language(language));
                    if (language < TextToSpeech.LANG_AVAILABLE) return;
                    AudioManager audio = (AudioManager) activity.getSystemService(Activity.AUDIO_SERVICE);
                    record("MEDIA VOLUME: " + (audio == null ? "unknown" : audio.getStreamVolume(AudioManager.STREAM_MUSIC)));
                    int attributes = testEngine.setAudioAttributes(new AudioAttributes.Builder().setUsage(AudioAttributes.USAGE_MEDIA)
                        .setContentType(AudioAttributes.CONTENT_TYPE_SPEECH).build());
                    record("AUDIO: " + TtsDiagnosticStatus.init(attributes));
                    Bundle parameters = new Bundle();
                    parameters.putFloat(TextToSpeech.Engine.KEY_PARAM_VOLUME, 1f);
                    int speak = testEngine.speak("To jest test głosu. Jeśli to słyszysz, syntezator działa.",
                        TextToSpeech.QUEUE_FLUSH, parameters, "native-test-" + request);
                    record("SPEAK: " + TtsDiagnosticStatus.init(speak));
                } catch (RuntimeException error) { record("TEST EXCEPTION: " + error.getClass().getSimpleName() + ": " + error.getMessage()); }
            }));
        } catch (RuntimeException error) { main.removeCallbacks(initTimeout); record("TTS INIT EXCEPTION: " + error.getMessage()); }
    }

    void close() {
        ++run;
        display = null;
        main.removeCallbacksAndMessages(null);
        if (testEngine != null) { testEngine.stop(); testEngine.shutdown(); testEngine = null; }
    }
}
