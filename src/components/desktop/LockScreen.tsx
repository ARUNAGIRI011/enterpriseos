import React, { useState, useEffect } from 'react';
import { ArrowRight, Wifi, Battery, Power, KeyRound, User } from 'lucide-react';
import WindowsWallpaper from './WindowsWallpaper';

interface LockScreenProps {
  isLocked: boolean;
  onUnlock: () => void;
  wallpaperTheme?: string;
}

export default function LockScreen({ isLocked, onUnlock, wallpaperTheme }: LockScreenProps) {
  const [showPrompt, setShowPrompt] = useState(false);
  const [pin, setPin] = useState('');
  const [time, setTime] = useState(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
  const [date, setDate] = useState(new Date().toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric' }));

  useEffect(() => {
    const t = setInterval(() => {
      const now = new Date();
      setTime(now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
      setDate(now.toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric' }));
    }, 1000);
    return () => clearInterval(t);
  }, []);

  if (!isLocked) return null;

  const handleUnlock = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    onUnlock();
    setShowPrompt(false);
    setPin('');
  };

  return (
    <div
      onClick={() => {
        if (!showPrompt) setShowPrompt(true);
      }}
      className="fixed inset-0 z-[100] flex flex-col justify-between p-8 text-white select-none cursor-default font-sans overflow-hidden backdrop-blur-3xl"
    >
      <WindowsWallpaper theme={wallpaperTheme || 'bloom-dark'} />

      {/* Dim Overlay when prompted */}
      {showPrompt && (
        <div className="absolute inset-0 bg-black/40 backdrop-blur-md transition-all duration-300" />
      )}

      {/* Top Header / Status */}
      <div className="relative z-10 flex justify-end items-center gap-3 text-slate-300">
        <Wifi className="w-4 h-4" />
        <Battery className="w-4 h-4 text-emerald-400" />
      </div>

      {/* Center Display: Clock & Date or Password Input */}
      <div className="relative z-10 flex flex-col items-center justify-center my-auto">
        {!showPrompt ? (
          <div className="text-center space-y-2 cursor-pointer animate-in fade-in zoom-in-95 duration-200">
            <h1 className="text-7xl md:text-8xl font-light tracking-tight text-white drop-shadow-xl font-sans">
              {time}
            </h1>
            <p className="text-lg md:text-xl font-medium text-slate-200 drop-shadow-md">
              {date}
            </p>
            <p className="text-xs text-blue-300/80 pt-8 animate-pulse">
              Click anywhere or press Enter to unlock
            </p>
          </div>
        ) : (
          <form
            onSubmit={handleUnlock}
            onClick={(e) => e.stopPropagation()}
            className="flex flex-col items-center gap-4 bg-slate-900/80 border border-slate-700/80 p-8 rounded-3xl shadow-2xl backdrop-blur-2xl max-w-sm w-full animate-in fade-in zoom-in-95 duration-200"
          >
            {/* User Profile Avatar */}
            <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-blue-600 to-cyan-400 flex items-center justify-center text-white text-2xl font-bold shadow-xl ring-4 ring-blue-500/30">
              AD
            </div>

            <div className="text-center">
              <h2 className="text-base font-semibold text-white">Administrator</h2>
              <p className="text-xs text-slate-400">admin@aegis-enterprise.corp</p>
            </div>

            <div className="relative w-full mt-2">
              <input
                type="password"
                placeholder="PIN or SmartCard Token"
                value={pin}
                onChange={(e) => setPin(e.target.value)}
                autoFocus
                className="w-full bg-slate-800/90 border border-slate-600/70 rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-500/40 pr-10"
              />
              <button
                type="submit"
                className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white transition-colors"
              >
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="flex items-center gap-2 text-[11px] text-blue-400">
              <KeyRound className="w-3.5 h-3.5" />
              <span>BitLocker TPM 2.0 Security Verified</span>
            </div>

            <button
              type="button"
              onClick={() => setShowPrompt(false)}
              className="text-xs text-slate-400 hover:text-slate-200 mt-2"
            >
              Cancel
            </button>
          </form>
        )}
      </div>

      {/* Bottom Right Controls */}
      <div className="relative z-10 flex justify-end items-center gap-3">
        <button
          onClick={() => setShowPrompt(true)}
          className="p-2.5 rounded-full hover:bg-white/10 text-slate-300 hover:text-white transition-colors"
          title="Sign in options"
        >
          <User className="w-5 h-5" />
        </button>
        <button
          onClick={() => handleUnlock()}
          className="p-2.5 rounded-full hover:bg-white/10 text-slate-300 hover:text-white transition-colors"
          title="Power / Restart"
        >
          <Power className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}
