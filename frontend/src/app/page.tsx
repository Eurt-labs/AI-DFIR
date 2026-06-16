"use client";

import { Activity, ShieldAlert, Cpu, Network, AlertOctagon, Terminal, FileSearch } from "lucide-react";

export default function Dashboard() {
  return (
    <div className="p-8 space-y-8">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold font-[var(--font-space-grotesk)] text-white">Investigation Overview</h1>
        <p className="text-white/50 text-sm mt-1">Real-time telemetry and Threat Confidence Scoring</p>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { label: "Active Alerts", value: "14", icon: ShieldAlert, color: "text-pink-500", bg: "bg-pink-500/10" },
          { label: "Files Analyzed", value: "24,581", icon: FileSearch, color: "text-cyan-400", bg: "bg-cyan-500/10" },
          { label: "Network Pkt/s", value: "3,412", icon: Network, color: "text-purple-400", bg: "bg-purple-500/10" },
          { label: "System Load", value: "42%", icon: Cpu, color: "text-emerald-400", bg: "bg-emerald-500/10" },
        ].map((stat, i) => (
          <div key={i} className="bg-neutral-900/50 border border-white/5 rounded-xl p-5 flex items-center justify-between">
            <div>
              <p className="text-white/40 text-xs font-mono uppercase mb-1">{stat.label}</p>
              <p className="text-2xl font-bold font-[var(--font-space-mono)]">{stat.value}</p>
            </div>
            <div className={`h-10 w-10 rounded-lg flex items-center justify-center ${stat.bg} ${stat.color}`}>
              <stat.icon size={20} />
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Main Threat Score Area */}
        <div className="lg:col-span-2 bg-neutral-900/50 border border-white/5 rounded-xl p-6 relative overflow-hidden flex flex-col justify-between min-h-[360px]">
          <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/5 rounded-full blur-3xl -mr-10 -mt-10 pointer-events-none"></div>
          
          <div className="flex justify-between items-start mb-6">
            <div>
              <h2 className="text-lg font-bold">Threat Confidence Score (TCS)</h2>
              <p className="text-xs text-white/40">Bayesian Probability calculated across all active modules</p>
            </div>
            <span className="px-3 py-1 bg-pink-500/10 border border-pink-500/20 text-pink-400 text-[10px] rounded-full font-mono animate-pulse">
              HIGH RISK
            </span>
          </div>

          <div className="flex flex-col md:flex-row gap-8 items-center justify-center flex-1">
            {/* Circular Dial Mockup */}
            <div className="relative flex items-center justify-center w-48 h-48 rounded-full border-8 border-neutral-800">
              <svg className="absolute inset-0 w-full h-full transform -rotate-90">
                <circle cx="88" cy="88" r="80" fill="none" stroke="currentColor" strokeWidth="16" className="text-neutral-800" />
                <circle cx="88" cy="88" r="80" fill="none" stroke="currentColor" strokeWidth="16" strokeDasharray="502" strokeDashoffset="125" className="text-pink-500 transition-all duration-1000 ease-out" strokeLinecap="round" />
              </svg>
              <div className="text-center z-10">
                <span className="block text-4xl font-black font-[var(--font-space-mono)]">0.75</span>
                <span className="text-[10px] text-white/30 tracking-widest mt-1 block">TCS SCORE</span>
              </div>
            </div>

            <div className="flex-1 space-y-4 font-mono text-xs w-full max-w-[240px]">
              <div className="flex justify-between items-center p-3 rounded bg-black/40 border border-white/5">
                <span className="text-white/60">Gaussian Anomaly</span>
                <span className="text-pink-400 font-bold">0.82</span>
              </div>
              <div className="flex justify-between items-center p-3 rounded bg-black/40 border border-white/5">
                <span className="text-white/60">Logistic Classifier</span>
                <span className="text-orange-400 font-bold">0.68</span>
              </div>
              <div className="flex justify-between items-center p-3 rounded bg-black/40 border border-white/5">
                <span className="text-white/60">Shannon Entropy</span>
                <span className="text-emerald-400 font-bold">0.21</span>
              </div>
            </div>
          </div>
        </div>

        {/* Live Terminal / Module Status */}
        <div className="bg-black border border-white/10 rounded-xl flex flex-col overflow-hidden min-h-[360px]">
          <div className="px-4 py-3 border-b border-white/5 bg-neutral-950 flex items-center gap-2 shrink-0">
            <Terminal size={14} className="text-white/40" />
            <h3 className="text-xs font-mono text-white/60 uppercase tracking-widest">Engine Logs</h3>
          </div>
          <div className="p-4 font-mono text-[11px] text-cyan-400 flex-1 space-y-3 overflow-y-auto leading-relaxed">
            <p><span className="text-white/30">[10:42:01]</span> Starting Volatility 3...</p>
            <p><span className="text-white/30">[10:42:05]</span> <span className="text-pink-400">[WARN]</span> Hidden process found (PID 4012)</p>
            <p><span className="text-white/30">[10:42:10]</span> Running Scapy packet analysis...</p>
            <p><span className="text-white/30">[10:42:12]</span> 847 packets parsed.</p>
            <p><span className="text-white/30">[10:42:15]</span> <span className="text-emerald-400">[OK]</span> No DNS tunneling detected.</p>
            <p><span className="text-white/30">[10:42:20]</span> Running Bayesian update...</p>
            <p className="animate-pulse"><span className="text-white/30">[10:42:22]</span> Awaiting next sweep...</p>
          </div>
        </div>

      </div>

      {/* Active Alerts Table */}
      <div className="bg-neutral-900/50 border border-white/5 rounded-xl overflow-hidden">
        <div className="px-6 py-4 border-b border-white/5 flex justify-between items-center">
          <h2 className="text-lg font-bold">Recent Anomalies</h2>
          <button className="text-[10px] font-mono text-cyan-400 hover:text-cyan-300 transition-colors uppercase tracking-widest border border-cyan-400/20 px-3 py-1.5 rounded bg-cyan-400/10">View All</button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-black/40 text-white/40 text-[10px] font-mono uppercase tracking-wider">
              <tr>
                <th className="px-6 py-4 font-medium">Severity</th>
                <th className="px-6 py-4 font-medium">Indicator</th>
                <th className="px-6 py-4 font-medium">Module Source</th>
                <th className="px-6 py-4 font-medium">Time</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 text-white/70">
              <tr className="hover:bg-white/[0.02] transition-colors group">
                <td className="px-6 py-4">
                  <span className="inline-flex items-center gap-1.5 px-2 py-1 rounded bg-pink-500/10 text-pink-400 text-[10px] font-mono font-bold tracking-wider">
                    <AlertOctagon size={12} /> CRITICAL
                  </span>
                </td>
                <td className="px-6 py-4 font-mono text-[13px] text-white group-hover:text-cyan-400 transition-colors">svchost.exe (PID 4012) Unbacked Memory</td>
                <td className="px-6 py-4 text-xs">Volatility 3 (malfind)</td>
                <td className="px-6 py-4 text-white/40 text-xs">2 mins ago</td>
              </tr>
              <tr className="hover:bg-white/[0.02] transition-colors group">
                <td className="px-6 py-4">
                  <span className="inline-flex items-center gap-1.5 px-2 py-1 rounded bg-orange-500/10 text-orange-400 text-[10px] font-mono font-bold tracking-wider">
                    <ShieldAlert size={12} /> HIGH
                  </span>
                </td>
                <td className="px-6 py-4 font-mono text-[13px] text-white group-hover:text-cyan-400 transition-colors">Outbound SMB Connection 10.0.0.45</td>
                <td className="px-6 py-4 text-xs">Scapy + Gaussian Engine</td>
                <td className="px-6 py-4 text-white/40 text-xs">15 mins ago</td>
              </tr>
              <tr className="hover:bg-white/[0.02] transition-colors group">
                <td className="px-6 py-4">
                  <span className="inline-flex items-center gap-1.5 px-2 py-1 rounded bg-yellow-500/10 text-yellow-400 text-[10px] font-mono font-bold tracking-wider">
                    <Activity size={12} /> MEDIUM
                  </span>
                </td>
                <td className="px-6 py-4 font-mono text-[13px] text-white group-hover:text-cyan-400 transition-colors">High Entropy File: document.pdf.enc</td>
                <td className="px-6 py-4 text-xs">Shannon Entropy Check</td>
                <td className="px-6 py-4 text-white/40 text-xs">1 hour ago</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
