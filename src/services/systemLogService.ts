import { SystemLogEvent } from '../types/os';

export class SystemLogService {
  private static instance: SystemLogService;
  private logs: SystemLogEvent[] = [];
  private listeners: Array<(logs: SystemLogEvent[]) => void> = [];
  private isStreaming = true;
  private streamInterval: any = null;

  private constructor() {
    this.seedInitialLogs();
    this.startStreaming();
  }

  public static getInstance(): SystemLogService {
    if (!SystemLogService.instance) {
      SystemLogService.instance = new SystemLogService();
    }
    return SystemLogService.instance;
  }

  private seedInitialLogs() {
    const now = Date.now();
    const formatTime = (offsetSec: number) => {
      const d = new Date(now - offsetSec * 1000);
      return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }) + '.' + d.getMilliseconds().toString().padStart(3, '0');
    };

    this.logs = [
      {
        id: 'evt-1',
        eventId: 4624,
        level: 'Success Audit',
        source: 'Microsoft-Windows-Security-Auditing',
        category: 'Logon',
        timestamp: formatTime(240),
        computer: 'AEGISNT-ENTERPRISE-01',
        user: 'NT AUTHORITY\\SYSTEM',
        logName: 'Security',
        message: 'An account was successfully logged on. Subject User: Administrator (Domain: CORP.INTERNAL). Logon Type: 2 (Interactive). Elevated Token: Enabled. Virtualization-Based Security: Active.',
        details: { LogonType: 2, PackageName: 'Negotiate', KeyLength: 256, ProcessId: 620 }
      },
      {
        id: 'evt-2',
        eventId: 12,
        level: 'Information',
        source: 'Microsoft-Windows-Kernel-General',
        category: 'Kernel Boot',
        timestamp: formatTime(235),
        computer: 'AEGISNT-ENTERPRISE-01',
        user: 'NT AUTHORITY\\SYSTEM',
        logName: 'System',
        message: 'The operating system started at system time. Hypervisor type: QEMU/KVM Para-Virtualization. Hardware Enforced Stack Protection: Active. Secure Boot: Enabled.',
        details: { BootType: 'UEFI_GPT', SecureBoot: 'Enabled', VirtualizationBasedSecurity: 'Active' }
      },
      {
        id: 'evt-3',
        eventId: 100,
        level: 'Information',
        source: 'AegisNT-HAL-VirtIO',
        category: 'Hardware Abstraction',
        timestamp: formatTime(220),
        computer: 'AEGISNT-ENTERPRISE-01',
        user: 'NT AUTHORITY\\SYSTEM',
        logName: 'Hardware/Drivers',
        message: 'virtio_hal_kvm.sys: Successfully bound to PCI 00:03.0 VirtIO network controller. Ring buffer size: 1024, Multi-queue: 8 channels initialized. Sub-microsecond exit path verified.',
        details: { Driver: 'virtio_hal_kvm.sys', Irql: 'DISPATCH_LEVEL', RingSize: 1024 }
      },
      {
        id: 'evt-4',
        eventId: 501,
        level: 'Information',
        source: 'AegisNT-PCIe-NVMe',
        category: 'Storage Subsystem',
        timestamp: formatTime(205),
        computer: 'AEGISNT-ENTERPRISE-01',
        user: 'NT AUTHORITY\\SYSTEM',
        logName: 'Hardware/Drivers',
        message: 'aegis_nvme.sys: Host Controller 0 enumerated PCIe Gen5 x4 lanes. IOPS benchmark capacity: 1,200,000 read / 950,000 write. Hardware Doorbell ring active.',
        details: { Driver: 'aegis_nvme.sys', PCIeGen: 5, Lanes: 4, IOPSReadCap: 1200000 }
      },
      {
        id: 'evt-5',
        eventId: 24578,
        level: 'Information',
        source: 'Microsoft-Windows-BitLocker-Driver',
        category: 'Full Volume Encryption',
        timestamp: formatTime(190),
        computer: 'AEGISNT-ENTERPRISE-01',
        user: 'NT AUTHORITY\\SYSTEM',
        logName: 'Security',
        message: 'BitLocker Volume (C:) unlocked using TPM 2.0 key sealed with PCRs 0, 2, 4, 7, 11. Cipher engine: AES-XTS-256 with hardware cryptographic acceleration.',
        details: { Cipher: 'AES-XTS-256', TpmVersion: '2.0', PcrStatus: 'Validated' }
      },
      {
        id: 'evt-6',
        eventId: 7036,
        level: 'Information',
        source: 'Service Control Manager',
        category: 'Service Lifecycle',
        timestamp: formatTime(175),
        computer: 'AEGISNT-ENTERPRISE-01',
        user: 'NT AUTHORITY\\SYSTEM',
        logName: 'System',
        message: 'The Windows Remote Management (WS-Management) service entered the running state. Listening on TCP 5985 (HTTP) and 5986 (HTTPS).',
        details: { ServiceName: 'WinRM', State: 'Running' }
      },
      {
        id: 'evt-7',
        eventId: 1000,
        level: 'Information',
        source: 'Wine-PE-Subsystem',
        category: 'Application Subsystem',
        timestamp: formatTime(150),
        computer: 'AEGISNT-ENTERPRISE-01',
        user: 'CORP\\Administrator',
        logName: 'Application',
        message: 'wine_pe_exec.sys: Initialized WOW64 binary bridge for PE32/PE32+ executables. Direct NTDLL system call dispatch table linked with zero thunking overhead.',
        details: { Subsystem: 'WOW64', Version: '9.8-Enterprise', SyscallEmulation: 'Zero-Copy' }
      },
      {
        id: 'evt-8',
        eventId: 204,
        level: 'Warning',
        source: 'AegisNT-Kernel-Power',
        category: 'Power Management',
        timestamp: formatTime(120),
        computer: 'AEGISNT-ENTERPRISE-01',
        user: 'NT AUTHORITY\\SYSTEM',
        logName: 'System',
        message: 'Processor power governor throttled clock speed to baseline during hypervisor vCPU allocation burst. Normal frequencies restored in 4 milliseconds.',
        details: { Governor: 'Performance', ThrottleDurationMs: 4 }
      },
      {
        id: 'evt-9',
        eventId: 600,
        level: 'Information',
        source: 'AegisNT-VFIO-Passthrough',
        category: 'Graphics Subsystem',
        timestamp: formatTime(90),
        computer: 'AEGISNT-ENTERPRISE-01',
        user: 'NT AUTHORITY\\SYSTEM',
        logName: 'Hardware/Drivers',
        message: 'vfio_iommu_passthru.sys: IOMMU Group 14 isolated. Direct memory mapping (DMA Remapping) established for NVIDIA GeForce RTX / VirtIO GPU device.',
        details: { Group: 14, VFIO: 'Active', DirectMemoryMapping: 'Enabled' }
      },
      {
        id: 'evt-10',
        eventId: 7036,
        level: 'Information',
        source: 'Service Control Manager',
        category: 'Service Lifecycle',
        timestamp: formatTime(60),
        computer: 'AEGISNT-ENTERPRISE-01',
        user: 'NT AUTHORITY\\SYSTEM',
        logName: 'System',
        message: 'The OpenSSH SSH Server service entered the running state on port 22.',
        details: { ServiceName: 'sshd', State: 'Running', Port: 22 }
      },
      {
        id: 'evt-11',
        eventId: 4672,
        level: 'Success Audit',
        source: 'Microsoft-Windows-Security-Auditing',
        category: 'Special Privileges',
        timestamp: formatTime(30),
        computer: 'AEGISNT-ENTERPRISE-01',
        user: 'NT AUTHORITY\\SYSTEM',
        logName: 'Security',
        message: 'Special privileges assigned to new logon. Privileges: SeSecurityPrivilege, SeBackupPrivilege, SeRestorePrivilege, SeTakeOwnershipPrivilege, SeDebugPrivilege.',
        details: { Privileges: 'SeDebugPrivilege, SeSecurityPrivilege' }
      },
      {
        id: 'evt-12',
        eventId: 1002,
        level: 'Information',
        source: 'LibreOffice-Enterprise',
        category: 'Document Engine',
        timestamp: formatTime(10),
        computer: 'AEGISNT-ENTERPRISE-01',
        user: 'CORP\\Administrator',
        logName: 'Application',
        message: 'soffice.bin: Enterprise document engine started. OpenDocument format (ODF 1.3) validation and PDF/A-2b export engine ready.',
        details: { Process: 'soffice.bin', Version: '24.8.2', PDFEngine: 'PDF/A-2b' }
      }
    ];
  }

  private startStreaming() {
    if (this.streamInterval) clearInterval(this.streamInterval);

    const streamSources = [
      {
        eventId: 1003,
        level: 'Information' as const,
        source: 'AegisNT-Kernel-Memory',
        category: 'Memory Management',
        logName: 'System' as const,
        message: 'Zero-page thread completed cycle. Standby memory pool refreshed: 12,480 MB ready for zero-copy allocation.'
      },
      {
        eventId: 502,
        level: 'Information' as const,
        source: 'AegisNT-PCIe-NVMe',
        category: 'Storage Subsystem',
        logName: 'Hardware/Drivers' as const,
        message: 'NVMe CQ Doorbell processed 4,280 I/O completions. Average latency: 26.2 microseconds.'
      },
      {
        eventId: 104,
        level: 'Information' as const,
        source: 'AegisNT-HAL-VirtIO',
        category: 'Network Activity',
        logName: 'Hardware/Drivers' as const,
        message: 'virtio-net: Vring buffer synchronized. Transmitted 12,840 packets without queue stall.'
      },
      {
        eventId: 4624,
        level: 'Success Audit' as const,
        source: 'Microsoft-Windows-Security-Auditing',
        category: 'Token Verification',
        logName: 'Security' as const,
        message: 'Kerberos ticket grant renewed for principal Administrator@CORP.INTERNAL. Next renewal in 10 hours.'
      },
      {
        eventId: 2001,
        level: 'Information' as const,
        source: 'Wine-PE-Subsystem',
        category: 'Execution Pipeline',
        logName: 'Application' as const,
        message: 'PE binary dynamic link resolved: USER32.dll -> KERNEL32.dll -> NTDLL.dll system table matched.'
      },
      {
        eventId: 108,
        level: 'Warning' as const,
        source: 'AegisNT-USB4-Router',
        category: 'Bus Negotiation',
        logName: 'Hardware/Drivers' as const,
        message: 'USB4 port 2 link re-timed. Bandwidth re-allocated: PCIe tunnel 32 Gbps, DisplayPort tunnel 40 Gbps.'
      }
    ];

    this.streamInterval = setInterval(() => {
      if (!this.isStreaming) return;
      const tmpl = streamSources[Math.floor(Math.random() * streamSources.length)];
      const d = new Date();
      const timestamp = d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }) + '.' + d.getMilliseconds().toString().padStart(3, '0');

      const newEvt: SystemLogEvent = {
        id: `evt-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
        eventId: tmpl.eventId,
        level: tmpl.level,
        source: tmpl.source,
        category: tmpl.category,
        timestamp,
        computer: 'AEGISNT-ENTERPRISE-01',
        user: 'NT AUTHORITY\\SYSTEM',
        logName: tmpl.logName,
        message: tmpl.message,
        details: { TimestampUnix: Date.now(), ThreadId: Math.floor(1000 + Math.random() * 9000) }
      };

      this.logs.unshift(newEvt);
      if (this.logs.length > 300) {
        this.logs.pop();
      }

      this.notifyListeners();
    }, 4000);
  }

  public getLogs(): SystemLogEvent[] {
    return [...this.logs];
  }

  public clearLogs() {
    this.logs = [];
    this.notifyListeners();
  }

  public toggleStreaming(): boolean {
    this.isStreaming = !this.isStreaming;
    return this.isStreaming;
  }

  public getIsStreaming(): boolean {
    return this.isStreaming;
  }

  public subscribe(callback: (logs: SystemLogEvent[]) => void): () => void {
    this.listeners.push(callback);
    callback(this.getLogs());
    return () => {
      this.listeners = this.listeners.filter(cb => cb !== callback);
    };
  }

  private notifyListeners() {
    for (const listener of this.listeners) {
      listener(this.getLogs());
    }
  }

  public exportLogsAsJson(): string {
    return JSON.stringify(this.logs, null, 2);
  }
}
