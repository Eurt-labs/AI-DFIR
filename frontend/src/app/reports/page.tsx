"use client";

import {
  FileText,
  Shield,
  Clock,
  Hash,
  Download,
  AlertOctagon,
  CheckCircle2,
  Activity,
  Database,
  Network,
  Lock,
  Cpu,
  Terminal,
  HardDrive,
  Search,
  ExternalLink,
} from "lucide-react";

/* ── Case Summary ── */
const CASE_INFO = {
  caseId: "DFIR-2025-0042",
  analyst: "Agent Forensics",
  started: "2025-06-17 08:30:00 UTC",
  status: "IN PROGRESS",
  tcs: 0.75,
  framework: "NIST SP 800-86",
  totalArtifacts: 53535,
  alertsCritical: 2,
  alertsHigh: 2,
  alertsMedium: 2,
  timelineRange: "2025-06-16 22:00 — 2025-06-17 10:45 UTC",
};

/* ── Evidence Chain ── */
const EVIDENCE_CHAIN = [
  {
    id: "EVD-001",
    type: "Memory Dump",
    filename: "memory_20250617_0830.raw",
    hash: "a7f3b2c1d4e5f6...89ab",
    hashFull: "a7f3b2c1d4e5f6a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f189ab",
    size: "4.2 GB",
    collected: "08:31:42 UTC",
    status: "verified",
  },
  {
    id: "EVD-002",
    type: "Disk Image",
    filename: "disk_c_20250617.E01",
    hash: "b8c4d3e2f1a0b9...76cd",
    hashFull: "b8c4d3e2f1a0b9c8d7e6f5a4b3c2d1e0f9a8b7c6d5e4f3a2b1c0d9e8f7a6b576cd",
    size: "128 GB",
    collected: "08:35:18 UTC",
    status: "verified",
  },
  {
    id: "EVD-003",
    type: "PCAP Capture",
    filename: "network_capture.pcapng",
    hash: "c9d5e4f3a2b1c0...45ef",
    hashFull: "c9d5e4f3a2b1c0d9e8f7a6b5c4d3e2f1a0b9c8d7e6f5a4b3c2d1e0f9a8b745ef",
    size: "892 MB",
    collected: "08:30:05 UTC",
    status: "verified",
  },
  {
    id: "EVD-004",
    type: "Registry Hives",
    filename: "registry_export.zip",
    hash: "d0e6f5a4b3c2d1...23ab",
    hashFull: "d0e6f5a4b3c2d1e0f9a8b7c6d5e4f3a2b1c0d9e8f7a6b5c4d3e2f1a0b9c823ab",
    size: "245 MB",
    collected: "08:32:55 UTC",
    status: "verified",
  },
  {
    id: "EVD-005",
    type: "System Logs",
    filename: "eventlogs_export.evtx",
    hash: "e1f7a6b5c4d3e2...12cd",
    hashFull: "e1f7a6b5c4d3e2f1a0b9c8d7e6f5a4b3c2d1e0f9a8b7c6d5e4f3a2b1c0d912cd",
    size: "1.8 GB",
    collected: "08:34:10 UTC",
    status: "verified",
  },
];

/* ── MITRE ATT&CK Findings ── */
const MITRE_FINDINGS = [
  {
    tactic: "TA0006",
    name: "Credential Access",
    technique: "T1003.001 — LSASS Memory",
    indicator: "mimikatz_v2 detected in PID 4012",
    confidence: 0.94,
    severity: "CRITICAL",
  },
  {
    tactic: "TA0011",
    name: "Command & Control",
    technique: "T1071.001 — Web Protocols",
    indicator: "CobaltStrike beacon in PID 1102",
    confidence: 0.91,
    severity: "CRITICAL",
  },
  {
    tactic: "TA0008",
    name: "Lateral Movement",
    technique: "T1021.002 — SMB/Windows Admin Shares",
    indicator: "Outbound SMB to 10.0.0.45",
    confidence: 0.78,
    severity: "HIGH",
  },
  {
    tactic: "TA0040",
    name: "Impact",
    technique: "T1486 — Data Encrypted for Impact",
    indicator: "High entropy file: document.pdf.enc (H=7.82)",
    confidence: 0.85,
    severity: "HIGH",
  },
  {
    tactic: "TA0003",
    name: "Persistence",
    technique: "T1547.001 — Registry Run Keys",
    indicator: "New Run key in HKCU\\Software\\Microsoft\\Windows",
    confidence: 0.67,
    severity: "MEDIUM",
  },
  {
    tactic: "TA0002",
    name: "Execution",
    technique: "T1059.001 — PowerShell",
    indicator: "Base64 encoded argument in PowerShell log",
    confidence: 0.62,
    severity: "MEDIUM",
  },
];

/* ── Artifact Summary ── */
const ARTIFACT_SUMMARY = [
  { name: "System Logs", icon: Database, count: 12480 },
  { name: "Browser History", icon: Search, count: 3241 },
  { name: "Registry Hives", icon: Lock, count: 847 },
  { name: "RAM Dumps", icon: Cpu, count: 1 },
  { name: "Network PCAP", icon: Network, count: 24581 },
  { name: "File Metadata", icon: HardDrive, count: 9812 },
  { name: "Process Traces", icon: Activity, count: 2103 },
  { name: "Shell Logs", icon: Terminal, count: 456 },
  { name: "USB Registers", icon: Shield, count: 14 },
];

function SeverityBadge({ severity }: { severity: string }) {
  const map: Record<string, string> = {
    CRITICAL: "bg-pink-500/10 text-pink-400",
    HIGH: "bg-orange-500/10 text-orange-400",
    MEDIUM: "bg-yellow-500/10 text-yellow-400",
    LOW: "bg-emerald-500/10 text-emerald-400",
  };
  return (
    <span
      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[9px] font-mono font-bold tracking-wider ${map[severity] ?? ""}`}
    >
      {severity === "CRITICAL" && <AlertOctagon size={9} />}
      {severity}
    </span>
  );
}

export default function ReportsPage() {
  return (
    <div className="p-6 lg:p-8 space-y-6 overflow-y-auto">
      {/* ── Page Header ── */}
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 animate-fade-in-up">
        <div>
          <h1 className="text-2xl font-bold font-[var(--font-space-grotesk)] text-white">
            Forensic Report
          </h1>
          <p className="text-white/50 text-sm mt-1">
            NIST SP 800-86 compliant · Chain-of-custody verified · Court-admissible
          </p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-mono font-bold hover:bg-cyan-500/20 transition-all card-interactive">
          <Download size={14} />
          Export PDF Report
        </button>
      </div>

      {/* ── Case Summary Cards ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 animate-fade-in-up delay-100">
        {[
          {
            label: "Case ID",
            value: CASE_INFO.caseId,
            icon: FileText,
            color: "text-cyan-400",
            bg: "bg-cyan-500/10",
          },
          {
            label: "Threat Score",
            value: CASE_INFO.tcs.toFixed(2),
            icon: Shield,
            color: "text-pink-400",
            bg: "bg-pink-500/10",
            sub: "HIGH RISK",
          },
          {
            label: "Evidence Artifacts",
            value: CASE_INFO.totalArtifacts.toLocaleString(),
            icon: Database,
            color: "text-purple-400",
            bg: "bg-purple-500/10",
          },
          {
            label: "Investigation Window",
            value: "12h 45m",
            icon: Clock,
            color: "text-emerald-400",
            bg: "bg-emerald-500/10",
          },
        ].map((card, i) => (
          <div
            key={i}
            className="bg-neutral-900/50 border border-white/5 rounded-xl p-4 card-interactive"
          >
            <div className="flex items-center justify-between mb-2">
              <p className="text-white/40 text-[10px] font-mono uppercase tracking-wider">
                {card.label}
              </p>
              <div
                className={`h-7 w-7 rounded-lg flex items-center justify-center ${card.bg} ${card.color}`}
              >
                <card.icon size={14} />
              </div>
            </div>
            <p className="text-lg font-bold font-[var(--font-space-mono)]">
              {card.value}
            </p>
            {card.sub && (
              <p className="text-[9px] font-mono text-pink-400 mt-0.5">
                {card.sub}
              </p>
            )}
          </div>
        ))}
      </div>

      {/* ── Case Details ── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Case Info Table */}
        <div className="lg:col-span-5 bg-neutral-900/50 border border-white/5 rounded-xl p-6 space-y-4 animate-fade-in-up delay-200">
          <h2 className="text-base font-bold mb-1">Case Details</h2>
          <div className="space-y-3 text-sm">
            {[
              { label: "Case ID", value: CASE_INFO.caseId },
              { label: "Lead Analyst", value: CASE_INFO.analyst },
              { label: "Investigation Started", value: CASE_INFO.started },
              { label: "Status", value: CASE_INFO.status, badge: true },
              { label: "Framework", value: CASE_INFO.framework },
              { label: "Timeline Range", value: CASE_INFO.timelineRange },
            ].map((row, i) => (
              <div
                key={i}
                className="flex items-center justify-between py-2 border-b border-white/5 last:border-0"
              >
                <span className="text-white/40 text-xs font-mono">
                  {row.label}
                </span>
                {row.badge ? (
                  <span className="px-2 py-0.5 rounded text-[9px] font-mono font-bold bg-yellow-500/10 text-yellow-400">
                    {row.value}
                  </span>
                ) : (
                  <span className="text-white/80 text-xs font-mono">
                    {row.value}
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Artifact Count Summary */}
        <div className="lg:col-span-7 bg-neutral-900/50 border border-white/5 rounded-xl p-6 animate-fade-in-up delay-300">
          <h2 className="text-base font-bold mb-1">
            Artifact Collection Summary
          </h2>
          <p className="text-[10px] text-white/40 font-mono mb-4">
            9 categories · {CASE_INFO.totalArtifacts.toLocaleString()} total
            records parsed
          </p>

          <div className="grid grid-cols-3 gap-2">
            {ARTIFACT_SUMMARY.map((art, i) => (
              <div
                key={i}
                className="p-3 rounded-lg bg-black/30 border border-white/5 card-interactive"
              >
                <div className="flex items-center gap-2 mb-1.5">
                  <art.icon size={12} className="text-cyan-400/60" />
                  <span className="text-[10px] font-mono text-white/50 truncate">
                    {art.name}
                  </span>
                </div>
                <span className="text-sm font-bold font-[var(--font-space-mono)] text-white/80">
                  {art.count.toLocaleString()}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Evidence Chain of Custody ── */}
      <div className="bg-neutral-900/50 border border-white/5 rounded-xl overflow-hidden animate-fade-in-up delay-400">
        <div className="px-6 py-4 border-b border-white/5 flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold">Chain of Custody</h2>
            <p className="text-[10px] text-white/40 font-mono mt-0.5">
              SHA-256 cryptographic verification for all evidence items
            </p>
          </div>
          <div className="flex items-center gap-1.5 text-emerald-400 text-[10px] font-mono">
            <CheckCircle2 size={12} />
            ALL VERIFIED
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-black/40 text-white/40 text-[10px] font-mono uppercase tracking-wider">
              <tr>
                <th className="px-6 py-3 font-medium">ID</th>
                <th className="px-6 py-3 font-medium">Type</th>
                <th className="px-6 py-3 font-medium">Filename</th>
                <th className="px-6 py-3 font-medium">SHA-256</th>
                <th className="px-6 py-3 font-medium">Size</th>
                <th className="px-6 py-3 font-medium">Collected</th>
                <th className="px-6 py-3 font-medium">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 text-white/70">
              {EVIDENCE_CHAIN.map((evd, i) => (
                <tr
                  key={i}
                  className="hover:bg-white/[0.02] transition-colors group"
                >
                  <td className="px-6 py-3 font-mono text-xs text-cyan-400/80">
                    {evd.id}
                  </td>
                  <td className="px-6 py-3 text-xs">{evd.type}</td>
                  <td className="px-6 py-3 font-mono text-xs text-white/80 group-hover:text-cyan-400 transition-colors">
                    {evd.filename}
                  </td>
                  <td className="px-6 py-3">
                    <span className="font-mono text-[11px] text-white/40 flex items-center gap-1">
                      <Hash size={10} />
                      {evd.hash}
                    </span>
                  </td>
                  <td className="px-6 py-3 text-xs font-mono">{evd.size}</td>
                  <td className="px-6 py-3 text-xs text-white/40">
                    {evd.collected}
                  </td>
                  <td className="px-6 py-3">
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[9px] font-mono font-bold bg-emerald-500/10 text-emerald-400">
                      <CheckCircle2 size={9} />
                      VERIFIED
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── MITRE ATT&CK Tactic Findings ── */}
      <div className="bg-neutral-900/50 border border-white/5 rounded-xl overflow-hidden animate-fade-in-up delay-500">
        <div className="px-6 py-4 border-b border-white/5 flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold">
              MITRE ATT&CK Tactic Findings
            </h2>
            <p className="text-[10px] text-white/40 font-mono mt-0.5">
              {MITRE_FINDINGS.length} tactics identified · Sorted by confidence
            </p>
          </div>
          <a
            href="https://attack.mitre.org/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 text-[10px] font-mono text-cyan-400/60 hover:text-cyan-400 transition-colors"
          >
            ATT&CK Framework
            <ExternalLink size={10} />
          </a>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-black/40 text-white/40 text-[10px] font-mono uppercase tracking-wider">
              <tr>
                <th className="px-6 py-3 font-medium">Severity</th>
                <th className="px-6 py-3 font-medium">Tactic</th>
                <th className="px-6 py-3 font-medium">Technique</th>
                <th className="px-6 py-3 font-medium">Indicator</th>
                <th className="px-6 py-3 font-medium">Confidence</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 text-white/70">
              {MITRE_FINDINGS.map((finding, i) => (
                <tr
                  key={i}
                  className="hover:bg-white/[0.02] transition-colors group"
                >
                  <td className="px-6 py-3">
                    <SeverityBadge severity={finding.severity} />
                  </td>
                  <td className="px-6 py-3">
                    <div>
                      <span className="text-xs font-mono text-cyan-400/80">
                        {finding.tactic}
                      </span>
                      <span className="text-xs text-white/60 ml-2">
                        {finding.name}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-3 text-xs font-mono text-white/50">
                    {finding.technique}
                  </td>
                  <td className="px-6 py-3 text-xs font-mono text-white/80 group-hover:text-cyan-400 transition-colors">
                    {finding.indicator}
                  </td>
                  <td className="px-6 py-3">
                    <div className="flex items-center gap-2">
                      <div className="w-16 h-1 bg-neutral-800 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full ${
                            finding.confidence > 0.8
                              ? "bg-pink-500"
                              : finding.confidence > 0.6
                              ? "bg-orange-400"
                              : "bg-yellow-400"
                          }`}
                          style={{
                            width: `${finding.confidence * 100}%`,
                          }}
                        />
                      </div>
                      <span className="text-[10px] font-mono text-white/50">
                        {(finding.confidence * 100).toFixed(0)}%
                      </span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── Report Footer ── */}
      <div className="bg-neutral-900/50 border border-white/5 rounded-xl p-6 animate-fade-in-up delay-600">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="space-y-1">
            <p className="text-[10px] font-mono text-white/30 uppercase tracking-widest">
              Report Compliance
            </p>
            <p className="text-xs text-white/60">
              This report follows{" "}
              <span className="text-cyan-400 font-medium">
                NIST Special Publication 800-86
              </span>{" "}
              — Guide to Integrating Forensic Techniques into Incident Response.
            </p>
            <p className="text-[10px] font-mono text-white/20 mt-2">
              Generated: 2025-06-17 10:45:00 UTC · AI-DFIR Platform v0.2.0
            </p>
          </div>
          <div className="flex gap-2">
            <button className="px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-white/60 text-xs font-mono hover:bg-white/10 transition-colors">
              Export JSON
            </button>
            <button className="px-4 py-2 rounded-lg bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-mono font-bold hover:bg-cyan-500/20 transition-colors flex items-center gap-2">
              <Download size={12} />
              Download PDF
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}