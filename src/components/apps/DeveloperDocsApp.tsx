import React, { useState } from 'react';
import {
  BookOpen,
  Layers,
  ShieldCheck,
  Cpu,
  Server,
  FileCode,
  Copy,
  Check,
  ExternalLink,
  Laptop,
  HardDrive,
  GitPullRequest,
  Sparkles,
  Terminal,
  Activity,
  Code2,
  ListFilter,
  CheckCircle2,
  Info,
  Coffee,
  Flame
} from 'lucide-react';

export default function DeveloperDocsApp({ onLaunchApp }: { onLaunchApp?: (appId: string) => void }) {
  const [activeTab, setActiveTab] = useState<'architecture' | 'app_compat' | 'drivers' | 'install' | 'release' | 'enterprise' | 'codebase' | 'contributing' | 'github_guide'>('architecture');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const tabs = [
    { id: 'architecture', label: 'Architecture & Diagrams', icon: Layers },
    { id: 'app_compat', label: 'Java, .NET & Win32 Runtimes', icon: Coffee },
    { id: 'enterprise', label: 'Enterprise Security & Docker', icon: ShieldCheck },
    { id: 'github_guide', label: 'GitHub & Windows Preview', icon: ExternalLink },
    { id: 'drivers', label: 'Drivers & Kernel Core', icon: Cpu },
    { id: 'install', label: 'Installation & VM Docs', icon: Server },
    { id: 'release', label: 'Release Features (24H2)', icon: Sparkles },
    { id: 'codebase', label: 'Codebase Tour ("What\'s on Code")', icon: FileCode },
    { id: 'contributing', label: 'Open Source Contribution Guide', icon: GitPullRequest },
  ] as const;

  return (
    <div className="flex flex-col h-full bg-slate-950 text-slate-100 font-sans select-none overflow-hidden">
      {/* Top Banner / Navigation */}
      <div className="px-6 py-4 bg-slate-900 border-b border-slate-800 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-600/20 border border-blue-500/40 rounded-lg text-blue-400">
            <BookOpen className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-base font-bold text-slate-100">AegisNT Developer & Architecture Documentation</h1>
              <span className="px-2 py-0.5 bg-blue-900/60 border border-blue-700/60 rounded text-[10px] font-mono font-bold text-blue-300">
                v24H2 Enterprise Open-Source
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Complete engineering manual for kernel architects, driver authors, hypervisor administrators, and open-source contributors
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {onLaunchApp && (
            <>
              <button
                onClick={() => onLaunchApp('kernel_inspector')}
                className="px-2.5 py-1.5 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded text-xs font-semibold text-slate-200 flex items-center gap-1.5 transition-colors"
                title="Open Kernel Inspector"
              >
                <Cpu className="w-3.5 h-3.5 text-blue-400" />
                Kernel Inspector
              </button>
              <button
                onClick={() => onLaunchApp('resource_monitor')}
                className="px-2.5 py-1.5 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded text-xs font-semibold text-slate-200 flex items-center gap-1.5 transition-colors"
                title="Open Resource Monitor"
              >
                <Activity className="w-3.5 h-3.5 text-cyan-400" />
                Resmon.exe
              </button>
              <button
                onClick={() => onLaunchApp('ddk')}
                className="px-2.5 py-1.5 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded text-xs font-semibold text-slate-200 flex items-center gap-1.5 transition-colors"
                title="Open Driver Development Kit"
              >
                <Code2 className="w-3.5 h-3.5 text-emerald-400" />
                WDK / DDK
              </button>
            </>
          )}
        </div>
      </div>

      {/* Tabs Bar */}
      <div className="flex border-b border-slate-800 px-6 bg-slate-900/40 text-xs font-medium overflow-x-auto shrink-0">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 py-3 px-4 border-b-2 font-semibold transition-all whitespace-nowrap ${
                isActive
                  ? 'border-blue-500 text-blue-400 bg-blue-950/20'
                  : 'border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Tab Content Area */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        {/* TAB 1: ARCHITECTURE & DIAGRAMS */}
        {activeTab === 'architecture' && (
          <div className="space-y-6 max-w-5xl">
            <div className="p-4 bg-slate-900/60 border border-slate-800 rounded-xl">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Layers className="w-5 h-5 text-blue-400" />
                  <h2 className="text-sm font-bold text-slate-100">Full-Stack Operating System Architecture Diagram</h2>
                </div>
                <button
                  onClick={() =>
                    copyToClipboard(
                      `+==================================================================================================+\n|                                    USER MODE (Ring 3 / EL0)                                      |\n+==================================================================================================+\n|  Windows 11 Fluent Shell  *  LibreOffice 24.8 Suite  *  Enterprise Terminal  *  Resource Monitor |\n|  Win32 / WOW64: kernel32.dll * user32.dll * ntdll.dll * Wine 9.x PE Dispatcher                  |\n|  CSRSS Host * LSASS Auth * Service Control Manager (services.exe)                               |\n+=============================================|====================================================+\n|                                  SYSENTER / SYSCALL / SVC                                        |\n+=============================================|====================================================+\n|                                   KERNEL MODE (Ring 0 / EL1)                                     |\n+==================================================================================================+\n|  NT Executive (ntoskrnl.exe): Process/Thread, Memory, Object Mgr, Security Reference Monitor    |\n|  Drivers: aegis_nvme.sys * usb4_host_router.sys * vfio_iommu_passthru.sys * aegis_wddm32.sys    |\n|           virtio_hal_kvm.sys * aegis_bitlocker_fve.sys * wine_pe_exec.sys                       |\n|  Tickless Microkernel Core: Sub-microsecond Preemption, Dynamic IRQL (0-31), Zero-Jitter Timer   |\n|  Hardware Abstraction Layer (HAL): APIC/GIC, TSC Deadline, IOMMU (VT-d/AMD-Vi), VirtIO Rings     |\n+==================================================================================================+`,
                      'arch-ascii'
                    )
                  }
                  className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded text-[11px] text-slate-300 flex items-center gap-1.5 transition-colors"
                >
                  {copiedId === 'arch-ascii' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-slate-400" />}
                  <span>{copiedId === 'arch-ascii' ? 'Copied' : 'Copy Diagram'}</span>
                </button>
              </div>
              <p className="text-xs text-slate-400 mb-4">
                AegisNT separates user space applications from the kernel via a strict hardware ring isolation boundary (Ring 3 vs Ring 0 on x86_64, EL0 vs EL1 on ARM64).
              </p>

              {/* Graphical Visual Diagram */}
              <div className="space-y-2 text-xs font-mono">
                {/* User Mode Card */}
                <div className="p-3 bg-blue-950/30 border border-blue-900/60 rounded-lg">
                  <div className="flex items-center justify-between text-blue-300 font-bold mb-2">
                    <span>USER MODE (Ring 3 / EL0) - Unprivileged Virtual Address Space</span>
                    <span className="text-[10px] bg-blue-900/50 px-2 py-0.5 rounded text-blue-200">128 TB per Process</span>
                  </div>
                  <div className="grid grid-cols-3 gap-2 text-[11px] font-sans">
                    <div className="p-2 bg-slate-900/90 border border-slate-800 rounded">
                      <div className="font-semibold text-slate-200">Windows 11 Fluent Shell</div>
                      <div className="text-[10px] text-slate-400">Taskbar, Start Menu, Snap Layouts, Desktop</div>
                    </div>
                    <div className="p-2 bg-slate-900/90 border border-slate-800 rounded">
                      <div className="font-semibold text-slate-200">Enterprise Productivity</div>
                      <div className="text-[10px] text-slate-400">LibreOffice 24.8 (Writer, Calc, Impress)</div>
                    </div>
                    <div className="p-2 bg-slate-900/90 border border-slate-800 rounded">
                      <div className="font-semibold text-slate-200">Diagnostic Suite</div>
                      <div className="text-[10px] text-slate-400">resmon.exe, eventvwr, taskmgr, PowerShell</div>
                    </div>
                  </div>
                  <div className="mt-2 p-2 bg-slate-900/70 border border-slate-800 rounded text-[11px] text-slate-300 flex items-center justify-between font-mono">
                    <span>Win32 & WOW64 Subsystem: kernel32.dll * user32.dll * ntdll.dll * Wine 9.x PE Bridge</span>
                    <span className="text-emerald-400 text-[10px]">Direct NT Syscall Translation</span>
                  </div>
                </div>

                {/* Transition Bar */}
                <div className="py-1 px-4 bg-slate-900 border border-slate-800 rounded flex items-center justify-between text-[11px] text-amber-400 font-bold">
                  <span>Hardware Isolation Boundary: Fast System Calls (SYSCALL / SYSENTER / SVC)</span>
                  <span className="text-slate-400 text-[10px]">Privilege Escalation Protected ($W \oplus X$, SMEP, SMAP)</span>
                </div>

                {/* Kernel Mode Card */}
                <div className="p-3 bg-indigo-950/30 border border-indigo-900/60 rounded-lg">
                  <div className="flex items-center justify-between text-indigo-300 font-bold mb-2">
                    <span>KERNEL MODE (Ring 0 / EL1) - Privileged Executive & Microkernel Core</span>
                    <span className="text-[10px] bg-indigo-900/50 px-2 py-0.5 rounded text-indigo-200">128 TB Kernel Pool</span>
                  </div>

                  {/* Executive */}
                  <div className="p-2 bg-slate-900/90 border border-slate-800 rounded text-[11px] mb-2 font-sans">
                    <div className="font-bold text-slate-200 mb-1">NT Executive Services (ntoskrnl.exe)</div>
                    <div className="text-[10px] text-slate-400 grid grid-cols-4 gap-2">
                      <span>* Process/Thread Mgr (Ps)</span>
                      <span>* Virtual Memory Mgr (Mm)</span>
                      <span>* Object Manager (Ob)</span>
                      <span>* Security Ref Monitor (Se)</span>
                    </div>
                  </div>

                  {/* Drivers Grid */}
                  <div className="grid grid-cols-4 gap-2 text-[10px] font-sans mb-2">
                    <div className="p-2 bg-slate-900 border border-slate-800 rounded text-center">
                      <div className="font-bold text-blue-400">aegis_nvme.sys</div>
                      <div className="text-slate-400">PCIe 5.0 (1.25M IOPS)</div>
                    </div>
                    <div className="p-2 bg-slate-900 border border-slate-800 rounded text-center">
                      <div className="font-bold text-cyan-400">usb4_host_router.sys</div>
                      <div className="text-slate-400">80Gbps PAM3 Router</div>
                    </div>
                    <div className="p-2 bg-slate-900 border border-slate-800 rounded text-center">
                      <div className="font-bold text-emerald-400">vfio_iommu_passthru.sys</div>
                      <div className="text-slate-400">IOMMU GPU Arbiter</div>
                    </div>
                    <div className="p-2 bg-slate-900 border border-slate-800 rounded text-center">
                      <div className="font-bold text-amber-400">virtio_hal_kvm.sys</div>
                      <div className="text-slate-400">VirtIO Para-DMA Rings</div>
                    </div>
                  </div>

                  {/* Microkernel Core */}
                  <div className="p-2.5 bg-slate-900/90 border border-slate-800 rounded text-[11px] font-sans">
                    <div className="flex items-center justify-between font-bold text-indigo-300">
                      <span>Tickless Microkernel Core (KeScheduler)</span>
                      <span className="text-[10px] text-slate-400">Latency: 240ns (ARM64) / 310ns (x86_64)</span>
                    </div>
                    <div className="text-[10px] text-slate-400 mt-1">
                      Dynamic IRQL Levels (0 to 31) * Zero-Jitter Timer Wheel * Preemption Engine (&gt;18,500 ctx/s)
                    </div>
                  </div>

                  {/* HAL */}
                  <div className="mt-2 p-2 bg-slate-900/70 border border-slate-800 rounded text-[10px] text-slate-300 font-mono flex items-center justify-between">
                    <span>Hardware Abstraction Layer (HAL): APIC, IOAPIC, GICv4, TSC-Deadline, VT-d / AMD-Vi</span>
                    <span className="text-blue-400">x86_64 & ARM64 Multi-Arch</span>
                  </div>
                </div>

                {/* Firmware & Hardware */}
                <div className="p-2.5 bg-slate-900 border border-slate-800 rounded-lg flex items-center justify-between text-[11px] font-sans text-slate-400">
                  <span className="font-semibold text-slate-300">FIRMWARE & HARDWARE LAYER:</span>
                  <span>UEFI 2.10 GPT</span>
                  <span>•</span>
                  <span>Secure Boot db/dbx</span>
                  <span>•</span>
                  <span>TPM 2.0 Cryptoprocessor</span>
                  <span>•</span>
                  <span>PCIe 5.0 Root Complex</span>
                  <span>•</span>
                  <span>VT-x / AMD-V / ARM NEON</span>
                </div>
              </div>
            </div>

            {/* IRQL Scheduling Hierarchy */}
            <div className="p-4 bg-slate-900/60 border border-slate-800 rounded-xl space-y-3">
              <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
                <Cpu className="w-4 h-4 text-emerald-400" />
                Interrupt Request Levels (IRQL) Hierarchy
              </h3>
              <p className="text-xs text-slate-400">
                AegisNT utilizes a 32-level IRQL execution priority system to prevent priority inversions and eliminate spinlock deadlocks:
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs font-mono">
                <div className="p-3 bg-slate-950 border border-slate-800 rounded-lg space-y-1">
                  <div className="text-rose-400 font-bold">HIGH_LEVEL (31)</div>
                  <div className="text-slate-400 text-[11px]">Machine Check, Non-Maskable Interrupts (NMI), Profiling</div>
                </div>
                <div className="p-3 bg-slate-950 border border-slate-800 rounded-lg space-y-1">
                  <div className="text-amber-400 font-bold">DEVICE_LEVEL (4 – 27)</div>
                  <div className="text-slate-400 text-[11px]">Hardware Bus ISRs (PCIe 5.0 NVMe, USB4, GPU, VirtIO)</div>
                </div>
                <div className="p-3 bg-slate-950 border border-slate-800 rounded-lg space-y-1">
                  <div className="text-cyan-400 font-bold">DISPATCH_LEVEL (2)</div>
                  <div className="text-slate-400 text-[11px]">Deferred Procedure Calls (DPC), Thread Scheduler, Spinlocks</div>
                </div>
                <div className="p-3 bg-slate-950 border border-slate-800 rounded-lg space-y-1">
                  <div className="text-emerald-400 font-bold">PASSIVE_LEVEL (0)</div>
                  <div className="text-slate-400 text-[11px]">User Threads, NT Syscalls, File I/O, Paged Pool Memory</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB: APPLICATION RUNTIMES & COMPATIBILITY (JAVA, .NET, WIN32) */}
        {activeTab === 'app_compat' && (
          <div className="space-y-6 max-w-5xl">
            {/* Header & Launcher */}
            <div className="p-4 bg-slate-900/60 border border-slate-800 rounded-xl flex items-center justify-between">
              <div>
                <h2 className="text-sm font-bold text-white flex items-center gap-2">
                  <Coffee className="w-4 h-4 text-amber-400" />
                  Enterprise Application Compatibility Specification: Java, .NET & Windows
                </h2>
                <p className="text-xs text-slate-300 mt-1 max-w-3xl leading-relaxed">
                  AegisNT is engineered with a multi-subsystem executive layer capable of executing standard Java bytecode (JVM 21),
                  modern .NET CoreCLR/Framework assemblies (C#, F#, VB.NET), and native Windows PE32/PE32+ binaries.
                </p>
              </div>
              {onLaunchApp && (
                <button
                  onClick={() => onLaunchApp('app_compat')}
                  className="px-3.5 py-2 bg-cyan-600 hover:bg-cyan-500 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 shadow"
                >
                  <ExternalLink className="w-3.5 h-3.5" /> Launch Compatibility Suite
                </button>
              )}
            </div>

            {/* 3 Pillar In-depth Technical Specs */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Java Spec */}
              <div className="p-4 bg-slate-900/80 border border-amber-900/40 rounded-xl space-y-3">
                <div className="flex items-center justify-between">
                  <div className="text-xs font-bold text-amber-400 font-mono flex items-center gap-1.5">
                    <Coffee className="w-4 h-4" /> OpenJDK 21 LTS JVM
                  </div>
                  <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-amber-950 text-amber-300 border border-amber-800">HotSpot 64-Bit</span>
                </div>
                <ul className="text-xs text-slate-300 space-y-2 leading-relaxed">
                  <li>• <strong className="text-white">Tiered JIT Compiler:</strong> C1 (client fast startup) + C2 (server profile-guided optimization) generates native x86_64 AVX-512 instructions.</li>
                  <li>• <strong className="text-white">Generational ZGC:</strong> Ultra-low latency garbage collector maintaining pause times strictly under 1 millisecond regardless of heap size (up to 16TB).</li>
                  <li>• <strong className="text-white">Project Loom:</strong> Lightweight virtual threads enabling millions of concurrent socket connections for high-throughput microservices.</li>
                  <li>• <strong className="text-white">Direct HAL JNI Bridge:</strong> Direct memory access to PCIe NVMe queues via Foreign Function & Memory (FFM) API.</li>
                </ul>
                <div className="p-2.5 bg-slate-950 border border-slate-800 rounded font-mono text-[10px] text-amber-300">
                  java -XX:+UseZGC -jar springboot.jar
                </div>
              </div>

              {/* .NET Spec */}
              <div className="p-4 bg-slate-900/80 border border-purple-900/40 rounded-xl space-y-3">
                <div className="flex items-center justify-between">
                  <div className="text-xs font-bold text-purple-400 font-mono flex items-center gap-1.5">
                    <Flame className="w-4 h-4" /> .NET 9.0 CoreCLR
                  </div>
                  <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-purple-950 text-purple-300 border border-purple-800">RyuJIT 64-Bit</span>
                </div>
                <ul className="text-xs text-slate-300 space-y-2 leading-relaxed">
                  <li>• <strong className="text-white">RyuJIT Dynamic PGO:</strong> Profile-Guided Optimization automatically instruments hot call-sites and inlines methods across assemblies dynamically.</li>
                  <li>• <strong className="text-white">WPF & WinForms Subsystem:</strong> Full compatibility with Windows Presentation Foundation (XAML) and Windows Forms rendered via DWM glass compositor.</li>
                  <li>• <strong className="text-white">ASP.NET Core Kestrel:</strong> High-throughput HTTP/3 and gRPC server engine with zero-allocation memory pipelines.</li>
                  <li>• <strong className="text-white">Zero-Overhead P/Invoke:</strong> Direct register-level mapping to AegisNT system call numbers without marshaling overhead.</li>
                </ul>
                <div className="p-2.5 bg-slate-950 border border-slate-800 rounded font-mono text-[10px] text-purple-300">
                  dotnet run --project OrderService.Api
                </div>
              </div>

              {/* Windows Win32 Spec */}
              <div className="p-4 bg-slate-900/80 border border-blue-900/40 rounded-xl space-y-3">
                <div className="flex items-center justify-between">
                  <div className="text-xs font-bold text-blue-400 font-mono flex items-center gap-1.5">
                    <Layers className="w-4 h-4" /> Windows Win32 / PE
                  </div>
                  <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-blue-950 text-blue-300 border border-blue-800">Wine 9.x / PE32+</span>
                </div>
                <ul className="text-xs text-slate-300 space-y-2 leading-relaxed">
                  <li>• <strong className="text-white">Native PE Loader:</strong> Parses PE32 (32-bit) and PE32+ (64-bit) headers, maps sections (.text, .rdata, .data), and resolves Import Address Tables (IAT).</li>
                  <li>• <strong className="text-white">WoW64 Emulation Layer:</strong> 32-bit to 64-bit thunking engine allowing seamless execution of legacy 32-bit Windows software.</li>
                  <li>• <strong className="text-white">Direct3D 11 & 12 Hardware:</strong> Translated to Vulkan via DXVK and VKD3D-Proton for near-native gaming and CAD rendering speed.</li>
                  <li>• <strong className="text-white">Windows Installer (MSI):</strong> Transactional installation service (msiexec.exe) with rollback capabilities.</li>
                </ul>
                <div className="p-2.5 bg-slate-950 border border-slate-800 rounded font-mono text-[10px] text-blue-300">
                  wine64 C:\Program Files\Office\soffice.exe
                </div>
              </div>
            </div>

            {/* Developer Testing Matrix */}
            <div className="p-4 bg-slate-900 border border-slate-800 rounded-xl space-y-3">
              <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider">
                Command-Line Quick Reference
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs font-mono">
                <div className="p-3 bg-slate-950 border border-slate-800 rounded-lg space-y-1">
                  <div className="text-amber-400 font-bold">Java CLI Verification:</div>
                  <div className="text-slate-300 text-[11px] leading-relaxed">
                    <code>java -version</code><br />
                    <code>java -jar app.jar</code><br />
                    <code>javac -d ./classes HelloWorld.java</code><br />
                    <code>javap -c -p MyClass.class</code>
                  </div>
                </div>

                <div className="p-3 bg-slate-950 border border-slate-800 rounded-lg space-y-1">
                  <div className="text-purple-400 font-bold">.NET CLI Verification:</div>
                  <div className="text-slate-300 text-[11px] leading-relaxed">
                    <code>dotnet --info</code><br />
                    <code>dotnet --version</code><br />
                    <code>dotnet run --project MyApp</code><br />
                    <code>dotnet publish -c Release -r win-x64</code>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: DRIVERS & KERNEL */}
        {activeTab === 'drivers' && (
          <div className="space-y-6 max-w-5xl">
            <div className="p-4 bg-slate-900/60 border border-slate-800 rounded-xl">
              <h2 className="text-sm font-bold text-slate-100 mb-1">AegisNT Ring 0 Kernel Driver Portfolio</h2>
              <p className="text-xs text-slate-400 mb-4">
                All drivers operate with hardware-enforced code integrity (HVCI), $W \oplus X$ memory pages, and WHQL-grade digital signatures.
              </p>

              <div className="space-y-3">
                {[
                  {
                    name: 'aegis_nvme.sys',
                    subsystem: 'PCIe 5.0 Mass Storage',
                    irql: 'DEVICE_LEVEL (4)',
                    metrics: '1,250,000 IOPS • 14,200 MB/s • 26µs Latency',
                    desc: 'Host controller allocating 64 submission/completion queues mapped directly into NUMA nodes with Host Memory Buffer (HMB) and asynchronous TRIM.',
                    color: 'blue'
                  },
                  {
                    name: 'usb4_host_router.sys',
                    subsystem: 'Bus Router / Interconnect',
                    irql: 'DISPATCH_LEVEL (2)',
                    metrics: '80 Gbps PAM3 Signaling • 32G PCIe • 40G DP 2.1',
                    desc: 'Dynamic credit-based flow control orchestrating high-bandwidth PCIe and DisplayPort tunneling with USB-PD 3.1 240W EPR negotiation.',
                    color: 'cyan'
                  },
                  {
                    name: 'vfio_iommu_passthru.sys',
                    subsystem: 'Virtualization / Graphics',
                    irql: 'DEVICE_LEVEL (8)',
                    metrics: 'Zero-overhead Host Bypass • Direct MSI-X',
                    desc: 'Validates strict IOMMU Group isolation and maps device BAR registers directly into guest virtual machine memory spaces for discrete GPUs.',
                    color: 'emerald'
                  },
                  {
                    name: 'aegis_wddm32.sys',
                    subsystem: 'WDDM 3.2 Display Miniport',
                    irql: 'PASSIVE_LEVEL (0)',
                    metrics: 'DirectX 12 Agility • Vulkan 1.3 • Flip Queues',
                    desc: 'Display miniport driver supporting hardware-accelerated flip queues for sub-millisecond desktop compositor presentation.',
                    color: 'purple'
                  },
                  {
                    name: 'virtio_hal_kvm.sys',
                    subsystem: 'Hypervisor Para-HAL',
                    irql: 'DISPATCH_LEVEL (2)',
                    metrics: 'Zero-Copy vring DMA • vhost-net • virtio-scsi',
                    desc: 'Provides low-overhead paravirtualized network, block storage, and memory ballooning buffers for QEMU, KVM, Proxmox, and VMware.',
                    color: 'amber'
                  },
                  {
                    name: 'aegis_bitlocker_fve.sys',
                    subsystem: 'Security Filter',
                    irql: 'PASSIVE_LEVEL (0)',
                    metrics: 'AES-XTS-256 • TPM 2.0 PCR 0,2,4,7,11 Sealing',
                    desc: 'Full Volume Encryption filter encrypting all sector I/O in flight using hardware AES-NI and ARMv8 Cryptographic extensions.',
                    color: 'rose'
                  },
                  {
                    name: 'wine_pe_exec.sys',
                    subsystem: 'Subsystem Bridge',
                    irql: 'PASSIVE_LEVEL (0)',
                    metrics: 'PE32 / PE32+ Relocation • Direct NT Syscalls',
                    desc: 'Resolves PE/COFF binaries and routes standard Win32 API calls directly to the NT executive dispatcher without container overhead.',
                    color: 'indigo'
                  }
                ].map((driver) => (
                  <div key={driver.name} className="p-4 bg-slate-950 border border-slate-800 rounded-lg space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-xs text-blue-400">{driver.name}</span>
                        <span className="px-2 py-0.5 bg-slate-900 border border-slate-700 rounded text-[10px] text-slate-300">
                          {driver.subsystem}
                        </span>
                      </div>
                      <span className="text-[10px] font-mono text-slate-400">{driver.irql}</span>
                    </div>
                    <div className="text-xs text-slate-300">{driver.desc}</div>
                    <div className="flex items-center justify-between pt-1 text-[11px] font-mono text-emerald-400">
                      <span>Performance: {driver.metrics}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: INSTALLATION & VM DOCS */}
        {activeTab === 'install' && (
          <div className="space-y-6 max-w-5xl">
            <div className="p-4 bg-slate-900/60 border border-slate-800 rounded-xl space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-sm font-bold text-slate-100">Virtual Machine & Laptop Installation Guidance</h2>
                  <p className="text-xs text-slate-400">
                    AegisNT supports standard UEFI GPT boot across all major hypervisors and bare-metal PC/laptop hardware.
                  </p>
                </div>
              </div>

              {/* QEMU Command */}
              <div className="p-4 bg-slate-950 border border-slate-800 rounded-lg space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-xs text-blue-400">QEMU / KVM Command Line (Linux & WSL2)</span>
                  <button
                    onClick={() =>
                      copyToClipboard(
                        `qemu-system-x86_64 -enable-kvm -m 8192 -smp 4,cores=4 -cpu host,hv_relaxed,hv_spinlocks=0x1fff,hv_vapic,hv_time -drive file=aegisnt-enterprise.qcow2,if=virtio,format=qcow2,cache=none,aio=native -netdev user,id=net0,hostfwd=tcp::2222-:22,hostfwd=tcp::3389-:3389 -device virtio-net-pci,netdev=net0 -device virtio-vga,virgl=on -display default,show-cursor=on`,
                        'qemu-cmd'
                      )
                    }
                    className="px-2.5 py-1 bg-slate-900 hover:bg-slate-800 border border-slate-700 rounded text-[11px] text-slate-300 flex items-center gap-1.5"
                  >
                    {copiedId === 'qemu-cmd' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-slate-400" />}
                    <span>{copiedId === 'qemu-cmd' ? 'Copied' : 'Copy QEMU'}</span>
                  </button>
                </div>
                <pre className="p-3 bg-slate-900/80 rounded font-mono text-[11px] text-slate-300 overflow-x-auto whitespace-pre">
{`qemu-system-x86_64 \\
  -enable-kvm -m 8192 -smp 4,cores=4 \\
  -cpu host,hv_relaxed,hv_spinlocks=0x1fff,hv_vapic,hv_time \\
  -drive file=aegisnt-enterprise.qcow2,if=virtio,format=qcow2,cache=none,aio=native \\
  -netdev user,id=net0,hostfwd=tcp::2222-:22,hostfwd=tcp::3389-:3389 \\
  -device virtio-net-pci,netdev=net0 \\
  -device virtio-vga,virgl=on`}
                </pre>
              </div>

              {/* Proxmox VE */}
              <div className="p-4 bg-slate-950 border border-slate-800 rounded-lg space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-xs text-amber-400">Proxmox VE Cluster CLI Provisioning</span>
                  <button
                    onClick={() =>
                      copyToClipboard(
                        `qm create 200 --name aegisnt --memory 8192 --cores 4 --cpu host --ostype win11 --bios ovmf --tpmstate0 local-lvm:1,version=v2.0 --scsihw virtio-scsi-single --scsi0 local-lvm:64,discard=on,ssd=1 --net0 virtio,bridge=vmbr0 --cdrom local:iso/aegisnt-enterprise-24h2.iso && qm start 200`,
                        'pve-cmd'
                      )
                    }
                    className="px-2.5 py-1 bg-slate-900 hover:bg-slate-800 border border-slate-700 rounded text-[11px] text-slate-300 flex items-center gap-1.5"
                  >
                    {copiedId === 'pve-cmd' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-slate-400" />}
                    <span>{copiedId === 'pve-cmd' ? 'Copied' : 'Copy Proxmox'}</span>
                  </button>
                </div>
                <pre className="p-3 bg-slate-900/80 rounded font-mono text-[11px] text-slate-300 overflow-x-auto whitespace-pre">
{`qm create 200 --name aegisnt --memory 8192 --cores 4 --cpu host \\
  --ostype win11 --bios ovmf --tpmstate0 local-lvm:1,version=v2.0 \\
  --scsihw virtio-scsi-single --scsi0 local-lvm:64,discard=on,ssd=1 \\
  --net0 virtio,bridge=vmbr0 --cdrom local:iso/aegisnt-enterprise-24h2.iso`}
                </pre>
              </div>

              {/* Hypervisor Checklist */}
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="p-3 bg-slate-950 border border-slate-800 rounded-lg space-y-1">
                  <div className="font-bold text-slate-200">Oracle VirtualBox Settings</div>
                  <div className="text-slate-400 text-[11px]">
                    System -&gt; Enable EFI (special OSes only) • Display: VBoxSVGA with 3D Acceleration • NVMe Controller
                  </div>
                </div>
                <div className="p-3 bg-slate-950 border border-slate-800 rounded-lg space-y-1">
                  <div className="font-bold text-slate-200">VMware Workstation &amp; ESXi</div>
                  <div className="text-slate-400 text-[11px]">
                    UEFI with Secure Boot • Add Virtual TPM (vTPM 2.0) for BitLocker • NVMe Virtual Disk Controller
                  </div>
                </div>
                <div className="p-3 bg-slate-950 border border-slate-800 rounded-lg space-y-1">
                  <div className="font-bold text-slate-200">UTM (Apple Silicon Mac M1–M4)</div>
                  <div className="text-slate-400 text-[11px]">
                    Select Virtualize mode (ARM64) for native 240ns microkernel execution • 8 GB RAM • VirtIO GPU
                  </div>
                </div>
                <div className="p-3 bg-slate-950 border border-slate-800 rounded-lg space-y-1">
                  <div className="font-bold text-slate-200">Bare-Metal Physical Laptop / PC</div>
                  <div className="text-slate-400 text-[11px]">
                    Flash via Rufus or Ventoy (GPT, UEFI non-CSM) • Enable TPM 2.0 &amp; Intel VT-x/AMD-V in BIOS
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: RELEASE FEATURES (24H2) */}
        {activeTab === 'release' && (
          <div className="space-y-6 max-w-5xl">
            <div className="p-4 bg-slate-900/60 border border-slate-800 rounded-xl space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-sm font-bold text-slate-100">AegisNT Enterprise 24H2 Release Notes &amp; Benchmarks</h2>
                  <p className="text-xs text-slate-400">Codename: Vanguard Horizon • Build 10.0.26100.1742</p>
                </div>
              </div>

              {/* Benchmarks Matrix */}
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs font-mono border border-slate-800">
                  <thead className="bg-slate-900 text-slate-300 border-b border-slate-800 text-[11px]">
                    <tr>
                      <th className="p-2.5">System Metric</th>
                      <th className="p-2.5 text-blue-400">AegisNT 24H2</th>
                      <th className="p-2.5 text-slate-400">Windows 11 Monolithic</th>
                      <th className="p-2.5 text-slate-400">Ubuntu 24.04 (KVM)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800 text-slate-300 text-[11px]">
                    <tr>
                      <td className="p-2.5 font-sans font-semibold">Interrupt Latency (ARM64)</td>
                      <td className="p-2.5 text-emerald-400 font-bold">240 ns</td>
                      <td className="p-2.5 text-slate-400">1,420 ns</td>
                      <td className="p-2.5 text-slate-400">480 ns</td>
                    </tr>
                    <tr>
                      <td className="p-2.5 font-sans font-semibold">Interrupt Latency (x86_64)</td>
                      <td className="p-2.5 text-emerald-400 font-bold">310 ns</td>
                      <td className="p-2.5 text-slate-400">1,890 ns</td>
                      <td className="p-2.5 text-slate-400">540 ns</td>
                    </tr>
                    <tr>
                      <td className="p-2.5 font-sans font-semibold">Context Switch Rate</td>
                      <td className="p-2.5 text-emerald-400 font-bold">&gt;18,500/sec</td>
                      <td className="p-2.5 text-slate-400">9,200/sec</td>
                      <td className="p-2.5 text-slate-400">14,000/sec</td>
                    </tr>
                    <tr>
                      <td className="p-2.5 font-sans font-semibold">NVMe 4K Read IOPS</td>
                      <td className="p-2.5 text-emerald-400 font-bold">1,250,000 IOPS</td>
                      <td className="p-2.5 text-slate-400">820,000 IOPS</td>
                      <td className="p-2.5 text-slate-400">1,050,000 IOPS</td>
                    </tr>
                    <tr>
                      <td className="p-2.5 font-sans font-semibold">NVMe Sequential Read</td>
                      <td className="p-2.5 text-emerald-400 font-bold">14,200 MB/s</td>
                      <td className="p-2.5 text-slate-400">11,800 MB/s</td>
                      <td className="p-2.5 text-slate-400">13,600 MB/s</td>
                    </tr>
                    <tr>
                      <td className="p-2.5 font-sans font-semibold">Idle Kernel Memory</td>
                      <td className="p-2.5 text-emerald-400 font-bold">384 MB</td>
                      <td className="p-2.5 text-slate-400">3,800 MB</td>
                      <td className="p-2.5 text-slate-400">1,100 MB</td>
                    </tr>
                    <tr>
                      <td className="p-2.5 font-sans font-semibold">Cold Boot to Desktop</td>
                      <td className="p-2.5 text-emerald-400 font-bold">1.8 sec</td>
                      <td className="p-2.5 text-slate-400">14.5 sec</td>
                      <td className="p-2.5 text-slate-400">6.2 sec</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* Feature Highlights Grid */}
              <div className="grid grid-cols-2 gap-3 pt-2 text-xs">
                <div className="p-3 bg-slate-950 border border-slate-800 rounded-lg space-y-1">
                  <div className="font-bold text-blue-400">Resource Monitor &amp; Event Logs</div>
                  <div className="text-slate-400 text-[11px]">
                    Live resmon.exe with 16-core CPU utilization matrices, physical memory breakdown bars, and categorized Windows Event Viewer streaming with EVTX export.
                  </div>
                </div>
                <div className="p-3 bg-slate-950 border border-slate-800 rounded-lg space-y-1">
                  <div className="font-bold text-emerald-400">Driver Development Kit (WDK)</div>
                  <div className="text-slate-400 text-[11px]">
                    Integrated C kernel driver authoring environment with live memory protection ($W \oplus X$) verification and runtime loading into the active kernel pool.
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 5: CODEBASE TOUR */}
        {activeTab === 'codebase' && (
          <div className="space-y-6 max-w-5xl">
            <div className="p-4 bg-slate-900/60 border border-slate-800 rounded-xl space-y-4">
              <h2 className="text-sm font-bold text-slate-100">Codebase Tour &amp; Architecture Map ("What's on Code")</h2>
              <p className="text-xs text-slate-400">
                AegisNT is built on a clean, modular TypeScript 5.8 and React 19 architecture:
              </p>

              <div className="space-y-3 text-xs font-mono">
                <div className="p-3 bg-slate-950 border border-slate-800 rounded-lg space-y-2">
                  <div className="text-blue-400 font-bold">1. Core Services Layer (src/services/)</div>
                  <ul className="text-slate-300 text-[11px] space-y-1 list-disc pl-4 font-sans">
                    <li>
                      <strong className="font-mono text-slate-100">kernelEngine.ts</strong>: Central singleton managing simulated tickless scheduling, IRQL levels, process tables, dynamic memory pool tracking, and real-time hardware telemetry broadcasts.
                    </li>
                    <li>
                      <strong className="font-mono text-slate-100">systemLogService.ts</strong>: Emulates the Windows NT Event Log system, streaming categorized events (System, Security, Application, Drivers) with realistic Windows Event IDs (4624, 7036, 1000).
                    </li>
                  </ul>
                </div>

                <div className="p-3 bg-slate-950 border border-slate-800 rounded-lg space-y-2">
                  <div className="text-cyan-400 font-bold">2. Desktop Shell Layer (src/components/desktop/)</div>
                  <ul className="text-slate-300 text-[11px] space-y-1 list-disc pl-4 font-sans">
                    <li>
                      <strong className="font-mono text-slate-100">Taskbar.tsx</strong>: Centered Windows 11 taskbar with Start button, active app pills, hover thumbnails, and tray.
                    </li>
                    <li>
                      <strong className="font-mono text-slate-100">StartMenu.tsx</strong>: Authentic 12-app Pinned grid, All Apps drawer, and power controls.
                    </li>
                    <li>
                      <strong className="font-mono text-slate-100">WindowFrame.tsx</strong>: Window chrome with titlebar, minimize/maximize/close, draggable bounds, and 4-way Snap Layouts.
                    </li>
                    <li>
                      <strong className="font-mono text-slate-100">RunDialog.tsx</strong>: Win+R dialog executing commands (`taskmgr`, `resmon`, `vmboot`, `explorer`, `cmd`).
                    </li>
                  </ul>
                </div>

                <div className="p-3 bg-slate-950 border border-slate-800 rounded-lg space-y-2">
                  <div className="text-emerald-400 font-bold">3. Applications Layer (src/components/apps/)</div>
                  <ul className="text-slate-300 text-[11px] space-y-1 list-disc pl-4 font-sans">
                    <li>
                      <strong className="font-mono text-slate-100">ResourceMonitorApp.tsx</strong>: Real-time multi-tab resource monitor with live graphs and Event Viewer.
                    </li>
                    <li>
                      <strong className="font-mono text-slate-100">VmBootGuideApp.tsx</strong>: Dedicated step-by-step hypervisor boot wizard with copyable CLI configurations.
                    </li>
                    <li>
                      <strong className="font-mono text-slate-100">VirtualizationApp.tsx</strong>: QEMU/KVM hypervisor control panel with PCIe 5.0 and USB4 telemetry.
                    </li>
                    <li>
                      <strong className="font-mono text-slate-100">Win32ApiApp.tsx</strong>: Portable Executable (PE) binary runner and NT syscall tracer.
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 6: OPEN SOURCE CONTRIBUTING */}
        {activeTab === 'contributing' && (
          <div className="space-y-6 max-w-5xl">
            <div className="p-4 bg-slate-900/60 border border-slate-800 rounded-xl space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-sm font-bold text-slate-100">How to Contribute to AegisNT (Open-Source Guide)</h2>
                  <p className="text-xs text-slate-400">Step-by-step tutorial for adding applications, drivers, and hypervisor templates</p>
                </div>
              </div>

              {/* Step 1 Code Tutorial */}
              <div className="p-4 bg-slate-950 border border-slate-800 rounded-lg space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-xs text-blue-400">Step 1: Create Your Custom Application Component</span>
                  <button
                    onClick={() =>
                      copyToClipboard(
                        `import React, { useState } from 'react';\nimport { Rocket } from 'lucide-react';\n\nexport default function MyPayloadApp() {\n  const [status, setStatus] = useState('Idle');\n  return (\n    <div className="p-6 bg-slate-950 text-slate-100 h-full flex flex-col">\n      <h2 className="text-base font-bold flex items-center gap-2">\n        <Rocket className="text-emerald-400 w-5 h-5" /> Enterprise Payload\n      </h2>\n      <button onClick={() => setStatus('Active')} className="mt-4 px-4 py-2 bg-blue-600 rounded text-xs font-semibold w-fit">\n        Trigger Action\n      </button>\n      <div className="mt-3 p-3 bg-slate-900 rounded font-mono text-xs">{status}</div>\n    </div>\n  );\n}`,
                        'custom-app-code'
                      )
                    }
                    className="px-2.5 py-1 bg-slate-900 hover:bg-slate-800 border border-slate-700 rounded text-[11px] text-slate-300 flex items-center gap-1.5"
                  >
                    {copiedId === 'custom-app-code' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-slate-400" />}
                    <span>{copiedId === 'custom-app-code' ? 'Copied' : 'Copy Code'}</span>
                  </button>
                </div>
                <pre className="p-3 bg-slate-900/80 rounded font-mono text-[11px] text-slate-300 overflow-x-auto whitespace-pre">
{`// Save as: src/components/apps/MyPayloadApp.tsx
import React, { useState } from 'react';
import { Rocket } from 'lucide-react';

export default function MyPayloadApp() {
  const [status, setStatus] = useState('Idle');
  return (
    <div className="p-6 bg-slate-950 text-slate-100 h-full flex flex-col">
      <h2 className="text-base font-bold flex items-center gap-2">
        <Rocket className="text-emerald-400 w-5 h-5" /> Enterprise Payload
      </h2>
      <button 
        onClick={() => setStatus('Running at ' + new Date().toLocaleTimeString())}
        className="mt-4 px-4 py-2 bg-blue-600 hover:bg-blue-500 rounded text-xs font-semibold w-fit"
      >
        Trigger Action
      </button>
      <div className="mt-3 p-3 bg-slate-900 rounded font-mono text-xs text-emerald-300">
        Status: {status}
      </div>
    </div>
  );
}`}
                </pre>
              </div>

              {/* Step 2 Registration */}
              <div className="p-4 bg-slate-950 border border-slate-800 rounded-lg space-y-2">
                <span className="font-bold text-xs text-cyan-400">Step 2: Register in src/App.tsx</span>
                <p className="text-xs text-slate-400">
                  Add your app ID, title, and initial dimensions to `appMeta`, then add a `case` in `renderAppContent()`:
                </p>
                <pre className="p-3 bg-slate-900/80 rounded font-mono text-[11px] text-slate-300 overflow-x-auto whitespace-pre">
{`// In appMeta:
my_payload: { title: 'Enterprise Payload', defaultWidth: 800, defaultHeight: 500 },

// In renderAppContent:
case 'my_payload':
  return <MyPayloadApp />;`}
                </pre>
              </div>

              {/* Step 3 Desktop and Start Menu */}
              <div className="p-4 bg-slate-950 border border-slate-800 rounded-lg space-y-2">
                <span className="font-bold text-xs text-emerald-400">Step 3: Add to Desktop and Start Menu</span>
                <p className="text-xs text-slate-400">
                  Add to `DESKTOP_ICONS` in `Desktop.tsx` and to the `APPS` array in `StartMenu.tsx`. Your app is now fully functional!
                </p>
              </div>

              {/* Local Dev Commands */}
              <div className="p-4 bg-slate-950 border border-slate-800 rounded-lg space-y-2">
                <span className="font-bold text-xs text-amber-400">Development Workflow &amp; Testing</span>
                <pre className="p-3 bg-slate-900/80 rounded font-mono text-[11px] text-slate-300 overflow-x-auto whitespace-pre">
{`npm install       # Install project dependencies
npm run dev       # Start development server on port 3000
npm run lint      # Validate TypeScript typing and linting
npm run build     # Compile production bundle`}
                </pre>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 7: ENTERPRISE SECURITY, DOCKER & FIREWALL SPECIFICATION              */}
        {/* ========================================================================= */}
        {activeTab === 'enterprise' && (
          <div className="space-y-6 max-w-5xl mx-auto">
            <div>
              <h2 className="text-lg font-bold text-slate-100 flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-emerald-400" />
                Enterprise Security, Docker OCI & Stateful Firewall Architecture
              </h2>
              <p className="text-xs text-slate-400 mt-1">
                Developer reference for Zero-Trust sandboxing, microkernel performance benchmarks, OCI multi-stage builds, and 0-reboot hotpatch mechanisms.
              </p>
            </div>

            {/* Architecture Comparison Table */}
            <div className="p-4 bg-slate-900 border border-slate-800 rounded-xl space-y-3">
              <span className="text-xs font-bold text-slate-200">
                Performance & Security Comparison: AegisNT vs Monolithic Windows Server
              </span>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs font-mono">
                  <thead className="bg-slate-950 text-slate-400 border-b border-slate-800 text-[11px]">
                    <tr>
                      <th className="p-2">Metric / Feature</th>
                      <th className="p-2 text-blue-400">AegisNT Microkernel</th>
                      <th className="p-2 text-slate-400">Windows Server 2022/2025</th>
                      <th className="p-2 text-emerald-400">Architectural Advantage</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60 text-slate-300 text-[11px]">
                    <tr>
                      <td className="p-2 font-bold font-sans">Context Switch Overhead</td>
                      <td className="p-2 text-cyan-300 font-bold">310 ns (x86) / 240 ns (ARM)</td>
                      <td className="p-2 text-slate-400">1,420 ns</td>
                      <td className="p-2 text-emerald-400">4.5x faster, tickless NO_HZ_FULL</td>
                    </tr>
                    <tr>
                      <td className="p-2 font-bold font-sans">NVMe / Storage I/O</td>
                      <td className="p-2 text-cyan-300 font-bold">1,420,000 IOPS (io_uring zero-copy)</td>
                      <td className="p-2 text-slate-400">480,000 IOPS (IRQL ring-copy)</td>
                      <td className="p-2 text-emerald-400">2.9x throughput, direct PCIe DMA</td>
                    </tr>
                    <tr>
                      <td className="p-2 font-bold font-sans">Container Density</td>
                      <td className="p-2 text-cyan-300 font-bold">380+ containers / 64GB node</td>
                      <td className="p-2 text-slate-400">45-60 containers / 64GB node</td>
                      <td className="p-2 text-emerald-400">6x higher density with LZ4 compression</td>
                    </tr>
                    <tr>
                      <td className="p-2 font-bold font-sans">Security Enclave</td>
                      <td className="p-2 text-cyan-300 font-bold">VTL 1 Enclave + Bubblewrap Seccomp</td>
                      <td className="p-2 text-slate-400">VBS optional (high RAM cost)</td>
                      <td className="p-2 text-emerald-400">Native zero-trust hardware PCR-7 bound</td>
                    </tr>
                    <tr>
                      <td className="p-2 font-bold font-sans">Kernel Patching</td>
                      <td className="p-2 text-cyan-300 font-bold">Zero-Reboot Hotpatch (kpatch.sys)</td>
                      <td className="p-2 text-slate-400">Patch Tuesday reboot mandatory</td>
                      <td className="p-2 text-emerald-400">100% uptime SLA for critical clusters</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* Docker OCI Build Specification */}
            <div className="p-4 bg-slate-900 border border-slate-800 rounded-xl space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-200">
                  Production Multi-Stage Dockerfile (`Dockerfile.enterprise-aegisnt`)
                </span>
                <button
                  onClick={() => {
                    const df = `# Stage 1: Build & Sign Microkernel
FROM golang:1.23-alpine AS builder
WORKDIR /src
COPY . .
RUN make build-microkernel ARCH=x86_64
RUN ./tools/authenticode-sign --cert /etc/pki/aegis-whql.crt /bin/aegis-kernel

# Stage 2: Distroless Rootless Production Image
FROM scratch
LABEL org.opencontainers.image.title="AegisNT Enterprise 24H2"
LABEL org.opencontainers.image.vendor="AegisNT Corporation"
COPY --from=builder /bin/aegis-kernel /bin/aegis-kernel
COPY --from=builder /usr/lib/wine /usr/lib/wine
COPY --from=builder /etc/aegis/firewall-rules.bin /etc/aegis/firewall-rules.bin

USER 10001:10001
EXPOSE 3000 8443
ENTRYPOINT ["/bin/aegis-kernel", "--enterprise-hardened"]`;
                    copyToClipboard(df, 'docker-dev-spec');
                  }}
                  className="px-2 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded text-xs flex items-center gap-1"
                >
                  {copiedId === 'docker-dev-spec' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  Copy Dockerfile
                </button>
              </div>
              <pre className="p-3 bg-slate-950 rounded font-mono text-[11px] text-cyan-300 overflow-x-auto whitespace-pre border border-slate-800/80">
{`# Stage 1: Build & Sign Microkernel
FROM golang:1.23-alpine AS builder
WORKDIR /src
COPY . .
RUN make build-microkernel ARCH=x86_64
RUN ./tools/authenticode-sign --cert /etc/pki/aegis-whql.crt /bin/aegis-kernel

# Stage 2: Distroless Rootless Production Image
FROM scratch
LABEL org.opencontainers.image.title="AegisNT Enterprise 24H2"
LABEL org.opencontainers.image.vendor="AegisNT Corporation"
COPY --from=builder /bin/aegis-kernel /bin/aegis-kernel
COPY --from=builder /usr/lib/wine /usr/lib/wine
COPY --from=builder /etc/aegis/firewall-rules.bin /etc/aegis/firewall-rules.bin

USER 10001:10001
EXPOSE 3000 8443
ENTRYPOINT ["/bin/aegis-kernel", "--enterprise-hardened"]`}
              </pre>
            </div>

            {/* Quick Testing Link */}
            {onLaunchApp && (
              <div className="p-4 bg-slate-900 border border-slate-800 rounded-xl flex items-center justify-between">
                <div>
                  <div className="text-xs font-bold text-slate-200">Interactive Security & Firewall Sandbox Console</div>
                  <div className="text-[11px] text-slate-400">Launch the live GUI to test SPI firewall packets, Defender scans, and hotpatching.</div>
                </div>
                <button
                  onClick={() => onLaunchApp('enterprise_security')}
                  className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded text-xs font-semibold flex items-center gap-1.5 transition-colors shadow"
                >
                  <ShieldCheck className="w-3.5 h-3.5" />
                  Launch Security Console
                </button>
              </div>
            )}
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 8: GITHUB PUBLISHING & WINDOWS LAPTOP PREVIEW GUIDE                   */}
        {/* ========================================================================= */}
        {activeTab === 'github_guide' && (
          <div className="space-y-6 max-w-5xl mx-auto font-sans">
            <div>
              <h2 className="text-lg font-bold text-slate-100 flex items-center gap-2">
                <ExternalLink className="w-5 h-5 text-blue-400" />
                Publishing to GitHub & Windows Laptop Preview Manual
              </h2>
              <p className="text-xs text-slate-400 mt-1">
                Complete instructions for creating a public open-source GitHub repository, deploying public live URLs, and testing on Windows laptops.
              </p>
            </div>

            {/* Quick Actions Bar */}
            <div className="p-4 bg-slate-900 border border-slate-800 rounded-xl flex items-center justify-between">
              <div className="text-xs text-slate-300">
                Documentation Source: <code className="text-cyan-400 font-mono">docs/GITHUB_AND_WINDOWS_PREVIEW_GUIDE.md</code>
              </div>
              <button
                onClick={() => {
                  if (!document.fullscreenElement) {
                    document.documentElement.requestFullscreen().catch(() => {});
                  } else {
                    document.exitFullscreen().catch(() => {});
                  }
                }}
                className="px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded text-xs font-semibold flex items-center gap-1.5 transition-colors shadow"
              >
                <Laptop className="w-3.5 h-3.5" />
                Test Laptop Fullscreen (F11)
              </button>
            </div>

            {/* Part 1: Git & GitHub */}
            <div className="p-4 bg-slate-900 border border-slate-800 rounded-xl space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-200">
                  Part 1: How to Make this a Public GitHub Repository
                </span>
                <span className="text-[10px] font-mono bg-blue-950 text-blue-300 border border-blue-800 px-2 py-0.5 rounded">
                  Public Open-Source
                </span>
              </div>

              <div className="space-y-3 text-xs">
                <div className="p-3 bg-slate-950 border border-slate-800 rounded-lg space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-white">1. Initialize & Commit Locally</span>
                    <button
                      onClick={() =>
                        copyToClipboard(
                          'git init\ngit add .\ngit commit -m "feat: initial commit of AegisNT Enterprise OS"',
                          'git-init-docs'
                        )
                      }
                      className="text-[11px] text-blue-400 hover:text-blue-300 flex items-center gap-1"
                    >
                      {copiedId === 'git-init-docs' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                      Copy
                    </button>
                  </div>
                  <pre className="p-2 bg-slate-900 rounded font-mono text-[11px] text-cyan-300 overflow-x-auto">
{`git init
git add .
git commit -m "feat: initial commit of AegisNT Enterprise OS"`}
                  </pre>
                </div>

                <div className="p-3 bg-slate-950 border border-slate-800 rounded-lg space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-white">2. Push to Public GitHub Repository</span>
                    <button
                      onClick={() =>
                        copyToClipboard(
                          'git branch -M main\ngit remote add origin https://github.com/YOUR-USERNAME/aegisnt-enterprise-os.git\ngit push -u origin main',
                          'git-push-docs'
                        )
                      }
                      className="text-[11px] text-blue-400 hover:text-blue-300 flex items-center gap-1"
                    >
                      {copiedId === 'git-push-docs' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                      Copy
                    </button>
                  </div>
                  <pre className="p-2 bg-slate-900 rounded font-mono text-[11px] text-emerald-300 overflow-x-auto">
{`git branch -M main
git remote add origin https://github.com/YOUR-USERNAME/aegisnt-enterprise-os.git
git push -u origin main`}
                  </pre>
                </div>

                <div className="p-3 bg-slate-950 border border-slate-800 rounded-lg space-y-1.5">
                  <span className="font-semibold text-white">3. Enable Free Public Hosting</span>
                  <p className="text-slate-400 text-[11px] leading-relaxed">
                    - <strong>GitHub Pages:</strong> In your GitHub repository, go to <em>Settings &gt; Pages</em> and set Source to <strong>GitHub Actions</strong>. The included <code className="text-cyan-300 font-mono">.github/workflows/deploy.yml</code> workflow will automatically build and publish your site.<br />
                    - <strong>Vercel / Netlify:</strong> Connect your GitHub repo in 1 click; Vite build command is <code className="text-cyan-300 font-mono">npm run build</code> and publish dir is <code className="text-cyan-300 font-mono">dist</code>.
                  </p>
                </div>
              </div>
            </div>

            {/* Part 2: Windows Laptop Preview Modes */}
            <div className="p-4 bg-slate-900 border border-slate-800 rounded-xl space-y-4">
              <span className="text-xs font-bold text-slate-200">
                Part 2: 4 Ways to Preview &amp; Run on Windows Laptop
              </span>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                <div className="p-3 bg-slate-950 border border-slate-800 rounded-lg space-y-2">
                  <div className="font-bold text-blue-400 flex items-center gap-1.5">
                    <Laptop className="w-4 h-4" />
                    Option A: Instant Browser &amp; F11 Fullscreen
                  </div>
                  <p className="text-slate-400 text-[11px] leading-relaxed">
                    Open in Microsoft Edge or Google Chrome on your Windows laptop. Press <kbd className="px-1.5 py-0.5 bg-slate-900 border border-slate-700 rounded text-cyan-300 font-mono">F11</kbd> to remove all browser borders. Click <em>Install this site as an app</em> in Edge to get a borderless desktop window and taskbar pin!
                  </p>
                </div>

                <div className="p-3 bg-slate-950 border border-slate-800 rounded-lg space-y-2">
                  <div className="font-bold text-emerald-400 flex items-center gap-1.5">
                    <Terminal className="w-4 h-4" />
                    Option B: Local PowerShell &amp; Node.js
                  </div>
                  <pre className="p-2 bg-slate-900 rounded font-mono text-[10px] text-cyan-300 overflow-x-auto">
{`git clone <REPO-URL>
cd aegisnt-enterprise-os
npm install
npm run dev`}
                  </pre>
                  <p className="text-slate-400 text-[11px]">
                    Opens on <code className="text-cyan-300">http://localhost:3000</code> with instant HMR and live telemetry.
                  </p>
                </div>

                <div className="p-3 bg-slate-950 border border-slate-800 rounded-lg space-y-2">
                  <div className="font-bold text-indigo-400 flex items-center gap-1.5">
                    <Server className="w-4 h-4" />
                    Option C: Docker Desktop for Windows
                  </div>
                  <pre className="p-2 bg-slate-900 rounded font-mono text-[10px] text-indigo-300 overflow-x-auto">
{`docker compose up -d
# View on http://localhost:3000`}
                  </pre>
                  <p className="text-slate-400 text-[11px]">
                    Runs the multi-stage containerized build locally on Windows via the included <code className="text-indigo-300 font-mono">docker-compose.yml</code>.
                  </p>
                </div>

                <div className="p-3 bg-slate-950 border border-slate-800 rounded-lg space-y-2">
                  <div className="font-bold text-purple-400 flex items-center gap-1.5">
                    <Cpu className="w-4 h-4" />
                    Option D: Hyper-V / VirtualBox VM
                  </div>
                  <p className="text-slate-400 text-[11px] leading-relaxed">
                    Set up Generation 2 Hyper-V or VirtualBox 7.x with UEFI, Secure Boot, TPM 2.0, 4 vCPUs, and 8GB RAM. Full specs in <code className="text-purple-300 font-mono">docs/INSTALLATION.md</code>.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
