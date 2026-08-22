import React, { useState } from "react";
import {
  X,
  Sparkles,
  Cpu,
  Send,
  CheckCircle2,
  DollarSign,
  ArrowRight,
  ShieldAlert,
  Zap,
  Sliders,
  RotateCcw
} from "lucide-react";
import { Product } from "../types";

interface AiAdvisorModalProps {
  isOpen: boolean;
  onClose: () => void;
  products: Product[];
  onSelectProduct: (product: Product) => void;
}

export const AiAdvisorModal: React.FC<AiAdvisorModalProps> = ({
  isOpen,
  onClose,
  products,
  onSelectProduct,
}) => {
  if (!isOpen) return null;

  const [currentSetup, setCurrentSetup] = useState("Ryzen 7 7800X3D + RTX 4080 Gaming & Workstation Rig");
  const [userGoal, setUserGoal] = useState("Competitive FPS esports peripherals with magnetic switches and low latency audio");
  const [budget, setBudget] = useState("$250 - $400");
  const [useCase, setUseCase] = useState("Gaming & Competitive Esports");
  const [isLoading, setIsLoading] = useState(false);

  const [advisorResult, setAdvisorResult] = useState<{
    overview: string;
    recommendations: Array<{
      accessoryCategory: string;
      suggestedProductTitle: string;
      reason: string;
      estimatedPrice: string;
      catalogProductId?: string;
    }>;
    compatibilityCheck: {
      isCompatible: boolean;
      notes: string;
      recommendedCablesOrAdapters: string[];
    };
    proTip: string;
  } | null>({
    overview: "Your high-end Ryzen 7800X3D rig has ample USB 3.2 Gen 2 bandwidth to power 8000Hz polling rate peripherals and lossless 24-bit/192kHz DACs without thermal or interrupt lag.",
    recommendations: [
      {
        accessoryCategory: "Keyboards",
        suggestedProductTitle: "Foster Rapid-Trigger Hall Effect 75% Mechanical Keyboard",
        reason: "Magnetic switches allow 0.1mm actuation for instant strafe-stopping in competitive shooters.",
        estimatedPrice: "$149",
        catalogProductId: "prod-1"
      },
      {
        accessoryCategory: "Mice",
        suggestedProductTitle: "AeroGlide 8K Wireless Esports Mouse (49g)",
        reason: "Ultra-lightweight magnesium shell paired with true 8000Hz polling rate synchronizes 1:1 with high-refresh monitors.",
        estimatedPrice: "$119",
        catalogProductId: "prod-2"
      }
    ],
    compatibilityCheck: {
      isCompatible: true,
      notes: "Ensure the 8K mouse dongle is plugged directly into the motherboard rear I/O USB 3.2 port (avoid unpowered front-panel hubs) to prevent packet drops.",
      recommendedCablesOrAdapters: ["USB-C Paracord shielded cable", "Dedicated rear I/O port"]
    },
    proTip: "Disable Windows USB Selective Suspend in Advanced Power Settings to ensure consistent zero-drop polling at 8000Hz."
  });

  const handleAskAdvisor = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentSetup.trim() || !userGoal.trim()) return;

    setIsLoading(true);

    try {
      const res = await fetch("/api/ai/advisor", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          currentSetup,
          userGoal,
          budget,
          useCase
        })
      });

      const data = await res.json();
      if (data && data.overview) {
        setAdvisorResult(data);
      }
    } catch (err) {
      console.error("Advisor request failed:", err);
      // Fallback
      setAdvisorResult({
        overview: `Based on your setup (${currentSetup}), we recommend high-speed accessories with optimal signal-to-noise ratio and fast data throughput.`,
        recommendations: [
          {
            accessoryCategory: "Peripherals",
            suggestedProductTitle: "TitanDock 40Gbps Dual-4K Thunderbolt Dock",
            reason: "Provides full multi-display bandwidth and 100W PD charging.",
            estimatedPrice: "$179"
          }
        ],
        compatibilityCheck: {
          isCompatible: true,
          notes: "Plug directly into Thunderbolt / USB4 ports for full speed.",
          recommendedCablesOrAdapters: ["Thunderbolt 4 40Gbps cable"]
        },
        proTip: "Keep firmware updated for lowest latency switch response."
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleInspectMatched = (titleOrId: string) => {
    // Look up by id or title
    const found =
      products.find((p) => p.id === titleOrId) ||
      products.find((p) => p.title.toLowerCase().includes(titleOrId.toLowerCase().split(" ")[0]));

    if (found) {
      onSelectProduct(found);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200">
      <div className="relative w-full max-w-4xl bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden text-slate-100 flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-950/70">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-emerald-400 to-cyan-400 text-slate-950 flex items-center justify-center font-bold">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h2 className="font-extrabold text-base text-white">AI Setup Compatibility & Accessory Advisor</h2>
              <p className="text-xs text-slate-400">Powered by Gemini • Analyzes your computer hardware to suggest perfect accessories</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Scroll Body */}
        <div className="overflow-y-auto p-6 flex-1 space-y-6">
          {/* Query Form */}
          <form onSubmit={handleAskAdvisor} className="bg-slate-950/60 border border-slate-800 rounded-2xl p-5 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block mb-1">
                  Your Current Computer / Laptop / Rig *
                </label>
                <input
                  type="text"
                  value={currentSetup}
                  onChange={(e) => setCurrentSetup(e.target.value)}
                  placeholder="e.g. M3 MacBook Pro, Dell XPS 15, or Custom Intel i7 14700K Gaming PC"
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-cyan-500"
                  required
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block mb-1">
                  Target Use Case & Missing Need *
                </label>
                <input
                  type="text"
                  value={userGoal}
                  onChange={(e) => setUserGoal(e.target.value)}
                  placeholder="e.g. Fast magnetic keyboard for CS2 / Valorant, or Thunderbolt dock for dual 4K monitors"
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-cyan-500"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="text-[11px] font-bold text-slate-400 uppercase block mb-1">
                  Target Budget
                </label>
                <select
                  value={budget}
                  onChange={(e) => setBudget(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-500"
                >
                  <option value="Under $100">Under $100 (Budget Friendly)</option>
                  <option value="$100 - $250">$100 - $250 (Mid-Range Sweetspot)</option>
                  <option value="$250 - $500">$250 - $500 (Enthusiast Pro)</option>
                  <option value="$500+">$500+ (No-Compromise Flagship)</option>
                </select>
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-400 uppercase block mb-1">
                  Primary Domain
                </label>
                <select
                  value={useCase}
                  onChange={(e) => setUseCase(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-500"
                >
                  <option value="Gaming & Competitive Esports">Gaming & Competitive Esports</option>
                  <option value="Software Engineering & Coding">Software Engineering & Coding</option>
                  <option value="Audio / Video Content Creation">Audio / Video Content Creation</option>
                  <option value="Remote Work & Desk Ergonomics">Remote Work & Desk Ergonomics</option>
                </select>
              </div>

              <div className="flex items-end">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-400 hover:to-cyan-400 text-slate-950 font-black text-xs flex items-center justify-center gap-1.5 shadow-md shadow-emerald-500/20 active:scale-98 transition-all cursor-pointer disabled:opacity-50"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>{isLoading ? "Analyzing Hardware..." : "Ask AI Advisor"}</span>
                </button>
              </div>
            </div>
          </form>

          {/* AI Advisor Response */}
          {advisorResult && (
            <div className="space-y-4">
              {/* Overview Analysis */}
              <div className="bg-slate-950/70 border border-slate-800 rounded-2xl p-5 space-y-2">
                <div className="flex items-center gap-2 text-cyan-400 text-xs font-bold uppercase tracking-wider">
                  <Cpu className="w-4 h-4" />
                  <span>Setup Hardware Diagnosis</span>
                </div>
                <p className="text-sm text-slate-200 leading-relaxed">{advisorResult.overview}</p>
              </div>

              {/* Recommendations */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                  AI Recommended Accessory Upgrades
                </h4>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {advisorResult.recommendations.map((rec, idx) => (
                    <div
                      key={idx}
                      className="bg-slate-950/70 border border-slate-800 rounded-2xl p-4 flex flex-col justify-between space-y-3 hover:border-emerald-500/40 transition-colors"
                    >
                      <div className="space-y-1.5">
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-bold uppercase text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-800/40">
                            {rec.accessoryCategory}
                          </span>
                          <span className="text-xs font-mono font-bold text-white">{rec.estimatedPrice}</span>
                        </div>
                        <h5 className="font-bold text-sm text-white">{rec.suggestedProductTitle}</h5>
                        <p className="text-xs text-slate-400 leading-snug">{rec.reason}</p>
                      </div>

                      <button
                        onClick={() => handleInspectMatched(rec.suggestedProductTitle)}
                        className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-emerald-400 text-xs font-bold flex items-center justify-center gap-1 transition-all cursor-pointer self-start"
                      >
                        <span>Find Matching Gear in Catalog</span>
                        <ArrowRight className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Compatibility Diagnostic & Pro Tips */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-slate-950/70 border border-slate-800 rounded-2xl p-4 space-y-2">
                  <div className="flex items-center gap-1.5 text-emerald-400 text-xs font-bold">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Bandwidth & Power Compatibility</span>
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    {advisorResult.compatibilityCheck.notes}
                  </p>
                </div>

                <div className="bg-slate-950/70 border border-slate-800 rounded-2xl p-4 space-y-2">
                  <div className="flex items-center gap-1.5 text-amber-400 text-xs font-bold">
                    <Zap className="w-4 h-4" />
                    <span>Pro Performance Optimization Tip</span>
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed">{advisorResult.proTip}</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
