import React, { useState, useEffect } from 'react';
import {
  Activity,
  Cpu,
  HardDrive,
  Monitor,
  Zap,
  Trash2,
  RefreshCw,
  Search,
  CheckCircle2
} from 'lucide-react';
import { KernelEngine } from '../../services/kernelEngine';
import { KernelProcess } from '../../types/os';

export default function TaskManagerApp({ onLaunchApp }: { onLaunchApp?: (appId: string) => void }) {
  const engine = KernelEngine.getInstance();
  const [activeTab, setActiveTab] = useState<'processes' | 'performance' | 'services'>('processes');
  const [processes, setProcesses] = useState<KernelProcess[]>(engine.processes);
  const [selectedPid, setSelectedPid] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [stats, setStats] = useState(engine.getStats());

  useEffect(() => {
    const timer = setInterval(() => {
      setStats(engine.getStats());
      setProcesses([...engine.processes]);
    }, 1500);
    return () => clearInterval(timer);
  }, []);

  const handleEndTask = () => {
    if (selectedPid) {
      engine.killProcess(selectedPid);
      setProcesses(engine.processes.filter(p => p.pid !== selectedPid));
      setSelectedPid(null);
    }
  };

  const filtered = processes.filter(p =>
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.user.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.pid.toString().includes(searchQuery)
  );

  return (
    <div className="flex flex-col h-full bg-slate-950 text-slate-100 font-sans select-text">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-2 bg-slate-900 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <Activity className="w-4 h-4 text-emerald-400" />
          <span className="font-semibold text-xs">AegisNT Task Manager Enterprise</span>
        </div>
        <div className="flex items-center gap-2">
          {onLaunchApp && (
            <button
              onClick={() => onLaunchApp('resource_monitor')}
              className="flex items-center gap-1.5 px-2.5 py-1 bg-cyan-950 border border-cyan-800 text-cyan-300 hover:bg-cyan-900 rounded text-xs"
            >
              <Activity className="w-3.5 h-3.5" /> Open Resource Monitor
            </button>
          )}
          <button
            onClick={handleEndTask}
            disabled={!selectedPid}
            className="flex items-center gap-1 px-3 py-1 bg-rose-950 border border-rose-800 disabled:opacity-40 text-rose-300 hover:bg-rose-900 rounded text-xs"
          >
            <Trash2 className="w-3.5 h-3.5" /> End Task
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-800 px-4 bg-slate-900/40 text-xs font-medium">
        {[
          { id: 'processes', label: `Processes (${processes.length})` },
          { id: 'performance', label: 'Performance Telemetry' },
          { id: 'services', label: `Services (${engine.drivers.length + 5})` }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`py-2 px-3 border-b-2 transition-all ${
              activeTab === tab.id
                ? 'border-blue-500 text-blue-400 bg-slate-800/40'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="flex-1 overflow-hidden flex flex-col">
        {activeTab === 'processes' && (
          <div className="flex-1 overflow-hidden flex flex-col">
            <div className="p-2 border-b border-slate-800 bg-slate-950">
              <input
                type="text"
                placeholder="Search processes..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-900 border border-slate-800 rounded px-2.5 py-1 text-xs text-slate-200 focus:outline-none"
              />
            </div>

            <div className="flex-1 overflow-y-auto">
              <table className="w-full text-xs text-left">
                <thead className="bg-slate-900 text-slate-400 sticky top-0 border-b border-slate-800 font-mono">
                  <tr>
                    <th className="p-2">Name</th>
                    <th className="p-2">PID</th>
                    <th className="p-2">Status</th>
                    <th className="p-2">CPU %</th>
                    <th className="p-2">Memory (MB)</th>
                    <th className="p-2">Subsystem</th>
                    <th className="p-2">User</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 font-mono">
                  {filtered.map((proc) => {
                    const isSelected = selectedPid === proc.pid;
                    return (
                      <tr
                        key={proc.pid}
                        onClick={() => setSelectedPid(proc.pid)}
                        className={`cursor-pointer transition-colors ${
                          isSelected ? 'bg-blue-950/60 text-blue-200' : 'hover:bg-slate-900/40'
                        }`}
                      >
                        <td className="p-2 font-bold text-slate-200">{proc.name}</td>
                        <td className="p-2 text-slate-400">{proc.pid}</td>
                        <td className="p-2 text-emerald-400">{proc.status}</td>
                        <td className="p-2 text-cyan-400">{proc.cpuPercent}%</td>
                        <td className="p-2 text-amber-400">{proc.memoryMb} MB</td>
                        <td className="p-2 text-indigo-400">{proc.subsystem}</td>
                        <td className="p-2 text-slate-400">{proc.user}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'performance' && (
          <div className="flex-1 p-5 overflow-y-auto space-y-4 max-w-4xl mx-auto">
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-slate-900 border border-slate-800 rounded-lg">
                <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
                  <span className="flex items-center gap-1.5 font-bold text-blue-400">
                    <Cpu className="w-4 h-4" /> CPU Utilization ({stats.arch})
                  </span>
                  <span className="font-mono text-white text-sm">{stats.cpuUsage}%</span>
                </div>
                <div className="text-[11px] text-slate-500 font-mono mb-3">
                  Cores: 16 Physical / 32 Logical | Base Clock: 3.80 GHz
                </div>
                <div className="h-16 bg-slate-950 rounded border border-slate-800 flex items-end p-1 gap-1">
                  {[20, 35, 25, 40, 30, 22, 18, 28, 33, 29, 21, 26, 30, 35, stats.cpuUsage].map((v, i) => (
                    <div
                      key={i}
                      style={{ height: `${v}%` }}
                      className="flex-1 bg-blue-500 rounded-t-sm"
                    />
                  ))}
                </div>
              </div>

              <div className="p-4 bg-slate-900 border border-slate-800 rounded-lg">
                <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
                  <span className="flex items-center gap-1.5 font-bold text-purple-400">
                    <Zap className="w-4 h-4" /> Physical Memory (DDR5-6000)
                  </span>
                  <span className="font-mono text-white text-sm">
                    {(stats.memoryUsedMb / 1024).toFixed(1)} / {(stats.memoryTotalMb / 1024).toFixed(0)} GB
                  </span>
                </div>
                <div className="text-[11px] text-slate-500 font-mono mb-3">
                  Paged: {stats.pagedPoolMb} MB | Non-Paged: {stats.nonPagedPoolMb} MB
                </div>
                <div className="h-16 bg-slate-950 rounded border border-slate-800 flex items-end p-1 gap-1">
                  {[22, 23, 23, 24, 24, 24, 25, 25, 25, 26, 26, 26, 26, 26, 26].map((v, i) => (
                    <div
                      key={i}
                      style={{ height: `${v}%` }}
                      className="flex-1 bg-purple-500 rounded-t-sm"
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'services' && (
          <div className="flex-1 overflow-y-auto p-4 space-y-2">
            <div className="text-xs text-slate-400 mb-2">Installed Enterprise System Drivers and Daemons:</div>
            <div className="bg-slate-900 border border-slate-800 rounded-lg overflow-hidden">
              <table className="w-full text-xs text-left">
                <thead className="bg-slate-950 text-slate-400 font-mono">
                  <tr>
                    <th className="p-2">Name</th>
                    <th className="p-2">Description</th>
                    <th className="p-2">Status</th>
                    <th className="p-2">Type</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800 font-mono">
                  {engine.drivers.map((drv) => (
                    <tr key={drv.id} className="hover:bg-slate-800/40">
                      <td className="p-2 text-indigo-300 font-bold">{drv.name}</td>
                      <td className="p-2 text-slate-300 font-sans">{drv.description}</td>
                      <td className="p-2 text-emerald-400">Running</td>
                      <td className="p-2 text-slate-400">{drv.type}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
