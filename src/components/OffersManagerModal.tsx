import React, { useState } from "react";
import {
  X,
  Tag,
  Check,
  X as XIcon,
  MessageSquare,
  DollarSign,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Clock
} from "lucide-react";
import { Offer, Product } from "../types";

interface OffersManagerModalProps {
  isOpen: boolean;
  onClose: () => void;
  offers: Offer[];
  onAcceptOffer: (offerId: string) => void;
  onDeclineOffer: (offerId: string) => void;
  onCounterOffer: (offerId: string, counterAmount: number) => void;
  onBuyOfferAccepted: (offer: Offer) => void;
}

export const OffersManagerModal: React.FC<OffersManagerModalProps> = ({
  isOpen,
  onClose,
  offers,
  onAcceptOffer,
  onDeclineOffer,
  onCounterOffer,
  onBuyOfferAccepted,
}) => {
  if (!isOpen) return null;

  const [activeTab, setActiveTab] = useState<"sent" | "received">("sent");
  const [counterInputId, setCounterInputId] = useState<string | null>(null);
  const [counterPrice, setCounterPrice] = useState<number>(0);

  const sentOffers = offers.filter((o) => o.isFromUser);
  const receivedOffers = offers.filter((o) => !o.isFromUser);

  const getStatusBadge = (status: Offer["status"]) => {
    switch (status) {
      case "Accepted":
        return "bg-emerald-500/20 text-emerald-400 border-emerald-500/40";
      case "Declined":
        return "bg-rose-500/20 text-rose-400 border-rose-500/40";
      case "Countered":
        return "bg-amber-500/20 text-amber-400 border-amber-500/40";
      default:
        return "bg-cyan-500/20 text-cyan-400 border-cyan-500/40";
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200">
      <div className="relative w-full max-w-3xl bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden text-slate-100 flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-950/70">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-amber-500/20 text-amber-300 border border-amber-500/40 flex items-center justify-center">
              <Tag className="w-4 h-4" />
            </div>
            <div>
              <h2 className="font-extrabold text-base text-white">Price Negotiation & Offers Hub</h2>
              <p className="text-xs text-slate-400">Manage buyer & seller price counter-offers in real-time</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="px-6 py-3 border-b border-slate-800 bg-slate-950/40 flex gap-4 text-xs font-bold">
          <button
            onClick={() => setActiveTab("sent")}
            className={`pb-2 relative cursor-pointer ${
              activeTab === "sent" ? "text-amber-400" : "text-slate-400 hover:text-slate-200"
            }`}
          >
            Offers Sent by You ({sentOffers.length})
            {activeTab === "sent" && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-amber-400 rounded-full" />
            )}
          </button>

          <button
            onClick={() => setActiveTab("received")}
            className={`pb-2 relative cursor-pointer ${
              activeTab === "received" ? "text-emerald-400" : "text-slate-400 hover:text-slate-200"
            }`}
          >
            Offers Received on Your Listings ({receivedOffers.length})
            {activeTab === "received" && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-emerald-400 rounded-full" />
            )}
          </button>
        </div>

        {/* Scrollable Offers List */}
        <div className="overflow-y-auto p-6 flex-1 space-y-4">
          {activeTab === "sent" && (
            <div className="space-y-3">
              {sentOffers.length === 0 ? (
                <div className="py-12 text-center text-slate-500 text-xs">
                  You haven't sent any price offers yet. Look for items with the "Offers Accepted" badge!
                </div>
              ) : (
                sentOffers.map((offer) => (
                  <div
                    key={offer.id}
                    className="bg-slate-950/60 border border-slate-800 rounded-2xl p-4 space-y-3"
                  >
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <img
                          src={offer.productImage}
                          alt={offer.productTitle}
                          className="w-12 h-12 rounded-xl object-cover border border-slate-800"
                        />
                        <div>
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md border ${getStatusBadge(offer.status)}`}>
                            {offer.status}
                          </span>
                          <h4 className="font-bold text-xs text-white mt-1">{offer.productTitle}</h4>
                          <p className="text-[11px] text-slate-400">
                            Asking: <span className="line-through font-mono">${offer.askingPrice}</span> • Your Offer: <strong className="text-amber-400 font-mono">${offer.offerAmount}</strong>
                          </p>
                        </div>
                      </div>

                      {offer.status === "Accepted" && (
                        <button
                          onClick={() => {
                            onBuyOfferAccepted(offer);
                            onClose();
                          }}
                          className="px-3.5 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-black flex items-center gap-1 shadow-md shadow-emerald-500/20 cursor-pointer"
                        >
                          <span>Complete Purchase (${offer.offerAmount})</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>

                    {offer.buyerMessage && (
                      <p className="text-xs text-slate-300 bg-slate-900/60 p-2.5 rounded-xl border border-slate-800/60 italic">
                        "{offer.buyerMessage}"
                      </p>
                    )}

                    {offer.counterAmount && (
                      <div className="p-3 rounded-xl bg-amber-950/40 border border-amber-500/30 flex items-center justify-between text-xs">
                        <span className="text-amber-300 font-medium">
                          Seller Counter-Offered: <strong className="font-mono">${offer.counterAmount}</strong>
                        </span>
                        <div className="flex gap-2">
                          <button
                            onClick={() => onAcceptOffer(offer.id)}
                            className="px-2.5 py-1 rounded-lg bg-emerald-500 text-slate-950 font-bold cursor-pointer"
                          >
                            Accept Counter
                          </button>
                          <button
                            onClick={() => onDeclineOffer(offer.id)}
                            className="px-2.5 py-1 rounded-lg bg-slate-800 text-slate-300 hover:text-white cursor-pointer"
                          >
                            Decline
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          )}

          {activeTab === "received" && (
            <div className="space-y-3">
              {receivedOffers.length === 0 ? (
                <div className="py-12 text-center text-slate-500 text-xs">
                  No offers received yet on your listed accessories.
                </div>
              ) : (
                receivedOffers.map((offer) => (
                  <div
                    key={offer.id}
                    className="bg-slate-950/60 border border-slate-800 rounded-2xl p-4 space-y-3"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <img
                          src={offer.productImage}
                          alt={offer.productTitle}
                          className="w-12 h-12 rounded-xl object-cover border border-slate-800"
                        />
                        <div>
                          <div className="flex items-center gap-2">
                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md border ${getStatusBadge(offer.status)}`}>
                              {offer.status}
                            </span>
                            <span className="text-xs text-slate-400">From {offer.buyerName}</span>
                          </div>
                          <h4 className="font-bold text-xs text-white mt-1">{offer.productTitle}</h4>
                          <p className="text-[11px] text-slate-400">
                            Your Asking: <span className="font-mono">${offer.askingPrice}</span> • Buyer Offered: <strong className="text-emerald-400 font-mono">${offer.offerAmount}</strong>
                          </p>
                        </div>
                      </div>

                      {offer.status === "Pending" && (
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => onAcceptOffer(offer.id)}
                            className="px-3 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-bold flex items-center gap-1 cursor-pointer"
                            title="Accept buyer offer"
                          >
                            <Check className="w-3.5 h-3.5" />
                            <span>Accept</span>
                          </button>

                          <button
                            onClick={() => {
                              setCounterInputId(offer.id);
                              setCounterPrice(Math.round((offer.askingPrice + offer.offerAmount) / 2));
                            }}
                            className="px-3 py-1.5 rounded-xl bg-amber-500/20 text-amber-300 border border-amber-500/40 hover:bg-amber-500/30 text-xs font-bold cursor-pointer"
                          >
                            Counter
                          </button>

                          <button
                            onClick={() => onDeclineOffer(offer.id)}
                            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-rose-400 cursor-pointer"
                            title="Decline offer"
                          >
                            <XIcon className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      )}
                    </div>

                    {counterInputId === offer.id && (
                      <div className="p-3 bg-slate-900 border border-amber-500/40 rounded-xl flex items-center gap-3">
                        <span className="text-xs text-slate-300">Your Counter Price: $</span>
                        <input
                          type="number"
                          value={counterPrice}
                          onChange={(e) => setCounterPrice(Number(e.target.value))}
                          className="w-24 bg-slate-950 border border-slate-700 rounded-lg px-2 py-1 text-xs text-white font-mono"
                        />
                        <button
                          onClick={() => {
                            onCounterOffer(offer.id, counterPrice);
                            setCounterInputId(null);
                          }}
                          className="px-3 py-1 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs cursor-pointer"
                        >
                          Send Counter
                        </button>
                        <button
                          onClick={() => setCounterInputId(null)}
                          className="text-xs text-slate-400 hover:text-white cursor-pointer"
                        >
                          Cancel
                        </button>
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
