import React, { useState, useEffect, useRef } from 'react';
import {
  Server,
  HardDrive,
  Cpu,
  Monitor,
  Zap,
  Play,
  Pause,
  RotateCcw,
  Plus,
  ShieldCheck,
  Activity,
  Layers,
  Sparkles,
  Gauge,
  Wifi,
  ExternalLink,
  Laptop,
  Terminal,
  Download,
  Copy,
  Check,
  HelpCircle,
  Code
} from 'lucide-react';
import { KernelEngine } from '../../services/kernelEngine';
import { VirtualMachine } from '../../types/os';

export default function VirtualizationApp() {
  const engine = KernelEngine.getInstance();
  const [activeTab, setActiveTab] = useState<'qemu' | 'nvme' | 'usb4' | 'gpu' | 'deploy'>('qemu');
  const [vms, setVms] = useState<VirtualMachine[]>(engine.vms);
  const [nvme, setNvme] = useState(engine.nvme);
  const [usb4, setUsb4] = useState(engine.usb4);
  const [gpu, setGpu] = useState(engine.gpu);
  const [consoleStatus, setConsoleStatus] = useState<string | null>(null);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2500);
  };

  // Live telemetry pulse
  useEffect(() => {
    const timer = setInterval(() => {
      setNvme(prev => ({
        ...prev,
        iopsRead: Math.floor(1180000 + Math.random() * 25000),
        bandwidthMbps: Math.floor(14100 + Math.random() * 300),
        latencyMicrosec: Math.floor(26 + Math.random() * 5)
      }));
      setGpu(prev => ({
        ...prev,
        gpuLoadPercent: Math.floor(16 + Math.random() * 8),
        fps: 120
      }));
    }, 1500);
    return () => clearInterval(timer);
  }, []);

  // GPU Canvas animation for live hardware acceleration visualization
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  useEffect(() => {
    if (activeTab !== 'gpu') return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let t = 0;

    const render = () => {
      t += 0.02;
      ctx.fillStyle = '#020617';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Draw grid lines
      ctx.strokeStyle = '#1e293b';
      ctx.lineWidth = 1;
      for (let x = 0; x < canvas.width; x += 30) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, canvas.height);
        ctx.stroke();
      }
      for (let y = 0; y < canvas.height; y += 30) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(canvas.width, y);
        ctx.stroke();
      }

      // Draw animated 3D Lissajous / GPU Stress Knot
      const cx = canvas.width / 2;
      const cy = canvas.height / 2;
      ctx.lineWidth = 2.5;

      for (let i = 0; i < 200; i++) {
        const u = (i / 200) * Math.PI * 4 + t;
        const x = cx + Math.sin(u * 1.5) * 140 * Math.cos(u * 0.5);
        const y = cy + Math.cos(u * 1.5) * 80;
        const radius = Math.abs(Math.sin(u * 2)) * 6 + 2;

        const hue = (i * 3 + t * 40) % 360;
        ctx.fillStyle = `hsl(${hue}, 85%, 60%)`;
        ctx.beginPath();
        ctx.arc(x, y, radius, 0, Math.PI * 2);
        ctx.fill();
      }

      animId = requestAnimationFrame(render);
    };

    render();
    return () => cancelAnimationFrame(animId);
  }, [activeTab]);

  const toggleVm = (id: string) => {
    const updated = vms.map(vm => {
      if (vm.id === id) {
        return {
          ...vm,
          status: vm.status === 'Running' ? ('Paused' as const) : ('Running' as const)
        };
      }
      return vm;
    });
    setVms(updated);
    engine.vms = updated;
  };

  const handleToggleGpuMode = () => {
    engine.toggleGpuMode();
    setGpu({ ...engine.gpu });
  };

  return (
    <div className="flex flex-col h-full bg-slate-950 text-slate-100 font-sans select-text">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-2.5 bg-slate-900 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div className="p-1.5 bg-cyan-600/20 text-cyan-400 rounded border border-cyan-500/30">
            <Server className="w-5 h-5" />
          </div>
          <div>
            <div className="font-semibold text-sm flex items-center gap-2">
              Enterprise Virtualization & Hardware Bus Manager
              <span className="px-2 py-0.5 text-[10px] font-mono bg-cyan-950 border border-cyan-600/50 text-cyan-400 rounded-full font-bold">
                QEMU / KVM / HAL STABLE
              </span>
            </div>
            <div className="text-[11px] text-slate-400">
              Direct VirtIO DMA, PCIe Gen5 NVMe, USB 4.0 80Gbps & VFIO GPU passthrough
            </div>
          </div>
        </div>

        {/* Global summary badge */}
        <div className="flex items-center gap-2 text-xs font-mono">
          <span className="flex items-center gap-1.5 px-2.5 py-1 bg-emerald-950 border border-emerald-600/50 text-emerald-300 rounded">
            <ShieldCheck className="w-3.5 h-3.5" />
            IOMMU ISOLATION: ACTIVE
          </span>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-800 px-4 bg-slate-900/40 text-xs font-medium overflow-x-auto">
        {[
          { id: 'qemu', label: 'QEMU / KVM Hypervisor', icon: Server, count: `${vms.filter(v => v.status === 'Running').length} Active VMs` },
          { id: 'nvme', label: 'NVMe 2.0 PCIe Gen5 Bus', icon: HardDrive, count: `${(nvme.iopsRead / 1000).toFixed(0)}k IOPS` },
          { id: 'usb4', label: 'USB 4.0 / TB4 Host Router', icon: Zap, count: '80 Gbps' },
          { id: 'gpu', label: 'VFIO GPU Passthrough & WDDM', icon: Monitor, count: '120 FPS' },
          { id: 'deploy', label: 'Install on Laptop / VM & Run Custom Apps', icon: Laptop, count: 'Step-by-Step' }
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 py-2.5 px-4 border-b-2 transition-all ${
                isActive
                  ? 'border-cyan-500 text-cyan-400 bg-slate-800/40'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
              <span className="ml-1 text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-800 text-slate-300">
                {tab.count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Tab Contents */}
      <div className="flex-1 overflow-y-auto p-4 bg-slate-950">
        {/* QEMU / KVM TAB */}
        {activeTab === 'qemu' && (
          <div className="space-y-4 max-w-5xl mx-auto">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-slate-200">KVM Guest Virtual Machines</h3>
                <p className="text-xs text-slate-400">Zero-copy VirtIO memory abstraction with sub-microsecond VM exit latency</p>
              </div>
              <button
                onClick={() => {
                  const newVm: VirtualMachine = {
                    id: `vm-${Date.now()}`,
                    name: 'Enterprise MicroVM Sandbox',
                    os: 'AegisNT x86_64 Node',
                    vcpus: 4,
                    ramMb: 8192,
                    status: 'Running',
                    virtioNet: true,
                    virtioBlk: true,
                    gpuPassthrough: false,
                    uptime: 10,
                    ipAddress: `192.168.122.${Math.floor(150 + Math.random() * 50)}`
                  };
                  setVms([...vms, newVm]);
                }}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-cyan-600 hover:bg-cyan-500 text-white rounded text-xs font-semibold"
              >
                <Plus className="w-3.5 h-3.5" /> Deploy New Guest VM
              </button>
            </div>

            {consoleStatus && (
              <div className="p-3 rounded-lg bg-cyan-950/80 border border-cyan-700/80 text-cyan-300 text-xs flex items-center justify-between">
                <span>{consoleStatus}</span>
                <span className="text-[10px] text-cyan-400 font-mono">QEMU VNC PORT: 5901</span>
              </div>
            )}

            <div className="grid grid-cols-1 gap-3">
              {vms.map((vm) => (
                <div key={vm.id} className="p-4 bg-slate-900 border border-slate-800 rounded-lg flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className={`p-3 rounded-lg border ${
                      vm.status === 'Running' ? 'bg-emerald-950/60 border-emerald-600/40 text-emerald-400' : 'bg-slate-800 border-slate-700 text-slate-400'
                    }`}>
                      <Server className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-sm text-slate-100">{vm.name}</span>
                        <span className={`px-2 py-0.5 text-[10px] rounded font-mono font-bold ${
                          vm.status === 'Running' ? 'bg-emerald-900 text-emerald-300' : 'bg-slate-800 text-slate-400'
                        }`}>
                          {vm.status}
                        </span>
                        {vm.gpuPassthrough && (
                          <span className="px-2 py-0.5 text-[10px] rounded font-mono font-bold bg-purple-950 border border-purple-600/50 text-purple-300">
                            VFIO GPU LINKED
                          </span>
                        )}
                      </div>
                      <div className="text-xs text-slate-400 mt-1 flex items-center gap-3 font-mono">
                        <span>OS: {vm.os}</span>
                        <span>vCPUs: {vm.vcpus}</span>
                        <span>RAM: {vm.ramMb / 1024} GB</span>
                        <span>IP: {vm.ipAddress}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => toggleVm(vm.id)}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-medium border ${
                        vm.status === 'Running'
                          ? 'bg-amber-950/40 border-amber-600/40 text-amber-300 hover:bg-amber-900/50'
                          : 'bg-emerald-950/40 border-emerald-600/40 text-emerald-300 hover:bg-emerald-900/50'
                      }`}
                    >
                      {vm.status === 'Running' ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                      {vm.status === 'Running' ? 'Pause' : 'Start'}
                    </button>
                    <button
                      onClick={() => {
                        setConsoleStatus(`Connected to QEMU SPICE/VNC console for ${vm.name} (Display active @ 60 FPS).`);
                        setTimeout(() => setConsoleStatus(null), 4000);
                      }}
                      className="p-1.5 bg-slate-800 hover:bg-slate-700 rounded text-slate-300 border border-slate-700"
                      title="Open Virtual Console"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* VirtIO Hardware Abstraction Details */}
            <div className="p-4 bg-slate-900 border border-slate-800 rounded-lg">
              <div className="font-semibold text-xs text-cyan-400 uppercase tracking-wider mb-2">
                VirtIO Para-Virtualized Drivers Configuration
              </div>
              <div className="grid grid-cols-3 gap-3 text-xs">
                <div className="p-2.5 bg-slate-950 rounded border border-slate-800">
                  <div className="text-slate-300 font-semibold">virtio-blk-pci</div>
                  <div className="text-[11px] text-slate-400 mt-1">Multi-queue vring depth 512, zero-copy direct host page pinning</div>
                </div>
                <div className="p-2.5 bg-slate-950 rounded border border-slate-800">
                  <div className="text-slate-300 font-semibold">virtio-net (vhost-net)</div>
                  <div className="text-[11px] text-slate-400 mt-1">Kernel-level TAP packet processing with checksum offload</div>
                </div>
                <div className="p-2.5 bg-slate-950 rounded border border-slate-800">
                  <div className="text-slate-300 font-semibold">virtio-balloon</div>
                  <div className="text-[11px] text-slate-400 mt-1">Dynamic guest memory reclamation on host pressure</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* NVME 2.0 TAB */}
        {activeTab === 'nvme' && (
          <div className="space-y-4 max-w-5xl mx-auto">
            <div className="grid grid-cols-4 gap-3">
              <div className="p-4 bg-slate-900 border border-slate-800 rounded-lg">
                <div className="text-slate-500 text-[10px] font-mono">PEAK RANDOM IOPS</div>
                <div className="text-2xl font-mono font-bold text-cyan-400 mt-1">
                  {(nvme.iopsRead / 1000).toFixed(1)}k
                </div>
                <div className="text-[11px] text-slate-400 mt-1">4KB Random Read Q=32 T=16</div>
              </div>
              <div className="p-4 bg-slate-900 border border-slate-800 rounded-lg">
                <div className="text-slate-500 text-[10px] font-mono">SEQUENTIAL BANDWIDTH</div>
                <div className="text-2xl font-mono font-bold text-emerald-400 mt-1">
                  {(nvme.bandwidthMbps / 1000).toFixed(2)} GB/s
                </div>
                <div className="text-[11px] text-slate-400 mt-1">PCIe 5.0 x4 Full Duplex</div>
              </div>
              <div className="p-4 bg-slate-900 border border-slate-800 rounded-lg">
                <div className="text-slate-500 text-[10px] font-mono">CONTROLLER LATENCY</div>
                <div className="text-2xl font-mono font-bold text-amber-400 mt-1">
                  {nvme.latencyMicrosec} µs
                </div>
                <div className="text-[11px] text-slate-400 mt-1">Doorbell write to completion</div>
              </div>
              <div className="p-4 bg-slate-900 border border-slate-800 rounded-lg">
                <div className="text-slate-500 text-[10px] font-mono">DRIVE HEALTH & TEMP</div>
                <div className="text-2xl font-mono font-bold text-slate-100 mt-1">
                  {nvme.healthPercent}% / {nvme.temperatureC}°C
                </div>
                <div className="text-[11px] text-slate-400 mt-1">SMART Telemetry Nominal</div>
              </div>
            </div>

            <div className="p-4 bg-slate-900 border border-slate-800 rounded-lg space-y-3">
              <div className="font-semibold text-xs text-slate-200">NVMe 2.0 Controller Specification & Queues</div>
              <div className="grid grid-cols-2 gap-4 text-xs font-mono">
                <div className="bg-slate-950 p-3 rounded border border-slate-800 space-y-1.5 text-slate-300">
                  <div>Model: {nvme.model}</div>
                  <div>Interface: {nvme.interface}</div>
                  <div>Firmware: {nvme.firmware}</div>
                  <div>Host Memory Buffer (HMB): {nvme.hmbAllocatedMb} MB Allocated</div>
                </div>
                <div className="bg-slate-950 p-3 rounded border border-slate-800 space-y-1.5 text-slate-300">
                  <div>Submission Queue Depth: {nvme.sqDepth} per core</div>
                  <div>Completion Queue Depth: {nvme.cqDepth} per core</div>
                  <div>TRIM / Deallocate: {nvme.trimActive ? 'Active (Continuous)' : 'Disabled'}</div>
                  <div>Direct DMA Engine: Zero-Copy Kernel Ring</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* USB 4.0 TAB */}
        {activeTab === 'usb4' && (
          <div className="space-y-4 max-w-5xl mx-auto">
            <div className="p-4 bg-slate-900 border border-slate-800 rounded-lg">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-sm font-bold text-slate-100">{usb4.generation}</h3>
                  <p className="text-xs text-slate-400">Dynamic Multi-Protocol Tunneling Router (80 Gbps Total Bandwidth)</p>
                </div>
                <span className="px-3 py-1 bg-cyan-950 border border-cyan-500/50 text-cyan-300 rounded font-mono text-xs font-bold">
                  80.0 Gbps PAM3 LINK
                </span>
              </div>

              {/* Bandwidth distribution bar */}
              <div className="space-y-2">
                <div className="flex justify-between text-xs font-mono text-slate-300">
                  <span>PCIe Gen4 Tunnel: {usb4.allocatedBandwidth.pcie} Gbps</span>
                  <span>DisplayPort 2.1 Tunnel: {usb4.allocatedBandwidth.displayPort} Gbps</span>
                  <span>USB3 Gen2x2: {usb4.allocatedBandwidth.usb3} Gbps</span>
                  <span>Headroom: {usb4.allocatedBandwidth.headroom} Gbps</span>
                </div>
                <div className="h-4 rounded-full bg-slate-950 flex overflow-hidden border border-slate-800">
                  <div style={{ width: '40%' }} className="bg-blue-500 h-full" title="PCIe Tunnel" />
                  <div style={{ width: '35%' }} className="bg-purple-500 h-full" title="DisplayPort Tunnel" />
                  <div style={{ width: '20%' }} className="bg-emerald-500 h-full" title="USB3 Tunnel" />
                  <div style={{ width: '5%' }} className="bg-slate-700 h-full" title="Headroom" />
                </div>
              </div>
            </div>

            <div className="p-4 bg-slate-900 border border-slate-800 rounded-lg">
              <div className="font-semibold text-xs text-slate-200 mb-3">Connected Docking Stations & eGPU Enclosures</div>
              {usb4.connectedDocks.map((dock) => (
                <div key={dock.id} className="p-3 bg-slate-950 border border-slate-800 rounded-lg flex items-center justify-between">
                  <div>
                    <div className="font-semibold text-xs text-cyan-300">{dock.name}</div>
                    <div className="text-[11px] text-slate-400 mt-1">
                      Power Delivery: {dock.powerDeliveryW}W | Active Ports: {dock.ports.join(', ')}
                    </div>
                  </div>
                  <span className="px-2 py-0.5 text-[10px] bg-emerald-950 border border-emerald-600/40 text-emerald-300 rounded font-mono">
                    HOT-PLUGGED & SYNCHRONIZED
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* GPU PASSTHROUGH & GRAPHICS ACCELERATION TAB */}
        {activeTab === 'gpu' && (
          <div className="space-y-4 max-w-5xl mx-auto">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-slate-100">{gpu.model}</h3>
                <p className="text-xs text-slate-400">
                  IOMMU Group {gpu.iommuGroup} | {gpu.driverVersion} | DirectX 12 Ultimate & Vulkan 1.3
                </p>
              </div>

              <div className="flex items-center gap-3">
                <span className="text-xs font-mono text-purple-300">
                  Mode: <strong>{gpu.mode}</strong>
                </span>
                <button
                  onClick={handleToggleGpuMode}
                  className="px-3 py-1.5 bg-purple-600 hover:bg-purple-500 text-white rounded text-xs font-semibold"
                >
                  Switch Mode
                </button>
              </div>
            </div>

            {/* Live GPU Hardware Render Engine Simulation */}
            <div className="grid grid-cols-3 gap-4">
              <div className="col-span-2 bg-slate-900 border border-slate-800 rounded-lg p-3">
                <div className="flex items-center justify-between mb-2">
                  <div className="text-xs font-semibold text-purple-400 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5" />
                    Live Hardware Graphics Compositor (120 FPS / Sub-8ms Latency)
                  </div>
                  <span className="text-[11px] font-mono text-emerald-400">
                    Frame Time: {gpu.frameTimeMs} ms
                  </span>
                </div>
                <div className="w-full aspect-video bg-black rounded overflow-hidden border border-slate-800">
                  <canvas ref={canvasRef} width={640} height={360} className="w-full h-full object-cover" />
                </div>
              </div>

              {/* GPU Telemetry Cards */}
              <div className="space-y-3">
                <div className="p-3 bg-slate-900 border border-slate-800 rounded-lg">
                  <div className="text-slate-500 text-[10px] font-mono">VRAM UTILIZATION</div>
                  <div className="text-lg font-mono font-bold text-purple-400 mt-1">
                    {(gpu.vramUsedMb / 1024).toFixed(1)} GB / {(gpu.vramTotalMb / 1024).toFixed(0)} GB
                  </div>
                  <div className="w-full bg-slate-950 rounded-full h-1.5 mt-2 overflow-hidden border border-slate-800">
                    <div className="bg-purple-500 h-full rounded-full" style={{ width: '12.5%' }} />
                  </div>
                </div>

                <div className="p-3 bg-slate-900 border border-slate-800 rounded-lg">
                  <div className="text-slate-500 text-[10px] font-mono">GPU COMPUTE LOAD</div>
                  <div className="text-lg font-mono font-bold text-emerald-400 mt-1">
                    {gpu.gpuLoadPercent}%
                  </div>
                  <div className="w-full bg-slate-950 rounded-full h-1.5 mt-2 overflow-hidden border border-slate-800">
                    <div className="bg-emerald-500 h-full rounded-full" style={{ width: `${gpu.gpuLoadPercent}%` }} />
                  </div>
                </div>

                <div className="p-3 bg-slate-900 border border-slate-800 rounded-lg text-xs font-mono space-y-1">
                  <div className="text-slate-400">IOMMU Group: {gpu.iommuGroup} (Clean Isolation)</div>
                  <div className="text-slate-400">VFIO Stub: Bound to vfio-pci</div>
                  <div className="text-slate-400">DirectX: {gpu.directxLevel}</div>
                  <div className="text-slate-400">Vulkan: {gpu.vulkanVersion}</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* INSTALLATION & CUSTOM APPS RUNNER TAB */}
        {activeTab === 'deploy' && (
          <div className="space-y-6 max-w-5xl mx-auto pb-10">
            {/* Header banner */}
            <div className="p-5 bg-gradient-to-r from-blue-950/70 via-slate-900 to-indigo-950/70 border border-blue-800/60 rounded-xl">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-lg bg-blue-600/30 border border-blue-500/40 text-blue-400">
                  <Laptop className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white flex items-center gap-2">
                    AegisNT OS Deployment & Custom Application Execution Guide
                    <span className="px-2 py-0.5 text-[10px] font-mono rounded bg-emerald-900/80 text-emerald-300 border border-emerald-600/40">
                      Bare-Metal / VM / Container Ready
                    </span>
                  </h3>
                  <p className="text-xs text-slate-300 mt-1">
                    Complete reference for installing AegisNT on any physical laptop, PC, or hypervisor (QEMU, KVM, VirtualBox, VMware, Proxmox) and running your own custom software.
                  </p>
                </div>
              </div>
            </div>

            {/* PART 1: INSTALL ON ANY VM */}
            <div className="p-5 bg-slate-900/90 border border-slate-800 rounded-xl space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div className="flex items-center gap-2.5">
                  <span className="flex items-center justify-center w-6 h-6 rounded-full bg-cyan-600 text-white font-bold text-xs">1</span>
                  <h4 className="text-sm font-bold text-slate-100">Deploy AegisNT in Any Virtual Machine (QEMU / KVM / VirtualBox / VMware)</h4>
                </div>
                <span className="text-[11px] font-mono text-cyan-400">Sub-microsecond VirtIO Latency</span>
              </div>

              <p className="text-xs text-slate-300 leading-relaxed">
                AegisNT is packaged with native VirtIO drivers, tickless scheduling, and UEFI GPT support. You can spin it up instantly via QEMU/KVM command line, import an OVF into VirtualBox, or run on VMware ESXi.
              </p>

              {/* QEMU CLI snippet */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-slate-200 flex items-center gap-1.5">
                    <Terminal className="w-3.5 h-3.5 text-cyan-400" />
                    Option A: Native QEMU / KVM Launch Command (Linux / macOS / WSL2)
                  </span>
                  <button
                    onClick={() => handleCopy(`qemu-system-x86_64 \\
  -enable-kvm \\
  -m 8192 -smp 4,sockets=1,cores=4,threads=1 \\
  -cpu host,hv_relaxed,hv_spinlocks=0x1fff,hv_vapic,hv_time \\
  -drive file=aegisnt-enterprise.qcow2,if=virtio,format=qcow2,cache=none,aio=native \\
  -netdev user,id=net0,hostfwd=tcp::2222-:22,hostfwd=tcp::3389-:3389 \\
  -device virtio-net-pci,netdev=net0 \\
  -device virtio-vga,virgl=on \\
  -display default,show-cursor=on`, 'qemu_cmd')}
                    className="flex items-center gap-1 px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 text-[11px]"
                  >
                    {copiedKey === 'qemu_cmd' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    {copiedKey === 'qemu_cmd' ? 'Copied QEMU command' : 'Copy Command'}
                  </button>
                </div>
                <pre className="p-3 bg-slate-950 border border-slate-800 rounded-lg font-mono text-xs text-cyan-300 overflow-x-auto leading-relaxed">
{`qemu-system-x86_64 \\
  -enable-kvm \\
  -m 8192 -smp 4,sockets=1,cores=4,threads=1 \\
  -cpu host,hv_relaxed,hv_spinlocks=0x1fff,hv_vapic,hv_time \\
  -drive file=aegisnt-enterprise.qcow2,if=virtio,format=qcow2,cache=none,aio=native \\
  -netdev user,id=net0,hostfwd=tcp::2222-:22,hostfwd=tcp::3389-:3389 \\
  -device virtio-net-pci,netdev=net0 \\
  -device virtio-vga,virgl=on \\
  -display default,show-cursor=on`}
                </pre>
              </div>

              {/* VirtualBox & VMware settings */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
                <div className="p-3 bg-slate-950 border border-slate-800 rounded-lg">
                  <div className="text-xs font-bold text-amber-300 mb-1">Oracle VirtualBox Configuration</div>
                  <ul className="text-[11px] text-slate-300 space-y-1 list-disc list-inside">
                    <li>Type: <span className="font-mono text-slate-200">Microsoft Windows</span> / Version: <span className="font-mono text-slate-200">Windows 11 (64-bit)</span></li>
                    <li>Base Memory: <span className="font-mono text-slate-200">4096 MB – 8192 MB</span> (Enable EFI)</li>
                    <li>Storage Controller: <span className="font-mono text-slate-200">AHCI SATA / NVMe</span> with host I/O cache</li>
                    <li>Network: Adapter 1 bridged or NAT with port forward 3389/22</li>
                    <li>Graphics: VBoxSVGA with 3D Acceleration enabled</li>
                  </ul>
                </div>
                <div className="p-3 bg-slate-950 border border-slate-800 rounded-lg">
                  <div className="text-xs font-bold text-blue-300 mb-1">VMware Workstation / ESXi Configuration</div>
                  <ul className="text-[11px] text-slate-300 space-y-1 list-disc list-inside">
                    <li>Guest OS: <span className="font-mono text-slate-200">Windows 11 x64</span> with Virtual TPM 2.0</li>
                    <li>Firmware: <span className="font-mono text-slate-200">UEFI Secure Boot enabled</span></li>
                    <li>Virtual Disk: NVMe or PVSCSI controller</li>
                    <li>Accelerate 3D graphics: Checked (DirectX 12 / Vulkan passthrough)</li>
                    <li>Memory: Reserve all guest memory for zero swap overhead</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* PART 2: INSTALL ON YOUR PHYSICAL LAPTOP / PC */}
            <div className="p-5 bg-slate-900/90 border border-slate-800 rounded-xl space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div className="flex items-center gap-2.5">
                  <span className="flex items-center justify-center w-6 h-6 rounded-full bg-emerald-600 text-white font-bold text-xs">2</span>
                  <h4 className="text-sm font-bold text-slate-100">Install and Run on Bare-Metal Laptop / Desktop</h4>
                </div>
                <span className="text-[11px] font-mono text-emerald-400">UEFI Dual-Boot or Standalone</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Method 2A: Flash to USB Drive */}
                <div className="p-4 bg-slate-950 border border-slate-800 rounded-lg space-y-2">
                  <div className="text-xs font-bold text-emerald-300">Method A: Live Bootable USB (Rufus / Ventoy / BalenaEtcher)</div>
                  <p className="text-[11px] text-slate-300 leading-relaxed">
                    1. Download the <code className="text-emerald-400">aegisnt-enterprise-24h2.iso</code> image.<br />
                    2. Use <strong>Rufus</strong> (select GPT partition scheme, UEFI non-CSM, FAT32/NTFS) or copy directly into a <strong>Ventoy</strong> flash drive.<br />
                    3. Plug into your laptop, reboot, press <kbd className="px-1.5 py-0.5 rounded bg-slate-800 text-[10px] text-slate-200">F12</kbd> or <kbd className="px-1.5 py-0.5 rounded bg-slate-800 text-[10px] text-slate-200">Del</kbd> to select USB boot.<br />
                    4. AegisNT installer will boot into the hardware setup wizard.
                  </p>
                </div>

                {/* Method 2B: Run as Standalone Native Laptop App (Electron / Tauri / Docker) */}
                <div className="p-4 bg-slate-950 border border-slate-800 rounded-lg space-y-2">
                  <div className="text-xs font-bold text-purple-300">Method B: Native Desktop App on Any Laptop (Electron / Tauri / Node)</div>
                  <p className="text-[11px] text-slate-300 leading-relaxed">
                    You can also run this complete OS environment as a native desktop application on your existing Windows, macOS, or Linux laptop:
                  </p>
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="text-slate-400">Native build commands:</span>
                    <button
                      onClick={() => handleCopy(`git clone <repo-url> aegisnt-os
cd aegisnt-os
npm install
npm run build
npx electron .  # or npm run dev`, 'native_cli')}
                      className="flex items-center gap-1 px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 text-[10px]"
                    >
                      {copiedKey === 'native_cli' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                      Copy CLI
                    </button>
                  </div>
                  <pre className="p-2.5 bg-slate-900 border border-slate-800 rounded font-mono text-[11px] text-purple-300">
{`git clone <repo-url> aegisnt-os
cd aegisnt-os
npm install
npm run build
npx electron .`}
                  </pre>
                </div>
              </div>
            </div>

            {/* PART 3: HOW TO RUN YOUR OWN APPLICATION */}
            <div className="p-5 bg-slate-900/90 border border-slate-800 rounded-xl space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div className="flex items-center gap-2.5">
                  <span className="flex items-center justify-center w-6 h-6 rounded-full bg-purple-600 text-white font-bold text-xs">3</span>
                  <h4 className="text-sm font-bold text-slate-100">How to Run Your Own Applications on AegisNT</h4>
                </div>
                <span className="text-[11px] font-mono text-purple-400">Win32, C++, Python, Node, Web, Custom Drivers</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {/* 3.1: Windows Executables (.EXE) */}
                <div className="p-3.5 bg-slate-950 border border-slate-800 rounded-lg flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-300">
                      <Code className="w-4 h-4 text-emerald-400" />
                      1. Run Windows .EXE Binaries
                    </div>
                    <p className="text-[11px] text-slate-300 mt-2 leading-relaxed">
                      Use the <strong>Win32 & Wine Subsystem</strong> app (`Win32ApiApp`). Go to the <strong>PE Runner</strong> tab to execute any 32-bit (PE32) or 64-bit (PE32+) Windows binary with WOW64 translation.
                    </p>
                  </div>
                  <div className="mt-3 text-[10px] font-mono p-2 bg-slate-900 rounded text-emerald-400">
                    C:\Program Files\Win32Apps\your_app.exe
                  </div>
                </div>

                {/* 3.2: Custom Kernel Drivers & C/C++ */}
                <div className="p-3.5 bg-slate-950 border border-slate-800 rounded-lg flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-1.5 text-xs font-bold text-blue-300">
                      <Cpu className="w-4 h-4 text-blue-400" />
                      2. Write & Load Custom Drivers
                    </div>
                    <p className="text-[11px] text-slate-300 mt-2 leading-relaxed">
                      Use the <strong>Driver Development Kit (WDK)</strong> app (`DriverDevKitApp`). You can write C source code for custom PCIe, NVMe, USB, or Network drivers, compile them, and hot-load them directly into the kernel pool.
                    </p>
                  </div>
                  <div className="mt-3 text-[10px] font-mono p-2 bg-slate-900 rounded text-blue-400">
                    DriverEntry(PDRIVER_OBJECT, PUNICODE_STRING)
                  </div>
                </div>

                {/* 3.3: Custom Desktop GUI Apps */}
                <div className="p-3.5 bg-slate-950 border border-slate-800 rounded-lg flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-1.5 text-xs font-bold text-amber-300">
                      <Layers className="w-4 h-4 text-amber-400" />
                      3. Add Your Own GUI Apps
                    </div>
                    <p className="text-[11px] text-slate-300 mt-2 leading-relaxed">
                      To add a permanent app to the desktop: create a component in <code className="text-amber-300">/src/components/apps/YourApp.tsx</code>, register its metadata in <code className="text-amber-300">AppWindow</code>, and add the icon to the Start Menu & Taskbar!
                    </p>
                  </div>
                  <div className="mt-3 text-[10px] font-mono p-2 bg-slate-900 rounded text-amber-400">
                    src/components/apps/YourApp.tsx
                  </div>
                </div>
              </div>

              {/* Step by step example code */}
              <div className="p-4 bg-slate-950 border border-slate-800 rounded-lg space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-slate-200">
                    Example: Boilerplate to Add a Custom App to AegisNT Desktop Shell
                  </span>
                  <button
                    onClick={() => handleCopy(`// 1. Create /src/components/apps/MyCustomApp.tsx
import React, { useState } from 'react';
import { Rocket, Play } from 'lucide-react';

export default function MyCustomApp() {
  const [output, setOutput] = useState('App ready. Click run.');
  return (
    <div className="p-6 bg-slate-950 text-slate-100 h-full flex flex-col">
      <div className="flex items-center gap-2 mb-4">
        <Rocket className="w-5 h-5 text-emerald-400" />
        <h2 className="text-base font-bold">My Custom Enterprise Utility</h2>
      </div>
      <p className="text-xs text-slate-400 mb-4">Running inside AegisNT microkernel space.</p>
      <button 
        onClick={() => setOutput('Execution successful @ ' + new Date().toLocaleTimeString())}
        className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 rounded text-xs font-semibold w-fit"
      >
        Execute Payload
      </button>
      <div className="mt-4 p-3 bg-slate-900 border border-slate-800 rounded font-mono text-xs text-emerald-300">
        {output}
      </div>
    </div>
  );
}`, 'app_template')}
                    className="flex items-center gap-1 px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 text-[11px]"
                  >
                    {copiedKey === 'app_template' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    {copiedKey === 'app_template' ? 'Copied Boilerplate' : 'Copy App Boilerplate'}
                  </button>
                </div>
                <pre className="p-3 bg-slate-900 border border-slate-800 rounded font-mono text-xs text-emerald-300 overflow-x-auto">
{`// 1. Create /src/components/apps/MyCustomApp.tsx
import React, { useState } from 'react';
import { Rocket } from 'lucide-react';

export default function MyCustomApp() {
  const [output, setOutput] = useState('App ready.');
  return (
    <div className="p-6 bg-slate-950 text-slate-100 h-full flex flex-col">
      <h2 className="text-base font-bold flex items-center gap-2">
        <Rocket className="w-5 h-5 text-emerald-400" /> My Custom Utility
      </h2>
      <button onClick={() => setOutput('Executed payload at ' + new Date().toLocaleTimeString())}>
        Run Task
      </button>
      <pre className="mt-3 p-3 bg-slate-900 rounded font-mono text-xs">{output}</pre>
    </div>
  );
}`}
                </pre>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
