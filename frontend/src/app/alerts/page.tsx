"use client";

import { AlertOctagon, ShieldAlert, Activity } from "lucide-react";

const ALERTS_DATA = [
  {
    severity: "CRITICAL",
    severityColor: "bg-pink-500/10 text-pink-400",
    indicator: "svchost.exe (PID 4012) Unbacked Memory",
    source: "Volatility 3 (malfind)",
    mitre: "TA0004 — Privilege Escalation",
    time: "2 mins ago",
  },
  {
    severity: "CRITICAL",
    severityColor: "bg-pink-500/10 text-pink-400",
    indicator: "mimikatz_v2 signature in PID 4012",
    source: "YARA Rule: apt_signatures.yar",
    mitre: "TA0006 — Credential Access",
    time: "3 mins ago",
  },
  {
    severity: "HIGH",
    severityColor: "bg-orange-500/10 text-orange-400",
    indicator: "cobaltstrike_beacon signature (PID 1102)",
    source: "YARA Rule + Scapy Beacon Analysis",
    mitre: "TA0011 — Command & Control",
    time: "8 mins ago",
  },
  {
    severity: "HIGH",
    severityColor: "bg-orange-500/10 text-orange-400",
    indicator: "Outbound SMB lateral to 10.0.0.45",
    source: "Scapy + Gaussian Engine",
    mitre: "TA0008 — Lateral Movement",
    time: "15 mins ago",
  },
  {
    severity: "MEDIUM",
    severityColor: "bg-yellow-500/10 text-yellow-400",
    indicator: "High Entropy File: document.pdf.enc (H=7.82)",
    source: "Shannon Entropy Check",
    mitre: "TA0040 — Impact (Ransomware)",
    time: "42 mins ago",
  },
  {
    severity: "MEDIUM",
    severityColor: "bg-yellow-500/10 text-yellow-400",
    indicator: "New Run/RunOnce key: HKCU\\Software\\Microsoft\\Windows",
    source: "Registry Hive Monitor",
    mitre: "TA0003 — Persistence",
    time: "1 hour ago",
  },
  {
    severity: "LOW",
    severityColor: "bg-emerald-500/10 text-emerald-400",
    indicator: "PowerShell Base64 encoded argument detected",
    source: "Shell Transcript Log Parser",
    mitre: "TA0002 — Execution",
    time: "2 hours ago",
  },
];

const SeverityIcon = ({ severity }: { severity: string }) => {
  if (severity === "CRITICAL") return <AlertOctagon size={12} />;
  if (severity === "HIGH") return <ShieldAlert size={12} />;
  if (severity === "MEDIUM") return <Activity size={12} />;
  return <Activity size={12} />;
};

export default function AlertsPage() {
  return (
    <div className="p-8 space-y-8">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-2xl font-bold font-[var(--font-space-grotesk)] text-white">Alerts & Triage</h1>
          <p className="text-white/50 text-sm mt-1">
            Anomalies flagged by ML models, mapped to MITRE ATT&CK tactics
          </p>
        </div>
        <div className="flex gap-2 text-[10px] font-mono">
          <span className="px-3 py-1.5 rounded-full bg-pink-500/10 text-pink-400 border border-pink-500/20">
            CRITICAL: 2
          </span>
          <span className="px-3 py-1.5 rounded-full bg-orange-500/10 text-orange-400 border border-orange-500/20">
            HIGH: 2
          </span>
          <span className="px-3 py-1.5 rounded-full bg-yellow-500/10 text-yellow-400 border border-yellow-500/20">
            MEDIUM: 2
          </span>
        </div>
      </div>

      <div className="bg-neutral-900/50 border border-white/5 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-black/40 text-white/40 text-[10px] font-mono uppercase tracking-wider">
              <tr>
                <th className="px-6 py-4 font-medium">Severity</th>
                <th className="px-6 py-4 font-medium">Indicator</th>
                <th className="px-6 py-4 font-medium">Module Source</th>
                <th className="px-6 py-4 font-medium">MITRE ATT&CK</th>
                <th className="px-6 py-4 font-medium">Time</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 text-white/70">
              {ALERTS_DATA.map((alert, i) => (
                <tr key={i} className="hover:bg-white/[0.02] transition-colors group">
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex items-center gap-1.5 px-2 py-1 rounded ${alert.severityColor} text-[10px] font-mono font-bold tracking-wider`}
                    >
                      <SeverityIcon severity={alert.severity} /> {alert.severity}
                    </span>
                  </td>
                  <td className="px-6 py-4 font-mono text-[13px] text-white group-hover:text-cyan-400 transition-colors">
                    {alert.indicator}
                  </td>
                  <td className="px-6 py-4 text-xs">{alert.source}</td>
                  <td className="px-6 py-4 text-xs font-mono text-cyan-400/70">{alert.mitre}</td>
                  <td className="px-6 py-4 text-white/40 text-xs">{alert.time}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}