import { useEffect } from 'react';
import { ShieldCheck, Info, X } from 'lucide-react';

interface NotificationProps {
  message: string | null;
  onClear: () => void;
}

export default function Notification({ message, onClear }: NotificationProps) {
  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => {
        onClear();
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [message, onClear]);

  if (!message) return null;

  return (
    <div 
      className="fixed bottom-6 right-6 z-50 p-4 bg-neutral-900 border border-neutral-800 text-white rounded-2xl shadow-2xl flex items-center justify-between gap-3 animate-in fade-in slide-in-from-bottom-5 duration-250 max-w-sm"
      id="system-toast-alert"
    >
      <div className="flex items-center gap-2.5">
        <div className="p-1.5 bg-emerald-500/20 text-emerald-400 rounded-lg">
          <ShieldCheck className="w-4 h-4" />
        </div>
        <p className="text-xs font-semibold leading-relaxed font-sans pr-2">
          {message}
        </p>
      </div>

      <button 
        onClick={onClear} 
        className="text-neutral-400 hover:text-white transition"
        title="Dismiss toast"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
}
