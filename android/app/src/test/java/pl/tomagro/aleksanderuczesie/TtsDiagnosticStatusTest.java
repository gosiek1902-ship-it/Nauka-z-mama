package pl.tomagro.aleksanderuczesie;

import org.junit.Test;
import static org.junit.Assert.*;

public class TtsDiagnosticStatusTest {
    @Test public void initializationAndSpeakPreserveErrorCode() {
        assertEquals("SUCCESS (code=0)", TtsDiagnosticStatus.init(0));
        assertEquals("ERROR (code=-1)", TtsDiagnosticStatus.init(-1));
        assertEquals("ERROR (code=-5)", TtsDiagnosticStatus.init(-5));
    }
    @Test public void languageAcceptsAllThreeAndroidSuccessCodes() {
        for (int code = 0; code <= 2; code++) assertEquals("SUCCESS (code=" + code + ")", TtsDiagnosticStatus.language(code));
    }
    @Test public void missingAndUnsupportedLanguageRemainDistinct() {
        assertEquals("ERROR (code=-1)", TtsDiagnosticStatus.language(-1));
        assertEquals("ERROR (code=-2)", TtsDiagnosticStatus.language(-2));
    }
}
