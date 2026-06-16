"use client";

import { Search, Bell, ShieldAlert } from "lucide-react";

export default function Header() {
  return (
    <header className="flex h-16 shrink-0 items-center justify-between gap-x-4 border-b border-white/5 bg-black/50 backdrop-blur-md px-6 shadow-sm">
      <div className="flex flex-1 gap-x-4 lg:gap-x-6">
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
      <div className="flex items-center gap-x-4 lg:gap-x-6">
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-mono">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          SYSTEM ONLINE
        </div>
        
        <button type="button" className="-m-2.5 p-2.5 text-white/40 hover:text-white transition-colors relative">
          <span className="sr-only">View notifications</span>
          <Bell className="h-5 w-5" aria-hidden="true" />
          <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-pink-500"></span>
        </button>

        <div className="hidden lg:block lg:h-6 lg:w-px lg:bg-white/10" aria-hidden="true" />

        <div className="flex items-center gap-3">
          <div className="h-8 w-8 rounded-full bg-neutral-800 border border-white/10 flex items-center justify-center text-cyan-400">
            <ShieldAlert size={16} />
          </div>
          <span className="text-sm font-medium leading-6 text-white/80">Admin</span>
        </div>
      </div>
    </header>
  );
}
