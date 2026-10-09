import React, { useState, useEffect, useMemo } from 'react';
import {
  Shield,
  ShieldCheck,
  Activity,
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
  Server,
  Cpu,
  Clock,
  Layers,
  Search,
  Filter,
  Terminal,
  Download,
  Copy,
  Check,
  ChevronDown,
  ChevronRight,
  TrendingUp,
  Zap,
  Lock,
  ArrowUpRight,
  FileText,
  Play,
  RotateCcw,
  Sparkles,
  Database,
  Globe,
  Radio
} from 'lucide-react';

export interface KernelPatchRecord {
  id: string; // e.g. KB5044284
  cveId: string; // e.g. CVE-2026-3194
  title: string;
  subsystem: 'Microkernel Core' | 'Memory / SLAB' | 'Hypervisor VTL-1' | 'TCP/IP & eBPF' | 'Wine NTDLL Subsystem' | 'HAL / APIC';
  severity: 'Critical' | 'Important' | 'Moderate';
  kernelVersionFrom: string;
  kernelVersionTo: string;
  releasedDate: string;
  deploymentDate: string;
  nodesTargeted: number;
  nodesSuccessful: number;
  successRate: number; // e.g. 99.98
  avgPatchTimeMs: number;
  rebootsRequired: 0;
  status: '100% Deployed' | 'In Progress' | 'Verified Healthy';
  sha256Hash: string;
  whqlCatalogId: string;
  tpmQuotePcr7: string;
  targetSymbol: string;
  disassemblyBefore: string[];
  disassemblyAfter: string[];
  clusterBreakdown: {
    name: string;
    nodes: number;
    successRate: number;
  }[];
}

const INITIAL_KERNEL_PATCH_HISTORY: KernelPatchRecord[] = [
  {
    id: 'KB5044284',
    cveId: 'CVE-2026-3194',
    title: 'AegisNT Microkernel eBPF Bounds Check & Zero-Day Privilege Mitigation',
    subsystem: 'Microkernel Core',
    severity: 'Critical',
    kernelVersionFrom: '10.0.26100.1742-aegis',
    kernelVersionTo: '10.0.26100.1882-aegis',
    releasedDate: '10/06/2026 14:00 UTC',
    deploymentDate: '10/06/2026 14:15 UTC',
    nodesTargeted: 14928,
    nodesSuccessful: 14928,
    successRate: 100.0,
    avgPatchTimeMs: 1420,
    rebootsRequired: 0,
    status: '100% Deployed',
    sha256Hash: '9f83a48e89b37c02b3769c02ff4e311a684b06d87e0fa88924b105a2cd0f4bc9',
    whqlCatalogId: 'WHQL-2026-SEC-884102-NT11',
    tpmQuotePcr7: 'PCR-7: e7b1a208c903274df28019aa14bc88ef634027419842a843',
    targetSymbol: 'ntoskrnl.exe!KeSynchronizeExecution',
    disassemblyBefore: [
      'ntoskrnl.exe+0x18420: 48 83 ec 38             sub    rsp, 0x38',
      'ntoskrnl.exe+0x18424: 48 8b 41 20             mov    rax, [rcx+0x20] ; unchecked buffer index',
      'ntoskrnl.exe+0x18428: 48 89 44 24 20          mov    [rsp+0x20], rax',
      'ntoskrnl.exe+0x1842d: e8 c2 fa ff ff          call   ntoskrnl.exe!ExAllocatePoolWithTag'
    ],
    disassemblyAfter: [
      'ntoskrnl.exe+0x18420: e9 db 73 89 02          jmp    kpatch_nt_KeSynchronizeExecution_hotfix',
      'kpatch_hotfix+0x0000: 48 83 ec 40             sub    rsp, 0x40',
      'kpatch_hotfix+0x0004: 48 81 fa 00 10 00 00    cmp    rdx, 0x1000     ; STRICT BOUNDS GUARD',
      'kpatch_hotfix+0x000b: 77 24                   ja     kpatch_hotfix+0x31 ; return STATUS_BUFFER_OVERFLOW',
      'kpatch_hotfix+0x000d: e8 a2 44 fc ff          call   kpatch_safe_alloc'
    ],
    clusterBreakdown: [
      { name: 'us-east-prod-k8s', nodes: 4280, successRate: 100.0 },
      { name: 'eu-west-hyperv-vdi', nodes: 3640, successRate: 100.0 },
      { name: 'ap-northeast-fintech', nodes: 2850, successRate: 100.0 },
      { name: 'us-govcloud-sovereign', nodes: 1920, successRate: 100.0 },
      { name: 'edge-retail-terminals', nodes: 2238, successRate: 100.0 }
    ]
  },
  {
    id: 'KB5043076',
    cveId: 'CVE-2026-2810',
    title: 'Wine 9.20 Subsystem Sandbox Hardening & Syscall Filter Barrier',
    subsystem: 'Wine NTDLL Subsystem',
    severity: 'Important',
    kernelVersionFrom: '10.0.26100.1650-aegis',
    kernelVersionTo: '10.0.26100.1742-aegis',
    releasedDate: '09/24/2026 18:30 UTC',
    deploymentDate: '09/24/2026 18:42 UTC',
    nodesTargeted: 14928,
    nodesSuccessful: 14918,
    successRate: 99.93,
    avgPatchTimeMs: 980,
    rebootsRequired: 0,
    status: 'Verified Healthy',
    sha256Hash: '4a6b291c98de12048f76023cb51e902b78129486c8f94101e9d8b871239e9177',
    whqlCatalogId: 'WHQL-2026-WINE-772910-SUB',
    tpmQuotePcr7: 'PCR-7: 3c829910abf10427de8760221379bb012488a091873b2241',
    targetSymbol: 'ntdll.dll!NtCreateUserProcess_Filter',
    disassemblyBefore: [
      'ntdll.dll+0x09210: 48 89 5c 24 08             mov    [rsp+0x08], rbx',
      'ntdll.dll+0x09215: 48 8b 05 a4 19 0e 00       mov    rax, [rel_wine_server_fd]',
      'ntdll.dll+0x0921c: 0f 05                      syscall'
    ],
    disassemblyAfter: [
      'ntdll.dll+0x09210: e9 18 42 10 01             jmp    wine_bwrap_seccomp_filter_gate',
      'wine_bwrap_gate:   48 85 c0                   test   rax, rax',
      'wine_bwrap_gate:   74 1c                      jz     deny_untrusted_syscall_ring3'
    ],
    clusterBreakdown: [
      { name: 'us-east-prod-k8s', nodes: 4280, successRate: 100.0 },
      { name: 'eu-west-hyperv-vdi', nodes: 3640, successRate: 99.8 },
      { name: 'ap-northeast-fintech', nodes: 2850, successRate: 100.0 },
      { name: 'us-govcloud-sovereign', nodes: 1920, successRate: 100.0 },
      { name: 'edge-retail-terminals', nodes: 2238, successRate: 99.8 }
    ]
  },
  {
    id: 'KB5042118',
    cveId: 'CVE-2026-1922',
    title: 'Hypervisor-Protected Code Integrity (HVCI) VTL-1 Memory Enclave Resiliency',
    subsystem: 'Hypervisor VTL-1',
    severity: 'Critical',
    kernelVersionFrom: '10.0.26100.1510-aegis',
    kernelVersionTo: '10.0.26100.1650-aegis',
    releasedDate: '09/10/2026 09:12 UTC',
    deploymentDate: '09/10/2026 09:20 UTC',
    nodesTargeted: 14928,
    nodesSuccessful: 14928,
    successRate: 100.0,
    avgPatchTimeMs: 1680,
    rebootsRequired: 0,
    status: '100% Deployed',
    sha256Hash: '772b109af2c9834190f845019842e88a01f928c0498b846e911283d84950ab91',
    whqlCatalogId: 'WHQL-2026-VTL1-665190-HVCI',
    tpmQuotePcr7: 'PCR-7: 1a992bc01289fe8710328901baef4821a0094b8398412891',
    targetSymbol: 'securekernel.exe!SkMmCreateSecureEnclave',
    disassemblyBefore: [
      'securekernel+0x410: 48 83 ec 28               sub    rsp, 0x28',
      'securekernel+0x414: 48 8b 05 91 08 00 00       mov    rax, [rel vtl1_ept_ptr]',
      'securekernel+0x41b: 0f 01 c1                   vmcall'
    ],
    disassemblyAfter: [
      'securekernel+0x410: e9 c8 90 04 00             jmp    vtl1_secure_isolated_ept_verifier',
      'vtl1_verifier:     48 83 3d 10 20 00 00 00    cmp    qword ptr [vtl1_lock], 0',
      'vtl1_verifier:     0f 01 c1                   vmcall'
    ],
    clusterBreakdown: [
      { name: 'us-east-prod-k8s', nodes: 4280, successRate: 100.0 },
      { name: 'eu-west-hyperv-vdi', nodes: 3640, successRate: 100.0 },
      { name: 'ap-northeast-fintech', nodes: 2850, successRate: 100.0 },
      { name: 'us-govcloud-sovereign', nodes: 1920, successRate: 100.0 },
      { name: 'edge-retail-terminals', nodes: 2238, successRate: 100.0 }
    ]
  },
  {
    id: 'KB5041094',
    cveId: 'CVE-2026-1402',
    title: 'TCPIP.sys Offload & VirtIO Network Queue Zero-Copy Packet Filter Race Condition',
    subsystem: 'TCP/IP & eBPF',
    severity: 'Important',
    kernelVersionFrom: '10.0.26100.1400-aegis',
    kernelVersionTo: '10.0.26100.1510-aegis',
    releasedDate: '08/21/2026 11:45 UTC',
    deploymentDate: '08/21/2026 12:02 UTC',
    nodesTargeted: 14928,
    nodesSuccessful: 14902,
    successRate: 99.82,
    avgPatchTimeMs: 1110,
    rebootsRequired: 0,
    status: 'Verified Healthy',
    sha256Hash: '3819c9018420eb18a09bc2981048201a098716b91048f0291a82bc819038ec10',
    whqlCatalogId: 'WHQL-2026-NET-551042-TCPIP',
    tpmQuotePcr7: 'PCR-7: ff9102834b9812903498a120b84c81093412098418903429',
    targetSymbol: 'tcpip.sys!TcpDeliverIncomingPackets',
    disassemblyBefore: [
      'tcpip.sys+0x21a0:   48 8b 4c 24 40             mov    rcx, [rsp+0x40]',
      'tcpip.sys+0x21a5:   e8 96 11 00 00             call   tcpip.sys!ProcessNblRingBuffer'
    ],
    disassemblyAfter: [
      'tcpip.sys+0x21a0:   e9 a0 41 02 00             jmp    kpatch_atomic_nbl_sanitizer',
      'nbl_sanitizer:      f0 0f ba 2b 00             lock bts dword ptr [rbx], 0',
      'nbl_sanitizer:      e8 80 11 00 00             call   tcpip.sys!ProcessNblRingBuffer'
    ],
    clusterBreakdown: [
      { name: 'us-east-prod-k8s', nodes: 4280, successRate: 100.0 },
      { name: 'eu-west-hyperv-vdi', nodes: 3640, successRate: 99.7 },
      { name: 'ap-northeast-fintech', nodes: 2850, successRate: 100.0 },
      { name: 'us-govcloud-sovereign', nodes: 1920, successRate: 100.0 },
      { name: 'edge-retail-terminals', nodes: 2238, successRate: 99.5 }
    ]
  },
  {
    id: 'KB5039981',
    cveId: 'CVE-2026-0814',
    title: 'AegisNT Microkernel Non-Paged SLAB Allocator Fragmentation Mitigation',
    subsystem: 'Memory / SLAB',
    severity: 'Moderate',
    kernelVersionFrom: '10.0.26100.1280-aegis',
    kernelVersionTo: '10.0.26100.1400-aegis',
    releasedDate: '07/15/2026 16:10 UTC',
    deploymentDate: '07/15/2026 16:25 UTC',
    nodesTargeted: 14928,
    nodesSuccessful: 14928,
    successRate: 100.0,
    avgPatchTimeMs: 820,
    rebootsRequired: 0,
    status: '100% Deployed',
    sha256Hash: '19047b8192a09cb4091823901bcf91028471029410948b810938b81092837bc9',
    whqlCatalogId: 'WHQL-2026-MEM-449102-SLAB',
    tpmQuotePcr7: 'PCR-7: 09812bc89104819028491028309182093810293810928301',
    targetSymbol: 'ntoskrnl.exe!MiAllocatePoolPages',
    disassemblyBefore: [
      'ntoskrnl.exe+0x8820: 48 83 ec 28             sub    rsp, 0x28',
      'ntoskrnl.exe+0x8824: 48 8b 0d 95 18 10 00    mov    rcx, [rel SlabPoolFreeListHead]',
      'ntoskrnl.exe+0x882b: 48 85 c9                test   rcx, rcx'
    ],
    disassemblyAfter: [
      'ntoskrnl.exe+0x8820: e9 40 18 01 00          jmp    kpatch_numa_slab_cache_freelist',
      'numa_slab_cache:    65 48 8b 04 25 88 01 00 00 mov rax, gs:[0x188] ; get current CPU NUMA node',
      'numa_slab_cache:    48 8b 88 a0 00 00 00    mov    rcx, [rax+0xa0]'
    ],
    clusterBreakdown: [
      { name: 'us-east-prod-k8s', nodes: 4280, successRate: 100.0 },
      { name: 'eu-west-hyperv-vdi', nodes: 3640, successRate: 100.0 },
      { name: 'ap-northeast-fintech', nodes: 2850, successRate: 100.0 },
      { name: 'us-govcloud-sovereign', nodes: 1920, successRate: 100.0 },
      { name: 'edge-retail-terminals', nodes: 2238, successRate: 100.0 }
    ]
  }
];

// 24-Hour Fleet Telemetry Time-Series Data Points
const HOURLY_TELEMETRY = [
  { hour: '00:00', successRate: 99.98, throughput: 310, activeNodes: 14928, latencyMs: 1.34 },
  { hour: '02:00', successRate: 99.96, throughput: 180, activeNodes: 14928, latencyMs: 1.35 },
  { hour: '04:00', successRate: 99.94, throughput: 240, activeNodes: 14928, latencyMs: 1.32 },
  { hour: '06:00', successRate: 99.97, throughput: 620, activeNodes: 14928, latencyMs: 1.40 },
  { hour: '08:00', successRate: 99.92, throughput: 1450, activeNodes: 14928, latencyMs: 1.44 },
  { hour: '10:00', successRate: 99.88, throughput: 1820, activeNodes: 14928, latencyMs: 1.46 },
  { hour: '12:00', successRate: 99.91, throughput: 1640, activeNodes: 14928, latencyMs: 1.42 },
  { hour: '14:00', successRate: 99.86, throughput: 2100, activeNodes: 14928, latencyMs: 1.41 },
  { hour: '16:00', successRate: 99.89, throughput: 1780, activeNodes: 14928, latencyMs: 1.39 },
  { hour: '18:00', successRate: 99.92, throughput: 1120, activeNodes: 14928, latencyMs: 1.36 },
  { hour: '20:00', successRate: 99.95, throughput: 890, activeNodes: 14928, latencyMs: 1.37 },
  { hour: '22:00', successRate: 99.98, throughput: 420, activeNodes: 14928, latencyMs: 1.35 },
];

export default function AegisFleetPatchDashboard() {
  // Fleet Patch History State
  const [historyList, setHistoryList] = useState<KernelPatchRecord[]>(INITIAL_KERNEL_PATCH_HISTORY);
  const [selectedRecordId, setSelectedRecordId] = useState<string | null>('KB5044284');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSubsystem, setSelectedSubsystem] = useState<string>('All');
  const [selectedSeverity, setSelectedSeverity] = useState<string>('All');
  const [selectedClusterFilter, setSelectedClusterFilter] = useState<string>('All');

  // Real-time Telemetry Jitter Simulation
  const [telemetryHeartbeat, setTelemetryHeartbeat] = useState(0);
  const [liveSuccessRate, setLiveSuccessRate] = useState(99.88);
  const [liveActiveNodes] = useState(14928);
  const [liveSuccessfullyPatchedNodes, setLiveSuccessfullyPatchedNodes] = useState(14910);
  const [livePendingNodes, setLivePendingNodes] = useState(18);
  const [isSimulatingLiveStream, setIsSimulatingLiveStream] = useState(true);

  // Live Rollout Modal / Simulation State
  const [isRolloutActive, setIsRolloutActive] = useState(false);
  const [rolloutStage, setRolloutStage] = useState<'idle' | 'validating' | 'staging' | 'quiescence' | 'injecting' | 'verifying' | 'complete'>('idle');
  const [rolloutProgress, setRolloutProgress] = useState(0);
  const [rolloutCurrentNode, setRolloutCurrentNode] = useState('us-east-prod-k8s-node-001');

  // UI States
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [activeTabSubView, setActiveTabSubView] = useState<'metrics' | 'timeline' | 'clusters' | 'dmesg'>('metrics');
  const [activeDmesgFilter, setActiveDmesgFilter] = useState<'all' | 'hotpatch' | 'pcr' | 'security'>('hotpatch');

  // Simulated Live Telemetry Stream Ticks
  useEffect(() => {
    if (!isSimulatingLiveStream) return;
    const interval = setInterval(() => {
      setTelemetryHeartbeat((h) => h + 1);
      // Subtle realistic micro-jitter between 99.86% and 99.91%
      setLiveSuccessRate((prev) => {
        const delta = (Math.random() - 0.48) * 0.02;
        const next = Math.min(100, Math.max(99.82, prev + delta));
        return parseFloat(next.toFixed(2));
      });
    }, 2800);
    return () => clearInterval(interval);
  }, [isSimulatingLiveStream]);

  // Copy helper
  const copyText = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  // Filtered History
  const filteredHistory = useMemo(() => {
    return historyList.filter((item) => {
      const matchesSearch =
        item.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.cveId.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.targetSymbol.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesSubsystem =
        selectedSubsystem === 'All' || item.subsystem === selectedSubsystem;

      const matchesSeverity =
        selectedSeverity === 'All' || item.severity === selectedSeverity;

      const matchesCluster =
        selectedClusterFilter === 'All' ||
        item.clusterBreakdown.some((c) => c.name === selectedClusterFilter);

      return matchesSearch && matchesSubsystem && matchesSeverity && matchesCluster;
    });
  }, [historyList, searchQuery, selectedSubsystem, selectedSeverity, selectedClusterFilter]);

  // Selected Record details
  const selectedRecord = useMemo(() => {
    return historyList.find((r) => r.id === selectedRecordId) || historyList[0];
  }, [historyList, selectedRecordId]);

  // Simulation: Trigger Fleet Hotpatch Rollout
  const handleTriggerFleetRollout = () => {
    setIsRolloutActive(true);
    setRolloutProgress(0);
    setRolloutStage('validating');

    const stages: Array<'validating' | 'staging' | 'quiescence' | 'injecting' | 'verifying' | 'complete'> = [
      'validating',
      'staging',
      'quiescence',
      'injecting',
      'verifying',
      'complete'
    ];

    let currentStageIndex = 0;
    let progress = 0;

    const interval = setInterval(() => {
      progress += 5;
      setRolloutProgress(progress);

      // Rotate simulated node names
      const clusters = ['us-east-prod-k8s', 'eu-west-hyperv-vdi', 'ap-northeast-fintech', 'us-govcloud-sovereign', 'edge-retail'];
      const randCluster = clusters[Math.floor(Math.random() * clusters.length)];
      const randNodeNum = String(Math.floor(Math.random() * 900) + 100).padStart(3, '0');
      setRolloutCurrentNode(`${randCluster}-worker-${randNodeNum}`);

      if (progress >= 20 && currentStageIndex === 0) {
        currentStageIndex = 1;
        setRolloutStage('staging');
      } else if (progress >= 40 && currentStageIndex === 1) {
        currentStageIndex = 2;
        setRolloutStage('quiescence');
      } else if (progress >= 65 && currentStageIndex === 2) {
        currentStageIndex = 3;
        setRolloutStage('injecting');
      } else if (progress >= 85 && currentStageIndex === 3) {
        currentStageIndex = 4;
        setRolloutStage('verifying');
      } else if (progress >= 100) {
        clearInterval(interval);
        setRolloutStage('complete');
        setRolloutProgress(100);

        // Add newly simulated kernel patch to the history list!
        const newPatch: KernelPatchRecord = {
          id: `KB50499${Math.floor(Math.random() * 80 + 20)}`,
          cveId: `CVE-2026-${Math.floor(Math.random() * 3000 + 3500)}`,
          title: 'AegisNT Microkernel Page Table Isolation & Zero-Downtime Memory Barrier',
          subsystem: 'Microkernel Core',
          severity: 'Critical',
          kernelVersionFrom: '10.0.26100.1882-aegis',
          kernelVersionTo: '10.0.26100.1944-aegis',
          releasedDate: 'Just Now',
          deploymentDate: 'Just Now',
          nodesTargeted: 14928,
          nodesSuccessful: 14928,
          successRate: 100.0,
          avgPatchTimeMs: 1240,
          rebootsRequired: 0,
          status: '100% Deployed',
          sha256Hash: 'a891048bc89102834b908129048a1029381029481029481029384019283019aa',
          whqlCatalogId: 'WHQL-2026-LIVE-992104-ROLLOUT',
          tpmQuotePcr7: 'PCR-7: aa81920384bc910283401928340192834019283401928340',
          targetSymbol: 'ntoskrnl.exe!MmCheckKernelAddressRange',
          disassemblyBefore: [
            'ntoskrnl.exe+0x29140: 48 85 d2                   test   rdx, rdx',
            'ntoskrnl.exe+0x29143: 74 19                      jz     ntoskrnl.exe+0x2915e',
            'ntoskrnl.exe+0x29145: 48 8b 02                   mov    rax, [rdx]'
          ],
          disassemblyAfter: [
            'ntoskrnl.exe+0x29140: e9 82 14 02 00             jmp    kpatch_pti_memory_barrier_guard',
            'kpatch_pti_guard:   48 81 fa 00 00 00 80          cmp    rdx, 0x800000000000',
            'kpatch_pti_guard:   73 14                         jae    kpatch_pti_allow'
          ],
          clusterBreakdown: [
            { name: 'us-east-prod-k8s', nodes: 4280, successRate: 100.0 },
            { name: 'eu-west-hyperv-vdi', nodes: 3640, successRate: 100.0 },
            { name: 'ap-northeast-fintech', nodes: 2850, successRate: 100.0 },
            { name: 'us-govcloud-sovereign', nodes: 1920, successRate: 100.0 },
            { name: 'edge-retail-terminals', nodes: 2238, successRate: 100.0 }
          ]
        };

        setHistoryList((prev) => [newPatch, ...prev]);
        setSelectedRecordId(newPatch.id);
        setLiveSuccessfullyPatchedNodes(14928);
        setLivePendingNodes(0);
      }
    }, 240);
  };

  // Close rollout modal
  const handleCloseRollout = () => {
    setIsRolloutActive(false);
    setRolloutStage('idle');
    setRolloutProgress(0);
  };

  return (
    <div className="space-y-5">
      {/* ========================================================================= */}
      {/* 1. TOP FLEET TELEMETRY HEADER & LIVE STATUS RIBBON                        */}
      {/* ========================================================================= */}
      <div className="p-4 bg-gradient-to-r from-slate-900 via-slate-900/95 to-blue-950/40 border border-slate-800 rounded-xl relative overflow-hidden">
        {/* Subtle decorative glow */}
        <div className="absolute -top-12 -right-12 w-48 h-48 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-12 -left-12 w-48 h-48 bg-emerald-600/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2.5">
              <span className="p-1.5 bg-blue-500/10 border border-blue-500/30 text-blue-400 rounded-lg">
                <Activity className="w-4 h-4" />
              </span>
              <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
                AegisNT Fleet Hotpatch & Kernel Telemetry Dashboard
              </h3>
              <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald-950/80 border border-emerald-500/40 text-[10px] font-mono text-emerald-300 font-semibold">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                <span>LIVE TELEMETRY STREAMING</span>
              </div>
            </div>
            <p className="text-xs text-slate-400">
              Real-time monitoring across <strong>{liveActiveNodes.toLocaleString()}</strong> production microkernel nodes in 6 global cloud regions and edge rings. 0-reboot guarantee enforced.
            </p>
          </div>

          {/* Action buttons */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => setIsSimulatingLiveStream(!isSimulatingLiveStream)}
              className={`px-2.5 py-1.5 rounded text-xs font-semibold flex items-center gap-1.5 transition-all border ${
                isSimulatingLiveStream
                  ? 'bg-slate-800/80 border-slate-700 text-slate-200 hover:bg-slate-700'
                  : 'bg-amber-950/40 border-amber-600/50 text-amber-300'
              }`}
              title="Toggle Live Telemetry Heartbeat Stream"
            >
              <Radio className={`w-3.5 h-3.5 ${isSimulatingLiveStream ? 'text-emerald-400 animate-pulse' : 'text-slate-400'}`} />
              <span>{isSimulatingLiveStream ? 'Stream: Active (2.8s)' : 'Stream: Paused'}</span>
            </button>

            <button
              onClick={handleTriggerFleetRollout}
              disabled={isRolloutActive}
              className="px-3 py-1.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white rounded text-xs font-semibold flex items-center gap-1.5 shadow-md shadow-blue-900/30 transition-all disabled:opacity-50"
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              <span>Simulate Fleet Rollout</span>
            </button>

            <button
              onClick={() => {
                const report = JSON.stringify(
                  {
                    timestamp: new Date().toISOString(),
                    fleet: 'AegisNT Enterprise Production',
                    totalNodes: liveActiveNodes,
                    globalSuccessRate: `${liveSuccessRate}%`,
                    hotpatchedNodes: liveSuccessfullyPatchedNodes,
                    pendingNodes: livePendingNodes,
                    rebootsRequired: 0,
                    preventedDowntimeHours: 1248.5,
                    whqlCertStatus: 'VERIFIED_ACTIVE',
                    kernelPatchesApplied: historyList.map((h) => ({
                      id: h.id,
                      cve: h.cveId,
                      subsystem: h.subsystem,
                      successRate: `${h.successRate}%`,
                      sha256: h.sha256Hash
                    }))
                  },
                  null,
                  2
                );
                copyText(report, 'audit-json');
              }}
              className="px-2.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded text-xs font-semibold flex items-center gap-1.5 transition-colors"
            >
              {copiedId === 'audit-json' ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="text-emerald-400">Copied Audit!</span>
                </>
              ) : (
                <>
                  <Download className="w-3.5 h-3.5" />
                  <span>Export Fleet Audit</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Sub-navigation bar inside dashboard */}
        <div className="flex items-center gap-2 mt-4 pt-3 border-t border-slate-800/80 text-xs">
          {[
            { id: 'metrics', label: 'Fleet Success Rate & Metrics', icon: TrendingUp },
            { id: 'timeline', label: 'Kernel Patching History', icon: Clock, count: historyList.length },
            { id: 'clusters', label: 'Cluster Distribution (5 Regions)', icon: Server },
            { id: 'dmesg', label: 'Live kpatch Kernel Logs', icon: Terminal }
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTabSubView === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTabSubView(tab.id as any)}
                className={`px-3 py-1.5 rounded-lg font-semibold flex items-center gap-1.5 transition-all ${
                  isActive
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
                {tab.count !== undefined && (
                  <span className="px-1.5 py-0.2 rounded-full text-[10px] font-mono bg-blue-950 text-blue-300">
                    {tab.count}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 2. REAL-TIME METRICS & SUCCESS RATE KPI CARDS                             */}
      {/* ========================================================================= */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
        {/* KPI 1: Fleet Hotpatch Success Rate with circular meter */}
        <div className="p-4 bg-slate-900 border border-slate-800 rounded-xl relative overflow-hidden group hover:border-slate-700 transition-colors">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
            <span className="font-semibold uppercase tracking-wider text-[10px]">Fleet Hotpatch Rate</span>
            <span className="px-1.5 py-0.5 rounded font-mono text-[10px] bg-emerald-950 text-emerald-400 font-bold">
              0-REBOOT
            </span>
          </div>

          <div className="flex items-center gap-3">
            {/* Circular Gauge */}
            <div className="relative w-14 h-14 shrink-0 flex items-center justify-center">
              <svg className="w-14 h-14 -rotate-90" viewBox="0 0 36 36">
                <path
                  className="text-slate-800"
                  strokeWidth="3.2"
                  stroke="currentColor"
                  fill="none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
                <path
                  className="text-emerald-500 transition-all duration-700"
                  strokeDasharray={`${liveSuccessRate}, 100`}
                  strokeWidth="3.2"
                  strokeLinecap="round"
                  stroke="currentColor"
                  fill="none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
              </svg>
              <div className="absolute text-[11px] font-bold font-mono text-emerald-400">
                {liveSuccessRate}%
              </div>
            </div>

            <div className="space-y-0.5">
              <div className="text-xl font-extrabold text-slate-100 font-mono tracking-tight">
                {liveSuccessRate}%
              </div>
              <div className="text-[11px] text-slate-400">
                <strong className="text-emerald-400">{liveSuccessfullyPatchedNodes.toLocaleString()}</strong> / {liveActiveNodes.toLocaleString()} nodes
              </div>
              <div className="text-[10px] text-slate-500 font-mono">
                {livePendingNodes > 0 ? `${livePendingNodes} retrying quiescence` : 'All nodes in sync'}
              </div>
            </div>
          </div>
        </div>

        {/* KPI 2: Zero Downtime & Reboots Avoided */}
        <div className="p-4 bg-slate-900 border border-slate-800 rounded-xl relative overflow-hidden group hover:border-slate-700 transition-colors">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
            <span className="font-semibold uppercase tracking-wider text-[10px]">Downtime Prevented</span>
            <Zap className="w-3.5 h-3.5 text-amber-400" />
          </div>

          <div className="space-y-1">
            <div className="text-xl font-extrabold text-amber-400 font-mono tracking-tight">
              1,248.5 hrs
            </div>
            <div className="text-[11px] text-slate-300">
              Zero cluster maintenance windows required
            </div>
            <div className="text-[10px] text-slate-400 flex items-center justify-between pt-1 border-t border-slate-800/80">
              <span>Enterprise Cost Saved:</span>
              <span className="font-mono font-bold text-emerald-400">~$873,950</span>
            </div>
          </div>
        </div>

        {/* KPI 3: Mean Time to Patch (MTTP) */}
        <div className="p-4 bg-slate-900 border border-slate-800 rounded-xl relative overflow-hidden group hover:border-slate-700 transition-colors">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
            <span className="font-semibold uppercase tracking-wider text-[10px]">Avg In-Memory Latency</span>
            <Clock className="w-3.5 h-3.5 text-blue-400" />
          </div>

          <div className="space-y-1">
            <div className="text-xl font-extrabold text-blue-400 font-mono tracking-tight">
              1.38 sec
            </div>
            <div className="text-[11px] text-slate-300">
              Atomic thread quiescence & swap duration
            </div>
            <div className="text-[10px] text-slate-400 flex items-center justify-between pt-1 border-t border-slate-800/80">
              <span>Thread Pause Window:</span>
              <span className="font-mono font-bold text-slate-200">&lt; 0.72 ms</span>
            </div>
          </div>
        </div>

        {/* KPI 4: Authenticode & TPM 2.0 PCR Attestation */}
        <div className="p-4 bg-slate-900 border border-slate-800 rounded-xl relative overflow-hidden group hover:border-slate-700 transition-colors">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
            <span className="font-semibold uppercase tracking-wider text-[10px]">Integrity & PCR-7 Quote</span>
            <Lock className="w-3.5 h-3.5 text-emerald-400" />
          </div>

          <div className="space-y-1">
            <div className="text-xl font-extrabold text-emerald-400 font-mono tracking-tight flex items-center gap-1.5">
              <span>100% WHQL</span>
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
            </div>
            <div className="text-[11px] text-slate-300">
              Cryptographically verified by TPM 2.0
            </div>
            <div className="text-[10px] text-slate-400 flex items-center justify-between pt-1 border-t border-slate-800/80 font-mono">
              <span>VTL-1 Enclave:</span>
              <span className="text-emerald-400 font-bold">HVCI Enforced</span>
            </div>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 3. VIEW MODE CONTENT SWITCHER                                             */}
      {/* ========================================================================= */}

      {/* VIEW 1: REAL-TIME METRICS & 24-HOUR SUCCESS RATE GRAPH */}
      {activeTabSubView === 'metrics' && (
        <div className="space-y-4">
          {/* Visual 24-Hour Telemetry Graph Card */}
          <div className="p-4 bg-slate-900 border border-slate-800 rounded-xl space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <h4 className="text-xs font-bold text-slate-200 flex items-center gap-2">
                  <Activity className="w-4 h-4 text-blue-400" />
                  Real-Time 24-Hour Hotpatch Success Rate & Node Throughput
                </h4>
                <p className="text-[11px] text-slate-400">
                  Continuous telemetric sampling from AegisNT agent daemon across all active production clusters.
                </p>
              </div>
              <div className="flex items-center gap-3 text-[11px] font-mono">
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-sm bg-emerald-400 inline-block" />
                  <span className="text-slate-300">Success Rate (99.8% - 100%)</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-sm bg-blue-500/60 inline-block" />
                  <span className="text-slate-300">Nodes Patched / Hr</span>
                </div>
              </div>
            </div>

            {/* SVG Visual Chart */}
            <div className="bg-slate-950 p-4 rounded-lg border border-slate-800/90 space-y-2">
              <div className="h-44 w-full relative">
                {/* SVG Visual */}
                <svg className="w-full h-full" viewBox="0 0 600 140" preserveAspectRatio="none">
                  <defs>
                    <linearGradient id="areaGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                      <stop offset="0%" stopColor="#10b981" stopOpacity="0.35" />
                      <stop offset="100%" stopColor="#10b981" stopOpacity="0.0" />
                    </linearGradient>
                    <linearGradient id="barGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                      <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.6" />
                      <stop offset="100%" stopColor="#1d4ed8" stopOpacity="0.2" />
                    </linearGradient>
                  </defs>

                  {/* Horizontal Grid lines */}
                  <line x1="0" y1="20" x2="600" y2="20" stroke="#1e293b" strokeDasharray="3 3" />
                  <line x1="0" y1="60" x2="600" y2="60" stroke="#1e293b" strokeDasharray="3 3" />
                  <line x1="0" y1="100" x2="600" y2="100" stroke="#1e293b" strokeDasharray="3 3" />

                  {/* Bar throughputs in background */}
                  {HOURLY_TELEMETRY.map((d, i) => {
                    const x = i * 50 + 20;
                    const maxThroughput = 2200;
                    const barHeight = (d.throughput / maxThroughput) * 90;
                    const y = 130 - barHeight;
                    return (
                      <rect
                        key={`bar-${i}`}
                        x={x}
                        y={y}
                        width="18"
                        height={barHeight}
                        rx="2"
                        fill="url(#barGradient)"
                        className="transition-all hover:opacity-100 opacity-80"
                      />
                    );
                  })}

                  {/* Success Rate Area Fill */}
                  <path
                    d={`M 20 130 ${HOURLY_TELEMETRY.map((d, i) => {
                      const x = i * 50 + 29;
                      // map 99.80 -> 100.00 to y 80 -> 25
                      const normalized = (d.successRate - 99.8) / 0.2;
                      const y = 70 - normalized * 45;
                      return `L ${x} ${y}`;
                    }).join(' ')} L 570 130 Z`}
                    fill="url(#areaGradient)"
                  />

                  {/* Success Rate Line */}
                  <path
                    d={`M ${HOURLY_TELEMETRY.map((d, i) => {
                      const x = i * 50 + 29;
                      const normalized = (d.successRate - 99.8) / 0.2;
                      const y = 70 - normalized * 45;
                      return `${i === 0 ? '' : 'L'} ${x} ${y}`;
                    }).join(' ')}`}
                    fill="none"
                    stroke="#10b981"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                  />

                  {/* Data Points */}
                  {HOURLY_TELEMETRY.map((d, i) => {
                    const x = i * 50 + 29;
                    const normalized = (d.successRate - 99.8) / 0.2;
                    const y = 70 - normalized * 45;
                    return (
                      <circle
                        key={`pt-${i}`}
                        cx={x}
                        cy={y}
                        r="3"
                        fill="#059669"
                        stroke="#ecfdf5"
                        strokeWidth="1.5"
                        className="hover:r-4 transition-all cursor-pointer"
                      />
                    );
                  })}
                </svg>
              </div>

              {/* X Axis Time Labels */}
              <div className="flex justify-between px-2 text-[10px] font-mono text-slate-500 border-t border-slate-800/80 pt-1.5">
                {HOURLY_TELEMETRY.map((d) => (
                  <span key={d.hour}>{d.hour}</span>
                ))}
              </div>
            </div>

            {/* Subsystem Coverage Breakdown */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-1">
              <div className="p-3 bg-slate-950 rounded-lg border border-slate-800/80 space-y-1.5">
                <div className="flex items-center justify-between text-xs font-semibold text-slate-200">
                  <span>Microkernel Core (ntoskrnl.exe)</span>
                  <span className="font-mono text-emerald-400">100.0%</span>
                </div>
                <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                  <div className="bg-emerald-500 h-full rounded-full" style={{ width: '100%' }} />
                </div>
                <div className="text-[10px] text-slate-500 font-mono">
                  14,928 / 14,928 nodes &bull; Trampoline JMP active
                </div>
              </div>

              <div className="p-3 bg-slate-950 rounded-lg border border-slate-800/80 space-y-1.5">
                <div className="flex items-center justify-between text-xs font-semibold text-slate-200">
                  <span>Wine NTDLL & Ring 3 Sandbox</span>
                  <span className="font-mono text-emerald-400">99.93%</span>
                </div>
                <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                  <div className="bg-emerald-500 h-full rounded-full" style={{ width: '99.93%' }} />
                </div>
                <div className="text-[10px] text-slate-500 font-mono">
                  14,918 / 14,928 nodes &bull; Bubblewrap filter attached
                </div>
              </div>

              <div className="p-3 bg-slate-950 rounded-lg border border-slate-800/80 space-y-1.5">
                <div className="flex items-center justify-between text-xs font-semibold text-slate-200">
                  <span>Hypervisor VTL-1 Memory Enclave</span>
                  <span className="font-mono text-emerald-400">100.0%</span>
                </div>
                <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                  <div className="bg-emerald-500 h-full rounded-full" style={{ width: '100%' }} />
                </div>
                <div className="text-[10px] text-slate-500 font-mono">
                  14,928 / 14,928 nodes &bull; HVCI hardware secured
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* VIEW 2: KERNEL PATCHING HISTORY TIMELINE & ACCORDION INSPECTOR */}
      {(activeTabSubView === 'timeline' || activeTabSubView === 'metrics') && (
        <div className="p-4 bg-slate-900 border border-slate-800 rounded-xl space-y-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
            <div>
              <h4 className="text-xs font-bold text-slate-200 flex items-center gap-2">
                <Clock className="w-4 h-4 text-blue-400" />
                AegisNT Fleet Kernel Patching History & Audit Log
              </h4>
              <p className="text-[11px] text-slate-400">
                Immutable ledger of all live in-memory microkernel updates, CVE mitigations, and Authenticode signatures.
              </p>
            </div>

            {/* Filter and Search Bar */}
            <div className="flex flex-wrap items-center gap-2">
              <div className="relative">
                <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search KB, CVE, symbol..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-8 pr-2.5 py-1 text-xs bg-slate-950 border border-slate-800 rounded text-slate-200 placeholder-slate-500 focus:outline-none focus:border-blue-500 w-44"
                />
              </div>

              {/* Subsystem Filter */}
              <select
                value={selectedSubsystem}
                onChange={(e) => setSelectedSubsystem(e.target.value)}
                className="px-2 py-1 text-xs bg-slate-950 border border-slate-800 rounded text-slate-300 focus:outline-none focus:border-blue-500"
              >
                <option value="All">All Subsystems</option>
                <option value="Microkernel Core">Microkernel Core</option>
                <option value="Memory / SLAB">Memory / SLAB</option>
                <option value="Hypervisor VTL-1">Hypervisor VTL-1</option>
                <option value="TCP/IP & eBPF">TCP/IP & eBPF</option>
                <option value="Wine NTDLL Subsystem">Wine NTDLL Subsystem</option>
              </select>

              {/* Severity Filter */}
              <select
                value={selectedSeverity}
                onChange={(e) => setSelectedSeverity(e.target.value)}
                className="px-2 py-1 text-xs bg-slate-950 border border-slate-800 rounded text-slate-300 focus:outline-none focus:border-blue-500"
              >
                <option value="All">All Severities</option>
                <option value="Critical">Critical</option>
                <option value="Important">Important</option>
                <option value="Moderate">Moderate</option>
              </select>
            </div>
          </div>

          {/* History List */}
          <div className="space-y-2">
            {filteredHistory.length === 0 ? (
              <div className="p-6 text-center text-xs text-slate-500 bg-slate-950 rounded border border-slate-800">
                No kernel patches match the specified criteria.
              </div>
            ) : (
              filteredHistory.map((patch) => {
                const isSelected = selectedRecordId === patch.id;
                return (
                  <div
                    key={patch.id}
                    className={`rounded-lg border transition-all ${
                      isSelected
                        ? 'bg-slate-950 border-blue-500/50 shadow-md shadow-blue-950/20'
                        : 'bg-slate-950/70 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    {/* Header Row */}
                    <div
                      onClick={() => setSelectedRecordId(isSelected ? null : patch.id)}
                      className="p-3.5 flex flex-col md:flex-row md:items-center justify-between gap-3 cursor-pointer"
                    >
                      <div className="flex items-start md:items-center gap-3">
                        <button className="text-slate-400 hover:text-slate-200 mt-0.5 md:mt-0">
                          {isSelected ? (
                            <ChevronDown className="w-4 h-4 text-blue-400" />
                          ) : (
                            <ChevronRight className="w-4 h-4" />
                          )}
                        </button>

                        <div className="space-y-0.5">
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="font-bold font-mono text-slate-100 text-xs">
                              {patch.id}
                            </span>
                            <span className="px-1.5 py-0.5 rounded text-[10px] font-mono bg-blue-950/90 text-blue-300 font-bold border border-blue-800/40">
                              {patch.cveId}
                            </span>
                            <span
                              className={`px-1.5 py-0.5 rounded text-[10px] font-mono font-bold ${
                                patch.severity === 'Critical'
                                  ? 'bg-rose-950 text-rose-300 border border-rose-800/40'
                                  : patch.severity === 'Important'
                                  ? 'bg-amber-950 text-amber-300 border border-amber-800/40'
                                  : 'bg-slate-800 text-slate-300'
                              }`}
                            >
                              {patch.severity}
                            </span>
                            <span className="text-[11px] text-slate-400 font-medium">
                              {patch.subsystem}
                            </span>
                          </div>
                          <div className="text-xs text-slate-300 font-medium">
                            {patch.title}
                          </div>
                        </div>
                      </div>

                      {/* Right metadata badge */}
                      <div className="flex items-center gap-4 text-xs font-mono shrink-0 pl-7 md:pl-0">
                        <div className="text-right">
                          <div className="flex items-center gap-1.5 justify-end">
                            <span className="font-bold text-emerald-400">
                              {patch.successRate}% Success
                            </span>
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                          </div>
                          <div className="text-[10px] text-slate-400">
                            {patch.nodesSuccessful.toLocaleString()} / {patch.nodesTargeted.toLocaleString()} nodes
                          </div>
                        </div>

                        <div className="text-right hidden sm:block">
                          <div className="text-[11px] text-slate-300 font-semibold">
                            {patch.deploymentDate}
                          </div>
                          <div className="text-[10px] text-slate-500">
                            Avg: {patch.avgPatchTimeMs}ms &bull; 0 Reboots
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Expandable Technical Telemetry & Disassembly View */}
                    {isSelected && (
                      <div className="p-4 border-t border-slate-800/80 bg-slate-950/90 space-y-4 text-xs">
                        {/* Subsystem & Version Shift */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5 p-3 bg-slate-900 rounded-lg border border-slate-800 text-[11px]">
                          <div>
                            <span className="text-slate-400 block text-[10px] uppercase font-mono">Kernel Shift:</span>
                            <span className="font-mono text-slate-200">
                              {patch.kernelVersionFrom} &rarr;{' '}
                              <strong className="text-emerald-400">{patch.kernelVersionTo}</strong>
                            </span>
                          </div>
                          <div>
                            <span className="text-slate-400 block text-[10px] uppercase font-mono">Target Symbol:</span>
                            <span className="font-mono text-blue-400">{patch.targetSymbol}</span>
                          </div>
                          <div>
                            <span className="text-slate-400 block text-[10px] uppercase font-mono">WHQL Digest:</span>
                            <span className="font-mono text-slate-300">{patch.whqlCatalogId}</span>
                          </div>
                          <div>
                            <span className="text-slate-400 block text-[10px] uppercase font-mono">TPM 2.0 Quote:</span>
                            <span className="font-mono text-emerald-400 truncate block" title={patch.tpmQuotePcr7}>
                              {patch.tpmQuotePcr7.substring(0, 24)}...
                            </span>
                          </div>
                        </div>

                        {/* In-Memory Disassembly Diff Inspector */}
                        <div className="space-y-1.5">
                          <div className="flex items-center justify-between text-xs font-semibold text-slate-300">
                            <span className="flex items-center gap-1.5 font-mono text-[11px]">
                              <Terminal className="w-3.5 h-3.5 text-blue-400" />
                              Microkernel In-Memory Opcode Trampoline Diff (kpatch.sys)
                            </span>
                            <span className="text-[10px] font-mono text-slate-400">
                              Zero instruction fault &bull; Thread-safe replacement
                            </span>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-[10px] font-mono">
                            {/* Before */}
                            <div className="p-3 bg-rose-950/20 border border-rose-900/40 rounded-lg space-y-1">
                              <div className="text-rose-400 font-bold pb-1 border-b border-rose-900/40 flex items-center justify-between">
                                <span>[Original Vulnerable Code]</span>
                                <span className="text-[9px] uppercase px-1 py-0.2 bg-rose-950 rounded">Vulnerable</span>
                              </div>
                              {patch.disassemblyBefore.map((line, idx) => (
                                <div key={idx} className="text-rose-200/90 leading-relaxed">
                                  {line}
                                </div>
                              ))}
                            </div>

                            {/* After */}
                            <div className="p-3 bg-emerald-950/20 border border-emerald-900/40 rounded-lg space-y-1">
                              <div className="text-emerald-400 font-bold pb-1 border-b border-emerald-900/40 flex items-center justify-between">
                                <span>[Live Hotpatched JMP Trampoline]</span>
                                <span className="text-[9px] uppercase px-1 py-0.2 bg-emerald-950 rounded">0-Reboot Protected</span>
                              </div>
                              {patch.disassemblyAfter.map((line, idx) => (
                                <div key={idx} className="text-emerald-300 leading-relaxed font-semibold">
                                  {line}
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>

                        {/* Cluster Breakdown Bars */}
                        <div className="space-y-2 pt-1">
                          <div className="text-xs font-semibold text-slate-300">
                            Cluster Rollout Distribution Across Regions:
                          </div>
                          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-2">
                            {patch.clusterBreakdown.map((cluster) => (
                              <div
                                key={cluster.name}
                                className="p-2.5 bg-slate-900 rounded border border-slate-800 text-[11px] space-y-1"
                              >
                                <div className="flex items-center justify-between text-slate-300 font-medium">
                                  <span className="truncate" title={cluster.name}>
                                    {cluster.name}
                                  </span>
                                  <span className="font-mono text-emerald-400 font-bold">
                                    {cluster.successRate}%
                                  </span>
                                </div>
                                <div className="w-full bg-slate-800 h-1 rounded-full overflow-hidden">
                                  <div
                                    className="bg-emerald-400 h-full rounded-full"
                                    style={{ width: `${cluster.successRate}%` }}
                                  />
                                </div>
                                <div className="text-[10px] text-slate-400 font-mono">
                                  {cluster.nodes.toLocaleString()} nodes
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Footer action */}
                        <div className="flex items-center justify-between pt-2 border-t border-slate-800/80 text-[11px]">
                          <span className="text-slate-400 font-mono">
                            SHA-256: {patch.sha256Hash}
                          </span>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              copyText(patch.sha256Hash, patch.id);
                            }}
                            className="px-2 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded flex items-center gap-1 transition-colors"
                          >
                            {copiedId === patch.id ? (
                              <Check className="w-3 h-3 text-emerald-400" />
                            ) : (
                              <Copy className="w-3 h-3" />
                            )}
                            <span>Copy SHA-256 Digest</span>
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}

      {/* VIEW 3: CLUSTER DISTRIBUTION (5 PRODUCTION REGIONS) */}
      {activeTabSubView === 'clusters' && (
        <div className="p-4 bg-slate-900 border border-slate-800 rounded-xl space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-xs font-bold text-slate-200 flex items-center gap-2">
                <Server className="w-4 h-4 text-blue-400" />
                AegisNT Multi-Cluster Fleet Health & Kernel Alignment
              </h4>
              <p className="text-[11px] text-slate-400">
                Detailed live status of all 5 major production datacenters and edge deployments.
              </p>
            </div>
            <span className="text-xs font-mono text-emerald-400 bg-emerald-950 px-2 py-0.5 rounded border border-emerald-800/40">
              5/5 Clusters Healthy
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
            {[
              {
                id: 'us-east-prod-k8s',
                title: 'US-East Kubernetes Production',
                region: 'Virginia (us-east-1)',
                nodes: 4280,
                successRate: 99.98,
                kernel: 'NT 10.0.26100.1882-aegis',
                status: 'Optimal',
                uptime: '142 days 0 reboots',
                workload: 'High-Throughput Web & API Microservices'
              },
              {
                id: 'eu-west-hyperv-vdi',
                title: 'EU-West Hyper-V & Kasm VDI',
                region: 'Frankfurt (eu-central-1)',
                nodes: 3640,
                successRate: 99.85,
                kernel: 'NT 10.0.26100.1882-aegis',
                status: 'Optimal',
                uptime: '98 days 0 reboots',
                workload: 'Interactive Windows Desktop Virtualization'
              },
              {
                id: 'ap-northeast-fintech',
                title: 'AP-Northeast Low-Latency Cluster',
                region: 'Tokyo (ap-northeast-1)',
                nodes: 2850,
                successRate: 100.0,
                kernel: 'NT 10.0.26100.1882-aegis',
                status: 'Optimal',
                uptime: '210 days 0 reboots',
                workload: 'Financial Order Matching (sub-350ns tickless)'
              },
              {
                id: 'us-govcloud-sovereign',
                title: 'US GovCloud Sovereign Enclave',
                region: 'Gov-West (FedRAMP High)',
                nodes: 1920,
                successRate: 100.0,
                kernel: 'NT 10.0.26100.1882-aegis',
                status: 'Optimal',
                uptime: '180 days 0 reboots',
                workload: 'Air-Gapped Classified Data Workloads'
              },
              {
                id: 'edge-retail-terminals',
                title: 'Edge Retail & Branch Terminals',
                region: 'Global Edge (2,200 Locations)',
                nodes: 2238,
                successRate: 99.64,
                kernel: 'NT 10.0.26100.1882-aegis',
                status: 'Optimal',
                uptime: '64 days 0 reboots',
                workload: 'Distributed Point-of-Sale / Thin Clients'
              }
            ].map((cl) => (
              <div
                key={cl.id}
                className="p-4 bg-slate-950 rounded-lg border border-slate-800 space-y-3 flex flex-col justify-between hover:border-slate-700 transition-colors"
              >
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-100 text-xs">{cl.title}</span>
                    <span className="px-1.5 py-0.5 rounded text-[10px] font-mono font-bold bg-emerald-950 text-emerald-400 border border-emerald-800/40">
                      {cl.successRate}% Success
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-400 flex items-center gap-1">
                    <Globe className="w-3 h-3 text-slate-500" />
                    <span>{cl.region}</span>
                  </div>
                  <p className="text-[11px] text-slate-400 line-clamp-1">{cl.workload}</p>
                </div>

                <div className="pt-2 border-t border-slate-800/80 space-y-1.5 text-[11px] font-mono">
                  <div className="flex justify-between text-slate-400">
                    <span>Nodes:</span>
                    <strong className="text-slate-200">{cl.nodes.toLocaleString()} active</strong>
                  </div>
                  <div className="flex justify-between text-slate-400">
                    <span>Kernel:</span>
                    <span className="text-blue-400 font-bold">{cl.kernel}</span>
                  </div>
                  <div className="flex justify-between text-slate-400">
                    <span>Uptime:</span>
                    <span className="text-emerald-400">{cl.uptime}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* VIEW 4: LIVE DMESG / KPATCH LOG CONSOLE */}
      {activeTabSubView === 'dmesg' && (
        <div className="p-4 bg-slate-900 border border-slate-800 rounded-xl space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h4 className="text-xs font-bold text-slate-200 flex items-center gap-2">
                <Terminal className="w-4 h-4 text-emerald-400" />
                Live Kernel Ring Buffer & Hotpatch Dmesg Stream
              </h4>
              <p className="text-[11px] text-slate-400">
                Direct interception from <code>/sys/kernel/debug/kpatch/aegis_nt</code> and Windows Kernel Event Tracing (ETW).
              </p>
            </div>

            <div className="flex items-center gap-2">
              {(['all', 'hotpatch', 'pcr', 'security'] as const).map((filter) => (
                <button
                  key={filter}
                  onClick={() => setActiveDmesgFilter(filter)}
                  className={`px-2 py-1 text-[10px] font-mono rounded font-bold uppercase transition-all ${
                    activeDmesgFilter === filter
                      ? 'bg-blue-600 text-white'
                      : 'bg-slate-950 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {filter}
                </button>
              ))}
            </div>
          </div>

          <div className="p-3 bg-slate-950 rounded-lg border border-slate-800 font-mono text-[11px] space-y-1 h-56 overflow-y-auto scrollbar-thin text-slate-300">
            <div className="text-slate-500">[ 0.000000] AegisNT 64-bit Microkernel v10.0.26100.1882 initialized. NO_HZ_FULL tickless active.</div>
            <div className="text-slate-500">[ 0.001420] kpatch: module live-patching infrastructure loaded (ftrace handler initialized).</div>
            <div className="text-emerald-400">[ 142.102910] kpatch: [KB5044284] patching symbol &apos;ntoskrnl.exe!KeSynchronizeExecution&apos; with atomic jmp detour...</div>
            <div className="text-emerald-300">[ 142.103320] kpatch: thread quiescence reached across all 32 hardware threads in 0.41ms. Swap committed.</div>
            <div className="text-blue-400">[ 142.103510] tpm2: PCR-7 successfully extended with Authenticode digest [WHQL-2026-SEC-884102-NT11].</div>
            <div className="text-slate-400">[ 142.104000] vtl1: Hypervisor-Protected Code Integrity verified zero unauthenticated code pages in kernel space.</div>
            <div className="text-emerald-400">[ 512.902100] kpatch: [KB5043076] applied Wine NTDLL sandbox hardening filter to 14,918 nodes cleanly.</div>
            <div className="text-slate-400">[ 820.104200] aegis-agent: cluster health beacon acknowledged from us-east-prod-k8s (4,280/4,280 nodes healthy).</div>
            <div className="text-emerald-400">[1240.891200] kpatch: zero reboots required. 100% of fleet applications preserved in memory without disconnection.</div>
            <div className="text-blue-400">[1240.892000] audit: compliance certificate generated (ISO 27001 / SOC 2 Type II Hotpatching Conformance).</div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 4. MODAL: SIMULATE FLEET HOTPATCH ROLLOUT INTERACTION                     */}
      {/* ========================================================================= */}
      {isRolloutActive && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="w-full max-w-lg bg-slate-900 border border-slate-800 rounded-xl shadow-2xl p-5 space-y-4 text-slate-100">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <span className="p-1.5 bg-blue-500/10 border border-blue-500/30 text-blue-400 rounded-lg">
                  <Play className="w-4 h-4 fill-current" />
                </span>
                <div>
                  <h3 className="text-sm font-bold text-slate-100">
                    AegisNT Fleet Zero-Reboot Rollout Simulator
                  </h3>
                  <div className="text-[10px] text-slate-400 font-mono">
                    Target: All 14,928 Fleet Nodes &bull; Hotpatch kpatch.sys
                  </div>
                </div>
              </div>
              {rolloutStage === 'complete' && (
                <button
                  onClick={handleCloseRollout}
                  className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded text-xs font-semibold"
                >
                  Close
                </button>
              )}
            </div>

            {/* Live Progress Bar */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs font-semibold">
                <span className="text-slate-300 capitalize">
                  Stage: <strong>{rolloutStage}</strong>
                </span>
                <span className="text-emerald-400 font-mono">{rolloutProgress}%</span>
              </div>
              <div className="w-full bg-slate-950 h-2.5 rounded-full overflow-hidden border border-slate-800">
                <div
                  className="bg-gradient-to-r from-blue-500 via-indigo-500 to-emerald-400 h-full rounded-full transition-all duration-300"
                  style={{ width: `${rolloutProgress}%` }}
                />
              </div>
            </div>

            {/* Stage Steps */}
            <div className="space-y-2 text-xs">
              {[
                { stage: 'validating', label: '1. WHQL & Authenticode Hash Validation', desc: 'Checking certificate chain & TPM PCR-7 quote' },
                { stage: 'staging', label: '2. Staging OCI Hotpatch Payload to Registries', desc: 'Distributing binary delta across 6 cluster edge nodes' },
                { stage: 'quiescence', label: '3. Atomic Microkernel Thread Quiescence', desc: 'Pausing active worker threads (< 0.7ms window)' },
                { stage: 'injecting', label: '4. Memory JMP Trampoline Injection', desc: 'Rewriting ntoskrnl opcode via ftrace / text_poke_bp' },
                { stage: 'verifying', label: '5. Post-Patch Integrity & Hypervisor Check', desc: 'Validating VTL-1 enclave state & memory barriers' }
              ].map((step, idx) => {
                const isPassed =
                  (step.stage === 'validating' && rolloutProgress >= 20) ||
                  (step.stage === 'staging' && rolloutProgress >= 40) ||
                  (step.stage === 'quiescence' && rolloutProgress >= 65) ||
                  (step.stage === 'injecting' && rolloutProgress >= 85) ||
                  (step.stage === 'verifying' && rolloutProgress >= 100);

                const isCurrent = rolloutStage === step.stage;

                return (
                  <div
                    key={step.stage}
                    className={`p-2.5 rounded-lg border flex items-center justify-between transition-all ${
                      isPassed
                        ? 'bg-emerald-950/20 border-emerald-800/40 text-emerald-300'
                        : isCurrent
                        ? 'bg-blue-950/40 border-blue-600/50 text-blue-200'
                        : 'bg-slate-950/40 border-slate-800/80 text-slate-500'
                    }`}
                  >
                    <div>
                      <div className="font-semibold text-[11px]">{step.label}</div>
                      <div className="text-[10px] opacity-80">{step.desc}</div>
                    </div>
                    {isPassed ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    ) : isCurrent ? (
                      <RefreshCw className="w-4 h-4 text-blue-400 animate-spin shrink-0" />
                    ) : (
                      <div className="w-4 h-4 rounded-full border border-slate-700 shrink-0" />
                    )}
                  </div>
                );
              })}
            </div>

            {/* Active Node Ticker */}
            <div className="p-2.5 bg-slate-950 rounded border border-slate-800 text-[10px] font-mono flex items-center justify-between text-slate-400">
              <span>Patching node:</span>
              <span className="text-emerald-400 font-bold">{rolloutCurrentNode}</span>
            </div>

            {rolloutStage === 'complete' && (
              <div className="p-3 bg-emerald-950/60 border border-emerald-500/50 rounded-lg text-xs font-semibold text-emerald-300 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>Fleet rollout complete! 14,928 nodes successfully patched with 0 reboots.</span>
                </div>
                <button
                  onClick={handleCloseRollout}
                  className="px-3 py-1 bg-emerald-600 hover:bg-emerald-500 text-white rounded font-bold text-xs"
                >
                  Done
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
