package pl.tomagro.aleksanderuczesie;

/** Preserve raw platform codes: language success can be 0, 1 or 2. */
final class TtsDiagnosticStatus {
    static String init(int code) { return (code == 0 ? "SUCCESS" : "ERROR") + " (code=" + code + ")"; }
    static String language(int code) { return (code >= 0 ? "SUCCESS" : "ERROR") + " (code=" + code + ")"; }
}
