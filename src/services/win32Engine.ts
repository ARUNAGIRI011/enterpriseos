export interface Win32ApiFunction {
  dll: string;
  name: string;
  category: string;
  signature: string;
  description: string;
  wineStatus: 'Native NT-Mapped' | 'Wine Implemented' | 'Thunked to HAL';
  parameters: Array<{ name: string; type: string; desc: string }>;
  returnType: string;
  exampleCpp: string;
}

export interface ApiTraceLog {
  id: string;
  timestamp: string;
  dll: string;
  functionName: string;
  params: string;
  result: string;
  durationMs: number;
  threadId: number;
}

export const WIN32_API_CATALOG: Win32ApiFunction[] = [
  {
    dll: 'kernel32.dll',
    name: 'CreateProcessW',
    category: 'Process & Thread Management',
    signature: 'BOOL CreateProcessW(LPCWSTR lpApplicationName, LPWSTR lpCommandLine, LPSECURITY_ATTRIBUTES lpProcessAttributes, LPSECURITY_ATTRIBUTES lpThreadAttributes, BOOL bInheritHandles, DWORD dwCreationFlags, LPVOID lpEnvironment, LPCWSTR lpCurrentDirectory, LPSTARTUPINFOW lpStartupInfo, LPPROCESS_INFORMATION lpProcessInformation)',
    description: 'Creates a new process and its primary thread. Routed directly to NtCreateUserProcess in ntdll via Aegis NT Executive.',
    wineStatus: 'Native NT-Mapped',
    parameters: [
      { name: 'lpApplicationName', type: 'LPCWSTR', desc: 'The name of the module to be executed.' },
      { name: 'dwCreationFlags', type: 'DWORD', desc: 'Flags controlling priority class and process creation mode.' },
      { name: 'lpProcessInformation', type: 'LPPROCESS_INFORMATION', desc: 'Pointer to PROCESS_INFORMATION structure receiving handle & PID.' }
    ],
    returnType: 'BOOL (Non-zero if success, 0 if failure)',
    exampleCpp: `PROCESS_INFORMATION pi;\nSTARTUPINFO si = { sizeof(si) };\nCreateProcessW(L"C:\\\\Program Files\\\\LibreOffice\\\\program\\\\soffice.exe", NULL, NULL, NULL, FALSE, 0, NULL, NULL, &si, &pi);`
  },
  {
    dll: 'kernel32.dll',
    name: 'VirtualAlloc',
    category: 'Memory Management',
    signature: 'LPVOID VirtualAlloc(LPVOID lpAddress, SIZE_T dwSize, DWORD flAllocationType, DWORD flProtect)',
    description: 'Reserves, commits, or changes the state of a region of pages in the virtual address space of the calling process. Backed by NT VMM with W^X enforcement.',
    wineStatus: 'Native NT-Mapped',
    parameters: [
      { name: 'lpAddress', type: 'LPVOID', desc: 'Starting address of the region to allocate.' },
      { name: 'dwSize', type: 'SIZE_T', desc: 'Size of the region, in bytes.' },
      { name: 'flAllocationType', type: 'DWORD', desc: 'MEM_COMMIT (0x1000) | MEM_RESERVE (0x2000)' },
      { name: 'flProtect', type: 'DWORD', desc: 'Memory protection (PAGE_EXECUTE_READWRITE, PAGE_READWRITE)' }
    ],
    returnType: 'LPVOID (Allocated base address or NULL)',
    exampleCpp: `LPVOID pBuffer = VirtualAlloc(NULL, 1024 * 1024, MEM_COMMIT | MEM_RESERVE, PAGE_READWRITE);`
  },
  {
    dll: 'kernel32.dll',
    name: 'DeviceIoControl',
    category: 'Device Driver & HAL I/O',
    signature: 'BOOL DeviceIoControl(HANDLE hDevice, DWORD dwIoControlCode, LPVOID lpInBuffer, DWORD nInBufferSize, LPVOID lpOutBuffer, DWORD nOutBufferSize, LPDWORD lpBytesReturned, LPOVERLAPPED lpOverlapped)',
    description: 'Sends a control code directly to a specified device driver, causing the corresponding device to perform the specified operation via NT IRP_MJ_DEVICE_CONTROL.',
    wineStatus: 'Thunked to HAL',
    parameters: [
      { name: 'hDevice', type: 'HANDLE', desc: 'Handle to the device (e.g. \\\\.\\AegisNvme0, \\\\.\\Usb4Router).' },
      { name: 'dwIoControlCode', type: 'DWORD', desc: 'Control code for the operation (IOCTL_STORAGE_QUERY_PROPERTY).' },
      { name: 'lpOutBuffer', type: 'LPVOID', desc: 'Buffer receiving output data from driver.' }
    ],
    returnType: 'BOOL (TRUE if successful, FALSE otherwise)',
    exampleCpp: `DeviceIoControl(hNvmeDrive, IOCTL_NVME_GET_TELEMETRY, NULL, 0, &telemetry, sizeof(telemetry), &dwRet, NULL);`
  },
  {
    dll: 'user32.dll',
    name: 'CreateWindowExW',
    category: 'Windowing & Desktop Subsystem',
    signature: 'HWND CreateWindowExW(DWORD dwExStyle, LPCWSTR lpClassName, LPCWSTR lpWindowName, DWORD dwStyle, int X, int Y, int nWidth, int nHeight, HWND hWndParent, HMENU hMenu, HINSTANCE hInstance, LPVOID lpParam)',
    description: 'Creates an overlapped, pop-up, or child window with an extended window style. Routed to win32k.sys display compositor.',
    wineStatus: 'Native NT-Mapped',
    parameters: [
      { name: 'lpWindowName', type: 'LPCWSTR', desc: 'The window name / title string.' },
      { name: 'dwStyle', type: 'DWORD', desc: 'WS_OVERLAPPEDWINDOW, WS_VISIBLE, WS_CLIPCHILDREN' },
      { name: 'nWidth / nHeight', type: 'int', desc: 'Width and height of the window in pixels.' }
    ],
    returnType: 'HWND (Handle to created window)',
    exampleCpp: `HWND hWnd = CreateWindowExW(WS_EX_COMPOSITED, L"AegisEnterpriseClass", L"Terminal Console", WS_OVERLAPPEDWINDOW | WS_VISIBLE, 100, 100, 800, 600, NULL, NULL, hInstance, NULL);`
  },
  {
    dll: 'advapi32.dll',
    name: 'CryptEncrypt',
    category: 'Enterprise Security & Cryptography',
    signature: 'BOOL CryptEncrypt(HCRYPTKEY hKey, HCRYPTHASH hHash, BOOL Final, DWORD dwFlags, BYTE *pbData, DWORD *pdwDataLen, DWORD dwBufLen)',
    description: 'Encrypts data using hardware AES-NI acceleration and enterprise BitLocker FVE master key engine.',
    wineStatus: 'Native NT-Mapped',
    parameters: [
      { name: 'hKey', type: 'HCRYPTKEY', desc: 'Handle to cryptographic key (AES-256-XTS).' },
      { name: 'pbData', type: 'BYTE*', desc: 'Pointer to plaintext buffer to encrypt in-place.' },
      { name: 'pdwDataLen', type: 'DWORD*', desc: 'Pointer to length of data to encrypt.' }
    ],
    returnType: 'BOOL (Success status)',
    exampleCpp: `CryptEncrypt(hAesKey, 0, TRUE, 0, pPartitionBlock, &dwBlockLen, dwBufSize);`
  },
  {
    dll: 'ntdll.dll',
    name: 'NtCreateFile',
    category: 'NT Native Kernel Executive',
    signature: 'NTSTATUS NtCreateFile(PHANDLE FileHandle, ACCESS_MASK DesiredAccess, POBJECT_ATTRIBUTES ObjectAttributes, PIO_STATUS_BLOCK IoStatusBlock, PLARGE_INTEGER AllocationSize, ULONG FileAttributes, ULONG ShareAccess, ULONG CreateDisposition, ULONG CreateOptions, PVOID EaBuffer, ULONG EaLength)',
    description: 'Direct Native NT System Call (Syscall 0x0055). Bypasses Win32 subsystem to communicate with the NT I/O Manager and NTFS/AegisFS.',
    wineStatus: 'Native NT-Mapped',
    parameters: [
      { name: 'FileHandle', type: 'PHANDLE', desc: 'Pointer to a HANDLE variable that receives file handle.' },
      { name: 'ObjectAttributes', type: 'POBJECT_ATTRIBUTES', desc: 'Points to OBJECT_ATTRIBUTES initialized with InitializeObjectAttributes.' },
      { name: 'IoStatusBlock', type: 'PIO_STATUS_BLOCK', desc: 'Receives the final completion status and info.' }
    ],
    returnType: 'NTSTATUS (STATUS_SUCCESS = 0x00000000)',
    exampleCpp: `OBJECT_ATTRIBUTES oa;\nInitializeObjectAttributes(&oa, &usDeviceName, OBJ_CASE_INSENSITIVE, NULL, NULL);\nNTSTATUS status = NtCreateFile(&hDevice, GENERIC_READ | GENERIC_WRITE, &oa, &iosb, NULL, FILE_ATTRIBUTE_NORMAL, FILE_SHARE_READ, FILE_OPEN, 0, NULL, 0);`
  },
  {
    dll: 'ntdll.dll',
    name: 'NtAllocateVirtualMemory',
    category: 'NT Native Kernel Executive',
    signature: 'NTSTATUS NtAllocateVirtualMemory(HANDLE ProcessHandle, PVOID *BaseAddress, ULONG_PTR ZeroBits, PSIZE_T RegionSize, ULONG AllocationType, ULONG Protect)',
    description: 'Native NT Virtual Memory Manager call. Allocates or reserves virtual address space in any process.',
    wineStatus: 'Native NT-Mapped',
    parameters: [
      { name: 'ProcessHandle', type: 'HANDLE', desc: 'Handle to the process (NtCurrentProcess()).' },
      { name: 'BaseAddress', type: 'PVOID*', desc: 'Requested starting address; receives allocated base address.' },
      { name: 'RegionSize', type: 'PSIZE_T', desc: 'Size in bytes to allocate.' }
    ],
    returnType: 'NTSTATUS (STATUS_SUCCESS, STATUS_NO_MEMORY)',
    exampleCpp: `PVOID base = NULL; SIZE_T size = 0x10000;\nNtAllocateVirtualMemory(NtCurrentProcess(), &base, 0, &size, MEM_COMMIT | MEM_RESERVE, PAGE_READWRITE);`
  },
  {
    dll: 'ws2_32.dll',
    name: 'WSAStartup',
    category: 'Networking & Sockets',
    signature: 'int WSAStartup(WORD wVersionRequired, LPWSADATA lpWSAData)',
    description: 'Initiates use of the Winsock DLL by a process. Interfaced with Aegis NT TCP/IP network stack and WinRM/SSH daemon.',
    wineStatus: 'Wine Implemented',
    parameters: [
      { name: 'wVersionRequired', type: 'WORD', desc: 'Highest version of Windows Sockets support (MAKEWORD(2, 2)).' },
      { name: 'lpWSAData', type: 'LPWSADATA', desc: 'Pointer to the WSADATA data structure.' }
    ],
    returnType: 'int (0 if successful, error code otherwise)',
    exampleCpp: `WSADATA wsa;\nWSAStartup(MAKEWORD(2, 2), &wsa);`
  }
];

export class Win32Engine {
  private static instance: Win32Engine;
  public logs: ApiTraceLog[] = [];

  constructor() {
    this.seedInitialLogs();
  }

  public static getInstance(): Win32Engine {
    if (!Win32Engine.instance) {
      Win32Engine.instance = new Win32Engine();
    }
    return Win32Engine.instance;
  }

  private seedInitialLogs() {
    const initialCalls = [
      { dll: 'ntdll.dll', fn: 'NtCreateFile', p: 'Path: "\\Device\\HarddiskVolume0\\Windows\\System32\\ntdll.dll", Access: 0x80000000', r: 'STATUS_SUCCESS (0x0)' },
      { dll: 'kernel32.dll', fn: 'VirtualAlloc', p: 'Address: NULL, Size: 65536, Type: MEM_COMMIT, Protect: PAGE_READWRITE', r: '0x00007FF6A1200000' },
      { dll: 'kernel32.dll', fn: 'CreateProcessW', p: 'App: "C:\\Program Files\\LibreOffice\\program\\soffice.exe", Flags: 0x0', r: 'TRUE (PID: 2204)' },
      { dll: 'user32.dll', fn: 'CreateWindowExW', p: 'Class: "AegisDesktopWnd", Title: "LibreOffice Writer", Style: 0x10CF0000', r: 'HWND: 0x000204DE' },
      { dll: 'advapi32.dll', fn: 'CryptEncrypt', p: 'Alg: AES-XTS-256, KeyHandle: 0x7FFF0041, Len: 4096 bytes', r: 'TRUE (4096 bytes sealed)' },
      { dll: 'kernel32.dll', fn: 'DeviceIoControl', p: 'Device: "\\\\.\\AegisNvme0", Code: 0x002D1400 (IOCTL_STORAGE_QUERY)', r: 'TRUE (Doorbell Queued)' }
    ];

    const now = Date.now();
    initialCalls.forEach((call, idx) => {
      this.logs.push({
        id: `trace-${idx}`,
        timestamp: new Date(now - (initialCalls.length - idx) * 350).toLocaleTimeString(),
        dll: call.dll,
        functionName: call.fn,
        params: call.p,
        result: call.r,
        durationMs: +(0.08 + Math.random() * 0.2).toFixed(3),
        threadId: 1040 + idx * 8
      });
    });
  }

  public traceCall(dll: string, functionName: string, params: string, result: string) {
    const log: ApiTraceLog = {
      id: `trace-${Date.now()}-${Math.random()}`,
      timestamp: new Date().toLocaleTimeString(),
      dll,
      functionName,
      params,
      result,
      durationMs: +(0.05 + Math.random() * 0.25).toFixed(3),
      threadId: Math.floor(1000 + Math.random() * 4000)
    };
    this.logs.unshift(log);
    if (this.logs.length > 150) {
      this.logs.pop();
    }
    return log;
  }

  public clearLogs() {
    this.logs = [];
  }
}
