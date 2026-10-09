# AegisNT Enterprise Application Compatibility Guide
## Java 21 LTS JVM, .NET 9 CoreCLR & Native Windows Win32/PE Subsystems

**Document ID:** GUIDE-APP-COMPAT-2026-v4.2  
**Applicability:** AegisNT Enterprise Microkernel / Windows 11 Build  
**Subsystems Covered:** OpenJDK 21 LTS, .NET 9.0 CoreCLR, Windows PE32/PE32+ (Wine 9.x WOW64)  
**Security Classification:** Enterprise Production Standard  

---

## 1. Executive Summary

AegisNT is engineered with a **triple-runtime enterprise compatibility architecture**. Rather than restricting the operating system to a single binary format, AegisNT implements direct kernel executive bridges and hardware-accelerated runtimes for:

1. **Java Ecosystem (JVM)**: OpenJDK 21 LTS / Eclipse Temurin with HotSpot C1/C2 Tiered JIT, Project Loom virtual threads, and Generational ZGC.
2. **.NET Ecosystem (CoreCLR)**: Microsoft .NET 9.0 with RyuJIT Dynamic Profile-Guided Optimization (PGO), Native AOT compilation, and complete desktop UI interop (WPF, Windows Forms, WinUI 3).
3. **Windows Ecosystem (Win32 / Win64 / PE / MSI)**: Full Portable Executable (PE/COFF) loader, WOW64 32-to-64 bit execution thunking, DirectX 11 & 12 translation via DXVK / VKD3D-Proton, and transactional Windows Installer (`msiexec.exe`) services.

All runtimes execute inside protected address spaces with **$W \oplus X$ memory enforcement**, hardware-enforced code integrity (**HVCI**), and tickless microkernel scheduling.

---

## 2. Pillar 1: Java Virtual Machine (OpenJDK 21 LTS)

### 2.1 Runtime Specifications
- **Vendor:** Eclipse Adoptium (Temurin-21.0.5+11-LTS) / Oracle Java Specification
- **Engine:** HotSpot 64-Bit Server VM
- **Default Installation:** `C:\Program Files\Eclipse Adoptium\jdk-21.0.5-hotspot`
- **Supported Formats:** `.jar`, `.class`, `.war`, `.ear`, and `jlink` custom modular runtime images.

### 2.2 Key Technologies & Kernel Integration
- **Generational ZGC (`-XX:+UseZGC`):** Ultra-scalable garbage collector maintaining maximum stop-the-world pause times under **1 millisecond**, even on multi-terabyte heap configurations.
- **Project Loom Virtual Threads:** Lightweight user-mode threads scheduled onto carrier kernel threads, allowing millions of concurrent HTTP/REST or WebSocket connections with minimal memory footprint.
- **Foreign Function & Memory (FFM) API:** Replaces fragile JNI code with type-safe, direct memory access to AegisNT PCIe 5.0 NVMe queues and HAL DMA channels.
- **Tiered JIT Compilation:** C1 compiler provides instant sub-second application launch; C2 server compiler dynamically optimizes hot loops with AVX-512 and BMI2 vector instructions.

### 2.3 Verified Applications
| Application | Type | Execution Command | Status |
|:---|:---|:---|:---|
| **Spring Boot 3.3 Gateway** | Microservice / REST API | `java -jar springboot-enterprise-gateway.jar` | Production Certified |
| **Aegis ERP Workbench** | JavaFX 21 Enterprise GUI | `java -jar aegis-erp-workbench.jar` | 120 FPS Direct3D Accelerated |
| **Apache Kafka Connector** | Message Streaming | `java -cp "lib/*:kafka.jar" io.confluent.Worker` | Sub-millisecond Latency |
| **PaperMC Server 1.21** | High-Throughput Server | `java -Xms4G -Xmx4G -jar paper-1.21.3.jar` | 20.0 TPS Sustained |

### 2.4 Command-Line Usage
```bash
# Verify installed JVM version and AegisNT HAL bridge
java -version

# Execute a packaged enterprise JAR archive
java -XX:+UseZGC -Xms512m -Xmx4096m -jar my-enterprise-app.jar

# Compile source files with Java 21 features
javac -d ./target/classes src/com/enterprise/*.java

# Disassemble bytecode to inspect JIT compiler optimization
javap -c -p ./target/classes/com/enterprise/MyService.class
```

---

## 3. Pillar 2: .NET 9.0 CoreCLR & Framework Subsystem

### 3.1 Runtime Specifications
- **Vendor:** Microsoft .NET Foundation / AegisNT Port
- **Engine:** CoreCLR 9.0.24.52809 with RyuJIT 64-Bit Compiler
- **Default Installation:** `C:\Program Files\dotnet\shared\Microsoft.NETCore.App\9.0.0`
- **Supported Frameworks:** `net9.0`, `net8.0`, `net7.0`, `net48` (via mono/wine shim), and Native AOT.

### 3.2 Key Technologies & UI Interop
- **RyuJIT Dynamic PGO:** Profile-Guided Optimization observes method execution patterns during runtime and automatically re-JITs hot paths with optimal register allocation, devirtualization, and loop unrolling.
- **WPF & Windows Forms Compositor:** Direct integration with `win32k.sys` display pipeline. Windows Presentation Foundation (WPF) XAML rendering uses Direct3D 11 hardware swapchains for fluid 144Hz animations.
- **Kestrel Web Server:** Native support for HTTP/1.1, HTTP/2, and HTTP/3 (QUIC) with zero memory allocations on request pipelines.
- **P/Invoke Syscall Fast-Path:** Calls from C# directly invoke AegisNT NT Executive syscall numbers (`NtCreateFile`, `NtDeviceIoControlFile`) without C-runtime marshaling overhead.

### 3.3 Verified Applications
| Application | Type | Execution Command | Status |
|:---|:---|:---|:---|
| **Cloud Order API** | ASP.NET Core 9 Minimal API | `dotnet OrderManagement.Api.dll` | 42,500 RPS |
| **Executive Dashboard** | WPF DirectWrite GUI | `ExecutiveDashboard.Wpf.exe` | Hardware Accelerated |
| **Point Of Sale Terminal** | Windows Forms (WinForms) | `LegacyPointOfSale.exe` | High-DPI V2 Scaled |
| **Native AOT Worker** | Single-File Binary | `./TelemetryPipelineWorker.exe` | 8ms Cold Boot |

### 3.4 Command-Line Usage
```powershell
# Query .NET SDK and runtime telemetry
dotnet --info

# Run a project from source code
dotnet run --project ./src/OrderService/OrderService.csproj

# Build self-contained release package targeting AegisNT x64
dotnet publish -c Release -r win-x64 --self-contained true -p:PublishSingleFile=true
```

---

## 4. Pillar 3: Windows Win32, Win64, PE & MSI Subsystems

### 4.1 Subsystem Specifications
- **Architecture:** PE/COFF Portable Executable Subsystem + Wine 9.18 Proton Staging Layer
- **Binary Compatibility:** Native PE32 (32-bit x86 via WOW64) & PE32+ (64-bit x86_64 / ARM64)
- **Graphics Pipeline:** Direct3D 9, 10, 11, 12, OpenGL 4.6, and Vulkan 1.3
- **Installer Service:** Microsoft Standard Installer (`msiexec.exe`) version 5.0.26100

### 4.2 Portable Executable (PE) Loader Pipeline
1. **Header Validation:** Verifies `IMAGE_DOS_HEADER` (`MZ`) and `IMAGE_NT_HEADERS` (`PE\0\0`).
2. **Virtual Memory Allocation:** Maps `.text` (PAGE_EXECUTE_READ), `.rdata` (PAGE_READONLY), and `.data` (PAGE_READWRITE) sections into isolated VMM regions.
3. **Import Address Table (IAT) Binding:** Resolves symbols for `kernel32.dll`, `user32.dll`, `gdi32.dll`, `advapi32.dll`, `ole32.dll`, and `shell32.dll`.
4. **ASLR Relocation:** Applies base relocations if the preferred image base is occupied.
5. **Entry Point Dispatch:** Transfers execution to `AddressOfEntryPoint` with thread priority set by the NT scheduler.

### 4.3 Verified Applications
| Application | Format | Binary Path | Subsystem |
|:---|:---|:---|:---|
| **LibreOffice 24.8 Suite** | PE32+ (64-bit) | `C:\Program Files\LibreOffice\program\soffice.exe` | Win64 GUI |
| **Notepad++ 8.6** | PE32+ (64-bit) | `C:\Program Files\Notepad++\notepad++.exe` | Scintilla Win32 |
| **7-Zip 24 Archiver** | PE32+ (64-bit) | `C:\Program Files\7-Zip\7zFM.exe` | AVX2 / AES-NI ASM |
| **Enterprise Security Tools** | MSI Installer | `C:\Program Files\Win32Apps\EnterpriseSecurityTools.msi` | msiserver |

### 4.4 Command-Line Usage
```cmd
# Run any Windows 32-bit or 64-bit executable
wine64 "C:\Program Files\LibreOffice\program\soffice.exe"

# Install an enterprise MSI package silently
msiexec /i "C:\Setup\EnterpriseSecurityTools.msi" /quiet /norestart

# Launch command line with specific Windows compatibility level
set WINEARCH=win64
set WINEVERSION=win11
wine your_custom_app.exe
```

---

## 5. Security & Zero-Reboot Hotpatching Across All Runtimes

All three application subsystems inherit AegisNT enterprise security guardrails:

- **Hypervisor-Enforced Code Integrity (HVCI):** Prevents unsigned or malicious dynamically generated machine code from executing outside validated JIT compiler memory pages.
- **W^X Page Protection:** Memory pages are never both writable and executable simultaneously. HotSpot JIT and RyuJIT use thread-local state switching (`pthread_jit_write_protect` / `VirtualProtect`) to commit code.
- **Zero-Reboot Hotpatching:** Vulnerable shared libraries (e.g., OpenSSL, Log4j classfiles, .NET BCL assemblies) can be patched in memory using live code splicing without interrupting running services.

---

## 6. Accessing the In-OS GUI Tools

- **App Compatibility Center:** Open the **App Compatibility Suite** icon on the desktop or Start Menu to launch sample Java, .NET, and Windows applications, tune JVM/CLR flags, inspect bytecode, and test commands in the universal CLI.
- **Run Dialog (`Win + R`):** Type `java`, `dotnet`, `compat`, `clr`, or `wine` to launch the compatibility suite immediately.
- **File Explorer:** Navigate to `C:\Program Files\Java\apps` or `C:\Program Files\dotnet\apps` and double-click any `.jar`, `.dll`, or `.exe` to run it.
- **Enterprise Terminal:** Type `java -version`, `dotnet --info`, or `wine [app]` directly in PowerShell or Command Prompt.
