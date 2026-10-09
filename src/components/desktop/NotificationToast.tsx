import React, { useEffect } from 'react';
import { X, CheckCircle2, AlertTriangle, Info, ShieldCheck } from 'lucide-react';

export interface ToastItem {
  id: string;
  title: string;
  message: string;
  type?: 'info' | 'success' | 'warning' | 'security';
  timestamp?: string;
}

interface NotificationToastProps {
  toasts: ToastItem[];
  onDismiss: (id: string) => void;
}

export default function NotificationToast({ toasts, onDismiss }: NotificationToastProps) {
  useEffect(() => {
    if (toasts.length === 0) return;
    const latest = toasts[toasts.length - 1];
    const timer = setTimeout(() => {
      onDismiss(latest.id);
    }, 6000);
    return () => clearTimeout(timer);
  }, [toasts, onDismiss]);

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-14 right-4 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-auto">
      {toasts.slice(-3).map((toast) => {
        const getIcon = () => {
          switch (toast.type) {
            case 'success':
              return <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />;
            case 'warning':
              return <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />;
            case 'security':
              return <ShieldCheck className="w-4 h-4 text-cyan-400 shrink-0" />;
            default:
              return <Info className="w-4 h-4 text-blue-400 shrink-0" />;
          }
        };

        return (
          <div
            key={toast.id}
            className="flex items-start gap-3 p-3.5 bg-slate-900/95 border border-slate-700/80 rounded-xl shadow-2xl backdrop-blur-2xl text-slate-100 transition-all duration-200 transform translate-y-0"
          >
            <div className="p-1 rounded-lg bg-slate-800/80">
              {getIcon()}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-2">
                <span className="text-xs font-semibold text-slate-100 truncate">
                  {toast.title}
                </span>
                <span className="text-[10px] text-slate-500 font-mono">
                  {toast.timestamp || 'Just now'}
                </span>
              </div>
              <p className="text-[11px] text-slate-300 mt-0.5 leading-snug">
                {toast.message}
              </p>
            </div>
            <button
              onClick={() => onDismiss(toast.id)}
              className="p-1 text-slate-400 hover:text-white rounded-md hover:bg-slate-800 transition-colors"
              title="Dismiss"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        );
      })}
    </div>
  );
}
