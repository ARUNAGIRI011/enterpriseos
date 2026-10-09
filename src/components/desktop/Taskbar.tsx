import React, { useState, useEffect } from 'react';
import {
  Search,
  Wifi,
  Volume2,
  ShieldCheck,
  Cpu,
  ChevronUp,
  LayoutGrid,
  Bell,
  Battery,
  Sliders,
  HardDrive,
  X,
  FileText,
  Server,
  Hammer,
  BookOpen,
  Lock,
  Terminal,
  Activity,
  Folder,
  Settings,
  Sparkles
} from 'lucide-react';
import { AppWindow, Architecture } from '../../types/os';
import { KernelEngine } from '../../services/kernelEngine';

interface TaskbarProps {
  isStartOpen: boolean;
  onToggleStart: () => void;
  openWindows: AppWindow[];
  activeWindowId: string | null;
  onSelectWindow: (id: string) => void;
  onLaunchApp: (appId: string) => void;
  onCloseWindow: (id: string) => void;
  onToggleQuickSettings: () => void;
  onToggleCalendar: () => void;
  onMinimizeAll: () => void;
  taskbarAlignment?: 'center' | 'left';
  onToggleAlignment?: () => void;
  notificationCount?: number;
}

export default function Taskbar({
  isStartOpen,
  onToggleStart,
  openWindows,
  activeWindowId,
  onSelectWindow,
  onLaunchApp,
  onCloseWindow,
  onToggleQuickSettings,
  onToggleCalendar,
  onMinimizeAll,
  taskbarAlignment = 'center',
  onToggleAlignment,
  notificationCount = 2,
}: TaskbarProps) {
  const engine = KernelEngine.getInstance();
  const [time, setTime] = useState(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
  const [date, setDate] = useState(new Date().toLocaleDateString([], { month: 'numeric', day: 'numeric', year: 'numeric' }));
  const [arch, setArch] = useState<Architecture>(engine.arch);
  const [showArchFlyout, setShowArchFlyout] = useState(false);
  const [showOverflowTray, setShowOverflowTray] = useState(false);
  const [showTaskView, setShowTaskView] = useState(false);
  const [hoveredWindowId, setHoveredWindowId] = useState<string | null>(null);

  useEffect(() => {
    const timer = setInterval(() => {
      const d = new Date();
      setTime(d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
      setDate(d.toLocaleDateString([], { month: 'numeric', day: 'numeric', year: 'numeric' }));
      setArch(engine.arch);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleToggleArch = (target: Architecture) => {
    engine.switchArchitecture(target);
    setArch(target);
    setShowArchFlyout(false);
  };

  // Pinned Default Applications (always visible on taskbar like Windows 11)
  const PINNED_APPS = [
    { appId: 'file_explorer', title: 'File Explorer', icon: <Folder className="text-yellow-400 w-4 h-4" /> },
    { appId: 'libreoffice', title: 'LibreOffice Suite', icon: <FileText className="text-emerald-400 w-4 h-4" /> },
    { appId: 'terminal', title: 'Windows Terminal', icon: <Terminal className="text-cyan-400 w-4 h-4" /> },
    { appId: 'task_manager', title: 'Task Manager', icon: <Activity className="text-emerald-400 w-4 h-4" /> },
    { appId: 'kernel_inspector', title: 'NT Kernel Inspector', icon: <Cpu className="text-blue-400 w-4 h-4" /> },
    { appId: 'virtualization', title: 'QEMU Hypervisor', icon: <Server className="text-cyan-400 w-4 h-4" /> },
    { appId: 'ddk', title: 'Driver Dev Kit (WDK)', icon: <Hammer className="text-amber-400 w-4 h-4" /> },
  ];

  return (
    <>
      {/* Virtual Desktop Task View Switcher (when Task View clicked) */}
      {showTaskView && (
        <div
          onClick={() => setShowTaskView(false)}
          className="fixed inset-x-0 bottom-14 z-50 p-4 bg-slate-900/95 border-t border-slate-700/80 backdrop-blur-2xl flex items-center justify-center gap-4 text-slate-100"
        >
          <div className="flex flex-col items-center gap-2 p-3 rounded-xl bg-blue-600/20 border-2 border-blue-500 shadow-lg cursor-pointer">
            <div className="w-36 h-20 bg-slate-950 rounded-lg border border-slate-800 flex items-center justify-center text-xs text-blue-300 font-semibold">
              Desktop 1 (Main)
            </div>
            <span className="text-xs font-semibold">Active Enterprise Session</span>
          </div>

          <div className="flex flex-col items-center gap-2 p-3 rounded-xl bg-slate-800/40 border border-slate-700/60 hover:bg-slate-800 cursor-pointer transition-colors">
            <div className="w-36 h-20 bg-slate-950/60 rounded-lg border border-slate-800 flex items-center justify-center text-xs text-slate-400">
              Desktop 2 (Kernel Dev)
            </div>
            <span className="text-xs text-slate-400">WDK & Driver Verifier</span>
          </div>

          <div className="flex flex-col items-center gap-2 p-3 rounded-xl bg-slate-800/40 border border-slate-700/60 hover:bg-slate-800 cursor-pointer transition-colors">
            <div className="w-36 h-20 bg-slate-950/60 rounded-lg border border-slate-800 flex items-center justify-center text-xs text-slate-400">
              Desktop 3 (QEMU/KVM)
            </div>
            <span className="text-xs text-slate-400">Virtual Machines</span>
          </div>
        </div>
      )}

      {/* Main Windows 11 Taskbar */}
      <div className="h-12 w-full bg-slate-950/92 backdrop-blur-2xl border-t border-slate-800/80 flex items-center justify-between px-2 select-none z-40 text-slate-100 relative">
        {/* Left Side (when centered) or Left Alignment start */}
        <div className="flex items-center gap-2">
          {/* Windows 11 Logo Start Button */}
          <button
            onClick={onToggleStart}
            className={`h-10 px-2.5 rounded-lg flex items-center justify-center transition-all group ${
              isStartOpen
                ? 'bg-blue-600/30 text-white shadow-md ring-1 ring-blue-400/50'
                : 'hover:bg-slate-800/70 text-slate-200'
            }`}
            title="Start (Win)"
          >
            {/* Windows 11 4-Square Blue Tiles with Perspective Glow */}
            <div className="grid grid-cols-2 gap-0.5 w-4 h-4 group-hover:scale-105 transition-transform">
              <div className="bg-cyan-400 rounded-xs shadow-xs" />
              <div className="bg-blue-500 rounded-xs shadow-xs" />
              <div className="bg-blue-400 rounded-xs shadow-xs" />
              <div className="bg-indigo-500 rounded-xs shadow-xs" />
            </div>
          </button>

          {/* Windows 11 Search Pill */}
          <button
            onClick={onToggleStart}
            className="h-8.5 px-3 rounded-full bg-slate-900/90 hover:bg-slate-800 border border-slate-700/60 text-slate-400 hover:text-slate-200 flex items-center gap-2 text-xs transition-colors shadow-inner"
            title="Search"
          >
            <Search className="w-3.5 h-3.5 text-blue-400" />
            <span className="hidden sm:inline text-[11px] text-slate-300 font-sans">
              Search
            </span>
          </button>

          {/* Task View Icon */}
          <button
            onClick={() => setShowTaskView(!showTaskView)}
            className={`h-10 w-10 rounded-lg flex items-center justify-center transition-colors ${
              showTaskView ? 'bg-slate-800 text-blue-400' : 'hover:bg-slate-800/70 text-slate-400 hover:text-slate-200'
            }`}
            title="Task View (Virtual Desktops)"
          >
            <div className="relative w-4 h-4 border-2 border-current rounded-xs">
              <div className="absolute -top-1 -right-1 w-2.5 h-2.5 border-t-2 border-r-2 border-current rounded-xs" />
            </div>
          </button>

          {/* Windows Copilot / AI Assistant Icon */}
          <button
            onClick={() => onLaunchApp('kernel_inspector')}
            className="h-10 w-10 rounded-lg hover:bg-slate-800/70 text-slate-400 hover:text-cyan-300 flex items-center justify-center transition-colors"
            title="AegisNT Copilot & Architecture Monitor"
          >
            <Sparkles className="w-4 h-4 text-cyan-400" />
          </button>
        </div>

        {/* Center Section: Running & Pinned Applications */}
        <div
          className={`flex items-center gap-1.5 h-full ${
            taskbarAlignment === 'center'
              ? 'absolute left-1/2 -translate-x-1/2'
              : 'ml-2'
          }`}
        >
          {/* Pinned App Icons that aren't currently open */}
          {PINNED_APPS.map((pinned) => {
            const openWin = openWindows.find((w) => w.appId === pinned.appId);
            if (openWin) return null; // rendered in open list below

            return (
              <button
                key={pinned.appId}
                onClick={() => onLaunchApp(pinned.appId)}
                className="h-10 w-10 rounded-lg hover:bg-slate-800/70 flex items-center justify-center transition-all group relative"
                title={pinned.title}
              >
                <div className="group-hover:scale-110 transition-transform">
                  {pinned.icon}
                </div>
              </button>
            );
          })}

          {/* Open Windows Buttons */}
          {openWindows.map((win) => {
            const isActive = activeWindowId === win.id && !win.isMinimized;
            return (
              <div
                key={win.id}
                className="relative"
                onMouseEnter={() => setHoveredWindowId(win.id)}
                onMouseLeave={() => setHoveredWindowId(null)}
              >
                <button
                  onClick={() => onSelectWindow(win.id)}
                  className={`h-10 px-2.5 rounded-lg flex items-center gap-2 text-xs font-medium max-w-[170px] transition-all relative ${
                    isActive
                      ? 'bg-slate-800/90 text-white shadow-sm ring-1 ring-slate-700/60'
                      : win.isMinimized
                      ? 'hover:bg-slate-900 text-slate-400'
                      : 'hover:bg-slate-800/60 text-slate-300'
                  }`}
                >
                  {/* Miniature App Icon */}
                  <div className="grid grid-cols-2 gap-0.5 w-3 h-3 shrink-0">
                    <div className="bg-cyan-400 rounded-xs" />
                    <div className="bg-blue-500 rounded-xs" />
                    <div className="bg-blue-400 rounded-xs" />
                    <div className="bg-indigo-500 rounded-xs" />
                  </div>

                  <span className="truncate text-xs">{win.title}</span>

                  {/* Windows 11 Running Indicator Pill Underneath */}
                  {isActive ? (
                    <span className="absolute bottom-0.5 left-3 right-3 h-0.75 bg-blue-400 rounded-full shadow-sm shadow-blue-400/50" />
                  ) : (
                    <span className="absolute bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-slate-400 rounded-full" />
                  )}
                </button>

                {/* Windows 11 Hover Thumbnail Preview Card */}
                {hoveredWindowId === win.id && (
                  <div
                    onClick={(e) => e.stopPropagation()}
                    className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-52 bg-slate-900/98 border border-slate-700/90 rounded-xl shadow-2xl p-2.5 z-50 text-slate-100 backdrop-blur-2xl animate-in fade-in zoom-in-95 duration-100"
                  >
                    <div className="flex items-center justify-between gap-1 mb-1.5 border-b border-slate-800 pb-1">
                      <span className="text-[11px] font-semibold truncate text-slate-200">
                        {win.title}
                      </span>
                      <button
                        onClick={() => onCloseWindow(win.id)}
                        className="p-1 hover:bg-red-600 hover:text-white rounded text-slate-400 transition-colors"
                        title="Close window"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                    {/* Wireframe Thumbnail Preview */}
                    <div
                      onClick={() => onSelectWindow(win.id)}
                      className="w-full h-24 bg-slate-950 rounded-lg border border-slate-800 p-2 cursor-pointer hover:border-blue-500 transition-colors flex flex-col justify-between"
                    >
                      <div className="h-2 w-1/3 bg-slate-800 rounded" />
                      <div className="space-y-1">
                        <div className="h-1.5 w-full bg-slate-800/60 rounded" />
                        <div className="h-1.5 w-4/5 bg-slate-800/60 rounded" />
                        <div className="h-1.5 w-2/3 bg-slate-800/60 rounded" />
                      </div>
                      <div className="flex justify-between items-center text-[9px] text-blue-400 font-mono">
                        <span>AegisNT Process</span>
                        <span>Active</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Right Section: System Tray */}
        <div className="flex items-center gap-1.5 h-full text-xs font-sans">
          {/* Hidden Icons Overflow Chevron (^) */}
          <div className="relative">
            <button
              onClick={() => setShowOverflowTray(!showOverflowTray)}
              className="h-8 w-6 rounded hover:bg-slate-800/70 flex items-center justify-center text-slate-400 hover:text-slate-200 transition-colors"
              title="Show hidden icons"
            >
              <ChevronUp className="w-4 h-4" />
            </button>

            {/* Hidden Icons Tray Popup */}
            {showOverflowTray && (
              <div
                onClick={(e) => e.stopPropagation()}
                className="absolute right-0 bottom-full mb-2 w-48 bg-slate-900/98 border border-slate-700/80 rounded-xl shadow-2xl p-2.5 z-50 text-xs backdrop-blur-2xl grid grid-cols-4 gap-2"
              >
                <div
                  onClick={() => onLaunchApp('enterprise_security')}
                  title="TPM 2.0 PCR Security Engine Active - Open Enterprise Security Center"
                  className="p-2 rounded bg-slate-800/80 hover:bg-slate-700 text-emerald-400 flex items-center justify-center cursor-pointer"
                >
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <div title="VirtIO Bus Daemon Online" className="p-2 rounded bg-slate-800/80 hover:bg-slate-700 text-cyan-400 flex items-center justify-center">
                  <Server className="w-4 h-4" />
                </div>
                <div title="NVMe 2.0 Multi-Queue Direct DMA" className="p-2 rounded bg-slate-800/80 hover:bg-slate-700 text-amber-400 flex items-center justify-center">
                  <HardDrive className="w-4 h-4" />
                </div>
                <div title="USB 4.0 Tunneling Controller" className="p-2 rounded bg-slate-800/80 hover:bg-slate-700 text-blue-400 flex items-center justify-center">
                  <Sliders className="w-4 h-4" />
                </div>
              </div>
            )}
          </div>

          {/* Architecture Switcher Pill */}
          <div className="relative">
            <button
              onClick={() => setShowArchFlyout(!showArchFlyout)}
              className="flex items-center gap-1 px-2 py-1 rounded-md bg-slate-900 hover:bg-slate-800 border border-slate-800 text-[11px] text-blue-400 transition-colors font-mono"
              title="Kernel Architecture"
            >
              <Cpu className="w-3.5 h-3.5" />
              <span className="font-bold">{arch.toUpperCase()}</span>
            </button>

            {showArchFlyout && (
              <div
                onClick={(e) => e.stopPropagation()}
                className="absolute right-0 bottom-full mb-2 w-56 bg-slate-950 border border-slate-800 rounded-xl shadow-2xl p-2 z-50 text-xs"
              >
                <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-2 px-1">
                  Active NT Microkernel
                </div>
                <button
                  onClick={() => handleToggleArch('x86_64')}
                  className={`w-full flex items-center justify-between p-2 rounded text-left transition-colors ${
                    arch === 'x86_64' ? 'bg-blue-600 text-white font-bold' : 'hover:bg-slate-900 text-slate-300'
                  }`}
                >
                  <span>x86_64 (AVX-512 / VT-x)</span>
                  <span className="text-[10px] font-mono">310ns</span>
                </button>
                <button
                  onClick={() => handleToggleArch('arm64')}
                  className={`w-full flex items-center justify-between p-2 rounded text-left transition-colors mt-1 ${
                    arch === 'arm64' ? 'bg-purple-600 text-white font-bold' : 'hover:bg-slate-900 text-slate-300'
                  }`}
                >
                  <span>ARM64 (ARMv9 / GICv3)</span>
                  <span className="text-[10px] font-mono">240ns</span>
                </button>
              </div>
            )}
          </div>

          {/* Language Indicator */}
          <span className="text-[11px] font-semibold text-slate-400 hover:text-slate-200 px-1 cursor-pointer">
            ENG
          </span>

          {/* Windows Security / Defender Tray Icon */}
          <button
            onClick={() => onLaunchApp('enterprise_security')}
            className="p-1 rounded-md hover:bg-slate-800/80 text-emerald-400 transition-colors"
            title="Aegis Defender EDR & Enterprise Security Center"
          >
            <ShieldCheck className="w-4 h-4" />
          </button>

          {/* Quick Settings Group Button (Wi-Fi, Volume, Battery) */}
          <button
            onClick={onToggleQuickSettings}
            className="flex items-center gap-1.5 px-2 py-1 rounded-lg hover:bg-slate-800/80 text-slate-300 transition-colors cursor-pointer"
            title="Quick Settings (Network, Sound, Battery)"
          >
            <Wifi className="w-3.5 h-3.5 text-cyan-400" />
            <Volume2 className="w-3.5 h-3.5 text-slate-300" />
            <Battery className="w-3.5 h-3.5 text-emerald-400" />
          </button>

          {/* Clock & Date Group Button -> Opens Calendar Flyout */}
          <button
            onClick={onToggleCalendar}
            className="flex flex-col items-end px-2 py-0.5 rounded-lg hover:bg-slate-800/80 cursor-pointer text-right leading-tight transition-colors"
            title="Date and Time"
          >
            <span className="text-xs font-semibold text-slate-200">{time}</span>
            <span className="text-[10px] text-slate-400">{date}</span>
          </button>

          {/* Action Center Notification Bell with Badge */}
          <button
            onClick={onToggleCalendar}
            className="relative p-1.5 rounded-lg hover:bg-slate-800/80 text-slate-400 hover:text-slate-200 transition-colors"
            title="Notification Center"
          >
            <Bell className="w-3.5 h-3.5" />
            {notificationCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 w-3.5 h-3.5 bg-blue-500 text-white rounded-full text-[9px] font-bold flex items-center justify-center">
                {notificationCount}
              </span>
            )}
          </button>

          {/* Windows "Show Desktop" peek slice on the far right */}
          <div
            onClick={onMinimizeAll}
            className="w-1.5 h-7 hover:bg-slate-700/60 rounded-xs cursor-pointer border-l border-slate-800 ml-1 transition-colors"
            title="Show desktop"
          />
        </div>
      </div>
    </>
  );
}
