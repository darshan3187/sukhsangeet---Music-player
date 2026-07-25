import { useEffect, useState } from 'react';
import { Download, X } from 'lucide-react';

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
    <div className="fixed bottom-4 right-4 z-50 flex items-center gap-2 bg-[#171717] border border-[#ebebeb]/20 rounded-md px-3 py-2 shadow-level-4 text-white">
      <button
        onClick={handleInstall}
        className="inline-flex items-center gap-1.5 font-mono text-xs font-medium uppercase tracking-wider text-white hover:text-[#0070f3] transition-colors cursor-pointer"
      >
        <Download size={14} className="flex-shrink-0" />
        <span>Install App</span>
      </button>
      <button
        onClick={() => setShowPrompt(false)}
        className="inline-flex h-6 w-6 items-center justify-center rounded text-[#888888] hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
        aria-label="Dismiss install prompt"
      >
        <X size={14} />
      </button>
    </div>
  );
}
