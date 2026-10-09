// AegisNT Enterprise Application Compatibility Engine
// Manages Java (OpenJDK 21 / Temurin JVM), .NET 9 CoreCLR, and Windows Win32/Win64/PE runtimes

export interface CompatibilityApp {
  id: string;
  name: string;
  subsystem: 'Java (JVM)' | '.NET (CoreCLR)' | 'Windows (Win32/PE)' | 'Windows (MSI)';
  version: string;
  binaryPath: string;
  description: string;
  status: 'Idle' | 'Starting' | 'Running' | 'Stopped';
  icon: string;
  memoryMb: number;
  cpuPercent: number;
  runtimeDetails: {
    engine: string;
    targetFramework: string;
    jitMode: string;
    gcEngine: string;
    threads: number;
    subsystemFlags: string[];
  };
  sampleOutput: string[];
}

export interface RuntimeSubsystemInfo {
  name: string;
  id: 'java' | 'dotnet' | 'win32';
  version: string;
  vendor: string;
  status: 'Active' | 'Optimized' | 'Standby';
  installedPath: string;
  supportedFormats: string[];
  features: string[];
  telemetry: {
    activeInstances: number;
    allocatedMemoryMb: number;
    jitMethodsCompiled: number;
    totalIoOps: number;
  };
}

export class CompatibilityEngine {
  private static instance: CompatibilityEngine;

  public subsystems: RuntimeSubsystemInfo[] = [
    {
      name: 'OpenJDK 21 LTS / Eclipse Temurin JVM',
      id: 'java',
      version: '21.0.5+11-LTS (HotSpot 64-Bit Server VM)',
      vendor: 'Eclipse Adoptium / Oracle Specification',
      status: 'Active',
      installedPath: 'C:\\Program Files\\Eclipse Adoptium\\jdk-21.0.5-hotspot',
      supportedFormats: ['.jar', '.class', '.war', '.ear', 'jlink runtime images'],
      features: [
        'Tiered JIT Compilation (C1 Client + C2 Server)',
        'Generational ZGC (Sub-millisecond pause times)',
        'Virtual Threads (Project Loom lightweight concurrency)',
        'Foreign Function & Memory API (Direct NT HAL DMA access)',
        'Java Native Interface (JNI) AegisNT Syscall Bridge'
      ],
      telemetry: {
        activeInstances: 2,
        allocatedMemoryMb: 512,
        jitMethodsCompiled: 14280,
        totalIoOps: 248900
      }
    },
    {
      name: '.NET 9.0 Enterprise CoreCLR & Framework Interop',
      id: 'dotnet',
      version: '9.0.100 (CoreCLR 9.0.24.52809)',
      vendor: 'Microsoft .NET Foundation / AegisNT Port',
      status: 'Active',
      installedPath: 'C:\\Program Files\\dotnet\\shared\\Microsoft.NETCore.App\\9.0.0',
      supportedFormats: ['.dll (MSIL)', '.exe (CIL PE32+)', 'Native AOT ELF/PE', 'NuGet Packages (.nupkg)'],
      features: [
        'RyuJIT 64-Bit Dynamic PGO (Profile-Guided Optimization)',
        'WPF & Windows Forms Compositor Shim (win32k.sys bridge)',
        'ASP.NET Core Kestrel High-Throughput HTTP/3 Server',
        'Mono / .NET Framework 4.8 Backward Compatibility Shim',
        'P/Invoke Direct NT Syscall Acceleration (Zero Marshaling Overhead)'
      ],
      telemetry: {
        activeInstances: 3,
        allocatedMemoryMb: 680,
        jitMethodsCompiled: 21540,
        totalIoOps: 412000
      }
    },
    {
      name: 'Windows Win32 / Win64 WOW64 & Wine 9.x Subsystem',
      id: 'win32',
      version: 'Wine 9.18-Proton Staging / NT Subsystem 10.0.26100',
      vendor: 'AegisNT Microkernel Executive Subsystem',
      status: 'Active',
      installedPath: 'C:\\Windows\\System32 & C:\\Windows\\SysWOW64',
      supportedFormats: ['.exe (PE32 / PE32+)', '.dll', '.msi (Windows Installer)', '.sys (Drivers)'],
      features: [
        'Full PE/COFF Binary Relocation & IAT Resolution',
        'WOW64 32-bit x86 to 64-bit x86_64 Thunking Layer',
        'Direct3D 11 & 12 to Vulkan Translation (DXVK / VKD3D-Proton)',
        'Native Windows Registry Engine (HKLM, HKCU, HKCR)',
        'User32 / GDI32 Compositor Integration into DWM Glass UI'
      ],
      telemetry: {
        activeInstances: 5,
        allocatedMemoryMb: 1140,
        jitMethodsCompiled: 0,
        totalIoOps: 894000
      }
    }
  ];

  public sampleApps: CompatibilityApp[] = [
    // Java Apps
    {
      id: 'spring-boot-api',
      name: 'Spring Boot 3.3 Enterprise Gateway',
      subsystem: 'Java (JVM)',
      version: '3.3.4 Enterprise',
      binaryPath: 'C:\\Program Files\\Java\\apps\\springboot-enterprise-gateway.jar',
      description: 'Production REST API gateway & OAuth2 token validation microservice with embedded Netty/Tomcat server.',
      status: 'Idle',
      icon: 'Coffee',
      memoryMb: 248,
      cpuPercent: 1.4,
      runtimeDetails: {
        engine: 'OpenJDK 21 LTS HotSpot 64-Bit',
        targetFramework: 'Java 21 Bytecode (Class version 65.0)',
        jitMode: 'TieredCompilation (C1 + C2)',
        gcEngine: 'Generational ZGC (-XX:+UseZGC)',
        threads: 48,
        subsystemFlags: ['-Xms128m', '-Xmx1024m', '-XX:+UseZGC', '-Dserver.port=8080']
      },
      sampleOutput: [
        '  .   ____          _            __ _ _',
        ' /\\\\ / ___`_\'_ __ _ _(_)_ __  __ _ \\ \\ \\ \\',
        '( ( )\\___ | \'_ | \'_| | \'_ \\/ _` | \\ \\ \\ \\',
        ' \\\\/  ___)| |_)| | | | | || (_| |  ) ) ) )',
        '  \'  |____| .__|_| |_|_| |_\\__, | / / / /',
        '=========|_|==============|___/=/_/_/_/',
        ':: Spring Boot ::                (v3.3.4)',
        '2026-10-08 11:20:01.412  INFO: Starting SpringBootGatewayApplication using Java 21.0.5 on AegisNT',
        '2026-10-08 11:20:02.104  INFO: Netty HTTP/2 listener started on port 8080 (SSL/TLS 1.3 Active)',
        '2026-10-08 11:20:02.580  INFO: Loaded 14 REST Controllers | ZGC Active with 0.14ms max pause time',
        '2026-10-08 11:20:03.011  INFO: JVM Ready in 1.599 seconds (process running in AegisNT microkernel)'
      ]
    },
    {
      id: 'java-gui-erp',
      name: 'Aegis JavaFX Enterprise ERP Client',
      subsystem: 'Java (JVM)',
      version: '21.0.2',
      binaryPath: 'C:\\Program Files\\Java\\apps\\aegis-erp-workbench.jar',
      description: 'Cross-platform financial and inventory accounting client rendered via Hardware Direct3D / OpenGL pipeline.',
      status: 'Idle',
      icon: 'Layers',
      memoryMb: 185,
      cpuPercent: 0.8,
      runtimeDetails: {
        engine: 'Eclipse Temurin OpenJDK 21',
        targetFramework: 'JavaFX 21 + Java 21',
        jitMode: 'HotSpot C2 Server Compiler',
        gcEngine: 'G1 Garbage Collector',
        threads: 18,
        subsystemFlags: ['-Dprism.order=d3d,sw', '-Djavafx.cachedir=C:\\Temp']
      },
      sampleOutput: [
        '[JavaFX Runtime] Prism pipeline init: Direct3D 11 via WDDM 3.2 Passthrough',
        '[AegisERP] Connected to PostgreSQL Enterprise cluster at 127.0.0.1:5432',
        '[AegisERP] Loaded 4,800 active inventory ledger records in 64ms',
        '[AegisERP] UI rendering @ 120 FPS with hardware font rasterization'
      ]
    },
    {
      id: 'minecraft-paper',
      name: 'PaperMC Java High-Throughput Server',
      subsystem: 'Java (JVM)',
      version: '1.21.3 Build 49',
      binaryPath: 'C:\\Program Files\\Java\\apps\\paper-1.21.3.jar',
      description: 'High-performance multiplayer server utilizing Project Loom virtual threads and Aikar GC flags.',
      status: 'Idle',
      icon: 'Box',
      memoryMb: 512,
      cpuPercent: 3.2,
      runtimeDetails: {
        engine: 'OpenJDK 21 LTS 64-Bit',
        targetFramework: 'Java 21 Classfiles',
        jitMode: 'C2 Server JIT',
        gcEngine: 'Aikar G1GC Optimized',
        threads: 32,
        subsystemFlags: ['-Xms4G', '-Xmx4G', '-XX:+AlwaysPreTouch', '-XX:+UseG1GC']
      },
      sampleOutput: [
        '[Server thread/INFO]: Starting paper server version 1.21.3-49-master',
        '[Server thread/INFO]: Loading dimension minecraft:overworld...',
        '[Server thread/INFO]: Preparing start region for dimension minecraft:overworld',
        '[Server thread/INFO]: Time elapsed: 1420 ms | TPS: 20.00 (Tick time: 8.4ms)',
        '[Server thread/INFO]: Done (2.108s)! For help, type "help"'
      ]
    },

    // .NET Apps
    {
      id: 'dotnet-aspnet-api',
      name: 'ASP.NET Core 9 Cloud Order API',
      subsystem: '.NET (CoreCLR)',
      version: '9.0.100',
      binaryPath: 'C:\\Program Files\\dotnet\\apps\\OrderManagement.Api.dll',
      description: 'Ultra-low latency microservice utilizing ASP.NET Core Kestrel, Entity Framework Core 9, and Native AOT.',
      status: 'Idle',
      icon: 'Flame',
      memoryMb: 140,
      cpuPercent: 1.1,
      runtimeDetails: {
        engine: '.NET 9.0 CoreCLR (RyuJIT)',
        targetFramework: 'net9.0 (C# 13.0)',
        jitMode: 'Dynamic PGO (Profile-Guided Optimization)',
        gcEngine: 'Server GC (Non-concurrent Low Latency)',
        threads: 24,
        subsystemFlags: ['DOTNET_TieredPGO=1', 'ASPNETCORE_URLS=http://+:5000', 'DOTNET_EnableWriteXorExecute=1']
      },
      sampleOutput: [
        'info: Microsoft.Hosting.Lifetime[14]',
        '      Now listening on: http://0.0.0.0:5000',
        'info: Microsoft.Hosting.Lifetime[0]',
        '      Application started. Press Ctrl+C to shut down.',
        'info: Microsoft.Hosting.Lifetime[0]',
        '      Hosting environment: Production',
        'info: Microsoft.Hosting.Lifetime[0]',
        '      Content root path: C:\\Program Files\\dotnet\\apps',
        'info: OrderManagement.Api.Metrics[1]',
        '      RyuJIT Dynamic PGO hot-paths generated: 842 methods | RPS: 42,500'
      ]
    },
    {
      id: 'dotnet-wpf-dashboard',
      name: 'WPF Enterprise Executive Dashboard',
      subsystem: '.NET (CoreCLR)',
      version: '9.0.0 WPF Desktop',
      binaryPath: 'C:\\Program Files\\dotnet\\apps\\ExecutiveDashboard.Wpf.exe',
      description: 'Windows Presentation Foundation rich desktop application with XAML vector rendering and DirectWrite.',
      status: 'Idle',
      icon: 'Monitor',
      memoryMb: 210,
      cpuPercent: 1.5,
      runtimeDetails: {
        engine: '.NET 9.0 Desktop Runtime',
        targetFramework: 'net9.0-windows10.0.26100',
        jitMode: 'RyuJIT + ReadyToRun (R2R)',
        gcEngine: 'Workstation GC with Background Collection',
        threads: 16,
        subsystemFlags: ['COMPLUS_EnableAVX512=1', 'WPF_DirectX_RenderMode=Hardware']
      },
      sampleOutput: [
        '[WPF Compositor] PresentationCore initialized with DWM Glass rendering',
        '[WPF Compositor] Direct3D 11 hardware acceleration device created successfully',
        '[ExecutiveDashboard] Data binding initialized for 12 realtime KPI widgets',
        '[ExecutiveDashboard] Hardware vector graphics rendering @ 144 Hz display refresh'
      ]
    },
    {
      id: 'dotnet-winforms-legacy',
      name: 'Windows Forms Enterprise POS & Barcode',
      subsystem: '.NET (CoreCLR)',
      version: '8.0.8 WinForms',
      binaryPath: 'C:\\Program Files\\dotnet\\apps\\LegacyPointOfSale.exe',
      description: 'Classic WinForms business line-of-business tool with high-DPI Per-Monitor V2 scaling and COM serial port access.',
      status: 'Idle',
      icon: 'Table',
      memoryMb: 95,
      cpuPercent: 0.5,
      runtimeDetails: {
        engine: '.NET 8.0 Windows Desktop Subsystem',
        targetFramework: 'net8.0-windows (WinForms)',
        jitMode: 'RyuJIT standard',
        gcEngine: 'Workstation GC',
        threads: 8,
        subsystemFlags: ['EnableWindowsFormsHighDpiAutoResizing=true']
      },
      sampleOutput: [
        '[WinForms] Application.EnableVisualStyles() active with Windows 11 Fluent Theme',
        '[WinForms] SetHighDpiMode(HighDpiMode.PerMonitorV2) applied (Scale: 150%)',
        '[WinForms] PointOfSale main form loaded with 34 user controls',
        '[WinForms] Serial scanner COM3 bound and ready for barcode telemetry'
      ]
    },

    // Windows Win32/PE Apps
    {
      id: 'win32-libreoffice',
      name: 'LibreOffice 24.8 Enterprise Suite',
      subsystem: 'Windows (Win32/PE)',
      version: '24.8.2.1 (Win64 PE32+)',
      binaryPath: 'C:\\Program Files\\LibreOffice\\program\\soffice.exe',
      description: 'Comprehensive office productivity suite (Writer, Calc, Impress) running native Win64 PE binary with full OLE/COM support.',
      status: 'Idle',
      icon: 'FileText',
      memoryMb: 340,
      cpuPercent: 2.1,
      runtimeDetails: {
        engine: 'AegisNT WOW64 / Wine 9.x Subsystem',
        targetFramework: 'Native Windows PE32+ (x86_64)',
        jitMode: 'Native Machine Code Execution',
        gcEngine: 'C/C++ CRT Heap (VirtualAlloc / HeapAlloc)',
        threads: 28,
        subsystemFlags: ['WS_OVERLAPPEDWINDOW', 'IMAGE_SUBSYSTEM_WINDOWS_GUI', 'ASLR_HIGH_ENTROPY']
      },
      sampleOutput: [
        '[PE Loader] Mapping image C:\\Program Files\\LibreOffice\\program\\soffice.exe (Base: 0x00007FF7B0000000)',
        '[IAT Resolver] Bound kernel32.dll, user32.dll, gdi32.dll, advapi32.dll, ole32.dll',
        '[VMM] Committed 64MB working set with PAGE_EXECUTE_READ on .text section',
        '[win32k.sys] CreateWindowExW HWND 0x000802C4 assigned to LibreOffice Desktop',
        '[LibreOffice] Document engine initialized in 210ms'
      ]
    },
    {
      id: 'win32-notepad-plus',
      name: 'Notepad++ Enterprise Source Editor',
      subsystem: 'Windows (Win32/PE)',
      version: '8.6.9 (Win64 PE32+)',
      binaryPath: 'C:\\Program Files\\Notepad++\\notepad++.exe',
      description: 'High-speed code editor written in pure Win32 C++ and Scintilla editing component.',
      status: 'Idle',
      icon: 'Code',
      memoryMb: 42,
      cpuPercent: 0.2,
      runtimeDetails: {
        engine: 'Native Win32 Subsystem',
        targetFramework: 'Win32 C++ / Scintilla',
        jitMode: 'Native Machine Code',
        gcEngine: 'Win32 HeapAlloc',
        threads: 6,
        subsystemFlags: ['WS_EX_ACCEPTFILES', 'DPI_AWARENESS_PER_MONITOR_AWARE_V2']
      },
      sampleOutput: [
        '[PE Loader] Scintilla.dll mapped at 0x00007FFD98000000',
        '[Notepad++] RegisterClassExW("Notepad++") succeeded',
        '[Notepad++] Plugin manager scanned 8 plugins with 0 conflicts',
        '[Notepad++] Session restored: 4 tabs opened in 18ms'
      ]
    },
    {
      id: 'win32-7zip',
      name: '7-Zip 24 Enterprise Archiver',
      subsystem: 'Windows (Win32/PE)',
      version: '24.08 (Win64)',
      binaryPath: 'C:\\Program Files\\7-Zip\\7zFM.exe',
      description: 'High-compression multi-threaded archiving engine with AES-256 encryption and shell extension support.',
      status: 'Idle',
      icon: 'Archive',
      memoryMb: 28,
      cpuPercent: 0.4,
      runtimeDetails: {
        engine: 'Native Win32 Subsystem',
        targetFramework: 'Win32 Native C++',
        jitMode: 'AVX2 / AES-NI Optimized ASM',
        gcEngine: 'Direct VirtualAlloc',
        threads: 12,
        subsystemFlags: ['IMAGE_FILE_LARGE_ADDRESS_AWARE', 'SHELL32_DRAGDROP']
      },
      sampleOutput: [
        '[7-Zip] Hardware AES-NI and AVX2 CPU instructions detected',
        '[7-Zip] 7z.dll loaded with LZMA2 multithreading engine',
        '[7-Zip] File manager interface bound to AegisFS namespace'
      ]
    },
    {
      id: 'win-msi-installer',
      name: 'Windows Installer Subsystem (msiexec.exe)',
      subsystem: 'Windows (MSI)',
      version: '5.0.26100',
      binaryPath: 'C:\\Windows\\System32\\msiexec.exe',
      description: 'Enterprise transactional software installation service supporting silent deployments, rollbacks, and GPO policies.',
      status: 'Idle',
      icon: 'Download',
      memoryMb: 65,
      cpuPercent: 0.8,
      runtimeDetails: {
        engine: 'Windows Installer Service (msiserver)',
        targetFramework: 'Microsoft Standard Installer Database',
        jitMode: 'Transactional Relational Engine',
        gcEngine: 'NT Heap',
        threads: 10,
        subsystemFlags: ['TRANSACTION_ISOLATION_SERIALIZABLE', 'ALLUSERS=1']
      },
      sampleOutput: [
        '[msiexec] Windows Installer service started (Process ID: 2940)',
        '[msiexec] Opening package: EnterpriseSecuritySuite.msi',
        '[msiexec] Validating digital signature: Microsoft Authenticode & Aegis Enterprise CA',
        '[msiexec] Action start: CostInitialize -> FileCost -> InstallValidate',
        '[msiexec] Transaction successfully committed: 142 files registered, 18 registry keys set'
      ]
    }
  ];

  public static getInstance(): CompatibilityEngine {
    if (!CompatibilityEngine.instance) {
      CompatibilityEngine.instance = new CompatibilityEngine();
    }
    return CompatibilityEngine.instance;
  }
}
