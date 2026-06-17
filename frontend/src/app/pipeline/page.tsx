"use client";

import { useState } from "react";
import {
  Database,
  Search,
  Lock,
  Cpu,
  Network,
  HardDrive,
  Activity,
  Terminal,
  Shield,
  Server,
  CheckCircle2,
  Upload,
  Zap,
  BarChart3,
  RefreshCw,
} from "lucide-react";

/* ── ELK Stack Status ── */
const ELK_SERVICES = [
  {
    name: "Elasticsearch",
    status: "connected",
    version: "8.15.0",
    info: "Single-node · 2GB heap · localhost:9200",
    icon: Database,
  },
  {
    name: "Kibana",
    status: "connected",
    version: "8.15.0",
    info: "Dashboard UI · localhost:5601",
    icon: BarChart3,
  },
  {
    name: "FastAPI Backend",
    status: "connected",
    version: "0.2.0",
    info: "Async Python · localhost:8000",
    icon: Server,
  },
];

/* ── 9 Artifact Index Status ── */
const INDEX_STATUS = [
  {
    name: "System Logs",
    index: "dfir-system-logs",
    icon: Database,
    docs: 12480,
    size: "48.2 MB",
    lastIngested: "2 mins ago",
    status: "active",
    color: "cyan",
  },
  {
    name: "Browser History",
    index: "dfir-browser-history",
    icon: Search,
    docs: 3241,
    size: "12.8 MB",
    lastIngested: "15 mins ago",
    status: "idle",
    color: "emerald",
  },
  {
    name: "Registry Hives",
    index: "dfir-registry-hives",
    icon: Lock,
    docs: 847,
    size: "5.1 MB",
    lastIngested: "32 mins ago",
    status: "idle",
    color: "pink",
  },
  {
    name: "Memory Dumps",
    index: "dfir-memory-dumps",
    icon: Cpu,
    docs: 1,
    size: "2.1 MB",
    lastIngested: "1 hour ago",
    status: "idle",
    color: "cyan",
  },
  {
    name: "Network PCAP",
    index: "dfir-network-pcap",
    icon: Network,
    docs: 24581,
    size: "156.4 MB",
    lastIngested: "Just now",
    status: "ingesting",
    color: "emerald",
  },
  {
    name: "File Metadata",
    index: "dfir-file-metadata",
    icon: HardDrive,
    docs: 9812,
    size: "34.6 MB",
    lastIngested: "8 mins ago",
    status: "idle",
    color: "pink",
  },
  {
    name: "Process Traces",
    index: "dfir-process-traces",
    icon: Activity,
    docs: 2103,
    size: "8.9 MB",
    lastIngested: "22 mins ago",
    status: "idle",
    color: "cyan",
  },
  {
    name: "Shell Logs",
    index: "dfir-shell-logs",
    icon: Terminal,
    docs: 456,
    size: "1.2 MB",
    lastIngested: "45 mins ago",
    status: "idle",
    color: "emerald",
  },
  {
    name: "USB Devices",
    index: "dfir-usb-devices",
    icon: Shield,
    docs: 14,
    size: "0.04 MB",
    lastIngested: "1 hour ago",
    status: "idle",
    color: "pink",
  },
];

const colorMap: Record<string, { text: string; bg: string; border: string }> = {
  cyan: { text: "text-cyan-400", bg: "bg-cyan-500/10", border: "border-cyan-500/15" },
  emerald: { text: "text-emerald-400", bg: "bg-emerald-500/10", border: "border-emerald-500/15" },
  pink: { text: "text-pink-400", bg: "bg-pink-500/10", border: "border-pink-500/15" },
};

/* ── Ingestion Log Lines ── */
const INGEST_LOGS = [
  { time: "10:44:52", text: "[Filebeat] Shipping 1,024 events from sysmon.evtx", type: "info" },
  { time: "10:44:53", text: "[Logstash] Pipeline output: 1,024 docs → dfir-system-logs", type: "info" },
  { time: "10:44:55", text: "[ES] Bulk index: 1,024 documents in 142ms", type: "system" },
  { time: "10:44:58", text: "[Parser] PCAP ingestion: 2,400 packets decoded (TCP: 1,892 / UDP: 508)", type: "info" },
  { time: "10:45:01", text: "[ES] Index refresh: dfir-network-pcap (24,581 total docs)", type: "system" },
  { time: "10:45:03", text: "[Schema] All 9 indices healthy — 0 mapping conflicts", type: "system" },
];

function StatusDot({ status }: { status: string }) {
  if (status === "connected" || status === "active")
    return (
      <span className="relative flex h-2.5 w-2.5">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
        <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500" />
      </span>
    );
  if (status === "ingesting")
    return (
      <span className="relative flex h-2.5 w-2.5">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75" />
        <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-cyan-500" />
      </span>
    );
  if (status === "error")
    return <span className="inline-flex rounded-full h-2.5 w-2.5 bg-pink-500" />;
  return <span className="inline-flex rounded-full h-2.5 w-2.5 bg-white/20" />;
}

export default function PipelinePage() {
  const [dragActive, setDragActive] = useState(false);

  const totalDocs = INDEX_STATUS.reduce((acc, idx) => acc + idx.docs, 0);

  return (
    <div className="p-6 lg:p-8 space-y-6 overflow-y-auto">
      {/* ── Page Header ── */}
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 animate-fade-in-up">
        <div>
          <h1 className="text-2xl font-bold font-[var(--font-space-grotesk)] text-white">
            Data Ingestion Pipeline
          </h1>
          <p className="text-white/50 text-sm mt-1">
            ELK Stack · 9 Elasticsearch indices · Automated forensic log
            ingestion
          </p>
        </div>
        <div className="flex gap-2 text-[10px] font-mono">
          <span className="px-3 py-1.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center gap-1.5">
            <CheckCircle2 size={10} />
            PIPELINE HEALTHY
          </span>
          <span className="px-3 py-1.5 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
            {totalDocs.toLocaleString()} TOTAL DOCS
          </span>
        </div>
      </div>

      {/* ── ELK Stack Status ── */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 animate-fade-in-up delay-100">
        {ELK_SERVICES.map((svc, i) => (
          <div
            key={i}
            className="bg-neutral-900/50 border border-white/5 rounded-xl p-4 card-interactive"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <StatusDot status={svc.status} />
                <span className="text-sm font-bold text-white/90">
                  {svc.name}
                </span>
              </div>
              <svc.icon size={16} className="text-white/20" />
            </div>
            <div className="space-y-1">
              <div className="flex items-center justify-between text-[10px] font-mono">
                <span className="text-white/40">Version</span>
                <span className="text-cyan-400">{svc.version}</span>
              </div>
              <div className="flex items-center justify-between text-[10px] font-mono">
                <span className="text-white/40">Status</span>
                <span className="text-emerald-400 uppercase font-bold">
                  {svc.status}
                </span>
              </div>
            </div>
            <p className="text-[9px] font-mono text-white/20 mt-2">
              {svc.info}
            </p>
          </div>
        ))}
      </div>

      {/* ── 9 Index Cards ── */}
      <div className="animate-fade-in-up delay-200">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-base font-bold">Elasticsearch Indices</h2>
            <p className="text-[10px] text-white/40 font-mono mt-0.5">
              9 artifact category indices · Real-time document counts
            </p>
          </div>
          <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-white/50 text-[10px] font-mono hover:bg-white/10 transition-colors">
            <RefreshCw size={10} />
            Refresh
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {INDEX_STATUS.map((idx, i) => {
            const colors = colorMap[idx.color];
            return (
              <div
                key={i}
                className={`rounded-xl p-4 bg-neutral-900/50 border ${colors.border} card-interactive`}
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2.5">
                    <div
                      className={`w-8 h-8 rounded-lg flex items-center justify-center ${colors.bg}`}
                    >
                      <idx.icon size={14} className={colors.text} />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-white/85">
                        {idx.name}
                      </p>
                      <p className="text-[9px] font-mono text-white/25">
                        {idx.index}
                      </p>
                    </div>
                  </div>
                  <StatusDot status={idx.status} />
                </div>

                <div className="grid grid-cols-3 gap-2 text-center">
                  <div>
                    <p className="text-xs font-bold font-[var(--font-space-mono)] text-white/80">
                      {idx.docs.toLocaleString()}
                    </p>
                    <p className="text-[8px] font-mono text-white/30 uppercase">
                      Docs
                    </p>
                  </div>
                  <div>
                    <p className="text-xs font-bold font-[var(--font-space-mono)] text-white/80">
                      {idx.size}
                    </p>
                    <p className="text-[8px] font-mono text-white/30 uppercase">
                      Size
                    </p>
                  </div>
                  <div>
                    <p className="text-[10px] font-mono text-white/50">
                      {idx.lastIngested}
                    </p>
                    <p className="text-[8px] font-mono text-white/30 uppercase">
                      Last
                    </p>
                  </div>
                </div>

                {idx.status === "ingesting" && (
                  <div className="mt-3 w-full h-1 bg-neutral-800 rounded-full overflow-hidden">
                    <div className="h-full w-2/3 bg-cyan-500 rounded-full animate-shimmer" />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* ── Upload Zone + Ingestion Log ── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 animate-fade-in-up delay-300">
        {/* File Upload */}
        <div className="lg:col-span-5">
          <h2 className="text-base font-bold mb-1">Manual Ingestion</h2>
          <p className="text-[10px] text-white/40 font-mono mb-4">
            Drag-and-drop forensic evidence files for parsing
          </p>

          <div
            className={`border-2 border-dashed rounded-xl p-8 text-center transition-all ${
              dragActive
                ? "border-cyan-400/50 bg-cyan-500/5"
                : "border-white/10 hover:border-white/20 bg-neutral-900/30"
            }`}
            onDragEnter={() => setDragActive(true)}
            onDragLeave={() => setDragActive(false)}
            onDragOver={(e) => e.preventDefault()}
            onDrop={() => setDragActive(false)}
          >
            <Upload
              size={32}
              className={`mx-auto mb-3 ${
                dragActive ? "text-cyan-400" : "text-white/20"
              }`}
            />
            <p className="text-sm text-white/50 mb-1">
              Drop files here or{" "}
              <span className="text-cyan-400 cursor-pointer hover:underline">
                browse
              </span>
            </p>
            <p className="text-[10px] font-mono text-white/25">
              Supported: .evtx · .log · .sqlite · .pcap · .raw
            </p>
          </div>

          {/* Quick actions */}
          <div className="mt-4 grid grid-cols-2 gap-2">
            <button className="p-3 rounded-lg bg-neutral-900/50 border border-white/5 text-xs font-mono text-white/50 hover:bg-white/5 hover:text-white transition-all flex items-center gap-2 justify-center">
              <Zap size={12} className="text-cyan-400" />
              Run All Parsers
            </button>
            <button className="p-3 rounded-lg bg-neutral-900/50 border border-white/5 text-xs font-mono text-white/50 hover:bg-white/5 hover:text-white transition-all flex items-center gap-2 justify-center">
              <RefreshCw size={12} className="text-emerald-400" />
              Reindex All
            </button>
          </div>
        </div>

        {/* Ingestion Log */}
        <div className="lg:col-span-7 bg-black border border-white/10 rounded-xl flex flex-col overflow-hidden relative terminal-scanline">
          <div className="px-4 py-3 border-b border-white/5 bg-neutral-950 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-2">
              <div className="flex gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-pink-500/80" />
                <span className="w-2.5 h-2.5 rounded-full bg-yellow-500/80" />
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80" />
              </div>
              <Terminal size={14} className="text-white/40 ml-2" />
              <h3 className="text-[10px] font-mono text-white/60 uppercase tracking-widest">
                Ingestion Pipeline Log
              </h3>
            </div>
            <span className="text-[9px] font-mono text-white/20">
              LIVE FEED
            </span>
          </div>
          <div className="p-4 font-mono text-[11px] flex-1 space-y-1.5 overflow-y-auto leading-relaxed max-h-[280px]">
            {INGEST_LOGS.map((line, i) => {
              let colorClass = "text-white/45";
              if (line.type === "info") colorClass = "text-cyan-400";
              else if (line.type === "system") colorClass = "text-emerald-400";
              return (
                <p key={i} className={colorClass}>
                  <span className="text-white/20 mr-2">[{line.time}]</span>
                  {line.text}
                </p>
              );
            })}
            <p className="text-white/20 animate-terminal-blink">▌</p>
          </div>
        </div>
      </div>
    </div>
  );
}
