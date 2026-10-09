import React from 'react';
import { X, ShieldCheck, Cpu, HardDrive } from 'lucide-react';

interface AboutWindowsDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AboutWindowsDialog({ isOpen, onClose }: AboutWindowsDialogProps) {
  if (!isOpen) return null;

  return (
    <div
      onClick={(e) => e.stopPropagation()}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm pointer-events-auto"
    >
      <div className="w-[480px] bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl p-5 text-slate-100 font-sans select-none animate-in fade-in zoom-in-95 duration-100">
        {/* Title bar */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <div className="grid grid-cols-2 gap-0.5 w-3.5 h-3.5">
              <div className="bg-cyan-400 rounded-xs" />
              <div className="bg-blue-500 rounded-xs" />
              <div className="bg-blue-400 rounded-xs" />
              <div className="bg-indigo-500 rounded-xs" />
            </div>
            <span className="text-xs font-semibold">About AegisNT Windows Enterprise</span>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-white rounded hover:bg-slate-800"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Content */}
        <div className="py-4 space-y-4">
          <div className="flex items-center gap-4">
            {/* Windows 11 4-Square Logo */}
            <div className="w-16 h-16 rounded-xl bg-gradient-to-tr from-blue-700 to-cyan-500 p-3 flex items-center justify-center shadow-lg shadow-blue-500/20 shrink-0">
              <div className="grid grid-cols-2 gap-1 w-full h-full">
                <div className="bg-white/90 rounded-sm" />
                <div className="bg-white/90 rounded-sm" />
                <div className="bg-white/90 rounded-sm" />
                <div className="bg-white/90 rounded-sm" />
              </div>
            </div>
            <div>
              <h2 className="text-base font-bold text-white tracking-wide">
                AegisNT™ Enterprise OS
              </h2>
              <p className="text-xs text-blue-400 font-mono">
                Version 24H2 (OS Build 26100.1882)
              </p>
              <p className="text-[11px] text-slate-400">
                NT-Inspired Microkernel with Win32 / Wine Subsystem
              </p>
            </div>
          </div>

          <div className="bg-slate-950/60 rounded-xl p-3 border border-slate-800 text-xs space-y-1.5 font-mono">
            <div className="flex justify-between text-slate-300">
              <span className="text-slate-500">Kernel Architecture:</span>
              <span className="text-cyan-400">Hybrid Microkernel (x86_64 / ARM64)</span>
            </div>
            <div className="flex justify-between text-slate-300">
              <span className="text-slate-500">Virtualization Layer:</span>
              <span className="text-emerald-400">QEMU / KVM VirtIO HAL</span>
            </div>
            <div className="flex justify-between text-slate-300">
              <span className="text-slate-500">Storage & IO Bus:</span>
              <span className="text-amber-400">NVMe 2.0 • USB 4.0 Tunneling</span>
            </div>
            <div className="flex justify-between text-slate-300">
              <span className="text-slate-500">Graphics Acceleration:</span>
              <span className="text-purple-400">VFIO GPU Passthrough • WDDM 3.2</span>
            </div>
            <div className="flex justify-between text-slate-300">
              <span className="text-slate-500">Security & Disk Crypto:</span>
              <span className="text-rose-400">BitLocker AES-XTS-256 • HVCI • TPM 2.0</span>
            </div>
          </div>

          <div className="text-xs text-slate-300 space-y-1">
            <p className="font-semibold text-slate-200">
              This product is licensed under Enterprise Volume Licensing Terms to:
            </p>
            <p className="text-slate-400 pl-2">
              Domain Administrator (<span className="text-blue-400">admin@aegis-enterprise.corp</span>)
            </p>
            <p className="text-slate-400 pl-2">
              Aegis Corporation International • Tier 1 Enterprise Seat
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end pt-3 border-t border-slate-800">
          <button
            onClick={onClose}
            className="px-5 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs shadow-md transition-colors"
          >
            OK
          </button>
        </div>
      </div>
    </div>
  );
}
