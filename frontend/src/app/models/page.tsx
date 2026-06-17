"use client";

import { Activity, FileSearch, Network, Shield, Bug, Workflow } from "lucide-react";

const ML_MODELS = [
  {
    name: "Bayesian Probability Network",
    category: "Evidence Evaluation",
    formula: "P(A|B) = P(B|A) × P(A) / P(B)",
    stats: "Real-time posterior updates across 50+ evidence nodes",
    color: "cyan",
  },
  {
    name: "Gaussian Mixture Models",
    category: "Network Anomaly Detection",
    formula: "f(x) = (1/σ√2π) × e^(-(x-μ)²/2σ²)",
    stats: "K=8 components · AUC-ROC: 0.964 on CICIDS2017",
    color: "emerald",
  },
  {
    name: "Euclidean Distance Metrics",
    category: "Behavioral Similarity",
    formula: "d = √∑(xᵢ - yᵢ)²",
    stats: "Classifies 14 ATT&CK techniques with <12% error",
    color: "pink",
  },
  {
    name: "Logistic Regression Classifier",
    category: "Threat Classification",
    formula: "P(Y=1) = 1 / (1 + e^-(b₀+b₁x₁+...))",
    stats: "96.8% accuracy · F1: 0.971 · FPR: 0.023",
    color: "cyan",
  },
  {
    name: "Shannon Entropy Analysis",
    category: "Malware & Ransomware ID",
    formula: "H(X) = -∑ p(x) log₂ p(x)",
    stats: "Range: 0.0 (text) → 8.0 (encrypted)",
    color: "emerald",
  },
  {
    name: "Time-Series Decomposition",
    category: "Timeline Reconstruction",
    formula: "Xₜ = Tₜ + Sₜ + Rₜ",
    stats: "Filters daily noise, isolates attack residual spikes",
    color: "pink",
  },
];

const colorMap: Record<string, { text: string; bg: string; border: string }> = {
  cyan: { text: "text-cyan-400", bg: "bg-cyan-500/10", border: "border-cyan-500/15" },
  emerald: { text: "text-emerald-400", bg: "bg-emerald-500/10", border: "border-emerald-500/15" },
  pink: { text: "text-pink-400", bg: "bg-pink-500/10", border: "border-pink-500/15" },
};

const MODEL_ICONS = [Network, Activity, Shield, Bug, FileSearch, Workflow];

export default function ModelsPage() {
  return (
    <div className="p-8 space-y-8">
      <div>
        <h1 className="text-2xl font-bold font-[var(--font-space-grotesk)] text-white">
          Machine Learning Intelligence Engine
        </h1>
        <p className="text-white/50 text-sm mt-1">
          6 custom analytical methods powering the AI-DFIR framework
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {ML_MODELS.map((model, i) => {
          const Icon = MODEL_ICONS[i];
          const colors = colorMap[model.color];
          return (
            <div
              key={i}
              className={`rounded-xl p-6 bg-neutral-900/50 border ${colors.border} space-y-5 relative overflow-hidden`}
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/[0.01] rounded-full blur-2xl pointer-events-none" />

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${colors.bg}`}>
                    <Icon size={16} className={colors.text} />
                  </div>
                  <div>
                    <span className="text-[10px] font-mono uppercase tracking-widest text-white/30 block">
                      {model.category}
                    </span>
                    <h3 className="text-sm font-bold text-white/90">{model.name}</h3>
                  </div>
                </div>
              </div>

              <div className={`p-3 rounded-lg bg-black/50 border ${colors.border} font-mono text-xs ${colors.text} text-center`}>
                {model.formula}
              </div>

              <p className="text-xs text-white/50 font-mono">{model.stats}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
