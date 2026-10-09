import React, { useState } from 'react';
import { Terminal, X, CornerDownLeft } from 'lucide-react';

interface RunDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onExecuteCommand: (cmd: string) => void;
}

export default function RunDialog({ isOpen, onClose, onExecuteCommand }: RunDialogProps) {
  const [command, setCommand] = useState('taskmgr');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!command.trim()) return;
    onExecuteCommand(command.trim());
    onClose();
  };

  const PRESETS = [
    { name: 'guidance', label: 'Win 11 Desktop Guidance' },
    { name: 'compat', label: 'App Compatibility (Java, .NET, Win32)' },
    { name: 'java', label: 'Java JVM Subsystem' },
    { name: 'dotnet', label: '.NET 9 CoreCLR Subsystem' },
    { name: 'github', label: 'GitHub & Windows Preview' },
    { name: 'security', label: 'Enterprise Security & Defender' },
    { name: 'firewall', label: 'Stateful Firewall & Gateway' },
    { name: 'docker', label: 'Docker & OCI Format' },
    { name: 'patch', label: '0-Reboot Hotpatching' },
    { name: 'resmon', label: 'Resource Monitor & Logs' },
    { name: 'vmboot', label: 'VM Boot & Setup Guide' },
    { name: 'devdocs', label: 'Developer & Architecture Docs' },
    { name: 'taskmgr', label: 'Task Manager' },
    { name: 'explorer', label: 'File Explorer' },
    { name: 'cmd', label: 'Terminal / PowerShell' },
    { name: 'diskmgmt.msc', label: 'BitLocker Disk Vault' },
    { name: 'devmgmt.msc', label: 'Driver Dev Kit (WDK)' },
    { name: 'soffice', label: 'LibreOffice Suite' },
    { name: 'winver', label: 'About Windows NT' },
  ];

  return (
    <div
      onClick={(e) => e.stopPropagation()}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm pointer-events-auto"
    >
      <div className="w-[430px] bg-slate-900 border border-slate-700/80 rounded-xl shadow-2xl p-4 text-slate-100 font-sans select-none animate-in fade-in zoom-in-95 duration-100">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded bg-blue-600/30 border border-blue-500/50 flex items-center justify-center text-blue-400">
              <Terminal className="w-3.5 h-3.5" />
            </div>
            <span className="text-xs font-semibold">Run</span>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-white rounded hover:bg-slate-800"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Content */}
        <div className="py-4">
          <p className="text-xs text-slate-300 mb-3 leading-relaxed">
            Type the name of a program, folder, document, or kernel driver, and AegisNT Windows subsystem will open it for you.
          </p>

          <form onSubmit={handleSubmit} className="space-y-3">
            <div className="flex items-center gap-2">
              <label className="text-xs font-medium text-slate-400 w-12 shrink-0">
                Open:
              </label>
              <input
                type="text"
                value={command}
                onChange={(e) => setCommand(e.target.value)}
                autoFocus
                className="flex-1 bg-slate-800 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 font-mono"
              />
            </div>

            {/* Quick Command Chips */}
            <div className="flex flex-wrap gap-1.5 pt-1">
              {PRESETS.map((p) => (
                <button
                  key={p.name}
                  type="button"
                  onClick={() => setCommand(p.name)}
                  className={`text-[10px] px-2 py-0.5 rounded border transition-colors ${
                    command === p.name
                      ? 'bg-blue-600/30 border-blue-500 text-blue-300 font-semibold'
                      : 'bg-slate-800/80 border-slate-700/60 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {p.name}
                </button>
              ))}
            </div>

            {/* Actions */}
            <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-800">
              <button
                type="submit"
                className="px-4 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs shadow-md transition-colors flex items-center gap-1.5"
              >
                <span>OK</span>
                <CornerDownLeft className="w-3 h-3 opacity-70" />
              </button>
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
