if (!window.Capacitor?.isNativePlatform?.() && 'serviceWorker' in navigator && (location.protocol === 'https:' || location.hostname === 'localhost')) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('./service-worker.js', { updateViaCache: 'none' }).then((registration) => {
      const check = () => registration.update().catch(() => {});
      window.addEventListener('online', check);
      document.addEventListener('visibilitychange', () => { if (!document.hidden) check(); });
    }).catch((error) => {
      console.warn('Offline cache could not be started.', error);
    });
  });
}
