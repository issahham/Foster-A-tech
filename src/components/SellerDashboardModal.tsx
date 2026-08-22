import React, { useState } from "react";
import {
  X,
  Store,
  DollarSign,
  Package,
  TrendingUp,
  ShieldCheck,
  Plus,
  Trash2,
  Edit3,
  CheckCircle2,
  ArrowUpRight,
  Wallet,
  Clock,
  Sparkles
} from "lucide-react";
import { Product } from "../types";
import { UserProfile } from "../services/storage";

interface SellerDashboardModalProps {
  isOpen: boolean;
  onClose: () => void;
  userProfile: UserProfile;
  products: Product[];
  onOpenSellModal: () => void;
  onDeleteProduct: (id: string) => void;
  onUpdateProfile: (profile: UserProfile) => void;
}

export const SellerDashboardModal: React.FC<SellerDashboardModalProps> = ({
  isOpen,
  onClose,
  userProfile,
  products,
  onOpenSellModal,
  onDeleteProduct,
  onUpdateProfile,
}) => {
  if (!isOpen) return null;

  const [activeTab, setActiveTab] = useState<"listings" | "payouts" | "profile">("listings");
  const myListings = products.filter((p) => p.isUserListing || p.seller.id === userProfile.id);

  // Profile Edit State
  const [name, setName] = useState(userProfile.name);
  const [handle, setHandle] = useState(userProfile.handle);
  const [bio, setBio] = useState(userProfile.bio);
  const [location, setLocation] = useState(userProfile.location);
  const [profileSaved, setProfileSaved] = useState(false);

  // Escrow balance calculation
  const totalSalesRevenue = userProfile.totalSales * 185;
  const escrowHolding = 320.00;

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    const updated: UserProfile = {
      ...userProfile,
      name,
      handle,
      bio,
      location
    };
    onUpdateProfile(updated);
    setProfileSaved(true);
    setTimeout(() => setProfileSaved(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200">
      <div className="relative w-full max-w-4xl bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden text-slate-100 flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-950/70">
          <div className="flex items-center gap-3">
            <img
              src={userProfile.avatar}
              alt={userProfile.name}
              className="w-10 h-10 rounded-full object-cover ring-2 ring-emerald-500/40"
            />
            <div>
              <div className="flex items-center gap-1.5">
                <h2 className="font-extrabold text-base text-white">{userProfile.name}</h2>
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span className="text-[10px] bg-emerald-500/20 text-emerald-300 font-bold px-2 py-0.5 rounded-full border border-emerald-500/30">
                  Foster Verified Merchant
                </span>
              </div>
              <p className="text-xs text-slate-400">{userProfile.handle} • {userProfile.location} • Member since {userProfile.memberSince}</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                onClose();
                onOpenSellModal();
              }}
              className="px-3 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-bold flex items-center gap-1 shadow-md shadow-emerald-500/20 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>List New Accessory</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Dashboard Metrics Grid */}
        <div className="p-6 pb-2 grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="bg-slate-950/60 border border-slate-800 rounded-2xl p-4">
            <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
              <span>Lifetime Volume</span>
              <DollarSign className="w-4 h-4 text-emerald-400" />
            </div>
            <p className="text-xl font-black text-white font-mono">${totalSalesRevenue.toLocaleString()}</p>
            <span className="text-[10px] text-emerald-400 font-medium">↑ +18% this month</span>
          </div>

          <div className="bg-slate-950/60 border border-slate-800 rounded-2xl p-4">
            <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
              <span>Active Listings</span>
              <Package className="w-4 h-4 text-cyan-400" />
            </div>
            <p className="text-xl font-black text-white font-mono">{myListings.length}</p>
            <span className="text-[10px] text-slate-400">Published accessories</span>
          </div>

          <div className="bg-slate-950/60 border border-slate-800 rounded-2xl p-4">
            <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
              <span>Escrow In-Transit</span>
              <ShieldCheck className="w-4 h-4 text-amber-400" />
            </div>
            <p className="text-xl font-black text-amber-400 font-mono">${escrowHolding.toFixed(2)}</p>
            <span className="text-[10px] text-slate-400">Releases upon buyer receipt</span>
          </div>

          <div className="bg-slate-950/60 border border-slate-800 rounded-2xl p-4">
            <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
              <span>Seller Trust Rating</span>
              <TrendingUp className="w-4 h-4 text-pink-400" />
            </div>
            <p className="text-xl font-black text-white font-mono">{userProfile.rating} / 5.0</p>
            <span className="text-[10px] text-emerald-400 font-medium">100% Positive Feedback</span>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="px-6 border-b border-slate-800 flex gap-6 text-xs font-bold pt-3">
          <button
            onClick={() => setActiveTab("listings")}
            className={`pb-3 relative cursor-pointer ${
              activeTab === "listings" ? "text-emerald-400" : "text-slate-400 hover:text-slate-200"
            }`}
          >
            My Active Inventory ({myListings.length})
            {activeTab === "listings" && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-emerald-400 rounded-full" />
            )}
          </button>

          <button
            onClick={() => setActiveTab("payouts")}
            className={`pb-3 relative cursor-pointer ${
              activeTab === "payouts" ? "text-cyan-400" : "text-slate-400 hover:text-slate-200"
            }`}
          >
            Foster Escrow Payouts & Vault
            {activeTab === "payouts" && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-cyan-400 rounded-full" />
            )}
          </button>

          <button
            onClick={() => setActiveTab("profile")}
            className={`pb-3 relative cursor-pointer ${
              activeTab === "profile" ? "text-slate-200" : "text-slate-400 hover:text-slate-200"
            }`}
          >
            Seller Profile & Policies
            {activeTab === "profile" && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-slate-200 rounded-full" />
            )}
          </button>
        </div>

        {/* Tab Content */}
        <div className="overflow-y-auto p-6 flex-1 space-y-4">
          {activeTab === "listings" && (
            <div className="space-y-3">
              {myListings.length === 0 ? (
                <div className="py-12 text-center space-y-3">
                  <Package className="w-12 h-12 text-slate-600 mx-auto" />
                  <h4 className="font-bold text-sm text-slate-300">You have no active listings</h4>
                  <p className="text-xs text-slate-500">
                    List your unused keyboards, mice, docks, or cables to sell directly to verified enthusiasts.
                  </p>
                  <button
                    onClick={() => {
                      onClose();
                      onOpenSellModal();
                    }}
                    className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-bold cursor-pointer"
                  >
                    List Your First Accessory
                  </button>
                </div>
              ) : (
                myListings.map((p) => (
                  <div
                    key={p.id}
                    className="bg-slate-950/60 border border-slate-800 rounded-2xl p-4 flex items-center justify-between gap-4"
                  >
                    <div className="flex items-center gap-3.5 min-w-0">
                      <img
                        src={p.thumbnail || p.images[0]}
                        alt={p.title}
                        className="w-14 h-14 rounded-xl object-cover border border-slate-800 shrink-0"
                      />
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-bold uppercase text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-800/40">
                            {p.condition}
                          </span>
                          <span className="text-xs text-slate-400">{p.subcategory}</span>
                        </div>
                        <h4 className="font-bold text-xs text-white truncate mt-1">{p.title}</h4>
                        <p className="text-xs text-slate-400">
                          Price: <strong className="text-white font-mono">${p.price}</strong> • Stock: {p.stock} units
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <span className="text-[11px] text-emerald-400 bg-emerald-950/60 px-2 py-1 rounded-lg border border-emerald-800/40 hidden sm:inline">
                        Live on Market
                      </span>
                      <button
                        onClick={() => onDeleteProduct(p.id)}
                        className="p-2 rounded-xl bg-slate-800 hover:bg-rose-950 text-slate-400 hover:text-rose-400 border border-slate-700 transition-colors cursor-pointer"
                        title="Remove listing"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {activeTab === "payouts" && (
            <div className="space-y-4">
              <div className="bg-gradient-to-br from-slate-950 to-slate-900 border border-slate-800 rounded-2xl p-5 space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-xs text-slate-400">Available for Instant Payout</span>
                    <h3 className="text-2xl font-black text-white font-mono">$1,450.00</h3>
                  </div>
                  <button
                    onClick={() => alert("Payout of $1,450.00 initiated to your connected Stripe / ACH Bank account.")}
                    className="px-4 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs flex items-center gap-1.5 shadow-lg shadow-emerald-500/20 cursor-pointer"
                  >
                    <Wallet className="w-4 h-4" />
                    <span>Withdraw Funds</span>
                  </button>
                </div>
                <div className="pt-3 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
                  <span>Connected Bank: Chase Bank (•••• 9012)</span>
                  <span className="text-emerald-400 font-medium">Automatic Daily Transfers Active</span>
                </div>
              </div>

              <div className="bg-slate-950/60 border border-slate-800 rounded-2xl p-4 space-y-3">
                <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                  Recent Escrow Transactions & Payouts
                </h4>
                <div className="space-y-2 text-xs">
                  <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-900 border border-slate-800">
                    <div>
                      <p className="font-bold text-white">Sold: TitanDock 40Gbps Thunderbolt 4</p>
                      <p className="text-[11px] text-slate-400">Buyer: David R. • Order #FAT-98214</p>
                    </div>
                    <span className="font-mono font-bold text-emerald-400">+$179.00 (Cleared)</span>
                  </div>

                  <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-900 border border-slate-800">
                    <div>
                      <p className="font-bold text-white">Sold: SoundWave USB-C DAC Amplifier</p>
                      <p className="text-[11px] text-slate-400">Buyer: Marcus K. • Order #FAT-84192</p>
                    </div>
                    <span className="font-mono font-bold text-emerald-400">+$89.00 (Cleared)</span>
                  </div>

                  <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-900 border border-slate-800">
                    <div>
                      <p className="font-bold text-white">Sold: Foster Rapid-Trigger Keyboard (In-Transit)</p>
                      <p className="text-[11px] text-amber-400">Escrow Hold • Releases upon delivery</p>
                    </div>
                    <span className="font-mono font-bold text-amber-400">+$149.00 (Pending)</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === "profile" && (
            <form onSubmit={handleSaveProfile} className="bg-slate-950/60 border border-slate-800 rounded-2xl p-5 space-y-4">
              <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                Store Settings & Verified Merchant Badge
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-[11px] font-bold text-slate-400 uppercase block mb-1">
                    Store / Display Name
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                    required
                  />
                </div>

                <div>
                  <label className="text-[11px] font-bold text-slate-400 uppercase block mb-1">
                    Store Handle
                  </label>
                  <input
                    type="text"
                    value={handle}
                    onChange={(e) => setHandle(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-[11px] font-bold text-slate-400 uppercase block mb-1">
                    Location / Dispatch Hub
                  </label>
                  <input
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-bold text-slate-400 uppercase block mb-1">
                    Seller Bio & Hardware Specialty
                  </label>
                  <input
                    type="text"
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between pt-2">
                {profileSaved ? (
                  <span className="text-xs text-emerald-400 font-bold flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Merchant profile updated!
                  </span>
                ) : (
                  <div />
                )}

                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs cursor-pointer"
                >
                  Save Store Settings
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
