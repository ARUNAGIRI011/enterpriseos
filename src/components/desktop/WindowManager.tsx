import React, { useState, useRef } from 'react';
import { Minus, Square, X, Copy, LayoutGrid } from 'lucide-react';
import { AppWindow } from '../../types/os';

interface WindowManagerProps {
  windows: AppWindow[];
  activeWindowId: string | null;
  onFocus: (id: string) => void;
  onClose: (id: string) => void;
  onMinimize: (id: string) => void;
  onMaximize: (id: string) => void;
  renderAppContent: (appId: string) => React.ReactNode;
}

export default function WindowManager({
  windows,
  activeWindowId,
  onFocus,
  onClose,
  onMinimize,
  onMaximize,
  renderAppContent
}: WindowManagerProps) {
  // Dragging state
  const [draggingId, setDraggingId] = useState<string | null>(null);
  const [dragOffset, setDragOffset] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [windowPositions, setWindowPositions] = useState<Record<string, { x: number; y: number; width?: number; height?: number }>>({});
  
  // Snap Layouts Hover State
  const [snapFlyoutWinId, setSnapFlyoutWinId] = useState<string | null>(null);
  const snapTimerRef = useRef<any>(null);

  // Resizing state
  const [resizingId, setResizingId] = useState<string | null>(null);
  const [resizeStart, setResizeStart] = useState<{ x: number; y: number; width: number; height: number }>({ x: 0, y: 0, width: 0, height: 0 });

  const handleMouseDownHeader = (e: React.MouseEvent, win: AppWindow) => {
    if (win.isMaximized) return;
    onFocus(win.id);
    setDraggingId(win.id);
    const curPos = windowPositions[win.id] || { x: win.x, y: win.y };
    setDragOffset({
      x: e.clientX - curPos.x,
      y: e.clientY - curPos.y
    });
  };

  const handleMouseDownResize = (e: React.MouseEvent, win: AppWindow) => {
    e.stopPropagation();
    onFocus(win.id);
    setResizingId(win.id);
    const cur = windowPositions[win.id] || { x: win.x, y: win.y, width: win.width, height: win.height };
    setResizeStart({
      x: e.clientX,
      y: e.clientY,
      width: cur.width || win.width,
      height: cur.height || win.height,
    });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (draggingId) {
      const newX = Math.max(0, Math.min(window.innerWidth - 300, e.clientX - dragOffset.x));
      const newY = Math.max(0, Math.min(window.innerHeight - 100, e.clientY - dragOffset.y));
      setWindowPositions(prev => ({
        ...prev,
        [draggingId]: {
          ...prev[draggingId],
          x: newX,
          y: newY
        }
      }));
    } else if (resizingId) {
      const deltaX = e.clientX - resizeStart.x;
      const deltaY = e.clientY - resizeStart.y;
      const newW = Math.max(480, Math.min(window.innerWidth, resizeStart.width + deltaX));
      const newH = Math.max(340, Math.min(window.innerHeight - 48, resizeStart.height + deltaY));
      setWindowPositions(prev => ({
        ...prev,
        [resizingId]: {
          ...(prev[resizingId] || {}),
          x: prev[resizingId]?.x ?? 40,
          y: prev[resizingId]?.y ?? 40,
          width: newW,
          height: newH,
        }
      }));
    }
  };

  const handleMouseUp = () => {
    setDraggingId(null);
    setResizingId(null);
  };

  // Windows 11 Snap Layouts snap action
  const handleSnapWindow = (winId: string, region: 'left-half' | 'right-half' | 'left-two-thirds' | 'right-one-third' | 'col-1' | 'col-2' | 'col-3' | 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right') => {
    const taskbarH = 48;
    const screenW = window.innerWidth;
    const screenH = window.innerHeight - taskbarH;

    let target = { x: 0, y: 0, width: screenW, height: screenH };

    switch (region) {
      case 'left-half':
        target = { x: 0, y: 0, width: Math.floor(screenW / 2), height: screenH };
        break;
      case 'right-half':
        target = { x: Math.floor(screenW / 2), y: 0, width: Math.floor(screenW / 2), height: screenH };
        break;
      case 'left-two-thirds':
        target = { x: 0, y: 0, width: Math.floor((screenW * 2) / 3), height: screenH };
        break;
      case 'right-one-third':
        target = { x: Math.floor((screenW * 2) / 3), y: 0, width: Math.floor(screenW / 3), height: screenH };
        break;
      case 'col-1':
        target = { x: 0, y: 0, width: Math.floor(screenW / 3), height: screenH };
        break;
      case 'col-2':
        target = { x: Math.floor(screenW / 3), y: 0, width: Math.floor(screenW / 3), height: screenH };
        break;
      case 'col-3':
        target = { x: Math.floor((screenW * 2) / 3), y: 0, width: Math.floor(screenW / 3), height: screenH };
        break;
      case 'top-left':
        target = { x: 0, y: 0, width: Math.floor(screenW / 2), height: Math.floor(screenH / 2) };
        break;
      case 'top-right':
        target = { x: Math.floor(screenW / 2), y: 0, width: Math.floor(screenW / 2), height: Math.floor(screenH / 2) };
        break;
      case 'bottom-left':
        target = { x: 0, y: Math.floor(screenH / 2), width: Math.floor(screenW / 2), height: Math.floor(screenH / 2) };
        break;
      case 'bottom-right':
        target = { x: Math.floor(screenW / 2), y: Math.floor(screenH / 2), width: Math.floor(screenW / 2), height: Math.floor(screenH / 2) };
        break;
    }

    setWindowPositions(prev => ({
      ...prev,
      [winId]: target
    }));

    setSnapFlyoutWinId(null);
  };

  return (
    <div
      className="absolute inset-0 pointer-events-none overflow-hidden"
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
    >
      {windows.map((win) => {
        if (win.isMinimized) return null;

        const isFocused = activeWindowId === win.id;
        const pos = windowPositions[win.id] || { x: win.x, y: win.y, width: win.width, height: win.height };
        const winWidth = pos.width || win.width;
        const winHeight = pos.height || win.height;

        const style: React.CSSProperties = win.isMaximized
          ? {
              top: 0,
              left: 0,
              width: '100vw',
              height: 'calc(100vh - 48px)', // leaves room for taskbar
              zIndex: win.zIndex
            }
          : {
              top: `${pos.y}px`,
              left: `${pos.x}px`,
              width: `${winWidth}px`,
              height: `${winHeight}px`,
              zIndex: win.zIndex
            };

        return (
          <div
            key={win.id}
            style={style}
            onClick={() => onFocus(win.id)}
            className={`absolute flex flex-col ${
              win.isMaximized ? 'rounded-none' : 'rounded-xl'
            } overflow-hidden pointer-events-auto border transition-all duration-150 ${
              isFocused
                ? 'border-slate-700/80 shadow-2xl ring-1 ring-blue-500/40 shadow-blue-950/40'
                : 'border-slate-800 shadow-lg opacity-95'
            } bg-slate-950/95 backdrop-blur-2xl`}
          >
            {/* Title Bar (Windows 11 Fluent Mica Style) */}
            <div
              onMouseDown={(e) => handleMouseDownHeader(e, win)}
              className={`h-9 flex items-center justify-between px-3 select-none cursor-move border-b border-slate-800/80 ${
                isFocused ? 'bg-slate-900/90 text-slate-100' : 'bg-slate-950/80 text-slate-400'
              }`}
            >
              {/* App Icon + Title */}
              <div className="flex items-center gap-2 overflow-hidden pr-2">
                <div className="grid grid-cols-2 gap-0.5 w-3 h-3 shrink-0">
                  <div className="bg-cyan-400 rounded-xs" />
                  <div className="bg-blue-500 rounded-xs" />
                  <div className="bg-blue-400 rounded-xs" />
                  <div className="bg-indigo-500 rounded-xs" />
                </div>
                <span className="text-xs font-medium truncate font-sans text-slate-200">
                  {win.title}
                </span>
              </div>

              {/* Window Controls (Windows 11 Minimize, Maximize/Snap, Close) */}
              <div className="flex items-center h-full relative">
                {/* Minimize Button */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onMinimize(win.id);
                  }}
                  className="w-11 h-full flex items-center justify-center hover:bg-slate-800/80 text-slate-400 hover:text-slate-100 transition-colors"
                  title="Minimize"
                >
                  <Minus className="w-3.5 h-3.5" />
                </button>

                {/* Maximize & Snap Layouts Hover Button */}
                <div
                  className="relative h-full"
                  onMouseEnter={() => {
                    if (snapTimerRef.current) clearTimeout(snapTimerRef.current);
                    snapTimerRef.current = setTimeout(() => {
                      setSnapFlyoutWinId(win.id);
                    }, 250);
                  }}
                  onMouseLeave={() => {
                    if (snapTimerRef.current) clearTimeout(snapTimerRef.current);
                    snapTimerRef.current = setTimeout(() => {
                      setSnapFlyoutWinId(null);
                    }, 400);
                  }}
                >
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setSnapFlyoutWinId(null);
                      onMaximize(win.id);
                    }}
                    className="w-11 h-full flex items-center justify-center hover:bg-slate-800/80 text-slate-400 hover:text-slate-100 transition-colors"
                    title={win.isMaximized ? 'Restore Down' : 'Maximize (Hover for Snap Layouts)'}
                  >
                    {win.isMaximized ? <Copy className="w-3 h-3" /> : <Square className="w-3 h-3" />}
                  </button>

                  {/* Windows 11 Snap Layouts Flyout Matrix */}
                  {snapFlyoutWinId === win.id && (
                    <div
                      onClick={(e) => e.stopPropagation()}
                      className="absolute top-full right-0 mt-1 w-64 bg-slate-900/98 border border-slate-700/90 rounded-xl shadow-2xl p-2.5 z-50 text-slate-200 backdrop-blur-2xl animate-in fade-in zoom-in-95 duration-150"
                    >
                      <div className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1.5 px-1">
                        <LayoutGrid className="w-3 h-3 text-blue-400" />
                        <span>Snap Layouts</span>
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        {/* 1. Split 50 / 50 */}
                        <div className="flex gap-1 h-12 p-1 rounded-lg border border-slate-800 bg-slate-950/60 hover:border-slate-700 transition-colors">
                          <button
                            onClick={() => handleSnapWindow(win.id, 'left-half')}
                            className="flex-1 rounded bg-slate-800 hover:bg-blue-600 transition-colors flex items-center justify-center text-[9px] text-slate-400 hover:text-white"
                            title="Snap Left"
                          >
                            50%
                          </button>
                          <button
                            onClick={() => handleSnapWindow(win.id, 'right-half')}
                            className="flex-1 rounded bg-slate-800 hover:bg-blue-600 transition-colors flex items-center justify-center text-[9px] text-slate-400 hover:text-white"
                            title="Snap Right"
                          >
                            50%
                          </button>
                        </div>

                        {/* 2. Split 70 / 30 */}
                        <div className="flex gap-1 h-12 p-1 rounded-lg border border-slate-800 bg-slate-950/60 hover:border-slate-700 transition-colors">
                          <button
                            onClick={() => handleSnapWindow(win.id, 'left-two-thirds')}
                            className="w-2/3 rounded bg-slate-800 hover:bg-blue-600 transition-colors flex items-center justify-center text-[9px] text-slate-400 hover:text-white"
                            title="Snap Left 70%"
                          >
                            67%
                          </button>
                          <button
                            onClick={() => handleSnapWindow(win.id, 'right-one-third')}
                            className="w-1/3 rounded bg-slate-800 hover:bg-blue-600 transition-colors flex items-center justify-center text-[9px] text-slate-400 hover:text-white"
                            title="Snap Right 30%"
                          >
                            33%
                          </button>
                        </div>

                        {/* 3. Three Columns */}
                        <div className="flex gap-1 h-12 p-1 rounded-lg border border-slate-800 bg-slate-950/60 hover:border-slate-700 transition-colors">
                          <button
                            onClick={() => handleSnapWindow(win.id, 'col-1')}
                            className="flex-1 rounded bg-slate-800 hover:bg-blue-600 transition-colors text-[8px] text-slate-400 hover:text-white"
                            title="Column 1"
                          />
                          <button
                            onClick={() => handleSnapWindow(win.id, 'col-2')}
                            className="flex-1 rounded bg-slate-800 hover:bg-blue-600 transition-colors text-[8px] text-slate-400 hover:text-white"
                            title="Column 2"
                          />
                          <button
                            onClick={() => handleSnapWindow(win.id, 'col-3')}
                            className="flex-1 rounded bg-slate-800 hover:bg-blue-600 transition-colors text-[8px] text-slate-400 hover:text-white"
                            title="Column 3"
                          />
                        </div>

                        {/* 4. Four Quadrants */}
                        <div className="grid grid-cols-2 grid-rows-2 gap-1 h-12 p-1 rounded-lg border border-slate-800 bg-slate-950/60 hover:border-slate-700 transition-colors">
                          <button
                            onClick={() => handleSnapWindow(win.id, 'top-left')}
                            className="rounded bg-slate-800 hover:bg-blue-600 transition-colors"
                            title="Top-Left"
                          />
                          <button
                            onClick={() => handleSnapWindow(win.id, 'top-right')}
                            className="rounded bg-slate-800 hover:bg-blue-600 transition-colors"
                            title="Top-Right"
                          />
                          <button
                            onClick={() => handleSnapWindow(win.id, 'bottom-left')}
                            className="rounded bg-slate-800 hover:bg-blue-600 transition-colors"
                            title="Bottom-Left"
                          />
                          <button
                            onClick={() => handleSnapWindow(win.id, 'bottom-right')}
                            className="rounded bg-slate-800 hover:bg-blue-600 transition-colors"
                            title="Bottom-Right"
                          />
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Close Button (Authentic Windows 11 Red Hover) */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onClose(win.id);
                  }}
                  className="w-11 h-full flex items-center justify-center hover:bg-red-600 text-slate-400 hover:text-white transition-colors"
                  title="Close"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Window Content */}
            <div className="flex-1 overflow-hidden bg-slate-950 relative">
              {renderAppContent(win.appId)}
            </div>

            {/* Resizing Handle on Bottom Right */}
            {!win.isMaximized && (
              <div
                onMouseDown={(e) => handleMouseDownResize(e, win)}
                className="absolute bottom-0 right-0 w-4 h-4 cursor-se-resize flex items-end justify-end p-0.5 text-slate-600 hover:text-blue-400 transition-colors select-none z-30"
              >
                <div className="w-1.5 h-1.5 border-r-2 border-b-2 border-current" />
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
