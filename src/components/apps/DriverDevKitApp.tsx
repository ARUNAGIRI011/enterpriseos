import React, { useState } from 'react';
import {
  Code,
  Play,
  Hammer,
  ShieldAlert,
  CheckCircle,
  FileCode,
  FolderOpen,
  Terminal,
  Cpu,
  Layers,
  Bug,
  RefreshCw,
  AlertOctagon,
  Download
} from 'lucide-react';
import { DRIVER_TEMPLATES, DriverSourceFile } from '../../services/driverTemplates';
import { KernelEngine } from '../../services/kernelEngine';

export default function DriverDevKitApp() {
  const engine = KernelEngine.getInstance();
  const [selectedTemplate, setSelectedTemplate] = useState<DriverSourceFile>(DRIVER_TEMPLATES[0]);
  const [code, setCode] = useState(DRIVER_TEMPLATES[0].sourceCode);
  const [buildLogs, setBuildLogs] = useState<string[]>([]);
  const [isBuilding, setIsBuilding] = useState(false);
  const [activeTab, setActiveTab] = useState<'editor' | 'loaded_drivers' | 'verifier' | 'bsod_analyzer'>('editor');
  const [verifierFlags, setVerifierFlags] = useState({
    specialPool: true,
    forceIrqlChecking: true,
    deadlockDetection: true,
    ioVerification: true,
    dmaVerification: true,
    poolTracking: true
  });
  const [simulatedBsod, setSimulatedBsod] = useState<null | {
    bugCheckCode: string;
    description: string;
    driverName: string;
    address: string;
    stackTrace: string[];
  }>(null);

  const [statusMsg, setStatusMsg] = useState<string | null>(null);

  const handleSelectTemplate = (tmpl: DriverSourceFile) => {
    setSelectedTemplate(tmpl);
    setCode(tmpl.sourceCode);
  };

  const handleCompileAndLoad = () => {
    setIsBuilding(true);
    setBuildLogs([
      `[WDK-CL] Invoking AegisNT C/C++ Driver Optimizing Compiler (v19.40.33811)...`,
      `[WDK-CL] Compiling: ${selectedTemplate.filename} -> ${selectedTemplate.filename.replace('.c', '.obj')}`,
      `[WDK-CL] Target Architecture: ${engine.arch} (Kernel Mode / Subsystem: NATIVE)`,
      `[WDK-LINK] Linking kernel executable: ${selectedTemplate.filename.replace('.c', '.sys')}`,
      `[WDK-SIGN] Signing driver with Enterprise WHQL Test Certificate (SHA-384)...`,
      `[HAL-LOAD] Allocating non-paged pool memory at 0xFFFFF800...`,
      `[IO-MGR] Dispatch table initialized (DriverEntry executed successfully).`,
      `[SUCCESS] Driver ${selectedTemplate.filename.replace('.c', '.sys')} loaded and attached to NT Object Namespace.`
    ]);

    setTimeout(() => {
      setIsBuilding(false);
      engine.loadCustomDriver(
        selectedTemplate.filename.replace('.c', '.sys'),
        selectedTemplate.category.includes('Storage') ? 'Hardware Bus' : 'Kernel',
        selectedTemplate.title
      );
    }, 900);
  };

  const triggerTestBugCheck = () => {
    setSimulatedBsod({
      bugCheckCode: '0x0000000A (IRQL_NOT_LESS_OR_EQUAL)',
      description: 'An attempt was made to access a pageable or invalid address at an interrupt request level (IRQL) that is too high.',
      driverName: selectedTemplate.filename.replace('.c', '.sys'),
      address: '0xFFFFF80004201A84',
      stackTrace: [
        'nt!KiPageFault+0x420',
        `${selectedTemplate.filename.replace('.c', '.sys')}+0x1A84 (NvmeDispatchDeviceControl)`,
        'nt!IofCallDriver+0x55',
        'nt!IopSynchronousServiceTail+0x1A0',
        'nt!NtDeviceIoControlFile+0x78'
      ]
    });
    setActiveTab('bsod_analyzer');
  };

  return (
    <div className="flex flex-col h-full bg-slate-950 text-slate-100 font-sans select-text">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-2.5 bg-slate-900 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div className="p-1.5 bg-indigo-600/20 text-indigo-400 rounded border border-indigo-500/30">
            <Hammer className="w-5 h-5" />
          </div>
          <div>
            <div className="font-semibold text-sm flex items-center gap-2">
              AegisNT Windows Driver Kit (WDK / DDK Enterprise)
              <span className="px-2 py-0.5 text-[10px] font-mono bg-indigo-950 border border-indigo-600/50 text-indigo-300 rounded-full font-bold">
                KMDF / WDM 3.2
              </span>
            </div>
            <div className="text-[11px] text-slate-400">
              Interactive C/C++ Driver IDE, IRP Dispatch Table Validator, Driver Verifier & Crash Dump Analyzer
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleCompileAndLoad}
            disabled={isBuilding}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white rounded text-xs font-semibold shadow-sm transition-all"
          >
            <Play className="w-3.5 h-3.5 fill-current" />
            {isBuilding ? 'Compiling & Loading...' : 'Build & Load .SYS'}
          </button>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex border-b border-slate-800 px-4 bg-slate-900/40 text-xs font-medium">
        {[
          { id: 'editor', label: 'C Driver IDE & Source', icon: Code },
          { id: 'loaded_drivers', label: 'Active Kernel Drivers', icon: Layers },
          { id: 'verifier', label: 'Driver Verifier Settings', icon: ShieldAlert },
          { id: 'bsod_analyzer', label: 'Kernel Crash Dump Analyzer', icon: Bug }
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 py-2 px-3 border-b-2 transition-all ${
                isActive
                  ? 'border-indigo-500 text-indigo-400 bg-slate-800/40'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Tab Contents */}
      <div className="flex-1 overflow-hidden flex flex-col">
        {/* TAB 1: CODE EDITOR */}
        {activeTab === 'editor' && (
          <div className="flex flex-1 overflow-hidden">
            {/* Template Selector Sidebar */}
            <div className="w-64 bg-slate-950 border-r border-slate-800 p-3 space-y-2 overflow-y-auto">
              <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-2">
                DDK Driver Samples
              </div>
              {DRIVER_TEMPLATES.map((tmpl) => (
                <div
                  key={tmpl.id}
                  onClick={() => handleSelectTemplate(tmpl)}
                  className={`p-2.5 rounded-lg border cursor-pointer transition-all ${
                    selectedTemplate.id === tmpl.id
                      ? 'border-indigo-500 bg-indigo-950/40 ring-1 ring-indigo-500'
                      : 'border-slate-800 bg-slate-900/50 hover:border-slate-700'
                  }`}
                >
                  <div className="text-xs font-semibold text-slate-200 font-mono truncate">{tmpl.filename}</div>
                  <div className="text-[11px] text-indigo-400 truncate mt-0.5">{tmpl.title}</div>
                  <div className="text-[10px] text-slate-500 mt-1">IRQL: {tmpl.irql}</div>
                </div>
              ))}

              <div className="pt-4 border-t border-slate-800/80">
                <button
                  onClick={triggerTestBugCheck}
                  className="w-full flex items-center justify-center gap-1.5 px-3 py-1.5 bg-rose-950/40 border border-rose-700/50 text-rose-300 hover:bg-rose-900/50 rounded text-xs"
                >
                  <AlertOctagon className="w-3.5 h-3.5" />
                  Simulate Driver Fault (BSOD)
                </button>
              </div>
            </div>

            {/* Editor + Build Terminal */}
            <div className="flex-1 flex flex-col overflow-hidden bg-slate-950">
              <div className="flex items-center justify-between px-3 py-1.5 bg-slate-900 border-b border-slate-800 text-xs">
                <span className="font-mono text-slate-300">{selectedTemplate.filename}</span>
                <span className="text-slate-500 font-mono text-[11px]">KMDF / x86_64 & aarch64 Compatible</span>
              </div>

              <textarea
                value={code}
                onChange={(e) => setCode(e.target.value)}
                className="flex-1 bg-slate-950 text-slate-200 font-mono text-xs p-4 leading-relaxed resize-none focus:outline-none border-b border-slate-800 select-text"
                spellCheck={false}
              />

              {/* Build Output Terminal */}
              <div className="h-36 bg-slate-950 p-2.5 overflow-y-auto font-mono text-[11px] border-t border-slate-800 space-y-1">
                <div className="text-slate-500 flex items-center gap-1 mb-1">
                  <Terminal className="w-3.5 h-3.5" /> Build Console Output:
                </div>
                {buildLogs.length === 0 ? (
                  <div className="text-slate-600">Click &quot;Build &amp; Load .SYS&quot; to compile and register this driver into the NT executive...</div>
                ) : (
                  buildLogs.map((log, idx) => (
                    <div
                      key={idx}
                      className={log.includes('[SUCCESS]') ? 'text-emerald-400 font-bold' : 'text-slate-300'}
                    >
                      {log}
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: ACTIVE KERNEL DRIVERS */}
        {activeTab === 'loaded_drivers' && (
          <div className="flex-1 p-4 overflow-y-auto space-y-3">
            {statusMsg && (
              <div className="p-2.5 rounded-lg bg-emerald-950/80 border border-emerald-700 text-emerald-300 text-xs flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-400" />
                <span>{statusMsg}</span>
              </div>
            )}
            <div className="text-xs text-slate-400">
              Active Kernel Drivers currently resident in Non-Paged System Pool:
            </div>
            <div className="bg-slate-900 border border-slate-800 rounded-lg overflow-hidden">
              <table className="w-full text-xs text-left">
                <thead className="bg-slate-950 text-slate-400 border-b border-slate-800 font-mono">
                  <tr>
                    <th className="p-2.5">Driver Name</th>
                    <th className="p-2.5">Type</th>
                    <th className="p-2.5">Base Address</th>
                    <th className="p-2.5">Size</th>
                    <th className="p-2.5">IRQL</th>
                    <th className="p-2.5">WHQL Certified</th>
                    <th className="p-2.5">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800 font-mono">
                  {engine.drivers.map((drv) => (
                    <tr key={drv.id} className="hover:bg-slate-800/40">
                      <td className="p-2.5 text-indigo-300 font-bold">{drv.name}</td>
                      <td className="p-2.5 text-slate-300">{drv.type}</td>
                      <td className="p-2.5 text-slate-400">{drv.baseAddress}</td>
                      <td className="p-2.5 text-slate-400">{drv.sizeKb} KB</td>
                      <td className="p-2.5 text-slate-400">{drv.irql}</td>
                      <td className="p-2.5">
                        <span className="text-emerald-400 flex items-center gap-1 text-[11px]">
                          <CheckCircle className="w-3.5 h-3.5" /> Certified
                        </span>
                      </td>
                      <td className="p-2.5">
                        <button
                          onClick={() => {
                            engine.unloadDriver(drv.id);
                            setStatusMsg(`Unloaded driver ${drv.name} from kernel pool.`);
                            setTimeout(() => setStatusMsg(null), 4000);
                          }}
                          className="px-2 py-0.5 bg-rose-950 border border-rose-700 text-rose-300 hover:bg-rose-900 rounded text-[11px]"
                        >
                          Unload
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 3: DRIVER VERIFIER */}
        {activeTab === 'verifier' && (
          <div className="flex-1 p-6 overflow-y-auto max-w-3xl mx-auto space-y-4">
            <div className="p-4 bg-slate-900 border border-slate-800 rounded-lg">
              <h3 className="font-bold text-sm text-indigo-300 mb-1">AegisNT Driver Verifier Manager</h3>
              <p className="text-xs text-slate-400">
                Enforces strict runtime sanity checks on third-party and hardware drivers to catch memory corruption and IRQL violations before deployment.
              </p>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-lg p-4 space-y-3">
              {[
                { key: 'specialPool', title: 'Special Pool Allocation', desc: 'Allocates driver pool requests on dedicated pages with guard pages to catch overruns instantly.' },
                { key: 'forceIrqlChecking', title: 'Force IRQL Checking', desc: 'Invalidates pageable code/data when driver raises IRQL to DISPATCH_LEVEL or above.' },
                { key: 'deadlockDetection', title: 'Deadlock Detection', desc: 'Constructs lock dependency graphs for spinlocks, fast mutexes, and ERESOURCEs.' },
                { key: 'ioVerification', title: 'I/O Verification & IRP Tracking', desc: 'Intercepts IoCompleteRequest and ensures IRPs are not double-freed.' },
                { key: 'dmaVerification', title: 'DMA Verification (IOMMU Guard)', desc: 'Validates scatter/gather lists and checks for buffer overruns during DMA transfers.' },
                { key: 'poolTracking', title: 'Pool Tracking & Leak Prevention', desc: 'Tracks every ExAllocatePoolWithTag call to verify no memory leaks on driver unload.' }
              ].map((opt) => (
                <div key={opt.key} className="flex items-center justify-between p-2.5 bg-slate-950 rounded border border-slate-800">
                  <div>
                    <div className="font-semibold text-xs text-slate-200">{opt.title}</div>
                    <div className="text-[11px] text-slate-400 mt-0.5">{opt.desc}</div>
                  </div>
                  <input
                    type="checkbox"
                    checked={(verifierFlags as any)[opt.key]}
                    onChange={(e) => setVerifierFlags({ ...verifierFlags, [opt.key]: e.target.checked })}
                    className="w-4 h-4 accent-indigo-600 rounded cursor-pointer"
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 4: BSOD & CRASH ANALYZER */}
        {activeTab === 'bsod_analyzer' && (
          <div className="flex-1 p-6 overflow-y-auto max-w-3xl mx-auto space-y-4">
            {simulatedBsod ? (
              <div className="bg-slate-900 border border-rose-800/60 rounded-lg p-5 space-y-4">
                <div className="flex items-center gap-3 text-rose-400">
                  <AlertOctagon className="w-6 h-6" />
                  <div>
                    <div className="font-bold text-sm">KERNEL BUGCHECK DETECTED: {simulatedBsod.bugCheckCode}</div>
                    <div className="text-xs text-slate-400">Crash dump generated at \SystemRoot\MEMORY.DMP</div>
                  </div>
                </div>

                <div className="p-3 bg-slate-950 rounded border border-slate-800 font-mono text-xs space-y-2 text-slate-300">
                  <div><strong>Faulting Module:</strong> {simulatedBsod.driverName}</div>
                  <div><strong>Exception Address:</strong> {simulatedBsod.address}</div>
                  <div><strong>Description:</strong> {simulatedBsod.description}</div>
                </div>

                <div>
                  <div className="text-xs font-semibold text-slate-300 mb-2 font-mono">Kernel Call Stack (k):</div>
                  <div className="p-3 bg-slate-950 rounded border border-slate-800 font-mono text-xs space-y-1 text-cyan-300">
                    {simulatedBsod.stackTrace.map((frame, i) => (
                      <div key={i}>#0{i} {frame}</div>
                    ))}
                  </div>
                </div>

                <div className="flex justify-end gap-2">
                  <button
                    onClick={() => setSimulatedBsod(null)}
                    className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded text-xs"
                  >
                    Dismiss Crash
                  </button>
                </div>
              </div>
            ) : (
              <div className="text-center py-12 text-slate-500 text-xs">
                No kernel panics or crash dumps recorded. Kernel is operating normally.
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
