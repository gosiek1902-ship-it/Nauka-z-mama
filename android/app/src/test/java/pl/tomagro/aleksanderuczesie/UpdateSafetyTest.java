package pl.tomagro.aleksanderuczesie;

import org.junit.Test;
import static org.junit.Assert.*;
import java.io.IOException;

public class UpdateSafetyTest {
    private static final String A = "a".repeat(64), B = "b".repeat(64), C = "c".repeat(64);
    private UpdateState state(String active, String pending, String trial, String previous) {
        return new UpdateState((a, p, t, old, rejected) -> {}, active, pending, trial, previous, "");
    }
    @Test public void downloadDoesNotReplaceRunningRelease() {
        UpdateState state = state(A, "", "", "");
        state.stage(B);
        assertEquals(A, state.active());
        assertEquals(B, state.pending());
    }
    @Test public void successfulStartupCommitsOnlyMatchingVersion() {
        UpdateState state = state(A, B, "", "");
        state.beginTrial();
        assertFalse(state.acknowledge(A));
        assertEquals(B, state.trial());
        assertTrue(state.acknowledge(B));
        state.recover();
        assertEquals(B, state.active());
        assertEquals("", state.trial());
    }
    @Test public void killedOrBrokenStartupFallsBackAndDoesNotRetryBadRelease() {
        UpdateState state = state(A, B, "", "");
        state.beginTrial();
        state.recover();
        assertEquals(A, state.active());
        assertFalse(state.shouldDownload(B, ""));
        assertTrue(state.shouldDownload(C, ""));
    }
    @Test public void firstUpdateCanFallBackToBundledFiles() {
        UpdateState state = state("", B, "", "");
        state.beginTrial();
        state.fail();
        assertEquals("", state.active());
        assertFalse(state.shouldDownload(B, A));
        assertFalse(state.shouldDownload(A, A));
    }
    @Test public void rejectedIncompletePendingReleaseKeepsActiveVersion() {
        UpdateState state = state(A, B, "", "");
        state.rejectPending();
        assertEquals(A, state.active());
        assertEquals("", state.pending());
        assertFalse(state.shouldDownload(B, ""));
    }
    @Test public void interruptedTrialIsRecoveredFromPersistedPointers() {
        String[] saved = new String[5];
        UpdateState original = new UpdateState((a,p,t,old,r) -> {
            saved[0]=a; saved[1]=p; saved[2]=t; saved[3]=old; saved[4]=r;
        }, A, B, "", "", "");
        original.beginTrial();
        UpdateState restored = new UpdateState((a,p,t,old,r) -> {}, saved[0],saved[1],saved[2],saved[3],saved[4]);
        restored.recover();
        assertEquals(A, restored.active());
        assertFalse(restored.shouldDownload(B, ""));
    }
    @Test public void failedPointerWriteCannotActivateDownloadedRelease() {
        UpdateState state = new UpdateState((a,p,t,old,r) -> { throw new IllegalStateException("disk full"); }, A, B, "", "", "");
        try { state.beginTrial(); fail(); } catch (IllegalStateException expected) { }
        assertEquals(A, state.active());
        assertEquals(B, state.pending());
        assertEquals("", state.trial());
    }
    @Test public void pathsCannotEscapePrivateReleaseDirectory() {
        for (String path : new String[]{"../index.html", "/index.html", "src/../../x.js", "src\\app.js", "src/app.js?x", "https://evil/x", "app-release.json"}) {
            assertFalse(path, UpdatePolicy.allowedPath(path));
        }
        assertTrue(UpdatePolicy.allowedPath("src/app.js"));
        assertTrue(UpdatePolicy.allowedPath("assets/icons/icon-192.png"));
    }
    @Test public void onlyPinnedHttpsOriginCanBeUsed() throws IOException {
        assertEquals("deluxe-longma-6bc34d.netlify.app", UpdatePolicy.trustedUrl("/updates/latest.json").getHost());
        for (String path : new String[]{"//evil.org/x", "/updates/../x", "/updates/x?redirect=evil", "/updates/x#fragment"}) {
            try { UpdatePolicy.trustedUrl(path); fail(path); } catch (IOException expected) { }
        }
    }
    @Test public void contentCorruptionChangesSha256() {
        assertEquals("ba7816bf8f01cfea414140de5dae2223b00361a396177a9cb410ff61f20015ad", UpdatePolicy.digest(new byte[]{97,98,99}));
        assertNotEquals(UpdatePolicy.digest(new byte[]{1,2}), UpdatePolicy.digest(new byte[]{1,3}));
    }
}
