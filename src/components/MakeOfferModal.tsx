import React, { useState } from "react";
import { X, Tag, DollarSign, Send, ShieldCheck, CheckCircle2, AlertCircle } from "lucide-react";
import { Product, Offer } from "../types";

interface MakeOfferModalProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
  onSubmitOffer: (offer: Offer) => void;
}

export const MakeOfferModal: React.FC<MakeOfferModalProps> = ({
  product,
  isOpen,
  onClose,
  onSubmitOffer,
}) => {
  if (!isOpen || !product) return null;

  const defaultOffer = Math.round(product.price * 0.85);
  const [offerAmount, setOfferAmount] = useState<number>(defaultOffer);
  const [buyerMessage, setBuyerMessage] = useState<string>(
    "Hi, I'm ready to complete escrow payment today if you can accept this offer!"
  );
  const [submitted, setSubmitted] = useState(false);

  const minFloor = product.minOfferPrice || Math.round(product.price * 0.7);

  const handlePreset = (pct: number) => {
    setOfferAmount(Math.round(product.price * (1 - pct / 100)));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (offerAmount <= 0) return;

    const newOffer: Offer = {
      id: `off-${Date.now()}`,
      productId: product.id,
      productTitle: product.title,
      productImage: product.thumbnail || product.images[0],
      productCondition: product.condition,
      askingPrice: product.price,
      offerAmount,
      buyerName: "You (Alex Foster)",
      buyerMessage: buyerMessage.trim(),
      status: "Pending",
      createdAt: new Date().toISOString(),
      isFromUser: true
    };

    onSubmitOffer(newOffer);
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      onClose();
    }, 1800);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden text-slate-100 p-6">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-amber-500/20 text-amber-300 border border-amber-500/40 flex items-center justify-center">
              <Tag className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-extrabold text-base text-white">Make an Offer to Seller</h3>
              <p className="text-xs text-slate-400">Direct price negotiation on Foster A Tech</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {submitted ? (
          <div className="py-10 text-center space-y-3">
            <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto animate-bounce" />
            <h4 className="font-extrabold text-lg text-white">Offer Sent to {product.seller.name}!</h4>
            <p className="text-xs text-slate-300 max-w-sm mx-auto">
              Your offer of <strong className="text-emerald-400 font-mono">${offerAmount}</strong> has been delivered. You will receive an instant notification when the seller accepts or counters.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4 pt-4">
            {/* Product Summary */}
            <div className="flex items-center gap-3 bg-slate-950/60 p-3 rounded-2xl border border-slate-800">
              <img
                src={product.thumbnail || product.images[0]}
                alt={product.title}
                className="w-14 h-14 rounded-xl object-cover border border-slate-800"
              />
              <div className="flex-1 min-w-0">
                <span className="text-[10px] font-bold uppercase text-emerald-400 bg-emerald-950/60 px-1.5 py-0.5 rounded border border-emerald-800/40">
                  {product.condition}
                </span>
                <h4 className="font-bold text-xs text-white truncate mt-0.5">{product.title}</h4>
                <p className="text-xs text-slate-400">
                  Asking Price: <strong className="text-white font-mono">${product.price}</strong>
                </p>
              </div>
            </div>

            {/* Quick Discount Presets */}
            <div>
              <label className="text-xs font-bold text-slate-400 block mb-2">Quick Offer Suggestions:</label>
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => handlePreset(10)}
                  className="py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-bold text-slate-200 border border-slate-700 cursor-pointer"
                >
                  -10% (${Math.round(product.price * 0.9)})
                </button>
                <button
                  type="button"
                  onClick={() => handlePreset(15)}
                  className="py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-bold text-slate-200 border border-slate-700 cursor-pointer"
                >
                  -15% (${Math.round(product.price * 0.85)})
                </button>
                <button
                  type="button"
                  onClick={() => handlePreset(20)}
                  className="py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-bold text-slate-200 border border-slate-700 cursor-pointer"
                >
                  -20% (${Math.round(product.price * 0.8)})
                </button>
              </div>
            </div>

            {/* Offer Amount Input */}
            <div>
              <label className="text-xs font-bold text-slate-300 block mb-1">
                Your Offer Amount ($ USD)
              </label>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 font-bold">$</span>
                <input
                  type="number"
                  min="1"
                  max={product.price}
                  value={offerAmount}
                  onChange={(e) => setOfferAmount(Number(e.target.value))}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-8 pr-3.5 py-2.5 text-base font-mono font-black text-white focus:outline-none focus:border-amber-500"
                  required
                />
              </div>
              {offerAmount < minFloor && (
                <p className="text-[11px] text-amber-400 mt-1 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" /> Seller's minimum threshold is ${minFloor}.
                </p>
              )}
            </div>

            {/* Buyer Message */}
            <div>
              <label className="text-xs font-bold text-slate-300 block mb-1">
                Note to Seller (Optional)
              </label>
              <textarea
                rows={2}
                value={buyerMessage}
                onChange={(e) => setBuyerMessage(e.target.value)}
                placeholder="Add a polite note regarding payment speed, shipping preference, etc."
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-amber-500"
              />
            </div>

            {/* Escrow Guarantee Notice */}
            <div className="bg-slate-950/60 p-3 rounded-2xl border border-slate-800 flex items-start gap-2.5">
              <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <p className="text-[11px] text-slate-400 leading-tight">
                No money is charged immediately. If the seller accepts, you will have 24 hours to fund the purchase via Foster Escrow.
              </p>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={offerAmount < minFloor}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 disabled:opacity-40 text-slate-950 font-black text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20 active:scale-98 transition-all cursor-pointer"
            >
              <Send className="w-4 h-4" />
              <span>Submit Offer of ${offerAmount}</span>
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
