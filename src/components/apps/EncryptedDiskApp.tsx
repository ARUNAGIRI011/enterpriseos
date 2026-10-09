import React, { useState } from 'react';
import {
  Lock,
  Unlock,
  Key,
  ShieldCheck,
  HardDrive,
  Cpu,
  RefreshCw,
  Eye,
  EyeOff,
  CheckCircle,
  AlertTriangle,
  Zap,
  Download
} from 'lucide-react';
import { KernelEngine } from '../../services/kernelEngine';
import { DiskPartition } from '../../types/os';

export default function EncryptedDiskApp() {
  const engine = KernelEngine.getInstance();
  const [partitions, setPartitions] = useState<DiskPartition[]>(engine.partitions);
  const [selectedPartition, setSelectedPartition] = useState<DiskPartition>(engine.partitions[0]);
  const [showRecoveryKey, setShowRecoveryKey] = useState(false);
  const [benchmarking, setBenchmarking] = useState(false);
  const [benchSpeed, setBenchSpeed] = useState<number | null>(7840); // MB/s

  const handleToggleLock = (part: DiskPartition) => {
    const updated = partitions.map(p => {
      if (p.id === part.id) {
        const nextStatus = p.status === 'Unlocked' ? 'Locked' : 'Unlocked';
        return { ...p, status: nextStatus as any };
      }
      return p;
    });
    setPartitions(updated);
    engine.partitions = updated;
    if (selectedPartition.id === part.id) {
      setSelectedPartition(updated.find(p => p.id === part.id)!);
    }
  };

  const handleRunAesBenchmark = () => {
    setBenchmarking(true);
    setTimeout(() => {
      setBenchSpeed(Math.floor(7700 + Math.random() * 400));
      setBenchmarking(false);
    }, 1000);
  };

  return (
    <div className="flex flex-col h-full bg-slate-950 text-slate-100 font-sans select-text">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-2.5 bg-slate-900 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div className="p-1.5 bg-amber-600/20 text-amber-400 rounded border border-amber-500/30">
            <Lock className="w-5 h-5" />
          </div>
          <div>
            <div className="font-semibold text-sm flex items-center gap-2">
              BitLocker & Aegis-FVE Encrypted Disk Partition Manager
              <span className="px-2 py-0.5 text-[10px] font-mono bg-amber-950 border border-amber-600/50 text-amber-300 rounded-full font-bold">
                TPM 2.0 SEALED
              </span>
            </div>
            <div className="text-[11px] text-slate-400">
              Transparent volume encryption with hardware AES-XTS-256 and PCR 7 integrity validation
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleRunAesBenchmark}
            disabled={benchmarking}
            className="flex items-center gap-1.5 px-3 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded text-xs font-semibold"
          >
            <Zap className="w-3.5 h-3.5 text-amber-400" />
            {benchmarking ? 'Testing...' : 'Benchmark AES-NI Speed'}
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 max-w-5xl mx-auto">
        {/* TPM 2.0 Security Banner */}
        <div className="p-3.5 bg-emerald-950/30 border border-emerald-600/40 rounded-lg flex items-center justify-between">
          <div className="flex items-center gap-3">
            <ShieldCheck className="w-5 h-5 text-emerald-400" />
            <div>
              <div className="text-xs font-bold text-emerald-300">Hardware TPM 2.0 Security Module: Active & Healthy</div>
              <div className="text-[11px] text-slate-400">
                PCR 7 (Secure Boot Signature Database) & PCR 11 (BitLocker Policy) match sealed hash.
              </div>
            </div>
          </div>
          {benchSpeed && (
            <div className="text-right font-mono text-xs">
              <span className="text-slate-400 text-[10px] block">AES-XTS-256 HARDWARE THROUGHPUT</span>
              <span className="text-emerald-400 font-bold text-sm">{(benchSpeed / 1024).toFixed(2)} GB/s</span>
            </div>
          )}
        </div>

        {/* Partitions List */}
        <div className="space-y-3">
          <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
            Protected Disk Partitions & Volumes
          </div>

          <div className="grid grid-cols-1 gap-3">
            {partitions.map((part) => {
              const isSelected = selectedPartition.id === part.id;
              const usedPercent = Math.round((part.usedGb / part.totalGb) * 100);

              return (
                <div
                  key={part.id}
                  onClick={() => setSelectedPartition(part)}
                  className={`p-4 rounded-lg border cursor-pointer transition-all ${
                    isSelected
                      ? 'bg-slate-900 border-amber-500 ring-1 ring-amber-500'
                      : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded ${part.status === 'Unlocked' ? 'bg-emerald-950 text-emerald-400' : 'bg-rose-950 text-rose-400'}`}>
                        {part.status === 'Unlocked' ? <Unlock className="w-5 h-5" /> : <Lock className="w-5 h-5" />}
                      </div>
                      <div>
                        <div className="font-bold text-sm text-slate-100 flex items-center gap-2">
                          <span>{part.mountPoint} ({part.label})</span>
                          <span className="px-2 py-0.5 text-[10px] rounded font-mono bg-slate-800 text-slate-300">
                            {part.filesystem}
                          </span>
                          <span className={`px-2 py-0.5 text-[10px] rounded font-mono font-bold ${
                            part.status === 'Unlocked' ? 'bg-emerald-900/70 text-emerald-300' : 'bg-rose-900/70 text-rose-300'
                          }`}>
                            {part.status}
                          </span>
                        </div>
                        <div className="text-xs text-slate-400 mt-1 flex items-center gap-3 font-mono">
                          <span>Algorithm: {part.encryptionAlgorithm}</span>
                          <span>TPM Auto-Unlock: {part.tpmLocked ? 'Enabled' : 'Disabled'}</span>
                          <span>Capacity: {part.usedGb} GB / {part.totalGb} GB</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleToggleLock(part);
                        }}
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-semibold border transition-all ${
                          part.status === 'Unlocked'
                            ? 'bg-rose-950/50 border-rose-700 text-rose-300 hover:bg-rose-900'
                            : 'bg-emerald-950/50 border-emerald-700 text-emerald-300 hover:bg-emerald-900'
                        }`}
                      >
                        {part.status === 'Unlocked' ? <Lock className="w-3.5 h-3.5" /> : <Unlock className="w-3.5 h-3.5" />}
                        {part.status === 'Unlocked' ? 'Lock Volume' : 'Unlock Volume'}
                      </button>
                    </div>
                  </div>

                  {/* Volume Space Bar */}
                  <div className="w-full bg-slate-950 rounded-full h-1.5 mt-3 overflow-hidden border border-slate-800">
                    <div
                      className={`h-full rounded-full ${usedPercent > 80 ? 'bg-rose-500' : 'bg-amber-500'}`}
                      style={{ width: `${usedPercent}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Selected Partition Detailed Security Settings */}
        <div className="p-4 bg-slate-900 border border-slate-800 rounded-lg space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div>
              <h3 className="font-bold text-sm text-amber-300">
                Volume Cryptographic Key Management ({selectedPartition.mountPoint})
              </h3>
              <p className="text-xs text-slate-400">Enterprise recovery keys and TPM platform configuration registers</p>
            </div>
            <button
              onClick={() => setShowRecoveryKey(!showRecoveryKey)}
              className="flex items-center gap-1.5 px-3 py-1 text-xs bg-slate-800 hover:bg-slate-700 text-slate-300 rounded border border-slate-700"
            >
              {showRecoveryKey ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
              {showRecoveryKey ? 'Hide Recovery Key' : 'Reveal Recovery Key'}
            </button>
          </div>

          <div className="grid grid-cols-2 gap-4 text-xs font-mono">
            <div className="bg-slate-950 p-3 rounded border border-slate-800 space-y-2">
              <div className="text-slate-400">Recovery Password Identifier:</div>
              <div className="text-amber-400 font-bold">{selectedPartition.recoveryKeyId}</div>

              <div className="text-slate-400 pt-2">48-Digit Numerical Password:</div>
              <div className="text-slate-200">
                {showRecoveryKey ? '489120-771923-019284-882319-551029-712839-991204-118239' : '••••••••-••••••••-••••••••-••••••••-••••••••'}
              </div>
            </div>

            <div className="bg-slate-950 p-3 rounded border border-slate-800 space-y-2 text-slate-300">
              <div>TPM Hardware Version: 2.0 (TCG Algorithm: SHA256)</div>
              <div>Master Key Cipher: AES-XTS with 512-bit key schedule</div>
              <div>DMA Attack Protection: Kernel DMA Protection (HAL Active)</div>
              <div>Drive Wear Leveling: Crypto-Erase TRIM Enabled</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
