import React, { useState } from "react";
import {
  X,
  Star,
  CheckCircle2,
  ShieldCheck,
  Truck,
  RotateCcw,
  Tag,
  Heart,
  ShoppingCart,
  Layers,
  Sparkles,
  Cpu,
  HelpCircle,
  MessageSquare,
  ThumbsUp,
  Share2,
  ArrowRight,
  Send,
  Sliders,
  Check,
  AlertCircle
} from "lucide-react";
import { Product, Review, QuestionAnswer } from "../types";

interface ProductDetailModalProps {
  product: Product | null;
  onClose: () => void;
  onAddToCart: (product: Product) => void;
  onMakeOffer: (product: Product) => void;
  isWishlisted: boolean;
  onToggleWishlist: (productId: string) => void;
  isCompared: boolean;
  onToggleCompare: (productId: string) => void;
  reviews: Review[];
  questions: QuestionAnswer[];
  onAddReview: (review: Review) => void;
  onAddQuestion: (qa: QuestionAnswer) => void;
}

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({
  product,
  onClose,
  onAddToCart,
  onMakeOffer,
  isWishlisted,
  onToggleWishlist,
  isCompared,
  onToggleCompare,
  reviews,
  questions,
  onAddReview,
  onAddQuestion,
}) => {
  if (!product) return null;

  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [activeTab, setActiveTab] = useState<"overview" | "specs" | "inspection" | "compatibility" | "reviews" | "qa">("overview");

  // Compatibility checker state
  const [userOS, setUserOS] = useState<string>("Windows 11");
  const [userDevice, setUserDevice] = useState<string>("Custom Desktop PC");
  const [userPorts, setUserPorts] = useState<string>("USB-C & USB-A 3.2");
  const [compatibilityResult, setCompatibilityResult] = useState<{
    score: number;
    verdict: string;
    notes: string;
  }>({
    score: 99,
    verdict: "100% Plug & Play Compatible",
    notes: `This ${product.title} delivers full performance bandwidth on ${userOS} via standard ${userPorts} without third-party driver prerequisites.`
  });

  // Interactive review form state
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [newRating, setNewRating] = useState(5);
  const [newTitle, setNewTitle] = useState("");
  const [newComment, setNewComment] = useState("");
  const [newSetupNote, setNewSetupNote] = useState("");

  // Interactive question form state
  const [showQuestionForm, setShowQuestionForm] = useState(false);
  const [newQuestionText, setNewQuestionText] = useState("");

  const [copiedLink, setCopiedLink] = useState(false);

  const productReviews = reviews.filter((r) => r.productId === product.id);
  const productQuestions = questions.filter((q) => q.productId === product.id);

  const handleShare = () => {
    navigator.clipboard?.writeText(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const handleCheckCompatibility = () => {
    const isMac = userOS.includes("macOS");
    let verdict = "100% Plug & Play Compatible";
    let score = 99;
    let notes = `Verified optimal compatibility for ${product.title} on ${userOS} with ${userDevice}.`;

    if (product.category === "keyboards" && isMac) {
      notes = `Fully compatible on macOS. Web configurator works out-of-the-box in Safari/Chrome. Supports standard Option/Command key remap.`;
    } else if (product.category === "storage" && !userPorts.includes("USB-C") && !userPorts.includes("Thunderbolt")) {
      verdict = "Requires USB-A to USB-C Adapter";
      score = 80;
      notes = "Speed will be limited to 5Gbps/10Gbps USB 3.0 speeds instead of full 40Gbps Thunderbolt bandwidth.";
    }

    setCompatibilityResult({
      score,
      verdict,
      notes
    });
  };

  const handleReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    const newRev: Review = {
      id: `rev-${Date.now()}`,
      productId: product.id,
      author: "Alex Foster (Verified Buyer)",
      verified: true,
      rating: newRating,
      date: "Just now",
      title: newTitle.trim() || "Excellent computer accessory!",
      comment: newComment.trim(),
      helpfulCount: 0,
      setupNote: newSetupNote.trim() || `Used on ${userOS}`
    };

    onAddReview(newRev);
    setShowReviewForm(false);
    setNewTitle("");
    setNewComment("");
    setNewSetupNote("");
  };

  const handleQuestionSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newQuestionText.trim()) return;

    const newQ: QuestionAnswer = {
      id: `q-${Date.now()}`,
      productId: product.id,
      question: newQuestionText.trim(),
      askedBy: "You",
      date: "Just now",
      answer: "A verified technician or seller usually answers within 1-2 hours.",
      answeredBy: "Foster Marketplace AI Bot",
      answerDate: "Automated Confirmation"
    };

    onAddQuestion(newQ);
    setShowQuestionForm(false);
    setNewQuestionText("");
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-2 sm:p-4 lg:p-6 animate-in fade-in duration-200">
      <div className="relative w-full max-w-5xl bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden text-slate-100 flex flex-col max-h-[92vh]">
        {/* Modal Top Bar */}
        <div className="px-5 py-3.5 border-b border-slate-800 flex items-center justify-between bg-slate-950/70">
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <span className="font-semibold text-emerald-400">{product.categoryName}</span>
            <span>/</span>
            <span className="text-slate-200 font-medium">{product.subcategory}</span>
            <span>/</span>
            <span className="text-slate-500 hidden sm:inline">SKU: FAT-{product.id.slice(-6).toUpperCase()}</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleShare}
              className="p-2 rounded-xl bg-slate-800/80 hover:bg-slate-800 text-slate-300 hover:text-white transition-colors cursor-pointer text-xs flex items-center gap-1"
              title="Share listing link"
            >
              <Share2 className="w-4 h-4" />
              <span className="hidden sm:inline">{copiedLink ? "Copied Link!" : "Share"}</span>
            </button>

            <button
              onClick={() => onToggleCompare(product.id)}
              className={`p-2 rounded-xl border transition-colors cursor-pointer text-xs flex items-center gap-1 ${
                isCompared
                  ? "bg-indigo-600 border-indigo-500 text-white"
                  : "bg-slate-800/80 border-slate-700 text-slate-300 hover:text-white"
              }`}
              title="Compare side-by-side"
            >
              <Layers className="w-4 h-4" />
              <span className="hidden sm:inline">Compare</span>
            </button>

            <button
              onClick={() => onToggleWishlist(product.id)}
              className={`p-2 rounded-xl border transition-colors cursor-pointer text-xs flex items-center gap-1 ${
                isWishlisted
                  ? "bg-pink-600 border-pink-500 text-white"
                  : "bg-slate-800/80 border-slate-700 text-slate-300 hover:text-pink-400"
              }`}
              title="Save to wishlist"
            >
              <Heart className={`w-4 h-4 ${isWishlisted ? "fill-white" : ""}`} />
            </button>

            <button
              id="close-product-modal"
              onClick={onClose}
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors cursor-pointer ml-1"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Scrollable Body */}
        <div className="overflow-y-auto p-5 sm:p-7 space-y-6">
          {/* Main Hero Showcase Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8">
            {/* Gallery Column */}
            <div className="lg:col-span-7 space-y-3">
              {/* Primary Image View */}
              <div className="relative aspect-[16/11] rounded-2xl overflow-hidden bg-slate-950 border border-slate-800 shadow-inner group">
                <img
                  src={product.images[activeImageIndex] || product.thumbnail}
                  alt={product.title}
                  className="w-full h-full object-cover transition-transform duration-300"
                />

                {/* Condition Badge */}
                <div className="absolute top-3 left-3 flex items-center gap-2">
                  <span className="px-3 py-1 rounded-lg text-xs font-bold uppercase tracking-wider bg-slate-950/80 backdrop-blur-md border border-emerald-500/50 text-emerald-300">
                    {product.condition}
                  </span>
                  {product.inspectionReport && (
                    <span className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-cyan-950/80 backdrop-blur-md border border-cyan-500/40 text-cyan-300 flex items-center gap-1">
                      <ShieldCheck className="w-3.5 h-3.5" /> QA Score: {product.inspectionReport.cosmeticScore.split(" ")[0]}
                    </span>
                  )}
                </div>
              </div>

              {/* Thumbnails */}
              {product.images.length > 1 && (
                <div className="flex items-center gap-3 overflow-x-auto pb-1">
                  {product.images.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => setActiveImageIndex(idx)}
                      className={`relative w-20 h-16 rounded-xl overflow-hidden border-2 transition-all cursor-pointer shrink-0 ${
                        activeImageIndex === idx
                          ? "border-emerald-400 ring-2 ring-emerald-500/20 scale-105"
                          : "border-slate-800 opacity-60 hover:opacity-100"
                      }`}
                    >
                      <img src={img} alt="thumbnail" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}

              {/* Verified Trust Badges */}
              <div className="grid grid-cols-3 gap-2.5 pt-2">
                <div className="bg-slate-950/50 border border-slate-800/80 rounded-xl p-2.5 text-center">
                  <ShieldCheck className="w-4 h-4 text-emerald-400 mx-auto mb-1" />
                  <p className="text-[11px] font-bold text-slate-200">Foster Escrow</p>
                  <p className="text-[10px] text-slate-500">Funds released after test</p>
                </div>
                <div className="bg-slate-950/50 border border-slate-800/80 rounded-xl p-2.5 text-center">
                  <Truck className="w-4 h-4 text-cyan-400 mx-auto mb-1" />
                  <p className="text-[11px] font-bold text-slate-200">Tracked Courier</p>
                  <p className="text-[10px] text-slate-500">Fast insured delivery</p>
                </div>
                <div className="bg-slate-950/50 border border-slate-800/80 rounded-xl p-2.5 text-center">
                  <RotateCcw className="w-4 h-4 text-amber-400 mx-auto mb-1" />
                  <p className="text-[11px] font-bold text-slate-200">30-Day Guarantee</p>
                  <p className="text-[10px] text-slate-500">No-hassle returns</p>
                </div>
              </div>
            </div>

            {/* Buying & Seller Column */}
            <div className="lg:col-span-5 flex flex-col justify-between space-y-4">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">
                    {product.brand}
                  </span>
                  <div className="flex items-center gap-1.5 text-xs">
                    <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                    <span className="font-bold text-white">{product.rating}</span>
                    <span className="text-slate-400">({product.reviewCount} reviews)</span>
                  </div>
                </div>

                <h1 className="text-xl sm:text-2xl font-black text-white leading-snug">
                  {product.title}
                </h1>

                {/* Price Display */}
                <div className="bg-slate-950/70 border border-slate-800 rounded-2xl p-4">
                  <div className="flex items-baseline justify-between">
                    <div>
                      <span className="text-xs text-slate-400 block font-medium">Market Price</span>
                      <div className="flex items-baseline gap-2">
                        <span className="text-3xl font-black text-white font-mono">
                          ${product.price}
                        </span>
                        {product.originalPrice > product.price && (
                          <span className="text-sm text-slate-500 line-through font-mono">
                            MSRP ${product.originalPrice}
                          </span>
                        )}
                      </div>
                    </div>

                    {product.originalPrice > product.price && (
                      <span className="px-2.5 py-1 rounded-lg bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 text-xs font-black">
                        Save ${product.originalPrice - product.price} (
                        {Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}%)
                      </span>
                    )}
                  </div>

                  <div className="mt-3 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-300">
                    <span>Stock: <strong className="text-emerald-400">{product.stock} units available</strong></span>
                    {product.freeShipping && (
                      <span className="text-emerald-400 font-semibold flex items-center gap-1">
                        <Check className="w-3.5 h-3.5" /> Free Expedited Shipping
                      </span>
                    )}
                  </div>
                </div>

                {/* Seller Profile Card */}
                <div className="bg-slate-950/40 border border-slate-800 rounded-2xl p-3.5 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <img
                      src={product.seller.avatar}
                      alt={product.seller.name}
                      className="w-10 h-10 rounded-full object-cover ring-2 ring-emerald-500/30"
                    />
                    <div>
                      <div className="flex items-center gap-1.5">
                        <h4 className="font-bold text-xs text-white">{product.seller.name}</h4>
                        {product.seller.verified && (
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                        )}
                      </div>
                      <p className="text-[11px] text-slate-400">
                        {product.seller.salesCount} Verified Sales • ⭐ {product.seller.rating}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] text-emerald-400 font-medium block">
                      Replies {product.seller.responseTime}
                    </span>
                    <span className="text-[10px] text-slate-500">{product.seller.location}</span>
                  </div>
                </div>
              </div>

              {/* Action Buy Buttons */}
              <div className="space-y-2 pt-2">
                <button
                  id="modal-add-to-cart-btn"
                  onClick={() => {
                    onAddToCart(product);
                    onClose();
                  }}
                  className="w-full py-3.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 active:scale-98 text-slate-950 font-black text-sm flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/25 transition-all cursor-pointer"
                >
                  <ShoppingCart className="w-4 h-4" />
                  <span>Buy Now • ${product.price}</span>
                </button>

                {product.acceptsOffers && (
                  <button
                    id="modal-make-offer-btn"
                    onClick={() => onMakeOffer(product)}
                    className="w-full py-3 rounded-xl bg-slate-800 hover:bg-slate-700/80 text-amber-300 hover:text-amber-200 border border-amber-500/40 text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer"
                  >
                    <Tag className="w-4 h-4" />
                    <span>Make an Offer / Negotiate Price</span>
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Tab Navigation */}
          <div className="border-b border-slate-800 flex items-center gap-2 sm:gap-6 overflow-x-auto text-xs font-bold scrollbar-none">
            <button
              id="tab-overview"
              onClick={() => setActiveTab("overview")}
              className={`pb-3 transition-colors relative cursor-pointer whitespace-nowrap ${
                activeTab === "overview" ? "text-emerald-400" : "text-slate-400 hover:text-slate-200"
              }`}
            >
              Overview & Features
              {activeTab === "overview" && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-emerald-400 rounded-full" />
              )}
            </button>

            <button
              id="tab-specs"
              onClick={() => setActiveTab("specs")}
              className={`pb-3 transition-colors relative cursor-pointer whitespace-nowrap ${
                activeTab === "specs" ? "text-emerald-400" : "text-slate-400 hover:text-slate-200"
              }`}
            >
              Technical Specifications
              {activeTab === "specs" && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-emerald-400 rounded-full" />
              )}
            </button>

            {product.inspectionReport && (
              <button
                id="tab-inspection"
                onClick={() => setActiveTab("inspection")}
                className={`pb-3 transition-colors relative cursor-pointer whitespace-nowrap ${
                  activeTab === "inspection" ? "text-cyan-400" : "text-slate-400 hover:text-slate-200"
                }`}
              >
                QA Inspection Report
                {activeTab === "inspection" && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-cyan-400 rounded-full" />
                )}
              </button>
            )}

            <button
              id="tab-compatibility"
              onClick={() => setActiveTab("compatibility")}
              className={`pb-3 transition-colors relative cursor-pointer whitespace-nowrap ${
                activeTab === "compatibility" ? "text-indigo-400" : "text-slate-400 hover:text-slate-200"
              }`}
            >
              Live Compatibility Checker
              {activeTab === "compatibility" && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-400 rounded-full" />
              )}
            </button>

            <button
              id="tab-reviews"
              onClick={() => setActiveTab("reviews")}
              className={`pb-3 transition-colors relative cursor-pointer whitespace-nowrap ${
                activeTab === "reviews" ? "text-amber-400" : "text-slate-400 hover:text-slate-200"
              }`}
            >
              Reviews ({productReviews.length})
              {activeTab === "reviews" && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-amber-400 rounded-full" />
              )}
            </button>

            <button
              id="tab-qa"
              onClick={() => setActiveTab("qa")}
              className={`pb-3 transition-colors relative cursor-pointer whitespace-nowrap ${
                activeTab === "qa" ? "text-slate-200" : "text-slate-400 hover:text-slate-200"
              }`}
            >
              Q&A ({productQuestions.length})
              {activeTab === "qa" && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-slate-300 rounded-full" />
              )}
            </button>
          </div>

          {/* Tab Content Panes */}
          <div className="min-h-[220px]">
            {/* 1. Overview Tab */}
            {activeTab === "overview" && (
              <div className="space-y-4">
                <div className="bg-slate-950/40 border border-slate-800 rounded-2xl p-5">
                  <h3 className="text-sm font-bold text-white mb-2">Accessory Description</h3>
                  <p className="text-sm text-slate-300 leading-relaxed whitespace-pre-line">
                    {product.description}
                  </p>
                </div>

                <div className="bg-slate-950/40 border border-slate-800 rounded-2xl p-5">
                  <h3 className="text-sm font-bold text-white mb-3">Key Features & Innovations</h3>
                  <ul className="space-y-2">
                    {product.features.map((feat, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-xs sm:text-sm text-slate-300">
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}

            {/* 2. Specs Tab */}
            {activeTab === "specs" && (
              <div className="bg-slate-950/40 border border-slate-800 rounded-2xl p-5">
                <h3 className="text-sm font-bold text-white mb-4">Detailed Technical Specifications</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {Object.entries(product.specs).map(([key, val], idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between p-3 rounded-xl bg-slate-900/80 border border-slate-800"
                    >
                      <span className="text-xs text-slate-400 font-medium">{key}</span>
                      <span className="text-xs font-bold text-slate-100 text-right">{val}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 3. QA Inspection Tab */}
            {activeTab === "inspection" && product.inspectionReport && (
              <div className="bg-slate-950/40 border border-slate-800 rounded-2xl p-5 space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-bold text-white">Foster Certified Inspection Report</h3>
                    <p className="text-xs text-slate-400">
                      Inspected by {product.inspectionReport.testedBy} on {product.inspectionReport.inspectionDate}
                    </p>
                  </div>
                  <div className="px-3 py-1.5 rounded-xl bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-xs font-black">
                    {product.inspectionReport.cosmeticScore}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                  <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 flex items-center gap-3">
                    <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                    <div>
                      <h5 className="text-xs font-bold text-white">Functional Multi-Point Testing</h5>
                      <p className="text-[11px] text-slate-400">All electronics, ports, and switches pass 100% latency & continuity tests.</p>
                    </div>
                  </div>

                  <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 flex items-center gap-3">
                    <CheckCircle2 className="w-5 h-5 text-cyan-400 shrink-0" />
                    <div>
                      <h5 className="text-xs font-bold text-white">Original Packaging</h5>
                      <p className="text-[11px] text-slate-400">{product.inspectionReport.originalPackaging ? "Includes authentic original box & protective inserts." : "Shipped in heavy-duty Foster custom foam box."}</p>
                    </div>
                  </div>
                </div>

                <div className="pt-2">
                  <h4 className="text-xs font-bold text-slate-300 mb-2">Verified Included Accessories in Box:</h4>
                  <div className="flex flex-wrap gap-2">
                    {product.inspectionReport.accessoriesIncluded.map((acc, idx) => (
                      <span key={idx} className="px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800 text-xs text-slate-300 font-mono">
                        ✓ {acc}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* 4. Live Compatibility Tab */}
            {activeTab === "compatibility" && (
              <div className="bg-slate-950/40 border border-slate-800 rounded-2xl p-5 space-y-4">
                <div className="flex items-center gap-2">
                  <Cpu className="w-5 h-5 text-indigo-400" />
                  <h3 className="text-sm font-bold text-white">Interactive Setup Compatibility Checker</h3>
                </div>

                <p className="text-xs text-slate-300">
                  Select your current computer setup to verify driver support, connector bandwidth, and power draw for this accessory.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="text-[11px] font-bold text-slate-400 uppercase">Operating System</label>
                    <select
                      value={userOS}
                      onChange={(e) => setUserOS(e.target.value)}
                      className="w-full mt-1 bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
                    >
                      <option value="Windows 11">Windows 11 (64-bit)</option>
                      <option value="Windows 10">Windows 10</option>
                      <option value="macOS Sequoia / Sonoma">macOS Sequoia / Sonoma (Apple Silicon M1/M2/M3/M4)</option>
                      <option value="macOS (Intel)">macOS (Intel)</option>
                      <option value="Linux (Ubuntu / Arch)">Linux (Ubuntu / Arch)</option>
                      <option value="PlayStation 5 / Xbox">PlayStation 5 / Xbox Series X</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-[11px] font-bold text-slate-400 uppercase">Device Type</label>
                    <select
                      value={userDevice}
                      onChange={(e) => setUserDevice(e.target.value)}
                      className="w-full mt-1 bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
                    >
                      <option value="Custom Desktop PC">Custom Desktop PC</option>
                      <option value="MacBook Pro / Air">MacBook Pro / Air</option>
                      <option value="Gaming Laptop">Gaming Laptop (ASUS/Razer/Lenovo)</option>
                      <option value="Mac Mini / Mac Studio">Mac Mini / Mac Studio</option>
                      <option value="Workstation Rig">Dual-GPU Workstation</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-[11px] font-bold text-slate-400 uppercase">Available Ports</label>
                    <select
                      value={userPorts}
                      onChange={(e) => setUserPorts(e.target.value)}
                      className="w-full mt-1 bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
                    >
                      <option value="Thunderbolt 4 / USB4">Thunderbolt 4 / USB4 (40Gbps)</option>
                      <option value="USB-C 3.2 Gen 2 (10Gbps)">USB-C 3.2 Gen 2 (10Gbps)</option>
                      <option value="USB-A 3.0 & DisplayPort 1.4">USB-A 3.0 & DisplayPort 1.4</option>
                      <option value="USB-A 2.0 Only">Legacy USB-A 2.0</option>
                    </select>
                  </div>
                </div>

                <div className="flex justify-end">
                  <button
                    onClick={handleCheckCompatibility}
                    className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Run Compatibility Diagnostic</span>
                  </button>
                </div>

                {/* Compatibility Output Banner */}
                <div className="p-4 rounded-xl bg-indigo-950/40 border border-indigo-500/40 flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="text-xs font-bold text-white">{compatibilityResult.verdict}</h4>
                      <span className="text-[10px] font-bold bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded">
                        Score: {compatibilityResult.score}%
                      </span>
                    </div>
                    <p className="text-xs text-slate-300 mt-1">{compatibilityResult.notes}</p>
                  </div>
                </div>
              </div>
            )}

            {/* 5. Reviews Tab */}
            {activeTab === "reviews" && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-bold text-white">Verified Customer Reviews</h3>
                    <p className="text-xs text-slate-400">All reviews come from verified buyers on Foster A Tech.</p>
                  </div>
                  <button
                    onClick={() => setShowReviewForm(!showReviewForm)}
                    className="px-3 py-1.5 rounded-xl bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 hover:bg-emerald-500/30 text-xs font-bold transition-all cursor-pointer"
                  >
                    {showReviewForm ? "Cancel" : "+ Write a Review"}
                  </button>
                </div>

                {/* Write Review Form */}
                {showReviewForm && (
                  <form onSubmit={handleReviewSubmit} className="bg-slate-950/60 border border-slate-800 rounded-2xl p-4 space-y-3">
                    <h4 className="text-xs font-bold text-white">Share Your Hands-on Experience</h4>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-slate-400">Rating:</span>
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          type="button"
                          key={star}
                          onClick={() => setNewRating(star)}
                          className="cursor-pointer"
                        >
                          <Star className={`w-5 h-5 ${star <= newRating ? "text-amber-400 fill-amber-400" : "text-slate-600"}`} />
                        </button>
                      ))}
                    </div>

                    <input
                      type="text"
                      value={newTitle}
                      onChange={(e) => setNewTitle(e.target.value)}
                      placeholder="Headline summary (e.g. Incredible response time)"
                      className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                    />

                    <textarea
                      rows={3}
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                      placeholder="Detail your experience, build quality, acoustics, or latency performance..."
                      className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                      required
                    />

                    <input
                      type="text"
                      value={newSetupNote}
                      onChange={(e) => setNewSetupNote(e.target.value)}
                      placeholder="Optional: Your PC/Mac setup config"
                      className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                    />

                    <button
                      type="submit"
                      className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs transition-all cursor-pointer"
                    >
                      Post Review
                    </button>
                  </form>
                )}

                {/* Reviews List */}
                <div className="space-y-3">
                  {productReviews.length === 0 ? (
                    <p className="text-xs text-slate-500 text-center py-6">Be the first to review this accessory!</p>
                  ) : (
                    productReviews.map((rev) => (
                      <div key={rev.id} className="bg-slate-950/40 border border-slate-800 rounded-2xl p-4 space-y-2">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-bold text-white">{rev.author}</span>
                            {rev.verified && (
                              <span className="text-[10px] text-emerald-400 bg-emerald-950/60 border border-emerald-800/40 px-1.5 py-0.2 rounded flex items-center gap-0.5">
                                <Check className="w-2.5 h-2.5" /> Verified Buyer
                              </span>
                            )}
                          </div>
                          <span className="text-[11px] text-slate-500">{rev.date}</span>
                        </div>

                        <div className="flex items-center gap-1">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`w-3.5 h-3.5 ${i < rev.rating ? "text-amber-400 fill-amber-400" : "text-slate-700"}`}
                            />
                          ))}
                          <span className="text-xs font-bold text-slate-200 ml-1.5">{rev.title}</span>
                        </div>

                        <p className="text-xs text-slate-300 leading-relaxed">{rev.comment}</p>

                        {rev.setupNote && (
                          <p className="text-[11px] text-slate-400 italic bg-slate-900/60 px-2.5 py-1 rounded-lg border border-slate-800/60 inline-block">
                            Setup: {rev.setupNote}
                          </p>
                        )}
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}

            {/* 6. Q&A Tab */}
            {activeTab === "qa" && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-bold text-white">Community & Tech Support Q&A</h3>
                    <p className="text-xs text-slate-400">Ask the seller or other verified accessory owners.</p>
                  </div>
                  <button
                    onClick={() => setShowQuestionForm(!showQuestionForm)}
                    className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold border border-slate-700 transition-all cursor-pointer"
                  >
                    {showQuestionForm ? "Cancel" : "+ Ask a Question"}
                  </button>
                </div>

                {/* Question Form */}
                {showQuestionForm && (
                  <form onSubmit={handleQuestionSubmit} className="bg-slate-950/60 border border-slate-800 rounded-2xl p-4 space-y-3">
                    <h4 className="text-xs font-bold text-white">What would you like to know about this accessory?</h4>
                    <textarea
                      rows={2}
                      value={newQuestionText}
                      onChange={(e) => setNewQuestionText(e.target.value)}
                      placeholder="e.g., Does this include the right-angle adapter or work with Linux 6.8 kernel?"
                      className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                      required
                    />
                    <button
                      type="submit"
                      className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs transition-all cursor-pointer"
                    >
                      Submit Question
                    </button>
                  </form>
                )}

                {/* Questions List */}
                <div className="space-y-3">
                  {productQuestions.length === 0 ? (
                    <p className="text-xs text-slate-500 text-center py-6">No questions asked yet. Ask the first question!</p>
                  ) : (
                    productQuestions.map((q) => (
                      <div key={q.id} className="bg-slate-950/40 border border-slate-800 rounded-2xl p-4 space-y-2">
                        <div className="flex items-start gap-2">
                          <HelpCircle className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                          <div>
                            <h4 className="text-xs font-bold text-white">{q.question}</h4>
                            <span className="text-[10px] text-slate-500">Asked by {q.askedBy} • {q.date}</span>
                          </div>
                        </div>

                        {q.answer && (
                          <div className="ml-6 mt-2 p-3 rounded-xl bg-slate-900/90 border border-slate-800 space-y-1">
                            <div className="flex items-center justify-between text-[11px]">
                              <span className="font-bold text-emerald-400">{q.answeredBy}</span>
                              <span className="text-slate-500">{q.answerDate}</span>
                            </div>
                            <p className="text-xs text-slate-300">{q.answer}</p>
                          </div>
                        )}
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
