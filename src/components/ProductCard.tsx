import React from "react";
import {
  Star,
  CheckCircle,
  Heart,
  ShoppingCart,
  Layers,
  ArrowUpRight,
  ShieldCheck,
  Tag,
  Zap
} from "lucide-react";
import { Product } from "../types";

interface ProductCardProps {
  product: Product;
  onViewDetails: (product: Product) => void;
  onAddToCart: (product: Product, e: React.MouseEvent) => void;
  onMakeOffer: (product: Product, e: React.MouseEvent) => void;
  isWishlisted: boolean;
  onToggleWishlist: (productId: string, e: React.MouseEvent) => void;
  isCompared: boolean;
  onToggleCompare: (productId: string, e: React.MouseEvent) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onViewDetails,
  onAddToCart,
  onMakeOffer,
  isWishlisted,
  onToggleWishlist,
  isCompared,
  onToggleCompare,
}) => {
  const discountPercent =
    product.originalPrice > product.price
      ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
      : 0;

  const getConditionBadgeColor = (condition: string) => {
    switch (condition) {
      case "Brand New":
        return "bg-emerald-500/20 text-emerald-300 border-emerald-500/40";
      case "Like New":
        return "bg-teal-500/20 text-teal-300 border-teal-500/40";
      case "Open Box":
        return "bg-cyan-500/20 text-cyan-300 border-cyan-500/40";
      case "Refurbished":
        return "bg-amber-500/20 text-amber-300 border-amber-500/40";
      default:
        return "bg-slate-500/20 text-slate-300 border-slate-500/40";
    }
  };

  return (
    <div
      id={`product-card-${product.id}`}
      onClick={() => onViewDetails(product)}
      className="group relative bg-slate-900/90 hover:bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl hover:shadow-emerald-500/5 transition-all duration-300 flex flex-col cursor-pointer"
    >
      {/* Image Container */}
      <div className="relative w-full aspect-[4/3] bg-slate-950 overflow-hidden">
        <img
          src={product.thumbnail || product.images[0]}
          alt={product.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />

        {/* Top Overlay Badges */}
        <div className="absolute top-2.5 left-2.5 right-2.5 flex items-center justify-between pointer-events-none">
          <div className="flex flex-wrap gap-1.5 pointer-events-auto">
            <span
              className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md border backdrop-blur-md ${getConditionBadgeColor(
                product.condition
              )}`}
            >
              {product.condition}
            </span>

            {discountPercent > 0 && (
              <span className="text-[10px] font-black uppercase tracking-wider px-1.5 py-0.5 rounded-md bg-rose-500 text-white shadow-sm flex items-center gap-0.5">
                <Zap className="w-2.5 h-2.5" /> -{discountPercent}%
              </span>
            )}
          </div>

          <div className="flex items-center gap-1.5 pointer-events-auto">
            {/* Compare Button */}
            <button
              id={`btn-compare-${product.id}`}
              onClick={(e) => onToggleCompare(product.id, e)}
              className={`p-1.5 rounded-lg backdrop-blur-md transition-all cursor-pointer ${
                isCompared
                  ? "bg-indigo-600 text-white shadow-sm"
                  : "bg-slate-950/70 text-slate-300 hover:text-white hover:bg-slate-900 border border-slate-700/60"
              }`}
              title={isCompared ? "Remove from comparison" : "Add to side-by-side comparison"}
            >
              <Layers className="w-3.5 h-3.5" />
            </button>

            {/* Wishlist Button */}
            <button
              id={`btn-wishlist-${product.id}`}
              onClick={(e) => onToggleWishlist(product.id, e)}
              className={`p-1.5 rounded-lg backdrop-blur-md transition-all cursor-pointer ${
                isWishlisted
                  ? "bg-pink-600 text-white shadow-sm"
                  : "bg-slate-950/70 text-slate-300 hover:text-pink-400 hover:bg-slate-900 border border-slate-700/60"
              }`}
              title={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
            >
              <Heart className={`w-3.5 h-3.5 ${isWishlisted ? "fill-white" : ""}`} />
            </button>
          </div>
        </div>

        {/* Brand Bar */}
        <div className="absolute bottom-2.5 left-2.5 pointer-events-none">
          <span className="text-[11px] font-bold text-slate-200 bg-slate-950/80 backdrop-blur-md px-2 py-0.5 rounded-md border border-slate-800">
            {product.brand}
          </span>
        </div>
      </div>

      {/* Product Content Details */}
      <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
        <div>
          {/* Rating & Review Count */}
          <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
            <div className="flex items-center gap-1">
              <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
              <span className="font-bold text-slate-200">{product.rating}</span>
              <span className="text-slate-500">({product.reviewCount})</span>
            </div>
            <span className="text-[11px] text-slate-400 truncate max-w-[120px]">
              {product.subcategory}
            </span>
          </div>

          {/* Title */}
          <h3 className="font-bold text-sm text-slate-100 line-clamp-2 group-hover:text-emerald-400 transition-colors leading-snug">
            {product.title}
          </h3>

          {/* Key Spec Tags */}
          <div className="flex flex-wrap gap-1 mt-2.5">
            {product.tags.slice(0, 3).map((tag, idx) => (
              <span
                key={idx}
                className="text-[10px] text-slate-400 bg-slate-800/80 px-2 py-0.5 rounded border border-slate-700/60 font-mono"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>

        {/* Seller Info Line */}
        <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-xs">
          <div className="flex items-center gap-1.5 truncate">
            <img
              src={product.seller.avatar}
              alt={product.seller.name}
              className="w-4 h-4 rounded-full object-cover"
            />
            <span className="text-slate-400 truncate text-[11px]">{product.seller.name}</span>
            {product.seller.verified && (
              <CheckCircle className="w-3 h-3 text-emerald-400 shrink-0" title="Foster Verified Seller" />
            )}
          </div>
          {product.freeShipping && (
            <span className="text-[10px] font-semibold text-emerald-400 bg-emerald-950/60 border border-emerald-800/50 px-1.5 py-0.2 rounded shrink-0">
              Free Ship
            </span>
          )}
        </div>

        {/* Pricing and Action Buttons */}
        <div className="pt-1 flex items-center justify-between gap-2">
          <div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-lg font-extrabold text-white font-mono">
                ${product.price}
              </span>
              {product.originalPrice > product.price && (
                <span className="text-xs text-slate-500 line-through font-mono">
                  ${product.originalPrice}
                </span>
              )}
            </div>
            {product.acceptsOffers && (
              <span className="text-[10px] font-medium text-amber-400 flex items-center gap-0.5">
                <Tag className="w-2.5 h-2.5" /> Offers accepted
              </span>
            )}
          </div>

          <div className="flex items-center gap-1.5">
            {product.acceptsOffers && (
              <button
                id={`btn-offer-${product.id}`}
                onClick={(e) => onMakeOffer(product, e)}
                className="px-2.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-amber-300 hover:text-amber-200 border border-amber-500/30 text-xs font-bold transition-all cursor-pointer"
                title="Negotiate / Send custom offer to seller"
              >
                Offer
              </button>
            )}

            <button
              id={`btn-cart-${product.id}`}
              onClick={(e) => onAddToCart(product, e)}
              className="px-3 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 active:scale-95 text-slate-950 text-xs font-extrabold flex items-center gap-1 shadow-md shadow-emerald-500/20 transition-all cursor-pointer"
              title="Add accessory to cart"
            >
              <ShoppingCart className="w-3.5 h-3.5" />
              <span>Buy</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
