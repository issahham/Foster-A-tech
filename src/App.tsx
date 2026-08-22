import React, { useState, useEffect, useMemo } from "react";
import {
  Sparkles,
  SlidersHorizontal,
  ArrowUpDown,
  Filter,
  Layers,
  Heart,
  ShoppingCart,
  ShieldCheck,
  CheckCircle2,
  Cpu,
  Zap,
  HelpCircle,
  Truck,
  RotateCcw,
  Tag,
  Search,
  X
} from "lucide-react";
import { Header } from "./components/Header";
import { BannerPromo } from "./components/BannerPromo";
import { ProductCard } from "./components/ProductCard";
import { ProductDetailModal } from "./components/ProductDetailModal";
import { SellListingModal } from "./components/SellListingModal";
import { MakeOfferModal } from "./components/MakeOfferModal";
import { CartDrawer } from "./components/CartDrawer";
import { CheckoutModal } from "./components/CheckoutModal";
import { OrdersTrackerModal } from "./components/OrdersTrackerModal";
import { OffersManagerModal } from "./components/OffersManagerModal";
import { AiAdvisorModal } from "./components/AiAdvisorModal";
import { CompareModal } from "./components/CompareModal";
import { WishlistModal } from "./components/WishlistModal";

import {
  Product,
  CategoryKey,
  ConditionGrade,
  CartItem,
  Order,
  Offer,
  Review,
  QuestionAnswer
} from "./types";
import { CATEGORIES, INITIAL_REVIEWS, INITIAL_QUESTIONS } from "./data/mockProducts";
import {
  getProducts,
  saveProducts,
  getCart,
  saveCart,
  getWishlist,
  saveWishlist,
  getOrders,
  saveOrders,
  getOffers,
  saveOffers,
  getUserProfile,
  saveUserProfile,
  UserProfile
} from "./services/storage";

export default function App() {
  // Main Data States
  const [products, setProducts] = useState<Product[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [offers, setOffers] = useState<Offer[]>([]);
  const [userProfile, setUserProfile] = useState<UserProfile>(getUserProfile());
  const [reviews, setReviews] = useState<Review[]>(INITIAL_REVIEWS);
  const [questions, setQuestions] = useState<QuestionAnswer[]>(INITIAL_QUESTIONS);

  // Filter & Search States
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<CategoryKey>("all");
  const [selectedCondition, setSelectedCondition] = useState<ConditionGrade | "all">("all");
  const [sortBy, setSortBy] = useState<"featured" | "price-asc" | "price-desc" | "rating" | "savings">("featured");
  const [minPriceFilter, setMinPriceFilter] = useState<number | "">("");
  const [maxPriceFilter, setMaxPriceFilter] = useState<number | "">("");
  const [onlyFreeShipping, setOnlyFreeShipping] = useState(false);
  const [onlyVerifiedSellers, setOnlyVerifiedSellers] = useState(false);

  // Comparison State
  const [comparedProductIds, setComparedProductIds] = useState<string[]>([]);

  // Modals & Drawers
  const [selectedDetailProduct, setSelectedDetailProduct] = useState<Product | null>(null);
  const [offerTargetProduct, setOfferTargetProduct] = useState<Product | null>(null);
  const [isSellModalOpen, setIsSellModalOpen] = useState(false);
  const [isCartDrawerOpen, setIsCartDrawerOpen] = useState(false);
  const [isCheckoutModalOpen, setIsCheckoutModalOpen] = useState(false);
  const [isOrdersModalOpen, setIsOrdersModalOpen] = useState(false);
  const [isOffersModalOpen, setIsOffersModalOpen] = useState(false);
  const [isAiAdvisorOpen, setIsAiAdvisorOpen] = useState(false);
  const [isCompareModalOpen, setIsCompareModalOpen] = useState(false);
  const [isWishlistModalOpen, setIsWishlistModalOpen] = useState(false);

  // Active Promo Checkout
  const [appliedPromoForCheckout, setAppliedPromoForCheckout] = useState<{
    code: string;
    discountAmount: number;
  } | undefined>(undefined);

  // Toast System
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage((cur) => (cur === msg ? null : cur));
    }, 3200);
  };

  // Initialize Data
  useEffect(() => {
    setProducts(getProducts());
    setCart(getCart());
    setWishlist(getWishlist());
    setOrders(getOrders());
    setOffers(getOffers());
    setUserProfile(getUserProfile());
  }, []);

  // Save changes
  const handleUpdateProducts = (newProducts: Product[]) => {
    setProducts(newProducts);
    saveProducts(newProducts);
  };

  const handleUpdateCart = (newCart: CartItem[]) => {
    setCart(newCart);
    saveCart(newCart);
  };

  const handleUpdateWishlist = (newWishlist: string[]) => {
    setWishlist(newWishlist);
    saveWishlist(newWishlist);
  };

  const handleUpdateOrders = (newOrders: Order[]) => {
    setOrders(newOrders);
    saveOrders(newOrders);
  };

  const handleUpdateOffers = (newOffers: Offer[]) => {
    setOffers(newOffers);
    saveOffers(newOffers);
  };

  const handleUpdateProfile = (profile: UserProfile) => {
    setUserProfile(profile);
    saveUserProfile(profile);
    showToast("Store profile updated successfully!");
  };

  // Cart Operations
  const handleAddToCart = (product: Product, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    const existingIndex = cart.findIndex((i) => i.product.id === product.id);
    let newCart: CartItem[];
    if (existingIndex > -1) {
      newCart = [...cart];
      newCart[existingIndex].quantity += 1;
    } else {
      newCart = [...cart, { product, quantity: 1, addedAt: new Date().toISOString() }];
    }
    handleUpdateCart(newCart);
    showToast(`Added ${product.title} to cart`);
  };

  const handleUpdateQuantity = (productId: string, qty: number) => {
    if (qty <= 0) {
      handleRemoveFromCart(productId);
      return;
    }
    const newCart = cart.map((i) =>
      i.product.id === productId ? { ...i, quantity: qty } : i
    );
    handleUpdateCart(newCart);
  };

  const handleRemoveFromCart = (productId: string) => {
    const newCart = cart.filter((i) => i.product.id !== productId);
    handleUpdateCart(newCart);
    showToast("Item removed from cart");
  };

  // Wishlist Operations
  const handleToggleWishlist = (productId: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    let newWishlist: string[];
    if (wishlist.includes(productId)) {
      newWishlist = wishlist.filter((id) => id !== productId);
      showToast("Removed from wishlist");
    } else {
      newWishlist = [...wishlist, productId];
      showToast("Saved to wishlist");
    }
    handleUpdateWishlist(newWishlist);
  };

  // Compare Operations
  const handleToggleCompare = (productId: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (comparedProductIds.includes(productId)) {
      setComparedProductIds(comparedProductIds.filter((id) => id !== productId));
      showToast("Removed from comparison");
    } else {
      if (comparedProductIds.length >= 4) {
        showToast("You can compare a maximum of 4 accessories simultaneously");
        return;
      }
      setComparedProductIds([...comparedProductIds, productId]);
      showToast("Added to comparison");
    }
  };

  // Sell Listing Creation
  const handleListingCreated = (newProduct: Product) => {
    const updated = [newProduct, ...products];
    handleUpdateProducts(updated);
    showToast(`"${newProduct.title}" is now live on the marketplace!`);
  };

  // Delete Listing
  const handleDeleteProduct = (productId: string) => {
    const updated = products.filter((p) => p.id !== productId);
    handleUpdateProducts(updated);
    showToast("Listing deleted from market");
  };

  // Make Offer
  const handleOpenOfferModal = (product: Product, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setOfferTargetProduct(product);
  };

  const handleSubmitOffer = (newOffer: Offer) => {
    const updatedOffers = [newOffer, ...offers];
    handleUpdateOffers(updatedOffers);

    // Simulate Seller Response after 4 seconds
    setTimeout(() => {
      const accepted = Math.random() > 0.35;
      const latestOffers = getOffers();
      const updated = latestOffers.map((o) => {
        if (o.id === newOffer.id) {
          return {
            ...o,
            status: (accepted ? "Accepted" : "Countered") as Offer["status"],
            counterAmount: accepted ? undefined : Math.round((newOffer.askingPrice + newOffer.offerAmount) / 2)
          };
        }
        return o;
      });
      handleUpdateOffers(updated);
      showToast(
        accepted
          ? `Seller accepted your offer on "${newOffer.productTitle}"! Ready to complete purchase.`
          : `Seller counter-offered on "${newOffer.productTitle}". Check Offers Hub.`
      );
    }, 4500);
  };

  // Offer Actions in Manager
  const handleAcceptOffer = (offerId: string) => {
    const updated = offers.map((o) =>
      o.id === offerId ? { ...o, status: "Accepted" as Offer["status"] } : o
    );
    handleUpdateOffers(updated);
    showToast("Offer accepted! Escrow authorization ready.");
  };

  const handleDeclineOffer = (offerId: string) => {
    const updated = offers.map((o) =>
      o.id === offerId ? { ...o, status: "Declined" as Offer["status"] } : o
    );
    handleUpdateOffers(updated);
    showToast("Offer declined.");
  };

  const handleCounterOffer = (offerId: string, counterAmount: number) => {
    const updated = offers.map((o) =>
      o.id === offerId
        ? {
            ...o,
            status: "Countered" as Offer["status"],
            counterAmount: counterAmount
          }
        : o
    );
    handleUpdateOffers(updated);
    showToast(`Counter-offer of $${counterAmount} sent to buyer.`);
  };

  const handleBuyOfferAccepted = (offer: Offer) => {
    const targetProduct = products.find((p) => p.id === offer.productId);
    if (targetProduct) {
      // Add discounted item to cart
      const customItem: Product = {
        ...targetProduct,
        price: offer.counterAmount || offer.offerAmount
      };
      handleAddToCart(customItem);
      setIsCartDrawerOpen(true);
    }
  };

  // Checkout and Orders
  const handleInitiateCheckout = (promo?: { code: string; discountAmount: number }) => {
    setAppliedPromoForCheckout(promo);
    setIsCheckoutModalOpen(true);
  };

  const handleOrderPlaced = (newOrder: Order) => {
    const updatedOrders = [newOrder, ...orders];
    handleUpdateOrders(updatedOrders);
    handleUpdateCart([]); // Clear cart
    setIsOrdersModalOpen(true);
    showToast(`Order #${newOrder.id} authorized & deposited in Foster Escrow!`);
  };

  const handleUpdateOrder = (updatedOrder: Order) => {
    const newOrders = orders.map((o) => (o.id === updatedOrder.id ? updatedOrder : o));
    handleUpdateOrders(newOrders);
  };

  // Filtered and Sorted Products
  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      // Category filter
      if (selectedCategory !== "all" && p.category !== selectedCategory) {
        return false;
      }
      // Condition filter
      if (selectedCondition !== "all" && p.condition !== selectedCondition) {
        return false;
      }
      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesTitle = p.title.toLowerCase().includes(q);
        const matchesBrand = p.brand.toLowerCase().includes(q);
        const matchesSub = p.subcategory.toLowerCase().includes(q);
        const matchesTag = p.tags.some((t) => t.toLowerCase().includes(q));
        if (!matchesTitle && !matchesBrand && !matchesSub && !matchesTag) {
          return false;
        }
      }
      // Price filters
      if (minPriceFilter !== "" && p.price < minPriceFilter) return false;
      if (maxPriceFilter !== "" && p.price > maxPriceFilter) return false;

      // Free shipping
      if (onlyFreeShipping && !p.freeShipping) return false;

      // Verified sellers
      if (onlyVerifiedSellers && !p.seller.verified) return false;

      return true;
    });
  }, [
    products,
    selectedCategory,
    selectedCondition,
    searchQuery,
    minPriceFilter,
    maxPriceFilter,
    onlyFreeShipping,
    onlyVerifiedSellers
  ]);

  const sortedProducts = useMemo(() => {
    const list = [...filteredProducts];
    if (sortBy === "price-asc") {
      list.sort((a, b) => a.price - b.price);
    } else if (sortBy === "price-desc") {
      list.sort((a, b) => b.price - a.price);
    } else if (sortBy === "rating") {
      list.sort((a, b) => b.rating - a.rating || b.reviewCount - a.reviewCount);
    } else if (sortBy === "savings") {
      list.sort((a, b) => (b.originalPrice - b.price) - (a.originalPrice - a.price));
    } else {
      // Featured: default order with featured first
      list.sort((a, b) => (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0));
    }
    return list;
  }, [filteredProducts, sortBy]);

  const comparedProducts = useMemo(() => {
    return products.filter((p) => comparedProductIds.includes(p.id));
  }, [products, comparedProductIds]);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-emerald-500 selection:text-slate-950">
      {/* Top Header */}
      <Header
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        selectedCategory={selectedCategory}
        onSelectCategory={setSelectedCategory}
        cartCount={cart.reduce((acc, item) => acc + item.quantity, 0)}
        wishlistCount={wishlist.length}
        offersCount={offers.length}
        ordersCount={orders.length}
        onOpenCart={() => setIsCartDrawerOpen(true)}
        onOpenWishlist={() => setIsWishlistModalOpen(true)}
        onOpenOffers={() => setIsOffersModalOpen(true)}
        onOpenOrders={() => setIsOrdersModalOpen(true)}
        onOpenSellModal={() => setIsSellModalOpen(true)}
        onOpenAiAdvisor={() => setIsAiAdvisorOpen(true)}
        onOpenSellerDashboard={() => setIsSellModalOpen(true)}
        userProfile={userProfile}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Marketplace Banner & Trust Guarantee */}
        <BannerPromo
          onSelectConditionFilter={setSelectedCondition}
          activeCondition={selectedCondition}
          onOpenSellModal={() => setIsSellModalOpen(true)}
          onOpenAiAdvisor={() => setIsAiAdvisorOpen(true)}
        />

        {/* Filter Bar & Controls */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 mb-6 backdrop-blur-md shadow-lg space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-3">
            {/* Category Pills Bar */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 max-w-full scrollbar-none">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat.id}
                  id={`cat-btn-${cat.id}`}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                    selectedCategory === cat.id
                      ? "bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20 scale-102"
                      : "bg-slate-950/60 text-slate-400 hover:text-white border border-slate-800 hover:border-slate-700"
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>

            {/* Sort Dropdown */}
            <div className="flex items-center gap-2 self-end sm:self-auto shrink-0">
              <span className="text-xs text-slate-400 font-medium hidden sm:inline">Sort:</span>
              <div className="relative">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-white focus:outline-none focus:border-emerald-500 font-medium cursor-pointer"
                >
                  <option value="featured">Featured Picks</option>
                  <option value="price-asc">Price: Low to High</option>
                  <option value="price-desc">Price: High to Low</option>
                  <option value="rating">Highest Rated</option>
                  <option value="savings">Biggest $ Discount</option>
                </select>
              </div>
            </div>
          </div>

          {/* Secondary Quick Filter Toggles (Free Shipping, Verified Sellers, Reset) */}
          <div className="pt-2 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-2 text-xs">
            <div className="flex flex-wrap items-center gap-3">
              <label className="flex items-center gap-1.5 text-slate-300 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={onlyFreeShipping}
                  onChange={(e) => setOnlyFreeShipping(e.target.checked)}
                  className="w-3.5 h-3.5 accent-emerald-500 rounded cursor-pointer"
                />
                <span>Free Expedited Shipping</span>
              </label>

              <label className="flex items-center gap-1.5 text-slate-300 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={onlyVerifiedSellers}
                  onChange={(e) => setOnlyVerifiedSellers(e.target.checked)}
                  className="w-3.5 h-3.5 accent-emerald-500 rounded cursor-pointer"
                />
                <span>Verified Foster Sellers Only</span>
              </label>

              {/* Price Range Filter Inputs */}
              <div className="flex items-center gap-1 text-slate-400">
                <span>Price:</span>
                <input
                  type="number"
                  placeholder="Min $"
                  value={minPriceFilter}
                  onChange={(e) => setMinPriceFilter(e.target.value ? Number(e.target.value) : "")}
                  className="w-16 bg-slate-950 border border-slate-800 rounded-lg px-2 py-1 text-xs text-white font-mono"
                />
                <span>-</span>
                <input
                  type="number"
                  placeholder="Max $"
                  value={maxPriceFilter}
                  onChange={(e) => setMaxPriceFilter(e.target.value ? Number(e.target.value) : "")}
                  className="w-16 bg-slate-950 border border-slate-800 rounded-lg px-2 py-1 text-xs text-white font-mono"
                />
              </div>
            </div>

            <div className="flex items-center gap-3">
              <span className="text-slate-400 font-mono">
                Showing <strong>{sortedProducts.length}</strong> accessories
              </span>

              {(selectedCategory !== "all" ||
                selectedCondition !== "all" ||
                searchQuery ||
                minPriceFilter !== "" ||
                maxPriceFilter !== "" ||
                onlyFreeShipping ||
                onlyVerifiedSellers) && (
                <button
                  onClick={() => {
                    setSelectedCategory("all");
                    setSelectedCondition("all");
                    setSearchQuery("");
                    setMinPriceFilter("");
                    setMaxPriceFilter("");
                    setOnlyFreeShipping(false);
                    setOnlyVerifiedSellers(false);
                  }}
                  className="text-emerald-400 hover:text-emerald-300 underline font-medium cursor-pointer"
                >
                  Reset filters
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Product Catalog Grid */}
        {sortedProducts.length === 0 ? (
          <div className="py-20 text-center bg-slate-900/40 border border-slate-800/80 rounded-3xl p-8 space-y-4">
            <div className="w-16 h-16 rounded-3xl bg-slate-800 border border-slate-700 mx-auto flex items-center justify-center text-slate-500">
              <Search className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-bold text-white">No computer accessories found</h3>
            <p className="text-xs text-slate-400 max-w-sm mx-auto">
              No items match your active filters or search query. Try broadening your keywords or reset active filters.
            </p>
            <div className="pt-2 flex justify-center gap-3">
              <button
                onClick={() => {
                  setSelectedCategory("all");
                  setSelectedCondition("all");
                  setSearchQuery("");
                  setMinPriceFilter("");
                  setMaxPriceFilter("");
                  setOnlyFreeShipping(false);
                  setOnlyVerifiedSellers(false);
                }}
                className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-bold transition-all cursor-pointer"
              >
                Clear All Filters
              </button>
              <button
                onClick={() => setIsSellModalOpen(true)}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold border border-slate-700 transition-all cursor-pointer"
              >
                List This Accessory for Sale
              </button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {sortedProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onViewDetails={setSelectedDetailProduct}
                onAddToCart={handleAddToCart}
                onMakeOffer={handleOpenOfferModal}
                isWishlisted={wishlist.includes(product.id)}
                onToggleWishlist={handleToggleWishlist}
                isCompared={comparedProductIds.includes(product.id)}
                onToggleCompare={handleToggleCompare}
              />
            ))}
          </div>
        )}

        {/* Why Foster A Tech Pillars Section */}
        <section className="mt-14 pt-10 border-t border-slate-800/80 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5 space-y-2">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center mb-3">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold text-white">Foster Escrow Buyer Protection</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              When you purchase gear, funds remain locked safely in escrow. Sellers receive payouts only after you receive, unbox, and test hardware functionality.
            </p>
          </div>

          <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5 space-y-2">
            <div className="w-10 h-10 rounded-xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center mb-3">
              <Cpu className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold text-white">Multi-Point QA Inspection</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Every open-box and pre-owned accessory features a multi-point inspection report: switch debounce latency, port signal bandwidth, and cosmetic rating.
            </p>
          </div>

          <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5 space-y-2">
            <div className="w-10 h-10 rounded-xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center mb-3">
              <Sparkles className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold text-white">AI Setup Compatibility Advisor</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Powered by Gemini, our setup engine calculates whether keyboards, docks, and high-frequency mice are 100% compatible with your exact PC/Mac rig.
            </p>
          </div>
        </section>
      </main>

      {/* Floating Compare Bar */}
      {comparedProductIds.length > 0 && (
        <div className="fixed bottom-5 left-1/2 -translate-x-1/2 z-40 bg-slate-900/95 border border-indigo-500/50 shadow-2xl rounded-2xl px-5 py-3 flex items-center gap-4 backdrop-blur-md animate-in slide-in-from-bottom duration-300">
          <div className="flex items-center gap-2">
            <Layers className="w-4 h-4 text-indigo-400" />
            <span className="text-xs font-bold text-white">
              {comparedProductIds.length} accessories selected for comparison
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsCompareModalOpen(true)}
              className="px-3.5 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition-all cursor-pointer shadow-md shadow-indigo-600/20"
            >
              Compare Side-by-Side
            </button>
            <button
              onClick={() => setComparedProductIds([])}
              className="p-1 text-slate-400 hover:text-white cursor-pointer"
              title="Dismiss comparison"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-5 right-5 z-50 bg-emerald-500 text-slate-950 font-bold text-xs px-4 py-3 rounded-2xl shadow-2xl flex items-center gap-2 animate-in fade-in slide-in-from-bottom-2 duration-200">
          <CheckCircle2 className="w-4 h-4 text-slate-950 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Footer */}
      <footer className="mt-16 bg-slate-950 border-t border-slate-900 py-10 text-slate-400 text-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="space-y-2.5">
            <div className="flex items-center gap-2 text-white font-black text-base">
              <span className="w-6 h-6 rounded-lg bg-emerald-500 text-slate-950 flex items-center justify-center font-mono text-xs">
                FAT
              </span>
              <span>Foster A Tech</span>
            </div>
            <p className="text-slate-500 text-[11px] leading-relaxed">
              The authenticated marketplace for new, open-box, and enthusiast computer accessories. Built with escrow security, multi-point hardware verification, and AI setup diagnostics.
            </p>
          </div>

          <div>
            <h4 className="font-bold text-white uppercase text-[11px] tracking-wider mb-3">Accessory Categories</h4>
            <ul className="space-y-1.5 text-[11px] text-slate-400">
              <li><button onClick={() => setSelectedCategory("keyboards")} className="hover:text-emerald-400 cursor-pointer">Hall Effect & Custom Keyboards</button></li>
              <li><button onClick={() => setSelectedCategory("mice")} className="hover:text-emerald-400 cursor-pointer">8000Hz Ultralight Gaming Mice</button></li>
              <li><button onClick={() => setSelectedCategory("monitors")} className="hover:text-emerald-400 cursor-pointer">OLED & Heavy-Duty Monitor Arms</button></li>
              <li><button onClick={() => setSelectedCategory("storage")} className="hover:text-emerald-400 cursor-pointer">Thunderbolt 4 & 40Gbps Docks</button></li>
              <li><button onClick={() => setSelectedCategory("audio")} className="hover:text-emerald-400 cursor-pointer">Lossless DACs & Studio Audio</button></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-white uppercase text-[11px] tracking-wider mb-3">Marketplace Guarantees</h4>
            <ul className="space-y-1.5 text-[11px] text-slate-400">
              <li className="flex items-center gap-1.5"><ShieldCheck className="w-3.5 h-3.5 text-emerald-400" /> Foster Escrow 30-Day Policy</li>
              <li className="flex items-center gap-1.5"><Truck className="w-3.5 h-3.5 text-cyan-400" /> Insured Fast Courier Dispatch</li>
              <li className="flex items-center gap-1.5"><RotateCcw className="w-3.5 h-3.5 text-amber-400" /> No-Hassle Verified Returns</li>
              <li className="flex items-center gap-1.5"><Sparkles className="w-3.5 h-3.5 text-indigo-400" /> AI Pricing & Hardware Appraisal</li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-white uppercase text-[11px] tracking-wider mb-3">Merchant & Support</h4>
            <p className="text-[11px] text-slate-500 mb-2">
              Have questions about selling hardware or order escrow?
            </p>
            <div className="space-y-1.5 text-[11px]">
              <p className="text-slate-300">Support: <strong>support@fosteratech.io</strong></p>
              <p className="text-slate-300">Seller Hotline: <strong>1-800-FOSTER-TECH</strong></p>
              <p className="text-slate-500">San Francisco, CA • Dispatch Logistics Hub</p>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8 pt-6 border-t border-slate-900 flex flex-wrap items-center justify-between gap-4 text-[11px] text-slate-600">
          <p>© {new Date().getFullYear()} Foster A Tech Inc. All computer accessories authentic and escrow-protected.</p>
          <div className="flex items-center gap-4">
            <span className="hover:text-slate-400 cursor-pointer">Terms of Service</span>
            <span className="hover:text-slate-400 cursor-pointer">Privacy Policy</span>
            <span className="hover:text-slate-400 cursor-pointer">Escrow Rules</span>
          </div>
        </div>
      </footer>

      {/* Modals & Drawers */}
      <ProductDetailModal
        product={selectedDetailProduct}
        onClose={() => setSelectedDetailProduct(null)}
        onAddToCart={handleAddToCart}
        onMakeOffer={(p) => handleOpenOfferModal(p)}
        isWishlisted={selectedDetailProduct ? wishlist.includes(selectedDetailProduct.id) : false}
        onToggleWishlist={handleToggleWishlist}
        isCompared={selectedDetailProduct ? comparedProductIds.includes(selectedDetailProduct.id) : false}
        onToggleCompare={handleToggleCompare}
        reviews={reviews}
        questions={questions}
        onAddReview={(rev) => {
          setReviews([rev, ...reviews]);
          showToast("Review submitted! Thank you for helping the community.");
        }}
        onAddQuestion={(q) => {
          setQuestions([q, ...questions]);
          showToast("Question posted! Sellers & Foster AI bot will respond promptly.");
        }}
      />

      <SellListingModal
        isOpen={isSellModalOpen}
        onClose={() => setIsSellModalOpen(false)}
        onListingCreated={handleListingCreated}
        userProfile={userProfile}
      />

      <MakeOfferModal
        product={offerTargetProduct}
        isOpen={!!offerTargetProduct}
        onClose={() => setOfferTargetProduct(null)}
        onSubmitOffer={handleSubmitOffer}
      />

      <CartDrawer
        isOpen={isCartDrawerOpen}
        onClose={() => setIsCartDrawerOpen(false)}
        cart={cart}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveFromCart}
        onCheckout={handleInitiateCheckout}
      />

      <CheckoutModal
        isOpen={isCheckoutModalOpen}
        onClose={() => setIsCheckoutModalOpen(false)}
        cart={cart}
        appliedPromo={appliedPromoForCheckout}
        onOrderPlaced={handleOrderPlaced}
      />

      <OrdersTrackerModal
        isOpen={isOrdersModalOpen}
        onClose={() => setIsOrdersModalOpen(false)}
        orders={orders}
        onUpdateOrder={handleUpdateOrder}
      />

      <OffersManagerModal
        isOpen={isOffersModalOpen}
        onClose={() => setIsOffersModalOpen(false)}
        offers={offers}
        onAcceptOffer={handleAcceptOffer}
        onDeclineOffer={handleDeclineOffer}
        onCounterOffer={handleCounterOffer}
        onBuyOfferAccepted={handleBuyOfferAccepted}
      />

      <AiAdvisorModal
        isOpen={isAiAdvisorOpen}
        onClose={() => setIsAiAdvisorOpen(false)}
        products={products}
        onSelectProduct={(p) => setSelectedDetailProduct(p)}
      />

      <CompareModal
        isOpen={isCompareModalOpen}
        onClose={() => setIsCompareModalOpen(false)}
        comparedProducts={comparedProducts}
        onRemoveFromCompare={(id) => setComparedProductIds(comparedProductIds.filter((cid) => cid !== id))}
        onClearCompare={() => setComparedProductIds([])}
        onAddToCart={handleAddToCart}
      />

      <WishlistModal
        isOpen={isWishlistModalOpen}
        onClose={() => setIsWishlistModalOpen(false)}
        wishlistProductIds={wishlist}
        products={products}
        onRemoveFromWishlist={handleToggleWishlist}
        onAddToCart={handleAddToCart}
      />
    </div>
  );
}
