# AegisNT Stateful Firewall, External Gateways & 0-Reboot Hotpatching

**Document ID:** NET-PATCH-AEGIS-24H2  
**Classification:** Enterprise Network & Systems Operations Manual  
**Applies To:** AegisNT Enterprise 24H2 LTSC  

---

## 1. Stateful Packet Inspection (SPI) Firewall

The AegisNT firewall is integrated into the microkernel networking subsystem, providing sub-microsecond packet evaluation with zero copy memory overhead.

### 1.1 Firewall Network Profiles
1. **Domain Profile:** Used when joined to an enterprise Active Directory or Kerberos realm. Permits mutual TLS WinRM (5986), RPC Mesh (8443), and authenticated management.
2. **Private Profile:** Used within internal VPCs and private subnets. Permits local WebRTC streaming (8080/3000) and RDP sessions.
3. **Public Profile:** Zero-Trust default for untrusted or internet-facing networks. Drops all unsolicited inbound SYN packets, NetBIOS (137-139), SMB (445), and unencrypted protocols.

---

## 2. External Firewall Integration & Gateway Orchestration

AegisNT supports active integration with industry-standard enterprise external firewalls:

### 2.1 Palo Alto Networks (PAN-OS XML / REST API)
- **Policy Synchronization:** Synchronizes endpoint IP tag metadata with Panorama dynamic address groups.
- **Syslog Forwarding:** Emits RFC 5424 structured syslog events to Palo Alto Next-Gen Firewalls for centralized threat inspection and automated IP quarantine.

### 2.2 Fortinet FortiGate (FortiOS API)
- Connects through Fortinet Fabric Connector.
- Automatically pushes endpoint compliance health tokens to FortiGate firewalls to enforce conditional access policies.

### 2.3 pfSense & OPNsense Integration
- Supports Suricata / Snort IDS/IPS mirror port forwarding.
- Synchronizes firewall alias tables via automated REST webhooks.

---

## 3. Aegis Defender EDR & Antivirus Engine

- **Real-Time Heuristic Monitoring:** Inspects memory allocations and dynamic PE headers before Ring 3 process execution.
- **Antimalware Scan Interface (AMSI):** Native provider inspecting PowerShell commands, VBScripts, and Office macros.
- **Quarantine Vault:** Safely isolates suspected malware in an AES-256 encrypted storage container with SHA-256 hash validation and one-click remediation.

---

## 4. Enterprise Windows Update & Zero-Reboot Hotpatching

### 4.1 Zero-Downtime Hotpatching Engine (`kpatch.sys`)
Unlike traditional Windows Server which requires disruptive monthly reboots, AegisNT implements in-memory kernel and userland hotpatching:
1. Validates Authenticode signature and cryptographic hash of the patch package (e.g. `KB5044284`).
2. Pauses target thread execution for &lt;2 milliseconds at safe stack unwind points.
3. Overwrites function prologue with a memory jump to the patched function.
4. Resumes thread execution with zero data loss, zero dropped connections, and zero cluster reboots.

### 4.2 Fleet Distribution Integration
Easily distributed via:
- **Microsoft Intune / WSUS / SCCM:** Native compatibility with Windows Update catalog metadata.
- **Ansible Automation:** Declarative playbooks targeting hundreds of AegisNT nodes simultaneously.
