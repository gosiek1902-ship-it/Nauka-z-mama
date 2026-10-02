package pl.tomagro.aleksanderuczesie;

import com.getcapacitor.Plugin;
import com.getcapacitor.PluginCall;
import com.getcapacitor.PluginMethod;
import com.getcapacitor.annotation.CapacitorPlugin;

@CapacitorPlugin(name = "AndroidUpdates")
public class AndroidUpdatesPlugin extends Plugin {
    @PluginMethod
    public void ready(PluginCall call) {
        String version = call.getString("version", "");
        if (!(getActivity() instanceof MainActivity) || !UpdatePolicy.hash(version)) {
            call.reject("Invalid release acknowledgement");
            return;
        }
        getActivity().runOnUiThread(() -> {
            ((MainActivity) getActivity()).releaseReady(version);
            call.resolve();
        });
    }
}
