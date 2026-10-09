import React, { useState, useEffect, useRef } from 'react';
import {
  Terminal as TerminalIcon,
  Shield,
  Wifi,
  Key,
  Server,
  Play,
  RotateCcw,
  CheckCircle2,
  Sliders,
  Send,
  Globe,
  Radio
} from 'lucide-react';
import { KernelEngine } from '../../services/kernelEngine';
import { KernelHardeningConfig } from '../../types/os';

export default function EnterpriseTerminalApp() {
  const engine = KernelEngine.getInstance();
  const [activeTab, setActiveTab] = useState<'powershell' | 'winrm' | 'ssh' | 'nettools' | 'hardening'>('powershell');

  // PowerShell state
  const [psInput, setPsInput] = useState('');
  const [psHistory, setPsHistory] = useState<Array<{ cmd: string; out: string; time: string }>>([
    {
      cmd: 'systeminfo',
      out: `OS Name:                   AegisNT Enterprise Edition (x86_64 / ARM64 Hybrid)
OS Version:                10.0.26100 NTS-Secured Build 26100
OS Manufacturer:           AegisNT Enterprise Corporation
Kernel Type:               Low-Latency Tickless Microkernel (ntoskrnl.exe)
Hypervisor:                QEMU / KVM Hardware-Assisted Virtualization
System Boot Time:          10/07/2026, 07:12:00 AM
Total Physical Memory:     32,768 MB
Virtualization Security:   VBS & HVCI Active
BitLocker Volume (C:):     AES-XTS-256 (TPM 2.0 Sealed)`,
      time: '07:12:05'
    },
    {
      cmd: 'driverquery /v',
      out: `Module Name  Display Name           Driver Type   Link Date              State
===========  ====================== ============= ====================== =======
aegis_nvme   PCIe 5.0 NVMe Host     Kernel        10/01/2026 14:02:11    Running
usb4_router  USB4 / TB4 Tunneling   Kernel        10/02/2026 11:34:00    Running
vfio_pci     VFIO GPU Passthrough   Kernel        10/04/2026 09:20:18    Running
virtio_hal   QEMU/KVM VirtIO DMA    Kernel        10/05/2026 16:45:22    Running
fve_crypto   BitLocker FVE Filter   File System   10/06/2026 08:12:44    Running`,
      time: '07:12:30'
    }
  ]);

  // WinRM state
  const [winrmTarget, setWinrmTarget] = useState('srv-dc01.corp.internal');
  const [winrmCommand, setWinrmCommand] = useState('Get-HotFix -Description "Security Update"');
  const [winrmLogs, setWinrmLogs] = useState<string[]>([
    'WinRM service (WS-Management protocol) is running on port 5985 (HTTP) and 5986 (HTTPS).',
    'Kerberos / SPNEGO authentication enabled for domain CORP.INTERNAL.',
    'MaxConcurrentOperations: 1500, MaxMemoryPerShellMB: 2048'
  ]);

  // OpenSSH state
  const [sshTarget, setSshTarget] = useState('admin@edge-compute-02.internal');
  const [sshLogs, setSshLogs] = useState<string[]>([
    'OpenSSH_9.8p1 Enterprise, OpenSSL 3.3.2 ready.',
    'Server listening on 0.0.0.0 port 22 [ECDSA / ED25519].',
    'Host key: ssh-ed25519 AAAAC3NzaC1lZDI1NTE5AAAAIOrX79zJmQ972981Hk...',
    'AuthorizedKeys: /Users/Administrator/.ssh/authorized_keys verified.'
  ]);

  // Net Tools state
  const [netCommand, setNetCommand] = useState('ping');
  const [netTarget, setNetTarget] = useState('192.168.122.1');
  const [netLogs, setNetLogs] = useState<string[]>([
    'Pinging 192.168.122.1 (KVM Host Bridge) with 32 bytes of data:',
    'Reply from 192.168.122.1: bytes=32 time<0.1ms TTL=64',
    'Reply from 192.168.122.1: bytes=32 time<0.1ms TTL=64',
    'Reply from 192.168.122.1: bytes=32 time<0.1ms TTL=64',
    'Ping statistics for 192.168.122.1: Packets: Sent = 3, Received = 3, Lost = 0 (0% loss)'
  ]);

  // Kernel Hardening state
  const [hardening, setHardening] = useState<KernelHardeningConfig>(engine.hardening);

  const psBottomRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    psBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [psHistory]);

  const handlePsSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!psInput.trim()) return;

    const trimmed = psInput.trim();
    let out = '';

    if (trimmed === 'cls' || trimmed === 'clear') {
      setPsHistory([]);
      setPsInput('');
      return;
    } else if (trimmed === 'Get-Process' || trimmed === 'ps') {
      out = `Handles  NPM(K)    PM(K)      WS(K)     CPU(s)     Id ProcessName
-------  ------    -----      -----     ------     -- -----------
    420      12    18200      32400       0.12    388 smss
   1250      44    42100      89400       0.41    512 csrss
   3200      88    64200     112000       0.35    740 services
   4890     210  4096000    4200000      18.40   1420 qemu-system-x86_64
   3400      92   312000     450000       1.15   2204 soffice.bin`;
    } else if (trimmed === 'Get-Service') {
      out = `Status   Name               DisplayName
------   ----               -----------
Running  aegis_hal          AegisNT Hardware Abstraction Service
Running  WinRM              Windows Remote Management (WS-Management)
Running  sshd               OpenSSH SSH Server
Running  fve_volmgr         BitLocker Volume Encryption Manager
Running  virtio_vhost       VirtIO High-Throughput Packet Daemon`;
    } else if (trimmed === 'Get-Disk') {
      out = `Number Friendly Name               Serial Number                    HealthStatus         OperationalStatus      Total Size Partition Style
------ -------------               -------------                    ------------         -----------------      ---------- ---------------
0      Enterprise NVMe 2.0 Gen5    EG50-2026-9941                   Healthy              Online                  512.00 GB GPT (Encrypted)
1      Enterprise NVMe Data Pool   EG50-2026-9942                   Healthy              Online                 2048.00 GB GPT (Encrypted)`;
    } else if (trimmed.toLowerCase().startsWith('java')) {
      if (trimmed.toLowerCase() === 'java -version' || trimmed.toLowerCase() === 'java -v') {
        out = `openjdk version "21.0.5" 2026-10-15 LTS
OpenJDK Runtime Environment Temurin-21.0.5+11 (build 21.0.5+11-LTS)
OpenJDK 64-Bit Server VM Temurin-21.0.5+11 (build 21.0.5+11-LTS, mixed mode, sharing)
Subsystem: AegisNT POSIX/Win32 Hybrid HAL Bridge (Sub-1ms ZGC Pauses Active)`;
      } else if (trimmed.toLowerCase().includes('-jar')) {
        const jarName = trimmed.split(' ')[2] || 'app.jar';
        out = `[AegisNT JVM Subsystem] Loading JAR archive: ${jarName}
[HotSpot JIT] Verified 1,420 bytecode classes in 38ms
[ZGC Engine] Heap committed: 2048 MB | Virtual Threads (Loom): ACTIVE
[${jarName}] Application main() method executing. Service online @ port 8080.`;
      } else {
        out = `Usage: java [options] <mainclass> [args...]
           java [options] -jar <jarfile> [args...]
Available Runtimes: OpenJDK 21 LTS (Temurin-21.0.5+11) configured at C:\\Program Files\\Eclipse Adoptium\\jdk-21.0.5-hotspot`;
      }
    } else if (trimmed.toLowerCase().startsWith('javac')) {
      out = `[AegisNT Java Compiler] Compiling source tree with target release 21...
[Javac] Bytecode generated successfully. Class files written to ./target/classes/
[Javac] 0 errors, 0 warnings (Optimized with invokedynamic and vector intrinsics)`;
    } else if (trimmed.toLowerCase().startsWith('dotnet')) {
      if (trimmed.toLowerCase() === 'dotnet --version') {
        out = `9.0.100`;
      } else if (trimmed.toLowerCase().includes('--info')) {
        out = `.NET SDK 9.0.100 on AegisNT Enterprise (X64)
CoreCLR: 9.0.24.52809 with RyuJIT AVX-512 Dynamic PGO
Host Framework: Microsoft.NETCore.App 9.0.0
Desktop Framework: Microsoft.WindowsDesktop.App 9.0.0 (WPF & WinForms Active)
Runtime Architecture: x64 Hardware Accelerated`;
      } else if (trimmed.toLowerCase().startsWith('dotnet run')) {
        out = `Building project...
Determining projects to restore...
All projects are up-to-date for restore.
CoreCompile: Output path: bin/Release/net9.0/publish/App.dll
info: Microsoft.Hosting.Lifetime[14] Now listening on: http://localhost:5000
info: Microsoft.Hosting.Lifetime[0] Application started in 184ms.`;
      } else {
        out = `Usage: dotnet [runtime-options] [path-to-application] [arguments]
       dotnet [sdk-options] [command] [command-options] [arguments]
SDK Version: 9.0.100 | CoreCLR: 9.0.24.52809 (Dynamic PGO Active)`;
      }
    } else if (trimmed.toLowerCase().startsWith('wine') || trimmed.toLowerCase().startsWith('start') || trimmed.toLowerCase().endsWith('.exe')) {
      out = `[AegisNT WOW64 Subsystem] Loading Windows PE32+ image: ${trimmed}
[PE Loader] Relocating image base, binding IAT imports (kernel32.dll, user32.dll, gdi32.dll, ole32.dll)
[Wine 9.x Staging] NT Executive syscall thunk initialized (Latency: 4.2 microseconds)
[win32k.sys] HWND window allocated. Windows message pump active.`;
    } else if (trimmed.toLowerCase().startsWith('msiexec')) {
      out = `[Windows Installer 5.0] msiexec transaction engine invoked
[msiexec] Validated package signature with Microsoft Authenticode & Aegis CA
[msiexec] Product install state: INSTALLED_DEFAULT
[msiexec] Installation completed successfully without requiring a system reboot.`;
    } else if (trimmed === 'help') {
      out = `Supported enterprise commands:
  - java -version / java -jar  : OpenJDK 21 LTS JVM execution engine
  - javac                      : Java 21 Bytecode Compiler
  - dotnet --info / dotnet run : .NET 9 CoreCLR & Framework runner
  - wine [app.exe]             : Windows PE32/PE32+ WOW64 Binary Launcher
  - msiexec /i [file.msi]      : Transactional Windows Installer service
  - Get-Process / ps           : List active kernel executive processes
  - Get-Service                : List active enterprise background services
  - Get-Disk                   : Inspect physical NVMe and VirtIO drives
  - driverquery /v             : Query loaded hardware drivers
  - systeminfo                 : Display full AegisNT kernel architecture telemetry
  - cls / clear                : Clear console buffer`;
    } else {
      out = `[AegisNT Command Subsystem] Command "${trimmed}" executed successfully.`;
    }

    setPsHistory([
      ...psHistory,
      { cmd: trimmed, out, time: new Date().toLocaleTimeString() }
    ]);
    setPsInput('');
  };

  const handleWinrmInvoke = () => {
    setWinrmLogs(prev => [
      ...prev,
      `[${new Date().toLocaleTimeString()}] Invoking WS-Management remote session on ${winrmTarget}...`,
      `[${new Date().toLocaleTimeString()}] Executing: ${winrmCommand}`,
      `[${new Date().toLocaleTimeString()}] Result from ${winrmTarget}: HotFix KB5034129 (Enterprise Security Rollup) Installed: YES`
    ]);
  };

  const handleSshConnect = () => {
    setSshLogs(prev => [
      ...prev,
      `[${new Date().toLocaleTimeString()}] Initiating SSH connection to ${sshTarget} on port 22...`,
      `[${new Date().toLocaleTimeString()}] Authenticated with key id_ed25519 (SHA256:d8940f8...)`,
      `[${new Date().toLocaleTimeString()}] Remote shell spawned: AegisNT Enterprise Shell ready.`
    ]);
  };

  const handleNetRun = () => {
    setNetLogs(prev => [
      ...prev,
      `[${new Date().toLocaleTimeString()}] Executing ${netCommand} ${netTarget}:`,
      `Packets: Sent = 4, Received = 4, Round-trip min/avg/max = 0.08ms / 0.12ms / 0.16ms`
    ]);
  };

  const handleToggleHardening = (key: keyof KernelHardeningConfig) => {
    const updated = { ...hardening, [key]: !hardening[key] };
    setHardening(updated);
    engine.hardening = updated;
  };

  return (
    <div className="flex flex-col h-full bg-slate-950 text-slate-100 font-sans select-text">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-2.5 bg-slate-900 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div className="p-1.5 bg-blue-600/20 text-blue-400 rounded border border-blue-500/30">
            <TerminalIcon className="w-5 h-5" />
          </div>
          <div>
            <div className="font-semibold text-sm flex items-center gap-2">
              AegisNT Enterprise Administrative Terminal Suite
              <span className="px-2 py-0.5 text-[10px] font-mono bg-blue-950 border border-blue-600/50 text-blue-300 rounded-full font-bold">
                POWERSHELL / WINRM / SSH
              </span>
            </div>
            <div className="text-[11px] text-slate-400">
              Remote administration, WS-Management, OpenSSH server, and Zero-Trust kernel hardening
            </div>
          </div>
        </div>

        {/* Global Security state */}
        <div className="flex items-center gap-2 text-xs font-mono">
          <span className="flex items-center gap-1.5 px-2.5 py-1 bg-emerald-950 border border-emerald-600/50 text-emerald-300 rounded">
            <Shield className="w-3.5 h-3.5" />
            HVCI & VBS: SECURED
          </span>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-800 px-4 bg-slate-900/40 text-xs font-medium">
        {[
          { id: 'powershell', label: 'PowerShell 7.5 / CMD', icon: TerminalIcon },
          { id: 'winrm', label: 'WinRM Remote Management', icon: Server },
          { id: 'ssh', label: 'OpenSSH Enterprise Console', icon: Key },
          { id: 'nettools', label: 'Network Diagnostic Suite', icon: Globe },
          { id: 'hardening', label: 'Custom Kernel Hardening', icon: Sliders }
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

      {/* Tab Contents */}
      <div className="flex-1 overflow-hidden flex flex-col">
        {/* TAB 1: POWERSHELL / CMD */}
        {activeTab === 'powershell' && (
          <div className="flex-1 flex flex-col bg-slate-950 font-mono text-xs overflow-hidden">
            <div className="flex-1 p-4 overflow-y-auto space-y-3">
              <div className="text-slate-400 mb-2">
                AegisNT PowerShell 7.5.0-enterprise [CoreCLR 9.0.0] (x86_64 / ARM64 Unified)<br />
                Type &apos;help&apos; for available commands.
              </div>

              {psHistory.map((item, idx) => (
                <div key={idx} className="space-y-1">
                  <div className="flex items-center gap-2 text-cyan-400 font-bold">
                    <span>PS C:\Windows\System32&gt;</span>
                    <span className="text-white">{item.cmd}</span>
                    <span className="text-slate-600 text-[10px] ml-auto font-sans">{item.time}</span>
                  </div>
                  <pre className="text-slate-300 leading-relaxed overflow-x-auto whitespace-pre-wrap pl-2 border-l border-slate-800">
                    {item.out}
                  </pre>
                </div>
              ))}
              <div ref={psBottomRef} />
            </div>

            {/* Command Prompt Input */}
            <form onSubmit={handlePsSubmit} className="flex items-center gap-2 p-2.5 bg-slate-900 border-t border-slate-800">
              <span className="text-cyan-400 font-bold">PS C:\Windows\System32&gt;</span>
              <input
                type="text"
                value={psInput}
                onChange={(e) => setPsInput(e.target.value)}
                placeholder="Enter command (e.g. Get-Process, driverquery /v, Get-Disk)..."
                className="flex-1 bg-transparent text-slate-100 focus:outline-none text-xs font-mono"
                autoFocus
              />
              <button type="submit" className="px-3 py-1 bg-blue-600 hover:bg-blue-500 text-white rounded text-xs font-sans font-medium">
                Execute
              </button>
            </form>
          </div>
        )}

        {/* TAB 2: WINRM */}
        {activeTab === 'winrm' && (
          <div className="flex-1 p-5 overflow-y-auto max-w-4xl mx-auto space-y-4">
            <div className="p-4 bg-slate-900 border border-slate-800 rounded-lg">
              <h3 className="font-bold text-sm text-cyan-300 mb-1">Windows Remote Management (WinRM / WS-Management)</h3>
              <p className="text-xs text-slate-400">
                Execute remote PowerShell sessions, CIM cmdlets, and remote system diagnostics over secured TLS/SPNEGO.
              </p>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-lg p-4 space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-slate-400 font-semibold mb-1 block">Remote Computer FQDN:</label>
                  <input
                    type="text"
                    value={winrmTarget}
                    onChange={(e) => setWinrmTarget(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-1.5 text-xs text-slate-200 font-mono focus:outline-none focus:border-cyan-500"
                  />
                </div>
                <div>
                  <label className="text-xs text-slate-400 font-semibold mb-1 block">Command / ScriptBlock:</label>
                  <input
                    type="text"
                    value={winrmCommand}
                    onChange={(e) => setWinrmCommand(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-1.5 text-xs text-slate-200 font-mono focus:outline-none focus:border-cyan-500"
                  />
                </div>
              </div>

              <div className="flex justify-end">
                <button
                  onClick={handleWinrmInvoke}
                  className="flex items-center gap-1.5 px-4 py-1.5 bg-cyan-600 hover:bg-cyan-500 text-white rounded text-xs font-semibold"
                >
                  <Send className="w-3.5 h-3.5" /> Invoke Remote Session
                </button>
              </div>
            </div>

            {/* WinRM Console Log */}
            <div className="bg-slate-950 border border-slate-800 rounded-lg p-3 font-mono text-xs space-y-1 text-slate-300">
              <div className="text-slate-500 mb-2 font-bold">WS-Management Protocol Log:</div>
              {winrmLogs.map((l, i) => (
                <div key={i}>{l}</div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 3: OPENSSH */}
        {activeTab === 'ssh' && (
          <div className="flex-1 p-5 overflow-y-auto max-w-4xl mx-auto space-y-4">
            <div className="p-4 bg-slate-900 border border-slate-800 rounded-lg">
              <h3 className="font-bold text-sm text-indigo-300 mb-1">OpenSSH Enterprise Remote Administration</h3>
              <p className="text-xs text-slate-400">
                Encrypted terminal communication using ED25519 & ECDSA host keys with hardware TPM key shielding.
              </p>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-lg p-4 space-y-3">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={sshTarget}
                  onChange={(e) => setSshTarget(e.target.value)}
                  placeholder="user@hostname"
                  className="flex-1 bg-slate-950 border border-slate-800 rounded px-3 py-1.5 text-xs text-slate-200 font-mono focus:outline-none focus:border-indigo-500"
                />
                <button
                  onClick={handleSshConnect}
                  className="px-4 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded text-xs font-semibold"
                >
                  Connect SSH (Port 22)
                </button>
              </div>
            </div>

            <div className="bg-slate-950 border border-slate-800 rounded-lg p-3 font-mono text-xs space-y-1 text-slate-300">
              <div className="text-slate-500 mb-2 font-bold">OpenSSH Client & Daemon Session:</div>
              {sshLogs.map((l, i) => (
                <div key={i}>{l}</div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 4: NETWORK DIAGNOSTICS */}
        {activeTab === 'nettools' && (
          <div className="flex-1 p-5 overflow-y-auto max-w-4xl mx-auto space-y-4">
            <div className="p-4 bg-slate-900 border border-slate-800 rounded-lg">
              <h3 className="font-bold text-sm text-emerald-300 mb-1">Enterprise Network Diagnostics Suite</h3>
              <p className="text-xs text-slate-400">
                Low-latency TCP/IP stack utilities with hardware checksum offloading on VirtIO-Net and 2.5GbE.
              </p>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-lg p-4 flex gap-2">
              <select
                value={netCommand}
                onChange={(e) => setNetCommand(e.target.value)}
                className="bg-slate-950 border border-slate-800 text-xs text-slate-200 rounded px-3 py-1.5 font-mono"
              >
                <option value="ping">ping</option>
                <option value="tracert">tracert</option>
                <option value="netstat -ano">netstat -ano</option>
                <option value="nslookup">nslookup</option>
              </select>

              <input
                type="text"
                value={netTarget}
                onChange={(e) => setNetTarget(e.target.value)}
                className="flex-1 bg-slate-950 border border-slate-800 rounded px-3 py-1.5 text-xs text-slate-200 font-mono focus:outline-none focus:border-emerald-500"
              />

              <button
                onClick={handleNetRun}
                className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded text-xs font-semibold"
              >
                Run Tool
              </button>
            </div>

            <div className="bg-slate-950 border border-slate-800 rounded-lg p-3 font-mono text-xs space-y-1 text-slate-300">
              {netLogs.map((l, i) => (
                <div key={i}>{l}</div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 5: KERNEL HARDENING CONFIG */}
        {activeTab === 'hardening' && (
          <div className="flex-1 p-5 overflow-y-auto max-w-4xl mx-auto space-y-4">
            <div className="p-4 bg-slate-900 border border-slate-800 rounded-lg">
              <h3 className="font-bold text-sm text-amber-300 mb-1">AegisNT Kernel Hardening & Exploit Mitigation</h3>
              <p className="text-xs text-slate-400">
                Hardware and hypervisor-enforced protections to safeguard enterprise endpoints against zero-day exploits.
              </p>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-lg divide-y divide-slate-800">
              {[
                {
                  key: 'hvci',
                  title: 'Hypervisor-Protected Code Integrity (HVCI)',
                  desc: 'Uses hardware virtualization (SLAT/EPT) to ensure kernel mode code pages cannot be made writable.'
                },
                {
                  key: 'smep',
                  title: 'Supervisor Mode Execution Prevention (SMEP)',
                  desc: 'CPU blocks Ring 0 kernel execution of code located in user-space pages.'
                },
                {
                  key: 'smap',
                  title: 'Supervisor Mode Access Prevention (SMAP)',
                  desc: 'CPU prevents Ring 0 from accessing user memory pages without explicit authorization flags.'
                },
                {
                  key: 'kaslr',
                  title: 'Kernel Address Space Layout Randomization (KASLR)',
                  desc: 'Randomizes module and driver base addresses upon every boot cycle.'
                },
                {
                  key: 'cfg',
                  title: 'Control Flow Guard (CFG / eXG)',
                  desc: 'Inserts compiler checks before indirect call instructions to prevent ROP / JOP attacks.'
                },
                {
                  key: 'driverSignatureEnforcement',
                  title: 'Driver Signature Enforcement (DSE)',
                  desc: 'Requires Microsoft WHQL or Enterprise EV code-signing for any loaded .sys driver.'
                },
                {
                  key: 'wXMemoryProtection',
                  title: 'Write-XOR-Execute (W^X) Memory Policy',
                  desc: 'Pages can be writable or executable, but never both simultaneously.'
                },
                {
                  key: 'vbsMode',
                  title: 'Virtualization-Based Security (VBS)',
                  desc: 'Isolates critical security authorities (lsass.exe, credential vault) into Virtual Trust Level 1 (VTL 1).'
                }
              ].map((opt) => (
                <div key={opt.key} className="p-3.5 flex items-center justify-between">
                  <div className="pr-4">
                    <div className="font-semibold text-xs text-slate-200">{opt.title}</div>
                    <div className="text-[11px] text-slate-400 mt-0.5">{opt.desc}</div>
                  </div>
                  <button
                    onClick={() => handleToggleHardening(opt.key as keyof KernelHardeningConfig)}
                    className={`px-3 py-1 rounded text-xs font-semibold font-mono border transition-all ${
                      (hardening as any)[opt.key]
                        ? 'bg-emerald-950 border-emerald-600 text-emerald-300'
                        : 'bg-slate-800 border-slate-700 text-slate-400'
                    }`}
                  >
                    {(hardening as any)[opt.key] ? 'ENFORCED' : 'DISABLED'}
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
