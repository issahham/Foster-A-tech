import React, { useState } from "react";
import {
  X,
  Trash2,
  Plus,
  Minus,
  ShoppingCart,
  ArrowRight,
  ShieldCheck,
  Tag,
  Check,
  Zap
} from "lucide-react";
import { CartItem, Product } from "../types";

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  cart: CartItem[];
  onUpdateQuantity: (productId: string, qty: number) => void;
  onRemoveItem: (productId: string) => void;
  onCheckout: (appliedPromo?: { code: string; discountAmount: number }) => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  cart,
  onUpdateQuantity,
  onRemoveItem,
  onCheckout,
}) => {
  if (!isOpen) return null;

  const [promoInput, setPromoInput] = useState("");
  const [appliedPromo, setAppliedPromo] = useState<{ code: string; discountAmount: number } | null>({
    code: "FOSTER10",
    discountAmount: 0 // calculated below
  });
  const [promoMessage, setPromoMessage] = useState<string | null>("Promo FOSTER10 active (10% Off)");

  const subtotal = cart.reduce((acc, item) => acc + item.product.price * item.quantity, 0);

  // Calculate discount based on active promo
  let discount = 0;
  if (appliedPromo?.code === "FOSTER10") {
    discount = Math.round(subtotal * 0.1);
  } else if (appliedPromo?.code === "FOSTER20") {
    discount = Math.min(20, subtotal);
  }

  const shipping = subtotal > 100 || appliedPromo?.code === "FREESHIP" ? 0 : 9.99;
  const tax = Math.round((subtotal - discount) * 0.0825 * 100) / 100;
  const total = Math.max(0, subtotal - discount + shipping + tax);

  const handleApplyPromo = () => {
    const code = promoInput.trim().toUpperCase();
    if (code === "FOSTER10") {
      setAppliedPromo({ code, discountAmount: Math.round(subtotal * 0.1) });
      setPromoMessage("10% Foster Member Discount applied!");
    } else if (code === "FREESHIP") {
      setAppliedPromo({ code, discountAmount: 0 });
      setPromoMessage("Free Express Shipping unlocked!");
    } else if (code === "FOSTER20") {
      setAppliedPromo({ code, discountAmount: 20 });
      setPromoMessage("$20 Flat Discount applied!");
    } else {
      setPromoMessage("Invalid promo code. Try 'FOSTER10' or 'FREESHIP'");
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-slate-950/80 backdrop-blur-sm flex justify-end animate-in fade-in duration-200">
      <div className="w-full max-w-md bg-slate-900 border-l border-slate-800 h-full shadow-2xl flex flex-col justify-between text-slate-100 animate-in slide-in-from-right duration-300">
        {/* Top Header */}
        <div className="p-5 border-b border-slate-800 flex items-center justify-between bg-slate-950/70">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 flex items-center justify-center">
              <ShoppingCart className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-extrabold text-base text-white">Your Tech Cart</h3>
              <p className="text-xs text-slate-400">{cart.length} accessory items selected</p>
            </div>
          </div>

          <button
            id="close-cart-drawer"
            onClick={onClose}
            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Cart Item List */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {cart.length === 0 ? (
            <div className="py-16 text-center space-y-3">
              <div className="w-16 h-16 rounded-3xl bg-slate-800/80 border border-slate-700 mx-auto flex items-center justify-center text-slate-500">
                <ShoppingCart className="w-8 h-8" />
              </div>
              <h4 className="font-bold text-base text-slate-300">Your cart is empty</h4>
              <p className="text-xs text-slate-400 max-w-xs mx-auto">
                Explore custom mechanical keyboards, 8K mice, Thunderbolt docks, and studio gear!
              </p>
              <button
                onClick={onClose}
                className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-bold transition-all cursor-pointer"
              >
                Browse Marketplace
              </button>
            </div>
          ) : (
            cart.map((item) => (
              <div
                key={item.product.id}
                className="bg-slate-950/60 border border-slate-800 rounded-2xl p-3.5 flex gap-3 items-center group"
              >
                <img
                  src={item.product.thumbnail || item.product.images[0]}
                  alt={item.product.title}
                  className="w-16 h-16 rounded-xl object-cover border border-slate-800 shrink-0"
                />

                <div className="flex-1 min-w-0">
                  <span className="text-[10px] font-bold uppercase text-emerald-400 bg-emerald-950/60 px-1.5 py-0.2 rounded border border-emerald-800/40">
                    {item.product.condition}
                  </span>
                  <h4 className="font-bold text-xs text-white truncate mt-1">{item.product.title}</h4>
                  <p className="text-[11px] text-slate-400">{item.product.brand}</p>

                  <div className="flex items-center justify-between mt-2">
                    <span className="font-mono font-bold text-sm text-white">
                      ${item.product.price * item.quantity}
                    </span>

                    {/* Quantity Selector */}
                    <div className="flex items-center gap-2 bg-slate-900 border border-slate-800 rounded-lg px-2 py-0.5">
                      <button
                        onClick={() => onUpdateQuantity(item.product.id, item.quantity - 1)}
                        className="text-slate-400 hover:text-white cursor-pointer"
                        title="Decrease"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="text-xs font-mono font-bold text-white px-1">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => onUpdateQuantity(item.product.id, item.quantity + 1)}
                        className="text-slate-400 hover:text-white cursor-pointer"
                        title="Increase"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => onRemoveItem(item.product.id)}
                  className="p-1.5 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-slate-900 transition-colors cursor-pointer"
                  title="Remove from cart"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))
          )}
        </div>

        {/* Bottom Checkout Summary */}
        {cart.length > 0 && (
          <div className="p-5 border-t border-slate-800 bg-slate-950/80 space-y-3.5">
            {/* Promo Code Input */}
            <div className="space-y-1.5">
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Tag className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={promoInput}
                    onChange={(e) => setPromoInput(e.target.value)}
                    placeholder="Promo: FOSTER10 or FREESHIP"
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-9 pr-3 py-2 text-xs text-white font-mono uppercase focus:outline-none focus:border-emerald-500"
                  />
                </div>
                <button
                  onClick={handleApplyPromo}
                  className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-bold text-slate-200 border border-slate-700 cursor-pointer"
                >
                  Apply
                </button>
              </div>
              {promoMessage && (
                <p className="text-[11px] text-emerald-400 flex items-center gap-1 font-medium pl-1">
                  <Check className="w-3 h-3" /> {promoMessage}
                </p>
              )}
            </div>

            {/* Calculations Breakdown */}
            <div className="space-y-1.5 text-xs pt-1 border-t border-slate-800/80">
              <div className="flex justify-between text-slate-400">
                <span>Subtotal</span>
                <span className="font-mono text-white">${subtotal.toFixed(2)}</span>
              </div>

              {discount > 0 && (
                <div className="flex justify-between text-emerald-400 font-medium">
                  <span>Promo Discount ({appliedPromo?.code})</span>
                  <span className="font-mono">-${discount.toFixed(2)}</span>
                </div>
              )}

              <div className="flex justify-between text-slate-400">
                <span>Fast Tech Shipping</span>
                <span className="font-mono text-white">
                  {shipping === 0 ? <strong className="text-emerald-400">FREE</strong> : `$${shipping.toFixed(2)}`}
                </span>
              </div>

              <div className="flex justify-between text-slate-400">
                <span>Estimated Sales Tax (8.25%)</span>
                <span className="font-mono text-white">${tax.toFixed(2)}</span>
              </div>

              <div className="flex justify-between text-sm font-black text-white pt-2 border-t border-slate-800">
                <span>Total Amount</span>
                <span className="font-mono text-lg text-emerald-400">${total.toFixed(2)}</span>
              </div>
            </div>

            {/* Checkout Action Button */}
            <button
              id="proceed-checkout-btn"
              onClick={() => {
                onCheckout(appliedPromo ? { code: appliedPromo.code, discountAmount: discount } : undefined);
                onClose();
              }}
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-black text-sm flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/25 active:scale-98 transition-all cursor-pointer"
            >
              <span>Proceed to Escrow Checkout</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <div className="flex items-center justify-center gap-1.5 text-[10px] text-slate-500">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>30-Day Escrow Buyer Guarantee on all orders</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
