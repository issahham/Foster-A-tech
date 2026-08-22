import React from "react";
import { Shield, Sparkles, Tag, CheckCircle2, Zap, ArrowRight, Truck } from "lucide-react";
import { ConditionGrade } from "../types";

interface BannerPromoProps {
  onSelectConditionFilter: (cond: ConditionGrade | "all") => void;
  activeCondition: ConditionGrade | "all";
  onOpenSellModal: () => void;
  onOpenAiAdvisor: () => void;
}

export const BannerPromo: React.FC<BannerPromoProps> = ({
  onSelectConditionFilter,
  activeCondition,
  onOpenSellModal,
  onOpenAiAdvisor,
}) => {
  return (
    <div className="space-y-4 mb-6">
      {/* Hero Marketplace Card */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-900 via-slate-900 to-emerald-950 border border-slate-800 p-5 sm:p-7 shadow-2xl">
        {/* Background glow graphics */}
        <div className="absolute top-0 right-0 -mt-8 -mr-8 w-72 h-72 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 -mb-8 w-60 h-60 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
          <div className="lg:col-span-8 space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5" /> Next-Gen Computer Accessories Marketplace
            </div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white tracking-tight leading-tight">
              Buy, Sell & Trade <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400">Elite Computer Gear</span> with Verified Protection
            </h1>
            <p className="text-sm text-slate-300 max-w-2xl leading-relaxed">
              From Hall Effect magnetic keyboards and 8000Hz ultralight mice to 40Gbps Thunderbolt docks, studio audio, and heavy-duty monitor arms. Inspected, authenticated, and backed by escrow protection.
            </p>

            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                id="banner-sell-gear-btn"
                onClick={onOpenSellModal}
                className="px-4 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs sm:text-sm font-bold flex items-center gap-2 shadow-lg shadow-emerald-500/20 active:scale-95 transition-all cursor-pointer"
              >
                <span>List an Accessory for Sale</span>
                <ArrowRight className="w-4 h-4" />
              </button>
              <button
                id="banner-ai-advisor-btn"
                onClick={onOpenAiAdvisor}
                className="px-4 py-2.5 rounded-xl bg-slate-800/80 hover:bg-slate-800 border border-slate-700 text-slate-200 text-xs sm:text-sm font-semibold flex items-center gap-2 transition-all cursor-pointer"
              >
                <Sparkles className="w-4 h-4 text-cyan-400" />
                <span>AI Setup Compatibility Advisor</span>
              </button>
            </div>
          </div>

          {/* Quick Metrics & Guarantee Badges */}
          <div className="lg:col-span-4 grid grid-cols-2 gap-3">
            <div className="bg-slate-950/60 border border-slate-800/80 rounded-xl p-3.5 backdrop-blur-sm">
              <Shield className="w-5 h-5 text-emerald-400 mb-1.5" />
              <h4 className="text-xs font-bold text-white">Foster Escrow</h4>
              <p className="text-[11px] text-slate-400 leading-tight mt-0.5">
                Funds held securely until buyer verifies hardware on arrival.
              </p>
            </div>

            <div className="bg-slate-950/60 border border-slate-800/80 rounded-xl p-3.5 backdrop-blur-sm">
              <CheckCircle2 className="w-5 h-5 text-cyan-400 mb-1.5" />
              <h4 className="text-xs font-bold text-white">100% Tested Specs</h4>
              <p className="text-[11px] text-slate-400 leading-tight mt-0.5">
                Multi-point inspection reports on all open-box & used gear.
              </p>
            </div>

            <div className="bg-slate-950/60 border border-slate-800/80 rounded-xl p-3.5 backdrop-blur-sm">
              <Tag className="w-5 h-5 text-amber-400 mb-1.5" />
              <h4 className="text-xs font-bold text-white">Make an Offer</h4>
              <p className="text-[11px] text-slate-400 leading-tight mt-0.5">
                Negotiate prices directly with sellers on pre-owned items.
              </p>
            </div>

            <div className="bg-slate-950/60 border border-slate-800/80 rounded-xl p-3.5 backdrop-blur-sm">
              <Truck className="w-5 h-5 text-indigo-400 mb-1.5" />
              <h4 className="text-xs font-bold text-white">Fast Tech Courier</h4>
              <p className="text-[11px] text-slate-400 leading-tight mt-0.5">
                Tracked courier dispatch with tamper-evident security seals.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Condition Filter Tabs */}
      <div className="flex items-center justify-between gap-2 overflow-x-auto pb-1 scrollbar-none">
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider pl-1">
            Condition:
          </span>
          <button
            id="filter-cond-all"
            onClick={() => onSelectConditionFilter("all")}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
              activeCondition === "all"
                ? "bg-slate-200 text-slate-950 font-bold shadow-sm"
                : "bg-slate-900 text-slate-400 hover:text-white border border-slate-800"
            }`}
          >
            All Conditions
          </button>
          <button
            id="filter-cond-brand-new"
            onClick={() => onSelectConditionFilter("Brand New")}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
              activeCondition === "Brand New"
                ? "bg-emerald-500 text-slate-950 font-bold shadow-sm shadow-emerald-500/20"
                : "bg-slate-900 text-slate-400 hover:text-emerald-400 border border-slate-800"
            }`}
          >
            Brand New (Sealed)
          </button>
          <button
            id="filter-cond-like-new"
            onClick={() => onSelectConditionFilter("Like New")}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
              activeCondition === "Like New"
                ? "bg-teal-500 text-slate-950 font-bold shadow-sm shadow-teal-500/20"
                : "bg-slate-900 text-slate-400 hover:text-teal-400 border border-slate-800"
            }`}
          >
            Like New (Mint)
          </button>
          <button
            id="filter-cond-open-box"
            onClick={() => onSelectConditionFilter("Open Box")}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
              activeCondition === "Open Box"
                ? "bg-cyan-500 text-slate-950 font-bold shadow-sm shadow-cyan-500/20"
                : "bg-slate-900 text-slate-400 hover:text-cyan-400 border border-slate-800"
            }`}
          >
            Open Box (Tested)
          </button>
          <button
            id="filter-cond-refurbished"
            onClick={() => onSelectConditionFilter("Refurbished")}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
              activeCondition === "Refurbished"
                ? "bg-amber-500 text-slate-950 font-bold shadow-sm shadow-amber-500/20"
                : "bg-slate-900 text-slate-400 hover:text-amber-400 border border-slate-800"
            }`}
          >
            Refurbished (Class A)
          </button>
        </div>

        <div className="hidden sm:flex items-center gap-1 text-xs text-slate-400 bg-slate-900 px-3 py-1.5 rounded-lg border border-slate-800 shrink-0">
          <Zap className="w-3.5 h-3.5 text-amber-400" />
          <span>Flash Drop Discount up to <strong>35% off MSRP</strong></span>
        </div>
      </div>
    </div>
  );
};
