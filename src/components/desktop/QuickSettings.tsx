import React, { useState } from 'react';
import {
  Wifi,
  Volume2,
  VolumeX,
  Sun,
  ShieldCheck,
  Moon,
  Plane,
  Eye,
  Settings,
  Battery,
  Sliders,
  Check
} from 'lucide-react';

interface QuickSettingsProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenSettings: () => void;
  onTriggerToast: (title: string, message: string, type?: 'info' | 'success' | 'warning' | 'security') => void;
}

export default function QuickSettings({
  isOpen,
  onClose,
  onOpenSettings,
  onTriggerToast
}: QuickSettingsProps) {
  const [wifiEnabled, setWifiEnabled] = useState(true);
  const [bluetoothEnabled, setBluetoothEnabled] = useState(true);
  const [airplaneMode, setAirplaneMode] = useState(false);
  const [tpmGuard, setTpmGuard] = useState(true);
  const [focusAssist, setFocusAssist] = useState(true);
  const [nightLight, setNightLight] = useState(false);
  const [volume, setVolume] = useState(85);
  const [isMuted, setIsMuted] = useState(false);
  const [brightness, setBrightness] = useState(90);

  if (!isOpen) return null;

  const toggleWifi = () => {
    const next = !wifiEnabled;
    setWifiEnabled(next);
    onTriggerToast(
      'Network State Changed',
      next ? 'VirtIO-Net 10 Gbps Enterprise adapter connected.' : 'Network interface disconnected.',
      next ? 'success' : 'info'
    );
  };

  const toggleTpm = () => {
    const next = !tpmGuard;
    setTpmGuard(next);
    onTriggerToast(
      'Hardware Security Monitor',
      next ? 'BitLocker TPM 2.0 PCR Validation active.' : 'Security Reference Monitor in bypass audit mode.',
      next ? 'success' : 'info'
    );
  };

  return (
    <div
      onClick={(e) => e.stopPropagation()}
      className="fixed bottom-14 right-3 w-80 bg-slate-900/95 border border-slate-700/80 rounded-2xl shadow-2xl backdrop-blur-2xl z-50 p-4 text-slate-100 font-sans select-none"
    >
      {/* 2x3 Quick Action Toggles */}
      <div className="grid grid-cols-3 gap-2.5 mb-4">
        {/* Wi-Fi */}
        <button
          onClick={toggleWifi}
          className={`flex flex-col items-center justify-center p-3 rounded-xl border text-xs font-medium transition-all ${
            wifiEnabled
              ? 'bg-blue-600 text-white border-blue-500 shadow-md shadow-blue-500/20'
              : 'bg-slate-800/80 text-slate-400 border-slate-700/60 hover:bg-slate-800'
          }`}
        >
          <Wifi className="w-5 h-5 mb-1.5" />
          <span className="text-[11px] font-semibold">Wi-Fi</span>
          <span className="text-[9px] opacity-80 truncate max-w-full">
            {wifiEnabled ? 'VirtIO 10G' : 'Off'}
          </span>
        </button>

        {/* Bluetooth / USB4 */}
        <button
          onClick={() => setBluetoothEnabled(!bluetoothEnabled)}
          className={`flex flex-col items-center justify-center p-3 rounded-xl border text-xs font-medium transition-all ${
            bluetoothEnabled
              ? 'bg-blue-600 text-white border-blue-500 shadow-md shadow-blue-500/20'
              : 'bg-slate-800/80 text-slate-400 border-slate-700/60 hover:bg-slate-800'
          }`}
        >
          <Sliders className="w-5 h-5 mb-1.5" />
          <span className="text-[11px] font-semibold">USB4 Hub</span>
          <span className="text-[9px] opacity-80">
            {bluetoothEnabled ? '40 Gbps' : 'Disabled'}
          </span>
        </button>

        {/* Airplane Mode */}
        <button
          onClick={() => setAirplaneMode(!airplaneMode)}
          className={`flex flex-col items-center justify-center p-3 rounded-xl border text-xs font-medium transition-all ${
            airplaneMode
              ? 'bg-blue-600 text-white border-blue-500 shadow-md shadow-blue-500/20'
              : 'bg-slate-800/80 text-slate-400 border-slate-700/60 hover:bg-slate-800'
          }`}
        >
          <Plane className="w-5 h-5 mb-1.5" />
          <span className="text-[11px] font-semibold">Airplane</span>
          <span className="text-[9px] opacity-80">
            {airplaneMode ? 'On' : 'Off'}
          </span>
        </button>

        {/* TPM Guard */}
        <button
          onClick={toggleTpm}
          className={`flex flex-col items-center justify-center p-3 rounded-xl border text-xs font-medium transition-all ${
            tpmGuard
              ? 'bg-blue-600 text-white border-blue-500 shadow-md shadow-blue-500/20'
              : 'bg-slate-800/80 text-slate-400 border-slate-700/60 hover:bg-slate-800'
          }`}
        >
          <ShieldCheck className="w-5 h-5 mb-1.5" />
          <span className="text-[11px] font-semibold">TPM 2.0</span>
          <span className="text-[9px] opacity-80">
            {tpmGuard ? 'Secured' : 'Bypass'}
          </span>
        </button>

        {/* Focus Assist */}
        <button
          onClick={() => setFocusAssist(!focusAssist)}
          className={`flex flex-col items-center justify-center p-3 rounded-xl border text-xs font-medium transition-all ${
            focusAssist
              ? 'bg-blue-600 text-white border-blue-500 shadow-md shadow-blue-500/20'
              : 'bg-slate-800/80 text-slate-400 border-slate-700/60 hover:bg-slate-800'
          }`}
        >
          <Moon className="w-5 h-5 mb-1.5" />
          <span className="text-[11px] font-semibold">Focus</span>
          <span className="text-[9px] opacity-80">
            {focusAssist ? 'Priority' : 'Off'}
          </span>
        </button>

        {/* Night Light */}
        <button
          onClick={() => setNightLight(!nightLight)}
          className={`flex flex-col items-center justify-center p-3 rounded-xl border text-xs font-medium transition-all ${
            nightLight
              ? 'bg-blue-600 text-white border-blue-500 shadow-md shadow-blue-500/20'
              : 'bg-slate-800/80 text-slate-400 border-slate-700/60 hover:bg-slate-800'
          }`}
        >
          <Eye className="w-5 h-5 mb-1.5" />
          <span className="text-[11px] font-semibold">Night light</span>
          <span className="text-[9px] opacity-80">
            {nightLight ? 'Active' : 'Off'}
          </span>
        </button>
      </div>

      {/* Sliders: Brightness & Volume */}
      <div className="space-y-3 mb-4 pt-2 border-t border-slate-800/80">
        {/* Brightness */}
        <div className="flex items-center gap-3">
          <Sun className="w-4 h-4 text-slate-400 shrink-0" />
          <input
            type="range"
            min={10}
            max={100}
            value={brightness}
            onChange={(e) => setBrightness(Number(e.target.value))}
            className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-blue-500"
          />
          <span className="text-[11px] text-slate-400 font-mono w-7 text-right">
            {brightness}%
          </span>
        </div>

        {/* Volume */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsMuted(!isMuted)}
            className="text-slate-400 hover:text-slate-200 transition-colors"
          >
            {isMuted || volume === 0 ? (
              <VolumeX className="w-4 h-4 text-rose-400 shrink-0" />
            ) : (
              <Volume2 className="w-4 h-4 shrink-0" />
            )}
          </button>
          <input
            type="range"
            min={0}
            max={100}
            value={isMuted ? 0 : volume}
            onChange={(e) => {
              setVolume(Number(e.target.value));
              if (isMuted) setIsMuted(false);
            }}
            className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-blue-500"
          />
          <span className="text-[11px] text-slate-400 font-mono w-7 text-right">
            {isMuted ? '0%' : `${volume}%`}
          </span>
        </div>
      </div>

      {/* Footer: Battery & Settings Shortcut */}
      <div className="flex items-center justify-between pt-3 border-t border-slate-800/80 text-xs">
        <div className="flex items-center gap-2 text-slate-300">
          <Battery className="w-4 h-4 text-emerald-400" />
          <span className="font-semibold text-[11px]">100%</span>
          <span className="text-[10px] text-slate-500">Fully Charged (AC Power)</span>
        </div>

        <button
          onClick={() => {
            onClose();
            onOpenSettings();
          }}
          className="p-2 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
          title="All Settings"
        >
          <Settings className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
