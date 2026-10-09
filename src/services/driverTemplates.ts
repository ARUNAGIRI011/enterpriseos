export interface DriverSourceFile {
  id: string;
  filename: string;
  title: string;
  category: string;
  author: string;
  irql: string;
  sourceCode: string;
  headers: string[];
}

export const DRIVER_TEMPLATES: DriverSourceFile[] = [
  {
    id: 'nvme',
    filename: 'aegis_nvme_fastio.c',
    title: 'NVMe 2.0 High-Performance Storage Driver',
    category: 'Storage / Hardware Bus',
    author: 'AegisNT HAL Core Team',
    irql: 'DEVICE_LEVEL / DISPATCH_LEVEL',
    headers: ['<ntddk.h>', '<wdf.h>', '<nvme_spec.h>', '<hal.h>'],
    sourceCode: `/*
 * AegisNT Enterprise Operating System
 * Subsystem: Hardware Abstraction Layer & Storage Bus
 * Component: NVMe 2.0 / PCIe Gen5 Controller Driver
 * Target Architectures: x86_64, aarch64
 */

#include <ntddk.h>
#include <wdf.h>

#define NVME_MAX_QUEUES           64
#define NVME_QUEUE_DEPTH          1024
#define NVME_DOORBELL_STRIDE      4

typedef struct _NVME_DEVICE_EXTENSION {
    PVOID               Bar0VirtualAddress;
    PHYSICAL_ADDRESS    Bar0PhysicalAddress;
    ULONG               TotalSubmissionQueues;
    ULONG               TotalCompletionQueues;
    PVOID               SqBufferVa;
    PVOID               CqBufferVa;
    KSPIN_LOCK          QueueLock;
    BOOLEAN             TrimSupported;
    ULONG               HmbSizeMb;
} NVME_DEVICE_EXTENSION, *PNVME_DEVICE_EXTENSION;

NTSTATUS
DriverEntry(
    _In_ PDRIVER_OBJECT   DriverObject,
    _In_ PUNICODE_STRING  RegistryPath
)
{
    UNREFERENCED_PARAMETER(RegistryPath);
    KdPrint(("AegisNT: [NVME.SYS] Initializing PCIe 5.0 Controller Driver\\n"));

    DriverObject->DriverUnload = NvmeDriverUnload;
    DriverObject->MajorFunction[IRP_MJ_CREATE]         = NvmeDispatchCreate;
    DriverObject->MajorFunction[IRP_MJ_CLOSE]          = NvmeDispatchClose;
    DriverObject->MajorFunction[IRP_MJ_READ]           = NvmeDispatchReadWrite;
    DriverObject->MajorFunction[IRP_MJ_WRITE]          = NvmeDispatchReadWrite;
    DriverObject->MajorFunction[IRP_MJ_DEVICE_CONTROL] = NvmeDispatchDeviceControl;

    return STATUS_SUCCESS;
}

NTSTATUS
NvmeDispatchDeviceControl(
    _In_ PDEVICE_OBJECT DeviceObject,
    _Inout_ PIRP        Irp
)
{
    PIO_STACK_LOCATION irpSp = IoGetCurrentIrpStackLocation(Irp);
    PNVME_DEVICE_EXTENSION devExt = (PNVME_DEVICE_EXTENSION)DeviceObject->DeviceExtension;
    NTSTATUS status = STATUS_SUCCESS;
    ULONG bytesReturned = 0;

    switch (irpSp->Parameters.DeviceIoControl.IoControlCode)
    {
    case IOCTL_STORAGE_QUERY_PROPERTY:
        KdPrint(("AegisNT: [NVME.SYS] Querying NVMe 2.0 Telemetry & SMART state\\n"));
        bytesReturned = sizeof(NVME_TELEMETRY_DATA);
        status = STATUS_SUCCESS;
        break;

    case IOCTL_NVME_RING_DOORBELL:
        // Memory barrier to guarantee PCIe write order across x86-64 / ARM64
        KeMemoryBarrier();
        WRITE_REGISTER_ULONG((PULONG)devExt->Bar0VirtualAddress + 0x1000, 1);
        status = STATUS_SUCCESS;
        break;

    default:
        status = STATUS_INVALID_DEVICE_REQUEST;
        break;
    }

    Irp->IoStatus.Status = status;
    Irp->IoStatus.Information = bytesReturned;
    IoCompleteRequest(Irp, IO_NO_INCREMENT);
    return status;
}

VOID
NvmeDriverUnload(_In_ PDRIVER_OBJECT DriverObject)
{
    KdPrint(("AegisNT: [NVME.SYS] Cleanly flushing CQ/SQ ring buffers and unloading\\n"));
}`
  },
  {
    id: 'usb4',
    filename: 'usb4_host_router.c',
    title: 'USB 4.0 / Thunderbolt 4 Tunneling Router',
    category: 'Bus / Hotplug',
    author: 'AegisNT Connectivity Subsystem',
    irql: 'DISPATCH_LEVEL',
    headers: ['<ntddk.h>', '<usb4.h>', '<pcie_tunnel.h>'],
    sourceCode: `/*
 * AegisNT Enterprise OS - USB 4.0 Host Router Driver
 * Supports PCIe Gen4, DisplayPort 2.1, and USB3 Gen2x2 Tunneling (80 Gbps)
 */

#include <ntddk.h>

NTSTATUS DriverEntry(_In_ PDRIVER_OBJECT DriverObject, _In_ PUNICODE_STRING RegPath)
{
    KdPrint(("AegisNT: [USB4] Router Driver registered. Negotiating PAM3 80Gbps link.\\n"));
    DriverObject->DriverUnload = Usb4Unload;
    DriverObject->MajorFunction[IRP_MJ_PNP] = Usb4PnpDispatch;
    DriverObject->MajorFunction[IRP_MJ_DEVICE_CONTROL] = Usb4IoctlDispatch;
    return STATUS_SUCCESS;
}

NTSTATUS Usb4IoctlDispatch(PDEVICE_OBJECT DevObj, PIRP Irp)
{
    PIO_STACK_LOCATION sp = IoGetCurrentIrpStackLocation(Irp);
    ULONG code = sp->Parameters.DeviceIoControl.IoControlCode;

    if (code == IOCTL_USB4_ALLOCATE_BANDWIDTH) {
        KdPrint(("AegisNT: [USB4] Dynamic bandwidth reallocation: PCIe=32Gbps, DP=28Gbps\\n"));
        Irp->IoStatus.Status = STATUS_SUCCESS;
    } else {
        Irp->IoStatus.Status = STATUS_SUCCESS;
    }
    IoCompleteRequest(Irp, IO_NO_INCREMENT);
    return STATUS_SUCCESS;
}

VOID Usb4Unload(PDRIVER_OBJECT DriverObject)
{
    KdPrint(("AegisNT: [USB4] Router gracefully disconnected from dock\\n"));
}`
  },
  {
    id: 'vfio_gpu',
    filename: 'vfio_pci_passthru.c',
    title: 'Direct VFIO GPU Passthrough Miniport',
    category: 'Graphics / KVM Virtualization',
    author: 'AegisNT Hypervisor Core',
    irql: 'DEVICE_LEVEL',
    headers: ['<ntddk.h>', '<vfio.h>', '<kvm_hal.h>', '<d3dkmddi.h>'],
    sourceCode: `/*
 * AegisNT Enterprise OS - VFIO GPU Passthrough & WDDM 3.2 Bridge
 * Isolates PCIe GPU IOMMU groups and passes zero-overhead BARs to QEMU/KVM
 */

#include <ntddk.h>

NTSTATUS DriverEntry(PDRIVER_OBJECT DriverObject, PUNICODE_STRING RegistryPath)
{
    KdPrint(("AegisNT: [VFIO-GPU] Binding to RTX 6000 Ada (IOMMU Group 24)\\n"));
    DriverObject->MajorFunction[IRP_MJ_DEVICE_CONTROL] = VfioDispatchIoctl;
    return STATUS_SUCCESS;
}

NTSTATUS VfioDispatchIoctl(PDEVICE_OBJECT DevObj, PIRP Irp)
{
    KdPrint(("AegisNT: [VFIO-GPU] Direct DMA map granted for KVM Guest VMM\\n"));
    Irp->IoStatus.Status = STATUS_SUCCESS;
    IoCompleteRequest(Irp, IO_NO_INCREMENT);
    return STATUS_SUCCESS;
}`
  },
  {
    id: 'fve_crypto',
    filename: 'aegis_fve_aesxts.c',
    title: 'BitLocker FVE Hardware Encrypted Storage Filter',
    category: 'Security / Storage Encryption',
    author: 'AegisNT Enterprise Cryptography Group',
    irql: 'PASSIVE_LEVEL',
    headers: ['<ntddk.h>', '<fve_filter.h>', '<tpm20.h>'],
    sourceCode: `/*
 * AegisNT Enterprise OS - BitLocker / FVE Volume Encryption Filter
 * Transparent Sector Encryption: AES-XTS 256-bit with TPM 2.0 PCR Validation
 */

#include <ntddk.h>

NTSTATUS DriverEntry(PDRIVER_OBJECT DriverObject, PUNICODE_STRING RegistryPath)
{
    KdPrint(("AegisNT: [FVE] BitLocker Filter Driver active. TPM 2.0 PCR 7 sealed.\\n"));
    DriverObject->MajorFunction[IRP_MJ_READ]  = FveFilterReadWrite;
    DriverObject->MajorFunction[IRP_MJ_WRITE] = FveFilterReadWrite;
    return STATUS_SUCCESS;
}

NTSTATUS FveFilterReadWrite(PDEVICE_OBJECT DevObj, PIRP Irp)
{
    // Intercept sector IRP, encrypt/decrypt via CPU AES-NI instructions
    Irp->IoStatus.Status = STATUS_SUCCESS;
    IoCompleteRequest(Irp, IO_NO_INCREMENT);
    return STATUS_SUCCESS;
}`
  }
];
