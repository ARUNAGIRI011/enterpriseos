import React, { useState } from 'react';
import {
  Folder,
  FileText,
  HardDrive,
  Lock,
  ChevronRight,
  ArrowLeft,
  ArrowRight,
  FileCode,
  Table2,
  Presentation,
  Shield,
  Layers,
  Sparkles
} from 'lucide-react';

interface FileItem {
  name: string;
  type: 'folder' | 'file';
  size?: string;
  ext?: string;
  date: string;
  icon?: string;
  appTarget?: string;
}

export default function FileExplorerApp({ onLaunchApp }: { onLaunchApp?: (appId: string) => void }) {
  const [currentPath, setCurrentPath] = useState('C:\\');

  const fileSystemData: Record<string, FileItem[]> = {
    'C:\\': [
      { name: 'Windows', type: 'folder', date: '10/01/2026' },
      { name: 'Program Files', type: 'folder', date: '10/01/2026' },
      { name: 'Users', type: 'folder', date: '10/01/2026' },
      { name: 'Documentation', type: 'folder', date: '10/08/2026' },
      { name: 'KernelLogs', type: 'folder', date: '10/07/2026' },
      { name: 'README_VM_AND_USAGE_GUIDE.txt', type: 'file', ext: 'txt', size: '24 KB', date: '10/08/2026', appTarget: 'dev_docs' },
      { name: 'bootmgr', type: 'file', ext: 'sys', size: '384 KB', date: '10/01/2026' },
      { name: 'MEMORY.DMP', type: 'file', ext: 'dmp', size: '1.2 GB', date: '10/07/2026' }
    ],
    'C:\\Documentation': [
      { name: 'ENTERPRISE_SECURITY_AND_PERFORMANCE.md', type: 'file', ext: 'md', size: '28 KB', date: '10/08/2026', appTarget: 'enterprise_security' },
      { name: 'DOCKER_DEPLOYMENT_GUIDE.md', type: 'file', ext: 'md', size: '24 KB', date: '10/08/2026', appTarget: 'enterprise_security' },
      { name: 'FIREWALL_AND_PATCHING_GUIDE.md', type: 'file', ext: 'md', size: '20 KB', date: '10/08/2026', appTarget: 'enterprise_security' },
      { name: 'DESKTOP_BUILD_GUIDANCE.md', type: 'file', ext: 'md', size: '22 KB', date: '10/08/2026', appTarget: 'win11_guidance' },
      { name: 'ARCHITECTURE.md', type: 'file', ext: 'md', size: '18 KB', date: '10/08/2026', appTarget: 'dev_docs' },
      { name: 'DRIVERS_AND_KERNEL.md', type: 'file', ext: 'md', size: '14 KB', date: '10/08/2026', appTarget: 'dev_docs' },
      { name: 'INSTALLATION.md', type: 'file', ext: 'md', size: '12 KB', date: '10/08/2026', appTarget: 'dev_docs' },
      { name: 'RELEASE_NOTES.md', type: 'file', ext: 'md', size: '9 KB', date: '10/08/2026', appTarget: 'dev_docs' },
      { name: 'DEVELOPER_GUIDE.md', type: 'file', ext: 'md', size: '16 KB', date: '10/08/2026', appTarget: 'dev_docs' },
      { name: 'CONTRIBUTING.md', type: 'file', ext: 'md', size: '8 KB', date: '10/08/2026', appTarget: 'dev_docs' },
    ],
    'C:\\Windows': [
      { name: 'System32', type: 'folder', date: '10/01/2026' },
      { name: 'Fonts', type: 'folder', date: '10/01/2026' },
      { name: 'explorer.exe', type: 'file', ext: 'exe', size: '4,820 KB', date: '10/01/2026' },
      { name: 'aegissec.exe', type: 'file', ext: 'exe', size: '3,840 KB', date: '10/08/2026', appTarget: 'enterprise_security' },
      { name: 'win11guidance.exe', type: 'file', ext: 'exe', size: '2,420 KB', date: '10/08/2026', appTarget: 'win11_guidance' },
      { name: 'regedit.exe', type: 'file', ext: 'exe', size: '1,240 KB', date: '10/01/2026' },
      { name: 'resmon.exe', type: 'file', ext: 'exe', size: '2,150 KB', date: '10/08/2026', appTarget: 'resource_monitor' },
      { name: 'vmboot.exe', type: 'file', ext: 'exe', size: '1,890 KB', date: '10/08/2026', appTarget: 'vm_boot_guide' }
    ],
    'C:\\Windows\\System32': [
      { name: 'drivers', type: 'folder', date: '10/01/2026' },
      { name: 'ntoskrnl.exe', type: 'file', ext: 'exe', size: '11,480 KB', date: '10/01/2026', appTarget: 'kernel_inspector' },
      { name: 'hal.dll', type: 'file', ext: 'dll', size: '1,890 KB', date: '10/01/2026', appTarget: 'kernel_inspector' },
      { name: 'kernel32.dll', type: 'file', ext: 'dll', size: '2,400 KB', date: '10/01/2026', appTarget: 'win32_api' },
      { name: 'user32.dll', type: 'file', ext: 'dll', size: '3,100 KB', date: '10/01/2026', appTarget: 'win32_api' },
      { name: 'cmd.exe', type: 'file', ext: 'exe', size: '290 KB', date: '10/01/2026', appTarget: 'terminal' },
      { name: 'winrm.exe', type: 'file', ext: 'exe', size: '420 KB', date: '10/01/2026', appTarget: 'terminal' },
      { name: 'sshd.exe', type: 'file', ext: 'exe', size: '610 KB', date: '10/01/2026', appTarget: 'terminal' }
    ],
    'C:\\Windows\\System32\\drivers': [
      { name: 'aegis_nvme.sys', type: 'file', ext: 'sys', size: '348 KB', date: '10/01/2026', appTarget: 'ddk' },
      { name: 'usb4_host_router.sys', type: 'file', ext: 'sys', size: '284 KB', date: '10/01/2026', appTarget: 'ddk' },
      { name: 'vfio_iommu_passthru.sys', type: 'file', ext: 'sys', size: '512 KB', date: '10/01/2026', appTarget: 'ddk' },
      { name: 'virtio_hal_kvm.sys', type: 'file', ext: 'sys', size: '196 KB', date: '10/01/2026', appTarget: 'ddk' },
      { name: 'aegis_bitlocker_fve.sys', type: 'file', ext: 'sys', size: '256 KB', date: '10/01/2026', appTarget: 'encrypted_disk' }
    ],
    'C:\\Program Files': [
      { name: 'Java', type: 'folder', date: '10/01/2026' },
      { name: 'dotnet', type: 'folder', date: '10/01/2026' },
      { name: 'LibreOffice', type: 'folder', date: '10/01/2026' },
      { name: 'QEMU-KVM', type: 'folder', date: '10/01/2026' },
      { name: 'Win32Apps', type: 'folder', date: '10/01/2026' }
    ],
    'C:\\Program Files\\Java': [
      { name: 'jdk-21.0.5', type: 'folder', date: '10/01/2026' },
      { name: 'apps', type: 'folder', date: '10/08/2026' }
    ],
    'C:\\Program Files\\Java\\apps': [
      { name: 'springboot-enterprise-gateway.jar', type: 'file', ext: 'jar', size: '48,200 KB', date: '10/08/2026', appTarget: 'app_compat' },
      { name: 'aegis-erp-workbench.jar', type: 'file', ext: 'jar', size: '24,100 KB', date: '10/08/2026', appTarget: 'app_compat' },
      { name: 'paper-1.21.3.jar', type: 'file', ext: 'jar', size: '72,400 KB', date: '10/08/2026', appTarget: 'app_compat' }
    ],
    'C:\\Program Files\\dotnet': [
      { name: 'shared', type: 'folder', date: '10/01/2026' },
      { name: 'sdk', type: 'folder', date: '10/01/2026' },
      { name: 'apps', type: 'folder', date: '10/08/2026' },
      { name: 'dotnet.exe', type: 'file', ext: 'exe', size: '180 KB', date: '10/01/2026', appTarget: 'app_compat' }
    ],
    'C:\\Program Files\\dotnet\\apps': [
      { name: 'OrderManagement.Api.dll', type: 'file', ext: 'dll', size: '1,420 KB', date: '10/08/2026', appTarget: 'app_compat' },
      { name: 'ExecutiveDashboard.Wpf.exe', type: 'file', ext: 'exe', size: '8,400 KB', date: '10/08/2026', appTarget: 'app_compat' },
      { name: 'LegacyPointOfSale.exe', type: 'file', ext: 'exe', size: '4,100 KB', date: '10/08/2026', appTarget: 'app_compat' }
    ],
    'C:\\Program Files\\Win32Apps': [
      { name: 'calc_enterprise.exe', type: 'file', ext: 'exe', size: '840 KB', date: '10/01/2026', appTarget: 'app_compat' },
      { name: 'notepad++.exe', type: 'file', ext: 'exe', size: '5,200 KB', date: '10/01/2026', appTarget: 'app_compat' },
      { name: '7zFM.exe', type: 'file', ext: 'exe', size: '1,890 KB', date: '10/01/2026', appTarget: 'app_compat' },
      { name: 'EnterpriseSecurityTools.msi', type: 'file', ext: 'msi', size: '14,200 KB', date: '10/08/2026', appTarget: 'app_compat' }
    ],
    'C:\\Program Files\\LibreOffice': [
      { name: 'soffice.exe', type: 'file', ext: 'exe', size: '8,200 KB', date: '10/01/2026', appTarget: 'libreoffice' },
      { name: 'writer.exe', type: 'file', ext: 'exe', size: '4,100 KB', date: '10/01/2026', appTarget: 'libreoffice' },
      { name: 'calc.exe', type: 'file', ext: 'exe', size: '4,300 KB', date: '10/01/2026', appTarget: 'libreoffice' },
      { name: 'impress.exe', type: 'file', ext: 'exe', size: '3,900 KB', date: '10/01/2026', appTarget: 'libreoffice' }
    ],
    'C:\\Users': [
      { name: 'Administrator', type: 'folder', date: '10/01/2026' }
    ],
    'C:\\Users\\Administrator': [
      { name: 'Documents', type: 'folder', date: '10/01/2026' },
      { name: 'Downloads', type: 'folder', date: '10/01/2026' }
    ],
    'C:\\Users\\Administrator\\Documents': [
      { name: 'Enterprise_Security_Architecture_v4.2.odt', type: 'file', ext: 'odt', size: '142 KB', date: '10/07/2026', appTarget: 'libreoffice' },
      { name: 'Enterprise_Infrastructure_Budget_2026.ods', type: 'file', ext: 'ods', size: '94 KB', date: '10/07/2026', appTarget: 'libreoffice' },
      { name: 'AegisNT_Hypervisor_Brief.odp', type: 'file', ext: 'odp', size: '280 KB', date: '10/07/2026', appTarget: 'libreoffice' }
    ],
    'D:\\': [
      { name: 'Databases', type: 'folder', date: '10/02/2026' },
      { name: 'VM_Images', type: 'folder', date: '10/03/2026' },
      { name: 'Backup_Keys', type: 'folder', date: '10/04/2026' }
    ]
  };

  const currentFiles = fileSystemData[currentPath] || [];

  const handleItemClick = (item: FileItem) => {
    if (item.type === 'folder') {
      const nextPath = currentPath.endsWith('\\') ? `${currentPath}${item.name}` : `${currentPath}\\${item.name}`;
      if (fileSystemData[nextPath]) {
        setCurrentPath(nextPath);
      }
    } else {
      if (item.appTarget && onLaunchApp) {
        onLaunchApp(item.appTarget);
      } else if (item.ext === 'txt' || item.ext === 'log') {
        if (onLaunchApp) onLaunchApp('terminal');
      } else {
        if (onLaunchApp) onLaunchApp('libreoffice');
      }
    }
  };

  const navigateUp = () => {
    if (currentPath === 'C:\\' || currentPath === 'D:\\') return;
    const parts = currentPath.split('\\');
    parts.pop();
    const up = parts.join('\\') || 'C:\\';
    setCurrentPath(up.endsWith(':') ? `${up}\\` : up);
  };

  return (
    <div className="flex flex-col h-full bg-slate-950 text-slate-100 font-sans select-none">
      {/* Address Bar */}
      <div className="flex items-center gap-2 px-3 py-2 bg-slate-900 border-b border-slate-800 text-xs">
        <button
          onClick={navigateUp}
          className="p-1 hover:bg-slate-800 rounded text-slate-400 hover:text-slate-200"
          title="Up"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
        </button>
        <div className="flex-1 flex items-center gap-1.5 px-3 py-1 bg-slate-950 border border-slate-800 rounded font-mono text-slate-200">
          <HardDrive className="w-3.5 h-3.5 text-blue-400" />
          <span>{currentPath}</span>
        </div>
      </div>

      {/* Main Body */}
      <div className="flex flex-1 overflow-hidden">
        {/* Navigation Tree Sidebar */}
        <div className="w-52 bg-slate-950 border-r border-slate-800 p-2 space-y-1 text-xs">
          <div className="text-[10px] text-slate-500 font-bold px-2 py-1 uppercase tracking-wider">
            Drives (AES-XTS-256)
          </div>
          <button
            onClick={() => setCurrentPath('C:\\')}
            className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded transition-colors ${
              currentPath.startsWith('C:') ? 'bg-blue-900/40 text-blue-300 font-semibold' : 'text-slate-300 hover:bg-slate-900'
            }`}
          >
            <div className="flex items-center gap-2">
              <HardDrive className="w-3.5 h-3.5 text-blue-400" />
              <span>Aegis System (C:)</span>
            </div>
            <Lock className="w-3 h-3 text-amber-400" />
          </button>
          <button
            onClick={() => setCurrentPath('D:\\')}
            className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded transition-colors ${
              currentPath.startsWith('D:') ? 'bg-blue-900/40 text-blue-300 font-semibold' : 'text-slate-300 hover:bg-slate-900'
            }`}
          >
            <div className="flex items-center gap-2">
              <HardDrive className="w-3.5 h-3.5 text-blue-400" />
              <span>Enterprise Data (D:)</span>
            </div>
            <Lock className="w-3 h-3 text-amber-400" />
          </button>

          <div className="text-[10px] text-slate-500 font-bold px-2 py-2 uppercase tracking-wider">
            Quick Access
          </div>
          <button
            onClick={() => setCurrentPath('C:\\Documentation')}
            className="w-full flex items-center gap-2 px-2.5 py-1.5 text-slate-300 hover:bg-slate-900 rounded"
          >
            <FileCode className="w-3.5 h-3.5 text-blue-400" />
            <span>Documentation</span>
          </button>
          <button
            onClick={() => setCurrentPath('C:\\Users\\Administrator\\Documents')}
            className="w-full flex items-center gap-2 px-2.5 py-1.5 text-slate-300 hover:bg-slate-900 rounded"
          >
            <FileText className="w-3.5 h-3.5 text-emerald-400" />
            <span>Documents</span>
          </button>
          <button
            onClick={() => setCurrentPath('C:\\Program Files\\LibreOffice')}
            className="w-full flex items-center gap-2 px-2.5 py-1.5 text-slate-300 hover:bg-slate-900 rounded"
          >
            <Folder className="w-3.5 h-3.5 text-amber-400" />
            <span>LibreOffice</span>
          </button>
          <button
            onClick={() => setCurrentPath('C:\\Windows\\System32\\drivers')}
            className="w-full flex items-center gap-2 px-2.5 py-1.5 text-slate-300 hover:bg-slate-900 rounded"
          >
            <Shield className="w-3.5 h-3.5 text-indigo-400" />
            <span>System Drivers</span>
          </button>
        </div>

        {/* File Grid */}
        <div className="flex-1 overflow-y-auto p-4 bg-slate-950">
          <div className="grid grid-cols-4 gap-3">
            {currentFiles.map((file) => (
              <div
                key={file.name}
                onDoubleClick={() => handleItemClick(file)}
                className="p-3 bg-slate-900/60 hover:bg-slate-900 border border-slate-800/80 hover:border-slate-700 rounded-lg cursor-pointer flex flex-col items-center text-center transition-all group"
              >
                <div className="p-3 rounded-lg mb-2 group-hover:scale-105 transition-transform">
                  {file.type === 'folder' ? (
                    <Folder className="w-8 h-8 text-amber-400 fill-amber-400/20" />
                  ) : file.ext === 'odt' ? (
                    <FileText className="w-8 h-8 text-blue-400" />
                  ) : file.ext === 'ods' ? (
                    <Table2 className="w-8 h-8 text-emerald-400" />
                  ) : file.ext === 'odp' ? (
                    <Presentation className="w-8 h-8 text-amber-400" />
                  ) : file.ext === 'sys' ? (
                    <Shield className="w-8 h-8 text-indigo-400" />
                  ) : (
                    <FileCode className="w-8 h-8 text-cyan-400" />
                  )}
                </div>

                <div className="text-xs font-semibold text-slate-200 truncate w-full" title={file.name}>
                  {file.name}
                </div>
                <div className="text-[10px] text-slate-500 mt-1 font-mono">
                  {file.size || 'Folder'} • {file.date}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
