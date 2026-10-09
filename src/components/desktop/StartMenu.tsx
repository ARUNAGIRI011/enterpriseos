import React, { useState } from 'react';
import {
  Search,
  Power,
  RotateCcw,
  Shield,
  FileText,
  Cpu,
  Server,
  Hammer,
  BookOpen,
  Terminal,
  Activity,
  Folder,
  Settings,
  Lock,
  ChevronRight,
  ChevronLeft,
  Moon,
  LogOut,
  User,
  Sparkles,
  KeyRound,
  Compass,
  Layers
} from 'lucide-react';

interface StartMenuProps {
  isOpen: boolean;
  onClose: () => void;
  onLaunchApp: (appId: string) => void;
  onLockSession?: () => void;
  onRestartSystem?: () => void;
  onTriggerToast?: (title: string, message: string, type?: 'info' | 'success' | 'warning' | 'security') => void;
}

interface AppTile {
  id: string;
  name: string;
  category: string;
  icon: React.ReactNode;
  description: string;
}

export default function StartMenu({
  isOpen,
  onClose,
  onLaunchApp,
  onLockSession,
  onRestartSystem,
  onTriggerToast
}: StartMenuProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'pinned' | 'all'>('pinned');
  const [showPowerMenu, setShowPowerMenu] = useState(false);

  if (!isOpen) return null;

  const APPS: AppTile[] = [
    { id: 'app_compat', name: 'App Compatibility Suite', category: 'Subsystems', icon: <Layers className="text-cyan-400" size={24} />, description: 'Java 21 JVM, .NET 9 CoreCLR & Win32 PE Subsystem' },
    { id: 'win11_guidance', name: 'Windows 11 Desktop Guidance', category: 'System Guidance', icon: <Compass className="text-blue-400" size={24} />, description: 'Desktop Tour, Architecture & App Execution' },
    { id: 'enterprise_security', name: 'Enterprise Security & Firewall', category: 'Security & EDR', icon: <Shield className="text-emerald-400" size={24} />, description: 'Defender, Stateful Firewall, Docker & 0-Reboot Patches' },
    { id: 'file_explorer', name: 'File Explorer', category: 'Storage', icon: <Folder className="text-yellow-400" size={24} />, description: 'AegisFS & Encrypted Volumes' },
    { id: 'libreoffice', name: 'LibreOffice Suite', category: 'Productivity', icon: <FileText className="text-emerald-400" size={24} />, description: 'Writer, Calc & Impress Enterprise' },
    { id: 'resource_monitor', name: 'Resource Monitor & Logs', category: 'Diagnostics', icon: <Activity className="text-cyan-400" size={24} />, description: 'Resmon Telemetry & Event Viewer' },
    { id: 'vm_boot_guide', name: 'VM Boot & Setup Guide', category: 'Virtualization', icon: <Server className="text-indigo-400" size={24} />, description: 'QEMU, VirtualBox & VMware Configs' },
    { id: 'dev_docs', name: 'Developer & Architecture Docs', category: 'System Dev', icon: <BookOpen className="text-blue-400" size={24} />, description: 'Kernel, Drivers, Diagrams & Guide' },
    { id: 'terminal', name: 'Windows Terminal', category: 'Remote Admin', icon: <Terminal className="text-cyan-400" size={24} />, description: 'PowerShell, WinRM & OpenSSH Shells' },
    { id: 'task_manager', name: 'Task Manager', category: 'Diagnostics', icon: <Activity className="text-emerald-400" size={24} />, description: 'Real-time CPU, RAM, NVMe & GPU' },
    { id: 'kernel_inspector', name: 'NT Kernel Inspector', category: 'Executive Core', icon: <Cpu className="text-blue-400" size={24} />, description: 'Object Manager, VMM & HAL Monitor' },
    { id: 'virtualization', name: 'QEMU / KVM Hypervisor', category: 'Virtualization', icon: <Server className="text-cyan-400" size={24} />, description: 'VirtIO VMs & Paravirtualization' },
    { id: 'ddk', name: 'Driver Dev Kit (WDK)', category: 'System Dev', icon: <Hammer className="text-amber-400" size={24} />, description: 'C/C++ Driver IDE & Crash Verifier' },
    { id: 'win32_api', name: 'Win32 API & Wine Subsystem', category: 'Compatibility', icon: <BookOpen className="text-sky-400" size={24} />, description: 'PE Binary Runner & NT Syscalls' },
    { id: 'encrypted_disk', name: 'BitLocker Drive Manager', category: 'Security & Crypto', icon: <Lock className="text-rose-400" size={24} />, description: 'AES-XTS-256 Partitions & TPM' },
    { id: 'settings', name: 'Settings & Hardening', category: 'System Config', icon: <Shield className="text-indigo-400" size={24} />, description: 'HVCI, KASLR, SMEP & Arch Tuning' },
  ];

  const filteredApps = APPS.filter(
    (app) =>
      app.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handlePowerAction = (action: 'sleep' | 'restart' | 'shutdown' | 'lock') => {
    setShowPowerMenu(false);
    onClose();

    if (action === 'lock') {
      if (onLockSession) onLockSession();
      return;
    }

    if (action === 'restart') {
      if (onRestartSystem) onRestartSystem();
      return;
    }

    if (onTriggerToast) {
      if (action === 'sleep') {
        onTriggerToast('Power Mode', 'System entered ACPI S3 low-power standby state.', 'info');
      } else if (action === 'shutdown') {
        onTriggerToast('Shutdown Scheduled', 'ACPI power down request acknowledged by NT HAL.', 'warning');
      }
    }
  };

  return (
    <div
      onClick={(e) => {
        e.stopPropagation();
        setShowPowerMenu(false);
      }}
      className="fixed bottom-14 left-1/2 -translate-x-1/2 w-[590px] max-w-[95vw] bg-slate-900/96 border border-slate-700/85 rounded-2xl shadow-2xl backdrop-blur-3xl z-50 flex flex-col overflow-hidden text-slate-100 font-sans select-none animate-in fade-in zoom-in-95 duration-150"
    >
      {/* Top Windows 11 Search Header */}
      <div className="p-4 border-b border-slate-800/80 bg-slate-950/40">
        <div className="relative">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Type here to search apps, drivers, files, or settings..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            autoFocus
            className="w-full bg-slate-800/90 border border-slate-700/70 rounded-full pl-10 pr-4 py-2 text-xs text-slate-100 placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* Main Content Area */}
      <div className="p-5 overflow-y-auto max-h-[460px]">
        {/* Navigation Bar: Pinned vs All Apps */}
        <div className="flex items-center justify-between mb-3.5">
          <span className="text-xs font-semibold text-slate-200">
            {viewMode === 'pinned' ? 'Pinned Applications' : 'All Applications (A-Z)'}
          </span>
          <button
            onClick={() => setViewMode(viewMode === 'pinned' ? 'all' : 'pinned')}
            className="text-[11px] text-blue-400 hover:text-blue-300 font-medium flex items-center gap-1 transition-colors px-2 py-0.5 rounded-md hover:bg-slate-800"
          >
            {viewMode === 'pinned' ? (
              <>
                <span>All apps</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </>
            ) : (
              <>
                <ChevronLeft className="w-3.5 h-3.5" />
                <span>Back to pinned</span>
              </>
            )}
          </button>
        </div>

        {/* View Mode: Pinned Grid */}
        {viewMode === 'pinned' ? (
          <>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
              {filteredApps.map((app) => (
                <button
                  key={app.id}
                  onClick={() => {
                    onLaunchApp(app.id);
                    onClose();
                  }}
                  className="group flex flex-col items-start p-3 rounded-xl bg-slate-800/50 hover:bg-slate-800/90 border border-slate-700/40 hover:border-blue-500/50 transition-all text-left shadow-sm hover:shadow-md hover:scale-[1.01]"
                >
                  <div className="flex items-center justify-between w-full mb-2">
                    <div className="p-1 rounded-lg bg-slate-900/80">{app.icon}</div>
                    <span className="text-[9px] uppercase tracking-wider px-1.5 py-0.5 rounded bg-slate-700/80 text-slate-300 font-mono">
                      {app.category}
                    </span>
                  </div>
                  <span className="font-semibold text-xs text-slate-100 group-hover:text-blue-300 transition-colors">
                    {app.name}
                  </span>
                  <span className="text-[10px] text-slate-400 line-clamp-1 mt-0.5">
                    {app.description}
                  </span>
                </button>
              ))}
            </div>

            {/* Recommended Section (Recent Files) */}
            <div className="mt-6 pt-3.5 border-t border-slate-800/80">
              <div className="flex items-center justify-between mb-2.5">
                <span className="text-xs font-semibold text-slate-300">Recommended Files</span>
                <span className="text-[10px] text-slate-500">Recent Enterprise Activity</span>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs">
                <button
                  onClick={() => {
                    onLaunchApp('libreoffice');
                    onClose();
                  }}
                  className="flex items-center gap-2.5 p-2 rounded-xl bg-slate-800/40 hover:bg-slate-800/90 border border-slate-700/40 text-left transition-colors"
                >
                  <div className="w-8 h-8 rounded-lg bg-emerald-950/80 border border-emerald-700/60 flex items-center justify-center text-emerald-400 font-bold text-[10px]">
                    ODT
                  </div>
                  <div className="truncate min-w-0">
                    <p className="truncate text-slate-200 text-xs font-medium">NT_Security_Architecture.odt</p>
                    <p className="text-[10px] text-slate-400">LibreOffice Writer • 14m ago</p>
                  </div>
                </button>

                <button
                  onClick={() => {
                    onLaunchApp('ddk');
                    onClose();
                  }}
                  className="flex items-center gap-2.5 p-2 rounded-xl bg-slate-800/40 hover:bg-slate-800/90 border border-slate-700/40 text-left transition-colors"
                >
                  <div className="w-8 h-8 rounded-lg bg-amber-950/80 border border-amber-700/60 flex items-center justify-center text-amber-400 font-bold text-[10px]">
                    .C
                  </div>
                  <div className="truncate min-w-0">
                    <p className="truncate text-slate-200 text-xs font-medium">nvme_doorbell_sync.c</p>
                    <p className="text-[10px] text-slate-400">Aegis WDK C Editor • 28m ago</p>
                  </div>
                </button>
              </div>
            </div>
          </>
        ) : (
          /* View Mode: All Apps Alphabetical */
          <div className="space-y-4">
            {filteredApps.map((app) => (
              <button
                key={app.id}
                onClick={() => {
                  onLaunchApp(app.id);
                  onClose();
                }}
                className="w-full flex items-center gap-3 p-2 rounded-xl hover:bg-slate-800/80 transition-colors text-left"
              >
                <div className="p-1.5 rounded-lg bg-slate-800 border border-slate-700">
                  {app.icon}
                </div>
                <div>
                  <h4 className="text-xs font-semibold text-slate-100">{app.name}</h4>
                  <p className="text-[10px] text-slate-400">{app.description}</p>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Windows 11 Bottom User Bar & Power Menu */}
      <div className="p-3.5 bg-slate-950/90 border-t border-slate-800/80 flex items-center justify-between relative">
        {/* User Profile */}
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-600 to-cyan-500 flex items-center justify-center font-bold text-xs text-white shadow-md">
            AD
          </div>
          <div>
            <div className="text-xs font-semibold text-slate-100 flex items-center gap-1.5">
              Administrator
              <span className="text-[9px] px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                DOMAIN ADMIN
              </span>
            </div>
            <div className="text-[10px] text-slate-400">admin@aegis-enterprise.corp</div>
          </div>
        </div>

        {/* Windows 11 Power Button with Popup */}
        <div className="relative">
          <button
            onClick={(e) => {
              e.stopPropagation();
              setShowPowerMenu(!showPowerMenu);
            }}
            className="p-2 rounded-lg hover:bg-slate-800 text-slate-300 hover:text-white transition-colors"
            title="Power options"
          >
            <Power size={18} />
          </button>

          {/* Windows 11 Power Flyout */}
          {showPowerMenu && (
            <div
              onClick={(e) => e.stopPropagation()}
              className="absolute right-0 bottom-full mb-2 w-44 bg-slate-900/98 border border-slate-700/90 rounded-xl shadow-2xl p-1.5 z-50 text-xs text-slate-200 backdrop-blur-2xl animate-in fade-in zoom-in-95 duration-100"
            >
              <button
                onClick={() => handlePowerAction('sleep')}
                className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg hover:bg-slate-800 text-slate-300 hover:text-white transition-colors text-left"
              >
                <Moon className="w-4 h-4 text-purple-400" />
                <span>Sleep</span>
              </button>

              <button
                onClick={() => handlePowerAction('restart')}
                className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg hover:bg-slate-800 text-slate-300 hover:text-white transition-colors text-left"
              >
                <RotateCcw className="w-4 h-4 text-amber-400" />
                <span>Restart</span>
              </button>

              <button
                onClick={() => handlePowerAction('lock')}
                className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg hover:bg-slate-800 text-slate-300 hover:text-white transition-colors text-left"
              >
                <Lock className="w-4 h-4 text-rose-400" />
                <span>Lock</span>
              </button>

              <div className="w-full h-[1px] bg-slate-800 my-1" />

              <button
                onClick={() => handlePowerAction('shutdown')}
                className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg hover:bg-rose-600/30 text-slate-300 hover:text-rose-200 transition-colors text-left"
              >
                <Power className="w-4 h-4 text-rose-400" />
                <span>Shut down</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
