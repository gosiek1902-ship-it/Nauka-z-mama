package pl.tomagro.aleksanderuczesie;

import org.junit.Test;
import static org.junit.Assert.*;

public class ReleaseStartupPolicyTest {
    @Test public void newApkStartsBundledDespiteOldActivePendingAndTrial() {
        String[] saved = new String[5];
        UpdateState state = new UpdateState((a,p,t,previous,r) -> {
            saved[0]=a; saved[1]=p; saved[2]=t; saved[3]=previous; saved[4]=r;
        }, "old-local-app-js", "old-pending", "old-trial", "old-previous", "old-rejected");
        boolean changed = ReleaseStartupPolicy.newApk("old-install:old-bundle", "new-install:new-app-js");
        assertTrue(ReleaseStartupPolicy.startBundled(changed, state));
        assertEquals("", state.active());
        assertEquals("", state.pending());
        assertEquals("", state.trial());
        assertArrayEquals(new String[]{"","","","",""}, saved);
        assertFalse(ReleaseStartupPolicy.mayRun(100, 200));
    }
    @Test public void subsequentLaunchKeepsValidatedNewerLocalRelease() {
        UpdateState state = new UpdateState((a,p,t,previous,r)->{}, "newer-local", "", "", "", "");
        assertFalse(ReleaseStartupPolicy.startBundled(false, state));
        assertEquals("newer-local", state.active());
        assertTrue(ReleaseStartupPolicy.mayRun(201, 200));
    }
    @Test public void legacySameRevisionAndOlderRemoteCannotOverrideApk() {
        for (long revision : new long[]{0, 100, 200}) assertFalse(ReleaseStartupPolicy.newer(revision, 200, 200));
        assertTrue(ReleaseStartupPolicy.newer(201, 200, 200));
        assertFalse(ReleaseStartupPolicy.newer(201, 200, 202));
        assertFalse(ReleaseStartupPolicy.mayRun(201, 0));
    }
    @Test public void nativeOnlyApkUpdateAlsoStartsBundled() {
        assertTrue(ReleaseStartupPolicy.newApk("100:same-web-hash", "200:same-web-hash"));
        assertFalse(ReleaseStartupPolicy.newApk("200:same-web-hash", "200:same-web-hash"));
        assertTrue(ReleaseStartupPolicy.newApk("", "200:same-web-hash"));
    }
}
