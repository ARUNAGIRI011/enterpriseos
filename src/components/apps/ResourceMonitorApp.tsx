import React, { useState, useEffect } from 'react';
import {
  Activity,
  Cpu,
  HardDrive,
  Wifi,
  Layers,
  FileText,
  Search,
  Filter,
  Download,
  Trash2,
  Play,
  Pause,
  ChevronDown,
  ChevronRight,
  ShieldAlert,
  AlertTriangle,
  Info,
  CheckCircle,
  Clock,
  Server,
  RefreshCw,
  ExternalLink
} from 'lucide-react';
import { KernelEngine } from '../../services/kernelEngine';
import { SystemLogService } from '../../services/systemLogService';
import { SystemLogEvent, KernelProcess } from '../../types/os';

export default function ResourceMonitorApp() {
  const kernel = KernelEngine.getInstance();
  const logService = SystemLogService.getInstance();

  const [activeTab, setActiveTab] = useState<'overview' | 'cpu' | 'memory' | 'disk' | 'network' | 'logs'>('overview');
  const [stats, setStats] = useState(kernel.getStats());
  const [processes, setProcesses] = useState<KernelProcess[]>(kernel.processes);
  const [logs, setLogs] = useState<SystemLogEvent[]>(logService.getLogs());
  const [isStreaming, setIsStreaming] = useState(logService.getIsStreaming());
  const [selectedEvent, setSelectedEvent] = useState<SystemLogEvent | null>(logs[0] || null);

  // Log filters
  const [logSearch, setLogSearch] = useState('');
  const [logCategoryFilter, setLogCategoryFilter] = useState<'All' | 'System' | 'Security' | 'Application' | 'Hardware/Drivers'>('All');
  const [logLevelFilter, setLogLevelFilter] = useState<'All' | 'Critical' | 'Error' | 'Warning' | 'Information' | 'Success Audit'>('All');

  // Overview collapsed sections
  const [expandedSections, setExpandedSections] = useState({
    cpu: true,
    memory: true,
    disk: true,
    network: true
  });

  // Export status notification
  const [exportNotice, setExportNotice] = useState<string | null>(null);

  // Live telemetry pulse
  useEffect(() => {
    const timer = setInterval(() => {
      setStats(kernel.getStats());
      setProcesses([...kernel.processes]);
    }, 1200);

    const unsubscribe = logService.subscribe((updatedLogs) => {
      setLogs(updatedLogs);
      if (!selectedEvent && updatedLogs.length > 0) {
        setSelectedEvent(updatedLogs[0]);
      }
    });

    return () => {
      clearInterval(timer);
      unsubscribe();
    };
  }, []);

  const toggleSection = (key: keyof typeof expandedSections) => {
    setExpandedSections(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handleExportLogs = () => {
    const jsonStr = logService.exportLogsAsJson();
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `AegisNT_EventLog_${new Date().toISOString().replace(/[:.]/g, '-')}.json`;
    a.click();
    URL.revokeObjectURL(url);
    setExportNotice('Exported event logs to JSON successfully.');
    setTimeout(() => setExportNotice(null), 3500);
  };

  const filteredLogs = logs.filter(evt => {
    const matchesCategory = logCategoryFilter === 'All' || evt.logName === logCategoryFilter;
    const matchesLevel = logLevelFilter === 'All' || evt.level === logLevelFilter;
    const matchesSearch =
      evt.message.toLowerCase().includes(logSearch.toLowerCase()) ||
      evt.source.toLowerCase().includes(logSearch.toLowerCase()) ||
      evt.eventId.toString().includes(logSearch);
    return matchesCategory && matchesLevel && matchesSearch;
  });

  // Simulated CPU cores (16 virtual cores)
  const cpuCores = Array.from({ length: 16 }, (_, i) => ({
    id: i,
    load: Math.min(100, Math.max(4, Math.floor(stats.cpuUsage + ((i * 7) % 25) - 10 + (Math.random() * 8))))
  }));

  return (
    <div className="flex flex-col h-full bg-slate-950 text-slate-100 font-sans select-text">
      {/* Resmon Top Navigation Header */}
      <div className="flex items-center justify-between px-4 py-2 bg-slate-900 border-b border-slate-800">
        <div className="flex items-center gap-2.5">
          <div className="p-1.5 rounded-lg bg-cyan-600/20 border border-cyan-500/30 text-cyan-400">
            <Activity className="w-4 h-4" />
          </div>
          <div>
            <div className="text-xs font-bold text-slate-100 flex items-center gap-2">
              AegisNT Resource Monitor & System Event Logs
              <span className="px-1.5 py-0.2 rounded text-[10px] font-mono bg-cyan-950 text-cyan-300 border border-cyan-800">
                resmon.exe
              </span>
            </div>
            <div className="text-[10px] text-slate-400 font-mono">
              Live NT Kernel Subsystem & Hypervisor Telemetry
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs">
          <div className="flex items-center gap-3 font-mono text-[11px] bg-slate-950 px-3 py-1 rounded border border-slate-800">
            <span className="text-cyan-400">CPU: {stats.cpuUsage}%</span>
            <span className="text-purple-400">MEM: {Math.round((stats.memoryUsedMb / stats.memoryTotalMb) * 100)}%</span>
            <span className="text-emerald-400">DISK: 1.2M IOPS</span>
            <span className="text-amber-400">NET: 10 Gbps</span>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-800 bg-slate-900/60 px-2 text-xs font-medium">
        {[
          { id: 'overview', label: 'Overview', icon: Activity, count: 'All Subsystems' },
          { id: 'cpu', label: 'CPU & Processors', icon: Cpu, count: `${stats.cpuUsage}%` },
          { id: 'memory', label: 'Memory & Commit', icon: Layers, count: `${(stats.memoryUsedMb / 1024).toFixed(1)} GB` },
          { id: 'disk', label: 'Disk & NVMe', icon: HardDrive, count: '1.2M IOPS' },
          { id: 'network', label: 'Network & VirtIO', icon: Wifi, count: '10 Gbps' },
          { id: 'logs', label: 'System Logs & Event Viewer', icon: FileText, count: `${logs.length} Events` }
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-1.5 py-2.5 px-3.5 border-b-2 transition-all ${
                isActive
                  ? 'border-cyan-500 text-cyan-400 bg-slate-800/50 font-semibold'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
              <span className="ml-1 text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-800/80 text-slate-300">
                {tab.count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Main Tab Content Area */}
      <div className="flex-1 overflow-y-auto bg-slate-950 p-4">
        {/* TAB 1: OVERVIEW */}
        {activeTab === 'overview' && (
          <div className="space-y-4 max-w-6xl mx-auto">
            {/* CPU SECTION */}
            <div className="bg-slate-900 border border-slate-800 rounded-lg overflow-hidden">
              <button
                onClick={() => toggleSection('cpu')}
                className="w-full flex items-center justify-between p-3 bg-slate-900/90 hover:bg-slate-800/60 text-left"
              >
                <div className="flex items-center gap-2 text-xs font-bold text-slate-200">
                  {expandedSections.cpu ? <ChevronDown className="w-4 h-4 text-cyan-400" /> : <ChevronRight className="w-4 h-4 text-slate-400" />}
                  <Cpu className="w-4 h-4 text-cyan-400" />
                  <span>CPU — {stats.cpuUsage}% Total CPU Utilization</span>
                  <span className="text-[11px] font-normal text-slate-400 font-mono">
                    ({stats.processCount} processes, {stats.threadCount} threads, {stats.handleCount.toLocaleString()} handles)
                  </span>
                </div>
                <div className="flex items-center gap-3 text-xs font-mono">
                  <span className="text-slate-400">Context Switch: {stats.contextSwitchRate.toLocaleString()} /sec</span>
                </div>
              </button>

              {expandedSections.cpu && (
                <div className="p-3 border-t border-slate-800 bg-slate-950/70">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs font-mono">
                      <thead className="text-[11px] text-slate-400 border-b border-slate-800 bg-slate-900/50">
                        <tr>
                          <th className="p-2">Image</th>
                          <th className="p-2">PID</th>
                          <th className="p-2">Status</th>
                          <th className="p-2">Threads</th>
                          <th className="p-2">CPU (%)</th>
                          <th className="p-2">Average CPU</th>
                          <th className="p-2">Subsystem</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-800/60">
                        {processes.slice(0, 6).map((proc) => (
                          <tr key={proc.pid} className="hover:bg-slate-800/30">
                            <td className="p-2 font-semibold text-slate-200">{proc.name}</td>
                            <td className="p-2 text-slate-400">{proc.pid}</td>
                            <td className="p-2">
                              <span className="px-1.5 py-0.5 rounded text-[10px] bg-emerald-950 text-emerald-300 border border-emerald-800">
                                {proc.status}
                              </span>
                            </td>
                            <td className="p-2 text-slate-300">{proc.threads}</td>
                            <td className="p-2 font-bold text-cyan-400">{proc.cpuPercent}%</td>
                            <td className="p-2 text-slate-400">{(proc.cpuPercent * 0.85).toFixed(1)}%</td>
                            <td className="p-2 text-purple-300">{proc.subsystem}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>

            {/* MEMORY SECTION */}
            <div className="bg-slate-900 border border-slate-800 rounded-lg overflow-hidden">
              <button
                onClick={() => toggleSection('memory')}
                className="w-full flex items-center justify-between p-3 bg-slate-900/90 hover:bg-slate-800/60 text-left"
              >
                <div className="flex items-center gap-2 text-xs font-bold text-slate-200">
                  {expandedSections.memory ? <ChevronDown className="w-4 h-4 text-purple-400" /> : <ChevronRight className="w-4 h-4 text-slate-400" />}
                  <Layers className="w-4 h-4 text-purple-400" />
                  <span>Memory — 23% In Use ({(stats.memoryUsedMb / 1024).toFixed(1)} GB of 32 GB)</span>
                  <span className="text-[11px] font-normal text-slate-400 font-mono">
                    Commit: 8,420 MB / 36,864 MB
                  </span>
                </div>
                <div className="text-xs font-mono text-purple-400">
                  Non-Paged Pool: {stats.nonPagedPoolMb} MB
                </div>
              </button>

              {expandedSections.memory && (
                <div className="p-3 border-t border-slate-800 bg-slate-950/70 space-y-3">
                  <div className="space-y-1">
                    <div className="flex justify-between text-[11px] font-mono text-slate-400">
                      <span>Physical Memory Breakdown:</span>
                      <span>32,768 MB Total Installed</span>
                    </div>
                    {/* Visual Memory Bar */}
                    <div className="h-6 rounded bg-slate-900 border border-slate-800 flex overflow-hidden text-[10px] font-mono font-bold text-center">
                      <div className="bg-slate-700 text-slate-300 flex items-center justify-center" style={{ width: '2%' }} title="Hardware Reserved: 128 MB">
                        Res
                      </div>
                      <div className="bg-purple-600 text-white flex items-center justify-center" style={{ width: '23%' }} title="In Use: 7,420 MB">
                        In Use (7.4 GB)
                      </div>
                      <div className="bg-amber-600 text-white flex items-center justify-center" style={{ width: '2%' }} title="Modified: 312 MB">
                        Mod
                      </div>
                      <div className="bg-blue-600 text-white flex items-center justify-center" style={{ width: '38%' }} title="Standby: 12,480 MB">
                        Standby (12.5 GB)
                      </div>
                      <div className="bg-emerald-600 text-white flex items-center justify-center" style={{ width: '35%' }} title="Free: 12,428 MB">
                        Free (12.4 GB)
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2 pt-1 text-xs font-mono">
                    <div className="p-2 bg-slate-900 border border-slate-800 rounded">
                      <div className="text-slate-500 text-[10px]">PAGED POOL</div>
                      <div className="font-bold text-purple-300">{stats.pagedPoolMb} MB</div>
                    </div>
                    <div className="p-2 bg-slate-900 border border-slate-800 rounded">
                      <div className="text-slate-500 text-[10px]">NON-PAGED POOL</div>
                      <div className="font-bold text-indigo-300">{stats.nonPagedPoolMb} MB</div>
                    </div>
                    <div className="p-2 bg-slate-900 border border-slate-800 rounded">
                      <div className="text-slate-500 text-[10px]">STANDBY CACHE</div>
                      <div className="font-bold text-blue-300">12,480 MB</div>
                    </div>
                    <div className="p-2 bg-slate-900 border border-slate-800 rounded">
                      <div className="text-slate-500 text-[10px]">PAGE FAULTS / SEC</div>
                      <div className="font-bold text-emerald-300">42 / sec</div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* DISK SECTION */}
            <div className="bg-slate-900 border border-slate-800 rounded-lg overflow-hidden">
              <button
                onClick={() => toggleSection('disk')}
                className="w-full flex items-center justify-between p-3 bg-slate-900/90 hover:bg-slate-800/60 text-left"
              >
                <div className="flex items-center gap-2 text-xs font-bold text-slate-200">
                  {expandedSections.disk ? <ChevronDown className="w-4 h-4 text-emerald-400" /> : <ChevronRight className="w-4 h-4 text-slate-400" />}
                  <HardDrive className="w-4 h-4 text-emerald-400" />
                  <span>Disk — PCIe 5.0 NVMe Host Controller (1.2M IOPS Active)</span>
                  <span className="text-[11px] font-normal text-slate-400 font-mono">
                    Queue Length: 0.02 | Response Time: 26 µs
                  </span>
                </div>
                <div className="text-xs font-mono text-emerald-400">
                  Bandwidth: 14,200 MB/s
                </div>
              </button>

              {expandedSections.disk && (
                <div className="p-3 border-t border-slate-800 bg-slate-950/70">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-xs font-mono">
                    <div className="p-2.5 bg-slate-900 border border-slate-800 rounded">
                      <div className="text-slate-400 text-[11px]">C: System (AES-XTS-256 BitLocker)</div>
                      <div className="font-bold text-emerald-300 mt-1">Read: 84 MB/s | Write: 12 MB/s</div>
                      <div className="text-[10px] text-slate-500 mt-0.5">Response Time: 18 microseconds</div>
                    </div>
                    <div className="p-2.5 bg-slate-900 border border-slate-800 rounded">
                      <div className="text-slate-400 text-[11px]">D: QEMU / KVM Image Store</div>
                      <div className="font-bold text-cyan-300 mt-1">Read: 340 MB/s | Write: 180 MB/s</div>
                      <div className="text-[10px] text-slate-500 mt-0.5">Response Time: 24 microseconds</div>
                    </div>
                    <div className="p-2.5 bg-slate-900 border border-slate-800 rounded">
                      <div className="text-slate-400 text-[11px]">E: High-Speed NVMe Scratch</div>
                      <div className="font-bold text-amber-300 mt-1">Read: 1,820 MB/s | Write: 940 MB/s</div>
                      <div className="text-[10px] text-slate-500 mt-0.5">Response Time: 29 microseconds</div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* NETWORK SECTION */}
            <div className="bg-slate-900 border border-slate-800 rounded-lg overflow-hidden">
              <button
                onClick={() => toggleSection('network')}
                className="w-full flex items-center justify-between p-3 bg-slate-900/90 hover:bg-slate-800/60 text-left"
              >
                <div className="flex items-center gap-2 text-xs font-bold text-slate-200">
                  {expandedSections.network ? <ChevronDown className="w-4 h-4 text-blue-400" /> : <ChevronRight className="w-4 h-4 text-slate-400" />}
                  <Wifi className="w-4 h-4 text-blue-400" />
                  <span>Network — VirtIO-Net 10Gbps Virtual Adapter</span>
                  <span className="text-[11px] font-normal text-slate-400 font-mono">
                    Send: 1.4 Mbps | Receive: 8.2 Mbps
                  </span>
                </div>
                <div className="text-xs font-mono text-blue-400">
                  Packet Loss: 0.00%
                </div>
              </button>

              {expandedSections.network && (
                <div className="p-3 border-t border-slate-800 bg-slate-950/70">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs font-mono">
                      <thead className="text-[11px] text-slate-400 border-b border-slate-800 bg-slate-900/50">
                        <tr>
                          <th className="p-2">Image</th>
                          <th className="p-2">PID</th>
                          <th className="p-2">Address</th>
                          <th className="p-2">Send (B/s)</th>
                          <th className="p-2">Receive (B/s)</th>
                          <th className="p-2">Total (B/s)</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-800/60">
                        {[
                          { name: 'qemu-system-x86_64', pid: 1420, addr: '192.168.122.180', send: 142000, recv: 890000 },
                          { name: 'sshd.exe', pid: 820, addr: '0.0.0.0:22', send: 4200, recv: 1240 },
                          { name: 'WinRM.exe', pid: 910, addr: '0.0.0.0:5985', send: 1100, recv: 940 },
                          { name: 'System', pid: 4, addr: '192.168.122.1', send: 680, recv: 680 }
                        ].map((row) => (
                          <tr key={row.pid} className="hover:bg-slate-800/30">
                            <td className="p-2 font-semibold text-slate-200">{row.name}</td>
                            <td className="p-2 text-slate-400">{row.pid}</td>
                            <td className="p-2 text-blue-400">{row.addr}</td>
                            <td className="p-2 text-emerald-400">{row.send.toLocaleString()}</td>
                            <td className="p-2 text-cyan-400">{row.recv.toLocaleString()}</td>
                            <td className="p-2 text-slate-300 font-bold">{(row.send + row.recv).toLocaleString()}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 2: CPU */}
        {activeTab === 'cpu' && (
          <div className="space-y-4 max-w-6xl mx-auto">
            <div className="p-4 bg-slate-900 border border-slate-800 rounded-lg">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <h3 className="text-sm font-bold text-slate-200 flex items-center gap-2">
                    <Cpu className="w-4 h-4 text-cyan-400" />
                    Logical Processors Activity Matrix (16 vCPUs / Hypervisor Cores)
                  </h3>
                  <p className="text-xs text-slate-400">
                    Tickless kernel scheduler with sub-microsecond preemption and NUMA core pinning.
                  </p>
                </div>
                <div className="text-xs font-mono font-bold text-cyan-400">
                  Global Load: {stats.cpuUsage}%
                </div>
              </div>

              {/* 16 Logical cores grid */}
              <div className="grid grid-cols-4 md:grid-cols-8 gap-2">
                {cpuCores.map((core) => (
                  <div key={core.id} className="p-2 bg-slate-950 border border-slate-800 rounded flex flex-col items-center">
                    <div className="text-[10px] font-mono text-slate-400">CPU {core.id}</div>
                    <div className="w-full bg-slate-900 h-16 rounded overflow-hidden mt-1 relative flex flex-col justify-end">
                      <div
                        className="bg-cyan-500 w-full transition-all duration-500 rounded-t"
                        style={{ height: `${core.load}%` }}
                      />
                    </div>
                    <div className="text-[11px] font-mono font-bold text-cyan-300 mt-1">{core.load}%</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Complete process list */}
            <div className="bg-slate-900 border border-slate-800 rounded-lg overflow-hidden">
              <div className="p-3 bg-slate-900/90 border-b border-slate-800 flex items-center justify-between">
                <span className="text-xs font-bold text-slate-200">Executive Process Table & Associated Threads</span>
                <span className="text-xs font-mono text-slate-400">{processes.length} Processes Active</span>
              </div>
              <div className="overflow-x-auto max-h-80">
                <table className="w-full text-left text-xs font-mono">
                  <thead className="text-[11px] text-slate-400 border-b border-slate-800 bg-slate-950 sticky top-0">
                    <tr>
                      <th className="p-2.5">Process Name</th>
                      <th className="p-2.5">PID</th>
                      <th className="p-2.5">User Context</th>
                      <th className="p-2.5">CPU (%)</th>
                      <th className="p-2.5">Memory (MB)</th>
                      <th className="p-2.5">Threads</th>
                      <th className="p-2.5">Handles</th>
                      <th className="p-2.5">Subsystem</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800">
                    {processes.map((proc) => (
                      <tr key={proc.pid} className="hover:bg-slate-800/40">
                        <td className="p-2 font-semibold text-slate-200">{proc.name}</td>
                        <td className="p-2 text-slate-400">{proc.pid}</td>
                        <td className="p-2 text-slate-400">{proc.user}</td>
                        <td className="p-2 font-bold text-cyan-400">{proc.cpuPercent}%</td>
                        <td className="p-2 text-purple-300">{proc.memoryMb} MB</td>
                        <td className="p-2 text-slate-300">{proc.threads}</td>
                        <td className="p-2 text-slate-400">{proc.handles}</td>
                        <td className="p-2 text-emerald-400">{proc.subsystem}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: MEMORY */}
        {activeTab === 'memory' && (
          <div className="space-y-4 max-w-6xl mx-auto">
            <div className="p-4 bg-slate-900 border border-slate-800 rounded-lg space-y-4">
              <div>
                <h3 className="text-sm font-bold text-slate-200 flex items-center gap-2">
                  <Layers className="w-4 h-4 text-purple-400" />
                  Physical & Virtual Memory Architecture
                </h3>
                <p className="text-xs text-slate-400">
                  SLAT (Second Level Address Translation), EPT/NPT page tables, and Zero-Copy I/O buffers.
                </p>
              </div>

              {/* Memory distribution map */}
              <div className="space-y-2">
                <div className="h-10 rounded-lg bg-slate-950 border border-slate-800 flex overflow-hidden text-xs font-mono font-bold text-center">
                  <div className="bg-slate-700 text-slate-200 flex items-center justify-center" style={{ width: '2%' }}>
                    128 MB
                  </div>
                  <div className="bg-purple-600 text-white flex items-center justify-center" style={{ width: '23%' }}>
                    In Use: 7,420 MB
                  </div>
                  <div className="bg-amber-600 text-white flex items-center justify-center" style={{ width: '2%' }}>
                    312 MB
                  </div>
                  <div className="bg-blue-600 text-white flex items-center justify-center" style={{ width: '38%' }}>
                    Standby: 12,480 MB
                  </div>
                  <div className="bg-emerald-600 text-white flex items-center justify-center" style={{ width: '35%' }}>
                    Free: 12,428 MB
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-5 gap-2 text-[11px] font-mono">
                  <div className="p-2 bg-slate-950 rounded border border-slate-800">
                    <span className="inline-block w-2.5 h-2.5 bg-slate-700 rounded-full mr-1.5" />
                    <span className="text-slate-400">Hardware Reserved</span>
                    <div className="font-bold text-slate-200 mt-0.5">128 MB</div>
                  </div>
                  <div className="p-2 bg-slate-950 rounded border border-slate-800">
                    <span className="inline-block w-2.5 h-2.5 bg-purple-600 rounded-full mr-1.5" />
                    <span className="text-slate-400">In Use</span>
                    <div className="font-bold text-purple-300 mt-0.5">7,420 MB</div>
                  </div>
                  <div className="p-2 bg-slate-950 rounded border border-slate-800">
                    <span className="inline-block w-2.5 h-2.5 bg-amber-600 rounded-full mr-1.5" />
                    <span className="text-slate-400">Modified</span>
                    <div className="font-bold text-amber-300 mt-0.5">312 MB</div>
                  </div>
                  <div className="p-2 bg-slate-950 rounded border border-slate-800">
                    <span className="inline-block w-2.5 h-2.5 bg-blue-600 rounded-full mr-1.5" />
                    <span className="text-slate-400">Standby (Cache)</span>
                    <div className="font-bold text-blue-300 mt-0.5">12,480 MB</div>
                  </div>
                  <div className="p-2 bg-slate-950 rounded border border-slate-800">
                    <span className="inline-block w-2.5 h-2.5 bg-emerald-600 rounded-full mr-1.5" />
                    <span className="text-slate-400">Free</span>
                    <div className="font-bold text-emerald-300 mt-0.5">12,428 MB</div>
                  </div>
                </div>
              </div>

              {/* Memory Metrics */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-2">
                <div className="p-3 bg-slate-950 border border-slate-800 rounded-lg">
                  <div className="text-xs font-bold text-slate-300 mb-2">Commit Charge</div>
                  <div className="text-sm font-mono font-bold text-purple-400">8,420 MB / 36,864 MB</div>
                  <div className="text-[11px] text-slate-400 mt-1">Pagefile capacity: 4,096 MB on NVMe</div>
                </div>
                <div className="p-3 bg-slate-950 border border-slate-800 rounded-lg">
                  <div className="text-xs font-bold text-slate-300 mb-2">Kernel Pools</div>
                  <div className="text-sm font-mono font-bold text-indigo-400">Paged: 1,140 MB | Non-Paged: 420 MB</div>
                  <div className="text-[11px] text-slate-400 mt-1">Driver pool allocation overhead: 1.2%</div>
                </div>
                <div className="p-3 bg-slate-950 border border-slate-800 rounded-lg">
                  <div className="text-xs font-bold text-slate-300 mb-2">Paging Activity</div>
                  <div className="text-sm font-mono font-bold text-emerald-400">Hard Faults: 0 / sec | Soft: 42 / sec</div>
                  <div className="text-[11px] text-slate-400 mt-1">Direct DMA zero-copy bypass enabled</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: DISK */}
        {activeTab === 'disk' && (
          <div className="space-y-4 max-w-6xl mx-auto">
            <div className="p-4 bg-slate-900 border border-slate-800 rounded-lg space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-slate-200 flex items-center gap-2">
                    <HardDrive className="w-4 h-4 text-emerald-400" />
                    PCIe Gen5 NVMe Storage Controller & Doorbell Rings
                  </h3>
                  <p className="text-xs text-slate-400">
                    64 submission queues, 64 completion queues, Direct Memory Access with hardware TRIM.
                  </p>
                </div>
                <div className="text-xs font-mono text-emerald-400 bg-emerald-950/80 px-2.5 py-1 rounded border border-emerald-800">
                  IOPS: 1,200,000 Read / 950,000 Write
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-3 text-xs font-mono">
                <div className="p-3 bg-slate-950 border border-slate-800 rounded-lg">
                  <div className="text-slate-500 text-[10px]">CURRENT BANDWIDTH</div>
                  <div className="text-base font-bold text-emerald-400 mt-1">14,200 MB/s</div>
                  <div className="text-[10px] text-slate-400 mt-0.5">PCIe 5.0 x4 Link Active</div>
                </div>
                <div className="p-3 bg-slate-950 border border-slate-800 rounded-lg">
                  <div className="text-slate-500 text-[10px]">AVG RESPONSE TIME</div>
                  <div className="text-base font-bold text-cyan-400 mt-1">26.2 µs</div>
                  <div className="text-[10px] text-slate-400 mt-0.5">Microsecond Latency</div>
                </div>
                <div className="p-3 bg-slate-950 border border-slate-800 rounded-lg">
                  <div className="text-slate-500 text-[10px]">ACTIVE QUEUE LENGTH</div>
                  <div className="text-base font-bold text-amber-400 mt-1">0.02</div>
                  <div className="text-[10px] text-slate-400 mt-0.5">Zero Bottleneck</div>
                </div>
                <div className="p-3 bg-slate-950 border border-slate-800 rounded-lg">
                  <div className="text-slate-500 text-[10px]">FVE ENCRYPTION CIPHER</div>
                  <div className="text-base font-bold text-purple-400 mt-1">AES-XTS-256</div>
                  <div className="text-[10px] text-slate-400 mt-0.5">TPM 2.0 PCR Sealed</div>
                </div>
              </div>

              {/* Disk Activity Table */}
              <div className="bg-slate-950 border border-slate-800 rounded-lg overflow-hidden">
                <div className="p-2.5 bg-slate-900 border-b border-slate-800 text-xs font-bold text-slate-300">
                  Processes with Disk Activity
                </div>
                <table className="w-full text-left text-xs font-mono">
                  <thead className="text-[11px] text-slate-400 border-b border-slate-800 bg-slate-950">
                    <tr>
                      <th className="p-2">Image</th>
                      <th className="p-2">PID</th>
                      <th className="p-2">Read (B/s)</th>
                      <th className="p-2">Write (B/s)</th>
                      <th className="p-2">Total (B/s)</th>
                      <th className="p-2">Priority I/O</th>
                      <th className="p-2">Response (ms)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60">
                    {[
                      { name: 'qemu-system-x86_64', pid: 1420, read: 284000000, write: 110000000, pri: 'High', ms: 0.03 },
                      { name: 'System', pid: 4, read: 42000000, write: 18000000, pri: 'RealTime', ms: 0.01 },
                      { name: 'soffice.bin', pid: 2204, read: 1200000, write: 4800000, pri: 'Normal', ms: 0.05 },
                      { name: 'fve_crypto.sys', pid: 64, read: 8400000, write: 8400000, pri: 'High', ms: 0.02 }
                    ].map((row) => (
                      <tr key={row.pid} className="hover:bg-slate-900">
                        <td className="p-2 font-semibold text-slate-200">{row.name}</td>
                        <td className="p-2 text-slate-400">{row.pid}</td>
                        <td className="p-2 text-emerald-400">{(row.read / 1000000).toFixed(1)} MB/s</td>
                        <td className="p-2 text-amber-400">{(row.write / 1000000).toFixed(1)} MB/s</td>
                        <td className="p-2 text-cyan-300 font-bold">{((row.read + row.write) / 1000000).toFixed(1)} MB/s</td>
                        <td className="p-2 text-purple-300">{row.pri}</td>
                        <td className="p-2 text-slate-300">{row.ms} ms</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 5: NETWORK */}
        {activeTab === 'network' && (
          <div className="space-y-4 max-w-6xl mx-auto">
            <div className="p-4 bg-slate-900 border border-slate-800 rounded-lg space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-slate-200 flex items-center gap-2">
                    <Wifi className="w-4 h-4 text-blue-400" />
                    Network Stack & Active TCP Connections
                  </h3>
                  <p className="text-xs text-slate-400">
                    VirtIO-Net para-virtualized network ring buffers and hardware offloaded checksumming.
                  </p>
                </div>
                <div className="text-xs font-mono text-blue-400 bg-blue-950/80 px-2.5 py-1 rounded border border-blue-800">
                  Link Speed: 10,000 Mbps Full Duplex
                </div>
              </div>

              {/* Network Connections */}
              <div className="bg-slate-950 border border-slate-800 rounded-lg overflow-hidden">
                <div className="p-2.5 bg-slate-900 border-b border-slate-800 text-xs font-bold text-slate-300">
                  Active TCP Connections
                </div>
                <table className="w-full text-left text-xs font-mono">
                  <thead className="text-[11px] text-slate-400 border-b border-slate-800 bg-slate-950">
                    <tr>
                      <th className="p-2">Image</th>
                      <th className="p-2">PID</th>
                      <th className="p-2">Local Address</th>
                      <th className="p-2">Remote Address</th>
                      <th className="p-2">Packet Loss</th>
                      <th className="p-2">Latency</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60">
                    {[
                      { name: 'sshd.exe', pid: 820, local: '192.168.122.180:22', remote: '192.168.122.1:51240', loss: '0%', lat: '0.1 ms' },
                      { name: 'WinRM.exe', pid: 910, local: '192.168.122.180:5985', remote: '192.168.122.1:54992', loss: '0%', lat: '0.1 ms' },
                      { name: 'qemu-system-x86_64', pid: 1420, local: '127.0.0.1:5901', remote: '127.0.0.1:49182', loss: '0%', lat: '0.05 ms' },
                      { name: 'System', pid: 4, local: '0.0.0.0:445', remote: 'Listening', loss: '-', lat: '-' }
                    ].map((row, idx) => (
                      <tr key={idx} className="hover:bg-slate-900">
                        <td className="p-2 font-semibold text-slate-200">{row.name}</td>
                        <td className="p-2 text-slate-400">{row.pid}</td>
                        <td className="p-2 text-blue-400">{row.local}</td>
                        <td className="p-2 text-slate-300">{row.remote}</td>
                        <td className="p-2 text-emerald-400">{row.loss}</td>
                        <td className="p-2 text-cyan-300">{row.lat}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Listening Ports */}
              <div className="bg-slate-950 border border-slate-800 rounded-lg overflow-hidden">
                <div className="p-2.5 bg-slate-900 border-b border-slate-800 text-xs font-bold text-slate-300">
                  Listening Ports & Firewall Status
                </div>
                <table className="w-full text-left text-xs font-mono">
                  <thead className="text-[11px] text-slate-400 border-b border-slate-800 bg-slate-950">
                    <tr>
                      <th className="p-2">Port</th>
                      <th className="p-2">Protocol</th>
                      <th className="p-2">Process</th>
                      <th className="p-2">PID</th>
                      <th className="p-2">Firewall Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60">
                    {[
                      { port: 22, proto: 'TCP', proc: 'sshd.exe', pid: 820, fw: 'Allowed (Domain, Private)' },
                      { port: 5985, proto: 'TCP', proc: 'WinRM.exe', pid: 910, fw: 'Allowed (Domain)' },
                      { port: 5901, proto: 'TCP (VNC)', proc: 'qemu-system-x86_64', pid: 1420, fw: 'Allowed (Local Bridge)' },
                      { port: 3389, proto: 'TCP (RDP)', proc: 'termsrv.dll', pid: 740, fw: 'Allowed (Domain)' }
                    ].map((row, idx) => (
                      <tr key={idx} className="hover:bg-slate-900">
                        <td className="p-2 font-bold text-amber-400">{row.port}</td>
                        <td className="p-2 text-slate-400">{row.proto}</td>
                        <td className="p-2 text-slate-200">{row.proc}</td>
                        <td className="p-2 text-slate-400">{row.pid}</td>
                        <td className="p-2 text-emerald-400">{row.fw}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 6: SYSTEM LOGS & EVENT VIEWER */}
        {activeTab === 'logs' && (
          <div className="flex flex-col h-full space-y-3 max-w-6xl mx-auto">
            {/* Action Bar */}
            <div className="flex flex-wrap items-center justify-between gap-2 p-3 bg-slate-900 border border-slate-800 rounded-lg text-xs">
              <div className="flex flex-wrap items-center gap-2">
                {/* Search */}
                <div className="relative">
                  <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={logSearch}
                    onChange={(e) => setLogSearch(e.target.value)}
                    placeholder="Filter Event ID, Source, Text..."
                    className="pl-8 pr-3 py-1.5 bg-slate-950 border border-slate-800 rounded text-xs text-slate-200 placeholder-slate-500 w-56 focus:outline-none focus:border-cyan-500"
                  />
                </div>

                {/* Category select */}
                <select
                  value={logCategoryFilter}
                  onChange={(e) => setLogCategoryFilter(e.target.value as any)}
                  className="bg-slate-950 border border-slate-800 rounded px-2.5 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-cyan-500"
                >
                  <option value="All">All Log Categories</option>
                  <option value="System">System Log</option>
                  <option value="Security">Security (Audit)</option>
                  <option value="Application">Application</option>
                  <option value="Hardware/Drivers">Hardware & Drivers</option>
                </select>

                {/* Level select */}
                <select
                  value={logLevelFilter}
                  onChange={(e) => setLogLevelFilter(e.target.value as any)}
                  className="bg-slate-950 border border-slate-800 rounded px-2.5 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-cyan-500"
                >
                  <option value="All">All Severity Levels</option>
                  <option value="Information">Information</option>
                  <option value="Warning">Warning</option>
                  <option value="Error">Error / Critical</option>
                  <option value="Success Audit">Success Audit</option>
                </select>
              </div>

              {/* Controls */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsStreaming(logService.toggleStreaming())}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded font-medium ${
                    isStreaming
                      ? 'bg-amber-950 border border-amber-800 text-amber-300 hover:bg-amber-900'
                      : 'bg-emerald-950 border border-emerald-800 text-emerald-300 hover:bg-emerald-900'
                  }`}
                >
                  {isStreaming ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                  {isStreaming ? 'Pause Stream' : 'Resume Stream'}
                </button>

                <button
                  onClick={handleExportLogs}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-cyan-600 hover:bg-cyan-500 text-white rounded font-medium"
                >
                  <Download className="w-3.5 h-3.5" />
                  Export Logs
                </button>

                <button
                  onClick={() => logService.clearLogs()}
                  className="flex items-center gap-1.5 px-2.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded"
                  title="Clear Log View"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {exportNotice && (
              <div className="p-2.5 bg-emerald-950 border border-emerald-700 text-emerald-300 text-xs rounded-lg flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-400" />
                <span>{exportNotice}</span>
              </div>
            )}

            {/* Split View: Events Table (Top) + Event Details (Bottom) */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 flex-1 min-h-[460px]">
              {/* Event List Table */}
              <div className="lg:col-span-7 bg-slate-900 border border-slate-800 rounded-lg overflow-hidden flex flex-col">
                <div className="p-2.5 bg-slate-950 border-b border-slate-800 text-xs font-bold text-slate-300 flex items-center justify-between">
                  <span>NT Event Stream ({filteredLogs.length} events)</span>
                  <span className="text-[10px] text-slate-500 font-mono">Live Ingestion Active</span>
                </div>

                <div className="flex-1 overflow-y-auto">
                  <table className="w-full text-left text-xs font-mono">
                    <thead className="text-[11px] text-slate-400 border-b border-slate-800 bg-slate-950 sticky top-0">
                      <tr>
                        <th className="p-2">Level</th>
                        <th className="p-2">Time</th>
                        <th className="p-2">Source</th>
                        <th className="p-2">Event ID</th>
                        <th className="p-2">Task Category</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/60">
                      {filteredLogs.map((evt) => {
                        const isSelected = selectedEvent?.id === evt.id;
                        return (
                          <tr
                            key={evt.id}
                            onClick={() => setSelectedEvent(evt)}
                            className={`cursor-pointer transition-colors ${
                              isSelected
                                ? 'bg-cyan-950/70 border-l-2 border-cyan-400'
                                : 'hover:bg-slate-800/40'
                            }`}
                          >
                            <td className="p-2">
                              {evt.level === 'Warning' ? (
                                <span className="flex items-center gap-1 text-amber-400 text-[11px]">
                                  <AlertTriangle className="w-3 h-3 text-amber-400" /> Warn
                                </span>
                              ) : evt.level === 'Error' || evt.level === 'Critical' ? (
                                <span className="flex items-center gap-1 text-rose-400 text-[11px]">
                                  <ShieldAlert className="w-3 h-3 text-rose-400" /> Error
                                </span>
                              ) : evt.level === 'Success Audit' ? (
                                <span className="flex items-center gap-1 text-emerald-400 text-[11px]">
                                  <CheckCircle className="w-3 h-3 text-emerald-400" /> Audit
                                </span>
                              ) : (
                                <span className="flex items-center gap-1 text-cyan-400 text-[11px]">
                                  <Info className="w-3 h-3 text-cyan-400" /> Info
                                </span>
                              )}
                            </td>
                            <td className="p-2 text-slate-400 text-[11px]">{evt.timestamp}</td>
                            <td className="p-2 text-slate-200 truncate max-w-[140px]" title={evt.source}>
                              {evt.source}
                            </td>
                            <td className="p-2 text-amber-300 font-bold">{evt.eventId}</td>
                            <td className="p-2 text-slate-400 truncate max-w-[120px]">{evt.category}</td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Event Details Pane */}
              <div className="lg:col-span-5 bg-slate-900 border border-slate-800 rounded-lg p-4 flex flex-col justify-between overflow-y-auto">
                {selectedEvent ? (
                  <div className="space-y-3">
                    <div className="border-b border-slate-800 pb-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-slate-200">Event Properties</span>
                        <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-slate-800 text-cyan-300">
                          {selectedEvent.logName} Log
                        </span>
                      </div>
                      <div className="text-base font-bold text-slate-100 mt-1">
                        Event {selectedEvent.eventId}, {selectedEvent.source}
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-[11px] font-mono">
                      <div>
                        <span className="text-slate-500">Log Name: </span>
                        <span className="text-slate-300">{selectedEvent.logName}</span>
                      </div>
                      <div>
                        <span className="text-slate-500">Source: </span>
                        <span className="text-cyan-400 truncate">{selectedEvent.source}</span>
                      </div>
                      <div>
                        <span className="text-slate-500">Event ID: </span>
                        <span className="text-amber-300 font-bold">{selectedEvent.eventId}</span>
                      </div>
                      <div>
                        <span className="text-slate-500">Level: </span>
                        <span className="text-slate-300">{selectedEvent.level}</span>
                      </div>
                      <div>
                        <span className="text-slate-500">User: </span>
                        <span className="text-slate-300">{selectedEvent.user}</span>
                      </div>
                      <div>
                        <span className="text-slate-500">Computer: </span>
                        <span className="text-slate-300">{selectedEvent.computer}</span>
                      </div>
                      <div>
                        <span className="text-slate-500">Logged: </span>
                        <span className="text-slate-300">{selectedEvent.timestamp}</span>
                      </div>
                      <div>
                        <span className="text-slate-500">OpCode: </span>
                        <span className="text-slate-300">Info (0)</span>
                      </div>
                    </div>

                    {/* Description */}
                    <div className="space-y-1">
                      <div className="text-xs font-bold text-slate-300">General Description:</div>
                      <div className="p-3 bg-slate-950 border border-slate-800 rounded text-xs text-slate-200 leading-relaxed font-mono whitespace-pre-wrap">
                        {selectedEvent.message}
                      </div>
                    </div>

                    {/* XML/Raw Details */}
                    {selectedEvent.details && (
                      <div className="space-y-1">
                        <div className="text-xs font-bold text-slate-300">Event Data Payload:</div>
                        <pre className="p-2.5 bg-slate-950 border border-slate-800 rounded font-mono text-[11px] text-emerald-400 overflow-x-auto">
                          {JSON.stringify(selectedEvent.details, null, 2)}
                        </pre>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="text-center py-12 text-slate-500 text-xs">
                    Select an event record to inspect detailed diagnostic properties.
                  </div>
                )}

                <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between text-[11px] text-slate-500">
                  <span>AegisNT Windows Event Subsystem (wevtsvc.dll)</span>
                  <span className="font-mono text-cyan-500">EVTX Compliant</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
