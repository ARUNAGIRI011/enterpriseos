# Comprehensive Guide: Publishing to GitHub & Previewing on a Windows Laptop

**Document ID:** GUIDE-GITHUB-WIN-PREVIEW-24H2  
**Applicability:** AegisNT Enterprise Operating System / Windows 11 Build Guidance  
**Target Platform:** Windows 10/11 Laptops (Surface, ThinkPad, Dell XPS, HP Spectre, ASUS ROG, etc.)  

---

## Overview

This guide provides end-to-end instructions for:
1. **Publishing this project to GitHub** as a public open-source repository.
2. **Hosting it publicly on the web** so anyone can access and test it online.
3. **Previewing and running the operating system on a Windows laptop** across multiple environments:
   - **Mode A: Instant Web & Full-Screen Preview** (Browser F11 or Native PWA Install)
   - **Mode B: Local Windows Laptop Development Preview** (Node.js & PowerShell)
   - **Mode C: Docker Desktop for Windows Container Preview** (Zero-configuration Docker Compose)
   - **Mode D: Virtual Machine / Hypervisor Preview** (Hyper-V, VirtualBox, VMware)

---

## Part 1: How to Make this a Public GitHub Repository

### Step 1.1: Verify Codebase Preparation
The codebase is already pre-configured with:
- `.gitignore` (excludes `node_modules/`, `dist/`, local cache, and `.env`)
- `package.json` with build and preview scripts
- Production `Dockerfile` and `docker-compose.yml`
- `.github/workflows/deploy.yml` for automated GitHub Pages hosting
- Complete architecture documentation under `/docs`

### Step 1.2: Initialize Local Git Repository
Open your terminal in the project root directory and run:

```bash
# Initialize git repository
git init

# Stage all files
git add .

# Create the initial commit
git commit -m "feat: initial commit of AegisNT Enterprise OS desktop build"
```

---

### Step 1.3: Create a Public Repository on GitHub

#### Option A: Using the GitHub Web Interface (Simplest)
1. Navigate to **[https://github.com/new](https://github.com/new)** in your browser.
2. Enter a **Repository name**, for example:
   - `aegisnt-enterprise-os` or `windows11-enterprise-desktop`
3. Description: `High-performance NT-inspired enterprise operating system shell with Windows 11 Fluent UX, zero-reboot hotpatching, and microkernel telemetry.`
4. Visibility: Select **Public**.
5. **Crucial:** Leave "Add a README file", "Add .gitignore", and "Choose a license" **UNCHECKED** (since this repository already contains them).
6. Click **Create repository**.

#### Option B: Using the GitHub CLI (`gh`)
If you have the GitHub CLI installed:
```bash
gh repo create aegisnt-enterprise-os --public --source=. --remote=origin --push
```

---

### Step 1.4: Link Your Local Code and Push to GitHub
If you created the repository via the web interface, run the following commands in your terminal:

```bash
# Rename branch to main
git branch -M main

# Add your GitHub repository as remote origin (replace YOUR-USERNAME and REPO-NAME)
git remote add origin https://github.com/YOUR-USERNAME/aegisnt-enterprise-os.git

# Push your code to GitHub
git push -u origin main
```

---

### Step 1.5: Make It Publicly Available as a Live Website

#### Option 1: Automatic GitHub Pages (Included Workflow)
1. Go to your repository on GitHub.
2. Click **Settings** > **Pages** (in the left sidebar).
3. Under **Build and deployment** > **Source**, select **GitHub Actions**.
4. The included workflow (`.github/workflows/deploy.yml`) will automatically trigger, build the project, and publish it at:
   `https://YOUR-USERNAME.github.io/aegisnt-enterprise-os/`

#### Option 2: 1-Click Vercel / Netlify / Cloudflare Pages Deployment (Fastest CDN)
1. Log in to [Vercel](https://vercel.com) or [Netlify](https://netlify.com) using your GitHub account.
2. Click **Add New Project** and select your `aegisnt-enterprise-os` repository.
3. Configure settings:
   - **Framework Preset:** Vite
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`
4. Click **Deploy**. In under 60 seconds, you will receive a public global URL (e.g., `https://aegisnt-os.vercel.app`).

---

## Part 2: How to Preview this OS on a Windows Laptop

Here are the 4 recommended ways to preview and test this operating system on your Windows laptop:

---

### Method 1: Instant Fullscreen Web Preview (No Setup Required)

This is the fastest method to experience the Windows 11 interface:

1. Open your published website or local dev URL (`http://localhost:3000`) in **Microsoft Edge** or **Google Chrome**.
2. **Press `F11`** on your keyboard:
   - The browser address bar and tabs disappear completely.
   - The interface expands edge-to-edge, looking and behaving like a native Windows 11 OS.
3. **Optional (Install as Desktop App via Edge/Chrome PWA):**
   - In Microsoft Edge, click the **App available** icon in the address bar (or click `...` > **Apps** > **Install this site as an app**).
   - Click **Install**.
   - The AegisNT desktop will now launch in its own dedicated, borderless desktop window with its own icon in your Windows laptop taskbar!

---

### Method 2: Running Locally on Windows Laptop via PowerShell / Terminal

If you want to run the code locally on your Windows laptop:

#### Prerequisites:
- **Node.js**: Install Node.js 20+ from [nodejs.org](https://nodejs.org/) (includes `npm`).
- **Git for Windows**: Download from [git-scm.com](https://git-scm.com/).

#### Execution Steps:
1. Press `Win + X` and select **Terminal** (or open **PowerShell**).
2. Clone your repository:
   ```powershell
   git clone https://github.com/YOUR-USERNAME/aegisnt-enterprise-os.git
   cd aegisnt-enterprise-os
   ```
3. Install project dependencies:
   ```powershell
   npm install
   ```
4. Start the interactive local development server:
   ```powershell
   npm run dev
   ```
5. Open your browser and navigate to:
   ```
   http://localhost:3000
   ```
6. (Optional) Run the optimized production build:
   ```powershell
   npm run build
   npm run preview
   ```

---

### Method 3: Running via Docker Desktop for Windows

If you have Docker Desktop installed on your Windows laptop:

1. Ensure **Docker Desktop** is running (with the WSL2 backend enabled).
2. Open PowerShell in the project directory:
   ```powershell
   # Build and start container in detached background mode
   docker compose up -d
   ```
3. Open `http://localhost:3000` in your browser.
4. To view container status or logs:
   ```powershell
   docker ps
   docker logs aegisnt-desktop-os
   ```
5. To stop the container:
   ```powershell
   docker compose down
   ```

---

### Method 4: Virtual Machine & Hypervisor Preview

For enterprise hypervisors installed on your Windows laptop:

#### 1. Windows Hyper-V (Built into Windows 11 Pro / Enterprise):
1. Enable Hyper-V:
   - Press `Win + R`, type `optionalfeatures.exe`, check **Hyper-V**, and restart.
2. Open **Hyper-V Manager**.
3. Click **New** > **Virtual Machine**.
4. Generation: Select **Generation 2** (supports UEFI & Secure Boot).
5. Memory: Assign **8192 MB** (8 GB) and enable Dynamic Memory.
6. Networking: Select **Default Switch**.
7. Hard Disk: Attach VHDX disk with 40 GB storage.
8. Settings > **Security**: Check **Enable Secure Boot** (Microsoft Windows template) and **Enable Trusted Platform Module (TPM)**.
9. Settings > **Processor**: Allocate 4 or 8 virtual processors.

#### 2. Oracle VirtualBox 7.x (Windows Home / Pro):
1. Create New VM: Name `AegisNT-24H2`, Type `Microsoft Windows`, Version `Windows 11 (64-bit)`.
2. Check **Enable EFI (special OSes only)**.
3. Hardware: 4 vCPUs, 8192 MB RAM.
4. Enable **Enable 3D Acceleration** with 256MB Video Memory under Display settings.

---

## Summary Command Cheatsheet

| Task | Command (PowerShell / Bash) |
|:---|:---|
| **Git Setup** | `git init && git add . && git commit -m "initial commit"` |
| **Push to GitHub** | `git remote add origin <url> && git push -u origin main` |
| **Run Locally** | `npm install && npm run dev` |
| **Run Production** | `npm run build && npm run preview` |
| **Run Docker** | `docker compose up -d` |
| **Test in Browser** | Navigate to `http://localhost:3000` and press `F11` |

---
*AegisNT Enterprise Systems Engineering Group*
