import React, { useState } from 'react';
import {
  Compass,
  Layout,
  Layers,
  Cpu,
  Terminal,
  Server,
  Laptop,
  Keyboard,
  Sliders,
  CheckCircle2,
  Copy,
  Check,
  ExternalLink,
  Sparkles,
  Search,
  Monitor,
  Zap,
  Shield,
  Palette,
  Maximize2,
  Play,
  HelpCircle,
  HardDrive,
  FileCode,
  ArrowRight,
  Flame,
  RefreshCw,
  Lock,
  ShieldCheck,
  Activity,
  Globe,
  Box,
  GitBranch,
  Share2,
  BookOpen
} from 'lucide-react';

interface Win11GuidanceAppProps {
  onLaunchApp?: (appId: string) => void;
  onStartTour?: () => void;
  onToggleAlignment?: () => void;
}

export default function Win11GuidanceApp({
  onLaunchApp,
  onStartTour,
  onToggleAlignment
}: Win11GuidanceAppProps) {
  const [activeTab, setActiveTab] = useState<
    'tour' | 'architecture' | 'running_apps' | 'vm_laptop' | 'shortcuts' | 'personalization' | 'enterprise_security' | 'github_preview'
  >('tour');
  const [searchQuery, setSearchQuery] = useState('');
  const [copiedSnippet, setCopiedSnippet] = useState<string | null>(null);
  const [activeSnapPreview, setActiveSnapPreview] = useState<'2-split' | '3-col' | '4-grid' | 'left-focus'>('2-split');
  const [selectedAppTest, setSelectedAppTest] = useState<string>('hello_world');
  const [previewLaptopMode, setPreviewLaptopMode] = useState<'browser' | 'powershell' | 'docker' | 'hyperv'>('browser');

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedSnippet(id);
    setTimeout(() => setCopiedSnippet(null), 2000);
  };

  const SHORTCUTS = [
    { key: 'Win + S / Win + Q', action: 'Open Search / Windows Start Menu', cat: 'Navigation' },
    { key: 'Win + R', action: 'Open Run Dialog (Launch apps, commands, devdocs)', cat: 'System' },
    { key: 'Win + E', action: 'Open File Explorer (Browse C:\\, AegisFS, Docs)', cat: 'Files' },
    { key: 'Win + X', action: 'Open Quick Link Power User Menu', cat: 'System' },
    { key: 'Win + A', action: 'Open Action Center / Quick Settings (Wi-Fi, Sound)', cat: 'System' },
    { key: 'Win + N', action: 'Open Calendar & Notification Flyout', cat: 'System' },
    { key: 'Win + D', action: 'Minimize all windows / Show Desktop toggle', cat: 'Desktop' },
    { key: 'Win + L', action: 'Lock current workstation session', cat: 'Security' },
    { key: 'Win + Z', action: 'Trigger Windows 11 Snap Layouts flyout', cat: 'Multitasking' },
    { key: 'Alt + Tab', action: 'Switch between active applications', cat: 'Multitasking' },
    { key: 'Ctrl + Shift + Esc', action: 'Open Task Manager Enterprise directly', cat: 'Diagnostics' },
    { key: 'F5', action: 'Refresh Desktop icons and filesystem cache', cat: 'Desktop' },
  ];

  const filteredShortcuts = SHORTCUTS.filter(
    (s) =>
      s.key.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.action.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.cat.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex flex-col h-full bg-slate-950 text-slate-100 font-sans select-none overflow-hidden">
      {/* Top Windows 11 Header Banner */}
      <div className="bg-gradient-to-r from-blue-950/80 via-slate-900 to-indigo-950/80 border-b border-slate-800 p-4 flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-cyan-400 p-2 shadow-lg shadow-blue-500/20 flex items-center justify-center text-white">
            <Compass className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-base font-bold text-white tracking-wide">
                Windows 11 Build Desktop Guidance
              </h1>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-blue-500/20 text-blue-300 border border-blue-400/30">
                Build 26100.1882 Enterprise 24H2
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Official interactive tour, architecture walkthrough, app execution manual, and VM/laptop guidance
            </p>
          </div>
        </div>

        {/* Header Actions */}
        <div className="flex items-center gap-2">
          {onStartTour && (
            <button
              onClick={onStartTour}
              className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-medium flex items-center gap-1.5 shadow-md shadow-blue-600/30 transition-all hover:scale-[1.02] active:scale-95"
            >
              <Sparkles className="w-3.5 h-3.5 text-blue-200" />
              <span>Interactive Desktop Tour</span>
            </button>
          )}

          {onLaunchApp && (
            <button
              onClick={() => onLaunchApp('dev_docs')}
              className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 text-xs font-medium flex items-center gap-1.5 transition-all"
            >
              <FileCode className="w-3.5 h-3.5 text-cyan-400" />
              <span>Developer Specs</span>
            </button>
          )}
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-slate-900/90 border-b border-slate-800/80 px-4 flex items-center gap-1 overflow-x-auto scrollbar-thin">
        {[
          { id: 'tour', label: 'Desktop Tour & UI', icon: Layout },
          { id: 'enterprise_security', label: 'Enterprise Security, Docker & Firewall', icon: Shield },
          { id: 'github_preview', label: 'GitHub & Windows Preview', icon: GitBranch },
          { id: 'architecture', label: 'Build Architecture & DWM', icon: Layers },
          { id: 'running_apps', label: 'Running Custom Apps', icon: Play },
          { id: 'vm_laptop', label: 'VM & Laptop Setup', icon: Laptop },
          { id: 'shortcuts', label: 'Keyboard Shortcuts HUD', icon: Keyboard },
          { id: 'personalization', label: 'Desktop Customization', icon: Sliders },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-3.5 py-2.5 text-xs font-medium border-b-2 transition-all whitespace-nowrap ${
                isActive
                  ? 'border-blue-500 text-blue-400 bg-blue-950/30'
                  : 'border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Main Tab Content */}
      <div className="flex-1 overflow-y-auto p-4 md:p-6 bg-slate-950/60 text-slate-200 space-y-6">
        {/* TAB 1: DESKTOP TOUR & UI */}
        {activeTab === 'tour' && (
          <div className="space-y-6 max-w-5xl mx-auto">
            {/* Quick Hero Banner */}
            <div className="p-4 rounded-xl bg-gradient-to-r from-blue-950/40 to-slate-900 border border-blue-800/40 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div>
                <h2 className="text-sm font-bold text-white flex items-center gap-2">
                  <Layout className="w-4 h-4 text-blue-400" />
                  Windows 11 Fluent Desktop Shell Overview
                </h2>
                <p className="text-xs text-slate-400 mt-1 max-w-2xl leading-relaxed">
                  The Windows 11 Build desktop delivers an authentic Fluent Design experience featuring a centered taskbar,
                  Mica frosted acrylic backdrops, Snap Layouts for multitasking, system flyouts, and native NT subsystem integration.
                </p>
              </div>
              <div className="flex items-center gap-2">
                {onStartTour && (
                  <button
                    onClick={onStartTour}
                    className="px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold rounded-lg shadow flex items-center gap-1.5"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    Launch Desktop Highlight Tour
                  </button>
                )}
              </div>
            </div>

            {/* Desktop Elements Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {/* Element 1: Centered Taskbar & Start Menu */}
              <div className="p-4 rounded-xl bg-slate-900/70 border border-slate-800 hover:border-blue-500/50 transition-all flex flex-col justify-between">
                <div>
                  <div className="w-8 h-8 rounded-lg bg-blue-600/20 text-blue-400 border border-blue-500/30 flex items-center justify-center mb-3">
                    <Layout className="w-4 h-4" />
                  </div>
                  <h3 className="text-sm font-semibold text-white">Centered Taskbar & Start Menu</h3>
                  <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                    Designed for ergonomic reach on widescreen monitors and laptops. Press <code className="px-1 py-0.5 bg-slate-800 text-blue-300 rounded font-mono text-[10px]">Win</code> or click the Windows icon to browse pinned apps, search utilities, and access power controls.
                  </p>
                </div>
                <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between">
                  <span className="text-[11px] text-slate-500 font-mono">Shell: explorer.exe</span>
                  {onLaunchApp && (
                    <button
                      onClick={() => onLaunchApp('settings')}
                      className="text-xs text-blue-400 hover:text-blue-300 font-medium flex items-center gap-1"
                    >
                      Taskbar Settings <ArrowRight className="w-3 h-3" />
                    </button>
                  )}
                </div>
              </div>

              {/* Element 2: Snap Layouts & Multitasking */}
              <div className="p-4 rounded-xl bg-slate-900/70 border border-slate-800 hover:border-cyan-500/50 transition-all flex flex-col justify-between">
                <div>
                  <div className="w-8 h-8 rounded-lg bg-cyan-600/20 text-cyan-400 border border-cyan-500/30 flex items-center justify-center mb-3">
                    <Maximize2 className="w-4 h-4" />
                  </div>
                  <h3 className="text-sm font-semibold text-white">Windows 11 Snap Layouts</h3>
                  <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                    Hover over any window's maximize button or press <code className="px-1 py-0.5 bg-slate-800 text-cyan-300 rounded font-mono text-[10px]">Win+Z</code> to select 2-column split, 3-column triage, or 4-quadrant arrangements for instant productivity.
                  </p>
                </div>
                <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between">
                  <span className="text-[11px] text-slate-500 font-mono">DWM Snap Assist</span>
                  <span className="text-[11px] text-cyan-400 font-medium">Built-in to all windows</span>
                </div>
              </div>

              {/* Element 3: Action Center & Quick Settings */}
              <div className="p-4 rounded-xl bg-slate-900/70 border border-slate-800 hover:border-emerald-500/50 transition-all flex flex-col justify-between">
                <div>
                  <div className="w-8 h-8 rounded-lg bg-emerald-600/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center mb-3">
                    <Zap className="w-4 h-4" />
                  </div>
                  <h3 className="text-sm font-semibold text-white">Action Center & System Tray</h3>
                  <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                    Click the Wi-Fi/Volume cluster on the bottom right (<code className="px-1 py-0.5 bg-slate-800 text-emerald-300 rounded font-mono text-[10px]">Win+A</code>) to toggle networking, volume, brightness, airplane mode, and ACPI battery states.
                  </p>
                </div>
                <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between">
                  <span className="text-[11px] text-slate-500 font-mono">Flyouts: QuickSettings</span>
                  <span className="text-[11px] text-emerald-400 font-medium">Interactive Flyout</span>
                </div>
              </div>

              {/* Element 4: Windows Terminal & PowerShell */}
              <div className="p-4 rounded-xl bg-slate-900/70 border border-slate-800 hover:border-purple-500/50 transition-all flex flex-col justify-between">
                <div>
                  <div className="w-8 h-8 rounded-lg bg-purple-600/20 text-purple-400 border border-purple-500/30 flex items-center justify-center mb-3">
                    <Terminal className="w-4 h-4" />
                  </div>
                  <h3 className="text-sm font-semibold text-white">Windows Terminal & Console</h3>
                  <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                    A modern multi-tab terminal suite supporting PowerShell 7, Command Prompt (cmd.exe), OpenSSH remote admin, WinRM orchestration, and direct NT kernel debugging commands.
                  </p>
                </div>
                <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between">
                  <span className="text-[11px] text-slate-500 font-mono">wt.exe / pwsh.exe</span>
                  {onLaunchApp && (
                    <button
                      onClick={() => onLaunchApp('terminal')}
                      className="text-xs text-purple-400 hover:text-purple-300 font-medium flex items-center gap-1"
                    >
                      Open Terminal <ArrowRight className="w-3 h-3" />
                    </button>
                  )}
                </div>
              </div>

              {/* Element 5: File Explorer & AegisFS */}
              <div className="p-4 rounded-xl bg-slate-900/70 border border-slate-800 hover:border-amber-500/50 transition-all flex flex-col justify-between">
                <div>
                  <div className="w-8 h-8 rounded-lg bg-amber-600/20 text-amber-400 border border-amber-500/30 flex items-center justify-center mb-3">
                    <HardDrive className="w-4 h-4" />
                  </div>
                  <h3 className="text-sm font-semibold text-white">File Explorer & Volume Vault</h3>
                  <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                    Modern tabbed explorer supporting BitLocker AES-XTS-256 encrypted drives, Quick Access shortcuts, documentation viewer, and system logs folder (<code className="px-1 py-0.5 bg-slate-800 text-amber-300 rounded font-mono text-[10px]">C:\KernelLogs</code>).
                  </p>
                </div>
                <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between">
                  <span className="text-[11px] text-slate-500 font-mono">Win + E</span>
                  {onLaunchApp && (
                    <button
                      onClick={() => onLaunchApp('file_explorer')}
                      className="text-xs text-amber-400 hover:text-amber-300 font-medium flex items-center gap-1"
                    >
                      Browse Files <ArrowRight className="w-3 h-3" />
                    </button>
                  )}
                </div>
              </div>

              {/* Element 6: Task Manager & Diagnostics */}
              <div className="p-4 rounded-xl bg-slate-900/70 border border-slate-800 hover:border-rose-500/50 transition-all flex flex-col justify-between">
                <div>
                  <div className="w-8 h-8 rounded-lg bg-rose-600/20 text-rose-400 border border-rose-500/30 flex items-center justify-center mb-3">
                    <Shield className="w-4 h-4" />
                  </div>
                  <h3 className="text-sm font-semibold text-white">Task Manager & Resource Monitor</h3>
                  <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                    Live telemetry across CPU threads, DDR5 ECC memory, NVMe 2.0 IOPS, and GPU compute queues. Integrated Windows Event Log viewer for troubleshooting security and hardware events.
                  </p>
                </div>
                <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between">
                  <span className="text-[11px] text-slate-500 font-mono">Ctrl+Shift+Esc</span>
                  {onLaunchApp && (
                    <button
                      onClick={() => onLaunchApp('resource_monitor')}
                      className="text-xs text-rose-400 hover:text-rose-300 font-medium flex items-center gap-1"
                    >
                      Open Resmon <ArrowRight className="w-3 h-3" />
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Interactive Snap Layouts Demo Visualizer */}
            <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
                <div>
                  <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    <Maximize2 className="w-4 h-4 text-cyan-400" />
                    Interactive Windows 11 Snap Assist Layout Simulator
                  </h3>
                  <p className="text-xs text-slate-400">
                    Click any layout preset below to see how Windows 11 organizes multiple windows on your desktop:
                  </p>
                </div>
                <div className="flex items-center gap-1.5 bg-slate-950 p-1 rounded-lg border border-slate-800">
                  {(['2-split', '3-col', '4-grid', 'left-focus'] as const).map((mode) => (
                    <button
                      key={mode}
                      onClick={() => setActiveSnapPreview(mode)}
                      className={`px-2.5 py-1 rounded text-xs capitalize transition-colors ${
                        activeSnapPreview === mode
                          ? 'bg-blue-600 text-white font-medium'
                          : 'text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      {mode}
                    </button>
                  ))}
                </div>
              </div>

              {/* Layout Preview Container */}
              <div className="w-full h-48 rounded-xl bg-slate-950 border border-slate-800 p-2 relative flex gap-2">
                {activeSnapPreview === '2-split' && (
                  <>
                    <div className="flex-1 bg-blue-900/20 border-2 border-blue-500/60 rounded-lg flex flex-col items-center justify-center text-center p-3 animate-in fade-in">
                      <span className="text-xs font-semibold text-blue-300">Left 50% Half</span>
                      <span className="text-[10px] text-slate-400 mt-1">Primary App (e.g. Visual Studio / Terminal)</span>
                    </div>
                    <div className="flex-1 bg-cyan-900/20 border-2 border-cyan-500/60 rounded-lg flex flex-col items-center justify-center text-center p-3 animate-in fade-in">
                      <span className="text-xs font-semibold text-cyan-300">Right 50% Half</span>
                      <span className="text-[10px] text-slate-400 mt-1">Secondary App (e.g. File Explorer / Browser)</span>
                    </div>
                  </>
                )}

                {activeSnapPreview === '3-col' && (
                  <>
                    <div className="flex-1 bg-blue-900/20 border-2 border-blue-500/60 rounded-lg flex flex-col items-center justify-center text-center p-2 animate-in fade-in">
                      <span className="text-xs font-semibold text-blue-300">Col 1 (33%)</span>
                      <span className="text-[9px] text-slate-400 mt-1">Chat / Docs</span>
                    </div>
                    <div className="flex-1 bg-indigo-900/20 border-2 border-indigo-500/60 rounded-lg flex flex-col items-center justify-center text-center p-2 animate-in fade-in">
                      <span className="text-xs font-semibold text-indigo-300">Col 2 (33%)</span>
                      <span className="text-[9px] text-slate-400 mt-1">Main Code Editor</span>
                    </div>
                    <div className="flex-1 bg-cyan-900/20 border-2 border-cyan-500/60 rounded-lg flex flex-col items-center justify-center text-center p-2 animate-in fade-in">
                      <span className="text-xs font-semibold text-cyan-300">Col 3 (33%)</span>
                      <span className="text-[9px] text-slate-400 mt-1">Live Terminal</span>
                    </div>
                  </>
                )}

                {activeSnapPreview === '4-grid' && (
                  <div className="w-full h-full grid grid-cols-2 grid-rows-2 gap-2 animate-in fade-in">
                    <div className="bg-blue-900/20 border-2 border-blue-500/60 rounded-lg flex items-center justify-center text-xs text-blue-300 font-medium">
                      Top-Left (Quadrant 1)
                    </div>
                    <div className="bg-emerald-900/20 border-2 border-emerald-500/60 rounded-lg flex items-center justify-center text-xs text-emerald-300 font-medium">
                      Top-Right (Quadrant 2)
                    </div>
                    <div className="bg-purple-900/20 border-2 border-purple-500/60 rounded-lg flex items-center justify-center text-xs text-purple-300 font-medium">
                      Bottom-Left (Quadrant 3)
                    </div>
                    <div className="bg-amber-900/20 border-2 border-amber-500/60 rounded-lg flex items-center justify-center text-xs text-amber-300 font-medium">
                      Bottom-Right (Quadrant 4)
                    </div>
                  </div>
                )}

                {activeSnapPreview === 'left-focus' && (
                  <>
                    <div className="w-2/3 bg-blue-900/20 border-2 border-blue-500/60 rounded-lg flex flex-col items-center justify-center text-center p-3 animate-in fade-in">
                      <span className="text-xs font-semibold text-blue-300">Main Focus Pane (66.6%)</span>
                      <span className="text-[10px] text-slate-400 mt-1">High-priority workload / IDE</span>
                    </div>
                    <div className="w-1/3 bg-slate-900/40 border-2 border-slate-700/60 rounded-lg flex flex-col items-center justify-center text-center p-3 animate-in fade-in">
                      <span className="text-xs font-semibold text-slate-300">Side Strip (33.3%)</span>
                      <span className="text-[10px] text-slate-400 mt-1">Telemetry & Monitoring</span>
                    </div>
                  </>
                )}
              </div>
              <p className="text-[11px] text-slate-400 mt-2 text-center">
                Tip: In AegisNT Windows 11 Build, hover over any window's square maximize button to invoke these snap regions instantly!
              </p>
            </div>
          </div>
        )}

        {/* TAB 2: BUILD ARCHITECTURE & DWM */}
        {activeTab === 'architecture' && (
          <div className="space-y-6 max-w-5xl mx-auto">
            <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800">
              <h2 className="text-sm font-bold text-white flex items-center gap-2">
                <Layers className="w-4 h-4 text-blue-400" />
                Windows 11 Build 26100 Desktop Architecture Specifications
              </h2>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                AegisNT delivers a production-grade NT microkernel desktop environment that mirrors Windows 11 24H2 (OS Build 26100.1882)
                layer-for-layer, from the hardware abstraction layer (HAL) up to the Desktop Window Manager (DWM).
              </p>
            </div>

            {/* Architecture Stack Diagram */}
            <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 font-mono text-xs">
              <div className="text-[11px] text-blue-400 font-bold uppercase tracking-wider mb-2">
                Windows 11 Build Execution Stack
              </div>
              <div className="space-y-2">
                <div className="p-2.5 rounded bg-blue-950/40 border border-blue-500/40 flex items-center justify-between">
                  <div>
                    <span className="text-blue-300 font-bold">[Ring 3] Desktop Shell Experience</span>
                    <p className="text-[10px] text-slate-400 font-sans mt-0.5">
                      explorer.exe, StartMenu.dll, TaskbarHost, WindowsTerminal.exe, LibreOffice
                    </p>
                  </div>
                  <span className="text-[10px] text-blue-400 px-2 py-0.5 bg-blue-900/50 rounded">User Mode</span>
                </div>

                <div className="p-2.5 rounded bg-indigo-950/40 border border-indigo-500/40 flex items-center justify-between">
                  <div>
                    <span className="text-indigo-300 font-bold">[Ring 3] Desktop Window Manager (DWM)</span>
                    <p className="text-[10px] text-slate-400 font-sans mt-0.5">
                      DirectX 12 / WDDM 3.2 composition pipeline, Mica material shader, Snap Assist engine
                    </p>
                  </div>
                  <span className="text-[10px] text-indigo-400 px-2 py-0.5 bg-indigo-900/50 rounded">dwm.exe</span>
                </div>

                <div className="p-2.5 rounded bg-cyan-950/40 border border-cyan-500/40 flex items-center justify-between">
                  <div>
                    <span className="text-cyan-300 font-bold">[Ring 3/0] Win32 Subsystem & Wine 9.x</span>
                    <p className="text-[10px] text-slate-400 font-sans mt-0.5">
                      win32u.dll, user32.dll, gdi32.dll, kernelbase.dll, NT syscall thunking table
                    </p>
                  </div>
                  <span className="text-[10px] text-cyan-400 px-2 py-0.5 bg-cyan-900/50 rounded">csrss.exe</span>
                </div>

                <div className="p-2.5 rounded bg-emerald-950/40 border border-emerald-500/40 flex items-center justify-between">
                  <div>
                    <span className="text-emerald-300 font-bold">[Ring 0] AegisNT Microkernel Core (ntoskrnl.exe)</span>
                    <p className="text-[10px] text-slate-400 font-sans mt-0.5">
                      Preemptive thread scheduler, VMM (PML4/PML5), Object Manager, I/O Manager, BitLocker FVE
                    </p>
                  </div>
                  <span className="text-[10px] text-emerald-400 px-2 py-0.5 bg-emerald-900/50 rounded">Kernel Mode</span>
                </div>

                <div className="p-2.5 rounded bg-amber-950/40 border border-amber-500/40 flex items-center justify-between">
                  <div>
                    <span className="text-amber-300 font-bold">[Ring 0] Drivers & HAL (Hardware Abstraction Layer)</span>
                    <p className="text-[10px] text-slate-400 font-sans mt-0.5">
                      aegis_nvme.sys, usb4_host_router.sys, aegis_wddm.sys, e1000e_net.sys, tpm2_crb.sys
                    </p>
                  </div>
                  <span className="text-[10px] text-amber-400 px-2 py-0.5 bg-amber-900/50 rounded">hal.dll</span>
                </div>

                <div className="p-2.5 rounded bg-purple-950/40 border border-purple-500/40 flex items-center justify-between">
                  <div>
                    <span className="text-purple-300 font-bold">[Ring -1 / Hardware] Hypervisor & Bare Metal</span>
                    <p className="text-[10px] text-slate-400 font-sans mt-0.5">
                      AMD-V / Intel VT-x / ARM64 EL2, KVM acceleration, UEFI OVMF Firmware, TPM 2.0
                    </p>
                  </div>
                  <span className="text-[10px] text-purple-400 px-2 py-0.5 bg-purple-900/50 rounded">Hyper-V / KVM</span>
                </div>
              </div>
            </div>

            {/* Architectural Highlights Specs */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 rounded-xl bg-slate-900/70 border border-slate-800">
                <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-blue-400" />
                  Fluent Design System 2.0 Specs
                </h4>
                <ul className="text-xs text-slate-300 space-y-2 leading-relaxed">
                  <li>• <strong className="text-white">Mica Material:</strong> Dynamic opacity that samples the underlying desktop wallpaper bloom while reducing GPU render cycles.</li>
                  <li>• <strong className="text-white">Corner Radius:</strong> 8px for standard flyouts, 12px for primary application windows, 16px for Start Menu and dialogs.</li>
                  <li>• <strong className="text-white">Drop Shadows:</strong> Multilayer ambient occlusion shadows (`shadow-2xl`) for realistic depth elevation.</li>
                  <li>• <strong className="text-white">Typography:</strong> Segoe UI Variable font metric hierarchy with optical sizing.</li>
                </ul>
              </div>

              <div className="p-4 rounded-xl bg-slate-900/70 border border-slate-800">
                <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400" />
                  WDDM 3.2 Display Pipeline
                </h4>
                <ul className="text-xs text-slate-300 space-y-2 leading-relaxed">
                  <li>• <strong className="text-white">Dynamic Refresh Rate (DRR):</strong> Automatically shifts between 60Hz and 120Hz/144Hz during window dragging and animations.</li>
                  <li>• <strong className="text-white">Hardware-Accelerated GPU Scheduling:</strong> Bypasses CPU kernel overhead for buffer swapping.</li>
                  <li>• <strong className="text-white">Subpixel Font Antialiasing:</strong> ClearType RGB rendering with gamma correction for crystal clarity.</li>
                  <li>• <strong className="text-white">Window Snapping Geometry:</strong> Vector bounds calculated at 0.05ms latency via DWM compositor.</li>
                </ul>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: RUNNING CUSTOM APPS */}
        {activeTab === 'running_apps' && (
          <div className="space-y-6 max-w-5xl mx-auto">
            <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800">
              <h2 className="text-sm font-bold text-white flex items-center gap-2">
                <Play className="w-4 h-4 text-emerald-400" />
                How to Run Your Own Applications on this Windows 11 Build
              </h2>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                Whether deploying compiled Win32 PE `.exe` binaries, running scripts via PowerShell, or building cross-platform
                tools in C++, Rust, Python, or Go, AegisNT supports multiple application execution pipelines.
              </p>
            </div>

            {/* Triple Subsystem Direct Launcher */}
            <div className="p-4 rounded-xl bg-gradient-to-r from-blue-950/60 via-purple-950/60 to-amber-950/60 border border-slate-700 flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <Layers className="w-4 h-4 text-cyan-400" />
                  Full Support: Java 21 LTS JVM, .NET 9 CoreCLR & Windows Win32/PE Subsystems
                </h3>
                <p className="text-xs text-slate-300 mt-1">
                  AegisNT includes pre-installed enterprise runtimes for OpenJDK 21, .NET 9.0 CoreCLR, and Wine 9.x WOW64.
                </p>
              </div>
              {onLaunchApp && (
                <button
                  onClick={() => onLaunchApp('app_compat')}
                  className="px-3.5 py-2 bg-cyan-600 hover:bg-cyan-500 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 shadow-lg shadow-cyan-900/40"
                >
                  <Play className="w-3.5 h-3.5 fill-current" /> Open App Compatibility Suite
                </button>
              )}
            </div>

            {/* Execution Options */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 rounded-xl bg-slate-900/70 border border-amber-900/40 hover:border-amber-600/50 transition-all">
                <span className="text-[10px] font-bold text-amber-400 uppercase tracking-wider">Pillar 1: Java (JVM)</span>
                <h3 className="text-sm font-bold text-white mt-1">Java Apps & Spring Boot</h3>
                <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                  Run standard `.jar` packages, Spring Boot microservices, JavaFX/Swing desktop tools, and Minecraft servers using OpenJDK 21 LTS with Generational ZGC.
                </p>
                <div className="mt-3 p-2 bg-slate-950 rounded font-mono text-[11px] text-amber-300">
                  java -jar app.jar
                </div>
              </div>

              <div className="p-4 rounded-xl bg-slate-900/70 border border-purple-900/40 hover:border-purple-600/50 transition-all">
                <span className="text-[10px] font-bold text-purple-400 uppercase tracking-wider">Pillar 2: .NET 9</span>
                <h3 className="text-sm font-bold text-white mt-1">.NET, WPF & ASP.NET</h3>
                <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                  Execute C#, F#, and VB.NET assemblies with RyuJIT 64-bit Dynamic PGO. Includes full WPF/WinForms compositor bridge to win32k.sys and Kestrel HTTP/3.
                </p>
                <div className="mt-3 p-2 bg-slate-950 rounded font-mono text-[11px] text-purple-300">
                  dotnet run --project App
                </div>
              </div>

              <div className="p-4 rounded-xl bg-slate-900/70 border border-blue-900/40 hover:border-blue-600/50 transition-all">
                <span className="text-[10px] font-bold text-blue-400 uppercase tracking-wider">Pillar 3: Windows PE</span>
                <h3 className="text-sm font-bold text-white mt-1">Win32, Win64 & MSI</h3>
                <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                  Run standard Windows PE32/PE32+ `.exe` files, dynamic `.dll` libraries, DirectX 11/12 via DXVK/VKD3D, and transactional `.msi` installers.
                </p>
                <div className="mt-3 p-2 bg-slate-950 rounded font-mono text-[11px] text-blue-300">
                  wine64 your_app.exe
                </div>
              </div>
            </div>

            {/* Interactive App Runner Simulator */}
            <div className="p-5 rounded-xl bg-slate-900/90 border border-slate-800">
              <h3 className="text-sm font-bold text-white mb-2 flex items-center gap-2">
                <Zap className="w-4 h-4 text-amber-400" />
                Interactive Binary & Script Execution Simulator
              </h3>
              <p className="text-xs text-slate-400 mb-4">
                Select an application type below to preview how the NT Subsystem and Wine layer process the execution call:
              </p>

              <div className="flex flex-wrap gap-2 mb-4">
                {[
                  { id: 'hello_world', label: 'C++ Win32 GUI (.exe)' },
                  { id: 'rust_cli', label: 'Rust CLI Utility' },
                  { id: 'python_script', label: 'Python Automation' },
                  { id: 'dotnet_app', label: '.NET 8 Enterprise Service' },
                ].map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setSelectedAppTest(item.id)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                      selectedAppTest === item.id
                        ? 'bg-blue-600 text-white shadow'
                        : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>

              {/* Terminal Execution Output Simulator */}
              <div className="bg-slate-950 rounded-xl border border-slate-800 p-4 font-mono text-xs">
                <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-800 text-slate-500 text-[11px]">
                  <span>PS C:\Users\Administrator\Workspace&gt;</span>
                  <span className="text-emerald-400">NT Subsystem: Ready</span>
                </div>

                {selectedAppTest === 'hello_world' && (
                  <div className="space-y-1 text-slate-300">
                    <p className="text-cyan-400">&gt; x86_64-w64-mingw32-gcc -O2 -mwindows app.c -o app.exe -luser32 -lgdi32</p>
                    <p className="text-slate-400">[Compiling] Linking user32.lib, gdi32.lib, kernel32.lib... OK</p>
                    <p className="text-cyan-400">&gt; ./app.exe</p>
                    <p className="text-emerald-400">[Kernel] NtCreateUserProcess: PID 4820 allocated, base address 0x00400000</p>
                    <p className="text-emerald-400">[DWM] CreateWindowExW registered: HWND 0x001A03F2, Mica Backdrop applied</p>
                    <p className="text-slate-200">[Win32 App] "Application window rendered successfully at 60 FPS!"</p>
                  </div>
                )}

                {selectedAppTest === 'rust_cli' && (
                  <div className="space-y-1 text-slate-300">
                    <p className="text-cyan-400">&gt; cargo build --release --target x86_64-pc-windows-msvc</p>
                    <p className="text-slate-400">Compiling aegis-telemetry v0.1.0 ... Finished release [optimized] target</p>
                    <p className="text-cyan-400">&gt; .\target\release\aegis-telemetry.exe --monitor-irql</p>
                    <p className="text-emerald-400">[AegisNT HAL] Reading APIC Timer Vector: IRQL = 0 (PASSIVE_LEVEL)</p>
                    <p className="text-slate-200">System Telemetry: 16 Logical Cores, 32GB RAM, 0 Kernel Panics recorded</p>
                  </div>
                )}

                {selectedAppTest === 'python_script' && (
                  <div className="space-y-1 text-slate-300">
                    <p className="text-cyan-400">&gt; python -m pip install psutil requests</p>
                    <p className="text-slate-400">Requirement already satisfied in C:\Program Files\Python312\lib\site-packages</p>
                    <p className="text-cyan-400">&gt; python audit_system.py</p>
                    <p className="text-emerald-400">[Audit] BitLocker Partition C:\ status: AES-XTS-256 ENCRYPTED (Locked)</p>
                    <p className="text-emerald-400">[Audit] HVCI / Hypervisor-Enforced Code Integrity: ACTIVE</p>
                    <p className="text-slate-200">[Audit] System is fully compliant with Windows 11 Enterprise security baseline</p>
                  </div>
                )}

                {selectedAppTest === 'dotnet_app' && (
                  <div className="space-y-1 text-slate-300">
                    <p className="text-cyan-400">&gt; dotnet run --configuration Release</p>
                    <p className="text-slate-400">Building .NET 8.0 Windows Desktop App...</p>
                    <p className="text-emerald-400">[CoreCLR] JIT Compilation complete in 18ms</p>
                    <p className="text-emerald-400">[WinUI 3] Initializing XAML Island controls & Fluent Theme</p>
                    <p className="text-slate-200">[Service] Enterprise listener started on http://localhost:5000</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: VM & LAPTOP SETUP */}
        {activeTab === 'vm_laptop' && (
          <div className="space-y-6 max-w-5xl mx-auto">
            <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800">
              <h2 className="text-sm font-bold text-white flex items-center gap-2">
                <Laptop className="w-4 h-4 text-indigo-400" />
                Virtual Machine & Physical Laptop Guidance
              </h2>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                Step-by-step guidance on running this Windows 11 build seamlessly inside popular hypervisors
                or configuring physical laptop hardware for optimal performance and battery life.
              </p>
            </div>

            {/* Laptop Deployment Guidance */}
            <div className="p-5 rounded-xl bg-slate-900/70 border border-slate-800">
              <h3 className="text-sm font-bold text-white mb-3 flex items-center gap-2">
                <Laptop className="w-4 h-4 text-cyan-400" />
                Physical Laptop Hardware Optimization
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                <div className="p-3 bg-slate-950 rounded-lg border border-slate-800">
                  <span className="font-semibold text-white">Modern Standby (S0ix) Support</span>
                  <p className="text-slate-400 mt-1 leading-relaxed">
                    AegisNT supports low-power ACPI idle sleep states. Laptops wake in under 500ms when opening the lid while syncing network state in the background.
                  </p>
                </div>
                <div className="p-3 bg-slate-950 rounded-lg border border-slate-800">
                  <span className="font-semibold text-white">Precision Touchpad Gestures</span>
                  <p className="text-slate-400 mt-1 leading-relaxed">
                    Supports 3-finger swipe up (Task View / Desktops), 3-finger swipe down (Minimize all), and 2-finger smooth scrolling at 120Hz.
                  </p>
                </div>
                <div className="p-3 bg-slate-950 rounded-lg border border-slate-800">
                  <span className="font-semibold text-white">Battery Saver & Thermal Profiles</span>
                  <p className="text-slate-400 mt-1 leading-relaxed">
                    Throttle CPU C-states dynamically between Performance, Balanced, and Quiet modes via the Quick Settings battery tile.
                  </p>
                </div>
                <div className="p-3 bg-slate-950 rounded-lg border border-slate-800">
                  <span className="font-semibold text-white">USB4 & Thunderbolt 4 Tunneling</span>
                  <p className="text-slate-400 mt-1 leading-relaxed">
                    Full 40 Gbps PCIe tunneling for external GPUs (eGPU) and dual 4K/60Hz display docking stations.
                  </p>
                </div>
              </div>
            </div>

            {/* Hypervisor Checklist */}
            <div className="p-5 rounded-xl bg-slate-900/70 border border-slate-800">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <Server className="w-4 h-4 text-indigo-400" />
                  Hypervisor Configuration Checklist
                </h3>
                {onLaunchApp && (
                  <button
                    onClick={() => onLaunchApp('vm_boot_guide')}
                    className="text-xs text-blue-400 hover:text-blue-300 font-medium flex items-center gap-1"
                  >
                    Open Full VM Boot Guide <ExternalLink className="w-3 h-3" />
                  </button>
                )}
              </div>

              <div className="space-y-2 text-xs">
                <div className="p-2.5 bg-slate-950 rounded-lg border border-slate-800 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                    <span><strong>UEFI OVMF Firmware:</strong> Ensure VM is set to UEFI mode (not Legacy BIOS) with Secure Boot.</span>
                  </div>
                  <span className="text-[10px] text-slate-500 font-mono">Required</span>
                </div>

                <div className="p-2.5 bg-slate-950 rounded-lg border border-slate-800 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                    <span><strong>TPM 2.0 Emulation:</strong> Enable swtpm (Linux KVM) or Virtual TPM (VMware/VirtualBox).</span>
                  </div>
                  <span className="text-[10px] text-slate-500 font-mono">Required</span>
                </div>

                <div className="p-2.5 bg-slate-950 rounded-lg border border-slate-800 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                    <span><strong>RAM & Cores:</strong> Minimum 4096 MB (4 GB) RAM and 2 vCPUs; Recommended 8 GB + 4 Cores.</span>
                  </div>
                  <span className="text-[10px] text-emerald-400 font-mono">Recommended</span>
                </div>

                <div className="p-2.5 bg-slate-950 rounded-lg border border-slate-800 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                    <span><strong>Disk Controller:</strong> Use VirtIO-SCSI or NVMe 2.0 controller for fastest disk I/O throughput.</span>
                  </div>
                  <span className="text-[10px] text-blue-400 font-mono">High Performance</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB: GITHUB REPO & WINDOWS LAPTOP PREVIEW */}
        {activeTab === 'github_preview' && (
          <div className="space-y-6 max-w-5xl mx-auto">
            {/* Header Banner */}
            <div className="p-5 rounded-xl bg-gradient-to-r from-blue-950/80 via-slate-900 to-indigo-950/80 border border-blue-500/30 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <GitBranch className="w-5 h-5 text-blue-400" />
                  <h2 className="text-base font-bold text-white">
                    Publishing to GitHub & Windows Laptop Preview Guide
                  </h2>
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-semibold">
                    Turnkey Ready
                  </span>
                </div>
                <p className="text-xs text-slate-300 mt-1.5 leading-relaxed max-w-3xl">
                  Step-by-step instructions to create a public GitHub repository, deploy a live public web preview, and run/preview this Windows 11 enterprise build on any Windows laptop (Surface, ThinkPad, Dell, HP).
                </p>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={() => {
                    if (!document.fullscreenElement) {
                      document.documentElement.requestFullscreen().catch(() => {});
                    } else {
                      document.exitFullscreen().catch(() => {});
                    }
                  }}
                  className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-medium flex items-center gap-1.5 shadow transition-all hover:scale-105 active:scale-95"
                >
                  <Maximize2 className="w-3.5 h-3.5" />
                  <span>Toggle F11 Fullscreen</span>
                </button>
                {onLaunchApp && (
                  <button
                    onClick={() => onLaunchApp('dev_docs')}
                    className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 text-xs font-medium flex items-center gap-1.5 transition-all"
                  >
                    <BookOpen className="w-3.5 h-3.5 text-cyan-400" />
                    <span>View Docs</span>
                  </button>
                )}
              </div>
            </div>

            {/* PART 1: MAKE IT A GITHUB REPO & PUBLICLY AVAILABLE */}
            <div className="p-5 rounded-xl bg-slate-900/80 border border-slate-800 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-slate-800 border border-slate-700 flex items-center justify-center text-white font-mono font-bold text-sm">
                    1
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-white flex items-center gap-2">
                      <GitBranch className="w-4 h-4 text-blue-400" />
                      Create GitHub Repository & Publish Publicly
                    </h3>
                    <p className="text-xs text-slate-400">Initialize git, push to GitHub, and enable public hosting</p>
                  </div>
                </div>
                <span className="text-[11px] font-mono text-cyan-400 bg-cyan-950/60 border border-cyan-800/40 px-2.5 py-1 rounded-md">
                  Git 2.40+ / GitHub CLI
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-1">
                {/* Step 1.1 */}
                <div className="p-3.5 bg-slate-950 rounded-xl border border-slate-800/80 flex flex-col justify-between">
                  <div>
                    <span className="text-[10px] font-mono uppercase tracking-wider text-blue-400 font-bold">Step 1.1</span>
                    <h4 className="text-xs font-bold text-white mt-1">Initialize Local Git</h4>
                    <p className="text-[11px] text-slate-400 mt-1">Prepare commits while `.gitignore` filters build artifacts.</p>
                  </div>
                  <div className="mt-3 relative">
                    <pre className="p-2 bg-slate-900 rounded font-mono text-[10px] text-cyan-300 overflow-x-auto">
{`git init
git add .
git commit -m "feat: initial commit of AegisNT"`}
                    </pre>
                    <button
                      onClick={() => copyToClipboard('git init\ngit add .\ngit commit -m "feat: initial commit of AegisNT Enterprise OS"', 'git-init')}
                      className="absolute top-1.5 right-1.5 px-1.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-[10px] text-slate-300 flex items-center gap-1"
                    >
                      {copiedSnippet === 'git-init' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                    </button>
                  </div>
                </div>

                {/* Step 1.2 */}
                <div className="p-3.5 bg-slate-950 rounded-xl border border-slate-800/80 flex flex-col justify-between">
                  <div>
                    <span className="text-[10px] font-mono uppercase tracking-wider text-indigo-400 font-bold">Step 1.2</span>
                    <h4 className="text-xs font-bold text-white mt-1">Create Public Repo on GitHub</h4>
                    <p className="text-[11px] text-slate-400 mt-1">Create on github.com/new or with GitHub CLI (`gh`).</p>
                  </div>
                  <div className="mt-3 relative">
                    <pre className="p-2 bg-slate-900 rounded font-mono text-[10px] text-indigo-300 overflow-x-auto">
{`gh repo create aegisnt-os \\
  --public --source=. \\
  --remote=origin --push`}
                    </pre>
                    <button
                      onClick={() => copyToClipboard('gh repo create aegisnt-enterprise-os --public --source=. --remote=origin --push', 'gh-cli')}
                      className="absolute top-1.5 right-1.5 px-1.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-[10px] text-slate-300 flex items-center gap-1"
                    >
                      {copiedSnippet === 'gh-cli' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                    </button>
                  </div>
                </div>

                {/* Step 1.3 */}
                <div className="p-3.5 bg-slate-950 rounded-xl border border-slate-800/80 flex flex-col justify-between">
                  <div>
                    <span className="text-[10px] font-mono uppercase tracking-wider text-emerald-400 font-bold">Step 1.3</span>
                    <h4 className="text-xs font-bold text-white mt-1">Link & Push Code</h4>
                    <p className="text-[11px] text-slate-400 mt-1">Push your local commits to your GitHub remote repository.</p>
                  </div>
                  <div className="mt-3 relative">
                    <pre className="p-2 bg-slate-900 rounded font-mono text-[10px] text-emerald-300 overflow-x-auto">
{`git branch -M main
git remote add origin <URL>
git push -u origin main`}
                    </pre>
                    <button
                      onClick={() => copyToClipboard('git branch -M main\ngit remote add origin https://github.com/YOUR-USERNAME/aegisnt-enterprise-os.git\ngit push -u origin main', 'git-push')}
                      className="absolute top-1.5 right-1.5 px-1.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-[10px] text-slate-300 flex items-center gap-1"
                    >
                      {copiedSnippet === 'git-push' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                    </button>
                  </div>
                </div>
              </div>

              {/* Public Hosting Methods */}
              <div className="p-4 bg-slate-950/70 rounded-xl border border-slate-800/80 space-y-3">
                <h4 className="text-xs font-bold text-white flex items-center gap-2">
                  <Globe className="w-3.5 h-3.5 text-cyan-400" />
                  Free Public Hosting Options (Live Preview for Users):
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
                  <div className="p-3 bg-slate-900/80 rounded-lg border border-slate-800">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-bold text-white">GitHub Pages (CI/CD)</span>
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-blue-900/60 text-blue-300 font-mono">Workflow Included</span>
                    </div>
                    <p className="text-[11px] text-slate-400 leading-relaxed">
                      This repo contains <code className="text-cyan-300">.github/workflows/deploy.yml</code>. In your GitHub repo: Settings &gt; Pages &gt; select "GitHub Actions" to get a live URL!
                    </p>
                  </div>

                  <div className="p-3 bg-slate-900/80 rounded-lg border border-slate-800">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-bold text-white">Vercel / Netlify</span>
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-900/60 text-emerald-300 font-mono">1-Click Import</span>
                    </div>
                    <p className="text-[11px] text-slate-400 leading-relaxed">
                      Import your GitHub repository on Vercel or Netlify. Build command is <code className="text-cyan-300">npm run build</code>, output directory is <code className="text-cyan-300">dist</code>.
                    </p>
                  </div>

                  <div className="p-3 bg-slate-900/80 rounded-lg border border-slate-800">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-bold text-white">AI Studio Live Share</span>
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-purple-900/60 text-purple-300 font-mono">Instant Now</span>
                    </div>
                    <p className="text-[11px] text-slate-400 leading-relaxed">
                      Share the live cloud preview URL directly with enterprise stakeholders with zero deployment delays or setup.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* PART 2: HOW TO PREVIEW THIS OS ON A WINDOWS LAPTOP */}
            <div className="p-5 rounded-xl bg-slate-900/80 border border-slate-800 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-blue-600/30 border border-blue-500/40 flex items-center justify-center text-blue-300 font-mono font-bold text-sm">
                    2
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-white flex items-center gap-2">
                      <Laptop className="w-4 h-4 text-cyan-400" />
                      Previewing this OS on a Windows Laptop
                    </h3>
                    <p className="text-xs text-slate-400">Choose your preferred testing environment on Windows 10/11</p>
                  </div>
                </div>

                {/* Sub-mode selector */}
                <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-lg border border-slate-800 text-xs">
                  {[
                    { id: 'browser', label: '1. Web & Fullscreen (F11)', icon: Monitor },
                    { id: 'powershell', label: '2. PowerShell / Local', icon: Terminal },
                    { id: 'docker', label: '3. Docker Desktop', icon: Box },
                    { id: 'hyperv', label: '4. Hyper-V / VM', icon: Server },
                  ].map((mode) => {
                    const ModeIcon = mode.icon;
                    return (
                      <button
                        key={mode.id}
                        onClick={() => setPreviewLaptopMode(mode.id as any)}
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md font-medium transition-all ${
                          previewLaptopMode === mode.id
                            ? 'bg-blue-600 text-white shadow'
                            : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
                        }`}
                      >
                        <ModeIcon className="w-3.5 h-3.5" />
                        <span>{mode.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Mode 1: Browser & Fullscreen / PWA */}
              {previewLaptopMode === 'browser' && (
                <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-white flex items-center gap-2">
                      <Monitor className="w-4 h-4 text-blue-400" />
                      Instant Fullscreen Preview (Zero Software Installation Needed)
                    </span>
                    <span className="text-[10px] text-emerald-400 bg-emerald-950 border border-emerald-800 px-2 py-0.5 rounded font-mono">
                      Fastest & Recommended
                    </span>
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    You can experience the complete Windows 11 desktop shell immediately on any Windows laptop without downloading or building anything:
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                    <div className="p-3 bg-slate-900/90 rounded-lg border border-slate-800">
                      <span className="font-semibold text-white">Press F11 for Edge-to-Edge Immersion</span>
                      <p className="text-slate-400 mt-1 leading-relaxed text-[11px]">
                        Open the preview in Microsoft Edge or Chrome and press <kbd className="px-1.5 py-0.5 bg-slate-800 border border-slate-700 rounded text-cyan-300 font-mono">F11</kbd>. All browser UI, tabs, and URL bars vanish, rendering the desktop shell at 100% native laptop display scaling.
                      </p>
                    </div>

                    <div className="p-3 bg-slate-900/90 rounded-lg border border-slate-800">
                      <span className="font-semibold text-white">Install as Dedicated Desktop App (PWA)</span>
                      <p className="text-slate-400 mt-1 leading-relaxed text-[11px]">
                        In Microsoft Edge, click the <strong>App available</strong> icon in the address bar (or <code className="text-cyan-300">... &gt; Apps &gt; Install this site as an app</code>). It will launch in its own dedicated, borderless desktop window with its own icon in your Windows taskbar!
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 pt-2">
                    <button
                      onClick={() => {
                        if (!document.fullscreenElement) {
                          document.documentElement.requestFullscreen().catch(() => {});
                        } else {
                          document.exitFullscreen().catch(() => {});
                        }
                      }}
                      className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-medium flex items-center gap-2 shadow"
                    >
                      <Maximize2 className="w-3.5 h-3.5" />
                      <span>Test Fullscreen Mode (F11) Right Now</span>
                    </button>
                    <span className="text-[11px] text-slate-400">
                      Press <kbd className="px-1.5 py-0.5 bg-slate-800 rounded font-mono text-slate-300">Esc</kbd> anytime to exit fullscreen.
                    </span>
                  </div>
                </div>
              )}

              {/* Mode 2: PowerShell & Local Node.js */}
              {previewLaptopMode === 'powershell' && (
                <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-white flex items-center gap-2">
                      <Terminal className="w-4 h-4 text-cyan-400" />
                      Run Locally on Windows Laptop via PowerShell / Windows Terminal
                    </span>
                    <span className="text-[10px] text-cyan-400 bg-cyan-950 border border-cyan-800 px-2 py-0.5 rounded font-mono">
                      Full Source Access
                    </span>
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    Run the project directly on your Windows laptop with live hot reloading and full access to the source code:
                  </p>

                  <div className="space-y-2 text-xs">
                    <div className="p-3 bg-slate-900 rounded-lg border border-slate-800">
                      <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-800">
                        <span className="font-mono text-slate-400 text-[11px]">PowerShell / Command Prompt</span>
                        <button
                          onClick={() => copyToClipboard('git clone https://github.com/YOUR-USERNAME/aegisnt-enterprise-os.git\ncd aegisnt-enterprise-os\nnpm install\nnpm run dev', 'ps-run')}
                          className="px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-[10px] text-slate-200 flex items-center gap-1"
                        >
                          {copiedSnippet === 'ps-run' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                          <span>Copy Commands</span>
                        </button>
                      </div>
                      <pre className="font-mono text-xs text-cyan-300 leading-relaxed">
{`# 1. Clone your GitHub repository on Windows
git clone https://github.com/YOUR-USERNAME/aegisnt-enterprise-os.git
cd aegisnt-enterprise-os

# 2. Install dependencies (Node.js 20+ required)
npm install

# 3. Start local development server on port 3000
npm run dev

# 4. Open in Microsoft Edge: http://localhost:3000`}
                      </pre>
                    </div>

                    <div className="p-2.5 bg-slate-900/60 rounded-lg border border-slate-800 text-[11px] text-slate-400 flex items-center justify-between">
                      <span>Production Optimized Build: <code className="text-cyan-300 font-mono">npm run build && npm run preview</code></span>
                      <span className="text-emerald-400 font-mono text-[10px]">60 FPS Fluid</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Mode 3: Docker Desktop for Windows */}
              {previewLaptopMode === 'docker' && (
                <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-white flex items-center gap-2">
                      <Box className="w-4 h-4 text-indigo-400" />
                      Docker Desktop for Windows (WSL2 Backend)
                    </span>
                    <span className="text-[10px] text-indigo-400 bg-indigo-950 border border-indigo-800 px-2 py-0.5 rounded font-mono">
                      Dockerfile & Compose Ready
                    </span>
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    This codebase includes a pre-configured multi-stage <code className="text-cyan-300">Dockerfile</code> and <code className="text-cyan-300">docker-compose.yml</code> ready to run on Docker Desktop for Windows:
                  </p>

                  <div className="p-3 bg-slate-900 rounded-lg border border-slate-800">
                    <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-800">
                      <span className="font-mono text-slate-400 text-[11px]">Docker PowerShell Execution</span>
                      <button
                        onClick={() => copyToClipboard('docker compose up -d\n# Open http://localhost:3000\ndocker compose logs -f', 'docker-run')}
                        className="px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-[10px] text-slate-200 flex items-center gap-1"
                      >
                        {copiedSnippet === 'docker-run' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                        <span>Copy Docker Commands</span>
                      </button>
                    </div>
                    <pre className="font-mono text-xs text-indigo-300 leading-relaxed">
{`# 1. Make sure Docker Desktop is running on your Windows laptop
# 2. Build and launch container in detached background mode:
docker compose up -d

# 3. View live healthcheck and startup:
docker ps
docker logs aegisnt-desktop-os

# 4. Preview in browser:
# Navigate to http://localhost:3000`}
                    </pre>
                  </div>
                </div>
              )}

              {/* Mode 4: Hyper-V & VirtualBox */}
              {previewLaptopMode === 'hyperv' && (
                <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-white flex items-center gap-2">
                      <Server className="w-4 h-4 text-purple-400" />
                      Windows Hyper-V & VirtualBox 7.x Virtualization
                    </span>
                    {onLaunchApp && (
                      <button
                        onClick={() => onLaunchApp('vm_boot_guide')}
                        className="text-xs text-blue-400 hover:text-blue-300 font-medium flex items-center gap-1"
                      >
                        Open Interactive VM Guide <ExternalLink className="w-3 h-3" />
                      </button>
                    )}
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    For running full virtual machine instances on Windows laptops equipped with Intel VT-x or AMD-V:
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                    <div className="p-3 bg-slate-900 rounded-lg border border-slate-800 space-y-1.5">
                      <span className="font-bold text-white">Windows Hyper-V (Built-in)</span>
                      <p className="text-slate-400 text-[11px] leading-relaxed">
                        1. Press <kbd className="px-1 bg-slate-800 rounded font-mono">Win + R</kbd>, type <code className="text-cyan-300">optionalfeatures.exe</code>, check <strong>Hyper-V</strong>.<br />
                        2. Create <strong>Generation 2 VM</strong> with UEFI, Secure Boot, and Synthetic TPM.<br />
                        3. Allocate 8 GB RAM and 4 virtual cores.
                      </p>
                    </div>

                    <div className="p-3 bg-slate-900 rounded-lg border border-slate-800 space-y-1.5">
                      <span className="font-bold text-white">Oracle VirtualBox 7.x</span>
                      <p className="text-slate-400 text-[11px] leading-relaxed">
                        1. Create VM: OS Type <code className="text-cyan-300">Windows 11 (64-bit)</code>.<br />
                        2. Enable <strong>EFI (special OSes only)</strong>.<br />
                        3. Check <strong>Enable 3D Acceleration</strong> with 256MB VRAM for fluid DWM rendering.
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Quick Cheatsheet summary */}
            <div className="p-4 rounded-xl bg-slate-900/50 border border-slate-800 text-xs flex flex-col md:flex-row md:items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-emerald-400" />
                <span className="text-slate-300">
                  Full reference documentation is saved in <code className="text-cyan-300 font-mono">docs/GITHUB_AND_WINDOWS_PREVIEW_GUIDE.md</code>.
                </span>
              </div>
              {onLaunchApp && (
                <button
                  onClick={() => onLaunchApp('dev_docs')}
                  className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs text-blue-300 font-medium flex items-center gap-1.5 self-start md:self-auto"
                >
                  <span>Open Developer Docs Explorer</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>
        )}
        {activeTab === 'shortcuts' && (
          <div className="space-y-6 max-w-5xl mx-auto">
            <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h2 className="text-sm font-bold text-white flex items-center gap-2">
                  <Keyboard className="w-4 h-4 text-cyan-400" />
                  Windows 11 Build Keyboard Shortcuts HUD
                </h2>
                <p className="text-xs text-slate-400 mt-1">
                  Master desktop multitasking, navigation, and system diagnostics with native Windows shortcuts
                </p>
              </div>

              {/* Search Shortcuts */}
              <div className="relative w-full md:w-64">
                <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-500" />
                <input
                  type="text"
                  placeholder="Filter shortcuts (e.g. Win, Task)..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-8 pr-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>

            {/* Shortcuts Table */}
            <div className="bg-slate-900/80 border border-slate-800 rounded-xl overflow-hidden">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-950/80 border-b border-slate-800 text-slate-400 text-[11px] font-semibold">
                    <th className="py-2.5 px-4">Hotkey Combination</th>
                    <th className="py-2.5 px-4">Action & Workflow</th>
                    <th className="py-2.5 px-4">Category</th>
                    <th className="py-2.5 px-4 text-right">Try Now</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 font-sans">
                  {filteredShortcuts.map((s, idx) => (
                    <tr key={idx} className="hover:bg-slate-800/40 transition-colors">
                      <td className="py-2.5 px-4 font-mono font-bold text-blue-300">
                        <span className="px-2 py-0.5 rounded bg-blue-950/60 border border-blue-500/30">
                          {s.key}
                        </span>
                      </td>
                      <td className="py-2.5 px-4 text-slate-200">{s.action}</td>
                      <td className="py-2.5 px-4">
                        <span className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-slate-400">
                          {s.cat}
                        </span>
                      </td>
                      <td className="py-2.5 px-4 text-right">
                        {s.key.includes('Win + E') && onLaunchApp && (
                          <button
                            onClick={() => onLaunchApp('file_explorer')}
                            className="px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-[10px] text-blue-300 transition-colors"
                          >
                            Open Explorer
                          </button>
                        )}
                        {s.key.includes('Ctrl + Shift + Esc') && onLaunchApp && (
                          <button
                            onClick={() => onLaunchApp('task_manager')}
                            className="px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-[10px] text-emerald-300 transition-colors"
                          >
                            Open TaskMgr
                          </button>
                        )}
                        {!s.key.includes('Win + E') && !s.key.includes('Ctrl + Shift + Esc') && (
                          <span className="text-[10px] text-slate-600 font-mono">Native Hotkey</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 6: DESKTOP CUSTOMIZATION */}
        {activeTab === 'personalization' && (
          <div className="space-y-6 max-w-5xl mx-auto">
            <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800">
              <h2 className="text-sm font-bold text-white flex items-center gap-2">
                <Sliders className="w-4 h-4 text-purple-400" />
                Desktop Personalization & Alignment Guidance
              </h2>
              <p className="text-xs text-slate-400 mt-1">
                Customize your Windows 11 Build desktop layout, wallpaper themes, icon scaling, and taskbar behavior
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Taskbar Alignment */}
              <div className="p-4 rounded-xl bg-slate-900/70 border border-slate-800 flex flex-col justify-between">
                <div>
                  <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    <Layout className="w-4 h-4 text-blue-400" />
                    Taskbar Alignment (Center vs Left)
                  </h3>
                  <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                    Windows 11 defaults to a centered taskbar for modern ultrawide screens. If you prefer the classic Windows 10 left-aligned layout, you can toggle alignment on the fly.
                  </p>
                </div>
                <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between">
                  <span className="text-xs text-slate-400">Current mode: Responsive Center</span>
                  {onToggleAlignment && (
                    <button
                      onClick={onToggleAlignment}
                      className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-medium shadow transition-all"
                    >
                      Toggle Center / Left
                    </button>
                  )}
                </div>
              </div>

              {/* Wallpaper Themes */}
              <div className="p-4 rounded-xl bg-slate-900/70 border border-slate-800 flex flex-col justify-between">
                <div>
                  <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    <Palette className="w-4 h-4 text-purple-400" />
                    Windows 11 Bloom Wallpaper Themes
                  </h3>
                  <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                    Choose from authentic Windows 11 dynamic bloom wallpapers: Dark Bloom, Classic Blue, Sunset Glow, or Graphite Enterprise.
                  </p>
                </div>
                <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between">
                  <span className="text-xs text-slate-400">Right-click desktop or open Settings</span>
                  {onLaunchApp && (
                    <button
                      onClick={() => onLaunchApp('settings')}
                      className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium transition-all"
                    >
                      Wallpaper Settings
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB: ENTERPRISE SECURITY, DOCKER & FIREWALL */}
        {activeTab === 'enterprise_security' && (
          <div className="space-y-6 max-w-5xl mx-auto">
            {/* Enterprise Security Hero Banner */}
            <div className="p-5 rounded-xl bg-gradient-to-r from-emerald-950/40 via-slate-900 to-blue-950/40 border border-emerald-800/40 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div>
                <h2 className="text-base font-bold text-white flex items-center gap-2">
                  <Shield className="w-5 h-5 text-emerald-400" />
                  Enterprise Optimization, Docker, Security & Patch Management
                </h2>
                <p className="text-xs text-slate-300 mt-1 max-w-2xl leading-relaxed">
                  Engineered from the ground up for Fortune 500 datacenters, high-security enclaves, and container clusters. Delivers sub-350ns microkernel latency, full OCI containerization, zero-trust Windows execution, and 0-reboot hotpatching.
                </p>
              </div>
              <div className="flex items-center gap-2">
                {onLaunchApp && (
                  <button
                    onClick={() => onLaunchApp('enterprise_security')}
                    className="px-3.5 py-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-semibold rounded-lg shadow-lg shadow-emerald-900/30 flex items-center gap-1.5 transition-all"
                  >
                    <ShieldCheck className="w-4 h-4" />
                    Open Security & Defender Center
                  </button>
                )}
              </div>
            </div>

            {/* 6 Core Enterprise Pillars Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Pillar 1: Performance */}
              <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-sm font-bold text-amber-400">
                    <Zap className="w-4 h-4" />
                    1. Microkernel Performance Optimization
                  </div>
                  <span className="text-[10px] font-mono px-2 py-0.5 bg-amber-950 text-amber-300 font-bold rounded">
                    310ns Latency
                  </span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Eliminates the monolithic kernel bloat of Windows Server. Features tickless scheduling (<code>NO_HZ_FULL</code>), zero-copy <code>io_uring</code> NVMe direct DMA (over 1.42M IOPS), pre-pinned 1GB hugepages, and NUMA-aware physical memory pools.
                </p>
                <div className="p-2.5 bg-slate-950 rounded text-[11px] font-mono text-emerald-400 border border-slate-800/80 flex justify-between">
                  <span>Context Switch: 310ns vs Monolithic 1,420ns</span>
                  <span className="text-slate-500">4.5x Faster</span>
                </div>
              </div>

              {/* Pillar 2: Docker Format */}
              <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-sm font-bold text-cyan-400">
                    <Server className="w-4 h-4" />
                    2. Native Docker & OCI Format
                  </div>
                  <span className="text-[10px] font-mono px-2 py-0.5 bg-cyan-950 text-cyan-300 font-bold rounded">
                    Docker / Podman / K8s
                  </span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Ships in official OCI container images with rootless Podman and Docker Compose support. Deploy headless for microkernel APIs or stream the 60FPS WebRTC desktop via port 3000 with hardware GPU passthrough (<code>/dev/dri</code>, <code>/dev/kvm</code>).
                </p>
                <div className="p-2.5 bg-slate-950 rounded text-[11px] font-mono text-cyan-300 border border-slate-800/80 flex items-center justify-between">
                  <span>docker run -d -p 3000:3000 --device /dev/kvm</span>
                  <button
                    onClick={() => copyToClipboard('docker run -d --name aegisnt-win11 -p 3000:3000 --device /dev/kvm --device /dev/dri ghcr.io/aegisnt/enterprise-desktop:24h2', 'docker-quick')}
                    className="text-slate-400 hover:text-white"
                  >
                    {copiedSnippet === 'docker-quick' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>

              {/* Pillar 3: High-Level Security & Production-Safe Windows Apps */}
              <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-sm font-bold text-emerald-400">
                    <Lock className="w-4 h-4" />
                    3. Zero-Trust & Production-Safe Windows Apps
                  </div>
                  <span className="text-[10px] font-mono px-2 py-0.5 bg-emerald-950 text-emerald-300 font-bold rounded">
                    VBS / HVCI / kCFG
                  </span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Run Windows applications (SAP, AutoCAD, Office, custom ERPs) safely in enterprise production. Each app executes within an isolated Bubblewrap + Wine 9.x sandbox with seccomp-bpf syscall sanitization, virtualized registry, and strict Authenticode WHQL verification.
                </p>
                <div className="text-[11px] text-slate-400 font-mono bg-slate-950 p-2 rounded border border-slate-800/80">
                  Isolation: Virtual Trust Level 1 (VTL 1) Enclave + Hardware TPM 2.0 PCR-7
                </div>
              </div>

              {/* Pillar 4: Stateful Firewall & External Firewall */}
              <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-sm font-bold text-rose-400">
                    <Flame className="w-4 h-4" />
                    4. High-Level Stateful & External Firewall
                  </div>
                  <span className="text-[10px] font-mono px-2 py-0.5 bg-rose-950 text-rose-300 font-bold rounded">
                    PAN-OS / FortiGate / pfSense
                  </span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Built-in microkernel Stateful Packet Inspection (SPI) firewall with Domain, Private, and Public profiles. Seamlessly mirrors connection telemetry and syncs policies with external enterprise firewalls (Palo Alto PAN-OS, Fortinet FortiOS, pfSense/OPNsense, Cisco FMC).
                </p>
                <div className="text-[11px] text-slate-400 font-mono bg-slate-950 p-2 rounded border border-slate-800/80">
                  Traffic Engine: Encrypted TLS Syslog Mirroring + Real-Time Drop Logging
                </div>
              </div>

              {/* Pillar 5: Antivirus & Defender EDR */}
              <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-sm font-bold text-teal-400">
                    <ShieldCheck className="w-4 h-4" />
                    5. Aegis Defender EDR & Antivirus
                  </div>
                  <span className="text-[10px] font-mono px-2 py-0.5 bg-teal-950 text-teal-300 font-bold rounded">
                    AMSI + Cloud Intel
                  </span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Real-time heuristic protection engine with Antimalware Scan Interface (AMSI) hooks into PowerShell, scripting runtimes, and macro engines. Provides an isolated Quarantine Vault, daily cloud signature synchronization, and on-demand background scans.
                </p>
                <div className="text-[11px] text-slate-400 font-mono bg-slate-950 p-2 rounded border border-slate-800/80">
                  Signatures: Version 1.419.82.0 (Live Telemetry Connected)
                </div>
              </div>

              {/* Pillar 6: Windows Update & 0-Reboot Hotpatching */}
              <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-sm font-bold text-blue-400">
                    <RefreshCw className="w-4 h-4" />
                    6. Windows Update & 0-Reboot Hotpatching
                  </div>
                  <span className="text-[10px] font-mono px-2 py-0.5 bg-blue-950 text-blue-300 font-bold rounded">
                    kpatch.sys / LTSC 2024
                  </span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Provides effortless enterprise patch delivery via WSUS, Microsoft Intune, SCCM, and Ansible playbooks. Zero-reboot hotpatching replaces kernel instructions in memory without restarting VMs or dropping active user sessions.
                </p>
                <div className="text-[11px] text-slate-400 font-mono bg-slate-950 p-2 rounded border border-slate-800/80">
                  Channels: Long-Term Servicing Channel (LTSC 2024) 5-Year Enterprise Guarantee
                </div>
              </div>
            </div>

            {/* Quick Action Navigation Buttons */}
            <div className="p-4 bg-slate-900 rounded-xl border border-slate-800 flex flex-wrap items-center justify-between gap-3">
              <span className="text-xs text-slate-300 font-medium">
                Want to test real-time firewall rules, launch Docker sandboxes, or run antivirus scans?
              </span>
              <div className="flex items-center gap-2">
                {onLaunchApp && (
                  <>
                    <button
                      onClick={() => onLaunchApp('enterprise_security')}
                      className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded text-xs font-semibold flex items-center gap-1.5 transition-colors"
                    >
                      <Shield className="w-3.5 h-3.5" />
                      Open Enterprise Security Console
                    </button>
                    <button
                      onClick={() => onLaunchApp('resource_monitor')}
                      className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded text-xs font-semibold flex items-center gap-1.5 transition-colors"
                    >
                      <Activity className="w-3.5 h-3.5 text-cyan-400" />
                      View Resource Monitor
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Bottom Status Footer */}
      <div className="bg-slate-900/90 border-t border-slate-800/80 px-4 py-2 flex items-center justify-between text-[11px] text-slate-400 font-mono">
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1.5 text-emerald-400">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
            Build Active: 26100.1882.24H2
          </span>
          <span className="hidden sm:inline text-slate-600">|</span>
          <span className="hidden sm:inline">DWM Compositor: Hardware Accelerated (WDDM 3.2)</span>
        </div>
        <div className="flex items-center gap-2">
          <span>AegisNT Windows 11 Build Desktop Guidance</span>
        </div>
      </div>
    </div>
  );
}
