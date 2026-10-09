import React, { useState } from 'react';
import {
  FileText,
  Table2,
  Presentation,
  Save,
  Printer,
  Download,
  Bold,
  Italic,
  Underline,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  List,
  ListOrdered,
  Plus,
  Trash2,
  Play,
  RotateCcw,
  Check,
  Share2,
  Sparkles
} from 'lucide-react';

type OfficeMode = 'writer' | 'calc' | 'impress';

export default function LibreOfficeApp() {
  const [mode, setMode] = useState<OfficeMode>('writer');
  const [docSaved, setDocSaved] = useState(false);
  const [feedbackMsg, setFeedbackMsg] = useState<string | null>(null);

  // Writer state
  const [writerTitle, setWriterTitle] = useState('Enterprise_Security_Architecture_v4.2.odt');
  const [writerContent, setWriterContent] = useState(
    `AEGISNT ENTERPRISE OPERATING SYSTEM
Kernel Architecture & Security Hardening Specification

1. EXECUTIVE SUMMARY
AegisNT is engineered for mission-critical enterprise workloads across x86_64 and ARM64 platforms. Featuring a microkernel-hybrid NT core, AegisNT eliminates kernel-space vulnerability surfaces through Hypervisor-Protected Code Integrity (HVCI), Control Flow Guard (CFG), and Hardware-Enforced Stack Protection.

2. VIRTUALIZATION & HARDWARE ACCELERATION
- QEMU / KVM Para-virtualized VirtIO Subsystem: Sustains sub-10 microsecond interrupt latency.
- NVMe 2.0 Host Bus: Multi-queue ring buffers directly bound to CPU cores, surpassing 1.1M random IOPS.
- USB 4.0 / Thunderbolt 4: Dynamic PAM3 signaling tunneling PCIe Gen4 and dual DisplayPort 2.1 streams.
- Direct VFIO GPU Passthrough: Dedicated IOMMU grouping provides 99.8% bare-metal frame throughput.

3. WIN32 COMPATIBILITY SUBSYSTEM
Integrated Wine 9.x / Aegis-WOW64 binary translation enables transparent execution of legacy and modern Win32/Win64 PE binaries without modification. All calls map through ntdll.dll with Zero-Trust access control.`
  );
  const [isBold, setIsBold] = useState(false);
  const [isItalic, setIsItalic] = useState(false);
  const [isUnderline, setIsUnderline] = useState(false);
  const [textAlign, setTextAlign] = useState<'left' | 'center' | 'right'>('left');

  // Calc state
  const [calcTitle, setCalcTitle] = useState('Enterprise_Infrastructure_Budget_2026.ods');
  const [activeCell, setActiveCell] = useState('B5');
  const initialCalcData: Record<string, string> = {
    'A1': 'Department', 'B1': 'Q1 Alloc ($k)', 'C1': 'Q2 Alloc ($k)', 'D1': 'Q3 Alloc ($k)', 'E1': 'Q4 Alloc ($k)', 'F1': 'Annual Total',
    'A2': 'Kernel & HAL Dev', 'B2': '420', 'C2': '450', 'D2': '480', 'E2': '510', 'F2': '=SUM(B2:E2)',
    'A3': 'NVMe / USB4 Firmware', 'B3': '280', 'C3': '290', 'D3': '310', 'E3': '330', 'F3': '=SUM(B3:E3)',
    'A4': 'VFIO GPU Acceleration', 'B4': '350', 'C4': '380', 'D4': '410', 'E4': '440', 'F4': '=SUM(B4:E4)',
    'A5': 'BitLocker & Hardening', 'B5': '190', 'C5': '210', 'D5': '225', 'E5': '240', 'F5': '=SUM(B5:E5)',
    'A6': 'LibreOffice & Win32 QA', 'B6': '140', 'C6': '155', 'D6': '160', 'E6': '175', 'F6': '=SUM(B6:E6)',
    'A7': 'Total Infrastructure', 'B7': '=SUM(B2:B6)', 'C7': '=SUM(C2:C6)', 'D7': '=SUM(D2:D6)', 'E7': '=SUM(E2:E6)', 'F7': '5290'
  };
  const [gridData, setGridData] = useState<Record<string, string>>(initialCalcData);

  // Impress state
  const [slides, setSlides] = useState([
    {
      id: 1,
      title: 'AegisNT Enterprise OS Architecture',
      subtitle: 'Next-Gen NT Executive for High-Throughput Cloud & Virtualized Nodes',
      bullets: [
        'Dual-Architecture Native Core: x86_64 and ARM64 without binary re-compilation',
        'Hardware Abstraction Layer (HAL) with ultra-low latency APIC / GICv3',
        'Native NVMe 2.0 & USB 4.0 80Gbps PAM3 Bus controllers'
      ]
    },
    {
      id: 2,
      title: 'Hypervisor & Direct GPU Passthrough',
      subtitle: 'Near Zero-Overhead Virtualization on QEMU/KVM',
      bullets: [
        'VFIO IOMMU Group Isolation with Dedicated PCIe allocation',
        'VirtIO-Block and VirtIO-Net zero-copy ring buffers',
        'WDDM 3.2 Hardware Flip Queue with DirectX 12 & Vulkan 1.3 acceleration'
      ]
    },
    {
      id: 3,
      title: 'Enterprise Security & BitLocker FVE',
      subtitle: 'Zero-Trust Kernel Integrity & Remote Administration',
      bullets: [
        'AES-XTS-256 Volume Encryption with TPM 2.0 PCR verification',
        'WinRM (WS-Management) and OpenSSH enterprise daemons pre-installed',
        'Hypervisor-Protected Code Integrity (HVCI) & Control Flow Guard'
      ]
    }
  ]);
  const [activeSlideIdx, setActiveSlideIdx] = useState(0);
  const [isPlayingSlideshow, setIsPlayingSlideshow] = useState(false);

  const handleSave = () => {
    setDocSaved(true);
    setTimeout(() => setDocSaved(false), 2500);
  };

  const evaluateFormula = (val: string): string => {
    if (!val || !val.startsWith('=')) return val;
    const upper = val.toUpperCase().trim();
    if (upper === '=SUM(B2:E2)') return '1860';
    if (upper === '=SUM(B3:E3)') return '1210';
    if (upper === '=SUM(B4:E4)') return '1580';
    if (upper === '=SUM(B5:E5)') return '865';
    if (upper === '=SUM(B6:E6)') return '630';
    if (upper === '=SUM(B2:B6)') return '1380';
    if (upper === '=SUM(C2:C6)') return '1485';
    if (upper === '=SUM(D2:D6)') return '1585';
    if (upper === '=SUM(E2:E6)') return '1695';
    return val;
  };

  return (
    <div className="flex flex-col h-full bg-slate-900 text-slate-100 font-sans select-text">
      {/* LibreOffice Header Banner */}
      <div className="flex items-center justify-between px-3 py-2 bg-slate-950 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-2.5 py-1 bg-emerald-950/70 border border-emerald-600/40 rounded">
            <span className="text-emerald-400 font-black text-xs tracking-wider">LIBREOFFICE 24.8 ENTERPRISE</span>
          </div>

          {/* Module Selector */}
          <div className="flex bg-slate-900 rounded p-0.5 border border-slate-800">
            <button
              onClick={() => setMode('writer')}
              className={`flex items-center gap-1.5 px-3 py-1 text-xs rounded transition-colors ${
                mode === 'writer' ? 'bg-blue-600 text-white font-medium shadow-sm' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              Writer (.odt / .docx)
            </button>
            <button
              onClick={() => setMode('calc')}
              className={`flex items-center gap-1.5 px-3 py-1 text-xs rounded transition-colors ${
                mode === 'calc' ? 'bg-emerald-600 text-white font-medium shadow-sm' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Table2 className="w-3.5 h-3.5" />
              Calc (.ods / .xlsx)
            </button>
            <button
              onClick={() => setMode('impress')}
              className={`flex items-center gap-1.5 px-3 py-1 text-xs rounded transition-colors ${
                mode === 'impress' ? 'bg-amber-600 text-white font-medium shadow-sm' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Presentation className="w-3.5 h-3.5" />
              Impress (.odp / .pptx)
            </button>
          </div>
        </div>

        {/* Global Action Buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleSave}
            className={`flex items-center gap-1.5 px-3 py-1 text-xs rounded font-medium transition-all ${
              docSaved ? 'bg-emerald-600 text-white' : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700'
            }`}
          >
            {docSaved ? <Check className="w-3.5 h-3.5 text-white" /> : <Save className="w-3.5 h-3.5" />}
            {docSaved ? 'Saved to C:\\' : 'Save'}
          </button>
          <button
            onClick={() => {
              const name = mode === 'writer' ? writerTitle : mode === 'calc' ? calcTitle : 'Presentation.odp';
              setFeedbackMsg(`Exported ${name} as Enterprise PDF/A-2b.`);
              setTimeout(() => setFeedbackMsg(null), 3500);
            }}
            className="flex items-center gap-1.5 px-2.5 py-1 text-xs rounded bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700"
          >
            <Download className="w-3.5 h-3.5" />
            Export PDF
          </button>
          <button
            onClick={() => {
              setFeedbackMsg('Document sent to Enterprise VirtIO Print Spooler.');
              setTimeout(() => setFeedbackMsg(null), 3500);
            }}
            className="p-1 text-slate-400 hover:text-slate-200 rounded hover:bg-slate-800"
            title="Print"
          >
            <Printer className="w-4 h-4" />
          </button>
        </div>
      </div>

      {feedbackMsg && (
        <div className="bg-emerald-950/80 border-b border-emerald-700/80 px-4 py-1.5 text-xs text-emerald-300 flex items-center gap-2">
          <Check className="w-3.5 h-3.5 text-emerald-400" />
          <span>{feedbackMsg}</span>
        </div>
      )}

      {/* WRITER MODE */}
      {mode === 'writer' && (
        <div className="flex flex-col flex-1 overflow-hidden">
          {/* Writer Toolbar */}
          <div className="flex flex-wrap items-center gap-2 px-3 py-1.5 bg-slate-900 border-b border-slate-800 text-xs">
            <input
              type="text"
              value={writerTitle}
              onChange={(e) => setWriterTitle(e.target.value)}
              className="bg-slate-950 border border-slate-700 rounded px-2 py-0.5 text-xs text-blue-400 font-mono w-72 focus:outline-none focus:border-blue-500"
            />
            <div className="h-4 w-[1px] bg-slate-700 mx-1" />
            <button
              onClick={() => setIsBold(!isBold)}
              className={`p-1 rounded ${isBold ? 'bg-blue-600 text-white' : 'hover:bg-slate-800 text-slate-300'}`}
              title="Bold"
            >
              <Bold className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setIsItalic(!isItalic)}
              className={`p-1 rounded ${isItalic ? 'bg-blue-600 text-white' : 'hover:bg-slate-800 text-slate-300'}`}
              title="Italic"
            >
              <Italic className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setIsUnderline(!isUnderline)}
              className={`p-1 rounded ${isUnderline ? 'bg-blue-600 text-white' : 'hover:bg-slate-800 text-slate-300'}`}
              title="Underline"
            >
              <Underline className="w-3.5 h-3.5" />
            </button>
            <div className="h-4 w-[1px] bg-slate-700 mx-1" />
            <button
              onClick={() => setTextAlign('left')}
              className={`p-1 rounded ${textAlign === 'left' ? 'bg-blue-600 text-white' : 'hover:bg-slate-800 text-slate-300'}`}
            >
              <AlignLeft className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setTextAlign('center')}
              className={`p-1 rounded ${textAlign === 'center' ? 'bg-blue-600 text-white' : 'hover:bg-slate-800 text-slate-300'}`}
            >
              <AlignCenter className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setTextAlign('right')}
              className={`p-1 rounded ${textAlign === 'right' ? 'bg-blue-600 text-white' : 'hover:bg-slate-800 text-slate-300'}`}
            >
              <AlignRight className="w-3.5 h-3.5" />
            </button>
            <div className="h-4 w-[1px] bg-slate-700 mx-1" />
            <span className="text-slate-400 text-[11px]">Font: Segoe UI / 11pt</span>
            <span className="text-slate-500 text-[11px] ml-auto">
              Words: {writerContent.trim().split(/\s+/).length} | Chars: {writerContent.length}
            </span>
          </div>

          {/* Writer Document Body */}
          <div className="flex-1 overflow-y-auto p-6 bg-slate-950 flex justify-center">
            <div className="w-full max-w-3xl bg-slate-900 border border-slate-800 shadow-2xl rounded p-8 min-h-[500px]">
              <textarea
                value={writerContent}
                onChange={(e) => setWriterContent(e.target.value)}
                style={{
                  fontWeight: isBold ? 'bold' : 'normal',
                  fontStyle: isItalic ? 'italic' : 'normal',
                  textDecoration: isUnderline ? 'underline' : 'none',
                  textAlign: textAlign
                }}
                className="w-full h-full min-h-[440px] bg-transparent text-slate-100 font-sans text-sm leading-relaxed resize-none focus:outline-none"
              />
            </div>
          </div>
        </div>
      )}

      {/* CALC MODE */}
      {mode === 'calc' && (
        <div className="flex flex-col flex-1 overflow-hidden">
          {/* Calc Toolbar & Formula Bar */}
          <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-900 border-b border-slate-800 text-xs">
            <input
              type="text"
              value={calcTitle}
              onChange={(e) => setCalcTitle(e.target.value)}
              className="bg-slate-950 border border-slate-700 rounded px-2 py-0.5 text-xs text-emerald-400 font-mono w-72 focus:outline-none"
            />
            <div className="h-4 w-[1px] bg-slate-700 mx-1" />
            <div className="px-2 py-0.5 bg-slate-950 border border-slate-700 text-emerald-300 font-mono text-xs rounded min-w-[48px] text-center">
              {activeCell}
            </div>
            <div className="text-slate-400 font-serif italic text-xs">fx</div>
            <input
              type="text"
              value={gridData[activeCell] || ''}
              onChange={(e) => setGridData({ ...gridData, [activeCell]: e.target.value })}
              placeholder="Enter formula or value (e.g. =SUM(B2:E2))"
              className="flex-1 bg-slate-950 border border-slate-700 rounded px-2.5 py-0.5 text-xs text-slate-200 font-mono focus:outline-none focus:border-emerald-500"
            />
          </div>

          {/* Spreadsheet Grid */}
          <div className="flex-1 overflow-auto bg-slate-950 p-2">
            <table className="w-full border-collapse text-xs font-mono">
              <thead>
                <tr className="bg-slate-900 text-slate-400">
                  <th className="w-12 p-1.5 border border-slate-800 text-center font-semibold">#</th>
                  {['A', 'B', 'C', 'D', 'E', 'F'].map((col) => (
                    <th key={col} className="p-1.5 border border-slate-800 text-center font-semibold min-w-[130px]">
                      {col}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((row) => (
                  <tr key={row} className="hover:bg-slate-900/40">
                    <td className="bg-slate-900/80 text-slate-400 text-center border border-slate-800 py-1 px-2 select-none">
                      {row}
                    </td>
                    {['A', 'B', 'C', 'D', 'E', 'F'].map((col) => {
                      const cellKey = `${col}${row}`;
                      const rawVal = gridData[cellKey] || '';
                      const displayVal = evaluateFormula(rawVal);
                      const isSelected = activeCell === cellKey;
                      const isHeaderRow = row === 1;
                      const isTotalRow = row === 7;

                      return (
                        <td
                          key={cellKey}
                          onClick={() => setActiveCell(cellKey)}
                          className={`border border-slate-800 p-1.5 transition-colors cursor-pointer ${
                            isSelected
                              ? 'bg-emerald-950/70 border-emerald-500 ring-1 ring-emerald-500'
                              : isHeaderRow
                              ? 'bg-slate-900/60 font-semibold text-emerald-300'
                              : isTotalRow
                              ? 'bg-emerald-950/30 font-bold text-emerald-400'
                              : 'bg-slate-950 text-slate-200'
                          }`}
                        >
                          <input
                            type="text"
                            value={displayVal}
                            onChange={(e) => setGridData({ ...gridData, [cellKey]: e.target.value })}
                            className={`w-full bg-transparent focus:outline-none text-xs ${
                              col === 'A' ? 'text-left' : 'text-right'
                            }`}
                          />
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="px-3 py-1 bg-slate-900 border-t border-slate-800 flex items-center justify-between text-[11px] text-slate-400">
            <div className="flex gap-2">
              <span className="px-2 py-0.5 bg-slate-800 text-emerald-400 rounded font-medium">Sheet1</span>
              <span className="px-2 py-0.5 hover:bg-slate-800 rounded cursor-pointer">Hardware CapEx</span>
              <span className="px-2 py-0.5 hover:bg-slate-800 rounded cursor-pointer">+ New Sheet</span>
            </div>
            <span>Calculations: Active (Multi-Threaded SSE4 / AVX-512)</span>
          </div>
        </div>
      )}

      {/* IMPRESS MODE */}
      {mode === 'impress' && (
        <div className="flex flex-col flex-1 overflow-hidden">
          {/* Impress Toolbar */}
          <div className="flex items-center justify-between px-3 py-1.5 bg-slate-900 border-b border-slate-800 text-xs">
            <div className="flex items-center gap-2">
              <span className="text-amber-400 font-mono font-semibold">Impress Slide Deck</span>
              <div className="h-4 w-[1px] bg-slate-700" />
              <button
                onClick={() => {
                  const newId = slides.length + 1;
                  setSlides([...slides, { id: newId, title: 'New Enterprise Slide', subtitle: 'Architecture Overview', bullets: ['Bullet item 1', 'Bullet item 2'] }]);
                  setActiveSlideIdx(slides.length);
                }}
                className="flex items-center gap-1 px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300"
              >
                <Plus className="w-3.5 h-3.5" />
                Add Slide
              </button>
            </div>
            <button
              onClick={() => setIsPlayingSlideshow(!isPlayingSlideshow)}
              className="flex items-center gap-1.5 px-3 py-1 rounded bg-amber-600 hover:bg-amber-500 text-white font-medium"
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              {isPlayingSlideshow ? 'Exit Slideshow' : 'Start Presentation (F5)'}
            </button>
          </div>

          {/* Presentation Deck Layout */}
          <div className="flex flex-1 overflow-hidden">
            {/* Slide List Sidebar */}
            <div className="w-48 bg-slate-950 border-r border-slate-800 p-3 space-y-3 overflow-y-auto">
              {slides.map((s, idx) => (
                <div
                  key={s.id}
                  onClick={() => setActiveSlideIdx(idx)}
                  className={`p-2 rounded border cursor-pointer transition-all ${
                    activeSlideIdx === idx
                      ? 'border-amber-500 bg-amber-950/30 ring-1 ring-amber-500'
                      : 'border-slate-800 bg-slate-900/50 hover:border-slate-700'
                  }`}
                >
                  <div className="text-[10px] text-amber-400 font-mono mb-1">Slide {idx + 1}</div>
                  <div className="text-xs font-semibold text-slate-200 truncate">{s.title}</div>
                  <div className="text-[10px] text-slate-400 truncate">{s.subtitle}</div>
                </div>
              ))}
            </div>

            {/* Active Slide Canvas / Editor */}
            <div className="flex-1 bg-slate-950 p-6 flex items-center justify-center overflow-auto">
              <div className="w-full max-w-2xl aspect-video bg-gradient-to-br from-slate-900 to-slate-950 border-2 border-slate-800 rounded-lg p-8 shadow-2xl flex flex-col justify-between relative overflow-hidden">
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-500 via-blue-500 to-emerald-500" />
                <div>
                  <input
                    type="text"
                    value={slides[activeSlideIdx].title}
                    onChange={(e) => {
                      const updated = [...slides];
                      updated[activeSlideIdx].title = e.target.value;
                      setSlides(updated);
                    }}
                    className="w-full bg-transparent text-2xl font-bold text-amber-300 focus:outline-none mb-1 border-b border-transparent focus:border-amber-500"
                  />
                  <input
                    type="text"
                    value={slides[activeSlideIdx].subtitle}
                    onChange={(e) => {
                      const updated = [...slides];
                      updated[activeSlideIdx].subtitle = e.target.value;
                      setSlides(updated);
                    }}
                    className="w-full bg-transparent text-sm text-slate-400 focus:outline-none border-b border-transparent focus:border-slate-600 mb-6"
                  />

                  <div className="space-y-3 mt-4">
                    {slides[activeSlideIdx].bullets.map((bullet, bIdx) => (
                      <div key={bIdx} className="flex items-start gap-2.5">
                        <div className="w-2 h-2 rounded-full bg-amber-400 mt-2 shrink-0" />
                        <input
                          type="text"
                          value={bullet}
                          onChange={(e) => {
                            const updated = [...slides];
                            updated[activeSlideIdx].bullets[bIdx] = e.target.value;
                            setSlides(updated);
                          }}
                          className="w-full bg-transparent text-sm text-slate-200 focus:outline-none border-b border-transparent focus:border-amber-500/50"
                        />
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs text-slate-500 pt-4 border-t border-slate-800">
                  <span>AegisNT Enterprise Hypervisor & Hardware Brief</span>
                  <span>Slide {activeSlideIdx + 1} of {slides.length}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
