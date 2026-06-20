"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

import { getPipelineStatus, getHealth, type PipelineStatus, type HealthResponse } from "@/lib/api";

import {
  Activity,
  ShieldAlert,
  Cpu,
  Network,
  AlertOctagon,
  Terminal,
  FileSearch,
  Brain,
  Shield,
  Bug,
  Workflow,
  Database,
  Lock,
  HardDrive,
  Search,
} from "lucide-react";

/* ── Animated Counter Hook ── */
function useCounter(target: number, duration = 1200, decimals = 0) {
  const [value, setValue] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    let startTime: number;
    let animationFrame: number;

    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      // Ease out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      setValue(+(eased * target).toFixed(decimals));
      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate);
      }
    };

    animationFrame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrame);
  }, [target, duration, decimals]);

  return { value, ref };
}

/* ── Static Data ── */
const TCS_SCALE = [
  { range: "0.0 – 0.3", label: "LOW RISK", action: "LEGITIMATE", color: "text-emerald-400", bg: "bg-emerald-500/10" },
  { range: "0.3 – 0.6", label: "MEDIUM RISK", action: "TRIAGE REQUIRED", color: "text-yellow-400", bg: "bg-yellow-500/10" },
  { range: "0.6 – 0.8", label: "HIGH RISK", action: "SENIOR ESCALATE", color: "text-orange-400", bg: "bg-orange-500/10" },
  { range: "0.8 – 1.0", label: "CRITICAL", action: "INCIDENT RESPONSE", color: "text-pink-400", bg: "bg-pink-500/10" },
];

const ML_SCORES = [
  { name: "Bayesian Probability", score: 0.87, icon: Network, color: "text-cyan-400" },
  { name: "Gaussian Anomaly (GMM)", score: 0.82, icon: Activity, color: "text-pink-400" },
  { name: "Euclidean Distance", score: 0.64, icon: Shield, color: "text-purple-400" },
  { name: "Logistic Regression", score: 0.68, icon: Bug, color: "text-orange-400" },
  { name: "Shannon Entropy", score: 0.21, icon: FileSearch, color: "text-emerald-400" },
  { name: "Time-Series Decomp", score: 0.45, icon: Workflow, color: "text-cyan-400" },
];

const ARCHITECTURE_LAYERS = [
  { layer: "L5", name: "Forensic Analyst Portal", status: "ACTIVE", tools: "Flask Dashboard · Kibana Timelines", color: "text-pink-400", statusColor: "bg-pink-500/10 text-pink-400" },
  { layer: "L4", name: "AI Intelligence Engine", status: "ACTIVE", tools: "GMM · Bayesian · Shannon · Time-Series", color: "text-cyan-400", statusColor: "bg-cyan-500/10 text-cyan-400" },
  { layer: "L3", name: "Correlation & Threat Scoring", status: "ACTIVE", tools: "Bayesian TCS Module", color: "text-emerald-400", statusColor: "bg-emerald-500/10 text-emerald-400" },
  { layer: "L2", name: "Forensic Analysis Modules", status: "RUNNING", tools: "Volatility 3 · Autopsy · Scapy · YARA", color: "text-pink-400", statusColor: "bg-yellow-500/10 text-yellow-400" },
  { layer: "L1", name: "Artifact Collection Engine", status: "COMPLETE", tools: "Logs · RAM · Registry · Sysmon · SQLite", color: "text-cyan-400", statusColor: "bg-emerald-500/10 text-emerald-400" },
];

const WORKFLOW_PHASES = [
  { phase: 1, name: "Identification", status: "done" },
  { phase: 2, name: "Preservation", status: "done" },
  { phase: 3, name: "Collection", status: "done" },
  { phase: 4, name: "Examination", status: "active" },
  { phase: 5, name: "Analysis", status: "active" },
  { phase: 6, name: "Presentation", status: "pending" },
  { phase: 7, name: "Response", status: "pending" },
];

const ARTIFACT_STATUS = [
  { name: "System Logs", icon: Database, parsed: 12480, status: "done" },
  { name: "Browser History", icon: Search, parsed: 3241, status: "done" },
  { name: "Registry Hives", icon: Lock, parsed: 847, status: "done" },
  { name: "RAM Dumps", icon: Cpu, parsed: 1, status: "active" },
  { name: "Network PCAP", icon: Network, parsed: 24581, status: "active" },
  { name: "File Metadata", icon: HardDrive, parsed: 9812, status: "done" },
  { name: "Process Traces", icon: Activity, parsed: 2103, status: "done" },
  { name: "Shell Logs", icon: Terminal, parsed: 456, status: "done" },
  { name: "USB Registers", icon: Shield, parsed: 14, status: "done" },
];

const LOG_LINES = [
  { time: "10:42:01", text: "$ volatility3 -f memory.raw windows.pslist", type: "cmd" },
  { time: "10:42:05", text: "[INFO] Scanning 847 processes... 12 suspicious PIDs flagged", type: "info" },
  { time: "10:42:08", text: "CRITICAL: mimikatz_v2 signature found in PID 4012!", type: "critical" },
  { time: "10:42:10", text: "$ python3 GMM_anomaly_detector.py --model gmm --data sysmon.json", type: "cmd" },
  { time: "10:42:12", text: "[INFO] GMM Fit: K=8 components, AUC=0.964", type: "info" },
  { time: "10:42:15", text: "$ yara -r /rules/apt_signatures.yar /evidence/", type: "cmd" },
  { time: "10:42:18", text: "CRITICAL: cobaltstrike_beacon signature found in PID 1102!", type: "critical" },
  { time: "10:42:20", text: "[SYSTEM] Evaluating Probability Networks...", type: "system" },
  { time: "10:42:22", text: "$ python3 bayes_network.py --evidence sysmon", type: "cmd" },
  { time: "10:42:25", text: "[INFO] Hypothesis likelihood ratio: 423.8", type: "info" },
  { time: "10:42:28", text: "[SYSTEM] SP 800-86 report generated successfully.", type: "system" },
  { time: "10:42:31", text: "$ scapy -r capture.pcap --filter 'tcp.flags.syn==1'", type: "cmd" },
  { time: "10:42:34", text: "[INFO] Detected 3,412 SYN packets from 10.0.0.12", type: "info" },
  { time: "10:42:37", text: "CRITICAL: DNS tunneling detected — entropy 7.92 on irc.c2.evil.com", type: "critical" },
  { time: "10:42:40", text: "[SYSTEM] TCS updated: 0.75 → 0.82 (CRITICAL threshold)", type: "system" },
];

/* ── AnimatedStatCard ── */
function AnimatedStatCard({
  label,
  rawValue,
  suffix,
  icon: Icon,
  color,
  bg,
  index,
}: {
  label: string;
  rawValue: number;
  suffix?: string;
  icon: React.ElementType;
  color: string;
  bg: string;
  index: number;
}) {
  const counter = useCounter(rawValue, 1400);

  return (
    <div
      className={`bg-neutral-900/50 border border-white/5 rounded-xl p-4 flex items-center justify-between card-interactive animate-fade-in-up`}
      style={{ animationDelay: `${index * 100}ms` }}
    >
      <div>
        <p className="text-white/40 text-[10px] font-mono uppercase tracking-wider mb-1">
          {label}
        </p>
        <p className="text-xl font-bold font-[var(--font-space-mono)]">
          {rawValue >= 1000
            ? counter.value.toLocaleString(undefined, {
                maximumFractionDigits: 0,
              })
            : counter.value.toFixed(
                rawValue % 1 !== 0 ? 1 : 0
              )}
          {suffix && <span className="text-sm text-white/50 ml-1">{suffix}</span>}
        </p>
      </div>
      <div
        className={`h-9 w-9 rounded-lg flex items-center justify-center ${bg} ${color}`}
      >
        <Icon size={18} />
      </div>
    </div>
  );
}

/* ── Terminal Simulation ── */
function LiveTerminal() {
  const [visibleLines, setVisibleLines] = useState<number>(0);
  const terminalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (visibleLines >= LOG_LINES.length) return;
    const timer = setTimeout(
      () => {
        setVisibleLines((v) => v + 1);
        // Auto-scroll
        if (terminalRef.current) {
          terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
        }
      },
      visibleLines === 0 ? 300 : 600 + Math.random() * 400
    );
    return () => clearTimeout(timer);
  }, [visibleLines]);

  return (
    <div className="lg:col-span-7 bg-black border border-white/10 rounded-xl flex flex-col overflow-hidden relative terminal-scanline animate-fade-in-up delay-200">
      <div className="px-4 py-3 border-b border-white/5 bg-neutral-950 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-2">
          <div className="flex gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-pink-500/80" />
            <span className="w-2.5 h-2.5 rounded-full bg-yellow-500/80" />
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80" />
          </div>
          <Terminal size={14} className="text-white/40 ml-2" />
          <h3 className="text-[10px] font-mono text-white/60 uppercase tracking-widest">
            Diagnostic Logger
          </h3>
        </div>
        <span className="text-[9px] font-mono text-white/20">NIST SP 800-86</span>
      </div>
      <div
        ref={terminalRef}
        className="p-4 font-mono text-[11px] flex-1 space-y-1.5 overflow-y-auto leading-relaxed max-h-[280px]"
      >
        {LOG_LINES.slice(0, visibleLines).map((line, i) => {
          let colorClass = "text-white/45";
          if (line.type === "cmd") colorClass = "text-cyan-400 font-semibold";
          else if (line.type === "critical")
            colorClass = "text-pink-400 font-bold";
          else if (line.type === "system") colorClass = "text-emerald-400";
          return (
            <p
              key={i}
              className={`${colorClass} animate-fade-in-up`}
              style={{ animationDuration: "0.25s" }}
            >
              <span className="text-white/20 mr-2">[{line.time}]</span>
              {line.text}
            </p>
          );
        })}
        <p className="text-white/20 animate-terminal-blink">▌</p>
      </div>
    </div>
  );
}

/* ── Main Dashboard ── */
export default function Dashboard() {
  const currentTCS = 0.75;
  const containerRef = useRef<HTMLDivElement>(null);

  // ── Live API Data ──
  const [pipelineStatus, setPipelineStatus] = useState<PipelineStatus | null>(null);
  const [health, setHealth] = useState<HealthResponse | null>(null);

  const fetchLiveData = useCallback(async () => {
    const [ps, h] = await Promise.all([getPipelineStatus(), getHealth()]);
    setPipelineStatus(ps);
    setHealth(h);
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchLiveData();
    // Refresh every 30s
    const interval = setInterval(fetchLiveData, 30000);
    return () => clearInterval(interval);
  }, [fetchLiveData]);

  const liveEvidenceCount = pipelineStatus?.total_documents ?? 53535;

  // GSAP scroll-triggered entrance animations
  useGSAP(
    () => {
      const rows = containerRef.current?.querySelectorAll(".dashboard-row");
      if (!rows) return;

      rows.forEach((row, i) => {
        gsap.fromTo(
          row,
          { opacity: 0, y: 30 },
          {
            opacity: 1,
            y: 0,
            duration: 0.6,
            ease: "power2.out",
            delay: 0.1 + i * 0.15,
            scrollTrigger: {
              trigger: row,
              start: "top 90%",
            },
          }
        );
      });
    },
    { scope: containerRef }
  );

  return (
    <div ref={containerRef} className="p-6 lg:p-8 space-y-6 overflow-y-auto">
      {/* ── Page Header ── */}
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 animate-fade-in-up">
        <div>
          <h1 className="text-2xl font-bold font-[var(--font-space-grotesk)] text-white">
            Investigation Overview
          </h1>
          <p className="text-white/50 text-sm mt-1">
            Real-time telemetry · NIST SP 800-86 aligned · 6 ML models active
          </p>
        </div>
        <div className="flex gap-2 text-[10px] font-mono">
          <span className="px-3 py-1.5 rounded-full bg-pink-500/10 text-pink-400 border border-pink-500/20 animate-pulse">
            TCS: {currentTCS.toFixed(2)} — HIGH RISK
          </span>
        </div>
      </div>

      {/* ── Quick Stats Row ── */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 dashboard-row">
        <AnimatedStatCard label="Active Alerts" rawValue={14} icon={ShieldAlert} color="text-pink-500" bg="bg-pink-500/10" index={0} />
        <AnimatedStatCard label="Evidence Parsed" rawValue={liveEvidenceCount} icon={FileSearch} color="text-cyan-400" bg="bg-cyan-500/10" index={1} />
        <AnimatedStatCard label="Traffic Velocity" rawValue={3412} suffix="Pkt/s" icon={Network} color="text-purple-400" bg="bg-purple-500/10" index={2} />
        <AnimatedStatCard label="CPU Intel" rawValue={42.1} suffix="%" icon={Cpu} color="text-emerald-400" bg="bg-emerald-500/10" index={3} />
      </div>

      {/* ── Row 2: TCS Dial + 6 ML Model Scores ── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 dashboard-row">
        {/* TCS Dial with Scale */}
        <div className="lg:col-span-5 bg-neutral-900/50 border border-white/5 rounded-xl p-6 relative overflow-hidden card-interactive animate-fade-in-up">
          <div className="absolute top-0 right-0 w-48 h-48 bg-cyan-500/5 rounded-full blur-3xl -mr-10 -mt-10 pointer-events-none" />

          <div className="flex justify-between items-start mb-5">
            <div>
              <h2 className="text-base font-bold">Threat Confidence Score</h2>
              <p className="text-[10px] text-white/40 font-mono mt-0.5">
                Bayesian Posterior · Weighted Evidence
              </p>
            </div>
          </div>

          {/* Dial */}
          <div className="flex items-center gap-6 mb-5">
            <div className="relative flex items-center justify-center w-32 h-32 shrink-0">
              <svg
                className="absolute inset-0 w-full h-full transform -rotate-90"
                viewBox="0 0 128 128"
              >
                <circle
                  cx="64"
                  cy="64"
                  r="56"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="12"
                  className="text-neutral-800"
                />
                <circle
                  cx="64"
                  cy="64"
                  r="56"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="12"
                  strokeDasharray="351.86"
                  strokeDashoffset={351.86 * (1 - currentTCS)}
                  className="text-pink-500 animate-dial-sweep"
                  strokeLinecap="round"
                  style={{
                    "--dial-target": `${351.86 * (1 - currentTCS)}`,
                  } as React.CSSProperties}
                />
              </svg>
              <div className="text-center z-10">
                <span className="block text-3xl font-black font-[var(--font-space-mono)] glow-pink">
                  {currentTCS.toFixed(2)}
                </span>
                <span className="text-[8px] text-white/30 tracking-widest block mt-0.5">
                  TCS
                </span>
              </div>
            </div>

            {/* Scale */}
            <div className="flex-1 space-y-1.5 font-mono text-[10px]">
              {TCS_SCALE.map((s, i) => (
                <div
                  key={i}
                  className={`flex justify-between items-center p-1.5 px-2.5 rounded transition-all ${
                    currentTCS >= parseFloat(s.range.split(" – ")[0]) &&
                    currentTCS <= parseFloat(s.range.split(" – ")[1])
                      ? "bg-white/5 border border-white/10 animate-pulse-glow"
                      : ""
                  }`}
                >
                  <span className="text-white/50">{s.range}</span>
                  <span className={`${s.color} font-bold`}>{s.action}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="p-2.5 bg-black/50 rounded-lg border border-cyan-500/10 font-mono text-[10px] text-cyan-400/80 text-center">
            TCS = ∑ (Evidence_Weightᵢ × Bayesian_Posteriorᵢ) /
            Total_Evidence_Count
          </div>
        </div>

        {/* 6 ML Model Scores Grid */}
        <div className="lg:col-span-7 bg-neutral-900/50 border border-white/5 rounded-xl p-6 animate-fade-in-up delay-100">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h2 className="text-base font-bold">ML Intelligence Engine</h2>
              <p className="text-[10px] text-white/40 font-mono mt-0.5">
                6 Models · Real-time scoring
              </p>
            </div>
            <Brain size={16} className="text-white/20" />
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
            {ML_SCORES.map((model, i) => (
              <div
                key={i}
                className="p-3 rounded-lg bg-black/30 border border-white/5 space-y-2 card-interactive"
                style={{ animationDelay: `${i * 80}ms` }}
              >
                <div className="flex items-center gap-2">
                  <model.icon size={12} className={model.color} />
                  <span className="text-[10px] font-mono text-white/60 truncate">
                    {model.name}
                  </span>
                </div>
                <div className="flex items-end justify-between">
                  <span
                    className={`text-lg font-black font-[var(--font-space-mono)] ${
                      model.score > 0.7
                        ? "text-pink-400 glow-pink"
                        : model.score > 0.5
                        ? "text-orange-400"
                        : "text-emerald-400"
                    }`}
                  >
                    {model.score.toFixed(2)}
                  </span>
                </div>
                <div className="w-full h-1 bg-neutral-800 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-1000 ease-out ${
                      model.score > 0.7
                        ? "bg-pink-500"
                        : model.score > 0.5
                        ? "bg-orange-400"
                        : "bg-emerald-500"
                    }`}
                    style={{ width: `${model.score * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Row 3: 5-Layer Architecture Status + Engine Logs ── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 dashboard-row">
        {/* 5-Layer Stack */}
        <div className="lg:col-span-5 bg-neutral-900/50 border border-white/5 rounded-xl p-6 animate-fade-in-up">
          <h2 className="text-base font-bold mb-1">5-Layer Architecture</h2>
          <p className="text-[10px] text-white/40 font-mono mb-4">
            Modular stack status
          </p>

          <div className="space-y-2">
            {ARCHITECTURE_LAYERS.map((layer, i) => (
              <div
                key={i}
                className="flex items-center justify-between p-2.5 rounded-lg bg-black/30 border border-white/5 card-interactive"
                style={{ animationDelay: `${i * 60}ms` }}
              >
                <div className="flex items-center gap-3">
                  <span
                    className={`text-[10px] font-mono font-bold ${layer.color}`}
                  >
                    {layer.layer}
                  </span>
                  <div>
                    <p className="text-xs font-medium text-white/80">
                      {layer.name}
                    </p>
                    <p className="text-[9px] font-mono text-white/30 mt-0.5">
                      {layer.tools}
                    </p>
                  </div>
                </div>
                <span
                  className={`px-2 py-0.5 rounded text-[9px] font-mono font-bold ${layer.statusColor}`}
                >
                  {layer.status}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Engine Logs Terminal — now with live simulation */}
        <LiveTerminal />
      </div>

      {/* ── Row 4: 7-Phase Workflow + 9 Artifact Collection Status ── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 dashboard-row">
        {/* 7-Phase Pipeline */}
        <div className="lg:col-span-5 bg-neutral-900/50 border border-white/5 rounded-xl p-6 animate-fade-in-up">
          <h2 className="text-base font-bold mb-1">Investigation Pipeline</h2>
          <p className="text-[10px] text-white/40 font-mono mb-4">
            7-Phase NIST workflow
          </p>

          <div className="space-y-1.5">
            {WORKFLOW_PHASES.map((phase) => (
              <div
                key={phase.phase}
                className={`flex items-center justify-between p-2.5 rounded-lg border transition-all ${
                  phase.status === "active"
                    ? "bg-cyan-500/5 border-cyan-500/20 animate-border-glow"
                    : phase.status === "done"
                    ? "bg-black/20 border-white/5"
                    : "bg-black/10 border-white/[0.03]"
                }`}
              >
                <div className="flex items-center gap-3">
                  <span
                    className={`w-5 h-5 rounded text-[10px] font-mono font-bold flex items-center justify-center ${
                      phase.status === "active"
                        ? "bg-cyan-500/20 text-cyan-400"
                        : phase.status === "done"
                        ? "bg-emerald-500/20 text-emerald-400"
                        : "bg-white/5 text-white/20"
                    }`}
                  >
                    {phase.status === "done" ? "✓" : phase.phase}
                  </span>
                  <span
                    className={`text-xs font-medium ${
                      phase.status === "active"
                        ? "text-cyan-400"
                        : phase.status === "done"
                        ? "text-white/60"
                        : "text-white/25"
                    }`}
                  >
                    Phase {phase.phase}: {phase.name}
                  </span>
                </div>
                <span
                  className={`text-[9px] font-mono font-bold ${
                    phase.status === "active"
                      ? "text-cyan-400 animate-pulse"
                      : phase.status === "done"
                      ? "text-emerald-400/60"
                      : "text-white/15"
                  }`}
                >
                  {phase.status === "active"
                    ? "RUNNING"
                    : phase.status === "done"
                    ? "DONE"
                    : "PENDING"}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* 9 Artifact Collection Grid */}
        <div className="lg:col-span-7 bg-neutral-900/50 border border-white/5 rounded-xl p-6 animate-fade-in-up delay-100">
          <h2 className="text-base font-bold mb-1">
            Artifact Collection Engine
          </h2>
          <p className="text-[10px] text-white/40 font-mono mb-4">
            9 forensic categories · parallel extraction
          </p>

          <div className="grid grid-cols-3 gap-2">
            {ARTIFACT_STATUS.map((art, i) => (
              <div
                key={i}
                className={`p-3 rounded-lg border card-interactive ${
                  art.status === "active"
                    ? "bg-cyan-500/5 border-cyan-500/15"
                    : "bg-black/20 border-white/5"
                }`}
              >
                <div className="flex items-center gap-2 mb-2">
                  <art.icon
                    size={12}
                    className={
                      art.status === "active"
                        ? "text-cyan-400"
                        : "text-white/30"
                    }
                  />
                  <span className="text-[10px] font-mono text-white/60 truncate">
                    {art.name}
                  </span>
                </div>
                <div className="flex items-end justify-between">
                  <span className="text-sm font-bold font-[var(--font-space-mono)] text-white/80">
                    {art.parsed.toLocaleString()}
                  </span>
                  {art.status === "active" && (
                    <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping" />
                  )}
                  {art.status === "done" && (
                    <span className="text-[8px] font-mono text-emerald-400/60">
                      ✓
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Row 5: Recent Critical Alerts ── */}
      <div className="bg-neutral-900/50 border border-white/5 rounded-xl overflow-hidden dashboard-row animate-fade-in-up">
        <div className="px-6 py-4 border-b border-white/5 flex justify-between items-center">
          <h2 className="text-base font-bold">Recent Critical Anomalies</h2>
          <a
            href="/alerts"
            className="text-[10px] font-mono text-cyan-400 hover:text-cyan-300 transition-colors uppercase tracking-widest border border-cyan-400/20 px-3 py-1.5 rounded bg-cyan-400/10 hover:bg-cyan-400/15"
          >
            View All Alerts
          </a>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-black/40 text-white/40 text-[10px] font-mono uppercase tracking-wider">
              <tr>
                <th className="px-6 py-3 font-medium">Severity</th>
                <th className="px-6 py-3 font-medium">Indicator</th>
                <th className="px-6 py-3 font-medium">Module Source</th>
                <th className="px-6 py-3 font-medium">MITRE ATT&CK</th>
                <th className="px-6 py-3 font-medium">Time</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 text-white/70">
              <tr className="hover:bg-white/[0.02] transition-colors group">
                <td className="px-6 py-3">
                  <span className="inline-flex items-center gap-1.5 px-2 py-1 rounded bg-pink-500/10 text-pink-400 text-[10px] font-mono font-bold tracking-wider">
                    <AlertOctagon size={10} /> CRITICAL
                  </span>
                </td>
                <td className="px-6 py-3 font-mono text-xs text-white group-hover:text-cyan-400 transition-colors">
                  mimikatz_v2 signature in PID 4012
                </td>
                <td className="px-6 py-3 text-[11px]">YARA + Volatility 3</td>
                <td className="px-6 py-3 text-[11px] font-mono text-cyan-400/70">
                  TA0006
                </td>
                <td className="px-6 py-3 text-white/40 text-[11px]">
                  3 mins ago
                </td>
              </tr>
              <tr className="hover:bg-white/[0.02] transition-colors group">
                <td className="px-6 py-3">
                  <span className="inline-flex items-center gap-1.5 px-2 py-1 rounded bg-pink-500/10 text-pink-400 text-[10px] font-mono font-bold tracking-wider">
                    <AlertOctagon size={10} /> CRITICAL
                  </span>
                </td>
                <td className="px-6 py-3 font-mono text-xs text-white group-hover:text-cyan-400 transition-colors">
                  cobaltstrike_beacon in PID 1102
                </td>
                <td className="px-6 py-3 text-[11px]">
                  YARA + Scapy Beacon
                </td>
                <td className="px-6 py-3 text-[11px] font-mono text-cyan-400/70">
                  TA0011
                </td>
                <td className="px-6 py-3 text-white/40 text-[11px]">
                  8 mins ago
                </td>
              </tr>
              <tr className="hover:bg-white/[0.02] transition-colors group">
                <td className="px-6 py-3">
                  <span className="inline-flex items-center gap-1.5 px-2 py-1 rounded bg-orange-500/10 text-orange-400 text-[10px] font-mono font-bold tracking-wider">
                    <ShieldAlert size={10} /> HIGH
                  </span>
                </td>
                <td className="px-6 py-3 font-mono text-xs text-white group-hover:text-cyan-400 transition-colors">
                  Lateral SMB to 10.0.0.45
                </td>
                <td className="px-6 py-3 text-[11px]">
                  Scapy + Gaussian Engine
                </td>
                <td className="px-6 py-3 text-[11px] font-mono text-cyan-400/70">
                  TA0008
                </td>
                <td className="px-6 py-3 text-white/40 text-[11px]">
                  15 mins ago
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
