"use client";

import { useState, useEffect, useCallback } from "react";
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
  ChevronDown,
  ChevronUp,
  Loader2,
} from "lucide-react";
import {
  getCategories,
  listArtifacts,
  type CategoryStat,
  type SearchHit,
} from "@/lib/api";

/* ── Static descriptions for each category ── */
const CATEGORY_INFO: Record<
  string,
  { desc: string; targets: string; icon: React.ElementType; color: string }
> = {
  "system-logs": {
    desc: "Parses Windows Event Logs (.evtx), Linux syslog and auth logs using Python log normalizers and Elasticsearch ingestion pipelines.",
    targets:
      "Brute-force login signatures, privilege escalations, scheduled task creation, process spawning patterns.",
    icon: Database,
    color: "cyan",
  },
  "browser-history": {
    desc: "Extracts local browser profiles (Chrome, Firefox, Edge, Safari) using direct SQLite database decoders.",
    targets:
      "Attacker reconnaissance history, phishing access vectors, cache structures, cached credential tables.",
    icon: Search,
    color: "emerald",
  },
  "registry-hives": {
    desc: "Decrypts NTUSER.DAT, SYSTEM, SOFTWARE, SAM hives using Python python-registry modules.",
    targets:
      "Persistence registries (Run/RunOnce keys), USB connection traces, shellbags, UserAssist timestamps.",
    icon: Lock,
    color: "pink",
  },
  "memory-dumps": {
    desc: "Automates Volatility 3 command plugin analysis to parse raw physical RAM dumps, recovering transient and fileless malware traces.",
    targets:
      "Active process listings (pslist/pstree), network sockets (netscan), injected DLL modules (malfind).",
    icon: Cpu,
    color: "cyan",
  },
  "network-pcap": {
    desc: "Inspects live packet structures or raw PCAPs utilizing Wireshark/tshark pipelines and Python Scapy decoders.",
    targets:
      "Command & Control beacon timing anomalies, DNS tunneling channels, large outbound exfiltrations.",
    icon: Network,
    color: "emerald",
  },
  "file-metadata": {
    desc: "Performs file system integrity and MACB metadata scans using Autopsy pipelines and disk writing blockers.",
    targets:
      "Timestomping identification, files in %TEMP%/AppData, high-entropy packed directory segments.",
    icon: HardDrive,
    color: "pink",
  },
  "process-traces": {
    desc: "Decodes Windows Prefetch (.pf) files, AppCompatCache (Shimcache), Amcache registries, and Linux audit logs.",
    targets:
      "Historical process executions, execution path mismatches, programs run prior to automated deletion.",
    icon: Activity,
    color: "cyan",
  },
  "shell-logs": {
    desc: "Parses historical PowerShell scripts, transcript logs, and Linux bash/zsh shell histories.",
    targets:
      "Base64 encoded arguments, download cradles (IEX/Invoke-WebRequest), LOLBAS executions, mimikatz commands.",
    icon: Terminal,
    color: "emerald",
  },
  "usb-devices": {
    desc: "Queries system setupapi logs, udev properties, and Windows USBSTOR registry structures.",
    targets:
      "Removable drives, mounting serial numbers, timestamps, correlated file modifications.",
    icon: Shield,
    color: "pink",
  },
};

const colorMap: Record<string, { text: string; bg: string; border: string }> = {
  cyan: {
    text: "text-cyan-400",
    bg: "bg-cyan-500/10",
    border: "border-cyan-500/15",
  },
  emerald: {
    text: "text-emerald-400",
    bg: "bg-emerald-500/10",
    border: "border-emerald-500/15",
  },
  pink: {
    text: "text-pink-400",
    bg: "bg-pink-500/10",
    border: "border-pink-500/15",
  },
};

/* ── Expandable Artifact Card ── */
function ArtifactCard({
  category,
  stat,
}: {
  category: string;
  stat: CategoryStat | undefined;
}) {
  const [expanded, setExpanded] = useState(false);
  const [artifacts, setArtifacts] = useState<SearchHit[]>([]);
  const [loadingArtifacts, setLoadingArtifacts] = useState(false);

  const info = CATEGORY_INFO[category];
  if (!info) return null;

  const colors = colorMap[info.color];
  const docsCount = stat?.docs_count ?? 0;

  const loadArtifacts = async () => {
    if (artifacts.length > 0) {
      setExpanded(!expanded);
      return;
    }
    setExpanded(true);
    setLoadingArtifacts(true);
    const result = await listArtifacts(category, 10);
    setArtifacts(result.hits);
    setLoadingArtifacts(false);
  };

  // Format a display name
  const displayName = category
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");

  return (
    <div
      className={`rounded-xl bg-neutral-900/50 border ${colors.border} hover:bg-neutral-900/70 transition-all`}
    >
      <div className="p-6 space-y-4">
        <div className="flex items-start justify-between">
          <div
            className={`w-10 h-10 rounded-xl flex items-center justify-center ${colors.bg}`}
          >
            <info.icon size={18} className={colors.text} />
          </div>
          {docsCount > 0 && (
            <span className="text-[10px] font-mono font-bold text-white/40 px-2 py-0.5 rounded bg-white/5">
              {docsCount.toLocaleString()} docs
            </span>
          )}
        </div>
        <div className="space-y-1">
          <h3 className="text-base font-bold text-white/90">{displayName}</h3>
          <p className="text-xs text-white/50 leading-relaxed font-light">
            {info.desc}
          </p>
        </div>
        <div className="pt-3 border-t border-white/5 space-y-1">
          <span className="text-[10px] font-mono uppercase tracking-widest text-white/30 block">
            FORENSIC TARGETS
          </span>
          <p className={`text-xs leading-normal font-mono ${colors.text}`}>
            {info.targets}
          </p>
        </div>

        {/* Expand button to view indexed data */}
        {docsCount > 0 && (
          <button
            onClick={loadArtifacts}
            className="w-full flex items-center justify-center gap-1.5 py-2 rounded-lg bg-white/[0.03] border border-white/5 text-[10px] font-mono text-white/40 hover:text-white/70 hover:bg-white/[0.06] transition-all"
          >
            {expanded ? (
              <>
                <ChevronUp size={12} /> Hide Indexed Data
              </>
            ) : (
              <>
                <ChevronDown size={12} /> View Indexed Data ({docsCount.toLocaleString()})
              </>
            )}
          </button>
        )}
      </div>

      {/* Expanded artifact viewer */}
      {expanded && (
        <div className="border-t border-white/5 px-4 py-3 max-h-64 overflow-y-auto">
          {loadingArtifacts ? (
            <div className="flex items-center justify-center py-4">
              <Loader2
                size={16}
                className="text-cyan-400 animate-spin mr-2"
              />
              <span className="text-xs text-white/40 font-mono">
                Loading...
              </span>
            </div>
          ) : artifacts.length > 0 ? (
            <div className="space-y-2">
              {artifacts.map((hit, i) => {
                // Show a compact preview of the document
                const preview = Object.entries(hit)
                  .filter(
                    ([k]) => !k.startsWith("_") && k !== "raw_xml"
                  )
                  .slice(0, 5);
                return (
                  <div
                    key={hit._id || i}
                    className="p-2.5 rounded-lg bg-black/30 border border-white/5 text-[10px] font-mono space-y-1"
                  >
                    {preview.map(([key, val]) => (
                      <div key={key} className="flex gap-2">
                        <span className="text-white/30 shrink-0">{key}:</span>
                        <span className="text-white/60 truncate">
                          {typeof val === "object"
                            ? JSON.stringify(val)
                            : String(val)}
                        </span>
                      </div>
                    ))}
                  </div>
                );
              })}
              {docsCount > 10 && (
                <p className="text-[9px] font-mono text-white/20 text-center py-1">
                  Showing 10 of {docsCount.toLocaleString()} documents
                </p>
              )}
            </div>
          ) : (
            <p className="text-xs text-white/30 text-center py-4 font-mono">
              No documents indexed yet
            </p>
          )}
        </div>
      )}
    </div>
  );
}

/* ── Main Evidence Page ── */
export default function EvidencePage() {
  const [categories, setCategories] = useState<CategoryStat[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchCategories = useCallback(async () => {
    const cats = await getCategories();
    setCategories(cats);
    setLoading(false);
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchCategories();
  }, [fetchCategories]);

  // Build a lookup map
  const statMap = new Map(categories.map((c) => [c.category, c]));

  // All 9 categories in order
  const allCategories = [
    "system-logs",
    "browser-history",
    "registry-hives",
    "memory-dumps",
    "network-pcap",
    "file-metadata",
    "process-traces",
    "shell-logs",
    "usb-devices",
  ];

  const totalDocs = categories.reduce((sum, c) => sum + c.docs_count, 0);

  return (
    <div className="p-8 space-y-8">
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold font-[var(--font-space-grotesk)] text-white">
            Evidence Browser
          </h1>
          <p className="text-white/50 text-sm mt-1">
            9 forensic artifact categories collected and parsed by the framework
          </p>
        </div>
        {totalDocs > 0 && (
          <span className="px-3 py-1.5 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 text-[10px] font-mono">
            {totalDocs.toLocaleString()} TOTAL INDEXED
          </span>
        )}
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 size={24} className="text-cyan-400 animate-spin mr-3" />
          <span className="text-white/40 text-sm font-mono">Loading categories...</span>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {allCategories.map((cat) => (
            <ArtifactCard
              key={cat}
              category={cat}
              stat={statMap.get(cat)}
            />
          ))}
        </div>
      )}
    </div>
  );
}