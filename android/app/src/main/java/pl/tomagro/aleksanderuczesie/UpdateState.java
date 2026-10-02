package pl.tomagro.aleksanderuczesie;

/** Only release pointers are persisted here. User data belongs to WebView and is never touched. */
final class UpdateState {
    interface Store { void save(String active, String pending, String trial, String previous, String rejected); }
    private final Store store;
    private String active, pending, trial, previous, rejected;

    UpdateState(Store store, String active, String pending, String trial, String previous, String rejected) {
        this.store = store;
        this.active = active; this.pending = pending; this.trial = trial;
        this.previous = previous; this.rejected = rejected;
    }

    private void save(String nextActive, String nextPending, String nextTrial, String nextPrevious, String nextRejected) {
        store.save(nextActive, nextPending, nextTrial, nextPrevious, nextRejected);
        active = nextActive; pending = nextPending; trial = nextTrial;
        previous = nextPrevious; rejected = nextRejected;
    }
    synchronized String active() { return active; }
    synchronized String pending() { return pending; }
    synchronized String trial() { return trial; }
    synchronized void resetForNewApk() {
        // Release metadata only: preserve downloaded files and all WebView/user data.
        save("", "", "", "", "");
    }
    synchronized boolean shouldDownload(String version, String bundled) {
        return !version.equals(active) && !version.equals(pending) && !version.equals(rejected)
            && !(active.isEmpty() && version.equals(bundled));
    }
    synchronized void stage(String version) {
        if (version.equals(rejected) || version.equals(active)) return;
        save(active, version, trial, previous, rejected);
    }
    // An interrupted/unacknowledged previous startup is rolled back before trying another release.
    synchronized void recover() {
        if (!trial.isEmpty()) fail();
    }
    synchronized void beginTrial() {
        if (pending.isEmpty()) return;
        save(pending, "", pending, active, rejected);
    }
    synchronized boolean acknowledge(String version) {
        if (trial.isEmpty() || !trial.equals(version)) return false;
        // Keep previous release files available; only the active pointer changes.
        save(active, pending, "", previous, rejected);
        return true;
    }
    synchronized void fail() {
        if (trial.isEmpty()) return;
        save(previous, pending, "", "", trial);
    }
    synchronized void rejectPending() {
        save(active, "", trial, previous, pending);
    }
    synchronized void useBundled() {
        save("", pending, "", previous, active);
    }
}
