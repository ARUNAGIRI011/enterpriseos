export type Architecture = 'x86_64' | 'arm64';

export interface KernelStats {
  arch: Architecture;
  cpuUsage: number;
  memoryUsedMb: number;
  memoryTotalMb: number;
  nonPagedPoolMb: number;
  pagedPoolMb: number;
  handleCount: number;
  threadCount: number;
  processCount: number;
  irqlLevel: number;
  uptimeSeconds: number;
  schedulerTickNs: number;
  interruptLatencyNs: number;
  contextSwitchRate: number;
}

export interface KernelProcess {
  pid: number;
  name: string;
  user: string;
  status: 'Running' | 'Suspended' | 'Ready' | 'Waiting';
  cpuPercent: number;
  memoryMb: number;
  threads: number;
  priority: 'RealTime' | 'High' | 'AboveNormal' | 'Normal' | 'Low';
  subsystem: 'Win32' | 'Native/NT' | 'Wine' | 'POSIX';
  integrityLevel: 'System' | 'High' | 'Medium' | 'Low';
  hardened: boolean;
  handles: number;
}

export interface KernelDriver {
  id: string;
  name: string;
  file: string;
  baseAddress: string;
  sizeKb: number;
  irql: string;
  status: 'Loaded' | 'Running' | 'Unloaded' | 'Faulted';
  type: 'Kernel' | 'File System' | 'Hardware Bus' | 'Graphics/WDDM' | 'Security Filter';
  whqlCertified: boolean;
  description: string;
  devices: string[];
}

export interface NVMeControllerState {
  model: string;
  firmware: string;
  interface: string;
  pcieGen: number;
  pcieLanes: number;
  iopsRead: number;
  iopsWrite: number;
  bandwidthMbps: number;
  latencyMicrosec: number;
  temperatureC: number;
  sqDepth: number;
  cqDepth: number;
  hmbAllocatedMb: number;
  trimActive: boolean;
  healthPercent: number;
}

export interface USB4ControllerState {
  generation: string;
  speedGbps: number;
  pcieTunneling: boolean;
  dpTunneling: boolean;
  usb3Tunneling: boolean;
  allocatedBandwidth: {
    pcie: number;
    displayPort: number;
    usb3: number;
    headroom: number;
  };
  connectedDocks: Array<{
    id: string;
    name: string;
    ports: string[];
    powerDeliveryW: number;
  }>;
}

export interface GPUPassthroughState {
  vendor: 'NVIDIA' | 'AMD' | 'Intel';
  model: string;
  driverVersion: string;
  iommuGroup: number;
  vfioIsolated: boolean;
  mode: 'Host Composited (WDDM 3.2)' | 'VFIO KVM Passthrough (Dedicated)';
  vramUsedMb: number;
  vramTotalMb: number;
  gpuLoadPercent: number;
  fps: number;
  frameTimeMs: number;
  directxLevel: string;
  vulkanVersion: string;
}

export interface VirtualMachine {
  id: string;
  name: string;
  os: string;
  vcpus: number;
  ramMb: number;
  status: 'Running' | 'Stopped' | 'Paused';
  virtioNet: boolean;
  virtioBlk: boolean;
  gpuPassthrough: boolean;
  uptime: number;
  ipAddress: string;
}

export interface DiskPartition {
  id: string;
  mountPoint: string;
  label: string;
  filesystem: string;
  totalGb: number;
  usedGb: number;
  encrypted: boolean;
  encryptionAlgorithm: 'AES-XTS-256' | 'AES-CBC-256' | 'None';
  tpmLocked: boolean;
  recoveryKeyId: string;
  status: 'Unlocked' | 'Locked' | 'Encrypting' | 'Decrypting';
}

export interface KernelHardeningConfig {
  hvci: boolean;
  smep: boolean;
  smap: boolean;
  kaslr: boolean;
  cfg: boolean;
  driverSignatureEnforcement: boolean;
  wXMemoryProtection: boolean;
  secureBootDbx: boolean;
  vbsMode: boolean;
}

export interface AppWindow {
  id: string;
  appId: string;
  title: string;
  icon: string;
  isMinimized: boolean;
  isMaximized: boolean;
  zIndex: number;
  x: number;
  y: number;
  width: number;
  height: number;
  defaultData?: any;
}

export interface DesktopIcon {
  id: string;
  title: string;
  icon: string;
  appId: string;
  color?: string;
}

export interface SystemLogEvent {
  id: string;
  eventId: number;
  level: 'Critical' | 'Error' | 'Warning' | 'Information' | 'Success Audit' | 'Failure Audit';
  source: string;
  category: string;
  timestamp: string;
  computer: string;
  user: string;
  message: string;
  logName: 'System' | 'Security' | 'Application' | 'Hardware/Drivers';
  details?: Record<string, string | number>;
}
