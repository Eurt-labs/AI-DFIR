"use client";

import { Database, Search, Lock, Cpu, Network, HardDrive, Activity, Terminal, Shield } from "lucide-react";

const ARTIFACT_CATEGORIES = [
  {
    name: "System Logs",
    desc: "Parses Windows Event Logs (.evtx), Linux syslog and auth logs using Python log normalizers and Elasticsearch ingestion pipelines.",
    targets: "Brute-force login signatures, privilege escalations, scheduled task creation, process spawning patterns.",
    icon: Database,
    color: "cyan",
  },
  {
    name: "Browser Web History",
    desc: "Extracts local browser profiles (Chrome, Firefox, Edge, Safari) using direct SQLite database decoders.",
    targets: "Attacker reconnaissance history, phishing access vectors, cache structures, cached credential tables.",
    icon: Search,
    color: "emerald",
  },
  {
    name: "Windows Registry",
    desc: "Decrypts NTUSER.DAT, SYSTEM, SOFTWARE, SAM hives using Python python-registry modules.",
    targets: "Persistence registries (Run/RunOnce keys), USB connection traces, shellbags, UserAssist timestamps.",
    icon: Lock,
    color: "pink",
  },
  {
    name: "Memory RAM Dumps",
    desc: "Automates Volatility 3 command plugin analysis to parse raw physical RAM dumps, recovering transient and fileless malware traces.",
    targets: "Active process listings (pslist/pstree), network sockets (netscan), injected DLL modules (malfind).",
    icon: Cpu,
    color: "cyan",
  },
  {
    name: "Network Packets (PCAP)",
    desc: "Inspects live packet structures or raw PCAPs utilizing Wireshark/tshark pipelines and Python Scapy decoders.",
    targets: "Command & Control beacon timing anomalies, DNS tunneling channels, large outbound exfiltrations.",
    icon: Network,
    color: "emerald",
  },
  {
    name: "File System Metadata",
    desc: "Performs file system integrity and MACB metadata scans using Autopsy pipelines and disk writing blockers.",
    targets: "Timestomping identification, files in %TEMP%/AppData, high-entropy packed directory segments.",
    icon: HardDrive,
    color: "pink",
  },
  {
    name: "Process Execution Traces",
    desc: "Decodes Windows Prefetch (.pf) files, AppCompatCache (Shimcache), Amcache registries, and Linux audit logs.",
    targets: "Historical process executions, execution path mismatches, programs run prior to automated deletion.",
    icon: Activity,
    color: "cyan",
  },
  {
    name: "PowerShell & Shell Logs",
    desc: "Parses historical PowerShell scripts, transcript logs, and Linux bash/zsh shell histories.",
    targets: "Base64 encoded arguments, download cradles (IEX/Invoke-WebRequest), LOLBAS executions, mimikatz commands.",
    icon: Terminal,
    color: "emerald",
  },
  {
    name: "USB Device Registers",
    desc: "Queries system setupapi logs, udev properties, and Windows USBSTOR registry structures.",
    targets: "Removable drives, mounting serial numbers, timestamps, correlated file modifications.",
    icon: Shield,
    color: "pink",
  },
];

const colorMap: Record<string, { text: string; bg: string; border: string }> = {
  cyan: { text: "text-cyan-400", bg: "bg-cyan-500/10", border: "border-cyan-500/15" },
  emerald: { text: "text-emerald-400", bg: "bg-emerald-500/10", border: "border-emerald-500/15" },
  pink: { text: "text-pink-400", bg: "bg-pink-500/10", border: "border-pink-500/15" },
};

export default function EvidencePage() {
  return (
    <div className="p-8 space-y-8">
      <div>
        <h1 className="text-2xl font-bold font-[var(--font-space-grotesk)] text-white">Evidence Browser</h1>
        <p className="text-white/50 text-sm mt-1">
          9 forensic artifact categories collected and parsed by the framework
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {ARTIFACT_CATEGORIES.map((art, i) => {
          const colors = colorMap[art.color];
          return (
            <div
              key={i}
              className={`rounded-xl p-6 bg-neutral-900/50 border ${colors.border} space-y-4 hover:bg-neutral-900/70 transition-all`}
            >
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${colors.bg}`}>
                <art.icon size={18} className={colors.text} />
              </div>
              <div className="space-y-1">
                <h3 className="text-base font-bold text-white/90">{art.name}</h3>
                <p className="text-xs text-white/50 leading-relaxed font-light">{art.desc}</p>
              </div>
              <div className="pt-3 border-t border-white/5 space-y-1">
                <span className="text-[10px] font-mono uppercase tracking-widest text-white/30 block">
                  FORENSIC TARGETS
                </span>
                <p className={`text-xs leading-normal font-mono ${colors.text}`}>{art.targets}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}