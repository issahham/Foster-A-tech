import React, { useState } from "react";
import {
  X,
  ShieldCheck,
  CreditCard,
  Truck,
  CheckCircle2,
  Lock,
  ArrowRight,
  ArrowLeft,
  Building,
  Zap
} from "lucide-react";
import { CartItem, Order, ShippingAddress } from "../types";

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  cart: CartItem[];
  appliedPromo?: { code: string; discountAmount: number };
  onOrderPlaced: (order: Order) => void;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({
  isOpen,
  onClose,
  cart,
  appliedPromo,
  onOrderPlaced,
}) => {
  if (!isOpen || cart.length === 0) return null;

  const [step, setStep] = useState<1 | 2 | 3>(1);

  // Address
  const [address, setAddress] = useState<ShippingAddress>({
    fullName: "Alex Foster",
    email: "alex.tech@fosteratech.io",
    phone: "+1 (555) 234-5678",
    address: "742 Evergreen Tech Way",
    apartment: "Suite 400",
    city: "San Francisco",
    state: "CA",
    postalCode: "94107",
    country: "United States"
  });

  // Shipping Speed
  const [shippingMethod, setShippingMethod] = useState<"standard" | "express" | "local">("express");

  // Payment Method
  const [paymentMethod, setPaymentMethod] = useState<
    "Foster Escrow Pay" | "Credit Card" | "Apple Pay / Google Pay" | "Crypto (USDC)"
  >("Foster Escrow Pay");

  const [cardNumber, setCardNumber] = useState("•••• •••• •••• 4242");
  const [cardExpiry, setCardExpiry] = useState("08/28");
  const [cardCvc, setCardCvc] = useState("892");

  const [isProcessing, setIsProcessing] = useState(false);

  // Calculations
  const subtotal = cart.reduce((acc, item) => acc + item.product.price * item.quantity, 0);
  const discount = appliedPromo?.discountAmount || (appliedPromo?.code === "FOSTER10" ? Math.round(subtotal * 0.1) : 0);
  const shippingFee = shippingMethod === "standard" ? 0 : shippingMethod === "express" ? 9.99 : 19.99;
  const tax = Math.round((subtotal - discount) * 0.0825 * 100) / 100;
  const totalAmount = Math.max(0, subtotal - discount + shippingFee + tax);

  const handlePlaceOrder = () => {
    setIsProcessing(true);

    setTimeout(() => {
      const newOrder: Order = {
        id: `FAT-${Math.floor(10000 + Math.random() * 90000)}`,
        items: [...cart],
        subtotal,
        discount,
        shippingFee,
        tax,
        totalAmount,
        promoCodeApplied: appliedPromo?.code,
        shippingAddress: address,
        paymentMethod,
        status: "Order Placed",
        carrier: shippingMethod === "express" ? "Foster Air Express (Insured)" : "Foster Ground Logistics",
        trackingNumber: `FAT-US-${Math.floor(1000000 + Math.random() * 9000000)}`,
        estimatedDelivery: shippingMethod === "express" ? "Tomorrow by 2:00 PM" : "In 3 Business Days",
        createdAt: new Date().toISOString(),
        timeline: [
          {
            step: "Order Placed & Escrow Funded",
            timestamp: "Just now",
            completed: true,
            current: true,
            description: `Payment of $${totalAmount.toFixed(2)} securely deposited in Foster Escrow vault.`
          },
          {
            step: "Hardware Verification & Multi-Point Inspection",
            timestamp: "Scheduled within 2 hours",
            completed: false,
            description: "QA test for PCB continuity, mechanical switch actuation, and clean cosmetics."
          },
          {
            step: "Packaged & Tamper-Sealed",
            timestamp: "Scheduled today",
            completed: false,
            description: "Protected in custom shock-absorbing foam with security tape."
          },
          {
            step: "Dispatched to Courier",
            timestamp: "Tomorrow morning",
            completed: false,
            description: "Courier assigned with live GPS telemetry."
          },
          {
            step: "Delivered & Buyer Confirmation",
            timestamp: shippingMethod === "express" ? "Tomorrow 2:00 PM" : "In 3 Days",
            completed: false,
            description: "30-day return protection begins upon unboxing."
          }
        ]
      };

      setIsProcessing(false);
      onOrderPlaced(newOrder);
      onClose();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden text-slate-100 flex flex-col max-h-[92vh]">
        {/* Top Header */}
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-950/70">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 flex items-center justify-center">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-extrabold text-base text-white">Foster Escrow Checkout</h3>
              <p className="text-xs text-slate-400">Insured hardware delivery & 30-day money-back guarantee</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Step Indicator */}
        <div className="bg-slate-950/40 border-b border-slate-800/80 px-6 py-2.5 flex items-center justify-between text-xs">
          <div className="flex items-center gap-4">
            <span className={`font-bold ${step >= 1 ? "text-emerald-400" : "text-slate-500"}`}>
              1. Delivery Address
            </span>
            <span>→</span>
            <span className={`font-bold ${step >= 2 ? "text-emerald-400" : "text-slate-500"}`}>
              2. Shipping Speed
            </span>
            <span>→</span>
            <span className={`font-bold ${step >= 3 ? "text-emerald-400" : "text-slate-500"}`}>
              3. Payment & Escrow
            </span>
          </div>
          <span className="text-slate-400 font-mono">Step {step}/3</span>
        </div>

        {/* Modal Scrollable Body */}
        <div className="overflow-y-auto p-6 space-y-5 flex-1">
          {/* STEP 1: Address */}
          {step === 1 && (
            <div className="space-y-4">
              <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                Where should we ship your gear?
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-bold text-slate-400 uppercase block mb-1">
                    Full Recipient Name
                  </label>
                  <input
                    type="text"
                    value={address.fullName}
                    onChange={(e) => setAddress({ ...address, fullName: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                    required
                  />
                </div>

                <div>
                  <label className="text-[11px] font-bold text-slate-400 uppercase block mb-1">
                    Contact Phone Number
                  </label>
                  <input
                    type="tel"
                    value={address.phone}
                    onChange={(e) => setAddress({ ...address, phone: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-400 uppercase block mb-1">
                  Street Address
                </label>
                <input
                  type="text"
                  value={address.address}
                  onChange={(e) => setAddress({ ...address, address: e.target.value })}
                  placeholder="e.g. 742 Evergreen Tech Way"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                  required
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="text-[11px] font-bold text-slate-400 uppercase block mb-1">
                    City
                  </label>
                  <input
                    type="text"
                    value={address.city}
                    onChange={(e) => setAddress({ ...address, city: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                    required
                  />
                </div>
                <div>
                  <label className="text-[11px] font-bold text-slate-400 uppercase block mb-1">
                    State / Region
                  </label>
                  <input
                    type="text"
                    value={address.state}
                    onChange={(e) => setAddress({ ...address, state: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                    required
                  />
                </div>
                <div>
                  <label className="text-[11px] font-bold text-slate-400 uppercase block mb-1">
                    Postal Code
                  </label>
                  <input
                    type="text"
                    value={address.postalCode}
                    onChange={(e) => setAddress({ ...address, postalCode: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white font-mono focus:outline-none focus:border-emerald-500"
                    required
                  />
                </div>
              </div>
            </div>
          )}

          {/* STEP 2: Shipping Speed */}
          {step === 2 && (
            <div className="space-y-4">
              <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                Choose Dispatch & Courier Method
              </h4>

              <div className="space-y-2.5">
                <div
                  onClick={() => setShippingMethod("express")}
                  className={`p-4 rounded-2xl border cursor-pointer transition-all flex items-center justify-between ${
                    shippingMethod === "express"
                      ? "bg-emerald-500/10 border-emerald-500 text-white"
                      : "bg-slate-950/60 border-slate-800 text-slate-300 hover:border-slate-700"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                      <Zap className="w-5 h-5" />
                    </div>
                    <div>
                      <h5 className="font-bold text-xs text-white flex items-center gap-1.5">
                        Foster Air Express (Recommended)
                        <span className="text-[10px] bg-emerald-500 text-slate-950 font-black px-1.5 py-0.2 rounded">
                          Fastest
                        </span>
                      </h5>
                      <p className="text-[11px] text-slate-400">Guaranteed delivery tomorrow with live GPS driver tracking</p>
                    </div>
                  </div>
                  <span className="font-mono font-bold text-xs text-emerald-400">$9.99</span>
                </div>

                <div
                  onClick={() => setShippingMethod("standard")}
                  className={`p-4 rounded-2xl border cursor-pointer transition-all flex items-center justify-between ${
                    shippingMethod === "standard"
                      ? "bg-emerald-500/10 border-emerald-500 text-white"
                      : "bg-slate-950/60 border-slate-800 text-slate-300 hover:border-slate-700"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-slate-800 text-slate-400 flex items-center justify-center">
                      <Truck className="w-5 h-5" />
                    </div>
                    <div>
                      <h5 className="font-bold text-xs text-white">Standard Ground Freight</h5>
                      <p className="text-[11px] text-slate-400">Delivered within 3 to 5 business days</p>
                    </div>
                  </div>
                  <span className="font-mono font-bold text-xs text-emerald-400">FREE</span>
                </div>

                <div
                  onClick={() => setShippingMethod("local")}
                  className={`p-4 rounded-2xl border cursor-pointer transition-all flex items-center justify-between ${
                    shippingMethod === "local"
                      ? "bg-emerald-500/10 border-emerald-500 text-white"
                      : "bg-slate-950/60 border-slate-800 text-slate-300 hover:border-slate-700"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center">
                      <Building className="w-5 h-5" />
                    </div>
                    <div>
                      <h5 className="font-bold text-xs text-white">Same-Day Local Tech Courier</h5>
                      <p className="text-[11px] text-slate-400">Hand-delivered within 4 hours in metropolitan hubs</p>
                    </div>
                  </div>
                  <span className="font-mono font-bold text-xs text-white">$19.99</span>
                </div>
              </div>
            </div>
          )}

          {/* STEP 3: Payment & Escrow */}
          {step === 3 && (
            <div className="space-y-4">
              <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                Select Secure Payment Method
              </h4>

              <div className="grid grid-cols-2 gap-2.5">
                {[
                  { id: "Foster Escrow Pay", label: "Foster Escrow Vault", icon: ShieldCheck, badge: "Most Secure" },
                  { id: "Credit Card", label: "Credit / Debit Card", icon: CreditCard },
                  { id: "Apple Pay / Google Pay", label: "Apple / Google Pay", icon: Zap },
                  { id: "Crypto (USDC)", label: "Crypto (USDC / SOL)", icon: Lock }
                ].map((pm) => (
                  <button
                    key={pm.id}
                    type="button"
                    onClick={() => setPaymentMethod(pm.id as any)}
                    className={`p-3 rounded-2xl border text-left flex items-center gap-2.5 transition-all cursor-pointer ${
                      paymentMethod === pm.id
                        ? "bg-emerald-500/20 border-emerald-500 text-white"
                        : "bg-slate-950/60 border-slate-800 text-slate-400 hover:text-white"
                    }`}
                  >
                    <pm.icon className="w-4 h-4 text-emerald-400 shrink-0" />
                    <div className="min-w-0">
                      <p className="text-xs font-bold truncate text-white">{pm.label}</p>
                      {pm.badge && <span className="text-[9px] text-emerald-400">{pm.badge}</span>}
                    </div>
                  </button>
                ))}
              </div>

              {paymentMethod === "Credit Card" && (
                <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-3">
                  <div>
                    <label className="text-[11px] font-bold text-slate-400 block mb-1">Card Number</label>
                    <input
                      type="text"
                      value={cardNumber}
                      onChange={(e) => setCardNumber(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white font-mono focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-[11px] font-bold text-slate-400 block mb-1">Expiry</label>
                      <input
                        type="text"
                        value={cardExpiry}
                        onChange={(e) => setCardExpiry(e.target.value)}
                        className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white font-mono"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] font-bold text-slate-400 block mb-1">CVV</label>
                      <input
                        type="password"
                        value={cardCvc}
                        onChange={(e) => setCardCvc(e.target.value)}
                        className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white font-mono"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Order Final Summary Box */}
              <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-2 text-xs">
                <div className="flex justify-between text-slate-400">
                  <span>Items ({cart.reduce((a, b) => a + b.quantity, 0)})</span>
                  <span className="font-mono text-white">${subtotal.toFixed(2)}</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-emerald-400">
                    <span>Discount ({appliedPromo?.code})</span>
                    <span className="font-mono">-${discount.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between text-slate-400">
                  <span>Shipping Fee</span>
                  <span className="font-mono text-white">${shippingFee.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>Taxes</span>
                  <span className="font-mono text-white">${tax.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm font-black text-white pt-2 border-t border-slate-800">
                  <span>Total Due Today</span>
                  <span className="font-mono text-lg text-emerald-400">${totalAmount.toFixed(2)}</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer Navigation */}
        <div className="px-6 py-4 border-t border-slate-800 flex items-center justify-between bg-slate-950/70">
          {step > 1 ? (
            <button
              type="button"
              onClick={() => setStep((s) => (s - 1) as any)}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold flex items-center gap-1.5 cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back</span>
            </button>
          ) : (
            <div />
          )}

          {step < 3 ? (
            <button
              type="button"
              onClick={() => setStep((s) => (s + 1) as any)}
              className="px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-black flex items-center gap-1.5 shadow-md shadow-emerald-500/20 cursor-pointer"
            >
              <span>Continue</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          ) : (
            <button
              type="button"
              id="confirm-place-order-btn"
              onClick={handlePlaceOrder}
              disabled={isProcessing}
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 disabled:opacity-50 text-slate-950 text-xs font-black flex items-center gap-1.5 shadow-lg shadow-emerald-500/30 active:scale-98 cursor-pointer"
            >
              <Lock className="w-4 h-4" />
              <span>{isProcessing ? "Authorizing Escrow..." : `Authorize & Pay $${totalAmount.toFixed(2)}`}</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
