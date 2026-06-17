"use client";

import { useState, useRef, useEffect } from "react";
import { Search, Bell, ShieldAlert, Menu } from "lucide-react";

const RECENT_NOTIFICATIONS = [
  {
    severity: "CRITICAL",
    text: "mimikatz_v2 signature in PID 4012",
    time: "3 mins ago",
    color: "text-pink-400",
    bg: "bg-pink-500/10",
  },
  {
    severity: "CRITICAL",
    text: "cobaltstrike_beacon in PID 1102",
    time: "8 mins ago",
    color: "text-pink-400",
    bg: "bg-pink-500/10",
  },
  {
    severity: "HIGH",
    text: "Lateral SMB to 10.0.0.45",
    time: "15 mins ago",
    color: "text-orange-400",
    bg: "bg-orange-500/10",
  },
];

interface HeaderProps {
  onMenuToggle?: () => void;
}

export default function Header({ onMenuToggle }: HeaderProps) {
  const [notifOpen, setNotifOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setNotifOpen(false);
      }
    }
    if (notifOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      return () =>
        document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [notifOpen]);

  return (
    <header className="flex h-16 shrink-0 items-center justify-between gap-x-4 border-b border-white/5 bg-black/50 backdrop-blur-md px-4 lg:px-6 shadow-sm">
      {/* Left side: hamburger + search */}
      <div className="flex items-center gap-x-3 flex-1">
        {/* Mobile hamburger */}
        <button
          onClick={onMenuToggle}
          className="lg:hidden p-2 -ml-2 rounded-lg text-white/40 hover:text-white hover:bg-white/5 transition-colors"
          aria-label="Open sidebar"
        >
          <Menu size={20} />
        </button>

        {/* Search */}
        <form className="relative flex flex-1" action="#" method="GET">
          <label htmlFor="search-field" className="sr-only">
            Search
          </label>
          <Search
            className="pointer-events-none absolute inset-y-0 left-0 h-full w-5 text-white/30"
            aria-hidden="true"
          />
          <input
            id="search-field"
            className="block h-full w-full border-0 bg-transparent py-0 pl-8 pr-0 text-white focus:ring-0 sm:text-sm placeholder:text-white/30 outline-none"
            placeholder="Search indicators (IP, Hash, PID)..."
            type="search"
            name="search"
          />
        </form>
      </div>

      {/* Right side: status, notifications, profile */}
      <div className="flex items-center gap-x-3 lg:gap-x-5">
        {/* System status */}
        <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-mono">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
          </span>
          SYSTEM ONLINE
        </div>

        {/* Notification bell */}
        <div className="relative" ref={dropdownRef}>
          <button
            type="button"
            onClick={() => setNotifOpen((v) => !v)}
            className="p-2 rounded-lg text-white/40 hover:text-white hover:bg-white/5 transition-colors relative"
            aria-label="View notifications"
          >
            <Bell className="h-5 w-5" aria-hidden="true" />
            <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-pink-500 shadow-[0_0_6px_rgba(236,72,153,0.6)]" />
          </button>

          {/* Notification dropdown */}
          {notifOpen && (
            <div className="absolute right-0 top-full mt-2 w-80 rounded-xl border border-white/10 bg-neutral-950/95 backdrop-blur-xl shadow-2xl shadow-black/50 z-50 overflow-hidden animate-fade-in-up">
              <div className="px-4 py-3 border-b border-white/5 flex items-center justify-between">
                <span className="text-xs font-bold text-white/70">
                  Recent Alerts
                </span>
                <span className="text-[9px] font-mono text-pink-400 px-2 py-0.5 rounded-full bg-pink-500/10">
                  3 NEW
                </span>
              </div>
              <div className="divide-y divide-white/5">
                {RECENT_NOTIFICATIONS.map((n, i) => (
                  <div
                    key={i}
                    className="px-4 py-3 hover:bg-white/[0.02] transition-colors cursor-pointer"
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <span
                        className={`text-[9px] font-mono font-bold px-1.5 py-0.5 rounded ${n.bg} ${n.color}`}
                      >
                        {n.severity}
                      </span>
                      <span className="text-[10px] text-white/30 font-mono ml-auto">
                        {n.time}
                      </span>
                    </div>
                    <p className="text-xs text-white/60 font-mono truncate">
                      {n.text}
                    </p>
                  </div>
                ))}
              </div>
              <div className="px-4 py-2.5 border-t border-white/5">
                <a
                  href="/alerts"
                  className="text-[10px] font-mono text-cyan-400 hover:text-cyan-300 uppercase tracking-widest transition-colors"
                >
                  View All Alerts →
                </a>
              </div>
            </div>
          )}
        </div>

        {/* Divider */}
        <div
          className="hidden lg:block lg:h-6 lg:w-px lg:bg-white/10"
          aria-hidden="true"
        />

        {/* Profile */}
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 rounded-full bg-neutral-800 border border-white/10 flex items-center justify-center text-cyan-400">
            <ShieldAlert size={16} />
          </div>
          <span className="hidden sm:block text-sm font-medium leading-6 text-white/80">
            Admin
          </span>
        </div>
      </div>
    </header>
  );
}
