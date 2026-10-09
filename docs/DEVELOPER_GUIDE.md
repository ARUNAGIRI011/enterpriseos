# AegisNT Developer Codebase Guide & Architecture Tour

**Audience:** Open-Source Contributors, Kernel Engineers, and Frontend Systems Developers  
**Repository Structure:** React 19 + TypeScript 5.8 + Vite 6 + Tailwind CSS  

---

## 1. High-Level Architecture Diagram

```
+--------------------------------------------------------------------------------------------------+
|                                    USER INTERFACE SHELL LAYER                                    |
|                                                                                                  |
|   +-------------------+  +-----------------------+  +--------------------+  +------------------+ |
|   |  Taskbar.tsx      |  |  StartMenu.tsx        |  |  Desktop.tsx       |  | WindowFrame.tsx  | |
|   |  - Centered Icons |  |  - Pinned Grid        |  |  - Icon Grid       |  | - Window Controls| |
|   |  - System Tray    |  |  - All Apps Drawer    |  |  - Context Menu    |  | - Snap Layouts   | |
|   |  - Active Pill    |  |  - User Profile & Pwr |  |  - Bloom Wallpaper |  | - Drag & Resize  | |
|   +-------------------+  +-----------------------+  +--------------------+  +------------------+ |
|                                                                                                  |
|   +-------------------+  +-----------------------+  +--------------------+  +------------------+ |
|   | ActionCenter.tsx  |  | CalendarFlyout.tsx    |  |  RunDialog.tsx     |  | LockScreen.tsx   | |
|   | - Quick Toggles   |  | - Interactive Calendar|  |  - Win+R Presets   |  | - Windows Lock   | |
|   | - Vol/Bright Slide|  | - Notifications List  |  |  - Command Router  |  | - Auth Pin/Pass | |
|   +-------------------+  +-----------------------+  +--------------------+  +------------------+ |
+---------------------------------------------------|----------------------------------------------+
                                                    | Dispatches App Launch & Window State
+---------------------------------------------------|----------------------------------------------+
|                             MAIN ORCHESTRATOR & APPLICATION RUNTIME                              |
|                                         src/App.tsx                                              |
|                                                                                                  |
|  * Window State Management (Z-Index stack, focus, maximize, minimize, snap layout positioning)   |
|  * Application Metadata Registry (appMeta mapping IDs to titles, dimensions, and min constraints)|
|  * Global Keyboard Shortcuts (Win, Win+R, Win+L, Win+D, Alt+Tab)                                 |
|  * Toast Notification Dispatcher & Architecture Switcher (x86_64 <-> ARM64)                      |
+---------------------------------------------------|----------------------------------------------+
                                                    | Mounts Application Component by AppId
+---------------------------------------------------|----------------------------------------------+
|                                 APPLICATION ECOSYSTEM (src/components/apps/)                     |
|                                                                                                  |
|  * ResourceMonitorApp.tsx   : Windows resmon.exe clone with CPU, Memory, Disk, Net & Logs        |
|  * VmBootGuideApp.tsx       : Multi-hypervisor boot wizard with copyable CLI configurations      |
|  * VirtualizationApp.tsx    : QEMU/KVM hypervisor control, PCIe NVMe, USB4, and VFIO GPU stats   |
|  * Win32ApiApp.tsx          : PE32/PE32+ loader, Win32 API testbench, NT Syscall tracer          |
|  * KernelInspectorApp.tsx   : Live scheduler metrics, IRQL table, memory pools, process table    |
|  * DriverDevKitApp.tsx      : In-browser C driver IDE, KMDF compiler simulation, W^X validator    |
|  * EncryptedDiskApp.tsx     : BitLocker AES-XTS-256 volume management and TPM 2.0 PCR status     |
|  * EnterpriseTerminalApp.tsx: Interactive PowerShell console, driver query, remote management    |
|  * LibreOfficeApp.tsx       : Enterprise Office suite with Writer, Calc, and Impress             |
|  * FileExplorerApp.tsx      : Multi-drive file manager (C:, D:) with encrypted volume navigation |
|  * TaskManagerApp.tsx       : Windows 11 Task Manager with process list and performance charts   |
|  * SettingsApp.tsx          : System preferences, wallpaper switcher, and virtualization docs    |
|  * DeveloperDocsApp.tsx     : Comprehensive in-OS documentation viewer for architecture & code   |
+---------------------------------------------------|----------------------------------------------+
                                                    | Subscribes to Engine Telemetry
+---------------------------------------------------|----------------------------------------------+
|                                  CORE SERVICES (src/services/)                                   |
|                                                                                                  |
|  +-----------------------------------------------+   +----------------------------------------+  |
|  |             KernelEngine.ts                   |   |         SystemLogService.ts            |  |
|  | - Singleton Kernel Engine Instance            |   | - Windows Event Viewer Logging Engine  |  |
|  | - Tickless Scheduler Simulation               |   | - Categories: System, Security, App,   |  |
|  | - Real-time CPU, RAM, Disk, Net Telemetry     |   |   Hardware/Drivers                     |  |
|  | - Process & Driver Registry                   |   | - Event IDs: 4624, 7036, 1000, 12, etc |  |
|  | - Dynamic Telemetry Subscribers               |   | - EVTX-compliant JSON Exporter         |  |
|  +-----------------------------------------------+   +----------------------------------------+  |
+---------------------------------------------------|----------------------------------------------+
                                                    | Type Definitions & State Contracts
+---------------------------------------------------|----------------------------------------------+
|                                     DATA TYPES (src/types/os.ts)                                 |
|                                                                                                  |
|  KernelProcess * KernelDriver * SystemTelemetry * SystemLogEvent * AppWindow * DesktopIcon       |
|  NVMeControllerState * USB4ControllerState * GPUPassthroughState * BitLockerDrive                |
+--------------------------------------------------------------------------------------------------+
```

---

## 2. Directory Structure & File Map

```
├── docs/
│   ├── ARCHITECTURE.md          # In-depth architectural specification and system diagrams
│   ├── DRIVERS_AND_KERNEL.md    # Kernel driver specifications, register maps, and DDK manual
│   ├── INSTALLATION.md          # Multi-hypervisor and bare-metal installation instructions
│   ├── RELEASE_NOTES.md         # 24H2 release notes and benchmark comparison tables
│   └── DEVELOPER_GUIDE.md       # (This file) Complete tour of the codebase
├── src/
│   ├── App.tsx                  # Main shell orchestrator, window manager, and hotkey handler
│   ├── main.tsx                 # React DOM root entry point
│   ├── index.css                # Global Tailwind CSS imports and Windows 11 scrollbar styles
│   ├── types/
│   │   └── os.ts                # Core TypeScript interfaces for all kernel entities and apps
│   ├── services/
│   │   ├── kernelEngine.ts      # Singleton kernel engine, telemetry generator, and process registry
│   │   └── systemLogService.ts  # Windows Event Viewer event generator and streaming service
│   └── components/
│       ├── desktop/
│       │   ├── ActionCenter.tsx     # Quick Settings flyout (Wi-Fi, Bluetooth, Volume, Brightness)
│       │   ├── CalendarFlyout.tsx   # Interactive calendar and notification flyout
│       │   ├── Desktop.tsx          # Windows 11 wallpaper, desktop icons, context menu
│       │   ├── LockScreen.tsx       # Windows Spotlight lock screen and PIN login
│       │   ├── RunDialog.tsx        # System Run dialog (Win+R) with fast command presets
│       │   ├── StartMenu.tsx        # Centered Windows 11 Start Menu (Pinned, All Apps, User)
│       │   ├── Taskbar.tsx          # Centered taskbar with Start logo, pills, and system tray
│       │   └── WindowFrame.tsx      # Window container with Windows 11 Snap Layouts and drag/resize
│       └── apps/
│           ├── DeveloperDocsApp.tsx # Interactive documentation & architecture viewer
│           ├── DriverDevKitApp.tsx  # C Driver Development Kit (WDK / DDK)
│           ├── EncryptedDiskApp.tsx # BitLocker volume encryption and TPM 2.0 PCR status
│           ├── EnterpriseTerminalApp.tsx # PowerShell console & remote management
│           ├── FileExplorerApp.tsx  # File Explorer with drive browsing and file launching
│           ├── KernelInspectorApp.tsx # Ring 0 scheduler, IRQL table, memory allocator
│           ├── LibreOfficeApp.tsx   # LibreOffice 24.8 Enterprise suite
│           ├── ResourceMonitorApp.tsx # Windows resmon.exe and Event Viewer suite
│           ├── SettingsApp.tsx      # System settings, wallpaper selector, and VM guides
│           ├── TaskManagerApp.tsx   # Task Manager with process list and performance tabs
│           ├── VirtualizationApp.tsx # QEMU/KVM hypervisor control and hardware metrics
│           ├── VmBootGuideApp.tsx   # Multi-hypervisor installation and boot guide
│           └── Win32ApiApp.tsx      # PE runner, Win32 API testbench, and NT Syscall tracer
├── CONTRIBUTING.md              # Open-source contribution guidelines
├── README.md                    # Primary repository overview
└── metadata.json                # AI Studio application metadata
```

---

## 3. Core Engine Mechanics

### 3.1 Kernel Engine Singleton (`src/services/kernelEngine.ts`)
The `KernelEngine` manages simulated hardware states and process life cycles:
* **Singleton Access:** Acquired via `KernelEngine.getInstance()`.
* **Telemetry Subscription:** Applications subscribe via `engine.subscribeTelemetry((telemetry) => { ... })`.
* **Process Management:**
  * `getProcesses()`: Returns all active processes with PID, CPU %, Memory MB, Priority Class, and Threads.
  * `killProcess(pid: number)`: Terminates a running process and broadcasts updates to subscribers.
  * `addProcess(name, category, memoryMb, cpuPercent)`: Spawns a new process in user mode.
* **Driver Management:**
  * `getDrivers()`: Returns the registered driver list with binary names, IRQL levels, and descriptions.
  * `loadDriver(driver)`: Registers a dynamically compiled driver in the kernel pool.

### 3.2 System Log Engine (`src/services/systemLogService.ts`)
The `SystemLogService` emulates the Windows NT Event Log architecture:
* **Categories:** `System`, `Security`, `Application`, `Hardware/Drivers`.
* **Real-Time Streaming:** Automatically generates realistic Event IDs (4624 Logon, 7036 Service Control, 1000 Application Error, 1 Kernel-Power) at configurable intervals.
* **Exporting:** Supports exporting the current log stream as EVTX-compliant structured JSON.

---

## 4. How to Add a New Application to AegisNT

Adding a new custom application takes four straightforward steps:

### Step 1: Create the Component
Create a new file in `src/components/apps/MyFeatureApp.tsx`:

```tsx
import React, { useState } from 'react';
import { Sparkles, Play } from 'lucide-react';

export default function MyFeatureApp() {
  const [output, setOutput] = useState('System ready');

  return (
    <div className="p-6 bg-slate-950 text-slate-100 h-full flex flex-col font-sans">
      <div className="flex items-center gap-2 mb-4">
        <Sparkles className="w-5 h-5 text-blue-400" />
        <h2 className="text-base font-bold">My Enterprise Feature</h2>
      </div>
      <button
        onClick={() => setOutput(`Executed command at ${new Date().toLocaleTimeString()}`)}
        className="px-4 py-2 bg-blue-600 hover:bg-blue-500 rounded text-xs font-semibold flex items-center gap-2 w-fit"
      >
        <Play className="w-3.5 h-3.5" />
        Execute
      </button>
      <div className="mt-4 p-3 bg-slate-900 border border-slate-800 rounded font-mono text-xs text-blue-300">
        {output}
      </div>
    </div>
  );
}
```

### Step 2: Register in `src/App.tsx`
1. Import your component:
   ```tsx
   import MyFeatureApp from './components/apps/MyFeatureApp';
   ```
2. Add to `appMeta`:
   ```tsx
   my_feature: { 
     title: 'My Enterprise Feature', 
     defaultWidth: 800, 
     defaultHeight: 500 
   },
   ```
3. Add a case to `renderAppContent()`:
   ```tsx
   case 'my_feature':
     return <MyFeatureApp />;
   ```

### Step 3: Add Desktop Icon in `src/components/desktop/Desktop.tsx`
Add your entry to `DESKTOP_ICONS`:
```tsx
{ id: 'icon-myfeature', title: 'My Feature', icon: 'Sparkles', appId: 'my_feature', color: 'blue' },
```

### Step 4: Add to Start Menu in `src/components/desktop/StartMenu.tsx`
Add your entry to the `APPS` array so it appears in the Pinned grid and All Apps drawer.
