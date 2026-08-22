import React from "react";
import { X, Layers, ShoppingCart, Trash2, CheckCircle2, Star, Tag } from "lucide-react";
import { Product } from "../types";

interface CompareModalProps {
  isOpen: boolean;
  onClose: () => void;
  comparedProducts: Product[];
  onRemoveFromCompare: (id: string) => void;
  onClearCompare: () => void;
  onAddToCart: (p: Product) => void;
}

export const CompareModal: React.FC<CompareModalProps> = ({
  isOpen,
  onClose,
  comparedProducts,
  onRemoveFromCompare,
  onClearCompare,
  onAddToCart,
}) => {
  if (!isOpen) return null;

  // Aggregate all unique spec keys
  const allSpecKeys: string[] = Array.from(
    new Set(
      comparedProducts.flatMap((p) => Object.keys(p.specs || {}))
    )
  );

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200">
      <div className="relative w-full max-w-5xl bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden text-slate-100 flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-950/70">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-indigo-500/20 text-indigo-400 border border-indigo-500/40 flex items-center justify-center font-bold">
              <Layers className="w-4 h-4" />
            </div>
            <div>
              <h2 className="font-extrabold text-base text-white">Side-by-Side Accessory Comparison</h2>
              <p className="text-xs text-slate-400">Compare latency specs, condition grades, pricing, and features</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {comparedProducts.length > 0 && (
              <button
                onClick={onClearCompare}
                className="text-xs text-slate-400 hover:text-rose-400 cursor-pointer"
              >
                Clear all
              </button>
            )}
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Comparison Matrix Table */}
        <div className="overflow-x-auto p-6 flex-1">
          {comparedProducts.length === 0 ? (
            <div className="py-16 text-center space-y-3">
              <Layers className="w-12 h-12 text-slate-600 mx-auto" />
              <h4 className="font-bold text-base text-slate-300">No accessories selected to compare</h4>
              <p className="text-xs text-slate-500">
                Click the compare button (icon with stacked layers) on any product card to inspect side-by-side.
              </p>
            </div>
          ) : (
            <table className="w-full text-left border-collapse min-w-[650px]">
              <thead>
                <tr className="border-b border-slate-800">
                  <th className="p-3 text-xs font-bold text-slate-400 uppercase w-48">Accessory</th>
                  {comparedProducts.map((p) => (
                    <th key={p.id} className="p-3 align-top min-w-[200px]">
                      <div className="space-y-2 relative">
                        <button
                          onClick={() => onRemoveFromCompare(p.id)}
                          className="absolute -top-1 -right-1 p-1 rounded-md bg-slate-800 text-slate-400 hover:text-rose-400 cursor-pointer"
                          title="Remove from compare"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                        <img
                          src={p.thumbnail || p.images[0]}
                          alt={p.title}
                          className="w-full h-28 object-cover rounded-xl border border-slate-800"
                        />
                        <span className="text-[10px] font-bold uppercase text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-800/40">
                          {p.condition}
                        </span>
                        <h4 className="font-bold text-xs text-white line-clamp-2">{p.title}</h4>
                        <div className="flex items-center gap-1 text-xs">
                          <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                          <span className="font-bold text-white">{p.rating}</span>
                          <span className="text-slate-500">({p.reviewCount})</span>
                        </div>
                        <div className="flex items-baseline gap-2">
                          <span className="text-base font-black text-white font-mono">${p.price}</span>
                          {p.originalPrice > p.price && (
                            <span className="text-xs text-slate-500 line-through font-mono">${p.originalPrice}</span>
                          )}
                        </div>
                        <button
                          onClick={() => onAddToCart(p)}
                          className="w-full py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-black flex items-center justify-center gap-1 shadow-md shadow-emerald-500/20 cursor-pointer"
                        >
                          <ShoppingCart className="w-3.5 h-3.5" />
                          <span>Buy for ${p.price}</span>
                        </button>
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-xs">
                <tr>
                  <td className="p-3 font-bold text-slate-400">Brand</td>
                  {comparedProducts.map((p) => (
                    <td key={p.id} className="p-3 text-white font-semibold">{p.brand}</td>
                  ))}
                </tr>

                <tr>
                  <td className="p-3 font-bold text-slate-400">Category</td>
                  {comparedProducts.map((p) => (
                    <td key={p.id} className="p-3 text-slate-300">{p.categoryName}</td>
                  ))}
                </tr>

                <tr>
                  <td className="p-3 font-bold text-slate-400">Seller & Rating</td>
                  {comparedProducts.map((p) => (
                    <td key={p.id} className="p-3 text-slate-300">
                      <div className="flex items-center gap-1">
                        <span>{p.seller.name}</span>
                        {p.seller.verified && <CheckCircle2 className="w-3 h-3 text-emerald-400" />}
                      </div>
                      <span className="text-[10px] text-slate-500">⭐ {p.seller.rating} ({p.seller.salesCount} sales)</span>
                    </td>
                  ))}
                </tr>

                <tr>
                  <td className="p-3 font-bold text-slate-400">Free Shipping</td>
                  {comparedProducts.map((p) => (
                    <td key={p.id} className="p-3">
                      {p.freeShipping ? (
                        <span className="text-emerald-400 font-bold">Yes (Expedited)</span>
                      ) : (
                        <span className="text-slate-500">Standard ($9.99)</span>
                      )}
                    </td>
                  ))}
                </tr>

                {allSpecKeys.map((key) => (
                  <tr key={key}>
                    <td className="p-3 font-bold text-slate-400">{key}</td>
                    {comparedProducts.map((p) => (
                      <td key={p.id} className="p-3 text-slate-200 font-mono">
                        {p.specs[key] || "—"}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};
