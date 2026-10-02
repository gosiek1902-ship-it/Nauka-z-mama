package pl.tomagro.aleksanderuczesie;

import org.json.JSONArray;
import org.json.JSONObject;
import org.junit.Test;
import java.io.IOException;
import java.io.InputStream;
import java.io.ByteArrayInputStream;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Path;
import java.lang.reflect.InvocationTargetException;
import java.lang.reflect.Method;
import static org.junit.Assert.*;

public class WebReleaseTest {
    private static final String VERSION = "a".repeat(64);
    private JSONObject manifest() throws Exception {
        JSONArray files = new JSONArray();
        for (String path : new String[]{"index.html", "styles.css", "manifest.webmanifest", "app-version.json",
            "src/app.js", "src/subjects.js", "src/expanded-content.js", "src/android-updates.js", "src/register-service-worker.js"}) {
            files.put(new JSONObject().put("path", path).put("size", 1).put("sha256", VERSION));
        }
        return new JSONObject().put("schemaVersion", 1).put("transport", "raw-files-v1").put("appId", UpdatePolicy.APP_ID)
            .put("nativeApi", 1).put("dataSchema", 2).put("version", VERSION)
            .put("basePath", "/updates/releases/" + VERSION + "/").put("files", files);
    }
    private WebRelease parse(JSONObject data) throws IOException {
        return new WebRelease(data.toString().getBytes(StandardCharsets.UTF_8));
    }
    private void rejected(JSONObject data) throws Exception {
        try { parse(data); fail("Invalid manifest accepted"); } catch (IOException expected) { }
    }
    @Test public void acceptsCompleteCompatibleManifest() throws Exception {
        WebRelease release = parse(manifest());
        assertEquals(VERSION, release.version);
        assertEquals(9, release.files.size());
    }
    @Test public void refusesWrongPackageProtocolNativeApiAndDataSchema() throws Exception {
        rejected(manifest().put("appId", "another.application"));
        rejected(manifest().put("schemaVersion", 2));
        rejected(manifest().put("transport", "unknown-transport"));
        rejected(manifest().put("nativeApi", 2));
        rejected(manifest().put("dataSchema", 3));
    }
    @Test public void refusesTraversalDuplicateMissingAndOversizedFiles() throws Exception {
        JSONObject traversal = manifest();
        traversal.getJSONArray("files").getJSONObject(0).put("path", "../index.html");
        rejected(traversal);
        JSONObject duplicate = manifest();
        duplicate.getJSONArray("files").put(duplicate.getJSONArray("files").getJSONObject(0));
        rejected(duplicate);
        JSONObject missing = manifest();
        missing.getJSONArray("files").remove(0);
        rejected(missing);
        JSONObject huge = manifest();
        huge.getJSONArray("files").getJSONObject(0).put("size", UpdatePolicy.MAX_FILE + 1L);
        rejected(huge);
        JSONObject invalidHash = manifest();
        invalidHash.getJSONArray("files").getJSONObject(0).put("sha256", "broken");
        rejected(invalidHash);
    }
    @Test public void refusesRemoteBaseAndWrongRuntimeVersion() throws Exception {
        rejected(manifest().put("basePath", "https://evil.example/"));
        WebRelease release = parse(manifest());
        JSONObject runtime = manifest();
        release.verifyRuntimeVersion(runtime.toString().getBytes(StandardCharsets.UTF_8));
        runtime.put("version", "b".repeat(64));
        try { release.verifyRuntimeVersion(runtime.toString().getBytes(StandardCharsets.UTF_8)); fail(); }
        catch (IOException expected) { }
    }
    @Test public void downloadedFilesAreRecheckedBeforeActivation() throws Exception {
        Path directory = Files.createTempDirectory("android-release-test-");
        JSONObject data = manifest();
        JSONObject runtime = manifest();
        for (int i = 0; i < data.getJSONArray("files").length(); i++) {
            JSONObject entry = data.getJSONArray("files").getJSONObject(i);
            String path = entry.getString("path");
            byte[] content = path.equals("app-version.json") ? runtime.toString().getBytes(StandardCharsets.UTF_8) : new byte[]{42};
            entry.put("size", content.length).put("sha256", UpdatePolicy.digest(content));
            Path file = directory.resolve(path);
            Files.createDirectories(file.getParent());
            Files.write(file, content);
        }
        Files.write(directory.resolve("release.json"), data.toString().getBytes(StandardCharsets.UTF_8));
        Method verify = AndroidReleaseManager.class.getDeclaredMethod("verify", java.io.File.class, String.class);
        verify.setAccessible(true);
        verify.invoke(null, directory.toFile(), VERSION);
        Files.write(directory.resolve("src/app.js"), new byte[]{43});
        try { verify.invoke(null, directory.toFile(), VERSION); fail("Corrupted asset accepted"); }
        catch (InvocationTargetException expected) { assertTrue(expected.getCause() instanceof IOException); }
        Files.delete(directory.resolve("src/app.js"));
        try { verify.invoke(null, directory.toFile(), VERSION); fail("Missing asset accepted"); }
        catch (InvocationTargetException expected) { assertTrue(expected.getCause() instanceof IOException); }
        // Temporary fixture contains no application/user data.
        try (var paths = Files.walk(directory)) {
            for (Path path : paths.sorted(java.util.Comparator.reverseOrder()).toList()) Files.delete(path);
        }
    }
    @Test public void brokenOrOversizedTransferCannotBeReadAsACompleteFile() throws Exception {
        Method read = AndroidReleaseManager.class.getDeclaredMethod("readBounded", InputStream.class, int.class);
        read.setAccessible(true);
        assertArrayEquals(new byte[]{1,2}, (byte[]) read.invoke(null, new ByteArrayInputStream(new byte[]{1,2}), 2));
        try { read.invoke(null, new ByteArrayInputStream(new byte[]{1,2,3}), 2); fail("Oversized transfer accepted"); }
        catch (InvocationTargetException expected) { assertTrue(expected.getCause() instanceof IOException); }
        InputStream interrupted = new InputStream() {
            private boolean first = true;
            @Override public int read() throws IOException {
                if (first) { first = false; return 42; }
                throw new IOException("Connection interrupted");
            }
        };
        try { read.invoke(null, interrupted, 1024); fail("Interrupted transfer accepted"); }
        catch (InvocationTargetException expected) { assertTrue(expected.getCause() instanceof IOException); }
    }
}
