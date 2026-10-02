package pl.tomagro.aleksanderuczesie;

import java.io.IOException;
import java.net.URI;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.util.Locale;

/** Limits and trust boundary for web releases; independent of Android for JVM tests. */
final class UpdatePolicy {
    static final String ORIGIN = "https://deluxe-longma-6bc34d.netlify.app";
    static final String APP_ID = "pl.tomagro.aleksanderuczesie";
    static final int NATIVE_API = 1;
    static final int DATA_SCHEMA = 2;
    static final int MAX_MANIFEST = 128 * 1024;
    static final int MAX_FILE = 4 * 1024 * 1024;
    static final int MAX_TOTAL = 16 * 1024 * 1024;
    static final int MAX_FILES = 128;

    static void require(boolean condition, String message) throws IOException {
        if (!condition) throw new IOException(message);
    }

    static boolean hash(String value) {
        return value != null && value.matches("[a-f0-9]{64}");
    }

    static boolean allowedPath(String value) {
        if (value == null || value.length() > 160) return false;
        return value.matches("src/[a-zA-Z0-9_-]+\\.js")
            || value.matches("assets/icons/[a-zA-Z0-9_-]+\\.png")
            || value.equals("index.html") || value.equals("styles.css")
            || value.equals("manifest.webmanifest") || value.equals("service-worker.js")
            || value.equals("app-version.json");
    }

    static URI trustedUrl(String path) throws IOException {
        URI uri;
        try { uri = URI.create(ORIGIN + path); }
        catch (IllegalArgumentException error) { throw new IOException("Invalid update URL", error); }
        require(path.startsWith("/updates/") && !path.contains("..") && !path.contains("\\")
            && "https".equals(uri.getScheme()) && "deluxe-longma-6bc34d.netlify.app".equals(uri.getHost())
            && uri.getPort() == -1 && uri.getUserInfo() == null && uri.getQuery() == null && uri.getFragment() == null,
            "Untrusted update URL");
        return uri;
    }

    static String digest(byte[] bytes) {
        try {
            byte[] hash = MessageDigest.getInstance("SHA-256").digest(bytes);
            StringBuilder result = new StringBuilder(64);
            for (byte value : hash) result.append(String.format(Locale.ROOT, "%02x", value & 255));
            return result.toString();
        } catch (NoSuchAlgorithmException impossible) { throw new IllegalStateException(impossible); }
    }
}
