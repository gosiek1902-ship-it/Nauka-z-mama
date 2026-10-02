package pl.tomagro.aleksanderuczesie;

import android.print.PrintManager;
import android.webkit.WebView;
import android.webkit.WebViewClient;
import com.getcapacitor.Plugin;
import com.getcapacitor.PluginCall;
import com.getcapacitor.PluginMethod;
import com.getcapacitor.annotation.CapacitorPlugin;

/** The Android PrintManager used by the successful native diagnostic, with lesson content. */
@CapacitorPlugin(name = "AndroidPrint")
public class AndroidPrintPlugin extends Plugin {
    private WebView document;
    private PluginCall pending;
    @PluginMethod public void print(PluginCall call) {
        getActivity().runOnUiThread(() -> {
            String html = call.getString("html", "");
            if (html.isEmpty() || html.length() > 2_000_000) { call.reject("Brak treści lub zbyt duży dokument do wydruku."); return; }
            if (pending != null) { call.reject("Trwa przygotowanie poprzedniego wydruku."); return; }
            if (document != null) { call.reject("Poprzedni wydruk jest nadal otwarty. Zamknij ekran drukowania i spróbuj ponownie."); return; }
            pending = call;
            document = new WebView(getActivity());
            // Isolated print document: no scripts, storage, profile changes, or external resources.
            document.getSettings().setJavaScriptEnabled(false);
            document.getSettings().setAllowFileAccess(false);
            document.getSettings().setBlockNetworkLoads(true);
            document.setWebViewClient(new WebViewClient() {
                @Override public void onPageFinished(WebView view, String url) {
                    if (pending != call) return;
                    try {
                        PrintManager printer = (PrintManager) getActivity().getSystemService(android.content.Context.PRINT_SERVICE);
                        if (printer == null) throw new IllegalStateException("Brak systemowej usługi drukowania.");
                        String title = call.getString("title", "Nauka z mamą");
                        android.print.PrintDocumentAdapter delegate = view.createPrintDocumentAdapter(title);
                        android.print.PrintDocumentAdapter adapter = new android.print.PrintDocumentAdapter() {
                            @Override public void onStart() { delegate.onStart(); }
                            @Override public void onLayout(android.print.PrintAttributes oldAttributes, android.print.PrintAttributes newAttributes,
                                android.os.CancellationSignal signal, LayoutResultCallback result, android.os.Bundle extras) {
                                delegate.onLayout(oldAttributes, newAttributes, signal, result, extras);
                            }
                            @Override public void onWrite(android.print.PageRange[] pages, android.os.ParcelFileDescriptor destination,
                                android.os.CancellationSignal signal, WriteResultCallback result) { delegate.onWrite(pages, destination, signal, result); }
                            @Override public void onFinish() {
                                delegate.onFinish();
                                view.destroy();
                                if (document == view) document = null;
                            }
                        };
                        if (printer.print(title, adapter, null) == null)
                            throw new IllegalStateException("Nie udało się otworzyć drukowania.");
                        pending = null;
                        call.resolve(); // System print screen opened; this does not claim a physical print completed.
                    } catch (RuntimeException error) {
                        pending = null; view.destroy(); document = null;
                        call.reject("Nie udało się uruchomić drukowania: " + error.getMessage());
                    }
                }
            });
            document.loadDataWithBaseURL(null, html, "text/html", "UTF-8", null);
        });
    }
    @Override protected void handleOnDestroy() {
        getActivity().runOnUiThread(() -> {
            if (pending != null) { pending.reject("Drukowanie przerwane przez zamknięcie aplikacji."); pending = null; }
            if (document != null) { document.destroy(); document = null; }
        });
    }
}
