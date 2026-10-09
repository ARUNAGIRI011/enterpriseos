import React, { useState } from 'react';
import {
  Settings as SettingsIcon,
  Cpu,
  Shield,
  Monitor,
  HardDrive,
  Info,
  CheckCircle2
} from 'lucide-react';
import { KernelEngine } from '../../services/kernelEngine';
import { Architecture } from '../../types/os';

export default function SettingsApp({
  currentWallpaper,
  onWallpaperChange,
  onLaunchApp
}: {
  currentWallpaper: string;
  onWallpaperChange: (wp: string) => void;
  onLaunchApp?: (appId: string) => void;
}) {
  const engine = KernelEngine.getInstance();
  const [arch, setArch] = useState<Architecture>(engine.arch);
  const [activeTab, setActiveTab] = useState<'system' | 'personalization' | 'security' | 'about'>('system');

  const wallpapers = [
    { id: 'enterprise-dark', name: 'Aegis Deep Obsidian', bg: 'from-slate-950 via-slate-900 to-indigo-950' },
    { id: 'cyber-mesh', name: 'Enterprise Cyber Grid', bg: 'from-slate-950 via-blue-950 to-slate-900' },
    { id: 'silicon-dawn', name: 'Microkernel Silicon', bg: 'from-slate-950 via-purple-950 to-slate-900' },
    { id: 'aurora-datacenter', name: 'Datacenter Emerald', bg: 'from-slate-950 via-emerald-950 to-slate-900' }
  ];

  const handleArchSwitch = (target: Architecture) => {
    engine.switchArchitecture(target);
    setArch(target);
  };

  return (
    <div className="flex flex-col h-full bg-slate-950 text-slate-100 font-sans select-none">
      {/* Header */}
      <div className="flex items-center gap-2 px-4 py-2.5 bg-slate-900 border-b border-slate-800">
        <SettingsIcon className="w-5 h-5 text-blue-400" />
        <span className="font-semibold text-sm">AegisNT Enterprise System Settings</span>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <div className="w-48 bg-slate-950 border-r border-slate-800 p-2 space-y-1 text-xs font-medium">
          {[
            { id: 'system', label: 'System & Hardware', icon: Cpu },
            { id: 'personalization', label: 'Personalization', icon: Monitor },
            { id: 'security', label: 'Security & Integrity', icon: Shield },
            { id: 'about', label: 'About AegisNT', icon: Info }
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`w-full flex items-center gap-2.5 px-3 py-2 rounded transition-colors text-left ${
                  isActive ? 'bg-blue-600 text-white font-semibold' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
                }`}
              >
                <Icon className="w-4 h-4" />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Content Panel */}
        <div className="flex-1 p-6 overflow-y-auto space-y-5 bg-slate-950 max-w-2xl">
          {activeTab === 'system' && (
            <div className="space-y-4">
              <div>
                <h3 className="text-base font-bold text-slate-100">Processor & Architecture Configuration</h3>
                <p className="text-xs text-slate-400">Configure target CPU execution mode and hardware abstraction</p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => handleArchSwitch('x86_64')}
                  className={`p-4 rounded-lg border text-left transition-all ${
                    arch === 'x86_64'
                      ? 'border-blue-500 bg-blue-950/40 ring-1 ring-blue-500'
                      : 'border-slate-800 bg-slate-900/50 hover:border-slate-700'
                  }`}
                >
                  <div className="font-bold text-sm text-slate-100">x86_64 (AMD64 / Intel)</div>
                  <div className="text-xs text-slate-400 mt-1">AVX-512, Intel VT-x / AMD-V, x2APIC interrupts</div>
                  <div className="text-[11px] font-mono text-blue-400 mt-2">Latency: ~310ns</div>
                </button>

                <button
                  onClick={() => handleArchSwitch('arm64')}
                  className={`p-4 rounded-lg border text-left transition-all ${
                    arch === 'arm64'
                      ? 'border-purple-500 bg-purple-950/40 ring-1 ring-purple-500'
                      : 'border-slate-800 bg-slate-900/50 hover:border-slate-700'
                  }`}
                >
                  <div className="font-bold text-sm text-slate-100">ARM64 (ARMv9-A)</div>
                  <div className="text-xs text-slate-400 mt-1">ARM NEON, SVE2, GICv3 interrupt distributor</div>
                  <div className="text-[11px] font-mono text-purple-400 mt-2">Latency: ~240ns (Tickless)</div>
                </button>
              </div>

              <div className="p-4 bg-slate-900 border border-slate-800 rounded-lg text-xs space-y-2">
                <div className="font-bold text-slate-200">System Hardware Specifications:</div>
                <div className="grid grid-cols-2 gap-2 text-slate-400 font-mono text-[11px]">
                  <div>Installed RAM: 32.0 GB (DDR5-6000 ECC)</div>
                  <div>Storage: Enterprise NVMe 2.0 (PCIe Gen5)</div>
                  <div>Hypervisor: KVM / QEMU VirtIO HAL</div>
                  <div>GPU Bus: Direct VFIO Passthrough</div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'personalization' && (
            <div className="space-y-4">
              <div>
                <h3 className="text-base font-bold text-slate-100">Desktop Personalization & Themes</h3>
                <p className="text-xs text-slate-400">Choose enterprise workspace theme and background</p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                {wallpapers.map((wp) => (
                  <div
                    key={wp.id}
                    onClick={() => onWallpaperChange(wp.id)}
                    className={`p-3 rounded-lg border cursor-pointer transition-all ${
                      currentWallpaper === wp.id
                        ? 'border-blue-500 bg-slate-900 ring-1 ring-blue-500'
                        : 'border-slate-800 bg-slate-900/40 hover:border-slate-700'
                    }`}
                  >
                    <div className={`w-full h-20 rounded bg-gradient-to-br ${wp.bg} mb-2 border border-slate-800`} />
                    <div className="text-xs font-semibold text-slate-200">{wp.name}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'security' && (
            <div className="space-y-4">
              <div>
                <h3 className="text-base font-bold text-slate-100">Security & Kernel Hardening Status</h3>
                <p className="text-xs text-slate-400">Real-time status of enterprise protection systems</p>
              </div>

              <div className="p-4 bg-slate-900 border border-slate-800 rounded-lg space-y-3">
                {[
                  { label: 'Virtualization-Based Security (VBS)', status: 'Active (VTL 1 Isolated)' },
                  { label: 'Hypervisor-Protected Code Integrity (HVCI)', status: 'Enforced' },
                  { label: 'Hardware TPM 2.0 Module', status: 'Sealed (PCR 7 / 11)' },
                  { label: 'BitLocker Volume Encryption', status: 'AES-XTS-256 Enabled' },
                  { label: 'Driver Signature Enforcement (DSE)', status: 'Strict WHQL Only' },
                  { label: 'Stateful Packet Filter (SPI Firewall)', status: 'Enforced (Domain Profile)' },
                  { label: 'Aegis Defender EDR & Antivirus', status: 'Real-Time Active (v1.420)' },
                  { label: 'Zero-Reboot Hotpatching Engine', status: 'Active (kpatch.sys Online)' }
                ].map((s, i) => (
                  <div key={i} className="flex items-center justify-between text-xs">
                    <span className="text-slate-300">{s.label}</span>
                    <span className="flex items-center gap-1 font-mono text-emerald-400 font-semibold">
                      <CheckCircle2 className="w-3.5 h-3.5" /> {s.status}
                    </span>
                  </div>
                ))}
              </div>

              {onLaunchApp && (
                <div className="p-4 bg-emerald-950/30 border border-emerald-500/40 rounded-lg flex items-center justify-between">
                  <div>
                    <div className="text-xs font-bold text-emerald-300">Enterprise Security, Firewall & Patch Center</div>
                    <div className="text-[11px] text-slate-400 mt-0.5">Manage Defender EDR, Docker profiles, external firewalls, and updates</div>
                  </div>
                  <button
                    onClick={() => onLaunchApp('enterprise_security')}
                    className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded text-xs font-semibold flex items-center gap-1.5 shadow transition-colors"
                  >
                    <Shield className="w-3.5 h-3.5" />
                    Open Security Center
                  </button>
                </div>
              )}
            </div>
          )}

          {activeTab === 'about' && (
            <div className="space-y-4">
              <div className="p-5 bg-slate-900 border border-slate-800 rounded-lg space-y-3">
                <div className="text-lg font-bold text-blue-400 font-mono">AegisNT Enterprise OS</div>
                <div className="text-xs text-slate-300 leading-relaxed">
                  Version 10.0 (Build 26100.NT-HYBRID)<br />
                  A next-generation enterprise operating system powered by an NT-inspired microkernel architecture, dual x86_64 and ARM64 HAL, transparent Wine 9.x Win32 compatibility subsystem, Driver Development Kit (WDK), and native QEMU/KVM virtualization.
                </div>
                <div className="pt-2 border-t border-slate-800 text-[11px] font-mono text-slate-500">
                  © 2026 AegisNT Corporation. All rights reserved.
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
