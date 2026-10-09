import React, { useState } from 'react';
import {
  BookOpen,
  Play,
  Terminal,
  Activity,
  Layers,
  CheckCircle,
  Copy,
  Search,
  Zap,
  Code2,
  Trash2,
  Cpu
} from 'lucide-react';
import { WIN32_API_CATALOG, Win32ApiFunction, Win32Engine } from '../../services/win32Engine';
import { KernelEngine } from '../../services/kernelEngine';

export default function Win32ApiApp() {
  const engine = Win32Engine.getInstance();
  const kernel = KernelEngine.getInstance();
  const [selectedApi, setSelectedApi] = useState<Win32ApiFunction>(WIN32_API_CATALOG[0]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterDll, setFilterDll] = useState('ALL');
  const [logs, setLogs] = useState(engine.logs);
  const [activeTab, setActiveTab] = useState<'catalog' | 'tracer' | 'pe_runner'>('catalog');
  const [copiedCode, setCopiedCode] = useState(false);

  // PE Runner state
  const [runningApp, setRunningApp] = useState<string | null>(null);

  const filteredApis = WIN32_API_CATALOG.filter(api => {
    const matchesSearch = api.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          api.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesDll = filterDll === 'ALL' || api.dll.toLowerCase() === filterDll.toLowerCase();
    return matchesSearch && matchesDll;
  });

  const handleExecuteApiTest = (api: Win32ApiFunction) => {
    const resultVal = api.returnType.includes('BOOL') ? 'TRUE (0x1)' :
                      api.returnType.includes('NTSTATUS') ? 'STATUS_SUCCESS (0x00000000)' :
                      '0x00007FF68A000000';
    engine.traceCall(
      api.dll,
      api.name,
      api.parameters.map(p => `${p.name}=DEFAULT`).join(', '),
      resultVal
    );
    setLogs([...engine.logs]);
    setActiveTab('tracer');
  };

  const handleLaunchPeApp = (appName: string, file: string) => {
    setRunningApp(appName);
    kernel.spawnProcess(file, 'Wine', 128);

    // Generate some simulated API trace calls
    engine.traceCall('ntdll.dll', 'NtCreateUserProcess', `ImagePath: "${file}"`, 'STATUS_SUCCESS (0x0)');
    engine.traceCall('kernel32.dll', 'VirtualAlloc', 'Size: 2097152, Protect: PAGE_EXECUTE_READ', '0x00007FF7B0000000');
    engine.traceCall('user32.dll', 'CreateWindowExW', `Title: "${appName}"`, 'HWND: 0x0004018A');
    engine.traceCall('gdi32.dll', 'BitBlt', 'Compositor Flip Buffer', 'TRUE (0x1)');
    setLogs([...engine.logs]);

    setTimeout(() => {
      setRunningApp(null);
    }, 4000);
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(selectedApi.exampleCpp);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  return (
    <div className="flex flex-col h-full bg-slate-950 text-slate-100 font-sans select-text">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-2.5 bg-slate-900 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div className="p-1.5 bg-emerald-600/20 text-emerald-400 rounded border border-emerald-500/30">
            <BookOpen className="w-5 h-5" />
          </div>
          <div>
            <div className="font-semibold text-sm flex items-center gap-2">
              Win32 & Native NT API Guidance & Wine 9.x Subsystem
              <span className="px-2 py-0.5 text-[10px] font-mono bg-emerald-950 border border-emerald-600/50 text-emerald-300 rounded-full font-bold">
                WOW64 / PE EMULATOR
              </span>
            </div>
            <div className="text-[11px] text-slate-400">
              Interactive Windows API reference, live system call tracing, and PE application execution
            </div>
          </div>
        </div>

        {/* Status */}
        <div className="flex items-center gap-2 text-xs font-mono text-emerald-400">
          <span className="flex items-center gap-1.5 px-2 py-0.5 bg-emerald-950 border border-emerald-800 rounded">
            <CheckCircle className="w-3.5 h-3.5" />
            Wine Binary Translation: ACTIVE
          </span>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-800 px-4 bg-slate-900/40 text-xs font-medium">
        {[
          { id: 'catalog', label: 'Win32 & NT API Catalog', icon: Code2 },
          { id: 'tracer', label: 'Live System Call Tracer', icon: Activity, count: `${logs.length} calls` },
          { id: 'pe_runner', label: 'Windows PE Application Runner', icon: Play }
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 py-2 px-3 border-b-2 transition-all ${
                isActive
                  ? 'border-emerald-500 text-emerald-400 bg-slate-800/40'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
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

      {/* Main Tab Content */}
      <div className="flex-1 overflow-hidden flex flex-col">
        {/* TAB 1: API CATALOG */}
        {activeTab === 'catalog' && (
          <div className="flex flex-1 overflow-hidden">
            {/* API List Sidebar */}
            <div className="w-72 bg-slate-950 border-r border-slate-800 p-3 flex flex-col gap-2">
              <div className="relative">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
                <input
                  type="text"
                  placeholder="Filter APIs (e.g. CreateProcess)..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded pl-8 pr-2 py-1.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                />
              </div>

              {/* DLL Filter Buttons */}
              <div className="flex flex-wrap gap-1 text-[10px] font-mono">
                {['ALL', 'kernel32.dll', 'user32.dll', 'advapi32.dll', 'ntdll.dll'].map(dll => (
                  <button
                    key={dll}
                    onClick={() => setFilterDll(dll)}
                    className={`px-1.5 py-0.5 rounded ${
                      filterDll === dll ? 'bg-emerald-600 text-white' : 'bg-slate-900 text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    {dll}
                  </button>
                ))}
              </div>

              <div className="flex-1 overflow-y-auto space-y-1.5 pt-1">
                {filteredApis.map(api => (
                  <div
                    key={`${api.dll}-${api.name}`}
                    onClick={() => setSelectedApi(api)}
                    className={`p-2 rounded border cursor-pointer transition-all ${
                      selectedApi.name === api.name
                        ? 'border-emerald-500 bg-emerald-950/40 ring-1 ring-emerald-500'
                        : 'border-slate-800 bg-slate-900/40 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-xs font-semibold text-emerald-400">{api.name}</span>
                      <span className="text-[10px] text-slate-500 font-mono">{api.dll}</span>
                    </div>
                    <div className="text-[10px] text-slate-400 mt-0.5 truncate">{api.category}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* API Details Panel */}
            <div className="flex-1 p-5 overflow-y-auto bg-slate-950 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-lg font-bold text-slate-100 font-mono">{selectedApi.name}</h2>
                    <span className="px-2 py-0.5 text-xs bg-slate-800 text-emerald-300 rounded font-mono border border-slate-700">
                      {selectedApi.dll}
                    </span>
                    <span className="px-2 py-0.5 text-xs bg-emerald-950 text-emerald-400 rounded font-mono border border-emerald-800">
                      {selectedApi.wineStatus}
                    </span>
                  </div>
                  <div className="text-xs text-slate-400 mt-1">{selectedApi.category}</div>
                </div>

                <button
                  onClick={() => handleExecuteApiTest(selectedApi)}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded text-xs font-semibold"
                >
                  <Play className="w-3.5 h-3.5 fill-current" />
                  Test Call in Kernel
                </button>
              </div>

              {/* Function Signature */}
              <div className="p-3 bg-slate-900 border border-slate-800 rounded-lg">
                <div className="text-xs font-semibold text-slate-400 mb-1">C/C++ Syntax Signature:</div>
                <div className="font-mono text-xs text-cyan-300 break-all bg-slate-950 p-2.5 rounded border border-slate-800">
                  {selectedApi.signature}
                </div>
              </div>

              {/* Description */}
              <div className="text-xs text-slate-300 leading-relaxed bg-slate-900/60 p-3 rounded border border-slate-800">
                {selectedApi.description}
              </div>

              {/* Parameters Table */}
              <div className="space-y-1.5">
                <div className="text-xs font-semibold text-slate-300">Parameters:</div>
                <div className="border border-slate-800 rounded overflow-hidden">
                  <table className="w-full text-xs text-left">
                    <thead className="bg-slate-900 text-slate-400 font-mono">
                      <tr>
                        <th className="p-2">Name</th>
                        <th className="p-2">Type</th>
                        <th className="p-2">Description</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800 font-mono">
                      {selectedApi.parameters.map((p, idx) => (
                        <tr key={idx} className="bg-slate-950 hover:bg-slate-900/30">
                          <td className="p-2 text-emerald-400 font-semibold">{p.name}</td>
                          <td className="p-2 text-cyan-400">{p.type}</td>
                          <td className="p-2 text-slate-300 font-sans">{p.desc}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Return Value */}
              <div className="text-xs">
                <span className="font-semibold text-slate-300">Return Value: </span>
                <span className="font-mono text-amber-300">{selectedApi.returnType}</span>
              </div>

              {/* Example C++ Snippet */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-slate-300">Enterprise C++ Implementation:</span>
                  <button
                    onClick={handleCopyCode}
                    className="flex items-center gap-1 text-slate-400 hover:text-slate-200"
                  >
                    <Copy className="w-3.5 h-3.5" />
                    {copiedCode ? 'Copied!' : 'Copy Code'}
                  </button>
                </div>
                <pre className="p-3 bg-slate-950 border border-slate-800 rounded font-mono text-xs text-slate-200 overflow-x-auto leading-relaxed">
                  {selectedApi.exampleCpp}
                </pre>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: SYSTEM CALL TRACER */}
        {activeTab === 'tracer' && (
          <div className="flex-1 p-4 overflow-hidden flex flex-col bg-slate-950">
            <div className="flex items-center justify-between mb-3">
              <div className="text-xs text-slate-400">
                Live stream of Win32, Wine and Native NT system calls captured by kernel hook:
              </div>
              <button
                onClick={() => {
                  engine.clearLogs();
                  setLogs([]);
                }}
                className="flex items-center gap-1 px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded text-xs"
              >
                <Trash2 className="w-3.5 h-3.5" /> Clear Trace
              </button>
            </div>

            <div className="flex-1 bg-slate-900 border border-slate-800 rounded-lg overflow-hidden flex flex-col">
              <div className="grid grid-cols-12 gap-2 p-2.5 bg-slate-950 border-b border-slate-800 text-[11px] font-mono text-slate-400 font-bold">
                <div className="col-span-1">Time</div>
                <div className="col-span-1">TID</div>
                <div className="col-span-2">Module / DLL</div>
                <div className="col-span-2">Function</div>
                <div className="col-span-4">Parameters</div>
                <div className="col-span-1">Result</div>
                <div className="col-span-1 text-right">Latency</div>
              </div>

              <div className="flex-1 overflow-y-auto divide-y divide-slate-800 text-xs font-mono">
                {logs.map((log) => (
                  <div key={log.id} className="grid grid-cols-12 gap-2 p-2 hover:bg-slate-800/40 text-[11px] items-center">
                    <div className="col-span-1 text-slate-500">{log.timestamp}</div>
                    <div className="col-span-1 text-slate-400">{log.threadId}</div>
                    <div className="col-span-2 text-indigo-400">{log.dll}</div>
                    <div className="col-span-2 text-emerald-400 font-bold">{log.functionName}</div>
                    <div className="col-span-4 text-slate-300 truncate" title={log.params}>{log.params}</div>
                    <div className="col-span-1 text-amber-300 truncate">{log.result}</div>
                    <div className="col-span-1 text-right text-cyan-400">{log.durationMs} ms</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: PE RUNNER */}
        {activeTab === 'pe_runner' && (
          <div className="flex-1 p-6 overflow-y-auto max-w-3xl mx-auto space-y-4">
            <div className="p-4 bg-slate-900 border border-slate-800 rounded-lg">
              <h3 className="font-bold text-sm text-emerald-300 mb-1">AegisNT Windows PE Subsystem Launcher</h3>
              <p className="text-xs text-slate-400">
                Execute any Windows 32-bit (PE32) or 64-bit (PE32+) executable binary directly via Wine 9.x WOW64 translation with zero latency.
              </p>
            </div>

            <div className="space-y-3">
              {[
                { name: 'Enterprise Financial Calculator', file: 'calc_enterprise.exe', desc: 'Native Win32 desktop tool using User32 and Gdi32 render' },
                { name: 'Hardware Telemetry Monitor', file: 'sysinfo_gui.exe', desc: 'Direct DeviceIoControl querying PCIe NVMe & USB 4.0 buses' },
                { name: 'BitLocker Volume Key Vault', file: 'fve_keygen.exe', desc: 'Advapi32 cryptographic key generator linked with TPM 2.0' },
                { name: 'DirectX 12 / Vulkan Micro-Benchmark', file: 'dx12_stress_bench.exe', desc: 'High-throughput hardware rendering test for host and KVM guest' }
              ].map((app) => (
                <div key={app.file} className="p-3.5 bg-slate-900 border border-slate-800 rounded-lg flex items-center justify-between">
                  <div>
                    <div className="font-semibold text-xs text-slate-200">{app.name}</div>
                    <div className="text-[11px] text-slate-400 mt-0.5">{app.desc}</div>
                    <div className="text-[10px] font-mono text-emerald-400 mt-1">C:\Program Files\Win32Apps\{app.file}</div>
                  </div>
                  <button
                    onClick={() => handleLaunchPeApp(app.name, app.file)}
                    disabled={runningApp === app.name}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white rounded text-xs font-semibold"
                  >
                    <Play className="w-3.5 h-3.5 fill-current" />
                    {runningApp === app.name ? 'Running...' : 'Run EXE'}
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
