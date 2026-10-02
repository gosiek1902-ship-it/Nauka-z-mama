package pl.tomagro.aleksanderuczesie;

import android.content.Context;
import android.content.SharedPreferences;
import android.util.Log;
import org.json.JSONObject;
import java.io.ByteArrayOutputStream;
import java.io.File;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.net.HttpURLConnection;
import java.nio.charset.StandardCharsets;
import java.util.UUID;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import java.util.concurrent.atomic.AtomicBoolean;

/** Downloads are isolated from WebView storage and never change a running page. */
final class AndroidReleaseManager {
    private final File root;
    private final String bundledVersion;
    private final long bundledRevision;
    private final boolean newApk;
    final UpdateState state;
    private final ExecutorService worker = Executors.newSingleThreadExecutor();
    private final AtomicBoolean checking = new AtomicBoolean();
    private volatile long lastCheck;
    private volatile boolean closed;
    private boolean retryAfterReconnect;

    AndroidReleaseManager(Context context) {
        root = new File(context.getFilesDir(), "web-releases");
        SharedPreferences prefs = context.getSharedPreferences("android-web-releases-v1", Context.MODE_PRIVATE);
        String version = "";
        long revision = 0;
        try (InputStream stream = context.getAssets().open("public/app-version.json")) {
            JSONObject metadata = new JSONObject(new String(readBounded(stream, UpdatePolicy.MAX_MANIFEST), StandardCharsets.UTF_8));
            version = metadata.getString("version");
            revision = metadata.optLong("releaseRevision", 0);
        } catch (Exception error) { Log.w("AndroidUpdates", "Bundled version metadata unavailable", error); }
        bundledVersion = version;
        bundledRevision = revision;
        long installationTime;
        try { installationTime = context.getPackageManager().getPackageInfo(context.getPackageName(), 0).lastUpdateTime; }
        catch (Exception error) { installationTime = -1; }
        final String installation = installationTime + ":" + bundledVersion;
        newApk = ReleaseStartupPolicy.newApk(prefs.getString("apk-installation", ""), installation);
        state = new UpdateState((active, pending, trial, previous, rejected) -> {
            // One synchronous atomic preferences commit, before exposing new release files.
            boolean saved = prefs.edit().putString("active", active).putString("pending", pending)
                .putString("trial", trial).putString("previous", previous).putString("rejected", rejected)
                .putString("apk-installation", installation).commit();
            if (!saved) throw new IllegalStateException("Release pointers could not be persisted");
        }, prefs.getString("active", ""), prefs.getString("pending", ""), prefs.getString("trial", ""),
            prefs.getString("previous", ""), prefs.getString("rejected", ""));
    }

    File prepareStartup() {
        if (newApk) {
            try { ReleaseStartupPolicy.startBundled(true, state); }
            catch (IllegalStateException error) {
                // A failed metadata write must still never expose an old release on this launch.
                Log.w("AndroidUpdates", "Cannot persist APK baseline; using bundled assets", error);
            }
            Log.i("AndroidUpdates", "New APK installation: starting bundled assets " + bundledVersion);
            return null;
        }
        state.recover();
        String pending = state.pending();
        if (!pending.isEmpty()) {
            try {
                WebRelease candidate = verify(directory(pending), pending);
                UpdatePolicy.require(ReleaseStartupPolicy.newer(candidate.revision, bundledRevision, activeRevision()), "Pending release is not newer");
                state.beginTrial();
            }
            catch (IOException error) { state.rejectPending(); Log.w("AndroidUpdates", "Pending release rejected", error); }
            catch (IllegalStateException error) { Log.w("AndroidUpdates", "Cannot persist trial; retaining active release", error); }
        }
        return activeDirectory();
    }

    File activeDirectory() {
        String active = state.active();
        if (active.isEmpty()) return null;
        try {
            File directory = directory(active);
            WebRelease release = verify(directory, active);
            UpdatePolicy.require(ReleaseStartupPolicy.mayRun(release.revision, bundledRevision), "Local release is older than APK");
            return directory;
        } catch (IOException error) {
            // A damaged installed web release must not strand the application offline.
            if (!state.trial().isEmpty()) { state.fail(); return activeDirectory(); }
            state.useBundled();
            Log.w("AndroidUpdates", "Local release invalid; using bundled application", error);
            return null;
        }
    }

    synchronized void check() {
        if (closed || !checking.compareAndSet(false, true)) return;
        long now = android.os.SystemClock.elapsedRealtime();
        if (lastCheck != 0 && now - lastCheck < 60_000) { checking.set(false); return; }
        lastCheck = now;
        worker.execute(() -> {
            File temporary = null;
            try {
                WebRelease release = new WebRelease(download("/updates/latest.json", UpdatePolicy.MAX_MANIFEST));
                if (!ReleaseStartupPolicy.newer(release.revision, bundledRevision, activeRevision())) return;
                if (!state.shouldDownload(release.version, bundledVersion)) return;
                UpdatePolicy.require(root.isDirectory() || root.mkdirs(), "Cannot create release storage");
                File destination = directory(release.version);
                if (destination.exists()) {
                    verify(destination, release.version);
                } else {
                    temporary = new File(root, ".download-" + UUID.randomUUID());
                    UpdatePolicy.require(temporary.mkdir(), "Cannot create download directory");
                    for (WebRelease.Asset asset : release.files) {
                        if (closed || Thread.currentThread().isInterrupted()) throw new IOException("Download interrupted");
                        byte[] bytes = download(release.basePath + asset.path + ".bin", asset.size);
                        UpdatePolicy.require(bytes.length == asset.size && UpdatePolicy.digest(bytes).equals(asset.sha256), "Asset checksum mismatch");
                        write(new File(temporary, asset.path), bytes);
                    }
                    write(new File(temporary, "release.json"), release.manifest);
                    verify(temporary, release.version);
                    UpdatePolicy.require(temporary.renameTo(destination), "Cannot commit complete release");
                    temporary = null;
                }
                stageIfOpen(release.version);
                Log.i("AndroidUpdates", "Complete web release prepared for next startup: " + release.version);
            } catch (Exception error) {
                Log.w("AndroidUpdates", "Update unavailable; retaining current release", error);
            } finally {
                if (temporary != null) removeTemporary(temporary);
                finishCheck();
            }
        });
    }

    synchronized void checkAfterReconnect() {
        // A reconnect must not be lost to the ordinary one-minute throttle or an old failed transfer.
        if (closed) return;
        if (checking.get()) { retryAfterReconnect = true; return; }
        lastCheck = 0;
        check();
    }

    private synchronized void finishCheck() {
        checking.set(false);
        if (retryAfterReconnect && !closed) {
            retryAfterReconnect = false;
            lastCheck = 0;
            check();
        }
    }

    private File directory(String version) throws IOException {
        UpdatePolicy.require(UpdatePolicy.hash(version), "Invalid stored release version");
        return new File(root, version);
    }

    private long activeRevision() {
        if (state.active().isEmpty()) return bundledRevision;
        try { return verify(directory(state.active()), state.active()).revision; }
        catch (IOException error) { return bundledRevision; }
    }

    private static WebRelease verify(File directory, String version) throws IOException {
        WebRelease release;
        try (InputStream stream = new FileInputStream(new File(directory, "release.json"))) {
            release = new WebRelease(readBounded(stream, UpdatePolicy.MAX_MANIFEST));
        }
        UpdatePolicy.require(release.version.equals(version), "Wrong release directory");
        for (WebRelease.Asset asset : release.files) {
            File file = new File(directory, asset.path);
            UpdatePolicy.require(file.isFile() && file.length() == asset.size, "Missing or truncated asset");
            byte[] bytes;
            try (InputStream stream = new FileInputStream(file)) { bytes = readBounded(stream, asset.size); }
            UpdatePolicy.require(UpdatePolicy.digest(bytes).equals(asset.sha256), "Corrupt local asset");
            if (asset.path.equals("app-version.json")) release.verifyRuntimeVersion(bytes);
        }
        return release;
    }

    private static byte[] download(String path, int limit) throws IOException {
        HttpURLConnection connection = (HttpURLConnection) UpdatePolicy.trustedUrl(path).toURL().openConnection();
        try {
            // TLS certificate validation remains enabled. No redirects to another origin are accepted.
            connection.setInstanceFollowRedirects(false);
            connection.setConnectTimeout(10_000);
            connection.setReadTimeout(15_000);
            connection.setUseCaches(false);
            connection.setRequestProperty("Cache-Control", "no-cache");
            connection.setRequestProperty("Accept-Encoding", "identity");
            UpdatePolicy.require(connection.getResponseCode() == 200, "Update HTTP error");
            long length = connection.getContentLengthLong();
            UpdatePolicy.require(length < 0 || length <= limit, "Response too large");
            try (InputStream stream = connection.getInputStream()) { return readBounded(stream, limit); }
        } finally { connection.disconnect(); }
    }

    private static byte[] readBounded(InputStream stream, int limit) throws IOException {
        ByteArrayOutputStream result = new ByteArrayOutputStream();
        byte[] buffer = new byte[8192];
        int count;
        while ((count = stream.read(buffer)) != -1) {
            UpdatePolicy.require(result.size() + count <= limit, "Response exceeds limit");
            result.write(buffer, 0, count);
        }
        return result.toByteArray();
    }

    private static void write(File file, byte[] bytes) throws IOException {
        File parent = file.getParentFile();
        UpdatePolicy.require(parent != null && (parent.isDirectory() || parent.mkdirs()), "Cannot create asset directory");
        try (FileOutputStream stream = new FileOutputStream(file)) {
            stream.write(bytes);
            stream.getFD().sync();
        }
    }

    private void removeTemporary(File directory) {
        // Only this manager's private, incomplete download directory can be removed.
        if (!directory.getParentFile().equals(root) || !directory.getName().startsWith(".download-")) return;
        removeTree(directory);
    }
    private static void removeTree(File file) {
        File[] children = file.listFiles();
        if (children != null) for (File child : children) removeTree(child);
        if (!file.delete()) Log.w("AndroidUpdates", "Could not remove incomplete download: " + file.getName());
    }

    private synchronized void stageIfOpen(String version) { if (!closed) state.stage(version); }
    synchronized void close() { closed = true; worker.shutdownNow(); }
}
