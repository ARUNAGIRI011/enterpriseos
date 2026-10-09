import React, { useState, useEffect } from 'react';
import Desktop from './components/desktop/Desktop';
import Taskbar from './components/desktop/Taskbar';
import StartMenu from './components/desktop/StartMenu';
import WindowManager from './components/desktop/WindowManager';
import QuickSettings from './components/desktop/QuickSettings';
import CalendarFlyout from './components/desktop/CalendarFlyout';
import RunDialog from './components/desktop/RunDialog';
import AboutWindowsDialog from './components/desktop/AboutWindowsDialog';
import LockScreen from './components/desktop/LockScreen';
import NotificationToast, { ToastItem } from './components/desktop/NotificationToast';

// Enterprise Applications
import LibreOfficeApp from './components/apps/LibreOfficeApp';
import KernelInspectorApp from './components/apps/KernelInspectorApp';
import VirtualizationApp from './components/apps/VirtualizationApp';
import DriverDevKitApp from './components/apps/DriverDevKitApp';
import Win32ApiApp from './components/apps/Win32ApiApp';
import EncryptedDiskApp from './components/apps/EncryptedDiskApp';
import EnterpriseTerminalApp from './components/apps/EnterpriseTerminalApp';
import TaskManagerApp from './components/apps/TaskManagerApp';
import FileExplorerApp from './components/apps/FileExplorerApp';
import SettingsApp from './components/apps/SettingsApp';
import ResourceMonitorApp from './components/apps/ResourceMonitorApp';
import VmBootGuideApp from './components/apps/VmBootGuideApp';
import DeveloperDocsApp from './components/apps/DeveloperDocsApp';
import Win11GuidanceApp from './components/apps/Win11GuidanceApp';
import EnterpriseSecurityApp from './components/apps/EnterpriseSecurityApp';
import AppCompatibilitySuiteApp from './components/apps/AppCompatibilitySuiteApp';
import DesktopGuidanceHUD from './components/desktop/DesktopGuidanceHUD';

import { AppWindow } from './types/os';

export default function App() {
  const [wallpaper, setWallpaper] = useState('bloom-dark');
  const [isStartOpen, setIsStartOpen] = useState(false);
  const [isQuickSettingsOpen, setIsQuickSettingsOpen] = useState(false);
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [isRunOpen, setIsRunOpen] = useState(false);
  const [isAboutOpen, setIsAboutOpen] = useState(false);
  const [isLocked, setIsLocked] = useState(false);
  const [isRestarting, setIsRestarting] = useState(false);
  const [taskbarAlignment, setTaskbarAlignment] = useState<'center' | 'left'>('center');
  const [activeWindowId, setActiveWindowId] = useState<string | null>('win-kernel');
  const [isTourActive, setIsTourActive] = useState(false);

  // Enterprise Toasts
  const [toasts, setToasts] = useState<ToastItem[]>([
    {
      id: 'toast-boot',
      title: 'AegisNT Kernel Initialized',
      message: 'x86_64 microkernel active with sub-10μs HAL interrupt latency.',
      type: 'security',
      timestamp: '11:40 AM',
    },
    {
      id: 'toast-crypto',
      title: 'BitLocker Drive Guard',
      message: 'Partition C:\\ encrypted with AES-XTS-256 and TPM 2.0 PCR-7 bound.',
      type: 'success',
      timestamp: '11:41 AM',
    },
  ]);

  const [calendarNotifications, setCalendarNotifications] = useState([
    {
      id: 'notif-1',
      title: 'Hardware Abstraction Layer (HAL)',
      message: 'PCIe 5.0 NVMe 2.0 multi-queue DMA channels initialized with 1.1M IOPS.',
      time: '11:38 AM'
    },
    {
      id: 'notif-2',
      title: 'Virtualization & Hypervisor',
      message: 'QEMU KVM VirtIO paravirtualized network bus active @ 10 Gbps.',
      time: '11:39 AM'
    },
    {
      id: 'notif-3',
      title: 'LibreOffice 24.8 Subsystem',
      message: 'Office enterprise suite pre-loaded with full Wine 9.x PE integration.',
      time: '11:41 AM'
    }
  ]);

  const triggerToast = (title: string, message: string, type: 'info' | 'success' | 'warning' | 'security' = 'info') => {
    const newToast: ToastItem = {
      id: `toast-${Date.now()}`,
      title,
      message,
      type,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };
    setToasts((prev) => [...prev, newToast]);
  };

  const handleDismissToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Keyboard shortcut for Win+R (Run Dialog)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'r') {
        e.preventDefault();
        setIsRunOpen(true);
      } else if (e.key === 'Escape') {
        setIsStartOpen(false);
        setIsQuickSettingsOpen(false);
        setIsCalendarOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Initial windows on boot
  const [windows, setWindows] = useState<AppWindow[]>([
    {
      id: 'win-kernel',
      appId: 'kernel_inspector',
      title: 'AegisNT Microkernel Architecture Inspector (x86_64 / ARM64)',
      icon: 'Cpu',
      isMinimized: false,
      isMaximized: false,
      zIndex: 10,
      x: 32,
      y: 24,
      width: 960,
      height: 600,
    },
    {
      id: 'win-office',
      appId: 'libreoffice',
      title: 'LibreOffice 24.8 Enterprise Suite (Writer, Calc, Impress)',
      icon: 'FileText',
      isMinimized: false,
      isMaximized: false,
      zIndex: 11,
      x: 80,
      y: 50,
      width: 940,
      height: 590,
    },
    {
      id: 'win-virt',
      appId: 'virtualization',
      title: 'Enterprise Virtualization (QEMU/KVM, NVMe 2.0, USB 4.0, VFIO GPU)',
      icon: 'Server',
      isMinimized: true,
      isMaximized: false,
      zIndex: 8,
      x: 120,
      y: 60,
      width: 940,
      height: 580,
    },
  ]);

  const appMeta: Record<string, { title: string; defaultWidth: number; defaultHeight: number }> = {
    libreoffice: { title: 'LibreOffice 24.8 Enterprise Suite (Writer, Calc, Impress)', defaultWidth: 960, defaultHeight: 600 },
    kernel_inspector: { title: 'AegisNT Microkernel Architecture Inspector (x86_64 / ARM64)', defaultWidth: 960, defaultHeight: 600 },
    virtualization: { title: 'Enterprise Virtualization (QEMU/KVM, NVMe 2.0, USB 4.0, VFIO GPU)', defaultWidth: 940, defaultHeight: 580 },
    ddk: { title: 'AegisNT Windows Driver Kit (WDK / DDK Enterprise)', defaultWidth: 940, defaultHeight: 580 },
    win32_api: { title: 'Win32 & Native NT API Guidance & Wine 9.x Subsystem', defaultWidth: 940, defaultHeight: 580 },
    encrypted_disk: { title: 'BitLocker & Aegis-FVE Encrypted Disk Partition Manager', defaultWidth: 880, defaultHeight: 540 },
    terminal: { title: 'AegisNT Enterprise Administrative Terminal Suite', defaultWidth: 880, defaultHeight: 540 },
    task_manager: { title: 'AegisNT Task Manager Enterprise', defaultWidth: 820, defaultHeight: 520 },
    file_explorer: { title: 'File Explorer - AegisFS & Encrypted Volumes', defaultWidth: 860, defaultHeight: 530 },
    settings: { title: 'AegisNT Enterprise System Settings & Hardening', defaultWidth: 780, defaultHeight: 500 },
    resource_monitor: { title: 'AegisNT Resource Monitor & System Event Logs (resmon.exe)', defaultWidth: 980, defaultHeight: 620 },
    vm_boot_guide: { title: 'AegisNT Virtual Machine Boot & Installation Guidance (vmboot.exe)', defaultWidth: 940, defaultHeight: 590 },
    dev_docs: { title: 'AegisNT Developer & Architecture Documentation (devdocs.exe)', defaultWidth: 980, defaultHeight: 620 },
    win11_guidance: { title: 'Windows 11 Build Desktop Guidance (win11guidance.exe / Get Started)', defaultWidth: 980, defaultHeight: 630 },
    enterprise_security: { title: 'AegisNT Enterprise Production & Security Center (AegisSec.exe)', defaultWidth: 980, defaultHeight: 630 },
    app_compat: { title: 'AegisNT Application Compatibility & Subsystems (Java, .NET, Win32)', defaultWidth: 980, defaultHeight: 640 },
  };

  const bringToFront = (id: string) => {
    setActiveWindowId(id);
    setWindows((prev) => {
      const maxZ = Math.max(...prev.map((w) => w.zIndex), 10);
      return prev.map((w) => (w.id === id ? { ...w, zIndex: maxZ + 1, isMinimized: false } : w));
    });
  };

  const launchApp = (appId: string) => {
    setIsStartOpen(false);
    setIsQuickSettingsOpen(false);
    setIsCalendarOpen(false);

    const existing = windows.find((w) => w.appId === appId);
    if (existing) {
      bringToFront(existing.id);
      return;
    }

    const meta = appMeta[appId] || { title: appId, defaultWidth: 860, defaultHeight: 530 };
    const maxZ = Math.max(...windows.map((w) => w.zIndex), 10);
    const offset = (windows.length % 5) * 25;

    const newWin: AppWindow = {
      id: `win-${Date.now()}`,
      appId,
      title: meta.title,
      icon: 'App',
      isMinimized: false,
      isMaximized: false,
      zIndex: maxZ + 1,
      x: Math.max(20, 60 + offset),
      y: Math.max(20, 40 + offset),
      width: Math.min(window.innerWidth - 80, meta.defaultWidth),
      height: Math.min(window.innerHeight - 100, meta.defaultHeight),
    };

    setWindows([...windows, newWin]);
    setActiveWindowId(newWin.id);
  };

  const handleCloseWindow = (id: string) => {
    setWindows(windows.filter((w) => w.id !== id));
    if (activeWindowId === id) {
      const remaining = windows.filter((w) => w.id !== id);
      setActiveWindowId(remaining.length > 0 ? remaining[remaining.length - 1].id : null);
    }
  };

  const handleMinimizeWindow = (id: string) => {
    setWindows(windows.map((w) => (w.id === id ? { ...w, isMinimized: true } : w)));
    if (activeWindowId === id) {
      setActiveWindowId(null);
    }
  };

  const handleMaximizeWindow = (id: string) => {
    setWindows(windows.map((w) => (w.id === id ? { ...w, isMaximized: !w.isMaximized } : w)));
  };

  const handleMinimizeAll = () => {
    const allMinimized = windows.every((w) => w.isMinimized);
    setWindows(windows.map((w) => ({ ...w, isMinimized: !allMinimized })));
    if (!allMinimized) {
      setActiveWindowId(null);
    }
  };

  const handleSelectTaskbarWindow = (id: string) => {
    const win = windows.find((w) => w.id === id);
    if (!win) return;
    if (win.isMinimized) {
      bringToFront(id);
    } else if (activeWindowId === id) {
      handleMinimizeWindow(id);
    } else {
      bringToFront(id);
    }
  };

  // Run Dialog Command Dispatcher
  const handleRunCommand = (cmd: string) => {
    const cleaned = cmd.toLowerCase().trim();
    switch (cleaned) {
      case 'winver':
        setIsAboutOpen(true);
        break;
      case 'devdocs':
      case 'docs':
      case 'readme':
      case 'architecture':
        launchApp('dev_docs');
        break;
      case 'guidance':
      case 'win11':
      case 'win11guidance':
      case 'tour':
      case 'tips':
      case 'getstarted':
      case 'github':
      case 'git':
      case 'preview':
      case 'deploy':
        launchApp('win11_guidance');
        break;
      case 'security':
      case 'defender':
      case 'firewall':
      case 'winupdate':
      case 'update':
      case 'patch':
      case 'hotpatch':
      case 'kpatch':
      case 'fleet':
      case 'docker':
      case 'perf':
      case 'performance':
        launchApp('enterprise_security');
        break;
      case 'taskmgr':
        launchApp('task_manager');
        break;
      case 'resmon':
      case 'perfmon':
      case 'eventvwr':
        launchApp('resource_monitor');
        break;
      case 'vmboot':
      case 'vmguide':
      case 'installguide':
        launchApp('vm_boot_guide');
        break;
      case 'explorer':
        launchApp('file_explorer');
        break;
      case 'cmd':
      case 'powershell':
        launchApp('terminal');
        break;
      case 'diskmgmt.msc':
        launchApp('encrypted_disk');
        break;
      case 'devmgmt.msc':
      case 'wdk':
        launchApp('ddk');
        break;
      case 'soffice':
      case 'libreoffice':
        launchApp('libreoffice');
        break;
      case 'hyperv':
      case 'qemu':
        launchApp('virtualization');
        break;
      case 'kernel':
        launchApp('kernel_inspector');
        break;
      case 'win32':
        launchApp('win32_api');
        break;
      case 'compat':
      case 'app_compat':
      case 'java':
      case 'jvm':
      case 'dotnet':
      case 'clr':
      case 'coreclr':
      case 'wine':
      case 'pe':
      case 'msi':
        launchApp('app_compat');
        break;
      case 'ms-settings':
      case 'control':
        launchApp('settings');
        break;
      default:
        triggerToast('Command Executed', `Started process: "${cmd}" via Win32 CreateProcess API.`, 'info');
        launchApp('terminal');
        break;
    }
  };

  const handleRestartSystem = () => {
    setIsRestarting(true);
    setTimeout(() => {
      setIsRestarting(false);
      triggerToast('System Restart Complete', 'AegisNT Microkernel rebooted and HAL caches synced.', 'success');
    }, 2500);
  };

  const renderAppContent = (appId: string) => {
    switch (appId) {
      case 'libreoffice':
        return <LibreOfficeApp />;
      case 'kernel_inspector':
        return <KernelInspectorApp />;
      case 'virtualization':
        return <VirtualizationApp />;
      case 'ddk':
        return <DriverDevKitApp />;
      case 'win32_api':
        return <Win32ApiApp />;
      case 'encrypted_disk':
        return <EncryptedDiskApp />;
      case 'terminal':
        return <EnterpriseTerminalApp />;
      case 'task_manager':
        return <TaskManagerApp onLaunchApp={launchApp} />;
      case 'resource_monitor':
        return <ResourceMonitorApp />;
      case 'vm_boot_guide':
        return <VmBootGuideApp onLaunchApp={launchApp} />;
      case 'dev_docs':
        return <DeveloperDocsApp onLaunchApp={launchApp} />;
      case 'win11_guidance':
        return (
          <Win11GuidanceApp
            onLaunchApp={launchApp}
            onStartTour={() => setIsTourActive(true)}
            onToggleAlignment={() => setTaskbarAlignment((prev) => (prev === 'center' ? 'left' : 'center'))}
          />
        );
      case 'enterprise_security':
        return <EnterpriseSecurityApp onLaunchApp={launchApp} />;
      case 'file_explorer':
        return <FileExplorerApp onLaunchApp={launchApp} />;
      case 'settings':
        return <SettingsApp currentWallpaper={wallpaper} onWallpaperChange={setWallpaper} onLaunchApp={launchApp} />;
      case 'app_compat':
        return <AppCompatibilitySuiteApp onLaunchApp={launchApp} />;
      default:
        return <div className="p-4 text-xs text-slate-400">Application module initialized.</div>;
    }
  };

  return (
    <div className="relative w-screen h-screen flex flex-col overflow-hidden bg-slate-950 font-sans select-none">
      {/* Desktop Space */}
      <div
        className="relative flex-1 overflow-hidden"
        onClick={() => {
          setIsStartOpen(false);
          setIsQuickSettingsOpen(false);
          setIsCalendarOpen(false);
        }}
      >
        <Desktop
          onLaunchApp={launchApp}
          wallpaper={wallpaper}
          onOpenRun={() => setIsRunOpen(true)}
          onOpenAbout={() => setIsAboutOpen(true)}
          onWallpaperChange={setWallpaper}
          onTriggerToast={triggerToast}
        />

        {/* Windows 11 Build Desktop Guidance Floating HUD & Interactive Tour */}
        <DesktopGuidanceHUD
          onLaunchApp={launchApp}
          onOpenRun={() => setIsRunOpen(true)}
          isTourActive={isTourActive}
          onCloseTour={() => setIsTourActive(false)}
          onStartTour={() => setIsTourActive(true)}
        />

        <WindowManager
          windows={windows}
          activeWindowId={activeWindowId}
          onFocus={bringToFront}
          onClose={handleCloseWindow}
          onMinimize={handleMinimizeWindow}
          onMaximize={handleMaximizeWindow}
          renderAppContent={renderAppContent}
        />

        {/* Windows 11 Start Menu */}
        <StartMenu
          isOpen={isStartOpen}
          onClose={() => setIsStartOpen(false)}
          onLaunchApp={launchApp}
          onLockSession={() => setIsLocked(true)}
          onRestartSystem={handleRestartSystem}
          onTriggerToast={triggerToast}
        />

        {/* Windows 11 Quick Settings (Action Center) */}
        <QuickSettings
          isOpen={isQuickSettingsOpen}
          onClose={() => setIsQuickSettingsOpen(false)}
          onOpenSettings={() => launchApp('settings')}
          onTriggerToast={triggerToast}
        />

        {/* Windows 11 Calendar & Notification Center Flyout */}
        <CalendarFlyout
          isOpen={isCalendarOpen}
          onClose={() => setIsCalendarOpen(false)}
          notifications={calendarNotifications}
          onClearNotifications={() => setCalendarNotifications([])}
        />

        {/* Windows Run Dialog (Win+R) */}
        <RunDialog
          isOpen={isRunOpen}
          onClose={() => setIsRunOpen(false)}
          onExecuteCommand={handleRunCommand}
        />

        {/* About Windows (winver) Dialog */}
        <AboutWindowsDialog
          isOpen={isAboutOpen}
          onClose={() => setIsAboutOpen(false)}
        />

        {/* Windows 11 Toast Notifications */}
        <NotificationToast
          toasts={toasts}
          onDismiss={handleDismissToast}
        />
      </div>

      {/* Enterprise Taskbar (Windows 11 Centered or Left Aligned) */}
      <Taskbar
        isStartOpen={isStartOpen}
        onToggleStart={() => {
          setIsStartOpen(!isStartOpen);
          setIsQuickSettingsOpen(false);
          setIsCalendarOpen(false);
        }}
        openWindows={windows}
        activeWindowId={activeWindowId}
        onSelectWindow={handleSelectTaskbarWindow}
        onLaunchApp={launchApp}
        onCloseWindow={handleCloseWindow}
        onToggleQuickSettings={() => {
          setIsQuickSettingsOpen(!isQuickSettingsOpen);
          setIsStartOpen(false);
          setIsCalendarOpen(false);
        }}
        onToggleCalendar={() => {
          setIsCalendarOpen(!isCalendarOpen);
          setIsStartOpen(false);
          setIsQuickSettingsOpen(false);
        }}
        onMinimizeAll={handleMinimizeAll}
        taskbarAlignment={taskbarAlignment}
        onToggleAlignment={() => setTaskbarAlignment(taskbarAlignment === 'center' ? 'left' : 'center')}
        notificationCount={calendarNotifications.length}
      />

      {/* Windows 11 Lock Screen */}
      <LockScreen
        isLocked={isLocked}
        onUnlock={() => setIsLocked(false)}
        wallpaperTheme={wallpaper}
      />

      {/* Windows Restart Animation Overlay */}
      {isRestarting && (
        <div className="fixed inset-0 z-[120] bg-blue-950 flex flex-col items-center justify-center text-white font-sans animate-in fade-in duration-300">
          <div className="w-12 h-12 border-4 border-cyan-400 border-t-transparent rounded-full animate-spin mb-6" />
          <h2 className="text-xl font-light tracking-wide">Restarting AegisNT Enterprise...</h2>
          <p className="text-xs text-blue-300/80 mt-2 font-mono">Flushing NVMe Queues & Re-arming TPM PCRs</p>
        </div>
      )}
    </div>
  );
}
