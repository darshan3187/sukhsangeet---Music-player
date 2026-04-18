import { useEffect, useState } from 'react';
import { Download, X } from 'lucide-react';

/**
 * PWA Install Prompt Component
 * Shows when the app is installable
 */
export default function PWAInstallPrompt() {
  const [showPrompt, setShowPrompt] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [isIOS, setIsIOS] = useState(false);

  useEffect(() => {
    // Check if iOS
    const iOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
    setIsIOS(iOS);

    // Listen for beforeinstallprompt event
    const handleBeforeInstallPrompt = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setShowPrompt(true);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    // Listen for app installed event
    const handleAppInstalled = () => {
      console.log('App installed successfully');
      setShowPrompt(false);
      setDeferredPrompt(null);
    };

    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;

    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    console.log(`User response: ${outcome}`);

    setDeferredPrompt(null);
    setShowPrompt(false);
  };

  const handleDismiss = () => {
    setShowPrompt(false);
  };

  // Show iOS instructions
  if (isIOS && showPrompt) {
    return (
      <div className="fixed bottom-0 left-0 right-0 bg-gradient-to-t from-slate-900 to-slate-800 border-t border-slate-700 p-4 shadow-2xl z-50 rounded-t-xl">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <h3 className="font-bold text-white mb-2">Install Sukh Sangeet</h3>
            <p className="text-sm text-slate-300 mb-3">
              Tap the Share button, then "Add to Home Screen" to play offline
            </p>
            <button
              onClick={handleDismiss}
              className="text-xs text-slate-400 hover:text-slate-200 transition-colors"
            >
              Dismiss
            </button>
          </div>
          <button
            onClick={handleDismiss}
            className="p-1 hover:bg-slate-700 rounded-lg transition-colors"
            aria-label="Close"
          >
            <X size={18} className="text-slate-400" />
          </button>
        </div>
      </div>
    );
  }

  // Show install prompt for Android/Desktop
  if (!isIOS && showPrompt && deferredPrompt) {
    return (
      <div className="fixed bottom-0 left-0 right-0 bg-gradient-to-t from-slate-900 to-slate-800 border-t border-slate-700 p-4 shadow-2xl z-50 rounded-t-xl">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 flex-1">
            <Download size={24} className="text-blue-400 flex-shrink-0" />
            <div>
              <h3 className="font-bold text-white">Install Sukh Sangeet</h3>
              <p className="text-sm text-slate-300">
                Play offline and install directly to your device
              </p>
            </div>
          </div>
          <div className="flex gap-2">
            <button
              onClick={handleDismiss}
              className="px-4 py-2 text-sm font-medium text-slate-300 hover:bg-slate-700 rounded-lg transition-colors"
              aria-label="Dismiss"
            >
              Not Now
            </button>
            <button
              onClick={handleInstall}
              className="px-4 py-2 text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
              aria-label="Install app"
            >
              Install
            </button>
          </div>
        </div>
      </div>
    );
  }

  return null;
}
