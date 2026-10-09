import React, { useState, useEffect } from 'react';
import {
  Shield,
  ShieldCheck,
  ShieldAlert,
  Cpu,
  Server,
  Zap,
  Activity,
  Lock,
  Flame,
  Radio,
  RefreshCw,
  Download,
  Terminal,
  Play,
  RotateCcw,
  CheckCircle2,
  AlertTriangle,
  FileCode,
  Copy,
  Check,
  ExternalLink,
  Sliders,
  Database,
  ArrowRight,
  HardDrive,
  Eye,
  Trash2,
  Layers,
  Settings,
  HelpCircle,
  Clock,
  KeyRound,
  FileText
} from 'lucide-react';
import AegisFleetPatchDashboard from './AegisFleetPatchDashboard';

export default function EnterpriseSecurityApp({
  onLaunchApp,
  initialTab = 'performance'
}: {
  onLaunchApp?: (appId: string) => void;
  initialTab?: 'performance' | 'docker' | 'security' | 'firewall' | 'antivirus' | 'updates';
}) {
  const [activeTab, setActiveTab] = useState<'performance' | 'docker' | 'security' | 'firewall' | 'antivirus' | 'updates'>(initialTab);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Performance Tab States
  const [perfProfile, setPerfProfile] = useState<'high_throughput' | 'low_latency' | 'datacenter_energy' | 'container_headless'>('high_throughput');
  const [isBenchmarking, setIsBenchmarking] = useState(false);
  const [benchmarkProgress, setBenchmarkProgress] = useState(0);
  const [benchmarkMetrics, setBenchmarkMetrics] = useState({
    contextSwitchNs: 310,
    ioUringIops: '1,420,000 IOPS',
    memoryBw: '74.2 GB/s',
    compositorLatencyMs: '1.8 ms',
    hugepagesUsage: '28 GB / 32 GB (1GB pages)'
  });

  // Docker Tab States
  const [dockerRunMode, setDockerRunMode] = useState<'kasm_desktop' | 'headless_api' | 'gpu_vfio' | 'rootless_podman'>('kasm_desktop');
  const [dockerSimRunning, setDockerSimRunning] = useState(true);

  // Security Tab States
  const [vbsEnforced, setVbsEnforced] = useState(true);
  const [hvciEnabled, setHvciEnabled] = useState(true);
  const [kcfgEnforced, setKcfgEnforced] = useState(true);
  const [wineSandboxLevel, setWineSandboxLevel] = useState<'strict_bwrap' | 'managed_enterprise' | 'audited'>('strict_bwrap');
  const [testAppResult, setTestAppResult] = useState<string | null>(null);

  // Firewall Tab States
  const [internalFirewallActive, setInternalFirewallActive] = useState(true);
  const [externalFirewallMode, setExternalFirewallMode] = useState<'palo_alto' | 'fortigate' | 'pfsense' | 'standalone'>('palo_alto');
  const [firewallProfile, setFirewallProfile] = useState<'domain' | 'private' | 'public'>('domain');
  const [customRules, setCustomRules] = useState([
    { id: 'r1', name: 'Allow HTTPS (TLS 1.3)', dir: 'Inbound', proto: 'TCP', port: '443', action: 'ALLOW', profile: 'All' },
    { id: 'r2', name: 'Allow WinRM Over HTTPS', dir: 'Inbound', proto: 'TCP', port: '5986', action: 'ALLOW', profile: 'Domain' },
    { id: 'r3', name: 'Block SMBv1 / NetBIOS', dir: 'Inbound', proto: 'TCP', port: '139, 445', action: 'BLOCK', profile: 'Public' },
    { id: 'r4', name: 'AegisNT Microkernel RPC Mesh', dir: 'Both', proto: 'TCP', port: '8443', action: 'ALLOW', profile: 'Domain' },
    { id: 'r5', name: 'QEMU/VirtIO VNC WebRTC Stream', dir: 'Inbound', proto: 'TCP', port: '8080', action: 'ALLOW', profile: 'Private' },
  ]);
  const [livePackets, setLivePackets] = useState([
    { time: '14:22:01', src: '10.240.0.12:51240', dst: '10.240.0.5:443', proto: 'TCP', verdict: 'ALLOW', reason: 'Rule r1: State Established' },
    { time: '14:22:04', src: '198.51.100.77:445', dst: '10.240.0.5:445', proto: 'TCP', verdict: 'DROP', reason: 'Rule r3: Public SMB Prohibited' },
    { time: '14:22:09', src: '10.240.0.88:5986', dst: '10.240.0.5:5986', proto: 'TCP', verdict: 'ALLOW', reason: 'Rule r2: Domain WinRM Mutual TLS' },
  ]);

  // Antivirus Tab States
  const [realtimeProtection, setRealtimeProtection] = useState(true);
  const [amsiEnabled, setAmsiEnabled] = useState(true);
  const [cloudIntelligence, setCloudIntelligence] = useState(true);
  const [isScanning, setIsScanning] = useState(false);
  const [scanProgress, setScanProgress] = useState(0);
  const [scannedFilesCount, setScannedFilesCount] = useState(14820);
  const [threatFound, setThreatFound] = useState<string | null>(null);
  const [quarantineItems, setQuarantineItems] = useState([
    { id: 'q1', name: 'Trojan:Win32/MaliciousPayload.Test', path: 'C:\\Users\\Temp\\mimikatz_test.bin', date: 'Today, 08:14', severity: 'High' }
  ]);
  const [signatureVer, setSignatureVer] = useState('1.419.82.0 (Definitions 10/08/2026)');

  // Updates & Patch Management Tab States
  const [servicingChannel, setServicingChannel] = useState<'ltsc_2024' | 'gac_24h2' | 'canary_staging'>('ltsc_2024');
  const [hotpatchingActive, setHotpatchingActive] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);
  const [updateProgress, setUpdateProgress] = useState(0);
  const [availablePatches, setAvailablePatches] = useState([
    { id: 'KB5044284', title: 'Cumulative Kernel Security Update (Hotpatchable, 0-Reboot)', severity: 'Critical', size: '142 MB', status: 'Available' },
    { id: 'KB5043076', title: 'Wine 9.20 Subsystem Sandbox Hardening & Syscall Filter', severity: 'Important', size: '48 MB', status: 'Available' },
    { id: 'KB5045100', title: 'Aegis Defender Engine v1.420 Heuristic Signatures', severity: 'Moderate', size: '12 MB', status: 'Installed' },
  ]);

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  // Run benchmark simulation
  const handleRunBenchmark = () => {
    setIsBenchmarking(true);
    setBenchmarkProgress(10);
    const interval = setInterval(() => {
      setBenchmarkProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsBenchmarking(false);
          setBenchmarkMetrics({
            contextSwitchNs: perfProfile === 'low_latency' ? 180 : 290,
            ioUringIops: perfProfile === 'high_throughput' ? '1,650,000 IOPS' : '1,380,000 IOPS',
            memoryBw: perfProfile === 'low_latency' ? '88.4 GB/s' : '76.1 GB/s',
            compositorLatencyMs: '1.2 ms',
            hugepagesUsage: '30 GB / 32 GB (1GB hugepages pre-pinned)'
          });
          return 100;
        }
        return prev + 25;
      });
    }, 400);
  };

  // Run AV scan simulation
  const handleStartScan = (mode: 'quick' | 'full') => {
    setIsScanning(true);
    setScanProgress(0);
    setThreatFound(null);
    let count = 0;
    const interval = setInterval(() => {
      count += mode === 'quick' ? 25 : 15;
      setScanProgress((prev) => {
        const next = Math.min(prev + (mode === 'quick' ? 25 : 15), 100);
        setScannedFilesCount((c) => c + 3500);
        if (next >= 100) {
          clearInterval(interval);
          setIsScanning(false);
          setThreatFound('Zero critical infections found. Memory and VTL 1 enclave pristine.');
        }
        return next;
      });
    }, 450);
  };

  // Test sandbox execution
  const handleTestAppSandbox = (appName: string) => {
    setTestAppResult(`Verifying "${appName}": Loading PE32+ binary -> Validating Authenticode WHQL Certificate -> Spawning bubblewrap isolated namespace -> Attaching seccomp-bpf filter -> Virtualizing registry to HKLM_Sandbox. Result: EXECUTED SAFELY IN RESTRICTED RING 3 ENCLAVE.`);
  };

  // Install Patch simulation
  const handleInstallPatch = (patchId: string) => {
    setIsUpdating(true);
    setUpdateProgress(15);
    const interval = setInterval(() => {
      setUpdateProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsUpdating(false);
          setAvailablePatches((list) =>
            list.map((p) => (p.id === patchId ? { ...p, status: 'Installed (Live Hotpatched)' } : p))
          );
          return 100;
        }
        return prev + 30;
      });
    }, 500);
  };

  const navItems = [
    { id: 'performance', label: 'Performance & Optimization', icon: Zap, badge: '310ns Latency' },
    { id: 'docker', label: 'Docker & OCI Container Format', icon: Server, badge: 'Multi-Arch' },
    { id: 'security', label: 'Zero-Trust & App Sandbox', icon: Lock, badge: 'VBS / HVCI' },
    { id: 'firewall', label: 'Stateful & External Firewall', icon: Flame, badge: 'PAN-OS / Forti' },
    { id: 'antivirus', label: 'Aegis Defender Antivirus', icon: ShieldCheck, badge: 'EDR Online' },
    { id: 'updates', label: 'Windows Update & Hotpatching', icon: RefreshCw, badge: 'Fleet Hotpatch' },
  ] as const;

  return (
    <div className="flex flex-col h-full bg-slate-950 text-slate-100 font-sans select-none overflow-hidden">
      {/* Top Enterprise Banner */}
      <div className="px-6 py-3.5 bg-slate-900/90 border-b border-slate-800 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-tr from-emerald-600 to-cyan-600 rounded-lg text-white shadow-md">
            <Shield className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-sm font-bold text-slate-100 tracking-tight">
                AegisNT Enterprise Production & Security Center
              </h1>
              <span className="px-2 py-0.5 bg-emerald-950/80 border border-emerald-500/40 text-emerald-400 font-mono text-[10px] font-bold rounded">
                ENTERPRISE HARDENED 24H2
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Production optimization, OCI Docker specs, Zero-Trust sandbox, Stateful/External Firewall, Defender EDR, and 0-Reboot Patching
            </p>
          </div>
        </div>

        {/* Global Security Status Pill */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 px-3 py-1 bg-slate-950 border border-slate-800 rounded-lg text-xs font-mono">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-slate-300">Compliance:</span>
            <span className="text-emerald-400 font-bold">CIS Benchmark L2 Pass</span>
          </div>
          {onLaunchApp && (
            <button
              onClick={() => onLaunchApp('win11_guidance')}
              className="px-3 py-1 bg-blue-600 hover:bg-blue-500 text-white rounded text-xs font-semibold flex items-center gap-1 transition-colors"
            >
              <HelpCircle className="w-3.5 h-3.5" />
              Desktop Guidance
            </button>
          )}
        </div>
      </div>

      {/* Main App Layout */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left Navigation Bar */}
        <div className="w-64 bg-slate-900/50 border-r border-slate-800 p-3 space-y-1 overflow-y-auto shrink-0">
          <div className="text-[10px] font-mono text-slate-400 uppercase tracking-wider px-2 py-1">
            Enterprise Pillars
          </div>
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-medium transition-all text-left ${
                  isActive
                    ? 'bg-blue-600 text-white shadow-md font-semibold'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800/80'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-blue-400'}`} />
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span
                    className={`text-[10px] font-mono px-1.5 py-0.5 rounded ${
                      isActive ? 'bg-blue-700 text-blue-100' : 'bg-slate-800 text-slate-400'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}

          {/* Quick Shortcuts Box */}
          <div className="pt-4 mt-4 border-t border-slate-800/80 space-y-2">
            <div className="text-[10px] font-mono text-slate-400 uppercase tracking-wider px-2">
              Management Consoles
            </div>
            {onLaunchApp && (
              <>
                <button
                  onClick={() => onLaunchApp('resource_monitor')}
                  className="w-full flex items-center gap-2 px-3 py-1.5 rounded text-xs text-slate-400 hover:text-slate-200 hover:bg-slate-800 text-left"
                >
                  <Activity className="w-3.5 h-3.5 text-cyan-400" />
                  Resource Monitor (resmon)
                </button>
                <button
                  onClick={() => onLaunchApp('virtualization')}
                  className="w-full flex items-center gap-2 px-3 py-1.5 rounded text-xs text-slate-400 hover:text-slate-200 hover:bg-slate-800 text-left"
                >
                  <Server className="w-3.5 h-3.5 text-blue-400" />
                  QEMU / KVM Hypervisor
                </button>
                <button
                  onClick={() => onLaunchApp('terminal')}
                  className="w-full flex items-center gap-2 px-3 py-1.5 rounded text-xs text-slate-400 hover:text-slate-200 hover:bg-slate-800 text-left"
                >
                  <Terminal className="w-3.5 h-3.5 text-slate-400" />
                  Enterprise PowerShell Core
                </button>
              </>
            )}
          </div>
        </div>

        {/* Right Content View */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-slate-950">

          {/* ========================================================================= */}
          {/* TAB 1: PERFORMANCE OPTIMIZATION & GUIDANCE                                */}
          {/* ========================================================================= */}
          {activeTab === 'performance' && (
            <div className="space-y-6 max-w-4xl">
              <div>
                <h2 className="text-lg font-bold text-slate-100 flex items-center gap-2">
                  <Zap className="w-5 h-5 text-amber-400" />
                  Performance Optimization Architecture & Guidance
                </h2>
                <p className="text-xs text-slate-400 mt-1">
                  Why AegisNT outperforms traditional monolithic operating systems in enterprise workloads, virtualization, and container density.
                </p>
              </div>

              {/* Core Architectural Performance Advantages Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-slate-900 border border-slate-800 rounded-xl space-y-2">
                  <div className="flex items-center gap-2 text-sm font-bold text-blue-400">
                    <Cpu className="w-4 h-4" />
                    Microkernel Tickless Scheduling (NO_HZ_FULL)
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    Monolithic OS kernels interrupt worker threads up to 1,000 times per second with timer ticks. AegisNT dynamically disables scheduler ticks on CPU affinity cores running business-critical threads, reducing context-switch jitter from 1,420ns down to <strong>310ns</strong>.
                  </p>
                  <div className="text-[11px] font-mono text-emerald-400 bg-slate-950 p-2 rounded border border-slate-800/80">
                    ✓ CPU Context Switch: 310ns (x86_64) | 240ns (ARM64)
                  </div>
                </div>

                <div className="p-4 bg-slate-900 border border-slate-800 rounded-xl space-y-2">
                  <div className="flex items-center gap-2 text-sm font-bold text-cyan-400">
                    <HardDrive className="w-4 h-4" />
                    Zero-Copy io_uring & VirtIO 2.0 DMA
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    Disk and network I/O avoid user-kernel memory copies entirely. Ring buffers submit batched I/O operations directly to PCIe NVMe queues and virtualized VirtIO rings, achieving over <strong>1.4 Million IOPS</strong> per single core with minimal CPU overhead.
                  </p>
                  <div className="text-[11px] font-mono text-emerald-400 bg-slate-950 p-2 rounded border border-slate-800/80">
                    ✓ Throughput: 1.42M IOPS | 74.2 GB/s Memory Bandwidth
                  </div>
                </div>

                <div className="p-4 bg-slate-900 border border-slate-800 rounded-xl space-y-2">
                  <div className="flex items-center gap-2 text-sm font-bold text-purple-400">
                    <Database className="w-4 h-4" />
                    NUMA-Aware Memory & 1GB Hugepages
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    Physical memory pools are pinned strictly to local NUMA CPU sockets. Pre-allocated 1GB and 2MB hugepages eliminate Translation Lookaside Buffer (TLB) misses for database workloads, hypervisor guests, and high-frequency transactions.
                  </p>
                  <div className="text-[11px] font-mono text-emerald-400 bg-slate-950 p-2 rounded border border-slate-800/80">
                    ✓ Pre-allocated Hugepages: 28 GB active / 0 TLB Thrashing
                  </div>
                </div>

                <div className="p-4 bg-slate-900 border border-slate-800 rounded-xl space-y-2">
                  <div className="flex items-center gap-2 text-sm font-bold text-emerald-400">
                    <Activity className="w-4 h-4" />
                    Memory Compression & Density Optimization
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    A multi-threaded Zstandard / LZ4 memory compression engine operates transparently on inactive process pages. This enables hosting <strong>2.4x more enterprise desktop instances or containers</strong> per physical host compared to Windows Server.
                  </p>
                  <div className="text-[11px] font-mono text-emerald-400 bg-slate-950 p-2 rounded border border-slate-800/80">
                    ✓ Compression Ratio: 2.8:1 | Decompression Overhead: &lt;4μs
                  </div>
                </div>
              </div>

              {/* Interactive Performance Tuning Profiles */}
              <div className="p-5 bg-slate-900 border border-slate-800 rounded-xl space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
                      <Sliders className="w-4 h-4 text-blue-400" />
                      Dynamic Enterprise Tuning Profiles
                    </h3>
                    <p className="text-xs text-slate-400">Select active optimization target for kernel scheduler and memory governor</p>
                  </div>
                  <button
                    onClick={handleRunBenchmark}
                    disabled={isBenchmarking}
                    className="px-3 py-1.5 bg-blue-600 hover:bg-blue-500 disabled:bg-slate-800 text-white rounded text-xs font-semibold flex items-center gap-1.5 transition-colors"
                  >
                    <Play className="w-3.5 h-3.5" />
                    {isBenchmarking ? `Benchmarking (${benchmarkProgress}%)...` : 'Run Live Benchmark'}
                  </button>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {[
                    { id: 'high_throughput', label: 'Enterprise Throughput', desc: 'Max IOPS & Multi-tenant scaling', icon: Server },
                    { id: 'low_latency', label: 'Ultra-Low Latency', desc: 'Financial/HFT, tickless isolated cores', icon: Zap },
                    { id: 'datacenter_energy', label: 'Datacenter Efficiency', desc: 'Power capping & dynamic C-states', icon: Activity },
                    { id: 'container_headless', label: 'Docker Headless', desc: 'Lean footprint (<180MB RAM)', icon: Layers },
                  ].map((p) => {
                    const Icon = p.icon;
                    const isSelected = perfProfile === p.id;
                    return (
                      <button
                        key={p.id}
                        onClick={() => setPerfProfile(p.id as any)}
                        className={`p-3 rounded-lg border text-left transition-all ${
                          isSelected
                            ? 'border-blue-500 bg-blue-950/40 ring-1 ring-blue-500 text-white'
                            : 'border-slate-800 bg-slate-950/60 hover:border-slate-700 text-slate-300'
                        }`}
                      >
                        <Icon className={`w-4 h-4 mb-2 ${isSelected ? 'text-blue-400' : 'text-slate-400'}`} />
                        <div className="font-bold text-xs">{p.label}</div>
                        <div className="text-[10px] text-slate-400 mt-0.5">{p.desc}</div>
                      </button>
                    );
                  })}
                </div>

                {/* Benchmark Telemetry Box */}
                <div className="p-4 bg-slate-950 border border-slate-800 rounded-lg space-y-3">
                  <div className="text-xs font-bold text-slate-200 flex items-center justify-between">
                    <span>Live Kernel Micro-Benchmark Telemetry</span>
                    <span className="font-mono text-emerald-400 text-[11px]">Profile: {perfProfile.toUpperCase()}</span>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
                    <div className="p-2.5 bg-slate-900 rounded border border-slate-800">
                      <div className="text-[10px] text-slate-400 uppercase">Context Switch</div>
                      <div className="text-base font-bold font-mono text-blue-400 mt-1">{benchmarkMetrics.contextSwitchNs} ns</div>
                      <div className="text-[9px] text-slate-500 mt-0.5">Baseline Monolithic: 1,420 ns</div>
                    </div>
                    <div className="p-2.5 bg-slate-900 rounded border border-slate-800">
                      <div className="text-[10px] text-slate-400 uppercase">io_uring IOPS</div>
                      <div className="text-base font-bold font-mono text-cyan-400 mt-1">{benchmarkMetrics.ioUringIops}</div>
                      <div className="text-[9px] text-slate-500 mt-0.5">NVMe 2.0 direct DMA ring</div>
                    </div>
                    <div className="p-2.5 bg-slate-900 rounded border border-slate-800">
                      <div className="text-[10px] text-slate-400 uppercase">Memory Bandwidth</div>
                      <div className="text-base font-bold font-mono text-purple-400 mt-1">{benchmarkMetrics.memoryBw}</div>
                      <div className="text-[9px] text-slate-500 mt-0.5">DDR5-6000 8-channel NUMA</div>
                    </div>
                    <div className="p-2.5 bg-slate-900 rounded border border-slate-800">
                      <div className="text-[10px] text-slate-400 uppercase">Compositor Latency</div>
                      <div className="text-base font-bold font-mono text-emerald-400 mt-1">{benchmarkMetrics.compositorLatencyMs}</div>
                      <div className="text-[9px] text-slate-500 mt-0.5">Direct DWM / Wayland scanout</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* TAB 2: DOCKER FORMAT & CONTAINERIZATION GUIDANCE                          */}
          {/* ========================================================================= */}
          {activeTab === 'docker' && (
            <div className="space-y-6 max-w-4xl">
              <div>
                <h2 className="text-lg font-bold text-slate-100 flex items-center gap-2">
                  <Server className="w-5 h-5 text-cyan-400" />
                  Docker & OCI Enterprise Container Format
                </h2>
                <p className="text-xs text-slate-400 mt-1">
                  How AegisNT ships as containerized OCI images for Kubernetes, rootless Docker, cloud edge pods, and hybrid virtualization.
                </p>
              </div>

              {/* Mode Selection */}
              <div className="flex gap-2">
                {[
                  { id: 'kasm_desktop', label: 'WebRTC / Kasm Desktop Stream' },
                  { id: 'headless_api', label: 'Headless Microkernel Server' },
                  { id: 'gpu_vfio', label: 'GPU Passthrough & Hardware Accel' },
                  { id: 'rootless_podman', label: 'Rootless Podman / Kubernetes' }
                ].map((mode) => (
                  <button
                    key={mode.id}
                    onClick={() => setDockerRunMode(mode.id as any)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                      dockerRunMode === mode.id
                        ? 'bg-cyan-600 text-white'
                        : 'bg-slate-900 text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    {mode.label}
                  </button>
                ))}
              </div>

              {/* Code Snippet: Docker Run & Manifests */}
              <div className="p-5 bg-slate-900 border border-slate-800 rounded-xl space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-200 font-mono">
                    {dockerRunMode === 'kasm_desktop' && 'docker-compose.enterprise.yml (Desktop Streaming)'}
                    {dockerRunMode === 'headless_api' && 'Dockerfile.enterprise-headless (Microkernel API Node)'}
                    {dockerRunMode === 'gpu_vfio' && 'docker run --device /dev/dri --device /dev/kvm (GPU Acceleration)'}
                    {dockerRunMode === 'rootless_podman' && 'podman-kube-play.yaml (Rootless CIS Hardened)'}
                  </span>
                  <button
                    onClick={() => {
                      const snippet = dockerRunMode === 'kasm_desktop'
                        ? `version: '3.8'\nservices:\n  aegisnt-desktop:\n    image: ghcr.io/aegisnt/enterprise-desktop:24h2\n    container_name: aegisnt_win11_workspace\n    restart: always\n    ports:\n      - "3000:3000"   # WebRTC Desktop UI\n      - "3389:3389"   # Enhanced RDP Subsystem\n    devices:\n      - /dev/kvm:/dev/kvm:rwm\n      - /dev/dri:/dev/dri:rwm\n    environment:\n      - AEGIS_SECURITY_PROFILE=ENTERPRISE_L2\n      - WINE_SANDBOX_STRICT=1\n      - VIRTIO_IOURING_ENABLED=1\n    deploy:\n      resources:\n        limits:\n          cpus: '8.0'\n          memory: 16G\n    security_opt:\n      - no-new-privileges:true\n      - seccomp=/etc/aegisnt/seccomp-hardened.json`
                        : `docker run -d \\\n  --name aegisnt-node \\\n  --restart unless-stopped \\\n  --cap-drop ALL \\\n  --cap-add NET_BIND_SERVICE \\\n  --read-only \\\n  --tmpfs /run:rw,noexec,nosuid,size=64m \\\n  -p 8443:8443 \\\n  ghcr.io/aegisnt/microkernel-server:latest`;
                      copyToClipboard(snippet, 'docker-snippet');
                    }}
                    className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded text-xs flex items-center gap-1 transition-colors"
                  >
                    {copiedId === 'docker-snippet' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    Copy Manifest
                  </button>
                </div>

                <pre className="p-4 bg-slate-950 rounded-lg text-[11px] font-mono text-cyan-300 overflow-x-auto leading-relaxed border border-slate-800/80">
                  {dockerRunMode === 'kasm_desktop' && `version: '3.8'
services:
  aegisnt-desktop:
    image: ghcr.io/aegisnt/enterprise-desktop:24h2
    container_name: aegisnt_win11_workspace
    restart: always
    ports:
      - "3000:3000"   # WebRTC 60FPS Low-Latency Desktop UI
      - "3389:3389"   # Enhanced Windows RDP Subsystem
    devices:
      - /dev/kvm:/dev/kvm:rwm      # Hardware KVM Virtualization
      - /dev/dri:/dev/dri:rwm      # GPU Passthrough (Vulkan / Direct3D 12)
    environment:
      - AEGIS_SECURITY_PROFILE=ENTERPRISE_L2
      - WINE_SANDBOX_STRICT=1
      - VIRTIO_IOURING_ENABLED=1
    deploy:
      resources:
        limits:
          cpus: '8.0'
          memory: 16G
    security_opt:
      - no-new-privileges:true
      - seccomp=/etc/aegisnt/seccomp-hardened.json`}

                  {dockerRunMode === 'headless_api' && `FROM scratch
# AegisNT Static Microkernel Rootless Base Image
COPY --from=builder /bin/aegis-kernel /bin/aegis-kernel
COPY --from=builder /etc/aegis/syspolicy.bin /etc/aegis/syspolicy.bin
COPY --from=builder /usr/lib/wine /usr/lib/wine

USER 10001:10001
EXPOSE 8443
STOPSIGNAL SIGRTMIN+3

HEALTHCHECK --interval=15s --timeout=3s --retries=3 \\
  CMD ["/bin/aegis-cli", "health", "--vtl1-check"]

ENTRYPOINT ["/bin/aegis-kernel", "--headless", "--stateful-firewall"]`}

                  {dockerRunMode === 'gpu_vfio' && `# Run with Dedicated GPU Acceleration (NVIDIA / AMD / Intel Arc)
docker run -d \\
  --name aegisnt-gpu-workstation \\
  --device /dev/kvm \\
  --device /dev/dri \\
  --gpus all \\
  --shm-size=2g \\
  --security-opt seccomp=unconfined \\
  --cap-add SYS_PTRACE \\
  -p 3000:3000 \\
  ghcr.io/aegisnt/enterprise-desktop:gpu-latest`}

                  {dockerRunMode === 'rootless_podman' && `apiVersion: v1
kind: Pod
metadata:
  name: aegisnt-rootless-pod
  labels:
    security.aegisnt.com/tier: zero-trust
spec:
  securityContext:
    runAsNonRoot: true
    runAsUser: 10001
    seccompProfile:
      type: RuntimeDefault
  containers:
    - name: aegis-os
      image: ghcr.io/aegisnt/enterprise-desktop:24h2
      resources:
        limits:
          cpu: "4"
          memory: 8Gi`}
                </pre>
              </div>

              {/* Live Simulated Container Sandbox Monitor */}
              <div className="p-4 bg-slate-900 border border-slate-800 rounded-xl space-y-3">
                <div className="flex items-center justify-between text-xs font-bold text-slate-200">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                    <span>Local Container Runtime Host: Podman v5.2 / Docker 27.2 Engine</span>
                  </div>
                  <span className="font-mono text-cyan-400">cgroups v2 Strict Active</span>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs font-mono">
                    <thead className="bg-slate-950 text-slate-400 border-b border-slate-800 text-[11px]">
                      <tr>
                        <th className="p-2">Container ID</th>
                        <th className="p-2">Image</th>
                        <th className="p-2">Status</th>
                        <th className="p-2">Memory / CPU</th>
                        <th className="p-2">Security Isolation</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/60 text-slate-300 text-[11px]">
                      <tr>
                        <td className="p-2 text-cyan-300 font-bold">c-aegis-win11-01</td>
                        <td className="p-2">aegisnt/enterprise-desktop:24h2</td>
                        <td className="p-2 text-emerald-400">Up 4.2 hours (healthy)</td>
                        <td className="p-2">480 MB / 0.4%</td>
                        <td className="p-2 text-emerald-300 font-sans">Rootless + seccomp-bpf</td>
                      </tr>
                      <tr>
                        <td className="p-2 text-cyan-300 font-bold">c-firewall-proxy</td>
                        <td className="p-2">aegisnt/firewall-gateway:latest</td>
                        <td className="p-2 text-emerald-400">Up 12.8 hours</td>
                        <td className="p-2">64 MB / 0.1%</td>
                        <td className="p-2 text-emerald-300 font-sans">Read-Only RootFS + VTL1</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* TAB 3: HIGH-LEVEL SECURITY & WINDOWS APP SANDBOX                          */}
          {/* ========================================================================= */}
          {activeTab === 'security' && (
            <div className="space-y-6 max-w-4xl">
              <div>
                <h2 className="text-lg font-bold text-slate-100 flex items-center gap-2">
                  <Lock className="w-5 h-5 text-emerald-400" />
                  Zero-Trust Kernel Security & Production-Safe Windows Execution
                </h2>
                <p className="text-xs text-slate-400 mt-1">
                  Multi-tier defenses guarantee legacy and modern Windows PE32+ applications run isolated without compromising enterprise hosts.
                </p>
              </div>

              {/* Hardware & Hypervisor Enforcement Toggles */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div className="p-4 bg-slate-900 border border-slate-800 rounded-xl space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-200">Virtualization-Based Security (VBS)</span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-emerald-950 text-emerald-400 font-bold">
                      VTL 1 Enclave
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400">
                    Isolates critical security data and cryptographic key materials in Virtual Trust Level 1, inaccessible even if Ring 0 is breached.
                  </p>
                </div>

                <div className="p-4 bg-slate-900 border border-slate-800 rounded-xl space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-200">Hypervisor Code Integrity (HVCI)</span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-emerald-950 text-emerald-400 font-bold">
                      Strict WHQL Only
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400">
                    Enforces that all kernel drivers and dynamic code pages must have signed certificates validated by the microkernel security arbiter.
                  </p>
                </div>

                <div className="p-4 bg-slate-900 border border-slate-800 rounded-xl space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-200">Kernel Control Flow Guard (kCFG)</span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-emerald-950 text-emerald-400 font-bold">
                      CET Shadow Stack
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400">
                    Hardware Intel CET shadow stacks and ARM Guarded Control Stack (GCS) block return-oriented programming (ROP) exploits.
                  </p>
                </div>
              </div>

              {/* Production-Safe Windows App Sandbox Engine */}
              <div className="p-5 bg-slate-900 border border-slate-800 rounded-xl space-y-4">
                <div>
                  <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-emerald-400" />
                    Windows Application Isolation & Sandbox Engine (Wine 9.x + Bubblewrap)
                  </h3>
                  <p className="text-xs text-slate-400 mt-1">
                    How commercial Windows binaries run safely in production without host access
                  </p>
                </div>

                <div className="p-3 bg-slate-950 border border-slate-800 rounded-lg text-xs space-y-2 text-slate-300">
                  <div className="font-bold text-slate-200">Production Isolation Guarantees:</div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-[11px]">
                    <div className="flex items-start gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                      <span><strong>Virtual File System:</strong> Isolated prefix; no access to host /etc, /root, or raw disks.</span>
                    </div>
                    <div className="flex items-start gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                      <span><strong>Seccomp Syscall Filter:</strong> Blocks unmapped kernel syscalls and ptrace hijacking.</span>
                    </div>
                    <div className="flex items-start gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                      <span><strong>Memory Sanitization:</strong> High-entropy ASLR + Arbitrary Code Guard (ACG) prevents JIT exploits.</span>
                    </div>
                    <div className="flex items-start gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                      <span><strong>Ephemeral Sandbox Mode:</strong> Instant rollback discard of all registry/file modifications on exit.</span>
                    </div>
                  </div>
                </div>

                {/* Interactive Sandbox Execution Tester */}
                <div className="pt-2 border-t border-slate-800 space-y-3">
                  <div className="text-xs font-bold text-slate-200">
                    Test Sandbox Binary Execution Simulator:
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {[
                      { name: 'SAP_GUI_770.exe', type: 'Enterprise ERP' },
                      { name: 'AutoCAD_Civil3D.exe', type: 'CAD / Engineering' },
                      { name: 'Visual_Studio_2022.exe', type: 'IDE / Compiler' },
                      { name: 'QuickBooks_Enterprise.exe', type: 'Financial Accounting' }
                    ].map((app) => (
                      <button
                        key={app.name}
                        onClick={() => handleTestAppSandbox(app.name)}
                        className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded text-xs flex items-center gap-1.5 transition-colors border border-slate-700"
                      >
                        <Play className="w-3 h-3 text-emerald-400" />
                        <span>{app.name}</span>
                        <span className="text-[10px] text-slate-400 font-mono">({app.type})</span>
                      </button>
                    ))}
                  </div>

                  {testAppResult && (
                    <div className="p-3 bg-emerald-950/40 border border-emerald-500/40 rounded-lg text-xs font-mono text-emerald-300 leading-relaxed">
                      {testAppResult}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* TAB 4: STATEFUL FIREWALL & EXTERNAL FIREWALL INTEGRATION                 */}
          {/* ========================================================================= */}
          {activeTab === 'firewall' && (
            <div className="space-y-6 max-w-4xl">
              <div>
                <h2 className="text-lg font-bold text-slate-100 flex items-center gap-2">
                  <Flame className="w-5 h-5 text-amber-500" />
                  High-Level Stateful Firewall & External Gateway Orchestration
                </h2>
                <p className="text-xs text-slate-400 mt-1">
                  Built-in microkernel Stateful Packet Inspection (SPI) coupled with seamless hooks to enterprise external firewalls.
                </p>
              </div>

              {/* Firewall Status & External Gateway Selector */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-slate-900 border border-slate-800 rounded-xl space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-200">Internal Stateful Packet Filter (SPI)</span>
                    <button
                      onClick={() => setInternalFirewallActive(!internalFirewallActive)}
                      className={`px-2.5 py-0.5 rounded text-xs font-semibold ${
                        internalFirewallActive ? 'bg-emerald-600 text-white' : 'bg-rose-600 text-white'
                      }`}
                    >
                      {internalFirewallActive ? 'ACTIVE (ENFORCING)' : 'DISABLED'}
                    </button>
                  </div>
                  <div className="flex gap-2">
                    {(['domain', 'private', 'public'] as const).map((prof) => (
                      <button
                        key={prof}
                        onClick={() => setFirewallProfile(prof)}
                        className={`flex-1 py-1 text-xs rounded uppercase font-bold transition-all ${
                          firewallProfile === prof
                            ? 'bg-blue-600 text-white'
                            : 'bg-slate-950 text-slate-400 hover:text-slate-200'
                        }`}
                      >
                        {prof}
                      </button>
                    ))}
                  </div>
                  <div className="text-[11px] text-slate-400 leading-relaxed">
                    Default Profile: <strong>{firewallProfile.toUpperCase()}</strong>. Block all unsolicited inbound packets except established states and whitelisted rule exceptions.
                  </div>
                </div>

                <div className="p-4 bg-slate-900 border border-slate-800 rounded-xl space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-200">External Firewall Integration</span>
                    <span className="text-[10px] font-mono px-2 py-0.5 bg-cyan-950 text-cyan-400 font-bold rounded">
                      SYNC: ONLINE
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    {[
                      { id: 'palo_alto', label: 'Palo Alto (PAN-OS XML)' },
                      { id: 'fortigate', label: 'Fortinet (FortiOS API)' },
                      { id: 'pfsense', label: 'pfSense / OPNsense' },
                      { id: 'standalone', label: 'Host Standalone' }
                    ].map((ext) => (
                      <button
                        key={ext.id}
                        onClick={() => setExternalFirewallMode(ext.id as any)}
                        className={`p-2 rounded border text-left text-[11px] font-semibold transition-all ${
                          externalFirewallMode === ext.id
                            ? 'border-cyan-500 bg-cyan-950/40 text-cyan-200'
                            : 'border-slate-800 bg-slate-950 text-slate-400 hover:border-slate-700'
                        }`}
                      >
                        {ext.label}
                      </button>
                    ))}
                  </div>
                  <div className="text-[11px] text-slate-400">
                    Policy mirror mode: Outbound and inbound connection events forwarded via encrypted TLS syslog (RFC 5424) to the edge enterprise gateway.
                  </div>
                </div>
              </div>

              {/* Active Firewall Rules Table */}
              <div className="p-4 bg-slate-900 border border-slate-800 rounded-xl space-y-3">
                <div className="flex items-center justify-between text-xs font-bold text-slate-200">
                  <span>Stateful Filter Rule Policies ({customRules.length} Active Rules)</span>
                  <button
                    onClick={() => {
                      const newRule = {
                        id: `r${customRules.length + 1}`,
                        name: 'Block External Telnet / Insecure',
                        dir: 'Inbound',
                        proto: 'TCP',
                        port: '23',
                        action: 'BLOCK',
                        profile: 'All'
                      };
                      setCustomRules([...customRules, newRule]);
                    }}
                    className="px-2.5 py-1 bg-blue-600 hover:bg-blue-500 text-white rounded text-[11px] font-semibold"
                  >
                    + Add Firewall Rule
                  </button>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs font-mono">
                    <thead className="bg-slate-950 text-slate-400 border-b border-slate-800 text-[11px]">
                      <tr>
                        <th className="p-2">Rule Name</th>
                        <th className="p-2">Direction</th>
                        <th className="p-2">Protocol</th>
                        <th className="p-2">Ports</th>
                        <th className="p-2">Profile</th>
                        <th className="p-2">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/60 text-slate-300 text-[11px]">
                      {customRules.map((rule) => (
                        <tr key={rule.id}>
                          <td className="p-2 text-slate-200 font-sans font-medium">{rule.name}</td>
                          <td className="p-2 text-slate-400">{rule.dir}</td>
                          <td className="p-2 text-cyan-300">{rule.proto}</td>
                          <td className="p-2 text-amber-300">{rule.port}</td>
                          <td className="p-2 text-slate-400">{rule.profile}</td>
                          <td className="p-2">
                            <span
                              className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                                rule.action === 'ALLOW'
                                  ? 'bg-emerald-950 text-emerald-400'
                                  : 'bg-rose-950 text-rose-400'
                              }`}
                            >
                              {rule.action}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Live Live Packet Inspector Log */}
              <div className="p-4 bg-slate-900 border border-slate-800 rounded-xl space-y-2">
                <div className="flex items-center justify-between text-xs font-bold text-slate-200">
                  <div className="flex items-center gap-2">
                    <Activity className="w-3.5 h-3.5 text-cyan-400" />
                    <span>Real-Time SPI Packet Inspection Stream</span>
                  </div>
                  <span className="text-[10px] font-mono text-slate-400">Forwarding to {externalFirewallMode.toUpperCase()}</span>
                </div>
                <div className="space-y-1.5 font-mono text-[11px]">
                  {livePackets.map((pkt, i) => (
                    <div key={i} className="p-2 rounded bg-slate-950 border border-slate-800/80 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <span className="text-slate-500">{pkt.time}</span>
                        <span className="text-slate-300">{pkt.src} &rarr; {pkt.dst}</span>
                        <span className="text-cyan-400 font-bold">[{pkt.proto}]</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-slate-400 text-[10px]">{pkt.reason}</span>
                        <span
                          className={`px-1.5 py-0.2 rounded text-[10px] font-bold ${
                            pkt.verdict === 'ALLOW' ? 'bg-emerald-900 text-emerald-300' : 'bg-rose-900 text-rose-300'
                          }`}
                        >
                          {pkt.verdict}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* TAB 5: ANTIVIRUS & DEFENDER EDR                                           */}
          {/* ========================================================================= */}
          {activeTab === 'antivirus' && (
            <div className="space-y-6 max-w-4xl">
              <div>
                <h2 className="text-lg font-bold text-slate-100 flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-emerald-400" />
                  Aegis Defender EDR & Antivirus Protection
                </h2>
                <p className="text-xs text-slate-400 mt-1">
                  Kernel-level real-time heuristic monitoring, Antimalware Scan Interface (AMSI), and cloud-coordinated threat intelligence.
                </p>
              </div>

              {/* Status and Scanner Card */}
              <div className="p-5 bg-slate-900 border border-slate-800 rounded-xl space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-3 bg-emerald-600/20 border border-emerald-500/40 rounded-xl text-emerald-400">
                      <ShieldCheck className="w-8 h-8" />
                    </div>
                    <div>
                      <div className="text-base font-bold text-slate-100">Your device is protected</div>
                      <div className="text-xs text-slate-400 mt-0.5">
                        Signatures: <span className="font-mono text-slate-300">{signatureVer}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() => handleStartScan('quick')}
                      disabled={isScanning}
                      className="px-3 py-1.5 bg-blue-600 hover:bg-blue-500 disabled:bg-slate-800 text-white rounded text-xs font-semibold flex items-center gap-1.5 transition-colors"
                    >
                      <Play className="w-3.5 h-3.5" />
                      Quick Scan
                    </button>
                    <button
                      onClick={() => handleStartScan('full')}
                      disabled={isScanning}
                      className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 disabled:bg-slate-800 text-slate-200 rounded text-xs font-semibold flex items-center gap-1.5 transition-colors"
                    >
                      <Layers className="w-3.5 h-3.5" />
                      Full System Scan
                    </button>
                  </div>
                </div>

                {/* Progress bar during scan */}
                {isScanning && (
                  <div className="p-4 bg-slate-950 rounded-lg border border-slate-800 space-y-2">
                    <div className="flex items-center justify-between text-xs font-bold text-slate-300">
                      <span>Scanning system memory, AegisFS volumes, and PE32+ binaries...</span>
                      <span className="font-mono text-cyan-400">{scanProgress}%</span>
                    </div>
                    <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
                      <div
                        className="bg-gradient-to-r from-blue-500 to-emerald-400 h-2 transition-all duration-300"
                        style={{ width: `${scanProgress}%` }}
                      />
                    </div>
                    <div className="text-[11px] font-mono text-slate-400">
                      Inspected files: {scannedFilesCount.toLocaleString()} items
                    </div>
                  </div>
                )}

                {threatFound && !isScanning && (
                  <div className="p-3 bg-emerald-950/40 border border-emerald-500/40 rounded-lg text-xs font-semibold text-emerald-300 flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <span>{threatFound}</span>
                  </div>
                )}

                {/* Protection Modules Toggles */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-2">
                  <div className="p-3 bg-slate-950 rounded-lg border border-slate-800 flex items-center justify-between">
                    <div>
                      <div className="text-xs font-bold text-slate-200">Real-Time Protection</div>
                      <div className="text-[10px] text-slate-400">Microkernel intercept</div>
                    </div>
                    <button
                      onClick={() => setRealtimeProtection(!realtimeProtection)}
                      className={`w-9 h-5 rounded-full transition-colors relative ${
                        realtimeProtection ? 'bg-emerald-600' : 'bg-slate-700'
                      }`}
                    >
                      <span
                        className={`absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white transition-transform ${
                          realtimeProtection ? 'translate-x-4' : ''
                        }`}
                      />
                    </button>
                  </div>

                  <div className="p-3 bg-slate-950 rounded-lg border border-slate-800 flex items-center justify-between">
                    <div>
                      <div className="text-xs font-bold text-slate-200">AMSI Script Engine</div>
                      <div className="text-[10px] text-slate-400">Inspects PS/VBS in-memory</div>
                    </div>
                    <button
                      onClick={() => setAmsiEnabled(!amsiEnabled)}
                      className={`w-9 h-5 rounded-full transition-colors relative ${
                        amsiEnabled ? 'bg-emerald-600' : 'bg-slate-700'
                      }`}
                    >
                      <span
                        className={`absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white transition-transform ${
                          amsiEnabled ? 'translate-x-4' : ''
                        }`}
                      />
                    </button>
                  </div>

                  <div className="p-3 bg-slate-950 rounded-lg border border-slate-800 flex items-center justify-between">
                    <div>
                      <div className="text-xs font-bold text-slate-200">Cloud Intelligence</div>
                      <div className="text-[10px] text-slate-400">Live hash reputation</div>
                    </div>
                    <button
                      onClick={() => setCloudIntelligence(!cloudIntelligence)}
                      className={`w-9 h-5 rounded-full transition-colors relative ${
                        cloudIntelligence ? 'bg-emerald-600' : 'bg-slate-700'
                      }`}
                    >
                      <span
                        className={`absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white transition-transform ${
                          cloudIntelligence ? 'translate-x-4' : ''
                        }`}
                      />
                    </button>
                  </div>
                </div>
              </div>

              {/* Quarantine Vault */}
              <div className="p-4 bg-slate-900 border border-slate-800 rounded-xl space-y-3">
                <div className="flex items-center justify-between text-xs font-bold text-slate-200">
                  <div className="flex items-center gap-2">
                    <Lock className="w-4 h-4 text-rose-400" />
                    <span>Quarantine Vault & Remediated Threats ({quarantineItems.length})</span>
                  </div>
                  <button
                    onClick={() => setQuarantineItems([])}
                    className="text-[11px] text-slate-400 hover:text-rose-400 transition-colors"
                  >
                    Clear Vault
                  </button>
                </div>

                {quarantineItems.length === 0 ? (
                  <div className="text-xs text-slate-500 py-3 text-center">No threats currently in quarantine.</div>
                ) : (
                  <div className="space-y-2">
                    {quarantineItems.map((item) => (
                      <div key={item.id} className="p-3 bg-slate-950 rounded border border-slate-800 flex items-center justify-between text-xs">
                        <div>
                          <div className="font-bold text-rose-400">{item.name}</div>
                          <div className="text-[10px] text-slate-400 font-mono mt-0.5">{item.path} &bull; {item.date}</div>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="px-1.5 py-0.5 rounded text-[10px] font-mono bg-rose-950 text-rose-300 font-bold">
                            {item.severity}
                          </span>
                          <button
                            onClick={() => setQuarantineItems(quarantineItems.filter((q) => q.id !== item.id))}
                            className="p-1.5 rounded hover:bg-slate-800 text-slate-400 hover:text-rose-400 transition-colors"
                            title="Delete"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* TAB 6: WINDOWS UPDATE & HOTPATCHING                                       */}
          {/* ========================================================================= */}
          {activeTab === 'updates' && (
            <div className="space-y-6 max-w-5xl">
              <div>
                <h2 className="text-lg font-bold text-slate-100 flex items-center gap-2">
                  <RefreshCw className="w-5 h-5 text-blue-400" />
                  Enterprise Windows Update & Zero-Reboot Hotpatching
                </h2>
                <p className="text-xs text-slate-400 mt-1">
                  Seamlessly deliver security updates, driver hotfixes, and kernel patches without cluster reboot or application downtime.
                </p>
              </div>

              {/* Visual Real-Time Fleet Hotpatch & Kernel Patching History Dashboard */}
              <AegisFleetPatchDashboard />

              {/* Servicing Channel and Hotpatch Status */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-slate-900 border border-slate-800 rounded-xl space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-200">Enterprise Servicing Channel</span>
                    <span className="text-[10px] font-mono px-2 py-0.5 bg-blue-950 text-blue-400 font-bold rounded">
                      5-Year Support
                    </span>
                  </div>
                  <div className="flex gap-2">
                    {[
                      { id: 'ltsc_2024', label: 'LTSC 2024' },
                      { id: 'gac_24h2', label: 'GAC Annual' },
                      { id: 'canary_staging', label: 'Staging / Canary' }
                    ].map((ch) => (
                      <button
                        key={ch.id}
                        onClick={() => setServicingChannel(ch.id as any)}
                        className={`flex-1 py-1 text-xs rounded font-bold transition-all ${
                          servicingChannel === ch.id
                            ? 'bg-blue-600 text-white'
                            : 'bg-slate-950 text-slate-400 hover:text-slate-200'
                        }`}
                      >
                        {ch.label}
                      </button>
                    ))}
                  </div>
                  <div className="text-[11px] text-slate-400 leading-relaxed">
                    Active: <strong>Long-Term Servicing Channel (LTSC)</strong>. Guarantees zero feature drift, pristine API compatibility, and strictly vetted security updates.
                  </div>
                </div>

                <div className="p-4 bg-slate-900 border border-slate-800 rounded-xl space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-200">Zero-Reboot Hotpatching Engine</span>
                    <button
                      onClick={() => setHotpatchingActive(!hotpatchingActive)}
                      className={`px-2.5 py-0.5 rounded text-xs font-semibold ${
                        hotpatchingActive ? 'bg-emerald-600 text-white' : 'bg-slate-700 text-slate-300'
                      }`}
                    >
                      {hotpatchingActive ? 'ENABLED (0-REBOOT)' : 'DISABLED'}
                    </button>
                  </div>
                  <p className="text-[11px] text-slate-400 leading-relaxed">
                    Uses memory redirection tables to swap vulnerable microkernel instructions and userland DLL functions in-place while processes remain running.
                  </p>
                  <div className="text-[10px] font-mono text-emerald-400 bg-slate-950 p-2 rounded border border-slate-800">
                    Hotpatch engine: kpatch.sys / NT LivePatch v3.1 ready
                  </div>
                </div>
              </div>

              {/* Updates List & Patch Action */}
              <div className="p-5 bg-slate-900 border border-slate-800 rounded-xl space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-bold text-slate-100">Pending & Installed Enterprise Patches</h3>
                    <p className="text-xs text-slate-400">Validated against Microsoft Intune, WSUS, and SCCM catalogs</p>
                  </div>
                  <button
                    onClick={() => {
                      setIsUpdating(true);
                      setTimeout(() => setIsUpdating(false), 1200);
                    }}
                    className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded text-xs font-semibold flex items-center gap-1.5 transition-colors"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 ${isUpdating ? 'animate-spin' : ''}`} />
                    Check for Updates
                  </button>
                </div>

                {isUpdating && (
                  <div className="p-3 bg-blue-950/40 border border-blue-500/40 rounded-lg text-xs font-semibold text-blue-300 flex items-center gap-2">
                    <RefreshCw className="w-4 h-4 animate-spin text-blue-400" />
                    <span>Synchronizing patch catalogue with WSUS / Microsoft Update Catalog... ({updateProgress}%)</span>
                  </div>
                )}

                <div className="space-y-2.5">
                  {availablePatches.map((patch) => (
                    <div
                      key={patch.id}
                      className="p-3.5 bg-slate-950 rounded-lg border border-slate-800 flex items-center justify-between text-xs"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-slate-100">{patch.id}</span>
                          <span
                            className={`px-1.5 py-0.5 rounded text-[10px] font-mono font-bold ${
                              patch.severity === 'Critical'
                                ? 'bg-rose-950 text-rose-300'
                                : patch.severity === 'Important'
                                ? 'bg-amber-950 text-amber-300'
                                : 'bg-blue-950 text-blue-300'
                            }`}
                          >
                            {patch.severity}
                          </span>
                          <span className="text-slate-500 font-mono text-[11px]">{patch.size}</span>
                        </div>
                        <div className="text-slate-400 text-[11px]">{patch.title}</div>
                      </div>

                      <div>
                        {patch.status === 'Available' ? (
                          <button
                            onClick={() => handleInstallPatch(patch.id)}
                            className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded text-xs font-semibold flex items-center gap-1 transition-colors"
                          >
                            <Download className="w-3.5 h-3.5" />
                            Live Hotpatch
                          </button>
                        ) : (
                          <span className="flex items-center gap-1 text-emerald-400 font-semibold font-mono text-[11px]">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            {patch.status}
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Enterprise Patch Distribution Automation (Ansible / Intune) */}
                <div className="pt-3 border-t border-slate-800 flex items-center justify-between text-xs">
                  <span className="text-slate-400">
                    Automated Fleet Deployment:
                  </span>
                  <button
                    onClick={() => {
                      const playbook = `- name: Apply AegisNT 0-Reboot Hotpatches\n  hosts: aegis_fleet\n  tasks:\n    - name: Ensure kpatch daemon active\n      ansible.builtin.service:\n        name: aegis-hotpatch\n        state: started\n    - name: Apply critical KB5044284 hotpatch\n      aegis.enterprise.patch:\n        kb: "KB5044284"\n        action: live_apply\n        require_reboot: false`;
                      copyToClipboard(playbook, 'ansible-playbook');
                    }}
                    className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded text-xs flex items-center gap-1 transition-colors"
                  >
                    {copiedId === 'ansible-playbook' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    Copy Ansible Fleet Playbook
                  </button>
                </div>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
