import React, { useState } from 'react';
import {
  Server,
  Terminal,
  Cpu,
  Monitor,
  HardDrive,
  Copy,
  Check,
  CheckCircle2,
  AlertTriangle,
  Play,
  HelpCircle,
  ExternalLink,
  Layers,
  Zap,
  Laptop,
  ShieldCheck,
  FolderOpen,
  BookOpen
} from 'lucide-react';

export default function VmBootGuideApp({ onLaunchApp }: { onLaunchApp?: (appId: string) => void }) {
  const [activeHypervisor, setActiveHypervisor] = useState<'qemu' | 'virtualbox' | 'vmware' | 'proxmox' | 'utm' | 'hyperv'>('qemu');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  // QEMU Customizer
  const [qemuRam, setQemuRam] = useState(8192);
  const [qemuCores, setQemuCores] = useState(4);
  const [qemuGpuAcc, setQemuGpuAcc] = useState(true);
  const [qemuSshForward, setQemuSshForward] = useState(true);

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2500);
  };

  const getQemuCommand = () => {
    const gpuFlag = qemuGpuAcc
      ? '  -device virtio-vga,virgl=on \\\n  -display default,show-cursor=on'
      : '  -vga std \\\n  -display default,show-cursor=on';

    const netFlags = qemuSshForward
      ? '  -netdev user,id=net0,hostfwd=tcp::2222-:22,hostfwd=tcp::3389-:3389 \\\n  -device virtio-net-pci,netdev=net0'
      : '  -netdev user,id=net0 \\\n  -device virtio-net-pci,netdev=net0';

    return `qemu-system-x86_64 \\
  -enable-kvm \\
  -m ${qemuRam} -smp ${qemuCores},sockets=1,cores=${qemuCores},threads=1 \\
  -cpu host,hv_relaxed,hv_spinlocks=0x1fff,hv_vapic,hv_time \\
  -drive file=aegisnt-enterprise.qcow2,if=virtio,format=qcow2,cache=none,aio=native \\
${netFlags} \\
${gpuFlag}`;
  };

  return (
    <div className="flex flex-col h-full bg-slate-950 text-slate-100 font-sans select-text">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-2.5 bg-slate-900 border-b border-slate-800">
        <div className="flex items-center gap-2.5">
          <div className="p-1.5 rounded-lg bg-indigo-600/20 border border-indigo-500/30 text-indigo-400">
            <Server className="w-4 h-4" />
          </div>
          <div>
            <div className="text-xs font-bold text-slate-100 flex items-center gap-2">
              AegisNT Virtual Machine Boot & Installation Guidance
              <span className="px-1.5 py-0.2 rounded text-[10px] font-mono bg-indigo-950 text-indigo-300 border border-indigo-800">
                vmboot.exe
              </span>
            </div>
            <div className="text-[10px] text-slate-400">
              Interactive setup checklists, launch parameters, and configuration guides for all major hypervisors
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {onLaunchApp && (
            <button
              onClick={() => onLaunchApp('dev_docs')}
              className="px-2.5 py-1 bg-blue-950 hover:bg-blue-900 border border-blue-700/60 text-blue-300 text-[11px] font-semibold rounded flex items-center gap-1.5 transition-colors"
            >
              <BookOpen className="w-3.5 h-3.5 text-blue-400" />
              Architecture & Docs
            </button>
          )}
          <span className="px-2.5 py-1 bg-emerald-950 border border-emerald-700/60 text-emerald-300 text-[11px] font-mono rounded flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            VIRTIO READY (x86_64 & ARM64)
          </span>
        </div>
      </div>

      {/* Hypervisor Selector Bar */}
      <div className="flex border-b border-slate-800 bg-slate-900/60 px-3 text-xs font-medium overflow-x-auto">
        {[
          { id: 'qemu', label: 'QEMU / KVM (Linux & WSL2)', icon: Terminal },
          { id: 'virtualbox', label: 'Oracle VirtualBox', icon: Layers },
          { id: 'vmware', label: 'VMware Workstation & ESXi', icon: Server },
          { id: 'proxmox', label: 'Proxmox VE (PVE)', icon: Zap },
          { id: 'utm', label: 'UTM (macOS Apple Silicon)', icon: Laptop },
          { id: 'hyperv', label: 'Microsoft Hyper-V', icon: Monitor }
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeHypervisor === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveHypervisor(tab.id as any)}
              className={`flex items-center gap-1.5 py-2.5 px-3.5 border-b-2 transition-all whitespace-nowrap ${
                isActive
                  ? 'border-indigo-500 text-indigo-400 bg-slate-800/50 font-semibold'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Main Content Area */}
      <div className="flex-1 overflow-y-auto p-5 space-y-6 max-w-5xl mx-auto">
        {/* HYPERVISOR 1: QEMU / KVM */}
        {activeHypervisor === 'qemu' && (
          <div className="space-y-4">
            <div className="p-4 bg-slate-900 border border-slate-800 rounded-xl space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
                    <Terminal className="w-4 h-4 text-cyan-400" />
                    Booting on QEMU / KVM with Hardware Virtualization
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Recommended for maximum performance: near bare-metal execution speed with zero hypervisor context switch penalty.
                  </p>
                </div>
                <button
                  onClick={() => handleCopy(getQemuCommand(), 'qemu_interactive')}
                  className="flex items-center gap-1 px-3 py-1.5 bg-cyan-600 hover:bg-cyan-500 text-white rounded text-xs font-semibold"
                >
                  {copiedKey === 'qemu_interactive' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  {copiedKey === 'qemu_interactive' ? 'Copied QEMU CLI' : 'Copy QEMU Command'}
                </button>
              </div>

              {/* Interactive VM Configurator */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 p-3 bg-slate-950 border border-slate-800 rounded-lg text-xs font-mono">
                <div>
                  <label className="text-slate-400 block text-[10px]">RAM (MB):</label>
                  <select
                    value={qemuRam}
                    onChange={(e) => setQemuRam(Number(e.target.value))}
                    className="w-full mt-1 bg-slate-900 border border-slate-700 rounded px-2 py-1 text-slate-200"
                  >
                    <option value={4096}>4,096 MB (4 GB)</option>
                    <option value={8192}>8,192 MB (8 GB)</option>
                    <option value={16384}>16,384 MB (16 GB)</option>
                    <option value={32768}>32,768 MB (32 GB)</option>
                  </select>
                </div>
                <div>
                  <label className="text-slate-400 block text-[10px]">vCPUs:</label>
                  <select
                    value={qemuCores}
                    onChange={(e) => setQemuCores(Number(e.target.value))}
                    className="w-full mt-1 bg-slate-900 border border-slate-700 rounded px-2 py-1 text-slate-200"
                  >
                    <option value={2}>2 Cores</option>
                    <option value={4}>4 Cores (Recommended)</option>
                    <option value={8}>8 Cores</option>
                    <option value={16}>16 Cores</option>
                  </select>
                </div>
                <div className="flex items-center gap-2 pt-4">
                  <input
                    type="checkbox"
                    id="gpuCheck"
                    checked={qemuGpuAcc}
                    onChange={(e) => setQemuGpuAcc(e.target.checked)}
                    className="rounded bg-slate-900 border-slate-700 text-cyan-500"
                  />
                  <label htmlFor="gpuCheck" className="text-slate-300 text-[11px] cursor-pointer">
                    VirtIO 3D GPU (virgl)
                  </label>
                </div>
                <div className="flex items-center gap-2 pt-4">
                  <input
                    type="checkbox"
                    id="sshCheck"
                    checked={qemuSshForward}
                    onChange={(e) => setQemuSshForward(e.target.checked)}
                    className="rounded bg-slate-900 border-slate-700 text-cyan-500"
                  />
                  <label htmlFor="sshCheck" className="text-slate-300 text-[11px] cursor-pointer">
                    Port Fwd (2222, 3389)
                  </label>
                </div>
              </div>

              {/* Code display */}
              <pre className="p-3 bg-slate-950 border border-slate-800 rounded-lg font-mono text-xs text-cyan-300 overflow-x-auto leading-relaxed">
                {getQemuCommand()}
              </pre>
            </div>

            {/* QEMU Parameter Breakdown */}
            <div className="p-4 bg-slate-900 border border-slate-800 rounded-xl space-y-2">
              <h4 className="text-xs font-bold text-slate-200">Why These QEMU Flags Are Essential for AegisNT:</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs font-mono">
                <div className="p-2.5 bg-slate-950 border border-slate-800 rounded">
                  <span className="text-cyan-400 font-bold">-enable-kvm:</span>
                  <p className="text-slate-400 text-[11px] mt-0.5">Enables kernel-based hardware virtualization extensions (Intel VT-x / AMD-V).</p>
                </div>
                <div className="p-2.5 bg-slate-950 border border-slate-800 rounded">
                  <span className="text-cyan-400 font-bold">hv_relaxed, hv_spinlocks, hv_vapic:</span>
                  <p className="text-slate-400 text-[11px] mt-0.5">Enables Hyper-V enlightenments for NT kernel, reducing VM exits during spinlocks.</p>
                </div>
                <div className="p-2.5 bg-slate-950 border border-slate-800 rounded">
                  <span className="text-cyan-400 font-bold">if=virtio, aio=native:</span>
                  <p className="text-slate-400 text-[11px] mt-0.5">Direct asynchronous kernel I/O with zero block emulation overhead.</p>
                </div>
                <div className="p-2.5 bg-slate-950 border border-slate-800 rounded">
                  <span className="text-cyan-400 font-bold">virtio-vga, virgl=on:</span>
                  <p className="text-slate-400 text-[11px] mt-0.5">Passes OpenGL and Vulkan acceleration from host GPU into AegisNT guest.</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* HYPERVISOR 2: VIRTUALBOX */}
        {activeHypervisor === 'virtualbox' && (
          <div className="space-y-4">
            <div className="p-4 bg-slate-900 border border-slate-800 rounded-xl space-y-3">
              <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
                <Layers className="w-4 h-4 text-amber-400" />
                Booting on Oracle VirtualBox (Windows, macOS, Linux)
              </h3>
              <p className="text-xs text-slate-400">
                Follow these precise step-by-step settings to ensure proper UEFI GPT boot and hardware acceleration.
              </p>

              <div className="space-y-3 pt-2">
                {[
                  {
                    step: 'Step 1: Machine Creation',
                    detail: 'Click "New" -> Name: "AegisNT Enterprise" -> Type: "Microsoft Windows" -> Version: "Windows 11 (64-bit)".'
                  },
                  {
                    step: 'Step 2: Base Memory & EFI Firmware',
                    detail: 'Allocate at least 4096 MB – 8192 MB RAM and 4 vCPUs. CRITICAL: Check the box "Enable EFI (special OSes only)". AegisNT requires UEFI GPT boot.'
                  },
                  {
                    step: 'Step 3: Storage Controller Configuration',
                    detail: 'Under Storage -> Controller: SATA or NVMe Controller -> Add Optical Drive -> Choose "aegisnt-enterprise.iso" (or attach .vdi/.vmdk). Enable "Use Host I/O Cache".'
                  },
                  {
                    step: 'Step 4: Display & 3D Graphics Acceleration',
                    detail: 'Under Display -> Video Memory: Set to 128 MB or 256 MB -> Graphics Controller: "VBoxSVGA" -> Check "Enable 3D Acceleration".'
                  },
                  {
                    step: 'Step 5: Network Adapter',
                    detail: 'Under Network -> Adapter 1: Attached to "Bridged Adapter" (or NAT with Port Forwarding for SSH port 22 and RDP 3389).'
                  }
                ].map((item, idx) => (
                  <div key={idx} className="p-3 bg-slate-950 border border-slate-800 rounded-lg flex items-start gap-3">
                    <span className="flex items-center justify-center w-6 h-6 rounded-full bg-amber-600/30 text-amber-400 font-bold text-xs border border-amber-500/30 shrink-0">
                      {idx + 1}
                    </span>
                    <div>
                      <div className="text-xs font-bold text-slate-200">{item.step}</div>
                      <div className="text-xs text-slate-400 mt-0.5 leading-relaxed">{item.detail}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* HYPERVISOR 3: VMWARE */}
        {activeHypervisor === 'vmware' && (
          <div className="space-y-4">
            <div className="p-4 bg-slate-900 border border-slate-800 rounded-xl space-y-3">
              <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
                <Server className="w-4 h-4 text-blue-400" />
                Booting on VMware Workstation / Fusion / ESXi
              </h3>
              <p className="text-xs text-slate-400">
                VMware configuration for enterprise virtualization, Virtual TPM 2.0, and DirectX 12 hardware acceleration.
              </p>

              <div className="space-y-3 pt-2">
                <div className="p-3 bg-slate-950 border border-slate-800 rounded-lg space-y-1.5">
                  <div className="text-xs font-bold text-blue-300">1. Virtual Machine Wizard</div>
                  <p className="text-xs text-slate-400">
                    Create a New Virtual Machine → Custom (advanced) → Select Hardware Compatibility 17.x / 18.x → Guest OS: <strong>Windows 11 x64</strong>.
                  </p>
                </div>

                <div className="p-3 bg-slate-950 border border-slate-800 rounded-lg space-y-1.5">
                  <div className="text-xs font-bold text-blue-300">2. Firmware & TPM 2.0 Encryption</div>
                  <p className="text-xs text-slate-400">
                    Firmware Type: <strong>UEFI</strong> with <strong>Secure Boot enabled</strong>. Under VM Settings → Options → Access Control → Encrypt VM → Add <strong>Trusted Platform Module (TPM 2.0)</strong> for BitLocker sealing.
                  </p>
                </div>

                <div className="p-3 bg-slate-950 border border-slate-800 rounded-lg space-y-1.5">
                  <div className="text-xs font-bold text-blue-300">3. NVMe Disk Controller & Display</div>
                  <p className="text-xs text-slate-400">
                    I/O Controller Types: Select <strong>NVMe</strong> disk controller (native <code className="text-emerald-400">aegis_nvme.sys</code> driver will bind automatically). Under Display: Check <strong>Accelerate 3D graphics</strong>.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* HYPERVISOR 4: PROXMOX VE */}
        {activeHypervisor === 'proxmox' && (
          <div className="space-y-4">
            <div className="p-4 bg-slate-900 border border-slate-800 rounded-xl space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
                    <Zap className="w-4 h-4 text-emerald-400" />
                    Deploying on Proxmox VE (PVE Cluster Node)
                  </h3>
                  <p className="text-xs text-slate-400">
                    Run via Proxmox Web GUI or paste this automated CLI provision script directly into the PVE shell.
                  </p>
                </div>
                <button
                  onClick={() => handleCopy(`qm create 150 \\
  --name aegisnt-enterprise \\
  --memory 8192 \\
  --cores 4 \\
  --cpu host \\
  --ostype win11 \\
  --bios ovmf \\
  --efidisk0 local-lvm:1,efitype=4m,pre-enrolled-keys=1 \\
  --tpmstate0 local-lvm:1,version=v2.0 \\
  --scsihw virtio-scsi-single \\
  --scsi0 local-lvm:64,discard=on,ssd=1,iothread=1 \\
  --net0 virtio,bridge=vmbr0,firewall=1 \\
  --vga virtio \\
  --cdrom local:iso/aegisnt-enterprise.iso
qm start 150`, 'pve_cmd')}
                  className="flex items-center gap-1 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded text-xs font-semibold"
                >
                  {copiedKey === 'pve_cmd' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  {copiedKey === 'pve_cmd' ? 'Copied Proxmox CLI' : 'Copy Proxmox Script'}
                </button>
              </div>

              <pre className="p-3 bg-slate-950 border border-slate-800 rounded-lg font-mono text-xs text-emerald-300 overflow-x-auto leading-relaxed">
{`qm create 150 \\
  --name aegisnt-enterprise \\
  --memory 8192 \\
  --cores 4 \\
  --cpu host \\
  --ostype win11 \\
  --bios ovmf \\
  --efidisk0 local-lvm:1,efitype=4m,pre-enrolled-keys=1 \\
  --tpmstate0 local-lvm:1,version=v2.0 \\
  --scsihw virtio-scsi-single \\
  --scsi0 local-lvm:64,discard=on,ssd=1,iothread=1 \\
  --net0 virtio,bridge=vmbr0,firewall=1 \\
  --vga virtio \\
  --cdrom local:iso/aegisnt-enterprise.iso
qm start 150`}
              </pre>
            </div>
          </div>
        )}

        {/* HYPERVISOR 5: UTM / APPLE SILICON */}
        {activeHypervisor === 'utm' && (
          <div className="space-y-4">
            <div className="p-4 bg-slate-900 border border-slate-800 rounded-xl space-y-3">
              <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
                <Laptop className="w-4 h-4 text-purple-400" />
                Booting on UTM (Apple Silicon Mac M1 / M2 / M3 / M4)
              </h3>
              <p className="text-xs text-slate-400">
                AegisNT features dual-architecture kernel support for native ARM64 and x86_64 emulation on Apple hardware.
              </p>

              <div className="space-y-2 pt-2 text-xs">
                <div className="p-3 bg-slate-950 border border-slate-800 rounded-lg space-y-1">
                  <div className="font-bold text-purple-300">Option 1: Native Virtualize Mode (Fastest)</div>
                  <p className="text-slate-400 leading-relaxed">
                    Select <strong>Virtualize</strong> → Operating System: <strong>Windows (ARM64)</strong> → Use Apple Virtualization backend with Rosetta disabled → Set RAM to 8 GB. AegisNT will switch to ARM64 tickless microkernel mode.
                  </p>
                </div>
                <div className="p-3 bg-slate-950 border border-slate-800 rounded-lg space-y-1">
                  <div className="font-bold text-purple-300">Option 2: Emulate Mode (x86_64)</div>
                  <p className="text-slate-400 leading-relaxed">
                    Select <strong>Emulate</strong> → System: <strong>x86_64</strong> → CPU: <strong>qemu64</strong> with VirtIO GPU driver enabled.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* HYPERVISOR 6: HYPER-V */}
        {activeHypervisor === 'hyperv' && (
          <div className="space-y-4">
            <div className="p-4 bg-slate-900 border border-slate-800 rounded-xl space-y-3">
              <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
                <Monitor className="w-4 h-4 text-cyan-400" />
                Booting on Microsoft Hyper-V (Windows 11 / Windows Server)
              </h3>
              <p className="text-xs text-slate-400">
                Use Hyper-V Generation 2 VM for native UEFI firmware, vTPM, and synthetic SCSI controllers.
              </p>

              <div className="space-y-2 pt-2 text-xs">
                <div className="p-3 bg-slate-950 border border-slate-800 rounded-lg space-y-1">
                  <div className="font-bold text-cyan-300">1. Specify Generation 2</div>
                  <p className="text-slate-400 leading-relaxed">
                    When creating the new virtual machine, select <strong>Generation 2</strong> (UEFI-based firmware). Do NOT select Generation 1 (Legacy BIOS).
                  </p>
                </div>
                <div className="p-3 bg-slate-950 border border-slate-800 rounded-lg space-y-1">
                  <div className="font-bold text-cyan-300">2. Security Settings</div>
                  <p className="text-slate-400 leading-relaxed">
                    Under VM Settings → Security: Check <strong>Enable Secure Boot</strong> (Template: Microsoft Windows) and check <strong>Enable Trusted Platform Module</strong>.
                  </p>
                </div>
                <div className="p-3 bg-slate-950 border border-slate-800 rounded-lg space-y-1">
                  <div className="font-bold text-cyan-300">3. Memory & Processor</div>
                  <p className="text-slate-400 leading-relaxed">
                    Allocate 8192 MB RAM. Disable Dynamic Memory to maintain zero-copy VirtIO memory buffers. Assign 4 virtual processors.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Troubleshooting Common VM Boot Issues */}
        <div className="p-4 bg-slate-900 border border-slate-800 rounded-xl space-y-3">
          <div className="flex items-center gap-2 text-xs font-bold text-amber-300">
            <AlertTriangle className="w-4 h-4 text-amber-400" />
            Troubleshooting Common VM Boot Issues
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
            <div className="p-3 bg-slate-950 border border-slate-800 rounded-lg space-y-1">
              <div className="font-bold text-slate-200">Issue: "No bootable device found" or BIOS error</div>
              <p className="text-slate-400 text-[11px] leading-relaxed">
                <strong>Solution:</strong> Ensure EFI / UEFI boot is enabled in VM settings. Legacy CSM / MBR is deprecated in AegisNT.
              </p>
            </div>
            <div className="p-3 bg-slate-950 border border-slate-800 rounded-lg space-y-1">
              <div className="font-bold text-slate-200">Issue: Black screen on boot with 3D acceleration</div>
              <p className="text-slate-400 text-[11px] leading-relaxed">
                <strong>Solution:</strong> Update host GPU drivers or temporarily switch graphics controller from <code className="text-amber-300">virgl</code> to standard <code className="text-amber-300">VBoxSVGA / VMware SVGA</code>.
              </p>
            </div>
            <div className="p-3 bg-slate-950 border border-slate-800 rounded-lg space-y-1">
              <div className="font-bold text-slate-200">Issue: Disk driver not detected during setup</div>
              <p className="text-slate-400 text-[11px] leading-relaxed">
                <strong>Solution:</strong> Set storage controller to <strong>VirtIO SCSI</strong> or <strong>NVMe</strong>. The kernel includes baked-in <code className="text-cyan-300">virtio_hal_kvm.sys</code> and <code className="text-cyan-300">aegis_nvme.sys</code>.
              </p>
            </div>
            <div className="p-3 bg-slate-950 border border-slate-800 rounded-lg space-y-1">
              <div className="font-bold text-slate-200">Issue: Network connectivity in guest VM</div>
              <p className="text-slate-400 text-[11px] leading-relaxed">
                <strong>Solution:</strong> Use VirtIO network adapter with DHCP enabled. In QEMU, verify <code className="text-cyan-300">-netdev user</code> host port forward configuration.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
