import { useEffect, useState } from 'react';
import { Download, X } from 'lucide-react';

/**
 * Minimal PWA Install Prompt Component
 * Compact badge-style install prompt
 */
export default function PWAInstallPrompt() {
  const [showPrompt, setShowPrompt] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState(null);

  useEffect(() => {
    const handleBeforeInstallPrompt = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setShowPrompt(true);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    const handleAppInstalled = () => {
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
    setDeferredPrompt(null);
    setShowPrompt(false);
  };

  if (!showPrompt || !deferredPrompt) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50 flex items-center gap-2 bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 shadow-lg">
      <button
        onClick={handleInstall}
        className="text-xs font-semibold text-blue-400 hover:text-blue-300 transition-colors"
      >
        <Download size={16} className="text-blue-400 flex-shrink-0" />
        Install
      </button>
      <button
        onClick={() => setShowPrompt(false)}
        className="p-0.5 hover:bg-slate-700 rounded transition-colors ml-1"
      >
        <X size={14} className="text-slate-400" />
      </button>
    </div>
  );
}
