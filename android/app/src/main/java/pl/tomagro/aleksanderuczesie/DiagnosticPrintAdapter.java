package pl.tomagro.aleksanderuczesie;

import android.content.Context;
import android.graphics.Paint;
import android.graphics.pdf.PdfDocument;
import android.os.Bundle;
import android.os.CancellationSignal;
import android.os.ParcelFileDescriptor;
import android.print.PageRange;
import android.print.PrintAttributes;
import android.print.PrintDocumentAdapter;
import android.print.PrintDocumentInfo;
import android.print.pdf.PrintedPdfDocument;
import java.io.FileOutputStream;
import java.io.IOException;

/** Native, single-page print probe, independent of lesson HTML and window.print(). */
final class DiagnosticPrintAdapter extends PrintDocumentAdapter {
    private final Context context;
    private PrintAttributes attributes;
    DiagnosticPrintAdapter(Context context) { this.context = context; }

    @Override public void onLayout(PrintAttributes oldAttributes, PrintAttributes newAttributes,
        CancellationSignal cancellation, LayoutResultCallback callback, Bundle extras) {
        if (cancellation.isCanceled()) { callback.onLayoutCancelled(); TtsDiagnostics.record("PRINT LAYOUT: CANCELLED"); return; }
        attributes = newAttributes;
        callback.onLayoutFinished(new PrintDocumentInfo.Builder("test-drukowania.pdf")
            .setContentType(PrintDocumentInfo.CONTENT_TYPE_DOCUMENT).setPageCount(1).build(), !newAttributes.equals(oldAttributes));
        TtsDiagnostics.record("PRINT LAYOUT: SUCCESS; 1 page");
    }

    @Override public void onWrite(PageRange[] pages, ParcelFileDescriptor destination,
        CancellationSignal cancellation, WriteResultCallback callback) {
        if (cancellation.isCanceled()) { callback.onWriteCancelled(); TtsDiagnostics.record("PRINT WRITE: CANCELLED"); return; }
        boolean requested = false;
        for (PageRange range : pages) if (range.getStart() <= 0 && range.getEnd() >= 0) requested = true;
        if (!requested) { callback.onWriteFinished(new PageRange[0]); return; }
        PrintedPdfDocument document = null;
        try (FileOutputStream output = new FileOutputStream(destination.getFileDescriptor())) {
            document = new PrintedPdfDocument(context, attributes);
            PdfDocument.Page page = document.startPage(0);
            Paint paint = new Paint(Paint.ANTI_ALIAS_FLAG);
            paint.setTextSize(18);
            page.getCanvas().drawText("DIAGNOSTYKA APLIKACJI", 30, 50, paint);
            paint.setTextSize(12);
            page.getCanvas().drawText("To jest test drukowania aplikacji Nauka z mamą.", 30, 85, paint);
            page.getCanvas().drawText("Dokument testowy — bez materiałów i danych użytkownika.", 30, 110, paint);
            document.finishPage(page);
            if (cancellation.isCanceled()) { callback.onWriteCancelled(); TtsDiagnostics.record("PRINT WRITE: CANCELLED"); return; }
            document.writeTo(output);
            callback.onWriteFinished(new PageRange[]{new PageRange(0, 0)});
            TtsDiagnostics.record("PRINT WRITE: SUCCESS — PDF przekazany do systemu");
        } catch (IOException | RuntimeException error) {
            callback.onWriteFailed(error.getMessage());
            TtsDiagnostics.record("PRINT WRITE: ERROR " + error.getClass().getSimpleName() + ": " + error.getMessage());
        } finally {
            if (document != null) {
                try { document.close(); }
                catch (RuntimeException error) { TtsDiagnostics.record("PRINT CLOSE: ERROR " + error.getMessage()); }
            }
        }
    }
    @Override public void onFinish() { TtsDiagnostics.record("PRINT: zakończono obsługę dokumentu; sprawdź wynik w systemie drukowania"); }
}
