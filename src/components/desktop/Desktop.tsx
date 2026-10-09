import React, { useState, useRef } from 'react';
import {
  FileText,
  Cpu,
  Server,
  Hammer,
  BookOpen,
  Lock,
  Terminal,
  Activity,
  Folder,
  Settings,
  Shield,
  Monitor,
  Trash2,
  HardDrive,
  RefreshCw,
  FolderPlus,
  Palette,
  Info,
  Play,
  Compass,
  Layers
} from 'lucide-react';
import { DesktopIcon } from '../../types/os';
import WindowsWallpaper from './WindowsWallpaper';

interface DesktopProps {
  onLaunchApp: (appId: string) => void;
  wallpaper?: string;
  onOpenRun?: () => void;
  onOpenAbout?: () => void;
  onWallpaperChange?: (wp: string) => void;
  onTriggerToast?: (title: string, message: string, type?: 'info' | 'success' | 'warning' | 'security') => void;
}

const DESKTOP_ICONS: DesktopIcon[] = [
  { id: 'icon-thispc', title: 'This PC', icon: 'ThisPC', appId: 'file_explorer', color: 'blue' },
  { id: 'icon-compat', title: 'App Compatibility (.NET / Java / Win32)', icon: 'Layers', appId: 'app_compat', color: 'cyan' },
  { id: 'icon-security', title: 'Enterprise Security & Defender', icon: 'Shield', appId: 'enterprise_security', color: 'emerald' },
  { id: 'icon-guidance', title: 'Windows 11 Guidance', icon: 'Compass', appId: 'win11_guidance', color: 'blue' },
  { id: 'icon-office', title: 'LibreOffice 24.8', icon: 'FileText', appId: 'libreoffice', color: 'emerald' },
  { id: 'icon-kernel', title: 'NT Kernel Inspector', icon: 'Cpu', appId: 'kernel_inspector', color: 'blue' },
  { id: 'icon-virt', title: 'QEMU / KVM Hypervisor', icon: 'Server', appId: 'virtualization', color: 'cyan' },
  { id: 'icon-vmboot', title: 'VM Boot Guide', icon: 'Server', appId: 'vm_boot_guide', color: 'indigo' },
  { id: 'icon-devdocs', title: 'Developer Docs', icon: 'BookOpen', appId: 'dev_docs', color: 'blue' },
  { id: 'icon-resmon', title: 'Resource Monitor & Logs', icon: 'Activity', appId: 'resource_monitor', color: 'cyan' },
  { id: 'icon-ddk', title: 'Driver Dev Kit (WDK)', icon: 'Hammer', appId: 'ddk', color: 'amber' },
  { id: 'icon-win32', title: 'Win32 & Wine 9.x', icon: 'BookOpen', appId: 'win32_api', color: 'sky' },
  { id: 'icon-disk', title: 'BitLocker Drive Vault', icon: 'Lock', appId: 'encrypted_disk', color: 'rose' },
  { id: 'icon-term', title: 'Windows Terminal', icon: 'Terminal', appId: 'terminal', color: 'slate' },
  { id: 'icon-perf', title: 'Task Manager', icon: 'Activity', appId: 'task_manager', color: 'green' },
  { id: 'icon-files', title: 'File Explorer', icon: 'Folder', appId: 'file_explorer', color: 'yellow' },
  { id: 'icon-recycle', title: 'Recycle Bin', icon: 'Trash2', appId: 'file_explorer', color: 'slate' },
  { id: 'icon-settings', title: 'Settings', icon: 'Settings', appId: 'settings', color: 'indigo' },
];

export default function Desktop({
  onLaunchApp,
  wallpaper = 'bloom-dark',
  onOpenRun,
  onOpenAbout,
  onWallpaperChange,
  onTriggerToast
}: DesktopProps) {
  const [selectedIcon, setSelectedIcon] = useState<string | null>(null);
  const [contextMenu, setContextMenu] = useState<{ x: number; y: number } | null>(null);
  const [iconSize, setIconSize] = useState<'medium' | 'small' | 'large'>('medium');

  // Drag Marquee Box
  const [marquee, setMarquee] = useState<{ startX: number; startY: number; currentX: number; currentY: number } | null>(null);
  const desktopRef = useRef<HTMLDivElement>(null);

  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.button !== 0) return; // only left click
    setSelectedIcon(null);
    setContextMenu(null);
    setMarquee({
      startX: e.clientX,
      startY: e.clientY,
      currentX: e.clientX,
      currentY: e.clientY,
    });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!marquee) return;
    setMarquee((prev) => prev ? { ...prev, currentX: e.clientX, currentY: e.clientY } : null);
  };

  const handleMouseUp = () => {
    setMarquee(null);
  };

  const renderIconGraphic = (icon: string, color?: string) => {
    const sizeWrapper =
      iconSize === 'small' ? 'w-10 h-10 rounded-lg' :
      iconSize === 'large' ? 'w-14 h-14 rounded-2xl' :
      'w-12 h-12 rounded-xl';
    
    const iconDimension =
      iconSize === 'small' ? 20 :
      iconSize === 'large' ? 28 :
      24;

    const baseClass = `${sizeWrapper} flex items-center justify-center border shadow-lg group-hover:scale-105 transition-all`;

    switch (icon) {
      case 'ThisPC':
        return (
          <div className={`${baseClass} bg-gradient-to-tr from-blue-700 to-cyan-500 border-blue-400/50 text-white`}>
            <Monitor size={iconDimension} />
          </div>
        );
      case 'Compass':
        return (
          <div className={`${baseClass} bg-gradient-to-tr from-blue-600 via-indigo-600 to-cyan-400 border-blue-400/60 text-white shadow-blue-500/30`}>
            <Compass size={iconDimension} className="group-hover:rotate-45 transition-transform duration-300" />
          </div>
        );
      case 'Shield':
        return (
          <div className={`${baseClass} bg-gradient-to-tr from-emerald-600 via-teal-600 to-cyan-500 border-emerald-400/60 text-white shadow-emerald-500/30`}>
            <Shield size={iconDimension} />
          </div>
        );
      case 'Trash2':
        return (
          <div className={`${baseClass} bg-slate-800/90 border-slate-600/70 text-slate-300`}>
            <Trash2 size={iconDimension} />
          </div>
        );
      case 'Layers':
        return (
          <div className={`${baseClass} bg-cyan-950/80 border-cyan-500/60 text-cyan-300`}>
            <Layers size={iconDimension} />
          </div>
        );
      case 'FileText':
        return (
          <div className={`${baseClass} bg-emerald-950/80 border-emerald-600/60 text-emerald-400`}>
            <FileText size={iconDimension} />
          </div>
        );
      case 'Cpu':
        return (
          <div className={`${baseClass} bg-blue-950/80 border-blue-600/60 text-blue-400`}>
            <Cpu size={iconDimension} />
          </div>
        );
      case 'Server':
        return (
          <div className={`${baseClass} bg-cyan-950/80 border-cyan-600/60 text-cyan-400`}>
            <Server size={iconDimension} />
          </div>
        );
      case 'Hammer':
        return (
          <div className={`${baseClass} bg-amber-950/80 border-amber-600/60 text-amber-400`}>
            <Hammer size={iconDimension} />
          </div>
        );
      case 'BookOpen':
        return (
          <div className={`${baseClass} bg-sky-950/80 border-sky-600/60 text-sky-400`}>
            <BookOpen size={iconDimension} />
          </div>
        );
      case 'Lock':
        return (
          <div className={`${baseClass} bg-rose-950/80 border-rose-600/60 text-rose-400`}>
            <Lock size={iconDimension} />
          </div>
        );
      case 'Terminal':
        return (
          <div className={`${baseClass} bg-slate-900/90 border-slate-700/80 text-cyan-300`}>
            <Terminal size={iconDimension} />
          </div>
        );
      case 'Activity':
        return (
          <div className={`${baseClass} bg-emerald-950/80 border-emerald-600/60 text-emerald-300`}>
            <Activity size={iconDimension} />
          </div>
        );
      case 'Folder':
        return (
          <div className={`${baseClass} bg-yellow-950/80 border-yellow-600/60 text-yellow-400`}>
            <Folder size={iconDimension} />
          </div>
        );
      case 'Settings':
      default:
        return (
          <div className={`${baseClass} bg-indigo-950/80 border-indigo-600/60 text-indigo-400`}>
            <Settings size={iconDimension} />
          </div>
        );
    }
  };

  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    setContextMenu({ x: e.clientX, y: e.clientY });
  };

  // Marquee box geometry
  const marqueeStyle = marquee ? {
    left: Math.min(marquee.startX, marquee.currentX),
    top: Math.min(marquee.startY, marquee.currentY),
    width: Math.abs(marquee.currentX - marquee.startX),
    height: Math.abs(marquee.currentY - marquee.startY),
  } : null;

  return (
    <div
      ref={desktopRef}
      onContextMenu={handleContextMenu}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      className="absolute inset-0 text-slate-100 select-none overflow-hidden"
    >
      {/* Windows Bloom Wallpaper */}
      <WindowsWallpaper theme={wallpaper} />

      {/* Marquee Selection Box */}
      {marquee && marqueeStyle && (
        <div
          style={marqueeStyle}
          className="absolute z-20 pointer-events-none bg-blue-500/20 border border-blue-400/80 rounded"
        />
      )}

      {/* Enterprise NT Build Watermark on Bottom Right (Interactive) */}
      <div
        onClick={() => onLaunchApp('win11_guidance')}
        className="absolute bottom-14 right-6 pointer-events-auto cursor-pointer text-right font-mono text-xs text-slate-400/80 hover:text-slate-200 transition-all leading-relaxed select-none z-0 hover:bg-slate-900/60 p-2 rounded-xl border border-transparent hover:border-blue-500/30"
        title="Click to open Windows 11 Build Desktop Guidance"
      >
        <p className="font-semibold text-slate-300 flex items-center justify-end gap-1.5">
          <span>AegisNT™ Enterprise OS</span>
          <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse" />
        </p>
        <p>Windows 11 Inspired NT Kernel Build 26100.1882.24H2</p>
        <p className="text-[11px] text-blue-400/90">
          Multi-Arch (x86_64 / ARM64) • WDDM 3.2 • BitLocker AES-XTS-256
        </p>
        <p className="text-[10px] text-slate-500 hover:text-blue-300 transition-colors">
          Click for Desktop Guidance &amp; Build Walkthrough
        </p>
      </div>

      {/* Desktop Grid of Icons */}
      <div className="relative z-10 p-5 grid grid-flow-col grid-rows-6 gap-3.5 w-fit">
        {DESKTOP_ICONS.map((item) => {
          const isSelected = selectedIcon === item.id;
          return (
            <button
              key={item.id}
              onClick={(e) => {
                e.stopPropagation();
                setSelectedIcon(item.id);
              }}
              onDoubleClick={(e) => {
                e.stopPropagation();
                onLaunchApp(item.appId);
              }}
              className={`group flex flex-col items-center justify-center p-2 rounded-xl transition-all text-center border ${
                iconSize === 'small' ? 'w-20 h-20' : iconSize === 'large' ? 'w-28 h-28' : 'w-24 h-24'
              } ${
                isSelected
                  ? 'bg-blue-600/30 border-blue-400/90 shadow-md ring-1 ring-blue-400/60'
                  : 'hover:bg-slate-800/50 active:bg-slate-700/60 border-transparent hover:border-slate-700/60'
              }`}
            >
              {renderIconGraphic(item.icon, item.color)}
              <span className="text-[11px] font-medium text-slate-100 mt-1.5 line-clamp-2 leading-tight drop-shadow-[0_1px_2px_rgba(0,0,0,0.9)]">
                {item.title}
              </span>
            </button>
          );
        })}
      </div>

      {/* Windows 11 Fluent Right-Click Context Menu */}
      {contextMenu && (
        <div
          style={{ top: `${contextMenu.y}px`, left: `${contextMenu.x}px` }}
          onClick={(e) => e.stopPropagation()}
          className="absolute z-50 w-56 bg-slate-900/95 border border-slate-700/80 rounded-2xl shadow-2xl p-1.5 text-xs text-slate-200 backdrop-blur-2xl font-sans"
        >
          {/* Windows 11 Desktop Guidance Direct Action */}
          <button
            onClick={() => {
              onLaunchApp('win11_guidance');
              setContextMenu(null);
            }}
            className="w-full text-left px-3 py-1.5 rounded-lg bg-blue-600/20 hover:bg-blue-600/30 text-blue-300 font-medium flex items-center justify-between border border-blue-500/30 mb-1"
          >
            <div className="flex items-center gap-2">
              <Compass className="w-3.5 h-3.5 text-blue-400" />
              <span>Windows 11 Desktop Guidance</span>
            </div>
            <span className="text-[10px] text-blue-400 font-mono">Build 24H2</span>
          </button>

          {/* Enterprise Security & Defender Action */}
          <button
            onClick={() => {
              onLaunchApp('enterprise_security');
              setContextMenu(null);
            }}
            className="w-full text-left px-3 py-1.5 rounded-lg bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 font-medium flex items-center justify-between border border-emerald-500/30 mb-1"
          >
            <div className="flex items-center gap-2">
              <Shield className="w-3.5 h-3.5 text-emerald-400" />
              <span>Enterprise Security & Firewall</span>
            </div>
            <span className="text-[10px] text-emerald-400 font-mono">EDR/VBS</span>
          </button>

          {/* View Sub-Options */}
          <div className="px-2 py-1 text-[10px] text-slate-400 uppercase font-bold tracking-wider">
            Icon Size
          </div>
          <div className="flex gap-1 px-1 mb-1">
            {(['small', 'medium', 'large'] as const).map((s) => (
              <button
                key={s}
                onClick={() => setIconSize(s)}
                className={`flex-1 py-1 rounded text-center text-[10px] capitalize transition-colors ${
                  iconSize === s ? 'bg-blue-600 text-white font-semibold' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                }`}
              >
                {s}
              </button>
            ))}
          </div>

          <button
            onClick={() => {
              if (onTriggerToast) {
                onTriggerToast('Desktop Refreshed', 'AegisFS file nodes and system caches reloaded.', 'success');
              }
              setContextMenu(null);
            }}
            className="w-full text-left px-3 py-1.5 rounded-lg hover:bg-slate-800 flex items-center justify-between"
          >
            <div className="flex items-center gap-2">
              <RefreshCw className="w-3.5 h-3.5 text-blue-400" />
              <span>Refresh</span>
            </div>
            <span className="text-[10px] text-slate-500 font-mono">F5</span>
          </button>

          <div className="w-full h-[1px] bg-slate-800 my-1" />

          <button
            onClick={() => {
              onLaunchApp('terminal');
              setContextMenu(null);
            }}
            className="w-full text-left px-3 py-1.5 rounded-lg hover:bg-slate-800 flex items-center gap-2"
          >
            <Terminal className="w-3.5 h-3.5 text-cyan-400" />
            <span>Open in Windows Terminal</span>
          </button>

          <button
            onClick={() => {
              if (onOpenRun) onOpenRun();
              setContextMenu(null);
            }}
            className="w-full text-left px-3 py-1.5 rounded-lg hover:bg-slate-800 flex items-center justify-between"
          >
            <div className="flex items-center gap-2">
              <Play className="w-3.5 h-3.5 text-emerald-400" />
              <span>Run...</span>
            </div>
            <span className="text-[10px] text-slate-500 font-mono">Win+R</span>
          </button>

          <div className="w-full h-[1px] bg-slate-800 my-1" />

          {/* New Sub-menu Items */}
          <button
            onClick={() => {
              onLaunchApp('ddk');
              setContextMenu(null);
            }}
            className="w-full text-left px-3 py-1.5 rounded-lg hover:bg-slate-800 flex items-center gap-2"
          >
            <Hammer className="w-3.5 h-3.5 text-amber-400" />
            <span>New C Driver (.c)</span>
          </button>

          <button
            onClick={() => {
              onLaunchApp('libreoffice');
              setContextMenu(null);
            }}
            className="w-full text-left px-3 py-1.5 rounded-lg hover:bg-slate-800 flex items-center gap-2"
          >
            <FileText className="w-3.5 h-3.5 text-emerald-400" />
            <span>New LibreOffice Document</span>
          </button>

          <div className="w-full h-[1px] bg-slate-800 my-1" />

          {/* Wallpaper switcher shortcuts */}
          <div className="px-2 py-1 text-[10px] text-slate-400 uppercase font-bold tracking-wider flex items-center gap-1.5">
            <Palette className="w-3 h-3 text-purple-400" />
            <span>Wallpaper Theme</span>
          </div>
          <div className="grid grid-cols-2 gap-1 px-1 mb-1">
            <button
              onClick={() => {
                if (onWallpaperChange) onWallpaperChange('bloom-dark');
                setContextMenu(null);
              }}
              className="py-1 rounded bg-slate-800 hover:bg-slate-700 text-[10px] text-slate-300"
            >
              Dark Bloom
            </button>
            <button
              onClick={() => {
                if (onWallpaperChange) onWallpaperChange('bloom-blue');
                setContextMenu(null);
              }}
              className="py-1 rounded bg-slate-800 hover:bg-slate-700 text-[10px] text-slate-300"
            >
              Classic Blue
            </button>
            <button
              onClick={() => {
                if (onWallpaperChange) onWallpaperChange('bloom-sunset');
                setContextMenu(null);
              }}
              className="py-1 rounded bg-slate-800 hover:bg-slate-700 text-[10px] text-slate-300"
            >
              Sunset
            </button>
            <button
              onClick={() => {
                if (onWallpaperChange) onWallpaperChange('bloom-enterprise');
                setContextMenu(null);
              }}
              className="py-1 rounded bg-slate-800 hover:bg-slate-700 text-[10px] text-slate-300"
            >
              Graphite
            </button>
          </div>

          <div className="w-full h-[1px] bg-slate-800 my-1" />

          <button
            onClick={() => {
              if (onOpenAbout) onOpenAbout();
              setContextMenu(null);
            }}
            className="w-full text-left px-3 py-1.5 rounded-lg hover:bg-slate-800 flex items-center gap-2 text-slate-300"
          >
            <Info className="w-3.5 h-3.5 text-blue-400" />
            <span>About Windows NT (winver)</span>
          </button>
        </div>
      )}
    </div>
  );
}
