# Contributing to AegisNT Enterprise Operating System

Thank you for your interest in contributing to **AegisNT**! As an open-source operating system project combining modern web-based simulation with NT microkernel and hardware architectural engineering, we welcome contributions from kernel developers, systems architects, security researchers, and frontend engineers.

---

## 1. Code of Conduct

We are committed to providing a welcoming, inclusive, and harassment-free environment for all contributors. Please adhere to respectful communication across all pull requests, code reviews, and issue discussions.

---

## 2. Getting Started & Development Setup

### Prerequisites
* **Node.js:** v18.0.0 or v20.0.0+ (LTS recommended)
* **npm:** v9.0.0+ or **pnpm** v8.0.0+
* **Git:** Latest version

### Local Setup
```bash
# 1. Clone your fork of the repository
git clone https://github.com/your-username/aegisnt-os.git
cd aegisnt-os

# 2. Install dependencies
npm install

# 3. Start the Vite local development server
npm run dev
# The dev server will launch at http://localhost:3000
```

### Verification & Validation Commands
Before submitting a pull request, always ensure your changes pass linting and type-checking:

```bash
# Run TypeScript compilation check
npm run lint

# Build production bundle
npm run build
```

---

## 3. Architecture & Design Principles

When contributing to AegisNT, maintain our foundational architectural standards:

1. **Authentic Windows 11 Fluent & Mica UI:**
   * Always match native Windows design language: centered taskbars, 12-app grid Start menus, authentic Snap Layouts, and dark Fluent acrylic styling.
   * Do not introduce arbitrary non-standard styles or decorative pills.
2. **Deterministic Microkernel Simulation:**
   * Real-time metrics must be physically plausible (e.g. sub-microsecond preemption latencies, realistic IRQL levels 0–31, proper NVMe queue depths).
3. **Hardware-Enforced Security:**
   * Ensure any driver or executive code respects $W \oplus X$ memory boundaries, KASLR, SMEP/SMAP, and TPM 2.0 PCR sealing.
4. **Performance & Zero-Polling Discipline:**
   * Avoid unconstrained interval loops. Use event listeners or the `KernelEngine` telemetry subscriber pattern.

---

## 4. How to Contribute

### 4.1 Developing a New Application Module
1. Create your component in `src/components/apps/YourApp.tsx`.
2. Define any data models in `src/types/os.ts`.
3. Register the app in `src/App.tsx`:
   * Add entry in `appMeta` with initial title and window dimensions.
   * Add a `case` in `renderAppContent()`.
4. Register the launcher in:
   * `src/components/desktop/Desktop.tsx` (Add to `DESKTOP_ICONS`)
   * `src/components/desktop/StartMenu.tsx` (Add to `APPS`)
   * `src/components/desktop/RunDialog.tsx` (Add quick preset command)

### 4.2 Adding Kernel Drivers
1. Update `src/types/os.ts` if adding driver fields.
2. Register the driver in `src/services/kernelEngine.ts` inside the `drivers` list with proper IRQL levels (`PASSIVE_LEVEL`, `DISPATCH_LEVEL`, `DEVICE_LEVEL`).
3. Add driver documentation in `docs/DRIVERS_AND_KERNEL.md`.
4. Add sample C code in `src/components/apps/DriverDevKitApp.tsx`.

### 4.3 Adding Windows NT Event Logs
1. Open `src/services/systemLogService.ts`.
2. Add new Event IDs (following official Windows Event ID conventions) with appropriate severity levels and categories.

### 4.4 Improving Hypervisor / VM Installation Profiles
1. Update `src/components/apps/VmBootGuideApp.tsx` and `src/components/apps/VirtualizationApp.tsx`.
2. Update CLI parameter documentation in `docs/INSTALLATION.md`.

---

## 5. Git Commit & Pull Request Guidelines

### Commit Message Format
We follow the [Conventional Commits](https://www.conventionalcommits.org/) standard:

* `feat(kernel)`: Add ARM64 GICv4 interrupt distributor
* `feat(drivers)`: Add NVMe 2.0 Host Memory Buffer (HMB) allocation
* `fix(taskbar)`: Fix snap layout hover flicker on high-DPI displays
* `docs(install)`: Add Proxmox VE VirtIO single-SCSI command profile
* `perf(scheduler)`: Optimize tickless context switch queue dispatch

### Pull Request Checklist
- [ ] Code compiles without errors (`npm run build`).
- [ ] TypeScript linting passes with zero warnings (`npm run lint`).
- [ ] Follows existing project architecture and code conventions.
- [ ] Associated documentation updated in `docs/` or `README.md`.
- [ ] Commit history is clean and descriptive.

---

## 6. Community & Questions

Have questions or want to discuss architecture proposals before writing code?
* Open an **Architecture Proposal Discussion** in the GitHub Discussions forum.
* For security vulnerabilities, email the security response team directly.

Happy coding, and welcome to the AegisNT development community!
