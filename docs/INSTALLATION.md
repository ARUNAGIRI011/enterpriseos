# AegisNT Installation & Virtualization Deployment Guide

**Document ID:** GUIDE-AEGISNT-DEPLOY-24H2  
**Applicability:** Virtual Machines (QEMU, KVM, VirtualBox, VMware, Proxmox, UTM, Hyper-V) & Bare-Metal Physical Hardware  

---

## 1. System Requirements

### Minimum Requirements
* **Processor:** 64-bit x86_64 CPU (with Intel VT-x or AMD-V) or ARM64 (ARMv8.2-A+)
* **RAM:** 4,096 MB (4 GB)
* **Storage:** 20 GB free disk space (NVMe or SATA SSD recommended)
* **Firmware:** UEFI 2.5+ with GPT partition scheme (Legacy MBR BIOS is not supported)
* **Graphics:** 1280x720 display resolution, DirectX 11 / Vulkan 1.1 or VirtIO-GPU

### Recommended Enterprise Specifications
* **Processor:** 8+ physical cores with AVX2/AVX-512 or ARM NEON
* **RAM:** 16,384 MB (16 GB) or 32,768 MB (32 GB)
* **Storage:** PCIe 4.0/5.0 NVMe SSD with 64+ submission queues
* **Firmware:** UEFI with Secure Boot enabled and TPM 2.0 cryptoprocessor
* **Graphics:** Discrete GPU with IOMMU group isolation (NVIDIA RTX 40-Series or AMD Radeon RX 7000)

---

## 2. Virtual Machine Installation

### 2.1 QEMU / KVM (Linux Host or WSL2)

Execute the following optimized command to launch AegisNT with native hardware hypercalls and VirtIO paravirtualization:

```bash
qemu-system-x86_64 \
  -enable-kvm \
  -m 8192 \
  -smp cores=4,threads=1,sockets=1 \
  -cpu host,hv_relaxed,hv_spinlocks=0x1fff,hv_vapic,hv_time \
  -drive file=aegisnt-enterprise.qcow2,if=virtio,format=qcow2,cache=none,aio=native \
  -cdrom aegisnt-enterprise-24h2.iso \
  -boot menu=on \
  -netdev user,id=net0,hostfwd=tcp::2222-:22,hostfwd=tcp::3389-:3389,hostfwd=tcp::5985-:5985 \
  -device virtio-net-pci,netdev=net0 \
  -device virtio-vga,virgl=on \
  -device intel-hda -device hda-duplex \
  -display default,show-cursor=on
```

#### Key Parameter Explanations:
* `-enable-kvm`: Grants direct access to host CPU hardware virtualization extensions.
* `hv_relaxed,hv_spinlocks,hv_vapic,hv_time`: Injects Windows NT hypercall enlightenments, eliminating clock drift and spinlock starvation.
* `if=virtio,cache=none,aio=native`: Binds to `virtio_hal_kvm.sys` for direct kernel DMA bypass.
* `hostfwd`: Maps port 22 (SSH), 3389 (RDP), and 5985 (WinRM) to the host.

---

### 2.2 Oracle VirtualBox (Windows, macOS, Linux Host)

1. Open **VirtualBox Manager** and click **New**.
2. **Name & OS:**
   * Name: `AegisNT Enterprise 24H2`
   * Type: `Microsoft Windows`
   * Version: `Windows 11 (64-bit)`
3. **Hardware Configuration:**
   * Base Memory: `8192 MB` (8 GB)
   * Processors: `4 CPUs` (Check **Enable PAE/NX**)
4. **EFI Firmware (Mandatory):**
   * Under **Settings** -> **System** -> **Motherboard**: Check **Enable EFI (special OSes only)**.
5. **Storage Controller:**
   * Under **Settings** -> **Storage**: Select Controller or add an **NVMe Controller**. Attach `aegisnt-enterprise-24h2.iso` to the optical drive.
   * Enable **Use Host I/O Cache**.
6. **Display Settings:**
   * Video Memory: `128 MB` or `256 MB`
   * Graphics Controller: `VBoxSVGA`
   * Check **Enable 3D Acceleration**.
7. **Network:**
   * Attached to: **Bridged Adapter** (for LAN IP) or **NAT** with port forward rules.
8. Start the VM and press any key when prompted to boot from the AegisNT UEFI installer.

---

### 2.3 VMware Workstation Pro & ESXi

1. Click **Create a New Virtual Machine** -> Select **Custom (advanced)**.
2. Hardware Compatibility: **Workstation 17.x / 18.x**.
3. Guest Operating System: Select **Microsoft Windows** -> **Windows 11 x64**.
4. **Firmware Type:** Select **UEFI** and check **Enable Secure Boot**.
5. **vTPM Configuration:**
   * Under **VM Options** -> **Access Control**: Encrypt the virtual machine with a passphrase.
   * Under **Hardware**: Click **Add...** -> Select **Trusted Platform Module (TPM)**. This enables BitLocker PCR sealing.
6. **Disk Controller:** Select **NVMe (Recommended)**. `aegis_nvme.sys` binds automatically.
7. **Display:** Check **Accelerate 3D graphics** and allocate 2 GB shared graphics memory.
8. Power on the VM to begin installation.

---

### 2.4 Proxmox VE (PVE Cluster Deployment)

Run this command in the Proxmox VE Shell (`pve-shell`) to deploy an automated AegisNT virtual machine:

```bash
qm create 200 \
  --name aegisnt-node01 \
  --memory 8192 \
  --cores 4 \
  --cpu host \
  --ostype win11 \
  --bios ovmf \
  --efidisk0 local-lvm:1,efitype=4m,pre-enrolled-keys=1 \
  --tpmstate0 local-lvm:1,version=v2.0 \
  --scsihw virtio-scsi-single \
  --scsi0 local-lvm:64,discard=on,ssd=1,iothread=1 \
  --net0 virtio,bridge=vmbr0,firewall=1 \
  --vga virtio \
  --cdrom local:iso/aegisnt-enterprise-24h2.iso

# Start the newly provisioned VM
qm start 200
```

---

### 2.5 UTM (Apple Silicon Mac M1/M2/M3/M4)

* **Direct ARM64 Virtualization (Fastest):**
  1. Open UTM -> Click **+ (Create a New Virtual Machine)**.
  2. Select **Virtualize** -> Choose **Windows (ARM64)**.
  3. Select `aegisnt-arm64-enterprise.iso`.
  4. Allocate 8 GB RAM and 4 CPU cores.
  5. AegisNT boots directly into ARM64 tickless microkernel mode with 240 ns interrupt latency.
* **x86_64 Emulation on Mac:**
  1. Select **Emulate** -> Choose **x86_64**.
  2. Set CPU model to `qemu64` with VirtIO graphics.

---

### 2.6 Microsoft Hyper-V (Windows Server / Pro)

1. Open **Hyper-V Manager** -> Click **New** -> **Virtual Machine...**
2. In the wizard, select **Generation 2** (Mandatory for UEFI 64-bit boot).
3. Assign **8192 MB** of memory (Uncheck Dynamic Memory for benchmark accuracy).
4. Connect to your Virtual Switch.
5. Under **Security Settings**:
   * Check **Enable Secure Boot** (Template: **Microsoft Windows**).
   * Check **Enable Trusted Platform Module**.
6. Attach the ISO to the DVD drive and boot.

---

## 3. Physical Bare-Metal Installation (Laptop / PC)

### 3.1 Creating Bootable Media

#### Option A: Using Rufus (Windows)
1. Insert a 16 GB+ USB flash drive.
2. Open **Rufus 4.x**.
3. Select your USB drive and browse for `aegisnt-enterprise-24h2.iso`.
4. Partition scheme: **GPT**.
5. Target system: **UEFI (non-CSM)**.
6. File system: **NTFS** or **FAT32**.
7. Click **START** to write the image.

#### Option B: Using Ventoy (Multi-Boot USB)
1. Format your flash drive with **Ventoy**.
2. Copy `aegisnt-enterprise-24h2.iso` directly into the USB root directory.

### 3.2 BIOS/UEFI Firmware Preparation
1. Reboot your target laptop or PC and enter UEFI Setup (<kbd>F2</kbd>, <kbd>Del</kbd>, or <kbd>F12</kbd>).
2. Configure the following firmware options:
   * **Boot Mode:** UEFI Only (Disable Legacy CSM).
   * **SATA / NVMe Mode:** AHCI or NVMe (Disable Intel RST / RAID).
   * **Security:** Enable TPM 2.0 (Intel PTT or AMD fTPM).
   * **Secure Boot:** Enabled (Microsoft Keys enrolled).
   * **Virtualization:** Enable Intel VT-x/VT-d or AMD-V/AMD-Vi.
3. Save changes and exit.
4. Press your system's boot menu key (<kbd>F12</kbd>, <kbd>F11</kbd>, or <kbd>Esc</kbd>) and select the UEFI USB drive.

---

## 4. Troubleshooting Matrix

| Issue / Symptom | Probable Cause | Resolution |
|:---|:---|:---|
| **Black screen on VM start** | Legacy BIOS selected instead of UEFI | Change VM firmware settings to UEFI / OVMF. AegisNT requires UEFI GPT. |
| **"No bootable device found"** | Secure Boot keys not enrolled or MBR disk format | Ensure the disk is partitioned as GPT with an EFI System Partition (ESP) formatted FAT32. |
| **Disk controller not detected** | Missing paravirtualized storage driver | Select VirtIO or NVMe storage. `virtio_hal_kvm.sys` and `aegis_nvme.sys` are preloaded. |
| **BitLocker prompt on boot** | TPM 2.0 not enabled in VM settings | Add a Virtual TPM device in VMware/Hyper-V/Proxmox settings, or input the 48-digit recovery key. |
| **Slow mouse movement in VM** | VirtIO tablet device missing | Add a USB Tablet input device in your hypervisor configuration for absolute pointer coordinates. |
| **IOMMU allocation error** | Broken IOMMU groups on host | Enable `intel_iommu=on iommu=pt` or `amd_iommu=on` in your Linux host GRUB command line. |
