import React, { useState, useEffect } from 'react';
import {
  Layers,
  Coffee,
  Flame,
  Monitor,
  Terminal,
  Play,
  Square,
  CheckCircle2,
  RefreshCw,
  Cpu,
  HardDrive,
  Activity,
  Code2,
  Box,
  FileCode,
  Sparkles,
  ExternalLink,
  Zap,
  Sliders,
  Shield,
  Search,
  Copy,
  Info,
  Server
} from 'lucide-react';
import { CompatibilityEngine, CompatibilityApp } from '../../services/compatibilityEngine';

interface AppCompatibilitySuiteAppProps {
  onLaunchApp?: (appId: string) => void;
}

export default function AppCompatibilitySuiteApp({ onLaunchApp }: AppCompatibilitySuiteAppProps) {
  const engine = CompatibilityEngine.getInstance();
  const [activeTab, setActiveTab] = useState<'overview' | 'java' | 'dotnet' | 'windows' | 'cli'>('overview');
  const [apps, setApps] = useState<CompatibilityApp[]>(engine.sampleApps);
  const [runningAppIds, setRunningAppIds] = useState<string[]>(['spring-boot-api', 'dotnet-aspnet-api']);
  const [selectedApp, setSelectedApp] = useState<CompatibilityApp>(engine.sampleApps[0]);
  const [appLogs, setAppLogs] = useState<Record<string, string[]>>({
    'spring-boot-api': engine.sampleApps[0].sampleOutput,
    'dotnet-aspnet-api': engine.sampleApps[3].sampleOutput,
  });

  // CLI state
  const [cliInput, setCliInput] = useState('dotnet --info');
  const [cliLogs, setCliLogs] = useState<Array<{ cmd: string; output: string[]; time: string }>>([
    {
      cmd: 'java -version',
      output: [
        'openjdk version "21.0.5" 2026-10-15 LTS',
        'OpenJDK Runtime Environment Temurin-21.0.5+11 (build 21.0.5+11-LTS)',
        'OpenJDK 64-Bit Server VM Temurin-21.0.5+11 (build 21.0.5+11-LTS, mixed mode, sharing)',
        'AegisNT Microkernel Fast-Path HAL: Enabled [Direct VMM paging, sub-1ms ZGC pauses]'
      ],
      time: '11:20:00'
    },
    {
      cmd: 'dotnet --info',
      output: [
        '.NET SDK:',
        ' Version:           9.0.100',
        ' Commit:            a942bc1940',
        ' Workload version:  9.0.100-manifests.8091',
        '',
        'Runtime Environment:',
        ' OS Name:     AegisNT Enterprise Edition',
        ' OS Version:  10.0.26100 (Build 26100.2033 NTS)',
        ' Architecture: X64 (AVX-512 & BMI2 Hardware Accelerated)',
        ' CoreCLR:     9.0.24.52809 with RyuJIT Dynamic PGO Enabled',
        '',
        'Host:',
        ' Version:      9.0.0',
        ' Architecture: x64',
        ' Commit:       9d5a9d61'
      ],
      time: '11:20:45'
    }
  ]);

  // JVM tuning controls
  const [jvmHeapSize, setJvmHeapSize] = useState('2048');
  const [jvmGcSelected, setJvmGcSelected] = useState('ZGC');
  const [jvmLoomEnabled, setJvmLoomEnabled] = useState(true);

  // .NET tuning controls
  const [dotnetTieredPgo, setDotnetTieredPgo] = useState(true);
  const [dotnetServerGc, setDotnetServerGc] = useState(true);
  const [dotnetWpfDirectX, setDotnetWpfDirectX] = useState('Direct3D 11 Hardware (DXVK)');

  // Windows compatibility controls
  const [winCompatMode, setWinCompatMode] = useState('Windows 11 24H2 (Native)');
  const [winDpiScaling, setWinDpiScaling] = useState('Per-Monitor V2 (Hardware Blit)');

  const handleToggleRunApp = (app: CompatibilityApp) => {
    const isRunning = runningAppIds.includes(app.id);
    if (isRunning) {
      setRunningAppIds(prev => prev.filter(id => id !== app.id));
      setAppLogs(prev => ({
        ...prev,
        [app.id]: [...(prev[app.id] || []), `[${new Date().toLocaleTimeString()}] Process termination requested. Exit code 0 (STATUS_SUCCESS).`]
      }));
    } else {
      setRunningAppIds(prev => [...prev, app.id]);
      setSelectedApp(app);
      setAppLogs(prev => ({
        ...prev,
        [app.id]: [
          `[${new Date().toLocaleTimeString()}] Initializing Subsystem runtime for ${app.name}...`,
          `[${new Date().toLocaleTimeString()}] Executing binary: "${app.binaryPath}"`,
          ...(app.sampleOutput || [])
        ]
      }));
    }
  };

  const handleRunCliCommand = (customCmd?: string) => {
    const cmdToRun = (customCmd || cliInput).trim();
    if (!cmdToRun) return;

    let output: string[] = [];
    const lower = cmdToRun.toLowerCase();

    if (lower === 'java -version' || lower.startsWith('java -v')) {
      output = [
        'openjdk version "21.0.5" 2026-10-15 LTS',
        'OpenJDK Runtime Environment Temurin-21.0.5+11 (build 21.0.5+11-LTS)',
        'OpenJDK 64-Bit Server VM Temurin-21.0.5+11 (build 21.0.5+11-LTS, mixed mode, sharing)',
        'Subsystem: AegisNT POSIX/Win32 Hybrid HAL Bridge'
      ];
    } else if (lower.startsWith('java -jar')) {
      const jarName = cmdToRun.split(' ')[2] || 'application.jar';
      output = [
        `[AegisNT JVM Subsystem] Loading JAR archive: ${jarName}`,
        '[HotSpot JIT] Verified 1,420 bytecode classes in 42ms',
        '[ZGC Engine] Pre-allocated virtual memory space (Heap max: 4096 MB)',
        `[${jarName}] Application main() method invoked on thread [main]`,
        `[${jarName}] Service listening and operational @ 100% throughput`
      ];
    } else if (lower.startsWith('javac')) {
      output = [
        '[AegisNT Java Compiler] Compiling source tree with target release 21...',
        '[Javac] Bytecode generated successfully. Class files written to ./target/classes/',
        '[Javac] 0 errors, 0 warnings (Optimized with invokedynamic)'
      ];
    } else if (lower === 'dotnet --version') {
      output = ['9.0.100'];
    } else if (lower.startsWith('dotnet --info')) {
      output = [
        '.NET SDK 9.0.100 on AegisNT Enterprise (X64)',
        'CoreCLR: 9.0.24.52809 with RyuJIT AVX-512 Dynamic PGO',
        'Host Framework: Microsoft.NETCore.App 9.0.0',
        'Desktop Framework: Microsoft.WindowsDesktop.App 9.0.0 (WPF & WinForms Active)'
      ];
    } else if (lower.startsWith('dotnet run')) {
      output = [
        'Building project...',
        'Determining projects to restore...',
        'All projects are up-to-date for restore.',
        'CoreCompile: Output path: bin/Release/net9.0/publish/App.dll',
        'info: Microsoft.Hosting.Lifetime[14] Now listening on: http://localhost:5000',
        'info: Microsoft.Hosting.Lifetime[0] Application started in 184ms.'
      ];
    } else if (lower.startsWith('wine') || lower.startsWith('start') || lower.endsWith('.exe')) {
      output = [
        `[AegisNT WOW64 Subsystem] Loading Windows PE32+ image: ${cmdToRun}`,
        '[PE Loader] Relocating image base, binding IAT imports (kernel32, user32, gdi32, ole32)',
        '[Wine 9.x Staging] NT Executive syscall thunk initialized (Latency: 4.2 microseconds)',
        `[win32k.sys] HWND window allocated. Windows message pump active.`
      ];
    } else if (lower.startsWith('msiexec')) {
      output = [
        '[Windows Installer 5.0] msiexec transaction engine invoked',
        '[msiexec] Validated cabinet signature with Windows Authenticode CA',
        '[msiexec] Product install state: INSTALLED_DEFAULT',
        '[msiexec] Installation completed successfully without requiring a system reboot.'
      ];
    } else {
      output = [
        `[AegisNT Subsystems] Command "${cmdToRun}" executed successfully via Universal Binary Runner.`,
        'Exit code: 0 (STATUS_SUCCESS)'
      ];
    }

    setCliLogs(prev => [
      ...prev,
      { cmd: cmdToRun, output, time: new Date().toLocaleTimeString() }
    ]);
    if (!customCmd) setCliInput('');
  };

  const getFilteredApps = () => {
    if (activeTab === 'java') return apps.filter(a => a.subsystem === 'Java (JVM)');
    if (activeTab === 'dotnet') return apps.filter(a => a.subsystem === '.NET (CoreCLR)');
    if (activeTab === 'windows') return apps.filter(a => a.subsystem.startsWith('Windows'));
    return apps;
  };

  return (
    <div className="flex flex-col h-full bg-slate-950 text-slate-100 font-sans select-text">
      {/* Top Banner */}
      <div className="flex items-center justify-between px-4 py-2.5 bg-slate-900 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-br from-blue-600/30 to-purple-600/30 text-cyan-300 rounded-lg border border-cyan-500/40">
            <Layers className="w-5 h-5" />
          </div>
          <div>
            <div className="font-semibold text-sm flex items-center gap-2">
              AegisNT Enterprise Application Compatibility & Subsystems Center
              <span className="px-2 py-0.5 text-[10px] font-mono bg-blue-950 border border-blue-500/50 text-blue-300 rounded font-bold">
                JAVA 21 / .NET 9 / WIN32 PE
              </span>
            </div>
            <div className="text-[11px] text-slate-400">
              Run any Java JAR, .NET CoreCLR/Framework assembly, and native Windows Win32/Win64 PE application seamlessly
            </div>
          </div>
        </div>

        {/* Subsystem Health Pill Indicators */}
        <div className="flex items-center gap-2 text-[11px] font-mono">
          <div className="flex items-center gap-1.5 px-2.5 py-1 bg-amber-950/60 border border-amber-600/50 text-amber-300 rounded">
            <Coffee className="w-3.5 h-3.5 text-amber-400" />
            JVM 21: READY
          </div>
          <div className="flex items-center gap-1.5 px-2.5 py-1 bg-purple-950/60 border border-purple-600/50 text-purple-300 rounded">
            <Flame className="w-3.5 h-3.5 text-purple-400" />
            .NET 9: ACTIVE
          </div>
          <div className="flex items-center gap-1.5 px-2.5 py-1 bg-blue-950/60 border border-blue-600/50 text-blue-300 rounded">
            <Monitor className="w-3.5 h-3.5 text-blue-400" />
            WIN32 / WOW64: NATIVE
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex items-center border-b border-slate-800 px-4 bg-slate-900/60 text-xs font-medium">
        {[
          { id: 'overview', label: 'Universal Overview & Architecture', icon: Layers },
          { id: 'java', label: 'Java Applications (OpenJDK 21 / Temurin JVM)', icon: Coffee, count: `${apps.filter(a => a.subsystem === 'Java (JVM)').length} Apps` },
          { id: 'dotnet', label: '.NET 9 & CoreCLR Subsystem (C#, WPF, WinForms)', icon: Flame, count: `${apps.filter(a => a.subsystem === '.NET (CoreCLR)').length} Apps` },
          { id: 'windows', label: 'Windows Applications (Win32, PE32+, MSI, Wine 9.x)', icon: Monitor, count: `${apps.filter(a => a.subsystem.startsWith('Windows')).length} Apps` },
          { id: 'cli', label: 'Universal Subsystem CLI (java / dotnet / wine)', icon: Terminal }
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 py-2.5 px-3.5 border-b-2 transition-all ${
                isActive
                  ? 'border-cyan-500 text-cyan-300 bg-slate-800/60 font-semibold'
                  : 'border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-800/30'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              {tab.label}
              {tab.count && (
                <span className="ml-1 text-[10px] font-mono px-1.5 py-0.2 rounded bg-slate-800 text-slate-300">
                  {tab.count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Main Container */}
      <div className="flex-1 overflow-y-auto p-5 bg-slate-950 space-y-5">
        {/* ========================================================= */}
        {/* TAB 1: OVERVIEW & SUBSYSTEM ARCHITECTURE                 */}
        {/* ========================================================= */}
        {activeTab === 'overview' && (
          <div className="space-y-6 max-w-6xl mx-auto">
            {/* Hero Summary */}
            <div className="p-4 bg-gradient-to-r from-slate-900 via-blue-950/40 to-slate-900 border border-slate-800 rounded-xl">
              <div className="flex items-start justify-between">
                <div>
                  <h2 className="text-base font-bold text-white flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-cyan-400" />
                    Triple-Stack Enterprise Application Runtime Architecture
                  </h2>
                  <p className="text-xs text-slate-300 mt-1 max-w-3xl leading-relaxed">
                    AegisNT provides full enterprise binary compatibility across all 3 dominant enterprise application ecosystems.
                    Whether running compiled Java bytecode, modern .NET 9 MSIL with RyuJIT, or native Windows 64-bit/32-bit PE binaries,
                    programs execute with hardware-native acceleration, zero-reboot hotpatch safety, and hardware memory protection.
                  </p>
                </div>
                <div className="text-right">
                  <div className="text-[11px] font-mono text-slate-400">Total Active Instances</div>
                  <div className="text-xl font-bold font-mono text-emerald-400">{runningAppIds.length} / {apps.length} Running</div>
                </div>
              </div>
            </div>

            {/* 3 Pillar Subsystems Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Java Subsystem Card */}
              <div className="p-4 bg-slate-900/90 border border-amber-900/40 rounded-xl flex flex-col justify-between hover:border-amber-600/50 transition-all">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="p-2 bg-amber-500/10 text-amber-400 rounded border border-amber-500/30">
                      <Coffee className="w-5 h-5" />
                    </div>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800">
                      ACTIVE & CERTIFIED
                    </span>
                  </div>
                  <h3 className="font-bold text-sm text-amber-200">Java Virtual Machine (JVM)</h3>
                  <div className="text-xs text-slate-400 font-mono">OpenJDK 21 LTS / Eclipse Temurin</div>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    Executes any standard `.jar` or `.class` file. Features HotSpot C1/C2 tiered JIT, Project Loom virtual threads,
                    and Generational ZGC for sub-1ms garbage collection latency.
                  </p>
                  <ul className="text-[11px] text-slate-400 space-y-1 pt-1">
                    <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3 h-3 text-amber-400" /> Spring Boot, Quarkus & Microservices</li>
                    <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3 h-3 text-amber-400" /> JavaFX & Swing Desktop GUI apps</li>
                    <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3 h-3 text-amber-400" /> Minecraft & High-Throughput servers</li>
                  </ul>
                </div>
                <button
                  onClick={() => setActiveTab('java')}
                  className="mt-4 w-full py-1.5 bg-amber-600/20 hover:bg-amber-600/30 text-amber-300 border border-amber-600/40 rounded text-xs font-semibold flex items-center justify-center gap-1.5"
                >
                  Explore Java Subsystem <ExternalLink className="w-3 h-3" />
                </button>
              </div>

              {/* .NET Subsystem Card */}
              <div className="p-4 bg-slate-900/90 border border-purple-900/40 rounded-xl flex flex-col justify-between hover:border-purple-600/50 transition-all">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="p-2 bg-purple-500/10 text-purple-400 rounded border border-purple-500/30">
                      <Flame className="w-5 h-5" />
                    </div>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800">
                      ACTIVE & CERTIFIED
                    </span>
                  </div>
                  <h3 className="font-bold text-sm text-purple-200">.NET 9 CoreCLR & Framework</h3>
                  <div className="text-xs text-slate-400 font-mono">Microsoft .NET 9.0.100 (CoreCLR)</div>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    Runs C#, F#, and VB.NET compiled assemblies (`.dll`, `.exe`). Features RyuJIT Dynamic PGO, WPF/WinForms
                    compositor bridge to win32k.sys, and ultra-high-speed Kestrel web server.
                  </p>
                  <ul className="text-[11px] text-slate-400 space-y-1 pt-1">
                    <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3 h-3 text-purple-400" /> ASP.NET Core REST/gRPC Cloud APIs</li>
                    <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3 h-3 text-purple-400" /> WPF & WinForms Enterprise Desktop UIs</li>
                    <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3 h-3 text-purple-400" /> Native AOT Ahead-Of-Time Executables</li>
                  </ul>
                </div>
                <button
                  onClick={() => setActiveTab('dotnet')}
                  className="mt-4 w-full py-1.5 bg-purple-600/20 hover:bg-purple-600/30 text-purple-300 border border-purple-600/40 rounded text-xs font-semibold flex items-center justify-center gap-1.5"
                >
                  Explore .NET Subsystem <ExternalLink className="w-3 h-3" />
                </button>
              </div>

              {/* Windows Win32/PE Subsystem Card */}
              <div className="p-4 bg-slate-900/90 border border-blue-900/40 rounded-xl flex flex-col justify-between hover:border-blue-600/50 transition-all">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="p-2 bg-blue-500/10 text-blue-400 rounded border border-blue-500/30">
                      <Monitor className="w-5 h-5" />
                    </div>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800">
                      ACTIVE & CERTIFIED
                    </span>
                  </div>
                  <h3 className="font-bold text-sm text-blue-200">Windows Win32 & WoW64 (PE32+)</h3>
                  <div className="text-xs text-slate-400 font-mono">Wine 9.18 Proton Staging / NT Subsystem</div>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    Native PE/COFF loader with full support for 32-bit and 64-bit Windows executables (`.exe`), DLL dynamic links,
                    DirectX 11/12 via DXVK/VKD3D, and transactional Windows Installers (`.msi`).
                  </p>
                  <ul className="text-[11px] text-slate-400 space-y-1 pt-1">
                    <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3 h-3 text-blue-400" /> Native PE32/PE32+ Binary Execution</li>
                    <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3 h-3 text-blue-400" /> DirectX 11/12 & Vulkan Hardware 3D</li>
                    <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3 h-3 text-blue-400" /> Windows Installer (msiexec.exe) Support</li>
                  </ul>
                </div>
                <button
                  onClick={() => setActiveTab('windows')}
                  className="mt-4 w-full py-1.5 bg-blue-600/20 hover:bg-blue-600/30 text-blue-300 border border-blue-600/40 rounded text-xs font-semibold flex items-center justify-center gap-1.5"
                >
                  Explore Windows Subsystem <ExternalLink className="w-3 h-3" />
                </button>
              </div>
            </div>

            {/* Architecture Stack Flow Diagram */}
            <div className="p-4 bg-slate-900 border border-slate-800 rounded-xl">
              <h3 className="font-bold text-xs text-slate-200 uppercase tracking-wider mb-3 flex items-center gap-2">
                <Cpu className="w-4 h-4 text-cyan-400" />
                AegisNT Unified Subsystems Execution Stack
              </h3>
              <div className="space-y-2 font-mono text-[11px]">
                {/* Level 4: Applications */}
                <div className="p-2.5 bg-slate-950 border border-slate-800 rounded-lg flex items-center justify-between">
                  <span className="text-slate-400 font-bold">User Applications:</span>
                  <div className="flex gap-2">
                    <span className="px-2 py-0.5 bg-amber-950/80 text-amber-300 rounded border border-amber-800">Java (.jar, .class, Spring Boot)</span>
                    <span className="px-2 py-0.5 bg-purple-950/80 text-purple-300 rounded border border-purple-800">.NET (.dll, WPF, ASP.NET, WinForms)</span>
                    <span className="px-2 py-0.5 bg-blue-950/80 text-blue-300 rounded border border-blue-800">Windows (.exe, .msi, Win32/PE64)</span>
                  </div>
                </div>

                {/* Level 3: Runtime Engines */}
                <div className="p-2.5 bg-slate-950 border border-slate-800 rounded-lg flex items-center justify-between">
                  <span className="text-slate-400 font-bold">Execution Engines:</span>
                  <div className="flex gap-2">
                    <span className="px-2 py-0.5 bg-amber-900/40 text-amber-200 rounded">OpenJDK 21 HotSpot Server VM</span>
                    <span className="px-2 py-0.5 bg-purple-900/40 text-purple-200 rounded">CoreCLR 9.0 + RyuJIT Compiler</span>
                    <span className="px-2 py-0.5 bg-blue-900/40 text-blue-200 rounded">Wine 9.x WoW64 / DXVK Direct3D</span>
                  </div>
                </div>

                {/* Level 2: Subsystem Bridge */}
                <div className="p-2.5 bg-slate-950 border border-cyan-900/50 rounded-lg flex items-center justify-between bg-cyan-950/20">
                  <span className="text-cyan-300 font-bold">Subsystem Interop:</span>
                  <span className="text-slate-300">
                    AegisNT Win32k Compositor • JNI HAL Bridge • CoreCLR P/Invoke Fast-Path • NT Virtual Memory Manager (VMM)
                  </span>
                </div>

                {/* Level 1: Kernel */}
                <div className="p-2.5 bg-emerald-950/30 border border-emerald-800/60 rounded-lg flex items-center justify-between">
                  <span className="text-emerald-400 font-bold">Kernel Core:</span>
                  <span className="text-emerald-300">
                    AegisNT Microkernel (Tickless Preemptive Scheduler, W^X Memory Protection, Sub-10μs HAL Interrupts)
                  </span>
                </div>
              </div>
            </div>

            {/* Quick Launch Pre-loaded Matrix */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-xs text-slate-300 uppercase tracking-wider">
                  Configured Production Applications
                </h3>
                <span className="text-xs text-slate-400">Click Run to spin up instances with live stdout logging</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {apps.slice(0, 6).map((app) => {
                  const isRunning = runningAppIds.includes(app.id);
                  return (
                    <div
                      key={app.id}
                      className={`p-3 bg-slate-900 border rounded-lg flex items-center justify-between transition-all ${
                        isRunning ? 'border-emerald-600/60 bg-emerald-950/20' : 'border-slate-800 hover:border-slate-700'
                      }`}
                    >
                      <div className="space-y-1 max-w-[70%]">
                        <div className="flex items-center gap-2">
                          <span className={`text-[10px] font-mono px-1.5 py-0.2 rounded font-bold ${
                            app.subsystem === 'Java (JVM)'
                              ? 'bg-amber-950 text-amber-300 border border-amber-800'
                              : app.subsystem === '.NET (CoreCLR)'
                              ? 'bg-purple-950 text-purple-300 border border-purple-800'
                              : 'bg-blue-950 text-blue-300 border border-blue-800'
                          }`}>
                            {app.subsystem}
                          </span>
                          <span className="font-bold text-xs text-slate-200 truncate">{app.name}</span>
                        </div>
                        <div className="text-[11px] text-slate-400 truncate">{app.description}</div>
                        <div className="text-[10px] font-mono text-slate-500 truncate">{app.binaryPath}</div>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleToggleRunApp(app)}
                          className={`px-3 py-1.5 rounded text-xs font-semibold flex items-center gap-1.5 transition-all ${
                            isRunning
                              ? 'bg-rose-900/60 hover:bg-rose-800 text-rose-200 border border-rose-700'
                              : 'bg-emerald-600 hover:bg-emerald-500 text-white'
                          }`}
                        >
                          {isRunning ? (
                            <>
                              <Square className="w-3 h-3 fill-current" /> Stop
                            </>
                          ) : (
                            <>
                              <Play className="w-3 h-3 fill-current" /> Run
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* TAB 2: JAVA ECOSYSTEM (OPENJDK 21 LTS / TEMURIN)         */}
        {/* ========================================================= */}
        {activeTab === 'java' && (
          <div className="space-y-6 max-w-6xl mx-auto">
            {/* Java Subsystem Banner */}
            <div className="p-4 bg-slate-900 border border-amber-800/40 rounded-xl flex items-start justify-between">
              <div className="flex items-start gap-3">
                <div className="p-2.5 bg-amber-600/20 text-amber-400 rounded-lg border border-amber-500/40">
                  <Coffee className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="text-base font-bold text-white flex items-center gap-2">
                    OpenJDK 21 LTS HotSpot Virtual Machine
                    <span className="px-2 py-0.5 text-[10px] font-mono bg-amber-950 border border-amber-600 text-amber-300 rounded font-bold">
                      TEMURIN 21.0.5+11
                    </span>
                  </h2>
                  <p className="text-xs text-slate-300 mt-1 max-w-2xl leading-relaxed">
                    Full compatibility with all Java applications, JAR files, WAR servlet packages, and native JNI bindings.
                    Incorporates Tiered JIT (C1 Client + C2 Server compilers) and Project Loom virtual threads for high concurrency.
                  </p>
                </div>
              </div>

              {/* Tuning quick switches */}
              <div className="bg-slate-950 border border-slate-800 p-3 rounded-lg text-xs space-y-2 min-w-[240px]">
                <div className="text-[10px] font-mono text-slate-400 uppercase font-bold">JVM Engine Tuning:</div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-300">Max Heap (-Xmx):</span>
                  <select
                    value={jvmHeapSize}
                    onChange={(e) => setJvmHeapSize(e.target.value)}
                    className="bg-slate-900 text-amber-300 font-mono text-xs px-2 py-0.5 rounded border border-slate-800 focus:outline-none"
                  >
                    <option value="1024">1,024 MB</option>
                    <option value="2048">2,048 MB</option>
                    <option value="4096">4,096 MB</option>
                    <option value="8192">8,192 MB</option>
                  </select>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-300">Garbage Collector:</span>
                  <select
                    value={jvmGcSelected}
                    onChange={(e) => setJvmGcSelected(e.target.value)}
                    className="bg-slate-900 text-amber-300 font-mono text-xs px-2 py-0.5 rounded border border-slate-800 focus:outline-none"
                  >
                    <option value="ZGC">Generational ZGC (&lt;1ms)</option>
                    <option value="G1GC">G1 Garbage Collector</option>
                    <option value="ParallelGC">Throughput Parallel GC</option>
                  </select>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-300">Project Loom Virtual:</span>
                  <input
                    type="checkbox"
                    checked={jvmLoomEnabled}
                    onChange={(e) => setJvmLoomEnabled(e.target.checked)}
                    className="rounded text-amber-500 focus:ring-0"
                  />
                </div>
              </div>
            </div>

            {/* Java Apps Split Layout: App Selector on Left, Interactive Console on Right */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
              {/* Left Column: Java Apps */}
              <div className="lg:col-span-5 space-y-3">
                <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center justify-between">
                  <span>Available Java Applications</span>
                  <span className="text-[10px] font-mono text-amber-400">Class Version 65.0 (Java 21)</span>
                </div>

                {apps.filter(a => a.subsystem === 'Java (JVM)').map((app) => {
                  const isRunning = runningAppIds.includes(app.id);
                  const isSelected = selectedApp.id === app.id;
                  return (
                    <div
                      key={app.id}
                      onClick={() => setSelectedApp(app)}
                      className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
                        isSelected
                          ? 'border-amber-500 bg-amber-950/20 ring-1 ring-amber-500/50'
                          : 'border-slate-800 bg-slate-900/60 hover:border-slate-700'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2.5">
                          <div className="p-2 bg-amber-500/10 text-amber-400 rounded-lg border border-amber-500/20">
                            <Coffee className="w-4 h-4" />
                          </div>
                          <div>
                            <div className="font-bold text-xs text-slate-200">{app.name}</div>
                            <div className="text-[10px] font-mono text-slate-400">{app.version}</div>
                          </div>
                        </div>

                        <span className={`text-[10px] font-mono px-2 py-0.5 rounded font-bold ${
                          isRunning ? 'bg-emerald-950 text-emerald-300 border border-emerald-800' : 'bg-slate-800 text-slate-400'
                        }`}>
                          {isRunning ? 'RUNNING' : 'STOPPED'}
                        </span>
                      </div>

                      <p className="text-[11px] text-slate-300 mt-2 leading-relaxed">{app.description}</p>

                      <div className="mt-3 pt-2.5 border-t border-slate-800 flex items-center justify-between">
                        <div className="text-[10px] font-mono text-slate-400">
                          RAM: {app.memoryMb} MB | GC: {app.runtimeDetails.gcEngine}
                        </div>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleToggleRunApp(app);
                          }}
                          className={`px-3 py-1 rounded text-xs font-semibold flex items-center gap-1.5 transition-all ${
                            isRunning
                              ? 'bg-rose-900/80 hover:bg-rose-800 text-rose-200 border border-rose-700'
                              : 'bg-amber-600 hover:bg-amber-500 text-white'
                          }`}
                        >
                          {isRunning ? (
                            <>
                              <Square className="w-3 h-3 fill-current" /> Terminate
                            </>
                          ) : (
                            <>
                              <Play className="w-3 h-3 fill-current" /> Execute JAR
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Right Column: Live App Telemetry & Stdout Console */}
              <div className="lg:col-span-7 flex flex-col space-y-4">
                <div className="p-4 bg-slate-900 border border-slate-800 rounded-xl space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-bold text-xs text-slate-200 flex items-center gap-2">
                        <Activity className="w-3.5 h-3.5 text-amber-400" />
                        Selected JVM Target: {selectedApp.name}
                      </h3>
                      <div className="text-[10px] font-mono text-slate-400 mt-0.5">{selectedApp.binaryPath}</div>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleRunCliCommand(`java -jar "${selectedApp.binaryPath}"`)}
                        className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded text-xs flex items-center gap-1 font-mono"
                      >
                        <Terminal className="w-3 h-3" /> CLI Test
                      </button>
                    </div>
                  </div>

                  {/* Runtime flags list */}
                  <div className="p-2.5 bg-slate-950 border border-slate-800 rounded font-mono text-[10px] text-amber-300">
                    <span className="text-slate-500">Flags: </span>
                    {selectedApp.runtimeDetails.subsystemFlags.join(' ')}
                  </div>

                  {/* Console stdout view */}
                  <div className="bg-slate-950 border border-slate-800 rounded-lg p-3 font-mono text-xs space-y-1 min-h-[260px] max-h-[340px] overflow-y-auto">
                    <div className="text-[11px] text-slate-500 border-b border-slate-800 pb-1 mb-2 flex items-center justify-between">
                      <span>STDOUT / STDERR REALTIME STREAM</span>
                      <span>Process Status: {runningAppIds.includes(selectedApp.id) ? 'ACTIVE' : 'IDLE'}</span>
                    </div>

                    {(appLogs[selectedApp.id] || selectedApp.sampleOutput).map((line, idx) => (
                      <div key={idx} className="text-slate-300 text-[11px] leading-relaxed break-all">
                        {line}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Java Bytecode Disassembly Preview (`javap -c`) */}
                <div className="p-3.5 bg-slate-900 border border-slate-800 rounded-xl space-y-2">
                  <div className="flex items-center justify-between text-xs font-semibold text-slate-300">
                    <span className="flex items-center gap-1.5 font-mono">
                      <Code2 className="w-3.5 h-3.5 text-amber-400" />
                      Compiled Bytecode View (javap -c EnterpriseApplication.class)
                    </span>
                    <span className="text-[10px] font-mono text-slate-500">TieredCompilation Active</span>
                  </div>
                  <pre className="p-2.5 bg-slate-950 border border-slate-800 rounded font-mono text-[10px] text-slate-300 overflow-x-auto leading-relaxed max-h-[140px]">
{`Compiled from "EnterpriseApplication.java"
public class com.aegisnt.enterprise.EnterpriseApplication {
  public static void main(java.lang.String[]);
    Code:
       0: new           #7    // class org/springframework/boot/SpringApplication
       3: dup
       4: iconst_1
       5: anewarray     #9    // class java/lang/Class
       8: dup
       9: iconst_0
      10: ldc           #11   // class com/aegisnt/enterprise/EnterpriseApplication
      12: aastore
      13: invokespecial #13   // Method "<init>":([Ljava/lang/Class;)V
      16: aload_0
      17: invokevirtual #16   // Method run:([Ljava/lang/String;)Lorg/springframework/context/ConfigurableApplicationContext;
      20: pop
      21: return
}`}
                  </pre>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* TAB 3: .NET CORECLR & FRAMEWORK SUBSYSTEM                */}
        {/* ========================================================= */}
        {activeTab === 'dotnet' && (
          <div className="space-y-6 max-w-6xl mx-auto">
            {/* .NET Subsystem Banner */}
            <div className="p-4 bg-slate-900 border border-purple-800/40 rounded-xl flex items-start justify-between">
              <div className="flex items-start gap-3">
                <div className="p-2.5 bg-purple-600/20 text-purple-400 rounded-lg border border-purple-500/40">
                  <Flame className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="text-base font-bold text-white flex items-center gap-2">
                    .NET 9.0 Enterprise CoreCLR Execution Engine
                    <span className="px-2 py-0.5 text-[10px] font-mono bg-purple-950 border border-purple-600 text-purple-300 rounded font-bold">
                      CORECLR 9.0.24.52809
                    </span>
                  </h2>
                  <p className="text-xs text-slate-300 mt-1 max-w-2xl leading-relaxed">
                    Executes any .NET managed assembly (`.dll`, `.exe`, or single-file). Features RyuJIT 64-bit Dynamic Profile-Guided
                    Optimization (PGO), Native AOT compilation, and complete desktop UI interop with WPF and Windows Forms.
                  </p>
                </div>
              </div>

              {/* .NET Tuning box */}
              <div className="bg-slate-950 border border-slate-800 p-3 rounded-lg text-xs space-y-2 min-w-[250px]">
                <div className="text-[10px] font-mono text-slate-400 uppercase font-bold">RyuJIT & GC Tuning:</div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-300">Dynamic PGO:</span>
                  <input
                    type="checkbox"
                    checked={dotnetTieredPgo}
                    onChange={(e) => setDotnetTieredPgo(e.target.checked)}
                    className="rounded text-purple-500 focus:ring-0"
                  />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-300">Server Garbage Collector:</span>
                  <input
                    type="checkbox"
                    checked={dotnetServerGc}
                    onChange={(e) => setDotnetServerGc(e.target.checked)}
                    className="rounded text-purple-500 focus:ring-0"
                  />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-300">WPF Rendering Engine:</span>
                  <select
                    value={dotnetWpfDirectX}
                    onChange={(e) => setDotnetWpfDirectX(e.target.value)}
                    className="bg-slate-900 text-purple-300 font-mono text-[10px] px-2 py-0.5 rounded border border-slate-800 focus:outline-none"
                  >
                    <option value="Direct3D 11 Hardware (DXVK)">Direct3D 11 (DXVK)</option>
                    <option value="Direct3D 12 Hardware (VKD3D)">Direct3D 12 (VKD3D)</option>
                    <option value="Software WARP Rasterizer">Software WARP</option>
                  </select>
                </div>
              </div>
            </div>

            {/* .NET Apps Split Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
              {/* Left Column: .NET Apps */}
              <div className="lg:col-span-5 space-y-3">
                <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center justify-between">
                  <span>Available .NET Applications</span>
                  <span className="text-[10px] font-mono text-purple-400">Target net9.0 / net8.0</span>
                </div>

                {apps.filter(a => a.subsystem === '.NET (CoreCLR)').map((app) => {
                  const isRunning = runningAppIds.includes(app.id);
                  const isSelected = selectedApp.id === app.id;
                  return (
                    <div
                      key={app.id}
                      onClick={() => setSelectedApp(app)}
                      className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
                        isSelected
                          ? 'border-purple-500 bg-purple-950/20 ring-1 ring-purple-500/50'
                          : 'border-slate-800 bg-slate-900/60 hover:border-slate-700'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2.5">
                          <div className="p-2 bg-purple-500/10 text-purple-400 rounded-lg border border-purple-500/20">
                            <Flame className="w-4 h-4" />
                          </div>
                          <div>
                            <div className="font-bold text-xs text-slate-200">{app.name}</div>
                            <div className="text-[10px] font-mono text-slate-400">{app.version}</div>
                          </div>
                        </div>

                        <span className={`text-[10px] font-mono px-2 py-0.5 rounded font-bold ${
                          isRunning ? 'bg-emerald-950 text-emerald-300 border border-emerald-800' : 'bg-slate-800 text-slate-400'
                        }`}>
                          {isRunning ? 'RUNNING' : 'STOPPED'}
                        </span>
                      </div>

                      <p className="text-[11px] text-slate-300 mt-2 leading-relaxed">{app.description}</p>

                      <div className="mt-3 pt-2.5 border-t border-slate-800 flex items-center justify-between">
                        <div className="text-[10px] font-mono text-slate-400">
                          RAM: {app.memoryMb} MB | JIT: {app.runtimeDetails.jitMode}
                        </div>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleToggleRunApp(app);
                          }}
                          className={`px-3 py-1 rounded text-xs font-semibold flex items-center gap-1.5 transition-all ${
                            isRunning
                              ? 'bg-rose-900/80 hover:bg-rose-800 text-rose-200 border border-rose-700'
                              : 'bg-purple-600 hover:bg-purple-500 text-white'
                          }`}
                        >
                          {isRunning ? (
                            <>
                              <Square className="w-3 h-3 fill-current" /> Terminate
                            </>
                          ) : (
                            <>
                              <Play className="w-3 h-3 fill-current" /> Execute Assembly
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Right Column: Interactive Console & Assembly Diagnostics */}
              <div className="lg:col-span-7 flex flex-col space-y-4">
                <div className="p-4 bg-slate-900 border border-slate-800 rounded-xl space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-bold text-xs text-slate-200 flex items-center gap-2">
                        <Activity className="w-3.5 h-3.5 text-purple-400" />
                        Selected .NET Assembly: {selectedApp.name}
                      </h3>
                      <div className="text-[10px] font-mono text-slate-400 mt-0.5">{selectedApp.binaryPath}</div>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleRunCliCommand(`dotnet "${selectedApp.binaryPath}"`)}
                        className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded text-xs flex items-center gap-1 font-mono"
                      >
                        <Terminal className="w-3 h-3" /> CLI Run
                      </button>
                    </div>
                  </div>

                  {/* Runtime flags */}
                  <div className="p-2.5 bg-slate-950 border border-slate-800 rounded font-mono text-[10px] text-purple-300">
                    <span className="text-slate-500">Env Vars: </span>
                    {selectedApp.runtimeDetails.subsystemFlags.join(' ')}
                  </div>

                  {/* Console stdout view */}
                  <div className="bg-slate-950 border border-slate-800 rounded-lg p-3 font-mono text-xs space-y-1 min-h-[260px] max-h-[340px] overflow-y-auto">
                    <div className="text-[11px] text-slate-500 border-b border-slate-800 pb-1 mb-2 flex items-center justify-between">
                      <span>CORECLR STDOUT STREAM</span>
                      <span>Status: {runningAppIds.includes(selectedApp.id) ? 'ACTIVE' : 'IDLE'}</span>
                    </div>

                    {(appLogs[selectedApp.id] || selectedApp.sampleOutput).map((line, idx) => (
                      <div key={idx} className="text-slate-300 text-[11px] leading-relaxed break-all">
                        {line}
                      </div>
                    ))}
                  </div>
                </div>

                {/* MSIL / CIL Disassembly Preview */}
                <div className="p-3.5 bg-slate-900 border border-slate-800 rounded-xl space-y-2">
                  <div className="flex items-center justify-between text-xs font-semibold text-slate-300">
                    <span className="flex items-center gap-1.5 font-mono">
                      <FileCode className="w-3.5 h-3.5 text-purple-400" />
                      Compiled MSIL / CIL Code (ildasm Program.Main)
                    </span>
                    <span className="text-[10px] font-mono text-slate-500">RyuJIT Dynamic PGO Active</span>
                  </div>
                  <pre className="p-2.5 bg-slate-950 border border-slate-800 rounded font-mono text-[10px] text-slate-300 overflow-x-auto leading-relaxed max-h-[140px]">
{`.method public static void Main(string[] args) cil managed
{
  .entrypoint
  .maxstack 2
  .locals init (class [Microsoft.AspNetCore]Microsoft.AspNetCore.Builder.WebApplication app)
  IL_0000: ldarg.0
  IL_0001: call class [Microsoft.AspNetCore]Microsoft.AspNetCore.Builder.WebApplicationBuilder [Microsoft.AspNetCore]Microsoft.AspNetCore.Builder.WebApplication::CreateBuilder(string[])
  IL_0006: callvirt instance class [Microsoft.AspNetCore]Microsoft.AspNetCore.Builder.WebApplication [Microsoft.AspNetCore]Microsoft.AspNetCore.Builder.WebApplicationBuilder::Build()
  IL_000b: stloc.0
  IL_000c: ldloc.0
  IL_000d: callvirt instance void [Microsoft.AspNetCore.Hosting]Microsoft.AspNetCore.Builder.WebApplication::Run()
  IL_0012: ret
}`}
                  </pre>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* TAB 4: WINDOWS WIN32 / WIN64 / PE / MSI SUBSYSTEM       */}
        {/* ========================================================= */}
        {activeTab === 'windows' && (
          <div className="space-y-6 max-w-6xl mx-auto">
            {/* Windows Subsystem Banner */}
            <div className="p-4 bg-slate-900 border border-blue-800/40 rounded-xl flex items-start justify-between">
              <div className="flex items-start gap-3">
                <div className="p-2.5 bg-blue-600/20 text-blue-400 rounded-lg border border-blue-500/40">
                  <Monitor className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="text-base font-bold text-white flex items-center gap-2">
                    Windows Native PE & WOW64 Subsystem
                    <span className="px-2 py-0.5 text-[10px] font-mono bg-blue-950 border border-blue-600 text-blue-300 rounded font-bold">
                      PE32+ / WIN64 NATIVE
                    </span>
                  </h2>
                  <p className="text-xs text-slate-300 mt-1 max-w-2xl leading-relaxed">
                    Executes any standard 32-bit (PE32) and 64-bit (PE32+) Windows binary, dynamic library (`.dll`),
                    and transactional Windows Installer package (`.msi`). Features complete win32k.sys desktop compositor,
                    DXVK Direct3D-to-Vulkan hardware rendering, and Registry hive emulation.
                  </p>
                </div>
              </div>

              {/* Windows Settings Box */}
              <div className="bg-slate-950 border border-slate-800 p-3 rounded-lg text-xs space-y-2 min-w-[250px]">
                <div className="text-[10px] font-mono text-slate-400 uppercase font-bold">Subsystem Compatibility:</div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-300">Emulation Profile:</span>
                  <select
                    value={winCompatMode}
                    onChange={(e) => setWinCompatMode(e.target.value)}
                    className="bg-slate-900 text-blue-300 font-mono text-[10px] px-2 py-0.5 rounded border border-slate-800 focus:outline-none"
                  >
                    <option value="Windows 11 24H2 (Native)">Windows 11 24H2 (Native)</option>
                    <option value="Windows 10 22H2">Windows 10 22H2</option>
                    <option value="Windows 7 SP1">Windows 7 SP1</option>
                    <option value="Windows XP SP3">Windows XP SP3</option>
                  </select>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-300">DPI Scaling Mode:</span>
                  <select
                    value={winDpiScaling}
                    onChange={(e) => setWinDpiScaling(e.target.value)}
                    className="bg-slate-900 text-blue-300 font-mono text-[10px] px-2 py-0.5 rounded border border-slate-800 focus:outline-none"
                  >
                    <option value="Per-Monitor V2 (Hardware Blit)">Per-Monitor V2</option>
                    <option value="System DPI Aware (GDI)">System DPI Aware</option>
                    <option value="Unaware (Virtual Stretch)">Virtual Stretch</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Windows Apps Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {apps.filter(a => a.subsystem.startsWith('Windows')).map((app) => {
                const isRunning = runningAppIds.includes(app.id);
                return (
                  <div
                    key={app.id}
                    className={`p-4 rounded-xl border flex flex-col justify-between transition-all ${
                      isRunning
                        ? 'border-blue-500 bg-blue-950/20 ring-1 ring-blue-500/50'
                        : 'border-slate-800 bg-slate-900/60 hover:border-slate-700'
                    }`}
                  >
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="p-1.5 bg-blue-500/10 text-blue-400 rounded border border-blue-500/30">
                            <Monitor className="w-4 h-4" />
                          </span>
                          <div>
                            <div className="font-bold text-xs text-slate-100">{app.name}</div>
                            <div className="text-[10px] font-mono text-slate-400">{app.version}</div>
                          </div>
                        </div>

                        <span className={`text-[10px] font-mono px-2 py-0.5 rounded font-bold ${
                          isRunning ? 'bg-emerald-950 text-emerald-300 border border-emerald-800' : 'bg-slate-800 text-slate-400'
                        }`}>
                          {isRunning ? 'RUNNING' : 'STOPPED'}
                        </span>
                      </div>

                      <p className="text-xs text-slate-300 leading-relaxed">{app.description}</p>
                      <div className="text-[10px] font-mono text-cyan-400">{app.binaryPath}</div>

                      {/* PE Details */}
                      <div className="p-2 bg-slate-950 border border-slate-800 rounded text-[11px] font-mono text-slate-300 space-y-1">
                        <div><span className="text-slate-500">PE Engine:</span> {app.runtimeDetails.engine}</div>
                        <div><span className="text-slate-500">Section Mapping:</span> .text (Executable) | .rdata (Const) | .data (RW)</div>
                        <div><span className="text-slate-500">Imports:</span> kernel32, user32, gdi32, advapi32, ole32</div>
                      </div>
                    </div>

                    <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between">
                      {app.id === 'win32-libreoffice' && onLaunchApp ? (
                        <button
                          onClick={() => onLaunchApp('libreoffice')}
                          className="px-3 py-1.5 bg-cyan-600/30 hover:bg-cyan-600/40 text-cyan-200 border border-cyan-500/40 rounded text-xs font-semibold flex items-center gap-1.5"
                        >
                          <ExternalLink className="w-3.5 h-3.5" /> Launch Office Window
                        </button>
                      ) : (
                        <div className="text-[10px] font-mono text-slate-500">Allocated RAM: {app.memoryMb} MB</div>
                      )}

                      <button
                        onClick={() => handleToggleRunApp(app)}
                        className={`px-3 py-1.5 rounded text-xs font-semibold flex items-center gap-1.5 transition-all ${
                          isRunning
                            ? 'bg-rose-900/80 hover:bg-rose-800 text-rose-200 border border-rose-700'
                            : 'bg-blue-600 hover:bg-blue-500 text-white'
                        }`}
                      >
                        {isRunning ? (
                          <>
                            <Square className="w-3 h-3 fill-current" /> Terminate PE
                          </>
                        ) : (
                          <>
                            <Play className="w-3 h-3 fill-current" /> Execute PE (.exe)
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* TAB 5: UNIVERSAL SUBSYSTEM CLI (java / dotnet / wine)    */}
        {/* ========================================================= */}
        {activeTab === 'cli' && (
          <div className="space-y-4 max-w-5xl mx-auto flex flex-col h-[calc(100vh-220px)]">
            <div className="p-3 bg-slate-900 border border-slate-800 rounded-xl flex items-center justify-between">
              <div>
                <h3 className="font-bold text-xs text-slate-200 flex items-center gap-2">
                  <Terminal className="w-4 h-4 text-cyan-400" />
                  Universal Subsystem Developer Command-Line Interface
                </h3>
                <div className="text-[11px] text-slate-400">
                  Direct interactive shell executing `java`, `javac`, `dotnet`, `wine`, and `msiexec` commands.
                </div>
              </div>

              {/* Quick CLI Preset Buttons */}
              <div className="flex flex-wrap gap-1.5 text-xs font-mono">
                {[
                  { label: 'java -version', cmd: 'java -version' },
                  { label: 'dotnet --info', cmd: 'dotnet --info' },
                  { label: 'java -jar springboot.jar', cmd: 'java -jar springboot-enterprise-gateway.jar' },
                  { label: 'dotnet run', cmd: 'dotnet run --project OrderManagement.Api' },
                  { label: 'wine soffice.exe', cmd: 'wine C:\\Program Files\\LibreOffice\\program\\soffice.exe' },
                  { label: 'msiexec /i package.msi', cmd: 'msiexec /i EnterpriseSecurityTools.msi /quiet' }
                ].map((preset) => (
                  <button
                    key={preset.label}
                    onClick={() => handleRunCliCommand(preset.cmd)}
                    className="px-2 py-1 bg-slate-800 hover:bg-slate-700 text-cyan-300 rounded border border-slate-700 hover:border-cyan-500/50 text-[11px]"
                  >
                    {preset.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Terminal Window Box */}
            <div className="flex-1 bg-slate-950 border border-slate-800 rounded-xl flex flex-col overflow-hidden">
              {/* Output history */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4 font-mono text-xs">
                <div className="text-slate-500 text-[11px]">
                  AegisNT Universal Runtime Shell v10.0.26100 [Java 21 • .NET 9 • Win32 PE]<br />
                  Type 'help', 'java -version', 'dotnet --info', or click a preset above.
                </div>

                {cliLogs.map((entry, idx) => (
                  <div key={idx} className="space-y-1.5">
                    <div className="flex items-center gap-2 text-cyan-400 font-bold">
                      <span className="text-emerald-400">C:\Users\Administrator&gt;</span>
                      <span>{entry.cmd}</span>
                      <span className="text-[10px] text-slate-600 font-normal ml-auto">{entry.time}</span>
                    </div>
                    <div className="pl-4 space-y-0.5 text-slate-300 text-[11px] leading-relaxed">
                      {entry.output.map((line, lIdx) => (
                        <div key={lIdx}>{line}</div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              {/* Input bar */}
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleRunCliCommand();
                }}
                className="p-3 bg-slate-900 border-t border-slate-800 flex items-center gap-2"
              >
                <span className="font-mono text-xs text-emerald-400 font-bold">C:\Users\Administrator&gt;</span>
                <input
                  type="text"
                  value={cliInput}
                  onChange={(e) => setCliInput(e.target.value)}
                  placeholder="Enter command (e.g. java -version, dotnet run, wine calc.exe)..."
                  className="flex-1 bg-slate-950 border border-slate-800 rounded px-3 py-1.5 text-xs text-slate-200 placeholder-slate-600 font-mono focus:outline-none focus:border-cyan-500"
                />
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-cyan-600 hover:bg-cyan-500 text-white rounded text-xs font-semibold flex items-center gap-1.5"
                >
                  <Play className="w-3.5 h-3.5 fill-current" /> Execute
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
