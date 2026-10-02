package pl.tomagro.aleksanderuczesie;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;
import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

final class WebRelease {
    static final class Asset {
        final String path, sha256;
        final int size;
        Asset(String path, String sha256, int size) { this.path = path; this.sha256 = sha256; this.size = size; }
    }
    final String version, basePath;
    final byte[] manifest;
    final List<Asset> files = new ArrayList<>();

    WebRelease(byte[] bytes) throws IOException {
        UpdatePolicy.require(bytes.length <= UpdatePolicy.MAX_MANIFEST, "Manifest too large");
        manifest = bytes;
        try {
            JSONObject data = new JSONObject(new String(bytes, StandardCharsets.UTF_8));
            UpdatePolicy.require(data.getInt("schemaVersion") == 1
                && data.getString("transport").equals("raw-files-v1")
                && data.getString("appId").equals(UpdatePolicy.APP_ID)
                && data.getInt("nativeApi") == UpdatePolicy.NATIVE_API
                && data.getInt("dataSchema") == UpdatePolicy.DATA_SCHEMA, "Incompatible release");
            version = data.getString("version");
            basePath = data.getString("basePath");
            UpdatePolicy.require(UpdatePolicy.hash(version), "Invalid version");
            UpdatePolicy.require(basePath.equals("/updates/releases/" + version + "/"), "Invalid release path");
            JSONArray entries = data.getJSONArray("files");
            UpdatePolicy.require(entries.length() > 0 && entries.length() <= UpdatePolicy.MAX_FILES, "Invalid file count");
            Set<String> paths = new HashSet<>();
            long total = 0;
            for (int i = 0; i < entries.length(); i++) {
                JSONObject entry = entries.getJSONObject(i);
                String path = entry.getString("path"), hash = entry.getString("sha256");
                long size = entry.getLong("size");
                UpdatePolicy.require(UpdatePolicy.allowedPath(path) && paths.add(path), "Invalid or duplicate asset path");
                UpdatePolicy.require(UpdatePolicy.hash(hash) && size > 0 && size <= UpdatePolicy.MAX_FILE, "Invalid asset metadata");
                total += size;
                UpdatePolicy.require(total <= UpdatePolicy.MAX_TOTAL, "Release too large");
                files.add(new Asset(path, hash, (int) size));
            }
            UpdatePolicy.require(paths.containsAll(Arrays.asList("index.html", "styles.css", "manifest.webmanifest",
                "app-version.json", "src/app.js", "src/subjects.js", "src/expanded-content.js",
                "src/android-updates.js", "src/register-service-worker.js")), "Missing required assets");
        } catch (JSONException error) { throw new IOException("Malformed manifest", error); }
    }

    void verifyRuntimeVersion(byte[] bytes) throws IOException {
        try {
            JSONObject runtime = new JSONObject(new String(bytes, StandardCharsets.UTF_8));
            UpdatePolicy.require(version.equals(runtime.getString("version"))
                && UpdatePolicy.APP_ID.equals(runtime.getString("appId"))
                && runtime.getInt("schemaVersion") == 1
                && runtime.getString("transport").equals("raw-files-v1")
                && runtime.getInt("nativeApi") == UpdatePolicy.NATIVE_API
                && runtime.getInt("dataSchema") == UpdatePolicy.DATA_SCHEMA, "Runtime version mismatch");
        } catch (JSONException error) { throw new IOException("Invalid runtime version", error); }
    }
}
