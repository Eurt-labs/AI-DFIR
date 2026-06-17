"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  AlertTriangle,
  FileSearch,
  Activity,
  Settings,
  Database,
  Workflow,
  X,
} from "lucide-react";

const navigation = [
  { name: "Overview", href: "/", icon: LayoutDashboard },
  { name: "Alerts & Triage", href: "/alerts", icon: AlertTriangle },
  { name: "Evidence Browser", href: "/evidence", icon: FileSearch },
  { name: "Data Pipeline", href: "/pipeline", icon: Workflow },
  { name: "Reports", href: "/reports", icon: Database },
  { name: "ML Engine", href: "/models", icon: Activity },
];

interface SidebarProps {
  onClose?: () => void;
}

export default function Sidebar({ onClose }: SidebarProps) {
  const pathname = usePathname();

  return (
    <div className="flex h-full w-64 flex-col bg-neutral-950 border-r border-white/5">
      {/* Logo + mobile close */}
      <div className="flex h-16 shrink-0 items-center justify-between px-6 border-b border-white/5">
        <span className="font-[var(--font-orbitron)] font-black text-xl tracking-tight">
          <span className="text-cyan-400 glow-cyan">AI</span>
          <span className="text-white">-DFIR</span>
        </span>
        {/* Mobile close button */}
        <button
          onClick={onClose}
          className="lg:hidden p-1 rounded-md text-white/40 hover:text-white hover:bg-white/5 transition-colors"
          aria-label="Close sidebar"
        >
          <X size={18} />
        </button>
      </div>

      {/* Navigation */}
      <div className="flex flex-1 flex-col overflow-y-auto pt-6 px-4">
        <nav className="flex-1 space-y-1">
          {navigation.map((item, i) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                onClick={onClose}
                className={`group relative flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200 animate-fade-in-up ${
                  isActive
                    ? "bg-cyan-500/10 text-cyan-400"
                    : "text-white/50 hover:bg-white/5 hover:text-white"
                }`}
                style={{ animationDelay: `${i * 50}ms` }}
              >
                {/* Active indicator bar */}
                {isActive && (
                  <span className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-5 rounded-r-full bg-cyan-400 shadow-[0_0_8px_rgba(0,240,255,0.5)]" />
                )}
                <item.icon
                  className={`h-5 w-5 flex-shrink-0 transition-colors ${
                    isActive
                      ? "text-cyan-400"
                      : "text-white/40 group-hover:text-white"
                  }`}
                  aria-hidden="true"
                />
                {item.name}
              </Link>
            );
          })}
        </nav>

        {/* Version + settings */}
        <div className="mt-auto pb-4 space-y-2">
          <div className="px-3 py-2">
            <span className="text-[9px] font-mono text-white/15 uppercase tracking-widest block">
              AI-DFIR v0.2.0
            </span>
            <span className="text-[9px] font-mono text-white/10 block mt-0.5">
              Phase 2 · Data Pipeline
            </span>
          </div>
          <Link
            href="/settings"
            className="group flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-white/50 hover:bg-white/5 hover:text-white transition-all"
          >
            <Settings className="h-5 w-5 text-white/40 group-hover:text-white" />
            Settings
          </Link>
        </div>
      </div>
    </div>
  );
}
