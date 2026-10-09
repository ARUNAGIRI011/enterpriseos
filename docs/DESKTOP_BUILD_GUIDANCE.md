# Windows 11 Build Desktop Guidance & Architecture Specification

**Document ID:** GUIDE-WIN11-BUILD-DESKTOP-24H2  
**Classification:** Enterprise Operating System Desktop Guidance  
**Target OS Build:** Windows 11 Enterprise 24H2 (OS Build 26100.1882) / AegisNT Microkernel  
**Compositor:** Desktop Window Manager (DWM) with WDDM 3.2 Display Pipeline  

---

## 1. Executive Summary & Purpose

This document provides complete technical, operational, and user guidance for the **Windows 11 Build Desktop Environment** powered by the AegisNT microkernel. It serves as both:
1. **End-User Desktop Guidance:** How to navigate the centered taskbar, Start Menu, Snap Layouts, Action Center, and run custom applications.
2. **Developer & Systems Engineer Guidance:** How the desktop shell is engineered, including the Desktop Window Manager (DWM), Mica/Acrylic material rendering, process isolation, virtual desktops, and NT subsystem thunking.

---

## 2. Windows 11 Desktop Shell Architecture

The desktop shell is architected as a layered user-mode environment sitting above the NT Executive and Hardware Abstraction Layer (HAL):

```
+-------------------------------------------------------------------------+
|                  Windows 11 User Shell (Ring 3)                         |
|  [Centered Taskbar]  [Fluent Start Menu]  [Snap Assist]  [Quick Settings] |
+-------------------------------------------------------------------------+
                                    |
                                    v
+-------------------------------------------------------------------------+
|              Desktop Window Manager (dwm.exe / WDDM 3.2)                |
|  - Hardware Accelerated GPU Scheduling                                  |
|  - Mica Opacity Pipeline (Wall-Paper Bloom Convolution)                  |
|  - Sub-pixel ClearType Antialiasing & 120Hz/144Hz Dynamic Refresh Rate  |
|  - Vector Snap Layout Grid Calculations (0.05ms Latency)                |
+-------------------------------------------------------------------------+
                                    |
                                    v
+-------------------------------------------------------------------------+
|            Win32 Subsystem & Wine 9.x Compatibility Core                |
|  - csrss.exe (Client/Server Runtime Subsystem)                          |
|  - win32u.sys / user32.dll / gdi32.dll / kernelbase.dll                 |
|  - Portable Executable (PE32+ / COFF) Loader & Relocation Engine        |
+-------------------------------------------------------------------------+
                                    |
                                    v
+-------------------------------------------------------------------------+
|                AegisNT Microkernel (ntoskrnl.exe - Ring 0)               |
|  - Preemptive IRQL Thread Scheduler (0 to 31)                           |
|  - Virtual Memory Manager (PML4 / PML5 Paging Tables)                   |
|  - Object Manager & Security Reference Monitor                          |
|  - BitLocker AES-XTS-256 Full Volume Encryption (aegis_bitlocker_fve)   |
+-------------------------------------------------------------------------+
```

---

## 3. Desktop Shell Key Components

### 3.1 Centered Taskbar & Start Menu
* **Ergonomics:** Pinned applications and the Start button are centered by default, minimizing eye and cursor travel on modern ultrawide and 16:10 laptop displays.
* **Alignment Toggling:** Users can switch between **Center** and **Left** alignment via Taskbar Settings or `win11guidance.exe`.
* **Process Separation:** The taskbar runs as an independent host, isolated from individual app failures. If an application hangs, the taskbar and DWM remain responsive at 60+ FPS.

### 3.2 Windows 11 Snap Layouts & Snap Groups
* **Activation:** Hover over any window's square **Maximize** button or press `Win + Z`.
* **Supported Layouts:**
  * **2-Split (50% / 50%):** Standard side-by-side view for document comparison or coding vs. terminal.
  * **3-Column Split (33% / 33% / 33%):** Triage view for communications, IDE, and live logs.
  * **4-Quadrant Grid (2x2):** Multi-dashboard telemetry monitoring (CPU, Network, GPU, Disk).
  * **Left-Focus Split (66.6% / 33.3%):** Primary workspace with a dedicated auxiliary side pane.

### 3.3 Action Center & Quick Settings Flyout (`Win + A`)
* Quick access to Wi-Fi 7 connections, Bluetooth 5.4, Master Volume, Display Brightness, Airplane Mode, and ACPI Battery Performance profiles.

### 3.4 Calendar & Notification Flyout (`Win + N`)
* Real-time Gregorian calendar with enterprise event syncing, notification silencing (Focus Assist), and ACPI system timekeeping.

---

## 4. Running Custom Applications Guidance

Users can deploy and execute software on this build through three dedicated pathways:

### Pathway A: Native Win32 Portable Executables (.exe)
1. Supported binary formats: 64-bit PE32+ (x86_64) and ARM64 COFF.
2. The NT subsystem loads the binary headers, maps sections (`.text`, `.rdata`, `.data`), resolves import address tables (IAT) via Wine 9.x DLLs (`kernel32.dll`, `user32.dll`, `shell32.dll`), and transfers execution to the entry point.
3. Execution command in Terminal:
   ```powershell
   wine64 C:\Path\To\YourApp.exe
   ```

### Pathway B: Windows Terminal & Command Line Scripting
1. Launch Windows Terminal (`Win + X` -> Terminal, or `Win + R` -> `wt`).
2. Run PowerShell 7 scripts (`.ps1`), batch files (`.bat`/`.cmd`), or Python/Node.js workloads:
   ```powershell
   # Compile and test C driver or application
   x86_64-w64-mingw32-gcc -O2 -mwindows app.c -o app.exe -luser32 -lgdi32
   ./app.exe
   ```

### Pathway C: Hypervisor Guest & Container Deployment
1. Open **QEMU / KVM Hypervisor** (`virt.exe`) or **VM Boot Guide** (`vmboot.exe`).
2. Mount custom ISO or disk image (`.qcow2`, `.vmdk`, `.vhdx`).
3. Boot guest OS with hardware passthrough (VFIO GPU, NVMe controller, VirtIO network).

---

## 5. Laptop & Virtual Machine Hardware Recommendations

| Parameter | Minimum Requirement | Recommended (Enterprise Production) |
|---|---|---|
| **Architecture** | x86_64 or ARM64 (AArch64) | AMD Zen 4/5, Intel Core Ultra, or ARM Neoverse |
| **vCPUs / Cores** | 2 Virtual CPUs | 4 - 8 Physical Cores |
| **System Memory** | 4 GB DDR4 / DDR5 | 8 GB - 16 GB ECC DDR5 |
| **Disk Controller** | AHCI SATA (20 GB) | NVMe 2.0 or VirtIO-SCSI (60 GB+ SSD) |
| **Firmware Mode** | UEFI (OVMF / EDK2) | UEFI with TPM 2.0 Emulation (swtpm) |
| **Display Pipeline** | SVGA 1024x768 | WDDM 3.2 / VirtIO-GPU 1920x1080 @ 120Hz |
| **Battery Management**| ACPI S3 Standby | ACPI S0ix Modern Standby with Lid Sensors |

---

## 6. Keyboard Shortcuts Quick Reference

* `Win + R`: Open Run Dialog (`resmon`, `vmboot`, `guidance`, `taskmgr`, `explorer`, `winver`)
* `Win + E`: Open File Explorer (AegisFS and encrypted partitions)
* `Win + X`: Open Power User Quick Link Menu
* `Win + A`: Open Action Center / Quick Settings
* `Win + N`: Open Calendar and Notification Center
* `Win + Z`: Open Snap Layouts Assist
* `Win + D`: Show / Hide Desktop
* `Win + L`: Lock workstation session
* `Ctrl + Shift + Esc`: Open Task Manager Enterprise
* `Alt + Tab`: Switch between open windows

---

## 7. Interactive Tools Included in This Build

* **Windows 11 Desktop Guidance (`win11guidance.exe`)**: Interactive guided tours, snap simulators, and app execution test benches.
* **Resource Monitor & Event Viewer (`resmon.exe`)**: Real-time memory, IOPS, and system log event inspector.
* **VM Boot & Setup Guide (`vmboot.exe`)**: Ready-to-copy launch scripts for QEMU, VirtualBox, VMware, and Proxmox.
* **Developer Docs (`devdocs.exe`)**: Kernel architecture specifications, driver manuals, and contribution workflows.
