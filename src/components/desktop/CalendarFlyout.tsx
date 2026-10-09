import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Bell, Trash2, CheckCircle2 } from 'lucide-react';

interface CalendarFlyoutProps {
  isOpen: boolean;
  onClose: () => void;
  notifications: Array<{ id: string; title: string; message: string; time: string }>;
  onClearNotifications: () => void;
}

export default function CalendarFlyout({
  isOpen,
  onClose,
  notifications,
  onClearNotifications,
}: CalendarFlyoutProps) {
  const [currentDate, setCurrentDate] = useState(new Date());

  if (!isOpen) return null;

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const firstDayIndex = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const today = new Date();

  const handlePrevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  // Generate calendar days
  const calendarCells: Array<{ day: number; isCurrentMonth: boolean; isToday: boolean }> = [];
  
  // Empty pad for first day
  for (let i = 0; i < firstDayIndex; i++) {
    calendarCells.push({ day: 0, isCurrentMonth: false, isToday: false });
  }

  // Days of current month
  for (let d = 1; d <= daysInMonth; d++) {
    const isToday =
      today.getFullYear() === year &&
      today.getMonth() === month &&
      today.getDate() === d;
    calendarCells.push({ day: d, isCurrentMonth: true, isToday });
  }

  return (
    <div
      onClick={(e) => e.stopPropagation()}
      className="fixed bottom-14 right-3 w-88 bg-slate-900/95 border border-slate-700/80 rounded-2xl shadow-2xl backdrop-blur-2xl z-50 p-4 text-slate-100 font-sans select-none flex flex-col gap-4"
    >
      {/* Date Header */}
      <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
        <div>
          <h3 className="text-base font-semibold text-slate-100">
            {today.toLocaleDateString(undefined, { weekday: 'long' })}
          </h3>
          <p className="text-xs text-blue-400 font-medium">
            {today.toLocaleDateString(undefined, { month: 'long', day: 'numeric', year: 'numeric' })}
          </p>
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={handlePrevMonth}
            className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            onClick={handleNextMonth}
            className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Month & Year Title */}
      <div className="flex items-center justify-between text-xs font-semibold text-slate-300">
        <span>{monthNames[month]} {year}</span>
        <span className="text-[10px] text-slate-500 font-mono">UTC+00:00</span>
      </div>

      {/* Day of Week Row */}
      <div className="grid grid-cols-7 text-center text-[11px] font-semibold text-slate-400">
        <span>Su</span>
        <span>Mo</span>
        <span>Tu</span>
        <span>We</span>
        <span>Th</span>
        <span>Fr</span>
        <span>Sa</span>
      </div>

      {/* Calendar Grid */}
      <div className="grid grid-cols-7 gap-1 text-center text-xs">
        {calendarCells.map((cell, idx) => {
          if (!cell.isCurrentMonth) {
            return <div key={idx} className="h-8" />;
          }

          return (
            <button
              key={idx}
              className={`h-8 rounded-full flex items-center justify-center font-medium transition-all ${
                cell.isToday
                  ? 'bg-blue-600 text-white font-bold shadow-md shadow-blue-500/30 ring-2 ring-blue-400/50'
                  : 'text-slate-200 hover:bg-slate-800'
              }`}
            >
              {cell.day}
            </button>
          );
        })}
      </div>

      {/* Notification Center Feed */}
      <div className="border-t border-slate-800/80 pt-3 flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-300">
            <Bell className="w-3.5 h-3.5 text-blue-400" />
            <span>Notifications ({notifications.length})</span>
          </div>
          {notifications.length > 0 && (
            <button
              onClick={onClearNotifications}
              className="text-[11px] text-slate-400 hover:text-rose-400 flex items-center gap-1 transition-colors"
            >
              <Trash2 className="w-3 h-3" />
              <span>Clear all</span>
            </button>
          )}
        </div>

        <div className="max-h-40 overflow-y-auto space-y-2 pr-1">
          {notifications.length === 0 ? (
            <div className="py-4 text-center text-slate-500 text-xs">
              No new notifications
            </div>
          ) : (
            notifications.map((n) => (
              <div
                key={n.id}
                className="p-2.5 rounded-xl bg-slate-800/60 border border-slate-700/50 text-left text-xs"
              >
                <div className="flex items-center justify-between mb-0.5">
                  <span className="font-semibold text-slate-200">{n.title}</span>
                  <span className="text-[10px] text-slate-400 font-mono">{n.time}</span>
                </div>
                <p className="text-[11px] text-slate-400 leading-tight">{n.message}</p>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
