# AegisNT Driver & Kernel Development Manual

**Document ID:** SPEC-AEGISNT-DRIVERS-24H2  
**Target Subsystems:** Kernel Mode Driver Framework (KMDF) / Windows Driver Model (WDM)  
**Security Level:** Ring 0 Digital WHQL Signature Enforced  

---

## 1. Driver Stack Overview

AegisNT includes seven core hardware and executive drivers engineered for extreme throughput, zero-copy virtualization, hardware passthrough, and cryptographic isolation:

| Driver Name | File Path | IRQL Level | Subsystem | Hardware Bus / Target |
|:---|:---|:---|:---|:---|
| **`aegis_nvme.sys`** | `\System32\drivers\aegis_nvme.sys` | `DEVICE_LEVEL (4)` | Mass Storage | PCIe 5.0 x4 NVMe 2.0 Host Controller |
| **`usb4_host_router.sys`** | `\System32\drivers\usb4_host_router.sys` | `DISPATCH_LEVEL (2)` | Bus Router | USB4 / Thunderbolt 4 PAM3 Host Router |
| **`vfio_iommu_passthru.sys`** | `\System32\drivers\vfio_iommu_passthru.sys` | `DEVICE_LEVEL (8)` | Virtualization | VFIO IOMMU Group Arbiter (GPU Passthrough) |
| **`aegis_wddm32.sys`** | `\System32\drivers\aegis_wddm32.sys` | `PASSIVE_LEVEL (0)` | Graphics | WDDM 3.2 Display Miniport (DirectX 12 / Vulkan 1.3) |
| **`virtio_hal_kvm.sys`** | `\System32\drivers\virtio_hal_kvm.sys` | `DISPATCH_LEVEL (2)` | HAL Extension | VirtIO Para-virtualized Ring Buffer HAL |
| **`aegis_bitlocker_fve.sys`** | `\System32\drivers\aegis_bitlocker_fve.sys` | `PASSIVE_LEVEL (0)` | Storage Filter | Full Volume Encryption (FVE) AES-XTS-256 Filter |
| **`wine_pe_exec.sys`** | `\System32\drivers\wine_pe_exec.sys` | `PASSIVE_LEVEL (0)` | Subsystem Bridge | PE Binary Loader & WOW64 Syscall Dispatcher |

---

## 2. Detailed Driver Specifications

### 2.1 PCIe 5.0 NVMe 2.0 Host Controller (`aegis_nvme.sys`)
* **Hardware Target:** PCIe 5.0 x4 Solid State Drives (Micron 2550, Samsung 990 Pro, Crucial T700, Kioxia CM7).
* **Architecture:**
  * **Queue Pairs:** 64 Submission Queues (SQ) and 64 Completion Queues (CQ) mapped directly into CPU NUMA nodes.
  * **Doorbell Registers:** Memory-Mapped I/O (MMIO) doorbells written with non-temporal store instructions.
  * **Direct Memory Access (DMA):** Physical Region Page (PRP) and Scatter Gather Lists (SGL) for zero-copy 4KB–2MB transfers.
  * **Host Memory Buffer (HMB):** Allocates 64 MB of host non-paged RAM to cache drive FTL (Flash Translation Layer) tables, cutting random read latency.
  * **TRIM & Deallocate:** Asynchronous Dataset Management commands execute during idle cycles.
* **Benchmarked Telemetry:**
  * Read IOPS: **1,250,000 IOPS**
  * Write IOPS: **980,000 IOPS**
  * Sequential Bandwidth: **14,200 MB/s**
  * Average Latency: **26 µs** (Random 4K QD1)

### 2.2 USB4 / Thunderbolt 4 Router (`usb4_host_router.sys`)
* **Hardware Target:** Intel Goshen Ridge, AMD Rembrandt/Phoenix USB4 Controllers, ASMedia ASM4242.
* **Architecture:**
  * **Bandwidth Engine:** 80 Gbps bi-directional PAM3 signaling with dynamic credit-based flow control.
  * **Tunneling Adapters:**
    * **PCIe Tunneling:** 32 Gbps reserved for external GPUs, NVMe enclosures, and 10GbE network adapters.
    * **DisplayPort Tunneling:** 40 Gbps reserved for dual 4K@120Hz or single 8K@60Hz HDR streams via DisplayPort 2.1.
    * **USB 3.2 Gen 2x2:** 20 Gbps legacy tunneling encapsulation.
  * **Power Delivery Negotiation:** Supports USB-PD 3.1 Extended Power Range (EPR) up to 240W.

### 2.3 VFIO IOMMU Passthrough Arbiter (`vfio_iommu_passthru.sys`)
* **Hardware Target:** Intel VT-d (DMAR tables) and AMD-Vi (IVRS tables) IOMMU architectures.
* **Architecture:**
  * **Group Isolation:** Validates complete IOMMU Group separation to guarantee zero memory access cross-talk between guest and host.
  * **PCI Configuration Space Emulation:** Mediates guest writes to device capability pointers, protecting host bus bridges.
  * **MSI-X Interrupt Remapping:** Forwards device MSI-X vectors directly into the guest APIC without host interrupt handling overhead.
  * **Zero-Copy Framebuffer BAR Mapping:** Exposes 64-bit Base Address Registers (BAR0 / BAR1) directly into the guest virtual machine address space.

### 2.4 WDDM 3.2 Display Miniport (`aegis_wddm32.sys`)
* **Hardware Target:** Native VirtIO-GPU, Virgl 3D, and passthrough GPU adapters.
* **Architecture:**
  * **APIs Supported:** DirectX 12 Agility SDK, Vulkan 1.3, OpenGL 4.6.
  * **Hardware Flip Queues:** Submits scanout buffers directly to display hardware scanout engines, reducing desktop presentation jitter to <1 ms.
  * **Shader Model 6.7:** Dynamic resource indexing and wave operations support.

### 2.5 VirtIO Para-virtualized HAL (`virtio_hal_kvm.sys`)
* **Architecture:**
  * **VRing Buffers:** Circular split ring and packed ring descriptors (`virtqueue_add_outbuf`, `virtqueue_get_buf`).
  * **Components:**
    * `virtio-net`: Multiqueue network device with checksum offload, TSO/UFO, and RSS.
    * `virtio-blk` & `virtio-scsi`: Direct hypervisor block storage layer with SCSI pass-through.
    * `virtio-balloon`: Dynamic host memory reclamation engine.

### 2.6 BitLocker FVE Storage Filter (`aegis_bitlocker_fve.sys`)
* **Architecture:**
  * **Algorithm:** AES-XTS-256 hardware accelerated using Intel AES-NI / ARMv8 Cryptographic Instructions.
  * **Hardware Sealing:** TPM 2.0 PCR registers (PCR 0: Firmware, PCR 2: Option ROMs, PCR 4: Bootloader, PCR 7: Secure Boot State, PCR 11: BitLocker Access Control).
  * **Key Management:** Encrypted Volume Master Key (VMK) and Full Volume Encryption Key (FVEK) protected in non-paged kernel pool memory.

### 2.7 Wine PE Subsystem Loader (`wine_pe_exec.sys`)
* **Architecture:**
  * **Binary Compatibility:** Parses PE/COFF headers (`IMAGE_DOS_HEADER`, `IMAGE_NT_HEADERS`, `IMAGE_OPTIONAL_HEADER64`).
  * **Relocation Engine:** Applies base relocations (`IMAGE_DIRECTORY_ENTRY_BASERELOC`) when ASLR load address differs from preferred ImageBase.
  * **Import Address Table (IAT):** Resolves symbols dynamically into native NT executive syscall stubs.

---

## 3. Developing Custom Kernel Drivers (WDK / DDK)

### 3.1 Driver Source Template (KMDF)

To create a new ring 0 kernel driver for AegisNT, create a C source file matching the following structure:

```c
#include <ntddk.h>

#define DRIVER_TAG 'sigeA'

// Forward declarations
VOID CustomDriverUnload(IN PDRIVER_OBJECT DriverObject);
NTSTATUS CustomCreateClose(IN PDEVICE_OBJECT DeviceObject, IN PIRP Irp);
NTSTATUS CustomDeviceControl(IN PDEVICE_OBJECT DeviceObject, IN PIRP Irp);

/**
 * DriverEntry: Kernel execution entry point called by the System Process.
 * IRQL: PASSIVE_LEVEL (0)
 */
NTSTATUS DriverEntry(
    IN PDRIVER_OBJECT DriverObject,
    IN PUNICODE_STRING RegistryPath
) {
    UNREFERENCED_PARAMETER(RegistryPath);
    NTSTATUS status = STATUS_SUCCESS;
    PDEVICE_OBJECT deviceObject = NULL;
    UNICODE_STRING devName, symLink;

    RtlInitUnicodeString(&devName, L"\\Device\\AegisCustomDevice");
    RtlInitUnicodeString(&symLink, L"\\DosDevices\\AegisCustomDevice");

    KdPrint(("AegisNT: [CustomDriver] Initializing DriverEntry...\n"));

    // Create device object
    status = IoCreateDevice(
        DriverObject,
        0,
        &devName,
        FILE_DEVICE_UNKNOWN,
        FILE_DEVICE_SECURE_OPEN,
        FALSE,
        &deviceObject
    );

    if (!NT_SUCCESS(status)) {
        KdPrint(("AegisNT: [CustomDriver] Failed to create device object (0x%08X)\n", status));
        return status;
    }

    // Set major function dispatch callbacks
    DriverObject->MajorFunction[IRP_MJ_CREATE] = CustomCreateClose;
    DriverObject->MajorFunction[IRP_MJ_CLOSE] = CustomCreateClose;
    DriverObject->MajorFunction[IRP_MJ_DEVICE_CONTROL] = CustomDeviceControl;
    DriverObject->DriverUnload = CustomDriverUnload;

    // Create Win32 visible symbolic link
    status = IoCreateSymbolicLink(&symLink, &devName);
    if (!NT_SUCCESS(status)) {
        IoDeleteDevice(deviceObject);
        return status;
    }

    deviceObject->Flags |= DO_BUFFERED_IO;
    deviceObject->Flags &= ~DO_DEVICE_INITIALIZING;

    KdPrint(("AegisNT: [CustomDriver] Successfully registered and loaded in Ring 0.\n"));
    return STATUS_SUCCESS;
}

/**
 * DriverUnload: Cleans up device objects and symbolic links before unload.
 */
VOID CustomDriverUnload(IN PDRIVER_OBJECT DriverObject) {
    UNICODE_STRING symLink;
    RtlInitUnicodeString(&symLink, L"\\DosDevices\\AegisCustomDevice");
    IoDeleteSymbolicLink(&symLink);

    if (DriverObject->DeviceObject != NULL) {
        IoDeleteDevice(DriverObject->DeviceObject);
    }
    KdPrint(("AegisNT: [CustomDriver] Driver unloaded from kernel pool.\n"));
}
```

### 3.2 Compilation and In-Kernel Loading
1. Open the **Driver Development Kit (WDK)** app from the Start Menu or via `Win+R` -> `ddk`.
2. Paste or write your driver source code into the editor.
3. Click **Compile Driver** to invoke the AegisNT LLVM/Clang kernel compiler.
4. Verify that the $W \oplus X$ security validation passes.
5. Click **Load into Ring 0** to link the binary into the active kernel pool.
