import React, { useState, useEffect } from 'react';
import {
  Cpu,
  Layers,
  Shield,
  HardDrive,
  Workflow,
  Activity,
  Zap,
  Lock,
  Terminal,
  RefreshCw,
  Server,
  Boxes,
  Compass,
  CheckCircle2,
  AlertTriangle
} from 'lucide-react';
import { KernelEngine } from '../../services/kernelEngine';
import { Architecture } from '../../types/os';

export default function KernelInspectorApp() {
  const engine = KernelEngine.getInstance();
  const [arch, setArch] = useState<Architecture>(engine.arch);
  const [activeTab, setActiveTab] = useState<'architecture' | 'objects' | 'processes' | 'memory' | 'hal'>('architecture');
  const [stats, setStats] = useState(engine.getStats());

  useEffect(() => {
    const timer = setInterval(() => {
      setStats(engine.getStats());
    }, 1200);
    return () => clearInterval(timer);
  }, []);

  const handleArchSwitch = (newArch: Architecture) => {
    engine.switchArchitecture(newArch);
    setArch(newArch);
    setStats(engine.getStats());
  };

  return (
    <div className="flex flex-col h-full bg-slate-950 text-slate-100 font-sans select-text">
      {/* Top Banner with Architecture Toggle */}
      <div className="flex items-center justify-between px-4 py-2.5 bg-slate-900 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div className="p-1.5 bg-blue-600/20 text-blue-400 rounded border border-blue-500/30">
            <Cpu className="w-5 h-5" />
          </div>
          <div>
            <div className="font-semibold text-sm flex items-center gap-2">
              AegisNT Microkernel Architecture Inspector
              <span className="px-2 py-0.5 text-[10px] font-mono bg-blue-950 border border-blue-600/50 text-blue-400 rounded-full font-bold">
                BUILD 26100.NT-HYBRID
              </span>
            </div>
            <div className="text-[11px] text-slate-400">
              Low-latency tickless executive with unified x86_64 & ARM64 HAL
            </div>
          </div>
        </div>

        {/* Dual Architecture Selector */}
        <div className="flex items-center gap-2 bg-slate-950 p-1 rounded-lg border border-slate-800">
          <span className="text-xs text-slate-400 px-2 font-medium">Target Architecture:</span>
          <button
            onClick={() => handleArchSwitch('x86_64')}
            className={`flex items-center gap-1.5 px-3 py-1 text-xs rounded font-medium transition-all ${
              arch === 'x86_64'
                ? 'bg-blue-600 text-white shadow-sm ring-1 ring-blue-400'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Boxes className="w-3.5 h-3.5" />
            x86_64 (AVX-512 / VT-x)
          </button>
          <button
            onClick={() => handleArchSwitch('arm64')}
            className={`flex items-center gap-1.5 px-3 py-1 text-xs rounded font-medium transition-all ${
              arch === 'arm64'
                ? 'bg-purple-600 text-white shadow-sm ring-1 ring-purple-400'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Zap className="w-3.5 h-3.5" />
            ARM64 (ARMv9 / GICv3)
          </button>
        </div>
      </div>

      {/* Real-time Subsystem Metrics Bar */}
      <div className="grid grid-cols-5 gap-2 px-4 py-2 bg-slate-900/60 border-b border-slate-800 text-xs">
        <div className="p-2 bg-slate-950/80 rounded border border-slate-800/80">
          <div className="text-slate-500 text-[10px]">SCHEDULER TICK</div>
          <div className="text-emerald-400 font-mono font-bold text-sm">
            {stats.schedulerTickNs} ns <span className="text-[10px] text-slate-400">(Tickless)</span>
          </div>
        </div>
        <div className="p-2 bg-slate-950/80 rounded border border-slate-800/80">
          <div className="text-slate-500 text-[10px]">INTERRUPT LATENCY</div>
          <div className="text-blue-400 font-mono font-bold text-sm">
            {stats.interruptLatencyNs} ns
          </div>
        </div>
        <div className="p-2 bg-slate-950/80 rounded border border-slate-800/80">
          <div className="text-slate-500 text-[10px]">CURRENT IRQL</div>
          <div className="text-purple-400 font-mono font-bold text-sm">
            PASSIVE_LEVEL (0)
          </div>
        </div>
        <div className="p-2 bg-slate-950/80 rounded border border-slate-800/80">
          <div className="text-slate-500 text-[10px]">NON-PAGED POOL</div>
          <div className="text-amber-400 font-mono font-bold text-sm">
            {stats.nonPagedPoolMb} MB Locked
          </div>
        </div>
        <div className="p-2 bg-slate-950/80 rounded border border-slate-800/80">
          <div className="text-slate-500 text-[10px]">OBJECT HANDLES</div>
          <div className="text-cyan-400 font-mono font-bold text-sm">
            {stats.handleCount.toLocaleString()} Active
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-800 px-4 bg-slate-900/40 text-xs font-medium">
        {[
          { id: 'architecture', label: 'NT Executive Rings & Layers', icon: Layers },
          { id: 'objects', label: 'Object Manager Namespace', icon: Compass },
          { id: 'processes', label: 'EPROCESS & Thread Queue', icon: Workflow },
          { id: 'memory', label: 'Virtual Memory (VMM) & Pools', icon: HardDrive },
          { id: 'hal', label: 'Hardware Abstraction Layer (HAL)', icon: Zap }
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 py-2 px-3 border-b-2 transition-all ${
                isActive
                  ? 'border-blue-500 text-blue-400 bg-slate-800/40'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Tab Content */}
      <div className="flex-1 overflow-y-auto p-4 bg-slate-950">
        {/* TAB 1: ARCHITECTURE RINGS */}
        {activeTab === 'architecture' && (
          <div className="space-y-4 max-w-5xl mx-auto">
            <div className="p-3 bg-blue-950/20 border border-blue-800/40 rounded-lg text-xs text-blue-300 flex items-center justify-between">
              <div>
                <strong>Active Microkernel Architecture:</strong>{' '}
                {arch === 'x86_64'
                  ? 'AMD64 / Intel VT-x 64-bit 4-Level Paging (CR3) with Advanced Programmable Interrupt Controller (x2APIC)'
                  : 'ARMv9-A 64-bit Translation Tables (TTBR0/TTBR1) with Generic Interrupt Controller v3 (GICv3)'}
              </div>
              <span className="px-2 py-0.5 bg-blue-900/60 text-blue-200 rounded font-mono text-[11px]">
                Zero IPC Latency Path
              </span>
            </div>

            {/* NT Layer Stack Diagram */}
            <div className="space-y-2">
              {/* Ring 3: User Mode */}
              <div className="border border-indigo-700/50 bg-indigo-950/30 rounded-lg p-3">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-indigo-400 uppercase tracking-wider flex items-center gap-1.5">
                    <Shield className="w-3.5 h-3.5" />
                    Ring 3 — User Mode Subsystems & Applications
                  </span>
                  <span className="text-[11px] text-indigo-300/70 font-mono">Unprivileged Space</span>
                </div>
                <div className="grid grid-cols-4 gap-2 text-xs">
                  <div className="p-2 bg-slate-900 border border-slate-800 rounded">
                    <div className="font-semibold text-slate-200">Win32 Subsystem</div>
                    <div className="text-[11px] text-slate-400">csrss.exe, win32k.sys, user32, gdi32</div>
                  </div>
                  <div className="p-2 bg-slate-900 border border-slate-800 rounded">
                    <div className="font-semibold text-emerald-400">Wine 9.x Compatibility Engine</div>
                    <div className="text-[11px] text-slate-400">Transparent PE32/PE64 binary loader</div>
                  </div>
                  <div className="p-2 bg-slate-900 border border-slate-800 rounded">
                    <div className="font-semibold text-slate-200">System Services</div>
                    <div className="text-[11px] text-slate-400">services.exe, lsass.exe, winrm, sshd</div>
                  </div>
                  <div className="p-2 bg-slate-900 border border-slate-800 rounded">
                    <div className="font-semibold text-amber-400">Enterprise Apps</div>
                    <div className="text-[11px] text-slate-400">LibreOffice Suite, QEMU KVM UI, DDK</div>
                  </div>
                </div>
              </div>

              {/* System Call Gate */}
              <div className="py-1 px-4 bg-slate-900 border-x border-slate-800 flex items-center justify-between text-[11px] font-mono text-cyan-400">
                <span>↓ SYSCALL / SYSENTER (x86_64: msr C0000082h) / SVC (ARM64: Exception Level EL1)</span>
                <span>Fast System Call Dispatcher (KiSystemCall64)</span>
              </div>

              {/* Ring 0: Executive Services */}
              <div className="border border-blue-700/50 bg-blue-950/30 rounded-lg p-3">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-blue-400 uppercase tracking-wider flex items-center gap-1.5">
                    <Boxes className="w-3.5 h-3.5" />
                    Ring 0 — NT Executive (ntoskrnl.exe)
                  </span>
                  <span className="text-[11px] text-blue-300/70 font-mono">Kernel Space</span>
                </div>
                <div className="grid grid-cols-3 gap-2 text-xs">
                  <div className="p-2 bg-slate-900/90 border border-slate-800 rounded">
                    <div className="font-semibold text-cyan-400">Object Manager (Ob)</div>
                    <div className="text-[11px] text-slate-400">Provides uniform naming and handles (\Device, \Driver)</div>
                  </div>
                  <div className="p-2 bg-slate-900/90 border border-slate-800 rounded">
                    <div className="font-semibold text-blue-400">Process & Thread Manager (Ps)</div>
                    <div className="text-[11px] text-slate-400">EPROCESS, ETHREAD, dynamic priority classes 0-31</div>
                  </div>
                  <div className="p-2 bg-slate-900/90 border border-slate-800 rounded">
                    <div className="font-semibold text-emerald-400">Security Reference Monitor (Se)</div>
                    <div className="text-[11px] text-slate-400">Hardware token validation, DACL / SACL audits</div>
                  </div>
                  <div className="p-2 bg-slate-900/90 border border-slate-800 rounded">
                    <div className="font-semibold text-purple-400">Virtual Memory Manager (Mm)</div>
                    <div className="text-[11px] text-slate-400">Paged / Non-Paged Pool, VAD Tree, W^X enforcement</div>
                  </div>
                  <div className="p-2 bg-slate-900/90 border border-slate-800 rounded">
                    <div className="font-semibold text-amber-400">I/O Manager (Io)</div>
                    <div className="text-[11px] text-slate-400">IRP packet dispatch, Fast I/O, I/O Completion Ports</div>
                  </div>
                  <div className="p-2 bg-slate-900/90 border border-slate-800 rounded">
                    <div className="font-semibold text-pink-400">Advanced Local Procedure Call (Alpc)</div>
                    <div className="text-[11px] text-slate-400">High-speed shared-memory IPC message queue</div>
                  </div>
                </div>
              </div>

              {/* Microkernel Core */}
              <div className="border border-purple-700/50 bg-purple-950/30 rounded-lg p-3">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-purple-400 uppercase tracking-wider flex items-center gap-1.5">
                    <Zap className="w-3.5 h-3.5" />
                    Microkernel Core (Ke)
                  </span>
                  <span className="text-[11px] text-purple-300/70 font-mono">Tickless Real-Time Dispatcher</span>
                </div>
                <div className="grid grid-cols-3 gap-2 text-xs">
                  <div className="p-2 bg-slate-900/90 border border-slate-800 rounded">
                    <div className="font-semibold text-slate-200">Thread Dispatcher & Scheduler</div>
                    <div className="text-[11px] text-slate-400">32 priority queues with anti-starvation boost</div>
                  </div>
                  <div className="p-2 bg-slate-900/90 border border-slate-800 rounded">
                    <div className="font-semibold text-slate-200">DPC / APC Queue</div>
                    <div className="text-[11px] text-slate-400">Deferred Procedure Calls at DISPATCH_LEVEL (2)</div>
                  </div>
                  <div className="p-2 bg-slate-900/90 border border-slate-800 rounded">
                    <div className="font-semibold text-slate-200">Interrupt Service Routines (ISRs)</div>
                    <div className="text-[11px] text-slate-400">Sub-microsecond hardware interrupt handling</div>
                  </div>
                </div>
              </div>

              {/* HAL Layer */}
              <div className="border border-emerald-700/50 bg-emerald-950/30 rounded-lg p-3">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
                    <Server className="w-3.5 h-3.5" />
                    Hardware Abstraction Layer (hal.dll / hal_arm64.dll)
                  </span>
                  <span className="text-[11px] text-emerald-300/70 font-mono">Bare-Metal & Hypervisor Interface</span>
                </div>
                <div className="grid grid-cols-4 gap-2 text-xs">
                  <div className="p-2 bg-slate-900/90 border border-slate-800 rounded">
                    <div className="font-semibold text-emerald-400">PCIe 5.0 NVMe Controller</div>
                    <div className="text-[11px] text-slate-400">Multi-queue doorbell registers</div>
                  </div>
                  <div className="p-2 bg-slate-900/90 border border-slate-800 rounded">
                    <div className="font-semibold text-cyan-400">USB 4.0 / TB4 Host Router</div>
                    <div className="text-[11px] text-slate-400">80 Gbps PAM3 packet tunneling</div>
                  </div>
                  <div className="p-2 bg-slate-900/90 border border-slate-800 rounded">
                    <div className="font-semibold text-purple-400">VFIO GPU Passthrough</div>
                    <div className="text-[11px] text-slate-400">IOMMU direct BAR memory access</div>
                  </div>
                  <div className="p-2 bg-slate-900/90 border border-slate-800 rounded">
                    <div className="font-semibold text-amber-400">QEMU / KVM VirtIO HAL</div>
                    <div className="text-[11px] text-slate-400">Zero-copy shared vring buffers</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: OBJECT MANAGER NAMESPACE */}
        {activeTab === 'objects' && (
          <div className="space-y-3 max-w-4xl mx-auto">
            <div className="text-xs text-slate-400 mb-2">
              The NT Object Manager creates a unified namespace for devices, drivers, symlinks, and kernel synchronization objects:
            </div>
            <div className="bg-slate-900 border border-slate-800 rounded-lg overflow-hidden">
              <div className="p-2.5 bg-slate-950 border-b border-slate-800 text-xs font-mono font-bold text-cyan-400">
                Directory: \ (Root Object Directory)
              </div>
              <div className="divide-y divide-slate-800/80 text-xs font-mono">
                {[
                  { name: '\\Device\\HarddiskVolume0', type: 'DeviceObject', target: 'C: (Encrypted AegisFS)', acl: 'SYSTEM: Full, Admin: Read/Write' },
                  { name: '\\Device\\NvmeController0', type: 'DeviceObject', target: 'PCIe Gen5 x4 NVMe Controller', acl: 'SYSTEM: Full' },
                  { name: '\\Device\\Usb4Host0', type: 'DeviceObject', target: 'USB 4.0 Host Router (80 Gbps)', acl: 'SYSTEM: Full' },
                  { name: '\\Device\\GpuPassthru0', type: 'DeviceObject', target: 'NVIDIA RTX 6000 Ada (VFIO Group 24)', acl: 'SYSTEM: Full, KVM: Direct' },
                  { name: '\\Driver\\aegis_nvme', type: 'DriverObject', target: 'aegis_nvme.sys (Running)', acl: 'SYSTEM: Full' },
                  { name: '\\Driver\\usb4_router', type: 'DriverObject', target: 'usb4_host_router.sys (Running)', acl: 'SYSTEM: Full' },
                  { name: '\\Driver\\vfio_pci', type: 'DriverObject', target: 'vfio_iommu_passthru.sys (Running)', acl: 'SYSTEM: Full' },
                  { name: '\\DosDevices\\C:', type: 'SymbolicLink', target: '\\Device\\HarddiskVolume0', acl: 'Everyone: Read' },
                  { name: '\\KernelObjects\\LowMemoryCondition', type: 'EventObject', target: 'Notification Event (Signaled=False)', acl: 'SYSTEM: Full' },
                  { name: '\\Security\\TpmPcrSeal', type: 'SecurityObject', target: 'TPM 2.0 PCR 7/11 Verified Lock', acl: 'SYSTEM: Full' }
                ].map((obj, i) => (
                  <div key={i} className="p-2.5 flex items-center justify-between hover:bg-slate-800/40">
                    <div className="flex items-center gap-3">
                      <span className="text-cyan-300 font-semibold">{obj.name}</span>
                      <span className="px-1.5 py-0.2 text-[10px] bg-slate-800 text-slate-300 rounded border border-slate-700">
                        {obj.type}
                      </span>
                    </div>
                    <div className="flex items-center gap-4 text-slate-400 text-[11px]">
                      <span>{obj.target}</span>
                      <span className="text-slate-500 font-sans">{obj.acl}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: EPROCESS & THREADS */}
        {activeTab === 'processes' && (
          <div className="space-y-3">
            <div className="text-xs text-slate-400">
              Active Executive Process Blocks (EPROCESS) in Kernel Memory with Integrity Levels & Hardening:
            </div>
            <div className="bg-slate-900 border border-slate-800 rounded-lg overflow-hidden">
              <table className="w-full text-xs text-left">
                <thead className="bg-slate-950 text-slate-400 border-b border-slate-800 font-mono">
                  <tr>
                    <th className="p-2.5">PID</th>
                    <th className="p-2.5">Image Name</th>
                    <th className="p-2.5">User Account</th>
                    <th className="p-2.5">Subsystem</th>
                    <th className="p-2.5">Integrity</th>
                    <th className="p-2.5">Priority</th>
                    <th className="p-2.5">Threads</th>
                    <th className="p-2.5">Handles</th>
                    <th className="p-2.5">Hardened</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800 font-mono">
                  {engine.processes.map((proc) => (
                    <tr key={proc.pid} className="hover:bg-slate-800/40">
                      <td className="p-2.5 text-blue-400 font-bold">{proc.pid}</td>
                      <td className="p-2.5 text-slate-200 font-semibold">{proc.name}</td>
                      <td className="p-2.5 text-slate-400">{proc.user}</td>
                      <td className="p-2.5">
                        <span className={`px-1.5 py-0.5 rounded text-[10px] ${
                          proc.subsystem === 'Win32' ? 'bg-blue-900/60 text-blue-300' :
                          proc.subsystem === 'Wine' ? 'bg-emerald-900/60 text-emerald-300' :
                          proc.subsystem === 'POSIX' ? 'bg-amber-900/60 text-amber-300' :
                          'bg-purple-900/60 text-purple-300'
                        }`}>
                          {proc.subsystem}
                        </span>
                      </td>
                      <td className="p-2.5 text-slate-300">{proc.integrityLevel}</td>
                      <td className="p-2.5 text-slate-400">{proc.priority}</td>
                      <td className="p-2.5 text-slate-400">{proc.threads}</td>
                      <td className="p-2.5 text-slate-400">{proc.handles.toLocaleString()}</td>
                      <td className="p-2.5">
                        {proc.hardened ? (
                          <span className="flex items-center gap-1 text-emerald-400 text-[11px]">
                            <CheckCircle2 className="w-3.5 h-3.5" /> CFG+HVCI
                          </span>
                        ) : (
                          <span className="text-slate-500 text-[11px]">Standard</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 4: VIRTUAL MEMORY (VMM) */}
        {activeTab === 'memory' && (
          <div className="space-y-4 max-w-4xl mx-auto">
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-slate-900 border border-slate-800 rounded-lg">
                <div className="text-xs font-bold text-amber-400 mb-2">NON-PAGED POOL (Locked RAM)</div>
                <div className="text-2xl font-mono font-bold text-slate-100">{stats.nonPagedPoolMb} MB</div>
                <div className="text-xs text-slate-400 mt-2">
                  Guaranteed resident memory for Interrupt Service Routines (ISRs), DPC queues, and hardware DMA buffers.
                </div>
                <div className="w-full bg-slate-950 rounded-full h-2 mt-3 overflow-hidden border border-slate-800">
                  <div className="bg-amber-500 h-full rounded-full" style={{ width: '22%' }} />
                </div>
              </div>

              <div className="p-4 bg-slate-900 border border-slate-800 rounded-lg">
                <div className="text-xs font-bold text-blue-400 mb-2">PAGED POOL (Swappable Executive Space)</div>
                <div className="text-2xl font-mono font-bold text-slate-100">{stats.pagedPoolMb} MB</div>
                <div className="text-xs text-slate-400 mt-2">
                  Swappable system memory for object handles, file system caches, and registry hives.
                </div>
                <div className="w-full bg-slate-950 rounded-full h-2 mt-3 overflow-hidden border border-slate-800">
                  <div className="bg-blue-500 h-full rounded-full" style={{ width: '38%' }} />
                </div>
              </div>
            </div>

            <div className="p-4 bg-slate-900 border border-slate-800 rounded-lg text-xs space-y-2">
              <div className="font-bold text-slate-200">Hardware Address Translation & Page Table Tree:</div>
              <div className="font-mono text-slate-400 bg-slate-950 p-3 rounded border border-slate-800 text-[11px] leading-relaxed">
                PML4 / L4 Table Base: 0x00000001004F2000 (CR3 on x86_64 / TTBR0 on ARM64)<br />
                Page Sizes Supported: 4 KB (Standard), 2 MB (Large Pages), 1 GB (Huge Pages for QEMU KVM Guest DMA)<br />
                W^X Security: Active (No physical page may simultaneously hold PAGE_EXECUTE and PAGE_READWRITE)<br />
                SMEP & SMAP Status: Hardware Enforced by CPU Control Register CR4.SMEP=1 & CR4.SMAP=1
              </div>
            </div>
          </div>
        )}

        {/* TAB 5: HAL */}
        {activeTab === 'hal' && (
          <div className="space-y-4 max-w-4xl mx-auto">
            <div className="p-4 bg-slate-900 border border-slate-800 rounded-lg space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-bold text-emerald-400 text-sm">HAL Hardware Interrupt Controller Matrix</span>
                <span className="text-xs font-mono text-slate-400">Tickless Mode Enabled</span>
              </div>
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="p-3 bg-slate-950 border border-slate-800 rounded">
                  <div className="text-slate-400 font-semibold mb-1">x86_64 Controller</div>
                  <div className="text-blue-400 font-mono">x2APIC (Extended Local APIC)</div>
                  <div className="text-[11px] text-slate-500 mt-1">Inter-Processor Interrupts (IPIs) & MSI-X vectors</div>
                </div>
                <div className="p-3 bg-slate-950 border border-slate-800 rounded">
                  <div className="text-slate-400 font-semibold mb-1">ARM64 Controller</div>
                  <div className="text-purple-400 font-mono">ARM GICv3 / GICv4 (Generic Interrupt)</div>
                  <div className="text-[11px] text-slate-500 mt-1">Low-jitter PPI & SPI direct virtualization routing</div>
                </div>
              </div>
            </div>

            <div className="p-4 bg-slate-900 border border-slate-800 rounded-lg text-xs space-y-2">
              <div className="font-bold text-slate-200">IOMMU / DMA Remapping Engine:</div>
              <div className="font-mono text-slate-400 bg-slate-950 p-3 rounded border border-slate-800 text-[11px] leading-relaxed">
                Intel VT-d / AMD-Vi / ARM SMMUv3: Enabled<br />
                Interrupt Remapping: Active (Prevents Guest VM device interrupt spoofing)<br />
                Direct Memory Access Isolation: 100% Enforced across all PCIe Root Ports
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
