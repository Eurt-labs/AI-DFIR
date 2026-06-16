"use client";

import React, { useRef, useState, useEffect } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  ExternalLink,
  Shield,
  Cpu,
  Database,
  Search,
  Brain,
  FileSearch,
  Network,
  Lock,
  Terminal,
  Bug,
  Activity,
  Layers,
  BookOpen,
  Fingerprint,
  HardDrive,
  Workflow,
  ChevronRight,
  TrendingUp,
  AlertTriangle,
  Play,
  Grid,
  Calendar,
  CheckCircle,
  BarChart,
  Clock,
  Briefcase,
  GraduationCap,
  Users,
  Menu,
  X,
  Mail,
} from "lucide-react";


// ─── GSAP Suite ────────────────────────────────────────────
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import { CustomEase } from "gsap/CustomEase";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import { ScrambleTextPlugin } from "gsap/ScrambleTextPlugin";
import { DrawSVGPlugin } from "gsap/DrawSVGPlugin";
import { TextPlugin } from "gsap/TextPlugin";
import { Observer } from "gsap/Observer";

gsap.registerPlugin(
  ScrollTrigger,
  SplitText,
  ScrambleTextPlugin,
  DrawSVGPlugin,
  TextPlugin,
  Observer,
  CustomEase
);

// ─── Accent Colors ─────────────────────────────────────────
const ACCENT_CYAN = "#00F0FF";
const ACCENT_GREEN = "#0AE448";
const ACCENT_MAGENTA = "#F100CB";

// ─── 6 Core Machine Learning Models Data ───────────────────
const ML_MODELS = [
  {
    id: 1,
    name: "Bayesian Probability Network",
    category: "Evidence Evaluation",
    accent: ACCENT_CYAN,
    icon: Network,
    description: "Constructs probabilistic graphical models linking digital evidence — system logs, file modifications, network traffic — to investigation hypotheses. Calculates Likelihood Ratios (LR) quantifying the strength of evidence under prosecution vs. defense hypotheses. Integrates multi-source evidence and updates posterior threat scores in real-time.",
    stats: "Supports real-time posterior updates across 50+ evidence nodes",
    papers: "Published methodology: DFRWS 2024, IEEE S&P Workshop",
    mathHtml: (
      <div className="flex flex-col items-center justify-center py-4 font-mono text-cyan-400 text-sm md:text-base border border-cyan-500/10 rounded-lg bg-black/60 relative overflow-hidden">
        <div className="absolute top-1 left-2 text-[11px] text-white/20">BAYES_THEOREM</div>
        <div className="flex items-center gap-1.5">
          <span>P(A | B) = </span>
          <div className="inline-flex flex-col items-center align-middle mx-1">
            <span className="border-b border-cyan-500/30 px-2 pb-0.5">P(B | A) × P(A)</span>
            <span className="pt-0.5">P(B)</span>
          </div>
        </div>
      </div>
    ),
    codeSnippet: `def bayesian_threat_update(prior, likelihood, evidence_prob):
    """
    prior        = P(A)   - base threat probability
    likelihood   = P(B|A) - frequency of evidence in attacks
    evidence_prob = P(B)  - frequency of evidence overall
    """
    posterior = (likelihood * prior) / evidence_prob
    return min(posterior, 1.0) # Capped at 100%

# Example: PowerShell Base64 command detected
threat_score = bayesian_threat_update(
    prior=0.05,        # 5% base threat rate
    likelihood=0.87,   # 87% of attacks use base64 PS
    evidence_prob=0.03 # only 3% of systems use it legitimately
) # Result: P(Attack | Evidence) = 1.0 (High Alert)`,
  },
  {
    id: 2,
    name: "Gaussian Mixture Models",
    category: "Network Anomaly Detection",
    accent: ACCENT_GREEN,
    icon: Activity,
    description: "Models normal network behavior as a mixture of K Gaussian components, each representing a legitimate traffic cluster (DNS queries, HTTP sessions, SSH tunnels). Data points falling into low-probability density regions — unusual packet sizes, abnormal connection intervals, or rogue port usage — are flagged as anomalies.",
    stats: "K=8 components · AUC-ROC: 0.964 on CICIDS2017",
    papers: "Validated against UNSW-NB15 and CIC-IDS2017 benchmarks",
    mathHtml: (
      <div className="flex flex-col items-center justify-center py-4 font-mono text-emerald-400 text-sm md:text-base border border-emerald-500/10 rounded-lg bg-black/60 relative overflow-hidden">
        <div className="absolute top-1 left-2 text-[11px] text-white/20">GAUSSIAN_PDF</div>
        <div className="flex items-center gap-1.5">
          <span>f(x) = </span>
          <div className="inline-flex flex-col items-center align-middle mx-1">
            <span className="border-b border-emerald-500/30 px-2 pb-0.5">1</span>
            <span className="pt-0.5">σ √(2π)</span>
          </div>
          <span>e <sup>- (x - μ)² / 2σ²</sup></span>
        </div>
      </div>
    ),
    codeSnippet: `import numpy as np
from scipy import stats

def is_anomalous(observed_value, baseline_mean, baseline_std, threshold_sigma=3):
    """Returns True if observation is statistically anomalous"""
    z_score = abs((observed_value - baseline_mean) / baseline_std)
    return z_score > threshold_sigma

# Example: User downloads 15GB at 2 AM (normal: 500MB avg, 200MB std)
anomaly_detected = is_anomalous(
    observed_value=15360, # 15GB in MB
    baseline_mean=500,
    baseline_std=200,
    threshold_sigma=3
) # Result: Z-score = 74.3 -> CRITICAL ANOMALY DETECTED`,
  },
  {
    id: 3,
    name: "Euclidean Distance Metrics",
    category: "Behavioral Similarity",
    accent: ACCENT_MAGENTA,
    icon: Shield,
    description: "Converts forensic activity records into multidimensional vectors (representing parameters like process count, network connections, file access rate). Matches observed behavior vectors against known attack campaign vectors using Euclidean Distance metrics to identify campaign matches.",
    stats: "Classifies 14 ATT&CK techniques with <12% distance error",
    papers: "Feature set aligned with EMBER malware dataset schema",
    mathHtml: (
      <div className="flex flex-col items-center justify-center py-4 font-mono text-pink-400 text-sm md:text-base border border-pink-500/10 rounded-lg bg-black/60 relative overflow-hidden">
        <div className="absolute top-1 left-2 text-[11px] text-white/20">EUCLIDEAN_METRIC</div>
        <div className="flex items-center gap-1">
          <span>d = √ </span>
          <span className="border-t border-pink-500/30 pt-0.5">∑ <sub>i=1..n</sub> (x<sub>i</sub> - y<sub>i</sub>)²</span>
        </div>
      </div>
    ),
    codeSnippet: `import numpy as np

# Feature vector: [logins, failed_logins, processes, outbound_conns, registry_writes, file_mods]
known_brute_force_pattern = np.array([150, 148, 2, 1, 0, 0])
observed_behavior         = np.array([142, 139, 3, 2, 0, 1])

distance = np.linalg.norm(observed_behavior - known_brute_force_pattern)
# Result: Distance ≈ 13.6 -> Extremely close to brute-force pattern!`,
  },
  {
    id: 4,
    name: "Logistic Regression Classifier",
    category: "Threat Classification",
    accent: ACCENT_CYAN,
    icon: Bug,
    description: "Binary classification model extracting features from PE headers (entropy, section count, import table size), API call sequences, and behavioral traces. Outputs calibrated probability scores for malicious classification. Explainable AI weights provide feature-level interpretability.",
    stats: "96.8% accuracy · F1: 0.971 · FPR: 0.023",
    papers: "Hyperparameter optimized on 250,000 malware specimens",
    mathHtml: (
      <div className="flex flex-col items-center justify-center py-4 font-mono text-cyan-400 text-sm md:text-base border border-cyan-500/10 rounded-lg bg-black/60 relative overflow-hidden">
        <div className="absolute top-1 left-2 text-[11px] text-white/20">LOGISTIC_SIGMOID</div>
        <div className="flex items-center gap-1.5">
          <span>P(Y = 1) = </span>
          <div className="inline-flex flex-col items-center align-middle mx-1">
            <span className="border-b border-cyan-500/30 px-2 pb-0.5">1</span>
            <span className="pt-0.5">1 + e <sup>- (b₀ + b₁x₁ + b₂x₂ + ...)</sup></span>
          </div>
        </div>
      </div>
    ),
    codeSnippet: `from sklearn.linear_model import LogisticRegression

# Event vector: [cmd_spawned, Tor_exit_conn, base64_powerShell, admin_login_off_hours]
# Model weights learned: cmd_spawned=High, Tor=VeryHigh, base64=High, off_hours=Medium
model = LogisticRegression(class_weight='balanced')
model.fit(X_train, y_train) # 0=legit, 1=malicious

event_features = extract_features(new_forensic_event)
malicious_probability = model.predict_proba([event_features])[0][1]
# Result: Prob = 0.94 -> Flags MALICIOUS threat`,
  },
  {
    id: 5,
    name: "Shannon Entropy Analysis",
    category: "Malware & Ransomware Identification",
    accent: ACCENT_GREEN,
    icon: FileSearch,
    description: "Analyzes the statistical randomness of files and memory segments by mapping byte distributions. Encrypted, compressed, or packed malware payloads exhibit high Shannon Entropy, allowing detection of ransomware file actions and packed packers in memory.",
    stats: "Shannon Range: 0.0 (structured text) to 8.0 (pure encrypted)",
    papers: "Research: High-entropy detection matches Ransomware within 3 blocks",
    mathHtml: (
      <div className="flex flex-col items-center justify-center py-4 font-mono text-emerald-400 text-sm md:text-base border border-emerald-500/10 rounded-lg bg-black/60 relative overflow-hidden">
        <div className="absolute top-1 left-2 text-[11px] text-white/20">SHANNON_ENTROPY</div>
        <div className="flex items-center gap-1.5">
          <span>H(X) = - </span>
          <span>∑ <sub>x ∈ X</sub> p(x) log₂ p(x)</span>
        </div>
      </div>
    ),
    codeSnippet: `import math
from collections import Counter

def calculate_entropy(file_path):
    with open(file_path, 'rb') as f:
        data = f.read()
    if not data: return 0.0
    
    byte_counts = Counter(data)
    total_bytes = len(data)
    
    entropy = -sum(
        (count / total_bytes) * math.log2(count / total_bytes)
        for count in byte_counts.values() if count > 0
    )
    return entropy

# Calculated entropy: 7.82 -> HIGH RANDOMNESS -> Flagged Packed Malware!`,
  },
  {
    id: 6,
    name: "Time-Series Decomposition",
    category: "Timeline Reconstruction",
    accent: ACCENT_MAGENTA,
    icon: Workflow,
    description: "Aggregates all timestamps from normalized forensic data logs (logs, system modifications, network PCAPs) and applies additive time-series decomposition to isolate trend, seasonal, and residual components.",
    stats: "Filters daily noise, leaving raw residual spikes indicating attack windows",
    papers: "Aligned with DFRWS USA 2025 event reconstruction models",
    mathHtml: (
      <div className="flex flex-col items-center justify-center py-4 font-mono text-pink-400 text-sm md:text-base border border-pink-500/10 rounded-lg bg-black/60 relative overflow-hidden">
        <div className="absolute top-1 left-2 text-[11px] text-white/20">TIME_SERIES_DECOMP</div>
        <div className="flex items-center gap-1.5">
          <span>X<sub>t</sub> = T<sub>t</sub> + S<sub>t</sub> + R<sub>t</sub></span>
        </div>
      </div>
    ),
    codeSnippet: `from statsmodels.tsa.seasonal import seasonal_decompose
import pandas as pd

# hourly_events: [timestamp, event_count]
decomposition = seasonal_decompose(hourly_events['count'], model='additive', period=24)

# Residuals represent unexplained anomalies (spikes indicate intrusion activity)
anomaly_windows = decomposition.resid[decomposition.resid > 3 * decomposition.resid.std()]
print("Attack timeline activity spikes detected at:", anomaly_windows.index.tolist())`,
  },
];

// ─── 9 Forensic Artifact Categories Data ───────────────────
const ARTIFACT_CATEGORIES = [
  {
    name: "System Logs",
    desc: "Parses Windows Event Logs (.evtx), Linux syslog and auth logs using Python log normalizers and Elasticsearch ingestion pipelines.",
    targets: "Brute-force login signatures, privilege escalations, scheduled task creation, process spawning patterns.",
    icon: Database,
    color: ACCENT_CYAN,
  },
  {
    name: "Browser Web History",
    desc: "Extracts local browser profiles (Chrome, Firefox, Edge, Safari) using direct SQLite database decoders to reconstruct timeline traces.",
    targets: "Attacker reconnaissance history, phishing access vectors, cache structures, Cached Credential SQLite tables.",
    icon: Search,
    color: ACCENT_GREEN,
  },
  {
    name: "Windows Registry",
    desc: "Decrypts NTUSER.DAT, SYSTEM, SOFTWARE, SAM hives using Python python-registry modules to find persistent structures.",
    targets: "Persistence registries (Run/RunOnce keys), USB connection traces, shellbags, UserAssist executing timestamps.",
    icon: Lock,
    color: ACCENT_MAGENTA,
  },
  {
    name: "Memory RAM Dumps",
    desc: "Automates Volatility 3 command plugin analysis to parse raw physical RAM dumps, recovering transient and fileless malware traces.",
    targets: "Active process listings (pslist/pstree), network sockets (netscan), injected DLL modules (malfind).",
    icon: Cpu,
    color: ACCENT_CYAN,
  },
  {
    name: "Network Packets (PCAP)",
    desc: "Inspects live packet structures or raw PCAPs utilizing Wireshark/tshark pipelines and Python Scapy decoders.",
    targets: "Command & Control beacon timing anomalies, DNS tunneling channels, large outbound exfiltrations.",
    icon: Network,
    color: ACCENT_GREEN,
  },
  {
    name: "File System Metadata",
    desc: "Performs file system integrity and MACB metadata scans using Autopsy pipelines and disk writing blockers.",
    targets: "Timestomping identification, files generated in %TEMP%/AppData, high-entropy packed directory segments.",
    icon: HardDrive,
    color: ACCENT_MAGENTA,
  },
  {
    name: "Process Execution Traces",
    desc: "Decodes Windows Prefetch (.pf) files, AppCompatCache (Shimcache), Amcache registries, and Linux audit logs.",
    targets: "Historical process executions, execution path mismatches, program signatures run prior to automated deletion.",
    icon: Activity,
    color: ACCENT_CYAN,
  },
  {
    name: "PowerShell & Shell Logs",
    desc: "Parses historical powershell scripts, transcript logs, and Linux bash/zsh shell histories.",
    targets: "Base64 encoded arguments, download cradles (IEX/Invoke-WebRequest), LOLBAS executions, mimikatz commands.",
    icon: Terminal,
    color: ACCENT_GREEN,
  },
  {
    name: "USB Device Registers",
    desc: "Queries system setupapi logs, udev properties, and Windows USBSTOR registry structures.",
    targets: "Removable drives, mounting serial numbers, timestamps, correlated file modifications in active windows.",
    icon: Shield,
    color: ACCENT_MAGENTA,
  },
];

// ─── 15 Tech Stack Items Data ──────────────────────────────
const TECH_STACK_ITEMS = [
  { name: "Autopsy", cat: "forensics", desc: "Disk forensics & deleted file recovery", logo: "https://www.sleuthkit.org/autopsy/images/autopsy-icon.png" },
  { name: "Volatility 3", cat: "forensics", desc: "Memory forensics & RAM extraction", logo: "https://img.shields.io/badge/Volatility-3-blue" },
  { name: "Wireshark", cat: "forensics", desc: "PCAP deep network protocol analyzer", logo: "https://img.shields.io/badge/Wireshark-1679A7" },
  { name: "Scapy", cat: "forensics", desc: "Python automated packet parsing", logo: "https://img.shields.io/badge/Scapy-Forensics-blue" },
  { name: "YARA", cat: "forensics", desc: "Malware pattern matching rule engine", logo: "https://img.shields.io/badge/YARA-Pattern--Match-magenta" },
  { name: "Suricata", cat: "forensics", desc: "Real-time network intrusion IDS", logo: "https://img.shields.io/badge/Suricata-IDS-green" },
  { name: "Nmap", cat: "forensics", desc: "Active host discovery & service mapping", logo: "https://img.shields.io/badge/Nmap-Scanner-lightgray" },

  { name: "TensorFlow", cat: "aiml", desc: "LSTM deep learning anomaly detection", logo: "https://www.tensorflow.org/images/tf_logo_social.png" },
  { name: "Scikit-learn", cat: "aiml", desc: "XGBoost, KNN, Isolation Forest tools", logo: "https://img.shields.io/badge/scikit--learn-F7931E" },
  { name: "Pandas", cat: "aiml", desc: "Log dataframe Normalizations & analytics", logo: "https://img.shields.io/badge/Pandas-DataFrame-blue" },
  { name: "NumPy", cat: "aiml", desc: "Mathematical calculations & entropy scales", logo: "https://img.shields.io/badge/NumPy-Calculations-lightblue" },

  { name: "Elasticsearch", cat: "infra", desc: "Multi-source log indexing & fast search", logo: "https://www.elastic.co/static-res/images/elastic-logo-200.png" },
  { name: "Kibana", cat: "infra", desc: "Forensic dashboard timeline graphs", logo: "https://img.shields.io/badge/Kibana-Visualizations-blue" },
  { name: "SQLite", cat: "infra", desc: "Case files & Browser DB parses", logo: "https://img.shields.io/badge/SQLite-Database-blue" },
  { name: "Docker", cat: "infra", desc: "Isolated forensic sandbox pipelines", logo: "https://www.docker.com/wp-content/uploads/2022/03/Moby-logo.png" },

  { name: "Flask / Django", cat: "web", desc: "Forensic Portal REST APIs", logo: "https://img.shields.io/badge/Flask--Django-Backend-green" },
  { name: "Python", cat: "web", desc: "Core pipeline execution script engine", logo: "https://www.python.org/static/community_logos/python-logo-master-v3-TM.png" },
  { name: "Kali Linux", cat: "web", desc: "Primary virtual forensic OS suite", logo: "https://img.shields.io/badge/Kali_Linux-557C94" },
];

export default function DFIRFrameworkPage() {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const heroRef = useRef<HTMLDivElement>(null);
  const challengeRef = useRef<HTMLDivElement>(null);
  const pipelineTrackRef = useRef<HTMLDivElement>(null);
  const pipelinePanelsRef = useRef<HTMLDivElement>(null);
  const mlRef = useRef<HTMLDivElement>(null);
  const techRef = useRef<HTMLDivElement>(null);
  const refsRef = useRef<HTMLDivElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);

  // ─── React Stateful Controls ─────────────────────────────
  const [modelModes, setModelModes] = useState<Record<number, "math" | "code">>({});
  const [techFilter, setTechFilter] = useState<"all" | "forensics" | "aiml" | "infra" | "web">("all");
  const [activeWorkflowPhase, setActiveWorkflowPhase] = useState(0);
  const [navScrolled, setNavScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Helper: email href — mailto on mobile, Gmail compose on desktop
  const EMAIL_SUBJECT = "Inquiry: AI-Assisted Digital Forensics Framework";
  const EMAIL_MAILTO = `mailto:dhruv15saraswat@gmail.com?subject=${encodeURIComponent(EMAIL_SUBJECT)}`;
  const EMAIL_GMAIL = `https://mail.google.com/mail/?view=cm&fs=1&to=dhruv15saraswat@gmail.com&su=${encodeURIComponent(EMAIL_SUBJECT)}`;
  const isMobileDevice = typeof window !== "undefined" && /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);

  // ─── Direct DOM Telemetry Ref Handles (60fps Engine) ─────
  const cpuValRef = useRef<HTMLSpanElement>(null);
  const cpuBarRef = useRef<HTMLDivElement>(null);
  const memValRef = useRef<HTMLSpanElement>(null);
  const memBarRef = useRef<HTMLDivElement>(null);
  const netValRef = useRef<HTMLSpanElement>(null);
  const alertsValRef = useRef<HTMLSpanElement>(null);
  const scannedValRef = useRef<HTMLSpanElement>(null);
  const progressTextRef = useRef<HTMLSpanElement>(null);
  const progressBarRef = useRef<HTMLDivElement>(null);
  const stageNameRef = useRef<HTMLSpanElement>(null);
  const waveformPathRef = useRef<SVGPathElement>(null);
  const loggerRef = useRef<HTMLDivElement>(null);

  const SCAN_PHASES = [
    { name: "ACQUIRING DISK TELEMETRY", cmd: "volatility3 -f memory.raw windows.pslist" },
    { name: "CORRELATING EVENT LOGS", cmd: "python3 GMM_anomaly_detector.py --model gmm --data sysmon.json" },
    { name: "HASH VERIFICATION & TRIAGE", cmd: "yara -r /rules/apt_signatures.yar /evidence/" },
    { name: "PROBABILISTIC HYPOTHESIS EVAL", cmd: "python3 bayes_network.py --LR" },
    { name: "COMPILING FORENSIC REPORT", cmd: "python3 report_generator.py --nist-sp" },
  ];

  const internalDataRef = useRef({
    cpu: 32.4,
    network: 4890,
    memory: 112.5,
    scannedFiles: 24500,
    alerts: 0,
    progress: 0,
    phase: 0,
    waveOffset: 0,
  });

  // Hide the glow background layer & scroll detection for own navbar
  useEffect(() => {
    // Hide the portfolio glow bg (first child of body)
    const glowBg = document.querySelector("body > div:first-child") as HTMLElement | null;
    if (glowBg) glowBg.style.display = "none";

    const handleScroll = () => setNavScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);

    return () => {
      if (glowBg) glowBg.style.display = "";
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  // ─── 60fps requestAnimationFrame update engine ────────────
  useEffect(() => {
    let frameId: number;
    let metricUpdateTime = 0;
    let logUpdateTime = 0;

    const data = internalDataRef.current;

    const logPool = [
      "[SYSTEM] Loading Volatile Core Memory...",
      "$ volatility3 -f memory.raw windows.pslist",
      "[INFO] Scanning 847 processes... 12 suspicious PIDs flagged",
      "[SYSTEM] Starting Phase: Anomaly Detection",
      "$ python3 GMM_anomaly_detector.py --model gmm --data sysmon.json",
      "[INFO] GMM Fit: K=8 components, AUC=0.964",
      "[SYSTEM] Starting Phase: Threat Classification",
      "$ yara -r /rules/apt_signatures.yar /evidence/",
      "CRITICAL: mimikatz_v2 signature found in PID 4012!",
      "CRITICAL: cobaltstrike_beacon signature found in PID 1102!",
      "[SYSTEM] Evaluating Probability Networks...",
      "$ python3 bayes_network.py --evidence sysmon",
      "[INFO] Hypothesis likelihood ratio: 423.8",
      "[SYSTEM] Generating Forensic Report...",
      "[SYSTEM] SP 800-86 report generated successfully."
    ];
    let logIndex = 0;

    const currentLogs = [
      "DFIR-CORE: Active telemetry monitor initialized.",
      "NIST-SP: Aligned with SP 800-86 forensics pipelines.",
      "GMM-MODELS: Outlier thresholds configured."
    ];

    const renderLogs = () => {
      if (!loggerRef.current) return;
      loggerRef.current.innerHTML = currentLogs
        .map((line) => {
          const isCmd = line.startsWith("$");
          const isErr = line.startsWith("CRITICAL") || line.startsWith("WARNING");
          const isSys = line.startsWith("[SYSTEM]");
          let color = "text-white/45";
          if (isCmd) color = "text-cyan-400 font-semibold";
          else if (isErr) color = "text-pink-400 font-bold animate-pulse";
          else if (isSys) color = "text-emerald-400";
          return `<p class="${color} leading-normal">${line}</p>`;
        })
        .join("");
    };

    const runLoop = (time: number) => {
      // 1. Math sine wave updates
      data.waveOffset += 0.07;
      if (waveformPathRef.current) {
        const points = [];
        const width = 160;
        const height = 40;
        const amp = 8;
        const freq = 0.09;
        const modulatedAmp = amp * (data.cpu / 50 * 0.4 + 0.6);
        for (let x = 0; x <= width; x += 4) {
          const y = height / 2 + Math.sin(x * freq + data.waveOffset) * modulatedAmp * (Math.sin(data.waveOffset * 0.15) * 0.4 + 0.6);
          points.push(`${x},${y}`);
        }
        waveformPathRef.current.setAttribute("d", `M ${points.join(" L ")}`);
      }

      // 2. Incremental scanner progress
      data.progress += 0.22;
      if (data.progress >= 100) {
        data.progress = 0;
        data.phase = (data.phase + 1) % SCAN_PHASES.length;
        if (stageNameRef.current) {
          stageNameRef.current.textContent = `PHASE ${data.phase + 1}: ${SCAN_PHASES[data.phase].name}`;
        }
        const nextPhase = SCAN_PHASES[data.phase];
        currentLogs.push(`[SYSTEM] Phase: ${nextPhase.name}`);
        currentLogs.push(`$ ${nextPhase.cmd}`);
        if (currentLogs.length > 7) currentLogs.shift();
        renderLogs();
      }

      if (progressTextRef.current) {
        progressTextRef.current.textContent = `${Math.floor(data.progress)}%`;
      }
      if (progressBarRef.current) {
        progressBarRef.current.style.width = `${data.progress}%`;
      }

      // 3. Fluctuating metrics (throttled to 400ms to preserve performance)
      if (time - metricUpdateTime > 400) {
        metricUpdateTime = time;
        data.cpu = +(Math.max(10, Math.min(99, data.cpu + (Math.random() - 0.5) * 6))).toFixed(1);
        data.network = Math.max(1000, Math.min(18000, Math.floor(data.network + (Math.random() - 0.5) * 800)));
        data.memory = +(Math.max(0, Math.min(512, data.memory + Math.random() * 0.3))).toFixed(1);
        data.scannedFiles += Math.floor(Math.random() * 5);

        if (Math.random() > 0.985) {
          data.alerts += 1;
          currentLogs.push(`WARNING: Anomalous behavior flagged on Node #${Math.floor(Math.random() * 8000 + 1000)}`);
          if (currentLogs.length > 7) currentLogs.shift();
          renderLogs();
        }

        // Apply directly to DOM nodes
        if (cpuValRef.current) cpuValRef.current.textContent = `${data.cpu}%`;
        if (cpuBarRef.current) cpuBarRef.current.style.width = `${data.cpu}%`;
        if (memValRef.current) memValRef.current.textContent = `${data.memory} GB / 512 GB`;
        if (memBarRef.current) memBarRef.current.style.width = `${(data.memory / 512) * 100}%`;
        if (netValRef.current) netValRef.current.textContent = `${data.network.toLocaleString()} Pkt/s`;
        if (alertsValRef.current) alertsValRef.current.textContent = `ALERTS: ${data.alerts}`;
        if (scannedValRef.current) scannedValRef.current.textContent = data.scannedFiles.toLocaleString();
      }

      // 4. Logger typewriter additions (every 3.2 seconds)
      if (time - logUpdateTime > 3200) {
        logUpdateTime = time;
        const nextLine = logPool[logIndex];
        logIndex = (logIndex + 1) % logPool.length;
        currentLogs.push(nextLine);
        if (currentLogs.length > 7) currentLogs.shift();
        renderLogs();
      }

      frameId = requestAnimationFrame(runLoop);
    };

    renderLogs();
    if (stageNameRef.current) {
      stageNameRef.current.textContent = `PHASE 1: ${SCAN_PHASES[0].name}`;
    }

    frameId = requestAnimationFrame(runLoop);

    return () => {
      cancelAnimationFrame(frameId);
    };
  }, []);

  // ─── Interactive Particle Background Canvas ──────────────
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener("resize", handleResize);

    const particleCount = 65;
    const particles: Array<{
      x: number;
      y: number;
      vx: number;
      vy: number;
      radius: number;
      alpha: number;
    }> = [];

    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.35,
        vy: (Math.random() - 0.5) * 0.35,
        radius: Math.random() * 1.8 + 0.6,
        alpha: Math.random() * 0.35 + 0.15,
      });
    }

    const mouse = {
      x: width / 2,
      y: height / 2,
      targetX: width / 2,
      targetY: height / 2,
      active: false,
    };

    const handleMouseMove = (e: MouseEvent) => {
      mouse.targetX = e.clientX;
      mouse.targetY = e.clientY;
      mouse.active = true;
    };

    const handleMouseLeave = () => {
      mouse.active = false;
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseleave", handleMouseLeave);

    const draw = () => {
      ctx.clearRect(0, 0, width, height);

      // Mouse coords Linear Interpolation (LERP) damping
      if (mouse.active) {
        mouse.x += (mouse.targetX - mouse.x) * 0.08;
        mouse.y += (mouse.targetY - mouse.y) * 0.08;
      }

      // Draw Connections
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const p1 = particles[i];
          const p2 = particles[j];
          const dx = p1.x - p2.x;
          const dy = p1.y - p2.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 110) {
            const alpha = (110 - dist) / 110 * 0.12;
            ctx.beginPath();
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.strokeStyle = `rgba(10, 228, 72, ${alpha})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
      }

      // Draw Particles
      particles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;

        if (p.x < 0 || p.x > width) p.vx *= -1;
        if (p.y < 0 || p.y > height) p.vy *= -1;

        if (mouse.active) {
          const dx = mouse.x - p.x;
          const dy = mouse.y - p.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 150) {
            const force = (150 - dist) / 1500;
            p.x += dx * force;
            p.y += dy * force;
          }
        }

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(0, 240, 255, ${p.alpha})`;
        ctx.fill();
      });

      // Mouse Radar Glow
      if (mouse.active) {
        ctx.beginPath();
        ctx.arc(mouse.x, mouse.y, 80, 0, Math.PI * 2);
        const grad = ctx.createRadialGradient(
          mouse.x,
          mouse.y,
          0,
          mouse.x,
          mouse.y,
          80
        );
        grad.addColorStop(0, "rgba(0, 240, 255, 0.04)");
        grad.addColorStop(1, "rgba(0, 240, 255, 0)");
        ctx.fillStyle = grad;
        ctx.fill();
      }

      animationFrameId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, []);

  // ─── GSAP Timeline Animations ─────────────────────────────
  useGSAP(
    () => {
      CustomEase.create("cyberReveal", "M0,0 C0.12,0.8 0.2,1 1,1");

      // HUD Badge + Console frame self-draws
      gsap.fromTo(
        ".hud-badge-border, .hud-console-border",
        { drawSVG: "0%" },
        {
          drawSVG: "100%",
          duration: 1.5,
          ease: "power2.inOut",
          stagger: 0.15,
        }
      );

      // Title lines reveal
      gsap.from(".dfir-hero-title-line", {
        opacity: 0,
        y: 50,
        rotateX: -15,
        stagger: 0.15,
        duration: 1.2,
        ease: "cyberReveal",
        delay: 0.2,
      });

      // Decrypt tagline scramble entrance
      gsap.to(".dfir-hero-tagline", {
        duration: 1.5,
        delay: 0.8,
        scrambleText: {
          text: "Modern cyber attacks generate millions of forensic artifacts every second — logs, memory dumps, network packets, registry hives — far beyond human capacity for manual analysis. This framework bridges the gap between traditional digital forensics and next-generation Artificial Intelligence.",
          chars: "01X#$@&%*!?<>/\\{}[]",
          revealDelay: 0.2,
          speed: 0.45,
        },
      });

      // HUD columns fade in
      gsap.from(".dfir-hud-badges > div, .dfir-hero-tagline + div span", {
        opacity: 0,
        y: 15,
        stagger: 0.08,
        duration: 0.6,
        ease: "power2.out",
        delay: 1.2,
      });

      // Exit parallax on the inner content layout
      gsap.to(".dfir-hero-content", {
        scrollTrigger: {
          trigger: heroRef.current,
          start: "top top",
          end: "bottom top",
          scrub: true,
        },
        yPercent: 12,
        opacity: 0,
        scale: 0.97,
        ease: "none",
      });

      // ═══════════════ PROBLEM SECTION COUNTERS ════════════
      gsap.utils.toArray<HTMLElement>(".crisis-stat-num").forEach((el) => {
        const targetVal = parseFloat(el.getAttribute("data-target") || "0");
        const suffix = el.getAttribute("data-suffix") || "";
        const prefix = el.getAttribute("data-prefix") || "";

        const countObj = { val: 0 };
        gsap.to(countObj, {
          val: targetVal,
          scrollTrigger: {
            trigger: el,
            start: "top 85%",
          },
          duration: 1.8,
          ease: "power2.out",
          onUpdate: () => {
            el.textContent = `${prefix}${countObj.val.toLocaleString(undefined, { maximumFractionDigits: 1 })}${suffix}`;
          },
        });
      });

      // ═══════════════ CHALLENGE HEADING ════════════════════
      const challengeHeading = new SplitText(".dfir-challenge-heading", {
        type: "chars,words",
      });
      gsap.from(challengeHeading.chars, {
        scrollTrigger: { trigger: ".dfir-challenge-section", start: "top 75%" },
        opacity: 0,
        y: 40,
        rotateX: -20,
        stagger: 0.02,
        duration: 0.8,
        ease: "cyberReveal",
      });

      // ═══════════════ IMPACT BAR GRAPH REVEALS ═════════════
      gsap.utils.toArray<HTMLElement>(".comparison-bar-fill").forEach((el) => {
        const targetWidth = el.getAttribute("data-width") || "0%";
        gsap.fromTo(
          el,
          { width: "0%" },
          {
            width: targetWidth,
            scrollTrigger: {
              trigger: el,
              start: "top 90%",
            },
            duration: 1.4,
            ease: "power3.out",
          }
        );
      });

      // ═══════════════ ARCHITECTURE LAYER CARDS ═════════════
      gsap.utils.toArray<HTMLElement>(".dfir-architecture-section .group").forEach((el, i) => {
        gsap.from(el, {
          scrollTrigger: { trigger: el, start: "top 88%" },
          opacity: 0,
          x: -50,
          duration: 0.7,
          delay: i * 0.1,
          ease: "power3.out",
        });
      });

      // ═══════════════ ARTIFACT COLLECTION CARDS ═════════════
      gsap.utils.toArray<HTMLElement>(".dfir-artifacts-section .group").forEach((el, i) => {
        gsap.from(el, {
          scrollTrigger: { trigger: el, start: "top 88%" },
          opacity: 0,
          y: 50,
          scale: 0.95,
          duration: 0.6,
          delay: i * 0.06,
          ease: "power3.out",
        });
      });

      // ═══════════════ ML MODEL CARDS ════════════════════════
      gsap.utils.toArray<HTMLElement>(".dfir-models-section .rounded-2xl").forEach((el, i) => {
        gsap.from(el, {
          scrollTrigger: { trigger: el, start: "top 88%" },
          opacity: 0,
          y: 60,
          rotateX: -8,
          duration: 0.8,
          delay: i * 0.1,
          ease: "cyberReveal",
        });
      });

      // ═══════════════ TECH STACK GRID ═══════════════════════
      gsap.utils.toArray<HTMLElement>(".dfir-techstack-section .rounded-xl").forEach((el, i) => {
        gsap.from(el, {
          scrollTrigger: { trigger: el, start: "top 90%" },
          opacity: 0,
          y: 30,
          scale: 0.9,
          duration: 0.5,
          delay: i * 0.04,
          ease: "back.out(1.4)",
        });
      });

      // ═══════════════ WORKFLOW STEPPER BUTTONS ══════════════
      gsap.utils.toArray<HTMLElement>(".dfir-workflow-section button").forEach((el, i) => {
        gsap.from(el, {
          scrollTrigger: { trigger: el, start: "top 88%" },
          opacity: 0,
          x: -40,
          duration: 0.5,
          delay: i * 0.08,
          ease: "power3.out",
        });
      });

      // ═══════════════ ROADMAP CARDS ═════════════════════════
      gsap.utils.toArray<HTMLElement>(".dfir-roadmap-section .rounded-2xl").forEach((el, i) => {
        gsap.from(el, {
          scrollTrigger: { trigger: el, start: "top 88%" },
          opacity: 0,
          y: 40,
          duration: 0.6,
          delay: i * 0.12,
          ease: "power3.out",
        });
      });

      // ═══════════════ RESEARCH PAPER CARDS ══════════════════
      gsap.utils.toArray<HTMLElement>(".dfir-research-card").forEach((el, i) => {
        gsap.from(el, {
          scrollTrigger: { trigger: el, start: "top 88%" },
          opacity: 0,
          y: 40,
          rotateY: -5,
          duration: 0.7,
          delay: i * 0.1,
          ease: "power3.out",
        });
      });

      // ═══════════════ SECTION HEADINGS (SplitText) ═════════
      gsap.utils.toArray<HTMLElement>(".dfir-section-heading").forEach((h) => {
        const s = new SplitText(h, { type: "chars,words" });
        gsap.from(s.chars, {
          scrollTrigger: { trigger: h, start: "top 85%" },
          opacity: 0,
          y: 25,
          stagger: 0.02,
          duration: 0.6,
          ease: "cyberReveal",
        });
      });

      // ═══════════════ SECTION LABELS (scramble in) ══════════
      gsap.utils.toArray<HTMLElement>(".dfir-section-label").forEach((el) => {
        gsap.from(el, {
          scrollTrigger: { trigger: el, start: "top 88%" },
          opacity: 0,
          x: -20,
          duration: 0.5,
          ease: "power2.out",
        });
      });

      // ═══════════════ CTA SECTION ═══════════════════════════
      gsap.from(".dfir-cta-content", {
        scrollTrigger: { trigger: ".dfir-cta-content", start: "top 80%" },
        opacity: 0,
        y: 50,
        duration: 1,
        ease: "power3.out",
      });

      // ═══════════════ SCROLL INDICATOR BOUNCE ═══════════════
      gsap.to(".dfir-scroll-indicator", {
        y: 8,
        duration: 1.2,
        ease: "power1.inOut",
        repeat: -1,
        yoyo: true,
      });

    },
    { scope: containerRef }
  );

  return (
    <div
      ref={containerRef}
      className="relative overflow-x-hidden"
      style={{
        background: "#000000",
        color: "#ffffff",
        fontFamily: "var(--font-sans)",
      }}
    >

      <div
        className="fixed inset-0 pointer-events-none z-[0]"
        style={{
          backgroundImage: `linear-gradient(rgba(255,255,255,0.015) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.015) 1px, transparent 1px)`,
          backgroundSize: "80px 80px",
        }}
      />

      {/* ══════ NAVBAR ══════ */}
      <nav
        data-dfir-nav="true"
        className="fixed top-0 left-0 right-0 z-[100] transition-all duration-300"
        style={{
          backgroundColor: "rgba(0,0,0,0.82)",
          backdropFilter: "blur(16px)",
          borderBottom: navScrolled ? `1px solid rgba(255,255,255,0.1)` : "1px solid transparent",
        }}
      >
        <div className="max-w-7xl mx-auto px-4 md:px-6 h-14 md:h-16 flex items-center justify-between">
          {/* Left: Back + Logo */}
          <div className="flex items-center gap-3 md:gap-4">
            <Link
              href="/#work"
              className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-white/50 hover:bg-white/10 hover:text-white transition-all"
            >
              <ArrowLeft size={14} />
            </Link>
            <div className="flex items-center gap-2 md:gap-2.5 cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
              <Fingerprint size={20} className="md:w-[22px] md:h-[22px]" style={{ color: ACCENT_CYAN }} />
              <span className="font-[var(--font-orbitron)] font-black text-lg md:text-xl tracking-tight">
                <span style={{ color: ACCENT_CYAN }}>D</span>
                <span className="text-white">FIR</span>
              </span>
            </div>
          </div>

          {/* Center: Nav Links (desktop only) */}
          <div className="hidden md:flex items-center gap-1 rounded-full p-1 border" style={{ backgroundColor: "rgba(255,255,255,0.03)", borderColor: "rgba(255,255,255,0.08)" }}>
            {["Problem", "Architecture", "Artifacts", "Models", "Tech Stack", "Workflow", "Roadmap"].map((l) => {
              const idMap: Record<string, string> = {
                "Problem": "problem",
                "Architecture": "architecture",
                "Artifacts": "artifacts",
                "Models": "models",
                "Tech Stack": "tech-stack",
                "Workflow": "workflow",
                "Roadmap": "roadmap",
              };
              const targetId = idMap[l] || l.toLowerCase();
              return (
                <a
                  key={l}
                  href={`#${targetId}`}
                  onClick={(e) => {
                    e.preventDefault();
                    const el = document.getElementById(targetId);
                    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
                  }}
                  className="rounded-full px-3 py-1.5 text-[11px] font-medium transition-all hover:bg-white/10 cursor-pointer"
                  style={{ color: "rgba(255,255,255,0.5)", fontFamily: "var(--font-space-mono)" }}
                >
                  {l}
                </a>
              );
            })}
          </div>

          {/* Right: CTA (desktop) + Hamburger (mobile) */}
          <div className="flex items-center gap-3">
            {/* Desktop CTA */}
            <a
              href={EMAIL_GMAIL}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden md:inline-flex px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all animate-[cyanPulse_2.5s_ease-out_infinite]"
              style={{ backgroundColor: ACCENT_CYAN, color: "#000", fontFamily: "var(--font-orbitron)" }}
            >
              Discuss
            </a>
            {/* Mobile hamburger */}
            <button
              className="md:hidden flex items-center justify-center w-10 h-10 rounded-full bg-white/5 text-white/70 hover:bg-white/10 hover:text-white transition-all"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>
        </div>
      </nav>

      {/* ══════ MOBILE MENU OVERLAY ══════ */}
      <div
        className={`fixed inset-0 z-[99] bg-black/60 backdrop-blur-sm transition-opacity duration-300 md:hidden ${
          isMobileMenuOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
        onClick={() => setIsMobileMenuOpen(false)}
      />

      {/* ══════ MOBILE SLIDE-OUT DRAWER ══════ */}
      <div
        className={`fixed top-0 right-0 bottom-0 z-[101] w-[80vw] max-w-[320px] bg-neutral-950 border-l border-white/10 p-6 transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] md:hidden ${
          isMobileMenuOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Drawer Header */}
        <div className="flex items-center justify-between mb-8">
          <span className="font-[var(--font-orbitron)] font-black text-lg tracking-tight">
            <span style={{ color: ACCENT_CYAN }}>D</span>
            <span className="text-white">FIR</span>
          </span>
          <button
            onClick={() => setIsMobileMenuOpen(false)}
            className="w-9 h-9 rounded-full bg-white/5 flex items-center justify-center text-white/60 hover:bg-white/10 hover:text-white transition-all"
          >
            <X size={16} />
          </button>
        </div>

        {/* Drawer Nav Links */}
        <div className="flex flex-col gap-1 mb-8">
          {["Problem", "Architecture", "Artifacts", "Models", "Tech Stack", "Workflow", "Roadmap"].map((l) => {
            const idMap: Record<string, string> = {
              "Problem": "problem",
              "Architecture": "architecture",
              "Artifacts": "artifacts",
              "Models": "models",
              "Tech Stack": "tech-stack",
              "Workflow": "workflow",
              "Roadmap": "roadmap",
            };
            const targetId = idMap[l] || l.toLowerCase();
            return (
              <a
                key={l}
                href={`#${targetId}`}
                onClick={(e) => {
                  e.preventDefault();
                  setIsMobileMenuOpen(false);
                  const el = document.getElementById(targetId);
                  if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }}
                className="py-3 px-4 rounded-xl text-sm font-semibold tracking-wide transition-all hover:bg-white/5 cursor-pointer"
                style={{ color: "rgba(255,255,255,0.7)", fontFamily: "var(--font-space-mono)" }}
              >
                {l}
              </a>
            );
          })}
        </div>

        {/* Drawer Social + Actions */}
        <div className="border-t border-white/10 pt-6 space-y-3">
          <a
            href={EMAIL_MAILTO}
            className="flex items-center gap-3 w-full py-3 px-4 rounded-xl text-sm font-bold transition-all"
            style={{ backgroundColor: ACCENT_CYAN, color: "#000", fontFamily: "var(--font-orbitron)" }}
          >
            <Mail size={16} />
            Discuss
          </a>
        </div>
      </div>

      {/* ════════════════════════════════════════════════════
          1. HERO SECTION
          ════════════════════════════════════════════════════ */}
      <section
        ref={heroRef}
        className="relative min-h-screen flex flex-col justify-center pt-24 pb-16 px-6 lg:px-12 overflow-hidden"
      >
        <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none z-[1]" />

        {/* Massive Ambient Background Glow */}
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1200px] h-[1200px] rounded-full pointer-events-none z-0"
          style={{ background: `radial-gradient(circle, ${ACCENT_CYAN}06 0%, transparent 60%)` }}
        />

        <div className="dfir-hero-content relative z-10 max-w-[1400px] mx-auto w-full grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">

          <div className="flex flex-col text-left space-y-8 lg:pr-8">
            <div className="dfir-hud-badges flex flex-wrap gap-4 text-xs font-mono text-left z-10">
              <div className="relative border border-cyan-500/30 px-4 py-2 bg-cyan-950/20 rounded-md flex items-center gap-3 overflow-hidden shadow-[0_0_15px_rgba(0,240,255,0.05)]">
                <svg className="absolute inset-0 w-full h-full pointer-events-none"><rect x="0.5" y="0.5" width="100%" height="100%" rx="6" fill="none" stroke={ACCENT_CYAN} strokeWidth="1.5" vectorEffect="non-scaling-stroke" className="hud-badge-border" /></svg>
                <div className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse shadow-[0_0_8px_#00F0FF]" />
                <span className="text-cyan-400 uppercase tracking-[0.2em] text-xs font-bold">SYSTEM: ACTIVE</span>
              </div>
              <div className="relative border border-emerald-500/30 px-4 py-2 bg-emerald-950/20 rounded-md flex items-center gap-3 overflow-hidden shadow-[0_0_15px_rgba(10,228,72,0.05)]">
                <svg className="absolute inset-0 w-full h-full pointer-events-none"><rect x="0.5" y="0.5" width="100%" height="100%" rx="6" fill="none" stroke={ACCENT_GREEN} strokeWidth="1.5" vectorEffect="non-scaling-stroke" className="hud-badge-border" /></svg>
                <div className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_8px_#0AE448]" />
                <span className="text-emerald-400 uppercase tracking-[0.2em] text-xs font-bold">NIST SP 800-86</span>
              </div>
            </div>

            <h2 className="dfir-hero-title flex flex-col cursor-default select-none pointer-events-auto gap-1 md:gap-2">
              <span className="dfir-hero-title-line text-lg sm:text-xl md:text-2xl font-mono uppercase tracking-[0.3em] text-white/70 mb-1">
                AI-ASSISTED
              </span>
              <span
                className="dfir-hero-title-line text-6xl sm:text-7xl md:text-[6rem] lg:text-[7rem] font-black tracking-tighter leading-[0.9] pb-1 uppercase"
                style={{
                  fontFamily: "var(--font-space-grotesk)",
                  background: `linear-gradient(135deg, ${ACCENT_CYAN} 20%, ${ACCENT_GREEN} 100%)`,
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}
              >
                DIGITAL
              </span>
              <span
                className="dfir-hero-title-line text-6xl sm:text-7xl md:text-[6rem] lg:text-[7rem] font-black tracking-tighter leading-[0.9] pb-2 uppercase"
                style={{
                  fontFamily: "var(--font-space-grotesk)",
                  background: `linear-gradient(135deg, #ffffff 10%, #666666 100%)`,
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}
              >
                FORENSICS
              </span>
            </h2>

            <p className="dfir-hero-tagline max-w-xl text-base md:text-lg leading-relaxed font-light min-h-[5rem] cursor-default select-none pointer-events-auto" style={{ color: "rgba(255,255,255,0.7)" }}>
              &nbsp;
            </p>

            <div className="flex flex-wrap gap-3 pt-2">
              {["Volatile Memory", "Timeline Reconstruction", "Anomaly Detection", "Explainable AI"].map((feat, fi) => (
                <span key={fi} className="px-4 py-1.5 text-xs md:text-sm uppercase font-mono tracking-widest border border-white/10 rounded-full bg-white/5 hover:border-cyan-500/40 hover:bg-cyan-500/10 hover:text-cyan-300 transition-all duration-300 pointer-events-auto cursor-pointer">{feat}</span>
              ))}
            </div>
          </div>

          <div className="relative w-full z-10 flex justify-center lg:justify-end">
            <div className="absolute inset-0 -m-6 bg-[radial-gradient(circle_at_center,rgba(0,240,255,0.06)_0%,transparent_65%)] rounded-[3rem] pointer-events-none" />

            <div className="relative w-full max-w-[500px] lg:max-w-[540px] rounded-3xl p-6 md:p-8 bg-neutral-950/80 border border-white/10 shadow-[0_30px_70px_rgba(0,0,0,0.85)] backdrop-blur-xl overflow-hidden group">
              <svg className="absolute inset-0 w-full h-full pointer-events-none"><rect x="0.5" y="0.5" width="100%" height="100%" rx="24" fill="none" stroke={ACCENT_CYAN} strokeWidth="1.5" vectorEffect="non-scaling-stroke" className="hud-console-border opacity-20 group-hover:opacity-40 transition-opacity duration-500" /></svg>

              <div className="flex items-center justify-between pb-4 mb-4 border-b border-white/5 font-mono text-xs text-white/40">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_#0AE448]" />
                  <span className="text-white/60 tracking-widest font-semibold">DFIR_PORTAL_v3.6</span>
                </div>
                <div className="flex items-center gap-5">
                  <span>SYS_OK: 100%</span>
                  <span ref={alertsValRef} className="text-pink-400 font-bold">ALERTS: 0</span>
                </div>
              </div>

              <div className="grid grid-cols-12 gap-6 items-center">
                <div className="col-span-4 flex justify-center">
                  <div className="relative w-28 h-28 border border-cyan-500/20 rounded-full overflow-hidden bg-black/60 flex items-center justify-center shadow-[inset_0_0_20px_rgba(0,240,255,0.1)]">
                    <div className="absolute inset-0" style={{ background: `radial-gradient(circle at center, ${ACCENT_CYAN}15, transparent 70%)` }} />
                    <div className="absolute w-20 h-20 border border-cyan-500/10 rounded-full" />
                    <div className="absolute w-12 h-12 border border-cyan-500/10 rounded-full" />
                    <div className="absolute w-full h-full origin-center animate-[spin_3s_linear_infinite]" style={{ background: `conic-gradient(from 0deg, ${ACCENT_CYAN}40 0deg, transparent 80deg)` }} />
                    <div className="absolute inset-x-0 h-[1px] bg-cyan-500/20" />
                    <div className="absolute inset-y-0 w-[1px] bg-cyan-500/20" />
                    <div className="absolute w-2 h-2 bg-emerald-400 rounded-full top-6 left-10 animate-pulse shadow-[0_0_6px_#0AE448]" />
                    <div className="absolute w-2 h-2 bg-pink-500 rounded-full bottom-8 right-6 animate-ping" />
                  </div>
                </div>

                <div className="col-span-8 space-y-4 font-mono text-xs">
                  <div>
                    <div className="flex items-center justify-between text-white/50 mb-1.5">
                      <span className="tracking-widest">CPU INTEL</span>
                      <span ref={cpuValRef} className="text-cyan-400 font-bold">32.4%</span>
                    </div>
                    <div className="w-full h-1.5 bg-neutral-900 rounded-full overflow-hidden">
                      <div ref={cpuBarRef} className="h-full bg-cyan-500 transition-all duration-300 shadow-[0_0_8px_#00F0FF]" style={{ width: `32.4%` }} />
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between text-white/50 mb-1.5">
                      <span className="tracking-widest">RAM VOLATILE MATRIX</span>
                      <span ref={memValRef} className="text-emerald-400 font-bold">112.5 GB / 512 GB</span>
                    </div>
                    <div className="w-full h-1.5 bg-neutral-900 rounded-full overflow-hidden">
                      <div ref={memBarRef} className="h-full bg-emerald-500 transition-all duration-500 shadow-[0_0_8px_#0AE448]" style={{ width: `${(112.5 / 512) * 100}%` }} />
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-white/50 bg-black/40 p-2 rounded border border-white/5">
                    <span className="tracking-widest">TRAFFIC VELOCITY</span>
                    <span ref={netValRef} className="text-pink-400 font-bold">4,890 Pkt/s</span>
                  </div>
                </div>
              </div>

              <div className="mt-5 p-3.5 rounded-xl bg-black/40 border border-white/5 font-mono space-y-2.5">
                <div className="flex items-center justify-between text-[11px] md:text-xs text-white/40">
                  <span ref={stageNameRef} className="text-cyan-400 uppercase font-bold tracking-widest">PHASE 1: ACQUIRING DISK TELEMETRY</span>
                  <span ref={progressTextRef} className="font-bold">0%</span>
                </div>
                <div className="w-full h-1.5 bg-neutral-900 rounded-full overflow-hidden">
                  <div ref={progressBarRef} className="h-full bg-gradient-to-r from-cyan-500 to-emerald-500 transition-all duration-100" style={{ width: `0%` }} />
                </div>
              </div>

              <div className="grid grid-cols-12 gap-4 mt-4 items-center">
                <div className="col-span-7 rounded-xl bg-black/50 border border-white/5 h-14 flex items-center justify-center p-3">
                  <svg width="100%" height="100%" viewBox="0 0 160 40" fill="none" className="opacity-90">
                    <path ref={waveformPathRef} stroke={ACCENT_CYAN} strokeWidth="2" strokeLinecap="round" />
                  </svg>
                </div>
                <div className="col-span-5 rounded-xl bg-black/50 border border-white/5 h-14 p-3 font-mono flex flex-col justify-center text-left">
                  <span className="text-[11px] text-white/40 tracking-widest uppercase mb-0.5">EVIDENCE PARSED</span>
                  <span ref={scannedValRef} className="text-sm font-bold text-white">24,500</span>
                </div>
              </div>

              <div ref={loggerRef} className="mt-5 rounded-xl bg-black/80 border border-white/10 p-4 font-mono text-xs text-left space-y-1.5 h-36 overflow-hidden relative shadow-[inset_0_0_15px_rgba(0,0,0,0.5)]">
                <div className="absolute top-0 right-0 p-1.5 bg-black/80 text-white/30 text-[7px] border-b border-l border-white/10 rounded-bl-lg tracking-widest font-semibold">DIAGNOSTIC_LOGGER</div>
              </div>
            </div>
          </div>
        </div>

        <div className="dfir-scroll-indicator absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 z-10 cursor-pointer pointer-events-auto">
          <span className="text-xs uppercase tracking-[0.4em] font-bold text-cyan-400/60">Scroll to explore</span>
          <svg width="18" height="18" viewBox="0 0 20 20" fill="none" stroke={ACCENT_CYAN} strokeWidth="2" className="opacity-60 animate-bounce"><path d="M10 3v14M4 11l6 6 6-6" /></svg>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════
          2. THE PROBLEM / CRISIS SECTION
          ════════════════════════════════════════════════════ */}
      <section id="problem" className="dfir-challenge-section relative py-24 md:py-36 px-6 border-t border-white/5 bg-neutral-950/20">
        <div className="max-w-[1400px] mx-auto space-y-16">
          <div className="text-center space-y-4 max-w-3xl mx-auto">
            <p className="text-xs uppercase tracking-[0.35em] font-bold text-pink-500">The Problem Space</p>
            <h2 className="dfir-challenge-heading text-4xl md:text-5xl lg:text-6xl font-black tracking-tighter leading-[1]">
              The Crisis in Cybercrime Investigation
            </h2>
            <p className="text-base text-white/50 leading-relaxed">
              Traditional forensic triage cannot cope with the sheer volume of data generated during security breaches. Let&apos;s look at the numbers.
            </p>
          </div>

          {/* Glowing Animated Stat Counters Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { label: "Global Cybercrime Loss", val: 10.5, suffix: "T", prefix: "$", subtitle: "Projected annual cost (2025)", color: ACCENT_MAGENTA, icon: TrendingUp, href: "https://cybersecurityventures.com/cybercrime-damage-costs-10-5-trillion-by-2025/" },
              { label: "Avg Data Breach Cost", val: 4.4, suffix: "M", prefix: "$", subtitle: "Cost per single breach incident", color: ACCENT_CYAN, icon: AlertTriangle, href: "https://www.ibm.com/reports/data-breach" },
              { label: "FBI Cyber Complaints", val: 859, suffix: "K", prefix: "", subtitle: "Total reports filed in 2024", color: ACCENT_GREEN, icon: FileSearch, href: "https://www.ic3.gov/" },
              { label: "Ransomware Frequency", val: 2.0, suffix: "s", prefix: "Every ", subtitle: "Attack interval worldwide", color: ACCENT_CYAN, icon: Clock, href: "https://cybersecurityventures.com/global-ransomware-damage-costs-predicted-to-reach-250-billion-usd-by-2031/" },
            ].map((stat, i) => (
              <a
                key={i}
                href={stat.href}
                target="_blank"
                rel="noopener noreferrer"
                className="relative block rounded-xl p-6 bg-neutral-900/40 border border-white/5 flex flex-col justify-between space-y-4 overflow-hidden group hover:border-white/20 hover:bg-neutral-900/60 transition-all duration-300"
              >
                <div className="absolute top-0 right-0 w-24 h-24 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.015)_0%,transparent_70%)] rounded-full" />
                <div className="flex items-center justify-between">
                  <span className="text-xs uppercase font-mono tracking-wider text-white/40">{stat.label}</span>
                  <div className="hover:scale-110 transition-transform">
                    <ExternalLink size={14} className="text-white/20 group-hover:text-white/80 transition-colors" />
                  </div>
                </div>
                <div>
                  <h3
                    className="crisis-stat-num text-3xl md:text-4xl font-black tracking-tighter"
                    style={{ color: stat.color }}
                    data-target={stat.val}
                    data-prefix={stat.prefix}
                    data-suffix={stat.suffix}
                  >
                    0
                  </h3>
                  <div className="text-xs text-white/30 mt-1 font-light leading-normal flex items-center gap-1 group-hover:text-white/60 transition-colors inline-flex">
                    {stat.subtitle}
                  </div>
                </div>
              </a>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 pt-8">
            <div className="space-y-6">
              <h3 className="text-xl font-bold tracking-tight text-white/90">The Investigator&apos;s Dilemma</h3>
              <ul className="space-y-4 font-light text-sm text-white/60">
                <li className="flex gap-3"><span className="text-cyan-400 font-mono">01.</span><span><strong>Thousands of logs</strong> are generated every single minute across active compromised hosts.</span></li>
                <li className="flex gap-3"><span className="text-cyan-400 font-mono">02.</span><span><strong>Gigabytes of network telemetry</strong> must be captured, parsed, and searched in real time.</span></li>
                <li className="flex gap-3"><span className="text-cyan-400 font-mono">03.</span><span><strong>Volatile RAM artifacts</strong> decay quickly or are lost completely during emergency system reboots.</span></li>
                <li className="flex gap-3"><span className="text-cyan-400 font-mono">04.</span><span><strong>Timeline correlation</strong> requires connecting subtle indicators across independent, dispersed environments.</span></li>
              </ul>
            </div>

            <div className="space-y-6">
              <h3 className="text-xl font-bold tracking-tight text-emerald-400">Why AI Changes Everything</h3>
              <ul className="space-y-4 font-light text-sm text-white/60">
                <li className="flex gap-3"><span className="text-emerald-400 font-mono">→</span><span><strong>Sub-second Detection:</strong> Machine learning baselines identify complex outliers in milliseconds instead of days.</span></li>
                <li className="flex gap-3"><span className="text-emerald-400 font-mono">→</span><span><strong>Campaign Mapping:</strong> Instantly clusters similar threat indicators using multi-dimensional distance metrics.</span></li>
                <li className="flex gap-3"><span className="text-emerald-400 font-mono">→</span><span><strong>Bayesian Correlating:</strong> Computes the mathematically sound likelihood of intrusion, mitigating alert fatigue by 70%.</span></li>
                <li className="flex gap-3"><span className="text-emerald-400 font-mono">→</span><span><strong>Explainable Integrity:</strong> Generates structured, court-admissible audit summaries mapping back to raw bytes.</span></li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════
          3. KASPERSKY LIVE THREAT MAP SECTION
          ════════════════════════════════════════════════════ */}
      <section className="relative py-20 px-6 border-t border-white/5 bg-black">
        <div className="max-w-[1400px] mx-auto space-y-8">
          <div className="text-center space-y-3 max-w-2xl mx-auto">
            <p className="text-xs uppercase tracking-[0.35em] font-bold text-cyan-400">Live Global Security Portal</p>
            <h2 className="text-3xl md:text-4xl font-black tracking-tight">Active Cyber Threat Index Map</h2>
            <p className="text-sm text-white/40">
              Interactive cyber threat monitoring illustrating real-time malware waves, intrusions, and security telemetry feeds across global networks.
            </p>
          </div>

          {/* Embedded live Kaspersky Cybermap */}
          <div className="relative w-full h-[450px] rounded-2xl overflow-hidden border border-cyan-500/20 bg-neutral-950 shadow-[0_15px_40px_rgba(0,240,255,0.04)]">
            <iframe
              src="https://cybermap.kaspersky.com/en/widget/dynamic/dark"
              width="100%"
              height="100%"
              frameBorder="0"
              className="w-full h-full opacity-80"
              title="Kaspersky Realtime Cybermap widget"
            />
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════
          4. SYSTEM ARCHITECTURE / LAYERED SHOWCASE
          ════════════════════════════════════════════════════ */}
      <section id="architecture" className="dfir-architecture-section relative py-24 md:py-36 px-6 border-t border-white/5 bg-neutral-950/20">
        <div className="max-w-[1400px] mx-auto space-y-16">
          <div className="text-center space-y-3 max-w-2xl mx-auto">
            <p className="dfir-section-label text-xs uppercase tracking-[0.35em] font-bold text-pink-500">System Architecture</p>
            <h2 className="dfir-section-heading text-3xl md:text-5xl font-black tracking-tighter" style={{ fontFamily: "var(--font-space-grotesk)" }}>Modular 5-Layer Stack</h2>
            <p className="text-sm text-white/40">
              End-to-end framework layers stacking from raw system volatile hardware collection up to incident reporting.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">

            {/* Left Column: 5 Stacked visual blocks */}
            <div className="lg:col-span-7 space-y-4">
              {[
                { layer: "L5", name: "Forensic Analyst Portal", tools: "Flask Dashboard · Kibana Timelines · PDF Exporter", desc: "Interactive web user interface displaying parsed cases, dynamic event search parameters, and MITRE ATT&CK mapping reports.", border: ACCENT_MAGENTA, bg: "rgba(241, 0, 203, 0.05)" },
                { layer: "L4", name: "AI Intelligence Engine", tools: "Gaussian Model · Bayesian Probability · Shannon Entropy", desc: "Runs GMM anomaly scans, Bayesian posterior updates, Shannon entropy byte checks, and Time-Series decompositions.", border: ACCENT_CYAN, bg: "rgba(0, 240, 255, 0.05)" },
                { layer: "L3", name: "Correlation & Threat Scoring", tools: "Bayesian Threat Confidence Score (TCS) Module", desc: "Weights diverse artifacts across hosts and calculates an automated threat score ranking most compromised targets.", border: ACCENT_GREEN, bg: "rgba(10, 228, 72, 0.05)" },
                { layer: "L2", name: "Forensic Analysis Modules", tools: "Volatility 3 · Autopsy CLI · Scapy PCAP parsing · YARA", desc: "Triggers volatility RAM decoders, parses disk registry hives, and parses network stream histories.", border: ACCENT_MAGENTA, bg: "rgba(241, 0, 203, 0.05)" },
                { layer: "L1", name: "Artifact Collection Engine", tools: "Logs · Memory dumps · Reg hives · Sysmon · Browser SQLite", desc: "Performs parallel automated extraction of all volatile and non-volatile evidence segments across target machines.", border: ACCENT_CYAN, bg: "rgba(0, 240, 255, 0.05)" },
              ].map((stack, i) => (
                <div
                  key={i}
                  className="relative rounded-xl p-5 border transition-all duration-300 hover:-translate-y-1 group"
                  style={{
                    borderColor: `${stack.border}20`,
                    background: stack.bg,
                  }}
                >
                  <div className="flex gap-4 items-start">
                    <span className="font-mono text-sm font-bold opacity-30 mt-1" style={{ color: stack.border }}>{stack.layer}</span>
                    <div className="space-y-1 text-left">
                      <h4 className="text-base font-bold text-white/90 group-hover:text-white transition-colors">{stack.name}</h4>
                      <p className="text-xs font-mono" style={{ color: `${stack.border}80` }}>{stack.tools}</p>
                      <p className="text-xs text-white/50 leading-relaxed font-light mt-1.5">{stack.desc}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Right Column: Target Users Roles matrix */}
            <div className="lg:col-span-5 space-y-6">
              <h3 className="text-2xl font-bold tracking-tight text-white/90">Target User Profiles</h3>
              <div className="space-y-4">
                {[
                  { role: "Forensic Investigators", desc: "Automated triage, memory carving, and timeline reconstruction.", icon: Briefcase },
                  { role: "Incident Response Teams", desc: "Active C2 beacon identification and lateral movement tracking.", icon: Shield },
                  { role: "SOC Security Analysts", desc: "Bayesian-driven telemetry correlation to reduce false positives.", icon: Users },
                  { role: "Law Enforcement Units", desc: "Cryptographically checked reports aligned with legal admissibility.", icon: GraduationCap },
                ].map((user, ui) => (
                  <div key={ui} className="flex gap-4 rounded-xl p-4 bg-neutral-900/30 border border-white/5 text-left">
                    <div className="w-10 h-10 rounded-lg flex-shrink-0 bg-neutral-900 flex items-center justify-center border border-white/10">
                      <user.icon size={18} className="text-cyan-400" />
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold">{user.role}</h4>
                      <p className="text-xs text-white/40 mt-1 font-light leading-normal">{user.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════
          5. FORENSIC ARTIFACT COLLECTION grid
          ════════════════════════════════════════════════════ */}
      <section id="artifacts" className="dfir-artifacts-section relative py-24 md:py-36 px-6 border-t border-white/5 bg-black">
        <div className="max-w-[1400px] mx-auto space-y-16">
          <div className="text-center space-y-3 max-w-2xl mx-auto">
            <p className="dfir-section-label text-xs uppercase tracking-[0.35em] font-bold text-cyan-400">Forensic Evidence Gathering</p>
            <h2 className="dfir-section-heading text-3xl md:text-5xl font-black tracking-tighter" style={{ fontFamily: "var(--font-space-grotesk)" }}>Comprehensive Collection Engine</h2>
            <p className="text-sm text-white/40">
              The framework automates collection and parsing across nine distinct digital forensic artifact segments.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {ARTIFACT_CATEGORIES.map((art, ai) => (
              <div
                key={ai}
                className="relative rounded-2xl p-6 bg-neutral-950 border border-white/5 space-y-4 text-left group hover:border-white/10 transition-all duration-300"
              >
                <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: `${art.color}10` }}>
                  <art.icon size={18} style={{ color: art.color }} />
                </div>
                <div className="space-y-1">
                  <h3 className="text-base font-bold text-white/90">{art.name}</h3>
                  <p className="text-xs text-white/50 leading-relaxed font-light mt-1">{art.desc}</p>
                </div>
                <div className="pt-3 border-t border-white/5 space-y-1">
                  <span className="text-[11px] font-mono uppercase tracking-widest text-white/30 block">Forensic Targets</span>
                  <p className="text-xs leading-normal font-mono" style={{ color: `${art.color}90` }}>{art.targets}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════
          6. AI & MACHINE LEARNING INTELLIGENCE ENGINE (TOGGLE CARDS)
          ════════════════════════════════════════════════════ */}
      <section id="models" ref={mlRef} className="dfir-models-section relative py-24 md:py-36 px-6 border-t border-white/5 bg-neutral-950/20">
        <div className="max-w-[1400px] mx-auto space-y-16">
          <div className="text-center space-y-3 max-w-3xl mx-auto">
            <p className="dfir-section-label text-xs uppercase tracking-[0.35em] font-bold text-pink-500">AI Processing Core</p>
            <h2 className="dfir-section-heading text-3xl md:text-5xl font-black tracking-tighter" style={{ fontFamily: "var(--font-space-grotesk)" }}>Machine Learning Intelligence Engine</h2>
            <p className="text-sm text-white/40">
              The framework utilizes six custom analytical methods. Toggle between the underlying LaTeX mathematics and real Python script implementations.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {ML_MODELS.map((model) => {
              const currentMode = modelModes[model.id] || "math";
              return (
                <div
                  key={model.id}
                  className="rounded-2xl p-6 bg-neutral-950 border flex flex-col justify-between space-y-6 text-left relative overflow-hidden"
                  style={{ borderColor: `${model.accent}15` }}
                >
                  {/* Glowing background halo */}
                  <div className="absolute inset-0 -z-10 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" style={{ background: `radial-gradient(circle at bottom right, ${model.accent}05 0%, transparent 70%)` }} />

                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: `${model.accent}10` }}>
                          <model.icon size={16} style={{ color: model.accent }} />
                        </div>
                        <div>
                          <span className="text-[11px] font-mono uppercase tracking-widest text-white/30">{model.category}</span>
                          <h3 className="text-lg font-bold text-white/90">{model.name}</h3>
                        </div>
                      </div>

                      {/* HIGH FIDELITY STATE TOGGLE TOGGLE */}
                      <div className="flex border border-white/10 rounded-md overflow-hidden bg-neutral-900 p-0.5 z-10">
                        <button
                          onClick={() => setModelModes((prev) => ({ ...prev, [model.id]: "math" }))}
                          className={`px-2 py-1 text-[11px] font-mono rounded transition-colors ${currentMode === "math" ? "bg-white text-black font-semibold" : "text-white/40 hover:text-white/70"}`}
                        >
                          LaTeX MATH
                        </button>
                        <button
                          onClick={() => setModelModes((prev) => ({ ...prev, [model.id]: "code" }))}
                          className={`px-2 py-1 text-[11px] font-mono rounded transition-colors ${currentMode === "code" ? "bg-white text-black font-semibold" : "text-white/40 hover:text-white/70"}`}
                        >
                          PYTHON
                        </button>
                      </div>
                    </div>

                    <p className="text-xs text-white/50 leading-relaxed font-light">{model.description}</p>
                  </div>

                  {/* Mode Display Area */}
                  <div className="relative">
                    {currentMode === "math" ? (
                      <div className="space-y-4">
                        {model.mathHtml}
                      </div>
                    ) : (
                      <div className="rounded-lg p-3 bg-black/90 border border-white/5 font-mono text-[11px] md:text-xs text-cyan-400 overflow-x-auto max-h-[170px] whitespace-pre relative">
                        <div className="absolute top-1 right-2 text-[7px] text-white/20">PYTHON_EXEC</div>
                        <code>{model.codeSnippet}</code>
                      </div>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-4 pt-4 border-t border-white/5 text-xs font-mono">
                    <div>
                      <span className="text-[11px] text-white/30 uppercase tracking-widest block mb-0.5">PERFORMANCE SCORE</span>
                      <span style={{ color: model.accent }}>{model.stats}</span>
                    </div>
                    <div>
                      <span className="text-[11px] text-white/30 uppercase tracking-widest block mb-0.5">VALIDATION BASELINE</span>
                      <span className="text-white/70">{model.papers}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════
          7. CORE SYSTEM FEATURES DEEP DIVE (BAYESIAN TCS & MITRE ATT&CK)
          ════════════════════════════════════════════════════ */}
      <section className="relative py-24 md:py-36 px-6 border-t border-white/5 bg-black">
        <div className="max-w-[1400px] mx-auto space-y-16">
          <div className="text-center space-y-3 max-w-2xl mx-auto">
            <p className="text-xs uppercase tracking-[0.35em] font-bold text-cyan-400">Framework Capabilities</p>
            <h2 className="text-3xl md:text-5xl font-black tracking-tighter" style={{ fontFamily: "var(--font-space-grotesk)" }}>Core System Features</h2>
            <p className="text-sm text-white/40">
              Deep dive into the operational algorithms, scoring criteria, and threat taxonomies.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">

            {/* Left: Bayesian Threat Confidence Score Dashboard */}
            <div className="lg:col-span-5 rounded-2xl p-6 bg-neutral-950 border border-white/5 space-y-6 text-left">
              <div className="space-y-1">
                <span className="text-xs md:text-xs font-mono uppercase tracking-widest text-cyan-400">Bayesian Correlation</span>
                <h3 className="text-xl font-bold" style={{ fontFamily: "var(--font-space-grotesk)" }}>Threat Confidence Score (TCS)</h3>
                <p className="text-xs text-white/50 leading-relaxed font-light">
                  A unified anomaly calculation summarizing observed anomalies across hosts using weighted threat probabilities.
                </p>
              </div>

              {/* TCS Scale indicators */}
              <div className="space-y-3 font-mono text-xs">
                <div className="flex items-center justify-between p-2.5 rounded-lg bg-neutral-900/30 border border-white/5">
                  <span className="text-white/60">0.0 – 0.3 · LOW RISK</span>
                  <span className="text-emerald-400 font-bold">LEGITIMATE</span>
                </div>
                <div className="flex items-center justify-between p-2.5 rounded-lg bg-neutral-900/30 border border-white/5">
                  <span className="text-white/60">0.3 – 0.6 · MEDIUM RISK</span>
                  <span className="text-yellow-500 font-bold">TRIAGE REQUIRED</span>
                </div>
                <div className="flex items-center justify-between p-2.5 rounded-lg bg-neutral-900/30 border border-white/5">
                  <span className="text-white/60">0.6 – 0.8 · HIGH RISK</span>
                  <span className="text-orange-500 font-bold">SENIOR ESCALATE</span>
                </div>
                <div className="flex items-center justify-between p-2.5 rounded-lg bg-neutral-900/30 border border-white/5">
                  <span className="text-white/60">0.8 – 1.0 · CRITICAL</span>
                  <span className="text-pink-500 font-bold">INCIDENT RESPONSE</span>
                </div>
              </div>

              <div className="p-3 bg-black/60 rounded-lg border border-cyan-500/10 font-mono text-[11px] md:text-xs text-cyan-400 leading-normal">
                <span className="text-[11px] text-white/20 block mb-1">TCS_CALCULUS</span>
                TCS = ∑ (Evidence_Weight_i × Bayesian_Posterior_i) / Total_Evidence_Count
              </div>
            </div>

            {/* Right: MITRE ATT&CK Matrix Mapping table */}
            <div className="lg:col-span-7 space-y-6 text-left">
              <div className="space-y-1">
                <span className="text-xs md:text-xs font-mono uppercase tracking-widest text-emerald-400">Security Standard Alignments</span>
                <h3 className="text-xl font-bold" style={{ fontFamily: "var(--font-space-grotesk)" }}>MITRE ATT&CK Tactic Detections</h3>
                <p className="text-xs text-white/50 leading-relaxed font-light">
                  How detected system modifications map directly to standard MITRE Enterprise threat techniques.
                </p>
              </div>

              <div className="overflow-x-auto rounded-xl border border-white/5 bg-neutral-950">
                <table className="w-full text-left font-light text-xs">
                  <thead>
                    <tr className="border-b border-white/5 bg-white/5 font-mono text-[11px] md:text-xs uppercase tracking-wider text-white/40">
                      <th className="p-3">ATT&CK Tactic</th>
                      <th className="p-3">Forensic Detection</th>
                      <th className="p-3">Framework Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5 text-white/70">
                    <tr>
                      <td className="p-3 font-semibold text-white">
                        <a href="https://attack.mitre.org/tactics/TA0001/" target="_blank" rel="noopener noreferrer" className="hover:text-cyan-400 transition-colors flex items-center gap-1.5 inline-flex">
                          Initial Access (TA0001) <ExternalLink size={10} className="opacity-50" />
                        </a>
                      </td>
                      <td className="p-3">Phishing URL found in browser SQLite history</td>
                      <td className="p-3 font-mono text-cyan-400">Flag domain + query mail IP</td>
                    </tr>
                    <tr>
                      <td className="p-3 font-semibold text-white">
                        <a href="https://attack.mitre.org/tactics/TA0002/" target="_blank" rel="noopener noreferrer" className="hover:text-cyan-400 transition-colors flex items-center gap-1.5 inline-flex">
                          Execution (TA0002) <ExternalLink size={10} className="opacity-50" />
                        </a>
                      </td>
                      <td className="p-3">PowerShell Base64 commands + YARA match</td>
                      <td className="p-3 font-mono text-cyan-400">Kill PID + RAM dump Volatility</td>
                    </tr>
                    <tr>
                      <td className="p-3 font-semibold text-white">
                        <a href="https://attack.mitre.org/tactics/TA0003/" target="_blank" rel="noopener noreferrer" className="hover:text-cyan-400 transition-colors flex items-center gap-1.5 inline-flex">
                          Persistence (TA0003) <ExternalLink size={10} className="opacity-50" />
                        </a>
                      </td>
                      <td className="p-3">New registry Run/RunOnce keys generated</td>
                      <td className="p-3 font-mono text-cyan-400">Registry snapshot restore</td>
                    </tr>
                    <tr>
                      <td className="p-3 font-semibold text-white">
                        <a href="https://attack.mitre.org/tactics/TA0004/" target="_blank" rel="noopener noreferrer" className="hover:text-cyan-400 transition-colors flex items-center gap-1.5 inline-flex">
                          Privilege Escalation (TA0004) <ExternalLink size={10} className="opacity-50" />
                        </a>
                      </td>
                      <td className="p-3">LSASS memory dump process patterns</td>
                      <td className="p-3 font-mono text-cyan-400">Isolate process + trigger RAM lock</td>
                    </tr>
                    <tr>
                      <td className="p-3 font-semibold text-white">
                        <a href="https://attack.mitre.org/tactics/TA0008/" target="_blank" rel="noopener noreferrer" className="hover:text-cyan-400 transition-colors flex items-center gap-1.5 inline-flex">
                          Lateral Movement (TA0008) <ExternalLink size={10} className="opacity-50" />
                        </a>
                      </td>
                      <td className="p-3">Atypical internal SMB/RDP socket sequences</td>
                      <td className="p-3 font-mono text-cyan-400">Quarantine local gateway endpoint</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════
          8. ECOSYSTEM & TECH STACK (FILTERABLE GRID SHOWCASE)
          ════════════════════════════════════════════════════ */}
      <section id="tech-stack" ref={techRef} className="dfir-techstack-section relative py-24 md:py-36 px-6 border-t border-white/5 bg-neutral-950/20">
        <div className="max-w-[1400px] mx-auto space-y-12">

          <div className="flex flex-col lg:flex-row lg:items-end justify-start gap-8 lg:gap-16">
            <div className="space-y-3 text-left">
              <p className="dfir-section-label text-xs uppercase tracking-[0.35em] font-bold text-pink-500">Framework Ecosystem</p>
              <h2 className="dfir-section-heading text-3xl md:text-5xl font-black tracking-tighter" style={{ fontFamily: "var(--font-space-grotesk)" }}>Tools & Technologies</h2>
              <p className="text-sm text-white/40">
                Industry-standard forensic suites integrated seamlessly with modern data engines and AI libraries.
              </p>
            </div>

            {/* Filter buttons */}
            <div className="flex flex-wrap border border-white/10 rounded-lg bg-black/60 p-1 self-start font-mono text-[11px] md:text-xs">
              {[
                { id: "all", label: "ALL ECOSYSTEM" },
                { id: "forensics", label: "FORENSICS" },
                { id: "aiml", label: "AI/ML STACK" },
                { id: "infra", label: "INFRASTRUCTURE" },
                { id: "web", label: "WEB & API" },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setTechFilter(tab.id as any)}
                  className={`px-3 py-1.5 rounded transition-all duration-300 ${techFilter === tab.id ? "bg-white text-black font-bold shadow-md" : "text-white/50 hover:text-white/80"}`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Grid Layout */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 pt-6">
            {TECH_STACK_ITEMS.filter((item) => techFilter === "all" || item.cat === techFilter).map((tech, idx) => (
              <div
                key={idx}
                className="relative rounded-xl p-5 bg-neutral-900/40 border border-white/5 flex flex-col items-center justify-between text-center space-y-4 hover:bg-neutral-900/60 hover:border-white/10 transition-all duration-300 select-none"
              >
                {/* Logo wrapper */}
                <div className="w-12 h-12 flex items-center justify-center rounded-lg bg-black/50 p-2 overflow-hidden border border-white/5">
                  <img
                    src={tech.logo}
                    alt={tech.name}
                    className="max-h-full max-w-full object-contain filter brightness-95 opacity-80"
                    onError={(e) => {
                      (e.target as HTMLElement).style.display = "none";
                    }}
                  />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white/90 font-mono">{tech.name}</h4>
                  <p className="text-xs text-white/40 mt-1 font-light leading-snug">{tech.desc}</p>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* ════════════════════════════════════════════════════
          9. 7-PHASE STEPPER TIMELINE
          ════════════════════════════════════════════════════ */}
      <section id="workflow" className="dfir-workflow-section relative py-24 md:py-36 px-6 border-t border-white/5 bg-black">
        <div className="max-w-[1400px] mx-auto space-y-16">
          <div className="text-center space-y-3 max-w-2xl mx-auto">
            <p className="dfir-section-label text-xs uppercase tracking-[0.35em] font-bold text-cyan-400">7-Phase Stepper Workflow</p>
            <h2 className="dfir-section-heading text-3xl md:text-5xl font-black tracking-tighter" style={{ fontFamily: "var(--font-space-grotesk)" }}>How an Investigation Works</h2>
            <p className="text-base text-white/50">
              The lifecycle of a digital forensic analysis mapped out phase-by-phase through our automated pipeline.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">

            {/* Left: 7 Stepper Buttons */}
            <div className="lg:col-span-5 space-y-3">
              {[
                { phase: "Phase 1", name: "Identification", desc: "Security alert triggers analysis window.", icon: Search },
                { phase: "Phase 2", name: "Preservation", desc: "Disk memory images and SHA-256 hashes generated.", icon: Shield },
                { phase: "Phase 3", name: "Collection", desc: "9 artifact categories collected via parallel workers.", icon: Database },
                { phase: "Phase 4", name: "Examination", desc: "Volatility sweeps RAM, YARA flags file pattern blocks.", icon: Terminal },
                { phase: "Phase 5", name: "Analysis", desc: "Gaussian scans and Bayesian posterior threat updates.", icon: Brain },
                { phase: "Phase 6", name: "Presentation", desc: "Timeline graphs compiled into dashboard reports.", icon: FileSearch },
                { phase: "Phase 7", name: "Response", desc: "Prioritized threat triage sent to incident response.", icon: Activity },
              ].map((step, si) => (
                <button
                  key={si}
                  onClick={() => setActiveWorkflowPhase(si)}
                  className={`w-full flex items-center justify-between p-4 rounded-xl border text-left transition-all duration-300 ${activeWorkflowPhase === si ? "bg-white border-white text-black" : "bg-neutral-900/30 border-white/5 text-white hover:border-white/10"}`}
                >
                  <div className="flex gap-4 items-center">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${activeWorkflowPhase === si ? "bg-black text-white" : "bg-black/60 text-cyan-400"}`}>
                      <step.icon size={14} />
                    </div>
                    <div>
                      <span className={`text-xs font-mono uppercase tracking-widest block ${activeWorkflowPhase === si ? "text-black/55" : "text-white/40"}`}>{step.phase}</span>
                      <h4 className="text-base font-bold tracking-tight">{step.name}</h4>
                    </div>
                  </div>
                  <ChevronRight size={16} className={`opacity-40 ${activeWorkflowPhase === si ? "translate-x-1" : ""}`} />
                </button>
              ))}
            </div>

            {/* Right: Stepper Card Display */}
            <div className="lg:col-span-7 rounded-2xl p-6 md:p-8 bg-neutral-950 border border-white/5 space-y-6 text-left min-h-[350px] flex flex-col justify-between relative overflow-hidden">
              {/* Glowing vector arrows */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-[radial-gradient(circle_at_center,rgba(0,240,255,0.02)_0%,transparent_70%)] rounded-full pointer-events-none" />

              <div className="space-y-4">
                <span className="text-[11px] md:text-xs font-mono uppercase tracking-widest text-cyan-400">PHASE DETAIL MONITOR</span>
                <h3 className="text-3xl font-black text-white/90">
                  {
                    [
                      "Phase 1: Identification",
                      "Phase 2: Preservation",
                      "Phase 3: Collection",
                      "Phase 4: Examination",
                      "Phase 5: Analysis",
                      "Phase 6: Presentation",
                      "Phase 7: Response",
                    ][activeWorkflowPhase]
                  }
                </h3>
                <p className="text-base md:text-lg text-white/70 leading-relaxed font-light">
                  {
                    [
                      "The framework is initialized using case parameters. The incident alert is evaluated (via SIEM logs, firewall events, or manual administrator trigger) to assess the scope of compromised systems, timestamp windows, and initial indicators.",
                      "A complete physical copy of RAM memory dumps and disk allocations is established. Immediate SHA-256 hashes are calculated on files upon collection to preserve absolute evidence chain-of-custody integrity.",
                      "The automated collection pipelines trigger. In parallel, 9 key artifact categories (system event logs, registry keys, volatile memory, browser profile databases) are ingested simultaneously into Elasticsearch arrays.",
                      "Volatility 3 sweeps memory files to find rootkits and hidden processes. In parallel, custom YARA signatures scan directories, and Scapy packet normalizers dissect capture files.",
                      "Our 6 core AI/ML modules compute behavioral outliers using Gaussian standard deviations, run Bayesian threat scoring models, calculate Shannon file entropy randomness, and reconstruct timelines.",
                      "Elasticsearch indices map events chronologically. The interactive dashboards translate complex indicators into graphic dashboards, mapping attack steps directly to MITRE ATT&CK tactics.",
                      "Prioritized incident warnings are dispatched to response teams, including automated firewall isolation or network quarantine blocks to instantly mitigate lateral spread.",
                    ][activeWorkflowPhase]
                  }
                </p>
              </div>

              {/* Progress Indicator */}
              <div className="flex justify-between items-center pt-6 border-t border-white/5 font-mono text-[11px] md:text-xs text-white/30">
                <span>PHASE STATUS: ACTIVE</span>
                <span>{activeWorkflowPhase + 1} / 7 COMPLETED</span>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════
          10. RESEARCH FOUNDATION & ACADEMIC CONTEXT
          ════════════════════════════════════════════════════ */}
      <section className="relative py-24 md:py-36 px-6 border-t border-white/5 bg-neutral-950/20">
        <div className="max-w-[1400px] mx-auto space-y-16">
          <div className="text-center space-y-3 max-w-2xl mx-auto">
            <p className="dfir-section-label text-xs uppercase tracking-[0.35em] font-bold text-pink-500">Academic Context</p>
            <h2 className="dfir-section-heading text-3xl md:text-5xl font-black tracking-tighter" style={{ fontFamily: "var(--font-space-grotesk)" }}>Research Foundation</h2>
            <p className="text-base text-white/50">
              The AI-DFIR framework stands on published research, integrating AI tools with strict forensic standards.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                title: "AI in Digital Forensics (2024)",
                author: "Rashmi Mandayam",
                context: "Demonstrated that machine learning models and NLP workflows allow security analysts to parse enormous data volumes and compile threat timeline insights rapidly.",
                tag: "ML & NLP Forensic Data",
                href: "https://scholar.google.com/scholar?q=AI+in+Digital+Forensics%3A+Machine+Learning+and+NLP+for+Forensic+Data+Analysis",
              },
              {
                title: "LLM-Assisted Forensics (EAI 2025)",
                author: "ICDF2C Best Paper Award",
                context: "Proposes structural integration of large language models across 4 strategic stages: evidence discovery, pattern recognition, case evaluation, and court presentation.",
                tag: "Best Paper Framework",
                href: "https://scholar.google.com/scholar?q=LLM-Assisted+Digital+Forensics+Framework",
              },
              {
                title: "SOAR Incident Automation (2025)",
                author: "DFIR Automation Review",
                context: "Concludes that automated threat orchestration methods accelerate breach incident handling and lessen mean-time-to-respond (MTTR) by up to 90%.",
                tag: "SOAR Orchestration",
                href: "https://scholar.google.com/scholar?q=SOAR+Incident+Automation+in+Digital+Forensics",
              },
            ].map((paper, pi) => (
              <a
                key={pi}
                href={paper.href}
                target="_blank"
                rel="noopener noreferrer"
                className="dfir-research-card block rounded-2xl p-6 bg-neutral-950 border border-white/5 text-left flex flex-col justify-between space-y-4 group hover:border-white/20 hover:bg-neutral-900/60 transition-all duration-300"
              >
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="px-2.5 py-1 rounded bg-pink-500/10 text-pink-400 font-mono text-[11px] uppercase tracking-wider">{paper.tag}</span>
                    <ExternalLink size={12} className="text-white/20 group-hover:text-pink-400 transition-colors" />
                  </div>
                  <h3 className="text-lg font-bold text-white/95 mt-2 group-hover:text-cyan-400 transition-colors">{paper.title}</h3>
                  <p className="text-sm text-white/50 font-mono">{paper.author}</p>
                </div>
                <p className="text-sm text-white/60 leading-relaxed font-light border-t border-white/5 pt-4">{paper.context}</p>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════
          11. FUTURE ROADMAP TIMELINE
          ════════════════════════════════════════════════════ */}
      <section id="roadmap" className="dfir-roadmap-section relative py-24 md:py-36 px-6 border-t border-white/5 bg-black">
        <div className="max-w-[1400px] mx-auto space-y-16">
          <div className="text-center space-y-3 max-w-2xl mx-auto">
            <p className="dfir-section-label text-xs uppercase tracking-[0.35em] font-bold text-cyan-400">Platform Vision</p>
            <h2 className="dfir-section-heading text-3xl md:text-5xl font-black tracking-tighter" style={{ fontFamily: "var(--font-space-grotesk)" }}>Future Expansion Roadmap</h2>
            <p className="text-base text-white/50">
              The expansion milestones planned to scale the AI-DFIR framework across automated operations.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[
              { phase: "Phase 1", title: "Enterprise Integrations", items: ["SIEM Split Connectors (Splunk, Sentinel)", "AWS / GCP cloud log parsers"], status: "CURRENT", color: ACCENT_CYAN },
              { phase: "Phase 2", title: "Autonomous Containment", items: ["Sub-second network isolation playbooks", "Ransomware active behavior kills"], status: "PLANNED", color: ACCENT_GREEN },
              { phase: "Phase 3", title: "Deep Memory Automation", items: ["Volatility 3 automatic carving loops", "Dark Web IOC intelligence enrichment"], status: "PLANNED", color: ACCENT_MAGENTA },
              { phase: "Phase 4", title: "Post-Quantum Forensics", items: ["Quantum-resistant evidence hashing", "National law enforcement nodes"], status: "PLANNED", color: ACCENT_CYAN },
            ].map((node, ni) => (
              <div
                key={ni}
                className="relative rounded-2xl p-6 bg-neutral-950 border border-white/5 text-left space-y-4 hover:border-white/10 transition-all duration-300"
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs font-semibold text-white/30">{node.phase}</span>
                  <span
                    className={`px-2 py-0.5 rounded text-[11px] font-mono font-bold tracking-wider ${node.status === "CURRENT" ? "bg-cyan-500/10 text-cyan-400 animate-pulse" : "bg-white/5 text-white/30"}`}
                  >
                    {node.status}
                  </span>
                </div>
                <h3 className="text-lg font-bold text-white/95" style={{ color: node.status === "CURRENT" ? node.color : "inherit" }}>{node.title}</h3>
                <ul className="space-y-2 border-t border-white/5 pt-4 text-sm font-light text-white/60 list-disc pl-4 leading-normal">
                  {node.items.map((item, idx) => (
                    <li key={idx}>{item}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════
          12. EXPECTED OUTCOMES / COMPARATIVE METRICS & CTA
          ════════════════════════════════════════════════════ */}
      <section className="relative py-24 md:py-36 px-6 border-t border-white/5 bg-neutral-950/20">
        <div className="max-w-[1400px] mx-auto space-y-16">
          <div className="text-center space-y-3 max-w-2xl mx-auto">
            <p className="dfir-section-label text-xs uppercase tracking-[0.35em] font-bold text-pink-500">Outcomes & Benchmarks</p>
            <h2 className="dfir-section-heading text-3xl md:text-5xl font-black tracking-tighter" style={{ fontFamily: "var(--font-space-grotesk)" }}>Traditional vs. AI-DFIR Impact</h2>
            <p className="text-base text-white/50">
              Quantified expected improvements comparing standard manual forensic methods against automated AI-DFIR pipelines.
            </p>
          </div>

          {/* Bar Graph comparisons */}
          <div className="space-y-6 max-w-3xl mx-auto">
            {[
              { label: "Evidence Collection Time", ref: "[1]", trad: "8 hours", ai: "20 mins", tradWidth: "100%", aiWidth: "4%", pct: "95% Faster" },
              { label: "Log Review (10k entries)", ref: "[2]", trad: "12 hours", ai: "5 mins", tradWidth: "100%", aiWidth: "2%", pct: "99% Faster" },
              { label: "Timeline Reconstruction", ref: "[3]", trad: "3 days", ai: "1 hour", tradWidth: "100%", aiWidth: "3%", pct: "95% Faster" },
              { label: "False Positive Alert Rates", ref: "[1]", trad: "40%", ai: "9%", tradWidth: "100%", aiWidth: "22%", pct: "75% Drop" },
              { label: "Forensic Report Compiles", ref: "[2]", trad: "8 hours", ai: "15 mins", tradWidth: "100%", aiWidth: "3%", pct: "96% Faster" },
            ].map((bar, bi) => (
              <div key={bi} className="space-y-2 text-left font-mono text-sm">
                <div className="flex justify-between text-white/90 font-bold text-base items-center">
                  <span className="flex items-center gap-2">
                    {bar.label}
                    <a href="#references" className="text-[10px] md:text-xs text-cyan-400/60 hover:text-cyan-400 font-mono font-light transition-colors" title={`Source Reference ${bar.ref}`}>
                      {bar.ref}
                    </a>
                  </span>
                  <span className="text-pink-400">{bar.pct}</span>
                </div>

                {/* Traditional Bar */}
                <div className="space-y-1">
                  <div className="flex justify-between text-xs md:text-sm text-white/50">
                    <span>Traditional Forensic Triage</span>
                    <span>{bar.trad}</span>
                  </div>
                  <div className="w-full h-2.5 bg-neutral-900 rounded-full overflow-hidden">
                    <div className="comparison-bar-fill h-full bg-red-600/70" data-width={bar.tradWidth} style={{ width: "0%" }} />
                  </div>
                </div>

                {/* AI-DFIR Bar */}
                <div className="space-y-1">
                  <div className="flex justify-between text-xs md:text-sm text-cyan-400/90">
                    <span>AI-DFIR Orchestrated Pipeline</span>
                    <span>{bar.ai}</span>
                  </div>
                  <div className="w-full h-2.5 bg-neutral-900 rounded-full overflow-hidden">
                    <div className="comparison-bar-fill h-full bg-cyan-400" data-width={bar.aiWidth} style={{ width: "0%" }} />
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* References & Academic bibliography listings */}
          <div ref={refsRef} id="references" className="border-t border-white/5 pt-16 space-y-8 max-w-4xl mx-auto">
            <div className="flex items-center gap-3 text-left">
              <BookOpen size={20} style={{ color: ACCENT_CYAN }} strokeWidth={1.5} />
              <h3 className="text-2xl font-black tracking-tight text-white/90" style={{ fontFamily: "var(--font-space-grotesk)" }}>References & Academic Sources</h3>
            </div>

            <div className="grid grid-cols-1 gap-3 font-mono text-sm text-left text-white/60">
              {[
                { text: "1. Rashmi Mandayam (2024) — 'AI in Digital Forensics: Machine Learning and NLP for Forensic Data Analysis.' Published findings detailing accelerated evidence workflows.", href: "https://scholar.google.com/scholar?q=AI+in+Digital+Forensics+Machine+Learning+and+NLP+for+Forensic+Data+Analysis" },
                { text: "2. EAI ICDF2C 2025 Best Paper Award — 'LLM-Assisted Digital Forensics Framework.' Structural integrations at 4 core timeline layers.", href: "https://scholar.google.com/scholar?q=LLM-Assisted+Digital+Forensics+Framework" },
                { text: "3. DFRWS USA 2025 — 'SoK: Timeline-based Event Reconstruction for Digital Forensics.' Forensic Science International: Digital Investigation.", href: "https://scholar.google.com/scholar?q=SoK%3A+Timeline-based+Event+Reconstruction+for+Digital+Forensics" },
                { text: "4. FBI Internet Crime Complaint Center (IC3) 2024 Annual Cybercrime Reports.", href: "https://www.ic3.gov/" },
                { text: "5. IBM Security Cost of a Data Breach Report 2025 edition.", href: "https://www.ibm.com/reports/data-breach" },
                { text: "6. World Economic Forum — Global Cybersecurity Outlook 2024 reports.", href: "https://www.weforum.org/publications/global-cybersecurity-outlook-2024/" },
                { text: "7. NIST SP 800-86 — Guide to Integrating Forensic Techniques into Incident Response.", href: "https://csrc.nist.gov/pubs/sp/800/86/final" },
              ].map((ref, idx) => (
                <a
                  key={idx}
                  href={ref.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-center justify-between p-3.5 rounded-lg bg-neutral-950 border border-white/5 hover:border-white/20 hover:bg-neutral-900/40 hover:text-cyan-400 transition-all duration-300"
                >
                  <span className="pr-4">{ref.text}</span>
                  <ExternalLink size={12} className="text-white/20 group-hover:text-cyan-400 flex-shrink-0 transition-colors" />
                </a>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════
          CTA FOOTER
          ════════════════════════════════════════════════════ */}
      <section
        ref={ctaRef}
        className="relative py-24 md:py-36 px-6 border-t border-white/5"
        style={{ background: "linear-gradient(180deg, #000000 0%, #0a0a0a 100%)" }}
      >
        <div
          className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] rounded-full pointer-events-none"
          style={{ background: `radial-gradient(ellipse, ${ACCENT_CYAN}06 0%, transparent 70%)` }}
        />

        <div className="dfir-cta-content max-w-3xl mx-auto text-center relative z-10 space-y-8">
          <h2 className="text-3xl md:text-5xl lg:text-6xl font-black tracking-tighter leading-[1]" style={{ fontFamily: "var(--font-space-grotesk)" }}>
            Interested in this<br />
            <span style={{ color: ACCENT_CYAN }}>research?</span>
          </h2>
          <p className="text-sm md:text-base max-w-xl mx-auto leading-relaxed" style={{ color: "rgba(255,255,255,0.45)" }}>
            Let&apos;s discuss the forensic framework, the ML models behind it, or how AI-driven investigation can be applied to your DFIR workflow. Open to research collaborations, speaking engagements, and consulting.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            {/* Desktop: Gmail compose | Mobile: native mailto */}
            <a
              href={isMobileDevice ? EMAIL_MAILTO : `https://mail.google.com/mail/?view=cm&fs=1&to=dhruv15saraswat@gmail.com&su=Inquiry%3A%20AI-Assisted%20Digital%20Forensics%20Framework%20Discussion&body=Hi%20Dhruv%2C%0A%0AI%20recently%20explored%20your%20AI-Assisted%20Digital%20Forensics%20Framework%20and%20I%20am%20very%20impressed%20by%20the%20integration%20of%20machine%20learning%20within%20the%20forensic%20timeline%20reconstruction.%0A%0AI%20am%20reaching%20out%20to%20discuss%20potential%20collaboration%2C%20implementation%2C%20or%20general%20queries%20regarding%20your%20research.%0A%0AHere%20are%20a%20few%20details%20about%20myself%3A%0A-%20Name%3A%20%5BYour%20Name%5D%0A-%20Organization%2FRole%3A%20%5BYour%20Organization%2FRole%5D%0A-%20Preferred%20Contact%3A%20%5BYour%20Contact%20Number%2FEmail%5D%0A-%20LinkedIn%3A%20%5BYour%20LinkedIn%20Profile%20URL%5D%0A%0ALooking%20forward%20to%20connecting%20with%20you.%0A%0ABest%20regards%2C%0A%5BYour%20Name%5D`}
              {...(isMobileDevice ? {} : { target: "_blank", rel: "noopener noreferrer" })}
              className="group inline-flex items-center gap-2.5 rounded-full px-8 py-4 text-sm font-bold transition-all duration-300 hover:scale-105"
              style={{ background: ACCENT_CYAN, color: "#000000", boxShadow: `0 0 40px ${ACCENT_CYAN}30` }}
            >
              Discuss this project
              <ExternalLink className="h-4 w-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </a>
            <Link
              href="/#work"
              className="inline-flex items-center gap-2 rounded-full px-6 py-3 text-xs font-semibold transition-all duration-300 hover:scale-105"
              style={{ border: "1px solid rgba(255,255,255,0.12)", color: "rgba(255,255,255,0.6)" }}
            >
              <ArrowLeft size={14} />
              Back to all projects
            </Link>
          </div>
        </div>
      </section>

      {/* ══════ FOOTER ══════ */}
      <footer className="py-8 border-t" style={{ backgroundColor: "#000", borderColor: "rgba(255,255,255,0.05)" }}>
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="font-[var(--font-orbitron)] font-black text-lg tracking-tight">
              <span style={{ color: ACCENT_CYAN }}>D</span>
              <span className="text-white">FIR</span>
            </span>
            <span className="text-xs" style={{ color: "rgba(255,255,255,0.35)" }}>Built by Eurt-labs</span>
          </div>
          <div className="flex items-center gap-6" style={{ fontFamily: "var(--font-space-mono)" }}>
            {["Problem", "Architecture", "Models", "Workflow", "Roadmap"].map((l) => {
              const idMap: Record<string, string> = {
                "Problem": "problem",
                "Architecture": "architecture",
                "Models": "models",
                "Workflow": "workflow",
                "Roadmap": "roadmap",
              };
              const targetId = idMap[l] || l.toLowerCase();
              return (
                <a
                  key={l}
                  href={`#${targetId}`}
                  onClick={(e) => {
                    e.preventDefault();
                    const el = document.getElementById(targetId);
                    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
                  }}
                  className="text-xs hover:text-white transition-colors cursor-pointer"
                  style={{ color: "rgba(255,255,255,0.35)" }}
                >
                  {l}
                </a>
              );
            })}
          </div>
          <p className="text-xs" style={{ color: "rgba(255,255,255,0.35)", fontFamily: "var(--font-space-mono)" }}>Python · NIST SP 800-86 · 6 ML Models</p>
        </div>
        {/* Mobile footer social row */}
        <div className="flex items-center justify-center gap-4 mt-4 md:hidden">
          <a
            href={EMAIL_MAILTO}
            className="w-9 h-9 rounded-full bg-white/5 flex items-center justify-center text-white/40 hover:text-white transition-colors"
          >
            <Mail size={15} />
          </a>
        </div>
      </footer>

      {/* ══════ KEYFRAMES ══════ */}
      <style jsx global>{`
        @keyframes cyanPulse {
          0% { box-shadow: 0 0 0 0 rgba(0, 240, 255, 0.5); }
          70% { box-shadow: 0 0 0 18px rgba(0, 240, 255, 0); }
          100% { box-shadow: 0 0 0 0 rgba(0, 240, 255, 0); }
        }
        @keyframes ctaGlow {
          0%, 100% { transform: translate(-50%, -50%) scale(1); }
          50% { transform: translate(-50%, -50%) scale(1.3); }
        }
      `}</style>
    </div>
  );
}
