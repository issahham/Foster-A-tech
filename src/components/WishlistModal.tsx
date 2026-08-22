import React from "react";
import { X, Heart, ShoppingCart, Trash2, Tag, Star, ArrowRight } from "lucide-react";
import { Product } from "../types";

interface WishlistModalProps {
  isOpen: boolean;
  onClose: () => void;
  wishlistProductIds: string[];
  products: Product[];
  onRemoveFromWishlist: (productId: string) => void;
  onAddToCart: (product: Product) => void;
}

export const WishlistModal: React.FC<WishlistModalProps> = ({
  isOpen,
  onClose,
  wishlistProductIds,
  products,
  onRemoveFromWishlist,
  onAddToCart,
}) => {
  if (!isOpen) return null;

  const wishlistedItems = products.filter((p) => wishlistProductIds.includes(p.id));

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden text-slate-100 flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-950/70">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-pink-500/20 text-pink-400 border border-pink-500/40 flex items-center justify-center">
              <Heart className="w-4 h-4 fill-pink-400" />
            </div>
            <div>
              <h2 className="font-extrabold text-base text-white">Your Saved Gear Wishlist</h2>
              <p className="text-xs text-slate-400">{wishlistedItems.length} accessories saved for later</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="overflow-y-auto p-6 flex-1 space-y-3">
          {wishlistedItems.length === 0 ? (
            <div className="py-12 text-center space-y-3">
              <Heart className="w-12 h-12 text-slate-600 mx-auto" />
              <h4 className="font-bold text-sm text-slate-300">Your wishlist is empty</h4>
              <p className="text-xs text-slate-500">
                Click the heart icon on any accessory to save it and receive price drop alerts.
              </p>
            </div>
          ) : (
            wishlistedItems.map((product) => (
              <div
                key={product.id}
                className="bg-slate-950/60 border border-slate-800 rounded-2xl p-3.5 flex items-center justify-between gap-4"
              >
                <div className="flex items-center gap-3.5 min-w-0">
                  <img
                    src={product.thumbnail || product.images[0]}
                    alt={product.title}
                    className="w-16 h-16 rounded-xl object-cover border border-slate-800 shrink-0"
                  />
                  <div className="min-w-0">
                    <span className="text-[10px] font-bold uppercase text-emerald-400 bg-emerald-950/60 px-1.5 py-0.2 rounded border border-emerald-800/40">
                      {product.condition}
                    </span>
                    <h4 className="font-bold text-xs text-white truncate mt-1">{product.title}</h4>
                    <p className="text-[11px] text-slate-400">{product.brand} • {product.subcategory}</p>

                    <div className="flex items-baseline gap-2 mt-1">
                      <span className="font-mono font-bold text-sm text-white">${product.price}</span>
                      {product.originalPrice > product.price && (
                        <span className="text-xs text-slate-500 line-through font-mono">
                          ${product.originalPrice}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => {
                      onAddToCart(product);
                      onRemoveFromWishlist(product.id);
                    }}
                    className="px-3 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-bold flex items-center gap-1 cursor-pointer"
                  >
                    <ShoppingCart className="w-3.5 h-3.5" />
                    <span>Move to Cart</span>
                  </button>

                  <button
                    onClick={() => onRemoveFromWishlist(product.id)}
                    className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-rose-400 cursor-pointer"
                    title="Remove from wishlist"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
