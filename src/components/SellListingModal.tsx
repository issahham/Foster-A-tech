import React, { useState } from "react";
import {
  X,
  Sparkles,
  DollarSign,
  Tag,
  Upload,
  CheckCircle2,
  Image as ImageIcon,
  ArrowRight,
  ArrowLeft,
  ShieldCheck,
  Zap,
  Info
} from "lucide-react";
import { Product, CategoryKey, ConditionGrade } from "../types";
import { CATEGORIES } from "../data/mockProducts";
import { UserProfile } from "../services/storage";

interface SellListingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onListingCreated: (product: Product) => void;
  userProfile: UserProfile;
}

const PRESET_TECH_PHOTOS: Record<string, string[]> = {
  keyboards: [
    "https://images.unsplash.com/photo-1595225476474-87563907a212?auto=format&fit=crop&w=1000&q=80",
    "https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=1000&q=80",
    "https://images.unsplash.com/photo-1618384887929-16ec33fab9ef?auto=format&fit=crop&w=1000&q=80"
  ],
  mice: [
    "https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?auto=format&fit=crop&w=1000&q=80",
    "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?auto=format&fit=crop&w=1000&q=80",
    "https://images.unsplash.com/photo-1626218174358-7769486c4b79?auto=format&fit=crop&w=1000&q=80"
  ],
  monitors: [
    "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?auto=format&fit=crop&w=1000&q=80",
    "https://images.unsplash.com/photo-1593642702821-c8da6771f0c6?auto=format&fit=crop&w=1000&q=80",
    "https://images.unsplash.com/photo-1593642634367-d91a135587b5?auto=format&fit=crop&w=1000&q=80"
  ],
  storage: [
    "https://images.unsplash.com/photo-1544652478-6653e09f18a2?auto=format&fit=crop&w=1000&q=80",
    "https://images.unsplash.com/photo-1597872200969-2b65d56bd16b?auto=format&fit=crop&w=1000&q=80",
    "https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?auto=format&fit=crop&w=1000&q=80"
  ],
  audio: [
    "https://images.unsplash.com/photo-1590602847861-f357a9332bbc?auto=format&fit=crop&w=1000&q=80",
    "https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?auto=format&fit=crop&w=1000&q=80"
  ],
  streaming: [
    "https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=1000&q=80",
    "https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=1000&q=80"
  ],
  cables: [
    "https://images.unsplash.com/photo-1583863788434-e58a36330cf0?auto=format&fit=crop&w=1000&q=80",
    "https://images.unsplash.com/photo-1544652478-6653e09f18a2?auto=format&fit=crop&w=1000&q=80"
  ],
  cooling: [
    "https://images.unsplash.com/photo-1587202372775-e229f172b9d7?auto=format&fit=crop&w=1000&q=80"
  ]
};

export const SellListingModal: React.FC<SellListingModalProps> = ({
  isOpen,
  onClose,
  onListingCreated,
  userProfile,
}) => {
  if (!isOpen) return null;

  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);

  // Listing Form Data
  const [title, setTitle] = useState("");
  const [brand, setBrand] = useState("");
  const [category, setCategory] = useState<CategoryKey>("keyboards");
  const [subcategory, setSubcategory] = useState("Custom Mechanical");
  const [condition, setCondition] = useState<ConditionGrade>("Like New");
  const [price, setPrice] = useState<number>(120);
  const [originalPrice, setOriginalPrice] = useState<number>(160);
  const [stock, setStock] = useState<number>(1);
  const [acceptsOffers, setAcceptsOffers] = useState(true);
  const [minOfferPrice, setMinOfferPrice] = useState<number>(100);
  const [freeShipping, setFreeShipping] = useState(true);
  const [selectedPhoto, setSelectedPhoto] = useState<string>(
    PRESET_TECH_PHOTOS["keyboards"][0]
  );
  const [customPhotoUrl, setCustomPhotoUrl] = useState("");
  const [description, setDescription] = useState("");
  const [features, setFeatures] = useState<string[]>([
    "Tested for zero functional defects",
    "Clean condition with all standard accessories",
    "Includes original packaging and cables"
  ]);
  const [featureInput, setFeatureInput] = useState("");
  const [includedAccessories, setIncludedAccessories] = useState<string>(
    "Original Box, Braided Cable, Manual"
  );
  const [cosmeticScore, setCosmeticScore] = useState("9.8/10 Flawless");

  // AI Appraisal state
  const [isAppraising, setIsAppraising] = useState(false);
  const [aiAppraisalFeedback, setAiAppraisalFeedback] = useState<string | null>(null);

  const handleRunAiAppraise = async () => {
    if (!title.trim()) {
      alert("Please enter an accessory title first (e.g., Apex Pro Magnetic Keyboard).");
      return;
    }

    setIsAppraising(true);
    setAiAppraisalFeedback(null);

    try {
      const res = await fetch("/api/ai/appraise", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          brand: brand || "Enthusiast Brand",
          category,
          condition,
          originalPrice,
          specsNotes: includedAccessories
        })
      });

      const data = await res.json();
      if (data.suggestedPrice) {
        setPrice(data.suggestedPrice);
        if (data.priceRange?.min) setMinOfferPrice(data.priceRange.min);
      }
      if (data.generatedDescription) {
        setDescription(data.generatedDescription);
      }
      if (data.keySellingPoints && Array.isArray(data.keySellingPoints)) {
        setFeatures(data.keySellingPoints);
      }

      setAiAppraisalFeedback(
        `AI Appraisal Complete: Suggested market price is $${data.suggestedPrice || price} with ${data.marketDemand || "High"} market buyer demand.`
      );
    } catch (err) {
      console.error("Appraisal error:", err);
      // Fallback
      const discount = condition === "Brand New" ? 0.9 : condition === "Like New" ? 0.75 : 0.6;
      setPrice(Math.round(originalPrice * discount));
      setAiAppraisalFeedback("Estimated valuation applied based on condition tier.");
    } finally {
      setIsAppraising(false);
    }
  };

  const handleAddFeature = () => {
    if (!featureInput.trim()) return;
    setFeatures([...features, featureInput.trim()]);
    setFeatureInput("");
  };

  const handleRemoveFeature = (idx: number) => {
    setFeatures(features.filter((_, i) => i !== idx));
  };

  const handlePublish = () => {
    const finalPhoto = customPhotoUrl.trim() || selectedPhoto;

    const newProduct: Product = {
      id: `user-prod-${Date.now()}`,
      title: title.trim() || "Custom Computer Accessory",
      brand: brand.trim() || "Custom / Independent",
      category,
      categoryName: CATEGORIES.find((c) => c.id === category)?.label || "Accessories",
      subcategory: subcategory.trim() || "Custom Peripherals",
      condition,
      price: Number(price) || 50,
      originalPrice: Number(originalPrice) || Number(price) * 1.2,
      stock: Number(stock) || 1,
      rating: 5.0,
      reviewCount: 1,
      images: [finalPhoto],
      thumbnail: finalPhoto,
      description:
        description.trim() ||
        `Verified computer accessory in ${condition} condition. Tested and authenticated by seller with Foster Buyer Escrow guarantee.`,
      features: features.length > 0 ? features : ["Inspected and verified functional"],
      specs: {
        "Condition Grade": condition,
        "Included in Box": includedAccessories,
        "Seller Status": "Foster Community Trader",
        "Warranty": "30-Day Foster Escrow Return Guarantee"
      },
      seller: {
        id: userProfile.id,
        name: userProfile.name,
        handle: userProfile.handle,
        verified: true,
        avatar: userProfile.avatar,
        rating: userProfile.rating,
        salesCount: userProfile.totalSales,
        location: userProfile.location,
        responseTime: "< 30 mins",
        memberSince: userProfile.memberSince,
        badge: "Foster Verified Pro"
      },
      acceptsOffers,
      minOfferPrice: acceptsOffers ? Number(minOfferPrice) || Math.round(Number(price) * 0.85) : undefined,
      freeShipping,
      fastDelivery: true,
      isFeatured: false,
      isUserListing: true,
      tags: [brand, category, condition, "User Verified"],
      inspectionReport: {
        functionalTest: true,
        cosmeticScore: cosmeticScore || "9.8/10 Flawless",
        originalPackaging: condition === "Brand New" || condition === "Open Box",
        accessoriesIncluded: includedAccessories.split(",").map((s) => s.trim()),
        testedBy: `Seller ${userProfile.name}`,
        inspectionDate: new Date().toISOString().split("T")[0]
      },
      createdAt: new Date().toISOString()
    };

    onListingCreated(newProduct);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200">
      <div className="relative w-full max-w-3xl bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden text-slate-100 flex flex-col max-h-[92vh]">
        {/* Top Header */}
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-950/70">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 flex items-center justify-center font-bold">
              +
            </div>
            <div>
              <h2 className="font-extrabold text-base text-white">Sell on Foster A Tech Market</h2>
              <p className="text-xs text-slate-400">List computer accessories with escrow buyer protection</p>
            </div>
          </div>

          <button
            id="close-sell-modal"
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Step Indicator */}
        <div className="bg-slate-950/40 border-b border-slate-800/80 px-6 py-2.5 flex items-center justify-between text-xs">
          <div className="flex items-center gap-4">
            <span className={`font-bold ${step >= 1 ? "text-emerald-400" : "text-slate-500"}`}>
              1. Basic Info
            </span>
            <span>→</span>
            <span className={`font-bold ${step >= 2 ? "text-emerald-400" : "text-slate-500"}`}>
              2. Price & AI Appraisal
            </span>
            <span>→</span>
            <span className={`font-bold ${step >= 3 ? "text-emerald-400" : "text-slate-500"}`}>
              3. Photos & Details
            </span>
            <span>→</span>
            <span className={`font-bold ${step >= 4 ? "text-emerald-400" : "text-slate-500"}`}>
              4. Review & Publish
            </span>
          </div>
          <span className="text-slate-400 font-mono">Step {step}/4</span>
        </div>

        {/* Step Content */}
        <div className="overflow-y-auto p-6 space-y-5 flex-1">
          {/* STEP 1: Basic Info */}
          {step === 1 && (
            <div className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block mb-1.5">
                  Category *
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {CATEGORIES.filter((c) => c.id !== "all").map((cat) => (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => {
                        setCategory(cat.id);
                        setSelectedPhoto(PRESET_TECH_PHOTOS[cat.id]?.[0] || PRESET_TECH_PHOTOS.keyboards[0]);
                      }}
                      className={`p-2.5 rounded-xl border text-left text-xs font-semibold transition-all cursor-pointer ${
                        category === cat.id
                          ? "bg-emerald-500/20 border-emerald-500 text-emerald-300 shadow-sm"
                          : "bg-slate-950/60 border-slate-800 text-slate-400 hover:text-white"
                      }`}
                    >
                      {cat.shortLabel}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block mb-1">
                    Accessory Title / Model *
                  </label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g. ApexPro 75% Rapid-Trigger Keyboard"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-emerald-500"
                    required
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block mb-1">
                    Brand *
                  </label>
                  <input
                    type="text"
                    value={brand}
                    onChange={(e) => setBrand(e.target.value)}
                    placeholder="e.g. Foster Dynamics, AeroTech, Razer, Logitech"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-emerald-500"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block mb-1">
                    Subcategory
                  </label>
                  <input
                    type="text"
                    value={subcategory}
                    onChange={(e) => setSubcategory(e.target.value)}
                    placeholder="e.g. Custom Mechanical, Ultralight Mouse, Thunderbolt Dock"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block mb-1">
                    Condition Grade *
                  </label>
                  <select
                    value={condition}
                    onChange={(e) => setCondition(e.target.value as ConditionGrade)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-emerald-500"
                  >
                    <option value="Brand New">Brand New (Factory Sealed)</option>
                    <option value="Like New">Like New (Mint condition, opened for inspection)</option>
                    <option value="Open Box">Open Box (Tested, complete original accessories)</option>
                    <option value="Refurbished">Refurbished (Class A cosmetic, tested)</option>
                    <option value="Good / Pre-Owned">Good / Pre-Owned (Fully operational, minor signs of use)</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* STEP 2: Price & AI Appraisal */}
          {step === 2 && (
            <div className="space-y-4">
              {/* AI Appraisal Banner */}
              <div className="p-4 rounded-2xl bg-gradient-to-r from-emerald-950/60 to-cyan-950/60 border border-emerald-500/40 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-emerald-400" />
                    <div>
                      <h4 className="text-xs font-bold text-white">AI Market Price Appraiser & Listing Copywriter</h4>
                      <p className="text-[11px] text-slate-400">Calculates second-hand market value and crafts technical descriptions.</p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={handleRunAiAppraise}
                    disabled={isAppraising}
                    className="px-3.5 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 disabled:opacity-50 text-slate-950 font-bold text-xs flex items-center gap-1.5 shadow-md shadow-emerald-500/20 cursor-pointer"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>{isAppraising ? "Evaluating..." : "Run AI Appraisal"}</span>
                  </button>
                </div>

                {aiAppraisalFeedback && (
                  <p className="text-xs text-emerald-300 font-medium bg-emerald-950/80 p-2.5 rounded-xl border border-emerald-500/30">
                    {aiAppraisalFeedback}
                  </p>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block mb-1">
                    Your Asking Price ($ USD) *
                  </label>
                  <div className="relative">
                    <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 font-bold">$</span>
                    <input
                      type="number"
                      min="1"
                      value={price}
                      onChange={(e) => setPrice(Number(e.target.value))}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-8 pr-3.5 py-2.5 text-sm text-white font-mono font-bold focus:outline-none focus:border-emerald-500"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block mb-1">
                    Original Retail MSRP ($ USD)
                  </label>
                  <div className="relative">
                    <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 font-bold">$</span>
                    <input
                      type="number"
                      min="1"
                      value={originalPrice}
                      onChange={(e) => setOriginalPrice(Number(e.target.value))}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-8 pr-3.5 py-2.5 text-sm text-white font-mono focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                </div>
              </div>

              {/* Offers & Negotiation Toggle */}
              <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-xs font-bold text-white">Accept Buyer Offers (Negotiation)</h4>
                    <p className="text-[11px] text-slate-400">Buyers can submit counter-offers for your review.</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={acceptsOffers}
                    onChange={(e) => setAcceptsOffers(e.target.checked)}
                    className="w-4 h-4 accent-emerald-500 rounded cursor-pointer"
                  />
                </div>

                {acceptsOffers && (
                  <div className="pt-2 border-t border-slate-800">
                    <label className="text-xs font-bold text-slate-400 block mb-1">
                      Minimum Offer Floor ($ USD)
                    </label>
                    <input
                      type="number"
                      min="1"
                      value={minOfferPrice}
                      onChange={(e) => setMinOfferPrice(Number(e.target.value))}
                      className="w-full sm:w-1/2 bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white font-mono"
                    />
                    <span className="text-[10px] text-slate-500 block mt-1">Offers below this amount are automatically declined.</span>
                  </div>
                )}
              </div>

              <div className="flex items-center gap-3 bg-slate-950/70 p-3.5 rounded-2xl border border-slate-800">
                <input
                  type="checkbox"
                  checked={freeShipping}
                  onChange={(e) => setFreeShipping(e.target.checked)}
                  className="w-4 h-4 accent-emerald-500 rounded cursor-pointer"
                />
                <div>
                  <span className="text-xs font-bold text-white block">Offer Free Expedited Shipping</span>
                  <span className="text-[11px] text-slate-400">Listings with free shipping sell 2.4x faster on Foster A Tech.</span>
                </div>
              </div>
            </div>
          )}

          {/* STEP 3: Photos & Descriptions */}
          {step === 3 && (
            <div className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block mb-2">
                  Select Gear Photography or Provide Custom URL
                </label>
                <div className="grid grid-cols-3 gap-3 mb-3">
                  {(PRESET_TECH_PHOTOS[category] || PRESET_TECH_PHOTOS.keyboards).map((photoUrl, idx) => (
                    <div
                      key={idx}
                      onClick={() => {
                        setSelectedPhoto(photoUrl);
                        setCustomPhotoUrl("");
                      }}
                      className={`relative aspect-[4/3] rounded-xl overflow-hidden border-2 cursor-pointer transition-all ${
                        selectedPhoto === photoUrl && !customPhotoUrl
                          ? "border-emerald-400 ring-2 ring-emerald-500/30 scale-105"
                          : "border-slate-800 opacity-60 hover:opacity-100"
                      }`}
                    >
                      <img src={photoUrl} alt="Preset tech gear" className="w-full h-full object-cover" />
                    </div>
                  ))}
                </div>

                <div className="relative">
                  <span className="text-[11px] text-slate-400 block mb-1">Or paste custom image URL:</span>
                  <input
                    type="url"
                    value={customPhotoUrl}
                    onChange={(e) => setCustomPhotoUrl(e.target.value)}
                    placeholder="https://..."
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block mb-1">
                  Product Description & Condition Notes
                </label>
                <textarea
                  rows={4}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Describe the condition, acoustic feel, switch type, port compatibility, or included cables..."
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3.5 text-xs text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block mb-1">
                  What's Included in the Box?
                </label>
                <input
                  type="text"
                  value={includedAccessories}
                  onChange={(e) => setIncludedAccessories(e.target.value)}
                  placeholder="e.g. Original Box, USB-C Paracord Cable, Extra Keycaps, VESA Screws"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-emerald-500"
                />
              </div>
            </div>
          )}

          {/* STEP 4: Review & Publish */}
          {step === 4 && (
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-emerald-950/40 border border-emerald-500/30 flex items-start gap-3">
                <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-xs font-bold text-white">Foster Seller Protection Enabled</h4>
                  <p className="text-[11px] text-slate-300 mt-0.5">
                    Your listing will be instantly live on the marketplace. Buyer payment will be deposited into your Foster Escrow balance immediately upon confirmed delivery.
                  </p>
                </div>
              </div>

              <div className="bg-slate-950/70 border border-slate-800 rounded-2xl p-4 space-y-3">
                <div className="flex gap-4 items-center">
                  <img
                    src={customPhotoUrl || selectedPhoto}
                    alt="Listing preview"
                    className="w-20 h-20 rounded-xl object-cover border border-slate-800"
                  />
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-800/40">
                      {condition}
                    </span>
                    <h3 className="font-bold text-sm text-white mt-1">{title || "Untitled Accessory"}</h3>
                    <p className="text-xs text-slate-400">{brand} • {subcategory}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 border-t border-slate-800 text-xs">
                  <div>
                    <span className="text-slate-500 block text-[10px]">Price</span>
                    <span className="font-mono font-bold text-white">${price}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[10px]">MSRP</span>
                    <span className="font-mono text-slate-400">${originalPrice}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[10px]">Offers</span>
                    <span className="text-amber-400 font-medium">{acceptsOffers ? "Enabled" : "Disabled"}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[10px]">Shipping</span>
                    <span className="text-emerald-400 font-medium">{freeShipping ? "Free" : "Buyer Pays"}</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer Navigation Controls */}
        <div className="px-6 py-4 border-t border-slate-800 flex items-center justify-between bg-slate-950/70">
          {step > 1 ? (
            <button
              type="button"
              onClick={() => setStep((s) => (s - 1) as any)}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back</span>
            </button>
          ) : (
            <div />
          )}

          {step < 4 ? (
            <button
              type="button"
              onClick={() => {
                if (step === 1 && !title.trim()) {
                  alert("Please enter a title for your accessory.");
                  return;
                }
                setStep((s) => (s + 1) as any);
              }}
              className="px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-black flex items-center gap-1.5 shadow-md shadow-emerald-500/20 transition-all cursor-pointer"
            >
              <span>Next Step</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          ) : (
            <button
              type="button"
              id="publish-listing-btn"
              onClick={handlePublish}
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 text-xs font-black flex items-center gap-1.5 shadow-lg shadow-emerald-500/30 active:scale-95 transition-all cursor-pointer"
            >
              <Zap className="w-4 h-4" />
              <span>Publish Listing to Market</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
