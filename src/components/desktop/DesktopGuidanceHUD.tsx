import React, { useState } from 'react';
import {
  Compass,
  Sparkles,
  Keyboard,
  Play,
  BookOpen,
  ChevronRight,
  ChevronLeft,
  X,
  Minimize2,
  Maximize2,
  CheckCircle2,
  HelpCircle,
  Laptop,
  Layers,
  Terminal,
  Activity,
  Folder,
  Shield
} from 'lucide-react';

interface DesktopGuidanceHUDProps {
  onLaunchApp: (appId: string) => void;
  onOpenRun?: () => void;
  isTourActive: boolean;
  onCloseTour: () => void;
  onStartTour: () => void;
}

export default function DesktopGuidanceHUD({
  onLaunchApp,
  onOpenRun,
  isTourActive,
  onCloseTour,
  onStartTour
}: DesktopGuidanceHUDProps) {
  const [isMinimized, setIsMinimized] = useState(false);
  const [currentTourStep, setCurrentTourStep] = useState(0);
  const [showQuickShortcuts, setShowQuickShortcuts] = useState(false);

  const TOUR_STEPS = [
    {
      title: 'Welcome to Windows 11 Build Desktop Guidance',
      desc: 'This environment acts as an authentic Windows 11 24H2 Enterprise desktop build powered by the AegisNT microkernel. Take this quick 6-step interactive tour to learn how to navigate, run apps, and configure the OS.',
      highlight: 'desktop-center',
      actionLabel: 'Explore Pinned Apps',
      actionAppId: 'dev_docs'
    },
    {
      title: '1. Centered Taskbar & Windows Start Menu',
      desc: 'Click the Windows icon on the taskbar or press the Win key. The Start Menu gives you instant access to pinned productivity apps (LibreOffice, Terminal, Resmon), system utilities, and quick power options.',
      highlight: 'taskbar-start',
      actionLabel: 'Open Start Menu Apps',
      actionAppId: 'settings'
    },
    {
      title: '2. Running Custom Apps & Win32 PE Binaries',
      desc: 'You can execute native PE .exe files, compile code with GCC/Clang or Rust in the Terminal, and leverage the Wine 9.x NT subsystem to run existing Windows desktop software.',
      highlight: 'desktop-apps',
      actionLabel: 'Open Win32 API Subsystem',
      actionAppId: 'win32_api'
    },
    {
      title: '3. Windows 11 Snap Layouts & Multitasking',
      desc: 'Hover over the maximize button (square) on any application window or press Win+Z to snap windows into 2-column halves, 3-column splits, or 4-corner grids with zero window jitter.',
      highlight: 'window-controls',
      actionLabel: 'View Snap Simulator',
      actionAppId: 'win11_guidance'
    },
    {
      title: '4. System Tray, Architecture Switcher & Settings',
      desc: 'On the right side of the taskbar, check real-time network, volume, ACPI battery status, and toggle between x86_64 and ARM64 architecture execution via the live HAL badge.',
      highlight: 'system-tray',
      actionLabel: 'Open Quick Settings',
      actionAppId: 'resource_monitor'
    },
    {
      title: '5. Virtual Machine & Bare-Metal Laptop Guidance',
      desc: 'Deploy this build inside QEMU/KVM, VMware, or VirtualBox using UEFI OVMF and TPM 2.0. On physical laptops, Modern Standby S0ix and dynamic refresh rate (DRR) are fully supported.',
      highlight: 'vm-boot',
      actionLabel: 'Open VM Boot Guide',
      actionAppId: 'vm_boot_guide'
    }
  ];

  return (
    <>
      {/* 1. FLOATING DESKTOP GUIDANCE CARD / HUD (Docked on Top-Right of Desktop) */}
      {!isTourActive && (
        <div className="absolute top-4 right-4 z-20 pointer-events-auto select-none transition-all duration-300">
          {isMinimized ? (
            /* Minimized Pill Badge */
            <button
              onClick={() => setIsMinimized(false)}
              className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-900/90 hover:bg-slate-800/95 border border-blue-500/40 text-blue-300 text-xs font-medium shadow-2xl backdrop-blur-xl group transition-all hover:scale-105 active:scale-95"
            >
              <Compass className="w-3.5 h-3.5 text-blue-400 group-hover:rotate-45 transition-transform" />
              <span>Windows 11 Desktop Guidance</span>
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            </button>
          ) : (
            /* Expanded Guidance Card */
            <div className="w-84 max-w-[90vw] bg-slate-900/95 border border-slate-700/80 rounded-2xl shadow-2xl backdrop-blur-2xl p-3.5 text-slate-100 flex flex-col gap-2.5 animate-in fade-in slide-in-from-top-2 duration-200">
              {/* Header */}
              <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-blue-600/20 border border-blue-500/40 text-blue-400 flex items-center justify-center">
                    <Compass className="w-4 h-4 animate-pulse" />
                  </div>
                  <div>
                    <h3 className="text-xs font-bold text-white flex items-center gap-1.5">
                      Windows 11 Build Guidance
                    </h3>
                    <p className="text-[10px] text-blue-300 font-mono">
                      Build 26100.1882 • Enterprise 24H2
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-1 text-slate-400">
                  <button
                    onClick={() => setIsMinimized(true)}
                    className="p-1 rounded hover:bg-slate-800 hover:text-white transition-colors"
                    title="Minimize Guidance Card"
                  >
                    <Minimize2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Quick Guidance Actions */}
              <div className="grid grid-cols-2 gap-2 text-xs">
                <button
                  onClick={onStartTour}
                  className="p-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-medium flex items-center gap-1.5 shadow transition-all hover:scale-[1.02] active:scale-95"
                >
                  <Sparkles className="w-3.5 h-3.5 text-blue-200" />
                  <span className="text-[11px]">Start UI Tour</span>
                </button>

                <button
                  onClick={() => onLaunchApp('win11_guidance')}
                  className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-medium flex items-center gap-1.5 border border-slate-700 transition-all"
                >
                  <BookOpen className="w-3.5 h-3.5 text-cyan-400" />
                  <span className="text-[11px]">Guidance App</span>
                </button>

                <button
                  onClick={() => setShowQuickShortcuts(!showQuickShortcuts)}
                  className="p-2 rounded-xl bg-slate-800/80 hover:bg-slate-700/80 text-slate-300 font-medium flex items-center gap-1.5 border border-slate-700/60 transition-all"
                >
                  <Keyboard className="w-3.5 h-3.5 text-purple-400" />
                  <span className="text-[11px]">Hotkeys HUD</span>
                </button>

                <button
                  onClick={() => onLaunchApp('vm_boot_guide')}
                  className="p-2 rounded-xl bg-slate-800/80 hover:bg-slate-700/80 text-slate-300 font-medium flex items-center gap-1.5 border border-slate-700/60 transition-all"
                >
                  <Laptop className="w-3.5 h-3.5 text-indigo-400" />
                  <span className="text-[11px]">VM Boot Setup</span>
                </button>

                <button
                  onClick={() => onLaunchApp('enterprise_security')}
                  className="col-span-2 p-2 rounded-xl bg-emerald-950/40 hover:bg-emerald-900/40 text-emerald-300 font-medium flex items-center justify-center gap-1.5 border border-emerald-600/40 transition-all"
                >
                  <Shield className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="text-[11px]">Enterprise Security, Docker & Hotpatches</span>
                </button>
              </div>

              {/* Quick Shortcuts Popover */}
              {showQuickShortcuts && (
                <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-[11px] space-y-1.5 animate-in fade-in">
                  <div className="flex items-center justify-between text-[10px] text-slate-400 uppercase font-bold">
                    <span>Essential Shortcuts</span>
                    <button
                      onClick={() => setShowQuickShortcuts(false)}
                      className="text-slate-500 hover:text-white"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                  <div className="flex justify-between text-slate-300 font-mono">
                    <span>Win + R</span>
                    <span className="text-slate-400 font-sans">Run Dialog</span>
                  </div>
                  <div className="flex justify-between text-slate-300 font-mono">
                    <span>Win + E</span>
                    <span className="text-slate-400 font-sans">File Explorer</span>
                  </div>
                  <div className="flex justify-between text-slate-300 font-mono">
                    <span>Win + Z</span>
                    <span className="text-slate-400 font-sans">Snap Layouts</span>
                  </div>
                  <div className="flex justify-between text-slate-300 font-mono">
                    <span>Ctrl+Shift+Esc</span>
                    <span className="text-slate-400 font-sans">Task Manager</span>
                  </div>
                </div>
              )}

              {/* Quick Tip Carousel Footer */}
              <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-[10px] text-slate-400">
                <span className="truncate">Hover maximize button on any app to Snap</span>
                <span className="text-blue-400 font-medium cursor-pointer hover:underline" onClick={() => onLaunchApp('win11_guidance')}>
                  Docs →
                </span>
              </div>
            </div>
          )}
        </div>
      )}

      {/* 2. INTERACTIVE STEP-BY-STEP DESKTOP TOUR MODAL */}
      {isTourActive && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4 select-none animate-in fade-in duration-200">
          <div className="w-full max-w-lg bg-slate-900/98 border border-slate-700 rounded-3xl shadow-2xl p-6 text-slate-100 flex flex-col gap-5">
            {/* Tour Step Header */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-blue-600/20 text-blue-400 border border-blue-500/30 flex items-center justify-center">
                  <Compass className="w-5 h-5 animate-spin duration-3000" />
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold tracking-wider text-blue-400">
                    Step {currentTourStep + 1} of {TOUR_STEPS.length}
                  </span>
                  <h2 className="text-base font-bold text-white">
                    {TOUR_STEPS[currentTourStep].title}
                  </h2>
                </div>
              </div>

              <button
                onClick={onCloseTour}
                className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
                title="Exit Tour"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Tour Step Description */}
            <p className="text-xs text-slate-300 leading-relaxed">
              {TOUR_STEPS[currentTourStep].desc}
            </p>

            {/* Step Action Button */}
            <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 flex items-center justify-between">
              <span className="text-xs text-slate-400">Try feature in this step:</span>
              <button
                onClick={() => {
                  if (TOUR_STEPS[currentTourStep].actionAppId) {
                    onLaunchApp(TOUR_STEPS[currentTourStep].actionAppId);
                  }
                  onCloseTour();
                }}
                className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold flex items-center gap-1.5 shadow transition-all hover:scale-105 active:scale-95"
              >
                <Play className="w-3.5 h-3.5" />
                <span>{TOUR_STEPS[currentTourStep].actionLabel}</span>
              </button>
            </div>

            {/* Tour Navigation Controls */}
            <div className="flex items-center justify-between pt-2 border-t border-slate-800">
              {/* Dots */}
              <div className="flex items-center gap-1.5">
                {TOUR_STEPS.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrentTourStep(i)}
                    className={`h-2 rounded-full transition-all ${
                      currentTourStep === i
                        ? 'w-6 bg-blue-500'
                        : 'w-2 bg-slate-700 hover:bg-slate-600'
                    }`}
                  />
                ))}
              </div>

              {/* Prev / Next Buttons */}
              <div className="flex items-center gap-2">
                <button
                  disabled={currentTourStep === 0}
                  onClick={() => setCurrentTourStep((prev) => Math.max(0, prev - 1))}
                  className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 disabled:opacity-40 disabled:hover:bg-slate-800 text-slate-200 text-xs font-medium flex items-center gap-1"
                >
                  <ChevronLeft className="w-3.5 h-3.5" />
                  <span>Previous</span>
                </button>

                {currentTourStep < TOUR_STEPS.length - 1 ? (
                  <button
                    onClick={() => setCurrentTourStep((prev) => Math.min(TOUR_STEPS.length - 1, prev + 1))}
                    className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-medium flex items-center gap-1 shadow"
                  >
                    <span>Next</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                ) : (
                  <button
                    onClick={() => {
                      onLaunchApp('win11_guidance');
                      onCloseTour();
                    }}
                    className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-medium flex items-center gap-1 shadow"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Complete & Open Guidance</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
