package pl.tomagro.aleksanderuczesie;

import com.getcapacitor.BridgeActivity;
import com.getcapacitor.ServerPath;
import com.getcapacitor.WebViewListener;
import android.net.ConnectivityManager;
import android.net.Network;
import android.net.NetworkCapabilities;
import android.os.Handler;
import android.os.Looper;
import android.webkit.WebView;
import java.io.File;

public class MainActivity extends BridgeActivity {
    private AndroidReleaseManager releases;
    private final Handler handler = new Handler(Looper.getMainLooper());
    private ConnectivityManager connectivity;
    private ConnectivityManager.NetworkCallback networkCallback;
    private final Runnable startupTimeout = this::rollbackTrial;

    @Override
    protected void load() {
        releases = new AndroidReleaseManager(this);
        File directory = releases.prepareStartup();
        bridgeBuilder.setServerPath(directory == null
            ? new ServerPath(ServerPath.PathType.ASSET_PATH, "public")
            : new ServerPath(ServerPath.PathType.BASE_PATH, directory.getAbsolutePath()));
        registerPlugin(AndroidUpdatesPlugin.class);
        registerPlugin(AndroidSpeechPlugin.class);
        registerPlugin(AndroidPrintPlugin.class);
        bridgeBuilder.addWebViewListener(new WebViewListener() {
            @Override public void onPageLoaded(WebView webView) {
                // Retire only the old PWA worker/cache in the native origin. Never clear WebView data.
                webView.evaluateJavascript("(async()=>{let changed=false;"
                    + "if('serviceWorker' in navigator){const regs=await navigator.serviceWorker.getRegistrations();"
                    + "for(const r of regs){await r.unregister();changed=true;}}"
                    + "if('caches' in window){for(const k of await caches.keys()){"
                    + "if(k.startsWith('aleksander-app-shell-')){await caches.delete(k);changed=true;}}}"
                    + "if(changed)location.reload();else await window.NaukaZMamaAndroidReady?.();})().catch(()=>{});", null);
            }
        });
        super.load();
        TtsDiagnostics.record("MainActivity: AndroidSpeechPlugin registered");
        TtsDiagnostics.record("WEB SOURCE: " + (directory == null ? "bundled assets" : directory.getName()));
        if (!releases.state.trial().isEmpty()) handler.postDelayed(startupTimeout, 30_000);
        connectivity = (ConnectivityManager) getSystemService(CONNECTIVITY_SERVICE);
        networkCallback = new ConnectivityManager.NetworkCallback() {
            private Network validatedNetwork;
            @Override public void onCapabilitiesChanged(Network network, NetworkCapabilities capabilities) {
                if (capabilities.hasCapability(NetworkCapabilities.NET_CAPABILITY_VALIDATED)) {
                    if (!network.equals(validatedNetwork)) {
                        validatedNetwork = network;
                        releases.checkAfterReconnect();
                    }
                } else if (network.equals(validatedNetwork)) validatedNetwork = null;
            }
            @Override public void onLost(Network network) { if (network.equals(validatedNetwork)) validatedNetwork = null; }
        };
        connectivity.registerDefaultNetworkCallback(networkCallback);
    }

    @Override public void onResume() {
        super.onResume();
        // Resuming never swaps a running lesson. Only a fresh Activity startup applies a release.
        if (releases != null) releases.check();
    }

    void releaseReady(String version) {
        if (releases != null && releases.state.acknowledge(version)) handler.removeCallbacks(startupTimeout);
    }

    private void rollbackTrial() {
        if (releases == null || releases.state.trial().isEmpty() || bridge == null) return;
        releases.state.fail();
        File fallback = releases.activeDirectory();
        if (fallback == null) bridge.setServerAssetPath("public");
        else bridge.setServerBasePath(fallback.getAbsolutePath());
    }

    @Override public void onDestroy() {
        handler.removeCallbacks(startupTimeout);
        if (connectivity != null && networkCallback != null) connectivity.unregisterNetworkCallback(networkCallback);
        if (releases != null) releases.close();
        super.onDestroy();
    }
}
