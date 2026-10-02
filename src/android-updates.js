// Android alone acknowledges a fully rendered release. No user data is written here.
(function () {
  if (!window.Capacitor?.isNativePlatform?.()) return;
  let startupFailed = false;
  window.addEventListener('error', () => { startupFailed = true; });
  // Native calls this after onPageFinished and retirement of the old PWA cache.
  // A load event alone could still belong to a page served by the previous worker.
  window.NaukaZMamaAndroidReady = async () => {
    if (startupFailed || !window.NaukaZMamaSubjects || !document.querySelector('#panel')?.children.length) return;
    try {
      const response = await fetch('./app-version.json', { cache: 'no-store' });
      if (!response.ok) return;
      const release = await response.json();
      const updater = window.Capacitor.Plugins.AndroidUpdates;
      await updater.ready({ version: release.version });
    } catch (error) {
      console.warn('Android release was not acknowledged.', error);
    }
  };
})();
