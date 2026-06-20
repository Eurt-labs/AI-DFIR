"use client";

import { useState, useEffect, useCallback, useRef } from "react";
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
  BarChart3,
  RefreshCw,
  AlertCircle,
  Loader2,
  XCircle,
  FileUp,
} from "lucide-react";
import {
  getPipelineStatus,
  getHealth,
  uploadFile,
  type PipelineStatus,
  type HealthResponse,
  type IngestResult,
} from "@/lib/api";

/* ── Icon map for categories ── */
const CATEGORY_ICONS: Record<string, React.ElementType> = {
  "system-logs": Database,
  "browser-history": Search,
  "registry-hives": Lock,
  "memory-dumps": Cpu,
  "network-pcap": Network,
  "file-metadata": HardDrive,
  "process-traces": Activity,
  "shell-logs": Terminal,
  "usb-devices": Shield,
};

const CATEGORY_COLORS: Record<string, string> = {
  "system-logs": "cyan",
  "browser-history": "emerald",
  "registry-hives": "pink",
  "memory-dumps": "cyan",
  "network-pcap": "emerald",
  "file-metadata": "pink",
  "process-traces": "cyan",
  "shell-logs": "emerald",
  "usb-devices": "pink",
};

const colorMap: Record<string, { text: string; bg: string; border: string }> = {
  cyan: { text: "text-cyan-400", bg: "bg-cyan-500/10", border: "border-cyan-500/15" },
  emerald: { text: "text-emerald-400", bg: "bg-emerald-500/10", border: "border-emerald-500/15" },
  pink: { text: "text-pink-400", bg: "bg-pink-500/10", border: "border-pink-500/15" },
};

/* ── Status Dot Component ── */
function StatusDot({ status }: { status: string }) {
  if (status === "connected" || status === "active" || status === "healthy")
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
  if (status === "error" || status === "disconnected")
    return <span className="inline-flex rounded-full h-2.5 w-2.5 bg-pink-500" />;
  return <span className="inline-flex rounded-full h-2.5 w-2.5 bg-white/20" />;
}

/* ── Ingestion Result Toast ── */
function IngestResultBanner({ result, onClose }: { result: IngestResult; onClose: () => void }) {
  const isError = result.status === "error";
  const isWarning = result.status === "warning" || result.status === "partial";

  return (
    <div
      className={`rounded-xl border p-4 flex items-start gap-3 animate-fade-in-up ${
        isError
          ? "bg-pink-500/5 border-pink-500/20"
          : isWarning
          ? "bg-yellow-500/5 border-yellow-500/20"
          : "bg-emerald-500/5 border-emerald-500/20"
      }`}
    >
      {isError ? (
        <XCircle size={18} className="text-pink-400 shrink-0 mt-0.5" />
      ) : isWarning ? (
        <AlertCircle size={18} className="text-yellow-400 shrink-0 mt-0.5" />
      ) : (
        <CheckCircle2 size={18} className="text-emerald-400 shrink-0 mt-0.5" />
      )}
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-white/90">{result.filename}</p>
        <p className="text-xs text-white/50 font-mono mt-0.5">
          {result.message || `${result.documents_indexed} docs indexed in ${result.duration_ms}ms`}
        </p>
        {result.documents_parsed > 0 && (
          <div className="flex gap-4 mt-2 text-[10px] font-mono text-white/40">
            <span>
              Category:{" "}
              <span className="text-cyan-400">{result.category}</span>
            </span>
            <span>
              Parsed:{" "}
              <span className="text-white/70">{result.documents_parsed}</span>
            </span>
            <span>
              Indexed:{" "}
              <span className="text-emerald-400">{result.documents_indexed}</span>
            </span>
            {result.errors > 0 && (
              <span>
                Errors:{" "}
                <span className="text-pink-400">{result.errors}</span>
              </span>
            )}
          </div>
        )}
      </div>
      <button onClick={onClose} className="text-white/30 hover:text-white/60 transition-colors">
        <XCircle size={14} />
      </button>
    </div>
  );
}

/* ── Main Pipeline Page ── */
export default function PipelinePage() {
  const [pipelineStatus, setPipelineStatus] = useState<PipelineStatus | null>(null);
  const [health, setHealth] = useState<HealthResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [ingestResults, setIngestResults] = useState<IngestResult[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Fetch data on mount
  const fetchData = useCallback(async () => {
    const [pStatus, hStatus] = await Promise.all([
      getPipelineStatus(),
      getHealth(),
    ]);
    setPipelineStatus(pStatus);
    setHealth(hStatus);
    setLoading(false);
    setRefreshing(false);
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchData();
  }, [fetchData]);

  const handleRefresh = () => {
    setRefreshing(true);
    fetchData();
  };

  // File upload handler
  const handleFiles = async (files: FileList | File[]) => {
    setUploading(true);
    const results: IngestResult[] = [];

    for (const file of Array.from(files)) {
      const result = await uploadFile(file);
      results.push(result);
    }

    setIngestResults((prev) => [...results, ...prev]);
    setUploading(false);
    // Refresh stats after upload
    fetchData();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
    if (e.dataTransfer.files.length > 0) {
      handleFiles(e.dataTransfer.files);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFiles(e.target.files);
      e.target.value = ""; // reset so same file can be re-selected
    }
  };

  const esConnected = health?.services?.elasticsearch === "connected";
  const apiOnline = health?.status === "online";
  const totalDocs = pipelineStatus?.total_documents ?? 0;

  // Build service status cards from real data
  const elkServices = [
    {
      name: "Elasticsearch",
      status: esConnected ? "connected" : "disconnected",
      version: health?.elasticsearch_version ?? "—",
      info: esConnected
        ? `Cluster: ${health?.elasticsearch?.cluster_name ?? "unknown"} · Nodes: ${health?.elasticsearch?.number_of_nodes ?? "?"}`
        : "Not reachable",
      icon: Database,
    },
    {
      name: "Kibana",
      status: esConnected ? "connected" : "unknown",
      version: health?.elasticsearch_version ?? "—",
      info: "Dashboard UI · localhost:5601",
      icon: BarChart3,
    },
    {
      name: "FastAPI Backend",
      status: apiOnline ? "connected" : "disconnected",
      version: health?.version ?? "—",
      info: apiOnline ? "Async Python · localhost:8000" : "Not reachable",
      icon: Server,
    },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center space-y-3 animate-fade-in-up">
          <Loader2 size={28} className="text-cyan-400 animate-spin mx-auto" />
          <p className="text-white/40 text-sm font-mono">Loading pipeline status...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 lg:p-8 space-y-6 overflow-y-auto">
      {/* ── Page Header ── */}
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 animate-fade-in-up">
        <div>
          <h1 className="text-2xl font-bold font-[var(--font-space-grotesk)] text-white">
            Data Ingestion Pipeline
          </h1>
          <p className="text-white/50 text-sm mt-1">
            ELK Stack · 9 Elasticsearch indices · Automated forensic log ingestion
          </p>
        </div>
        <div className="flex gap-2 text-[10px] font-mono">
          <span
            className={`px-3 py-1.5 rounded-full flex items-center gap-1.5 border ${
              pipelineStatus?.pipeline_healthy
                ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                : "bg-pink-500/10 text-pink-400 border-pink-500/20"
            }`}
          >
            {pipelineStatus?.pipeline_healthy ? (
              <CheckCircle2 size={10} />
            ) : (
              <AlertCircle size={10} />
            )}
            {pipelineStatus?.pipeline_healthy ? "PIPELINE HEALTHY" : "PIPELINE OFFLINE"}
          </span>
          <span className="px-3 py-1.5 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
            {totalDocs.toLocaleString()} TOTAL DOCS
          </span>
        </div>
      </div>

      {/* ── ELK Stack Status (from real data) ── */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 animate-fade-in-up delay-100">
        {elkServices.map((svc, i) => (
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
                <span
                  className={`uppercase font-bold ${
                    svc.status === "connected"
                      ? "text-emerald-400"
                      : svc.status === "disconnected"
                      ? "text-pink-400"
                      : "text-white/30"
                  }`}
                >
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

      {/* ── 9 Index Cards (from real data) ── */}
      <div className="animate-fade-in-up delay-200">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-base font-bold">Elasticsearch Indices</h2>
            <p className="text-[10px] text-white/40 font-mono mt-0.5">
              {pipelineStatus?.total_indices ?? 0} artifact category indices · Real-time document counts
            </p>
          </div>
          <button
            onClick={handleRefresh}
            disabled={refreshing}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-white/50 text-[10px] font-mono hover:bg-white/10 transition-colors disabled:opacity-50"
          >
            <RefreshCw size={10} className={refreshing ? "animate-spin" : ""} />
            {refreshing ? "Refreshing..." : "Refresh"}
          </button>
        </div>

        {pipelineStatus && pipelineStatus.indices.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {pipelineStatus.indices.map((idx, i) => {
              const color = CATEGORY_COLORS[idx.category] ?? "cyan";
              const colors = colorMap[color];
              const Icon = CATEGORY_ICONS[idx.category] ?? Database;
              const displayName = idx.category
                .split("-")
                .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
                .join(" ");

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
                        <Icon size={14} className={colors.text} />
                      </div>
                      <div>
                        <p className="text-xs font-bold text-white/85">
                          {displayName}
                        </p>
                        <p className="text-[9px] font-mono text-white/25">
                          {idx.index}
                        </p>
                      </div>
                    </div>
                    <StatusDot
                      status={idx.docs_count > 0 ? "active" : "idle"}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-center">
                    <div>
                      <p className="text-xs font-bold font-[var(--font-space-mono)] text-white/80">
                        {idx.docs_count.toLocaleString()}
                      </p>
                      <p className="text-[8px] font-mono text-white/30 uppercase">
                        Docs
                      </p>
                    </div>
                    <div>
                      <p className="text-xs font-bold font-[var(--font-space-mono)] text-white/80">
                        {idx.size_human}
                      </p>
                      <p className="text-[8px] font-mono text-white/30 uppercase">
                        Size
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-12 bg-neutral-900/30 border border-white/5 rounded-xl">
            <Database size={28} className="mx-auto text-white/10 mb-3" />
            <p className="text-sm text-white/40">
              {esConnected
                ? "No indices found — upload forensic files to start indexing"
                : "Elasticsearch is not connected"}
            </p>
          </div>
        )}
      </div>

      {/* ── Upload Zone + Ingestion Results ── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 animate-fade-in-up delay-300">
        {/* File Upload */}
        <div className="lg:col-span-5">
          <h2 className="text-base font-bold mb-1">Manual Ingestion</h2>
          <p className="text-[10px] text-white/40 font-mono mb-4">
            Drag-and-drop forensic evidence files for parsing
          </p>

          <input
            ref={fileInputRef}
            type="file"
            className="hidden"
            accept=".evtx,.log,.syslog,.sqlite,.db"
            multiple
            onChange={handleFileSelect}
          />

          <div
            className={`border-2 border-dashed rounded-xl p-8 text-center transition-all cursor-pointer ${
              dragActive
                ? "border-cyan-400/50 bg-cyan-500/5"
                : "border-white/10 hover:border-white/20 bg-neutral-900/30"
            } ${uploading ? "pointer-events-none opacity-60" : ""}`}
            onDragEnter={() => setDragActive(true)}
            onDragLeave={() => setDragActive(false)}
            onDragOver={(e) => e.preventDefault()}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
          >
            {uploading ? (
              <>
                <Loader2
                  size={32}
                  className="mx-auto mb-3 text-cyan-400 animate-spin"
                />
                <p className="text-sm text-white/50">Processing file...</p>
              </>
            ) : (
              <>
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
                  Supported: .evtx · .log · .syslog · .sqlite · .db
                </p>
              </>
            )}
          </div>

          {!esConnected && (
            <div className="mt-3 p-3 rounded-lg bg-pink-500/5 border border-pink-500/15 flex items-center gap-2">
              <AlertCircle size={14} className="text-pink-400 shrink-0" />
              <p className="text-[10px] font-mono text-pink-400/80">
                Elasticsearch is disconnected — uploads will fail until the backend is running
              </p>
            </div>
          )}
        </div>

        {/* Ingestion Results */}
        <div className="lg:col-span-7 space-y-3">
          <div className="flex items-center justify-between mb-1">
            <h2 className="text-base font-bold">Ingestion Results</h2>
            {ingestResults.length > 0 && (
              <button
                onClick={() => setIngestResults([])}
                className="text-[10px] font-mono text-white/30 hover:text-white/60 transition-colors"
              >
                Clear all
              </button>
            )}
          </div>

          {ingestResults.length > 0 ? (
            <div className="space-y-2 max-h-[400px] overflow-y-auto">
              {ingestResults.map((result, i) => (
                <IngestResultBanner
                  key={`${result.filename}-${i}`}
                  result={result}
                  onClose={() =>
                    setIngestResults((prev) => prev.filter((_, idx) => idx !== i))
                  }
                />
              ))}
            </div>
          ) : (
            <div className="bg-neutral-900/30 border border-white/5 rounded-xl p-8 text-center">
              <FileUp size={28} className="mx-auto text-white/10 mb-3" />
              <p className="text-sm text-white/40">
                Upload a forensic file to see ingestion results
              </p>
              <p className="text-[10px] font-mono text-white/20 mt-1">
                Files are parsed, normalized, and indexed into Elasticsearch
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
