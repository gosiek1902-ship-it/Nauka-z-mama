package pl.tomagro.aleksanderuczesie;

final class ReleaseStartupPolicy {
    static boolean startBundled(boolean newApk, UpdateState state) {
        if (!newApk) return false;
        state.resetForNewApk();
        return true;
    }
    static boolean newApk(String storedInstallation, String installation) {
        return !installation.equals(storedInstallation);
    }
    static boolean newer(long candidate, long bundled, long active) {
        return bundled > 0 && candidate > bundled && candidate > active;
    }
    static boolean mayRun(long local, long bundled) { return bundled > 0 && local > bundled; }
}
