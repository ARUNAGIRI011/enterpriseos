import {
  Architecture,
  KernelStats,
  KernelProcess,
  KernelDriver,
  NVMeControllerState,
  USB4ControllerState,
  GPUPassthroughState,
  VirtualMachine,
  DiskPartition,
  KernelHardeningConfig
} from '../types/os';

export class KernelEngine {
  private static instance: KernelEngine;

  public arch: Architecture = 'x86_64';
  public uptime: number = 4120; // seconds

  public hardening: KernelHardeningConfig = {
    hvci: true,
    smep: true,
    smap: true,
    kaslr: true,
    cfg: true,
    driverSignatureEnforcement: true,
    wXMemoryProtection: true,
    secureBootDbx: true,
    vbsMode: true,
  };

  public drivers: KernelDriver[] = [
    {
      id: 'drv-nvme',
      name: 'aegis_nvme.sys',
      file: '\\SystemRoot\\System32\\drivers\\aegis_nvme.sys',
      baseAddress: '0xFFFFF80004200000',
      sizeKb: 348,
      irql: 'DEVICE_LEVEL (4)',
      status: 'Running',
      type: 'Hardware Bus',
      whqlCertified: true,
      description: 'PCIe 5.0 NVMe 2.0 Host Controller with Multi-Queue DMA & Doorbell Engine',
      devices: ['\\Device\\HarddiskVolume0', '\\Device\\NvmeController0']
    },
    {
      id: 'drv-usb4',
      name: 'usb4_host_router.sys',
      file: '\\SystemRoot\\System32\\drivers\\usb4_host_router.sys',
      baseAddress: '0xFFFFF80004580000',
      sizeKb: 284,
      irql: 'DISPATCH_LEVEL (2)',
      status: 'Running',
      type: 'Hardware Bus',
      whqlCertified: true,
      description: 'USB 4.0 / Thunderbolt 4 High-Bandwidth Tunneling Router (80 Gbps / PAM3)',
      devices: ['\\Device\\Usb4Host0', '\\Device\\ThunderboltBridge0']
    },
    {
      id: 'drv-vfio',
      name: 'vfio_iommu_passthru.sys',
      file: '\\SystemRoot\\System32\\drivers\\vfio_iommu_passthru.sys',
      baseAddress: '0xFFFFF80004900000',
      sizeKb: 512,
      irql: 'DEVICE_LEVEL (8)',
      status: 'Running',
      type: 'Graphics/WDDM',
      whqlCertified: true,
      description: 'Direct PCIe GPU Passthrough & IOMMU Group Arbitrator for KVM/QEMU',
      devices: ['\\Device\\GpuPassthru0', '\\Device\\VfioPci0']
    },
    {
      id: 'drv-wddm',
      name: 'aegis_wddm32.sys',
      file: '\\SystemRoot\\System32\\drivers\\aegis_wddm32.sys',
      baseAddress: '0xFFFFF80005100000',
      sizeKb: 1420,
      irql: 'PASSIVE_LEVEL (0)',
      status: 'Running',
      type: 'Graphics/WDDM',
      whqlCertified: true,
      description: 'WDDM 3.2 Display Miniport Driver with Hardware Flip Queue & Vulkan 1.3 Acceleration',
      devices: ['\\Device\\Display0', '\\Device\\VideoDirectX']
    },
    {
      id: 'drv-virtio',
      name: 'virtio_hal_kvm.sys',
      file: '\\SystemRoot\\System32\\drivers\\virtio_hal_kvm.sys',
      baseAddress: '0xFFFFF80003880000',
      sizeKb: 196,
      irql: 'DISPATCH_LEVEL (2)',
      status: 'Running',
      type: 'Kernel',
      whqlCertified: true,
      description: 'QEMU/KVM Para-virtualized Hardware Abstraction Layer (Vring DMA, vhost-net)',
      devices: ['\\Device\\VirtIoBus0', '\\Device\\VirtIoNet0', '\\Device\\VirtIoBlk0']
    },
    {
      id: 'drv-sec',
      name: 'aegis_bitlocker_fve.sys',
      file: '\\SystemRoot\\System32\\drivers\\aegis_bitlocker_fve.sys',
      baseAddress: '0xFFFFF80003120000',
      sizeKb: 256,
      irql: 'PASSIVE_LEVEL (0)',
      status: 'Running',
      type: 'Security Filter',
      whqlCertified: true,
      description: 'Full Volume Encryption (AES-XTS 256-bit with Hardware TPM 2.0 Seal)',
      devices: ['\\Device\\FveEncryptedVolume0', '\\Device\\TpmPcrManager']
    },
    {
      id: 'drv-wine-compat',
      name: 'wine_pe_exec.sys',
      file: '\\SystemRoot\\System32\\drivers\\wine_pe_exec.sys',
      baseAddress: '0xFFFFF80006300000',
      sizeKb: 890,
      irql: 'PASSIVE_LEVEL (0)',
      status: 'Running',
      type: 'Kernel',
      whqlCertified: true,
      description: 'Win32/WOW64 Subsystem Binary Translation & PE Loader Emulation Subsystem',
      devices: ['\\Device\\Win32Bridge', '\\Device\\PeCoffLoader']
    }
  ];

  public processes: KernelProcess[] = [
    {
      pid: 4,
      name: 'System',
      user: 'NT AUTHORITY\\SYSTEM',
      status: 'Running',
      cpuPercent: 0.8,
      memoryMb: 112,
      threads: 240,
      priority: 'RealTime',
      subsystem: 'Native/NT',
      integrityLevel: 'System',
      hardened: true,
      handles: 18400
    },
    {
      pid: 388,
      name: 'smss.exe',
      user: 'NT AUTHORITY\\SYSTEM',
      status: 'Running',
      cpuPercent: 0.1,
      memoryMb: 18,
      threads: 4,
      priority: 'High',
      subsystem: 'Native/NT',
      integrityLevel: 'System',
      hardened: true,
      handles: 420
    },
    {
      pid: 512,
      name: 'csrss.exe',
      user: 'NT AUTHORITY\\SYSTEM',
      status: 'Running',
      cpuPercent: 0.4,
      memoryMb: 42,
      threads: 18,
      priority: 'High',
      subsystem: 'Win32',
      integrityLevel: 'System',
      hardened: true,
      handles: 1250
    },
    {
      pid: 620,
      name: 'wininit.exe',
      user: 'NT AUTHORITY\\SYSTEM',
      status: 'Running',
      cpuPercent: 0.1,
      memoryMb: 24,
      threads: 6,
      priority: 'High',
      subsystem: 'Native/NT',
      integrityLevel: 'System',
      hardened: true,
      handles: 610
    },
    {
      pid: 740,
      name: 'services.exe',
      user: 'NT AUTHORITY\\SYSTEM',
      status: 'Running',
      cpuPercent: 0.3,
      memoryMb: 64,
      threads: 32,
      priority: 'AboveNormal',
      subsystem: 'Win32',
      integrityLevel: 'System',
      hardened: true,
      handles: 3200
    },
    {
      pid: 808,
      name: 'lsass.exe',
      user: 'NT AUTHORITY\\SYSTEM',
      status: 'Running',
      cpuPercent: 0.2,
      memoryMb: 52,
      threads: 14,
      priority: 'High',
      subsystem: 'Win32',
      integrityLevel: 'System',
      hardened: true,
      handles: 2100
    },
    {
      pid: 944,
      name: 'svchost.exe (DcomLaunch)',
      user: 'NT AUTHORITY\\SYSTEM',
      status: 'Running',
      cpuPercent: 0.2,
      memoryMb: 76,
      threads: 28,
      priority: 'Normal',
      subsystem: 'Win32',
      integrityLevel: 'System',
      hardened: true,
      handles: 2980
    },
    {
      pid: 1024,
      name: 'winrm_srv.exe',
      user: 'NT AUTHORITY\\NETWORK SERVICE',
      status: 'Running',
      cpuPercent: 0.2,
      memoryMb: 44,
      threads: 12,
      priority: 'Normal',
      subsystem: 'Win32',
      integrityLevel: 'High',
      hardened: true,
      handles: 1100
    },
    {
      pid: 1080,
      name: 'sshd.exe',
      user: 'NT AUTHORITY\\SYSTEM',
      status: 'Running',
      cpuPercent: 0.1,
      memoryMb: 36,
      threads: 8,
      priority: 'Normal',
      subsystem: 'POSIX',
      integrityLevel: 'High',
      hardened: true,
      handles: 820
    },
    {
      pid: 1420,
      name: 'qemu-system-x86_64.exe',
      user: 'CORP\\Admin',
      status: 'Running',
      cpuPercent: 3.4,
      memoryMb: 4096,
      threads: 16,
      priority: 'High',
      subsystem: 'Native/NT',
      integrityLevel: 'High',
      hardened: true,
      handles: 4890
    },
    {
      pid: 1856,
      name: 'wine_server.exe',
      user: 'CORP\\Admin',
      status: 'Running',
      cpuPercent: 0.6,
      memoryMb: 128,
      threads: 22,
      priority: 'Normal',
      subsystem: 'Wine',
      integrityLevel: 'Medium',
      hardened: true,
      handles: 1600
    },
    {
      pid: 2204,
      name: 'soffice.bin (LibreOffice)',
      user: 'CORP\\Admin',
      status: 'Running',
      cpuPercent: 1.1,
      memoryMb: 312,
      threads: 34,
      priority: 'Normal',
      subsystem: 'Win32',
      integrityLevel: 'Medium',
      hardened: true,
      handles: 3400
    },
    {
      pid: 3100,
      name: 'explorer.exe',
      user: 'CORP\\Admin',
      status: 'Running',
      cpuPercent: 1.2,
      memoryMb: 188,
      threads: 48,
      priority: 'Normal',
      subsystem: 'Win32',
      integrityLevel: 'Medium',
      hardened: false,
      handles: 4120
    }
  ];

  public nvme: NVMeControllerState = {
    model: 'Enterprise NVMe 2.0 PCIe Gen5 x4 Enterprise Pro',
    firmware: 'EG50-2026',
    interface: 'PCIe 5.0 x4 (32 GT/s)',
    pcieGen: 5,
    pcieLanes: 4,
    iopsRead: 1184000,
    iopsWrite: 960000,
    bandwidthMbps: 14200,
    latencyMicrosec: 28,
    temperatureC: 44,
    sqDepth: 1024,
    cqDepth: 1024,
    hmbAllocatedMb: 512,
    trimActive: true,
    healthPercent: 99
  };

  public usb4: USB4ControllerState = {
    generation: 'USB 4.0 Gen 3x2 / Thunderbolt 4 (PAM3)',
    speedGbps: 80,
    pcieTunneling: true,
    dpTunneling: true,
    usb3Tunneling: true,
    allocatedBandwidth: {
      pcie: 32,
      displayPort: 28,
      usb3: 16,
      headroom: 4
    },
    connectedDocks: [
      {
        id: 'dock-01',
        name: 'Enterprise UltraDock 40G with Dual 4K144 + 2.5GbE',
        ports: ['2x DP 2.1', '1x HDMI 2.1', '4x USB-A 3.2', '1x 2.5Gbps LAN', '1x Audio DAC'],
        powerDeliveryW: 100
      }
    ]
  };

  public gpu: GPUPassthroughState = {
    vendor: 'NVIDIA',
    model: 'RTX 6000 Ada Generation 48GB (Direct Passthrough Ready)',
    driverVersion: '560.81 Enterprise WHQL',
    iommuGroup: 24,
    vfioIsolated: true,
    mode: 'Host Composited (WDDM 3.2)',
    vramUsedMb: 6144,
    vramTotalMb: 49152,
    gpuLoadPercent: 18,
    fps: 120,
    frameTimeMs: 8.3,
    directxLevel: 'Direct3D 12 Ultimate (Feature Level 12_2)',
    vulkanVersion: 'Vulkan 1.3.280'
  };

  public vms: VirtualMachine[] = [
    {
      id: 'vm-1',
      name: 'Windows Server 2025 Datacenter',
      os: 'Windows Server 2025 x64',
      vcpus: 8,
      ramMb: 16384,
      status: 'Running',
      virtioNet: true,
      virtioBlk: true,
      gpuPassthrough: true,
      uptime: 3600,
      ipAddress: '192.168.122.105'
    },
    {
      id: 'vm-2',
      name: 'AegisNT Micro-Cluster Node 01',
      os: 'AegisNT Enterprise ARM64',
      vcpus: 4,
      ramMb: 8192,
      status: 'Running',
      virtioNet: true,
      virtioBlk: true,
      gpuPassthrough: false,
      uptime: 1800,
      ipAddress: '192.168.122.112'
    },
    {
      id: 'vm-3',
      name: 'Isolated Dev KVM Sandbox',
      os: 'Debian 12 Bookworm hardened',
      vcpus: 2,
      ramMb: 4096,
      status: 'Paused',
      virtioNet: true,
      virtioBlk: true,
      gpuPassthrough: false,
      uptime: 0,
      ipAddress: '192.168.122.140'
    }
  ];

  public partitions: DiskPartition[] = [
    {
      id: 'part-c',
      mountPoint: 'C:',
      label: 'AEGIS_SYSTEM',
      filesystem: 'NTFS-Aegis',
      totalGb: 512,
      usedGb: 88,
      encrypted: true,
      encryptionAlgorithm: 'AES-XTS-256',
      tpmLocked: true,
      recoveryKeyId: 'FVE-7789-2311-9041-4432',
      status: 'Unlocked'
    },
    {
      id: 'part-d',
      mountPoint: 'D:',
      label: 'ENTERPRISE_DATA',
      filesystem: 'ReFS 3.10',
      totalGb: 2048,
      usedGb: 640,
      encrypted: true,
      encryptionAlgorithm: 'AES-XTS-256',
      tpmLocked: true,
      recoveryKeyId: 'FVE-9014-4112-7881-6549',
      status: 'Unlocked'
    },
    {
      id: 'part-e',
      mountPoint: 'E:',
      label: 'VIRT_STORAGE_VM',
      filesystem: 'ZFS/Ext4-KVM',
      totalGb: 1024,
      usedGb: 410,
      encrypted: true,
      encryptionAlgorithm: 'AES-XTS-256',
      tpmLocked: false,
      recoveryKeyId: 'FVE-3321-8890-1200-9843',
      status: 'Unlocked'
    }
  ];

  public static getInstance(): KernelEngine {
    if (!KernelEngine.instance) {
      KernelEngine.instance = new KernelEngine();
    }
    return KernelEngine.instance;
  }

  public getStats(): KernelStats {
    return {
      arch: this.arch,
      cpuUsage: Math.floor(12 + Math.random() * 8),
      memoryUsedMb: 7420,
      memoryTotalMb: 32768,
      nonPagedPoolMb: 420,
      pagedPoolMb: 1140,
      handleCount: 48920,
      threadCount: 1680,
      processCount: this.processes.length,
      irqlLevel: 0, // PASSIVE_LEVEL
      uptimeSeconds: this.uptime,
      schedulerTickNs: this.arch === 'x86_64' ? 1000 : 800, // 1ms or 0.8ms tick
      interruptLatencyNs: this.arch === 'arm64' ? 240 : 310,
      contextSwitchRate: Math.floor(18000 + Math.random() * 2000)
    };
  }

  public switchArchitecture(targetArch: Architecture) {
    this.arch = targetArch;
  }

  public toggleGpuMode() {
    if (this.gpu.mode === 'Host Composited (WDDM 3.2)') {
      this.gpu.mode = 'VFIO KVM Passthrough (Dedicated)';
    } else {
      this.gpu.mode = 'Host Composited (WDDM 3.2)';
    }
  }

  public loadCustomDriver(name: string, type: KernelDriver['type'], desc: string): KernelDriver {
    const newDrv: KernelDriver = {
      id: `drv-${Date.now()}`,
      name: name.endsWith('.sys') ? name : `${name}.sys`,
      file: `\\SystemRoot\\System32\\drivers\\${name.endsWith('.sys') ? name : `${name}.sys`}`,
      baseAddress: `0xFFFFF800${Math.floor(Math.random() * 0xFFFFFF).toString(16).padStart(6, '0').toUpperCase()}`,
      sizeKb: Math.floor(100 + Math.random() * 400),
      irql: 'PASSIVE_LEVEL (0)',
      status: 'Loaded',
      type: type,
      whqlCertified: this.hardening.driverSignatureEnforcement,
      description: desc,
      devices: [`\\Device\\${name.replace('.sys', '')}0`]
    };
    this.drivers.push(newDrv);
    return newDrv;
  }

  public unloadDriver(id: string) {
    this.drivers = this.drivers.filter(d => d.id !== id);
  }

  public killProcess(pid: number) {
    this.processes = this.processes.filter(p => p.pid !== pid);
  }

  public spawnProcess(name: string, subsystem: KernelProcess['subsystem'], memoryMb = 64): KernelProcess {
    const newProc: KernelProcess = {
      pid: Math.floor(2000 + Math.random() * 8000),
      name,
      user: 'CORP\\Admin',
      status: 'Running',
      cpuPercent: +(Math.random() * 4).toFixed(1),
      memoryMb,
      threads: Math.floor(4 + Math.random() * 12),
      priority: 'Normal',
      subsystem,
      integrityLevel: 'Medium',
      hardened: true,
      handles: Math.floor(200 + Math.random() * 800)
    };
    this.processes.push(newProc);
    return newProc;
  }
}
