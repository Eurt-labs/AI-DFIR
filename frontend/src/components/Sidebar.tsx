"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, AlertTriangle, FileSearch, Activity, Settings, Database } from "lucide-react";

const navigation = [
  { name: "Overview", href: "/", icon: LayoutDashboard },
  { name: "Alerts & Triage", href: "/alerts", icon: AlertTriangle },
  { name: "Evidence Browser", href: "/evidence", icon: FileSearch },
  { name: "Reports", href: "/reports", icon: Database },
  { name: "ML Engine", href: "/models", icon: Activity },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <div className="flex h-full w-64 flex-col bg-neutral-950 border-r border-white/5">
      <div className="flex h-16 shrink-0 items-center px-6 border-b border-white/5">
        <span className="font-[var(--font-orbitron)] font-black text-xl tracking-tight">
          <span className="text-cyan-400">AI</span>
          <span className="text-white">-DFIR</span>
        </span>
      </div>
      <div className="flex flex-1 flex-col overflow-y-auto pt-6 px-4">
        <nav className="flex-1 space-y-1">
          {navigation.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`group flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200 ${
                  isActive
                    ? "bg-cyan-500/10 text-cyan-400"
                    : "text-white/50 hover:bg-white/5 hover:text-white"
                }`}
              >
                <item.icon
                  className={`h-5 w-5 flex-shrink-0 ${
                    isActive ? "text-cyan-400" : "text-white/40 group-hover:text-white"
                  }`}
                  aria-hidden="true"
                />
                {item.name}
              </Link>
            );
          })}
        </nav>
        <div className="mt-auto pb-4">
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
