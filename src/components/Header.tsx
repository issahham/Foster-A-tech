import React from "react";
import {
  Search,
  ShoppingCart,
  Heart,
  PlusCircle,
  Sparkles,
  Layers,
  Package,
  Store,
  ShieldCheck,
  Zap,
  SlidersHorizontal,
  ChevronDown
} from "lucide-react";
import { CategoryKey, CategoryInfo } from "../types";
import { CATEGORIES } from "../data/mockProducts";
import { UserProfile } from "../services/storage";

interface HeaderProps {
  activeCategory: CategoryKey;
  onSelectCategory: (cat: CategoryKey) => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  cartCount: number;
  wishlistCount: number;
  compareCount: number;
  ordersCount: number;
  userProfile: UserProfile;
  onOpenCart: () => void;
  onOpenWishlist: () => void;
  onOpenCompare: () => void;
  onOpenOrders: () => void;
  onOpenSellModal: () => void;
  onOpenAiAdvisor: () => void;
  onOpenSellerDashboard: () => void;
  onToggleFilters?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeCategory,
  onSelectCategory,
  searchQuery,
  onSearchChange,
  cartCount,
  wishlistCount,
  compareCount,
  ordersCount,
  userProfile,
  onOpenCart,
  onOpenWishlist,
  onOpenCompare,
  onOpenOrders,
  onOpenSellModal,
  onOpenAiAdvisor,
  onOpenSellerDashboard,
  onToggleFilters,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-slate-950/95 backdrop-blur-md border-b border-slate-800/80 text-slate-100 shadow-xl">
      {/* Top Banner Notice */}
      <div className="bg-gradient-to-r from-emerald-950 via-slate-900 to-cyan-950 px-4 py-1.5 text-xs text-slate-300 border-b border-slate-800/50 flex items-center justify-between">
        <div className="flex items-center gap-4 mx-auto md:mx-0 overflow-x-auto whitespace-nowrap">
          <span className="flex items-center gap-1 text-emerald-400 font-medium">
            <ShieldCheck className="w-3.5 h-3.5" /> Foster Escrow Protection: 100% Verified Hardware & 30-Day Returns
          </span>
          <span className="hidden sm:inline text-slate-500">•</span>
          <span className="hidden sm:flex items-center gap-1 text-cyan-400">
            <Zap className="w-3.5 h-3.5" /> Same-Day Courier Dispatch on orders before 4 PM
          </span>
        </div>
        <div className="hidden lg:flex items-center gap-4 text-slate-400 text-xs">
          <span>Seller Trade-in Rate: <strong>+12% Bonus</strong></span>
          <button 
            id="header-orders-link"
            onClick={onOpenOrders} 
            className="hover:text-emerald-400 transition-colors flex items-center gap-1 cursor-pointer"
          >
            <Package className="w-3.5 h-3.5" /> My Orders ({ordersCount})
          </button>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3.5 flex items-center justify-between gap-3 lg:gap-6">
        {/* Brand Logo */}
        <div className="flex items-center gap-3">
          <div 
            onClick={() => onSelectCategory("all")}
            className="flex items-center gap-2.5 cursor-pointer group"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-500 via-teal-500 to-cyan-400 flex items-center justify-center shadow-lg shadow-emerald-500/20 group-hover:scale-105 transition-transform">
              <span className="text-slate-950 font-black text-xl tracking-tighter">F</span>
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-xl tracking-tight text-white group-hover:text-emerald-400 transition-colors">
                  Foster A Tech
                </span>
                <span className="text-[10px] font-bold uppercase tracking-wider bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-1.5 py-0.5 rounded">
                  Market
                </span>
              </div>
              <p className="text-[11px] text-slate-400 font-medium hidden sm:block">
                Computer Peripherals & Custom Rig Marketplace
              </p>
            </div>
          </div>
        </div>

        {/* Global Search Bar */}
        <div className="flex-1 max-w-2xl relative hidden md:block">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              id="header-search-input"
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Search keyboards, 8K mice, monitor arms, Thunderbolt docks, DACs, cables..."
              className="w-full bg-slate-900/90 border border-slate-800 rounded-xl pl-10 pr-24 py-2.5 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all shadow-inner"
            />
            {searchQuery ? (
              <button
                onClick={() => onSearchChange("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-white bg-slate-800 px-1.5 py-0.5 rounded cursor-pointer"
              >
                Clear
              </button>
            ) : (
              <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1 pointer-events-none">
                <kbd className="text-[10px] bg-slate-800 text-slate-400 border border-slate-700 px-1.5 py-0.5 rounded font-mono">
                  ⌘K
                </kbd>
              </div>
            )}
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* AI Setup Advisor Button */}
          <button
            id="header-ai-advisor-btn"
            onClick={onOpenAiAdvisor}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-900 border border-cyan-500/40 text-cyan-300 hover:bg-cyan-950/40 hover:border-cyan-400 text-xs font-semibold shadow-sm transition-all cursor-pointer"
            title="AI Setup Compatibility & Accessory Advisor"
          >
            <Sparkles className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
            <span className="hidden lg:inline">AI Setup Advisor</span>
          </button>

          {/* Sell Button */}
          <button
            id="header-sell-btn"
            onClick={onOpenSellModal}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-slate-950 text-xs font-bold shadow-md shadow-emerald-500/20 hover:shadow-emerald-500/30 active:scale-95 transition-all cursor-pointer"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Sell Gear</span>
          </button>

          {/* Compare Badge */}
          {compareCount > 0 && (
            <button
              id="header-compare-btn"
              onClick={onOpenCompare}
              className="relative p-2 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-300 hover:text-white transition-all cursor-pointer"
              title="Compare selected accessories"
            >
              <Layers className="w-4 h-4 text-indigo-400" />
              <span className="absolute -top-1 -right-1 bg-indigo-500 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                {compareCount}
              </span>
            </button>
          )}

          {/* Wishlist Button */}
          <button
            id="header-wishlist-btn"
            onClick={onOpenWishlist}
            className="relative p-2 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-300 hover:text-pink-400 transition-all cursor-pointer"
            title="Wishlist & Saved Items"
          >
            <Heart className="w-4 h-4" />
            {wishlistCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-pink-500 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                {wishlistCount}
              </span>
            )}
          </button>

          {/* Cart Button */}
          <button
            id="header-cart-btn"
            onClick={onOpenCart}
            className="relative flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 hover:border-emerald-500/50 text-slate-200 hover:text-white transition-all cursor-pointer"
          >
            <ShoppingCart className="w-4 h-4 text-emerald-400" />
            <span className="text-xs font-bold">{cartCount}</span>
          </button>

          {/* Seller / Profile Dropdown Button */}
          <button
            id="header-seller-dashboard-btn"
            onClick={onOpenSellerDashboard}
            className="flex items-center gap-2 pl-2 pr-2.5 py-1.5 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 transition-all cursor-pointer group text-left"
          >
            <img
              src={userProfile.avatar}
              alt={userProfile.name}
              className="w-6 h-6 rounded-full object-cover ring-1 ring-emerald-500/50"
            />
            <div className="hidden xl:block">
              <p className="text-[11px] font-semibold text-slate-200 leading-tight group-hover:text-emerald-400">
                {userProfile.name.split(" ")[0]}
              </p>
              <p className="text-[10px] text-emerald-400 font-mono font-medium">
                ${userProfile.balance.toFixed(2)}
              </p>
            </div>
            <Store className="w-3.5 h-3.5 text-slate-400 group-hover:text-slate-200" />
          </button>
        </div>
      </div>

      {/* Mobile Search Bar */}
      <div className="px-4 pb-2.5 md:hidden">
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            id="mobile-search-input"
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search all computer accessories..."
            className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-9 pr-4 py-2 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-emerald-500"
          />
        </div>
      </div>

      {/* Category Pills Slider */}
      <div className="border-t border-slate-800/80 bg-slate-950/60 px-4 sm:px-6 py-2 overflow-x-auto scrollbar-none flex items-center gap-2">
        {CATEGORIES.map((cat: CategoryInfo) => {
          const isActive = activeCategory === cat.id;
          return (
            <button
              key={cat.id}
              id={`cat-pill-${cat.id}`}
              onClick={() => onSelectCategory(cat.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-1.5 cursor-pointer ${
                isActive
                  ? "bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20 font-bold"
                  : "bg-slate-900/80 text-slate-300 hover:text-white hover:bg-slate-800 border border-slate-800"
              }`}
            >
              <span>{cat.shortLabel}</span>
            </button>
          );
        })}
      </div>
    </header>
  );
};
