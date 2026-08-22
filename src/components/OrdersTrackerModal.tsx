import React, { useState } from "react";
import {
  X,
  Package,
  Truck,
  CheckCircle2,
  Clock,
  ExternalLink,
  ShieldCheck,
  FileText,
  ChevronRight,
  RotateCcw,
  Zap
} from "lucide-react";
import { Order } from "../types";

interface OrdersTrackerModalProps {
  isOpen: boolean;
  onClose: () => void;
  orders: Order[];
  onUpdateOrder: (order: Order) => void;
}

export const OrdersTrackerModal: React.FC<OrdersTrackerModalProps> = ({
  isOpen,
  onClose,
  orders,
  onUpdateOrder,
}) => {
  if (!isOpen) return null;

  const [selectedOrderId, setSelectedOrderId] = useState<string>(orders[0]?.id || "");
  const selectedOrder = orders.find((o) => o.id === selectedOrderId) || orders[0];

  const handleSimulateNextStep = (order: Order) => {
    const updatedTimeline = [...order.timeline];
    const currentIndex = updatedTimeline.findIndex((t) => t.current);

    if (currentIndex >= 0 && currentIndex < updatedTimeline.length - 1) {
      updatedTimeline[currentIndex].completed = true;
      updatedTimeline[currentIndex].current = false;
      updatedTimeline[currentIndex + 1].current = true;
      updatedTimeline[currentIndex + 1].timestamp = "Just updated";

      let nextStatus: Order["status"] = "Order Placed";
      if (currentIndex + 1 === 1) nextStatus = "Quality Inspection";
      if (currentIndex + 1 === 2) nextStatus = "Dispatched";
      if (currentIndex + 1 === 3) nextStatus = "In Transit";
      if (currentIndex + 1 === 4) nextStatus = "Out for Delivery";
      if (currentIndex + 1 >= 5) {
        nextStatus = "Delivered";
        updatedTimeline[currentIndex + 1].completed = true;
      }

      const updatedOrder: Order = {
        ...order,
        status: nextStatus,
        timeline: updatedTimeline
      };

      onUpdateOrder(updatedOrder);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200">
      <div className="relative w-full max-w-4xl bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden text-slate-100 flex flex-col max-h-[92vh]">
        {/* Top Bar */}
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-950/70">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 flex items-center justify-center">
              <Truck className="w-4 h-4" />
            </div>
            <div>
              <h2 className="font-extrabold text-base text-white">Track Orders & Escrow Deliveries</h2>
              <p className="text-xs text-slate-400">Live courier tracking and QA certificate inspection</p>
            </div>
          </div>

          <button
            id="close-orders-modal"
            onClick={onClose}
            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="overflow-y-auto p-6 flex-1 space-y-6">
          {orders.length === 0 ? (
            <div className="py-16 text-center space-y-3">
              <Package className="w-12 h-12 text-slate-600 mx-auto" />
              <h4 className="font-bold text-base text-slate-300">No orders placed yet</h4>
              <p className="text-xs text-slate-500">
                When you buy computer accessories on Foster A Tech, your tracking progress will appear here.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Left Column: Order Selector */}
              <div className="lg:col-span-4 space-y-3">
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                  Your Purchases ({orders.length})
                </h4>

                <div className="space-y-2">
                  {orders.map((o) => (
                    <div
                      key={o.id}
                      onClick={() => setSelectedOrderId(o.id)}
                      className={`p-3.5 rounded-2xl border cursor-pointer transition-all ${
                        selectedOrder?.id === o.id
                          ? "bg-emerald-500/15 border-emerald-500 text-white shadow-md shadow-emerald-500/10"
                          : "bg-slate-950/60 border-slate-800 text-slate-300 hover:border-slate-700"
                      }`}
                    >
                      <div className="flex items-center justify-between text-xs font-bold mb-1">
                        <span className="font-mono text-emerald-400">#{o.id}</span>
                        <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-slate-800 text-slate-300">
                          {o.status}
                        </span>
                      </div>
                      <p className="text-xs font-medium text-slate-200 truncate">
                        {o.items.map((i) => i.product.title).join(", ")}
                      </p>
                      <div className="flex items-center justify-between text-[11px] text-slate-400 mt-2 pt-2 border-t border-slate-800/80">
                        <span>Total: <strong className="text-white font-mono">${o.totalAmount.toFixed(2)}</strong></span>
                        <span>{new Date(o.createdAt).toLocaleDateString()}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Right Column: Active Order Details & Stepper */}
              {selectedOrder && (
                <div className="lg:col-span-8 space-y-4">
                  {/* Order Overview Header Card */}
                  <div className="bg-slate-950/70 border border-slate-800 rounded-2xl p-4 flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-slate-400">Order ID:</span>
                        <span className="text-sm font-mono font-bold text-white">#{selectedOrder.id}</span>
                        <span className="px-2 py-0.5 rounded-lg bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 text-xs font-bold">
                          {selectedOrder.status}
                        </span>
                      </div>
                      <p className="text-xs text-slate-400 mt-1">
                        Carrier: <strong className="text-slate-200">{selectedOrder.carrier}</strong> • Tracking: <span className="font-mono text-indigo-400">{selectedOrder.trackingNumber}</span>
                      </p>
                    </div>

                    <button
                      onClick={() => handleSimulateNextStep(selectedOrder)}
                      className="px-3.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-emerald-400 border border-emerald-500/30 text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer"
                      title="Advance to next courier step for live demonstration"
                    >
                      <Zap className="w-3.5 h-3.5" />
                      <span>Simulate Next Courier Step</span>
                    </button>
                  </div>

                  {/* Shipment Stepper */}
                  <div className="bg-slate-950/70 border border-slate-800 rounded-2xl p-5 space-y-4">
                    <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-2">
                      <ShieldCheck className="w-4 h-4 text-emerald-400" />
                      <span>Foster Escrow & Verification Pipeline</span>
                    </h4>

                    <div className="space-y-4 relative before:absolute before:inset-0 before:left-3 before:w-0.5 before:bg-slate-800">
                      {selectedOrder.timeline.map((step, idx) => (
                        <div key={idx} className="relative flex items-start gap-4 pl-1">
                          <div
                            className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 z-10 text-xs font-bold ${
                              step.completed
                                ? "bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/30"
                                : step.current
                                ? "bg-cyan-500 text-slate-950 ring-4 ring-cyan-500/20 animate-pulse"
                                : "bg-slate-800 text-slate-500 border border-slate-700"
                            }`}
                          >
                            {step.completed ? <CheckCircle2 className="w-3.5 h-3.5" /> : idx + 1}
                          </div>

                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between">
                              <h5 className={`text-xs font-bold ${step.completed || step.current ? "text-white" : "text-slate-500"}`}>
                                {step.step}
                              </h5>
                              <span className="text-[11px] text-slate-500">{step.timestamp}</span>
                            </div>
                            <p className="text-xs text-slate-400 mt-0.5">{step.description}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Items in Order */}
                  <div className="bg-slate-950/70 border border-slate-800 rounded-2xl p-4 space-y-3">
                    <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                      Purchased Accessory Items
                    </h4>
                    <div className="space-y-2">
                      {selectedOrder.items.map((item) => (
                        <div
                          key={item.product.id}
                          className="flex items-center justify-between p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs"
                        >
                          <div className="flex items-center gap-3">
                            <img
                              src={item.product.thumbnail || item.product.images[0]}
                              alt={item.product.title}
                              className="w-10 h-10 rounded-lg object-cover border border-slate-800"
                            />
                            <div>
                              <p className="font-bold text-white">{item.product.title}</p>
                              <p className="text-[11px] text-slate-400">Qty: {item.quantity} • {item.product.condition}</p>
                            </div>
                          </div>
                          <span className="font-mono font-bold text-emerald-400">
                            ${(item.product.price * item.quantity).toFixed(2)}
                          </span>
                        </div>
                      ))}
                    </div>

                    <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
                      <span>Destination: {selectedOrder.shippingAddress.city}, {selectedOrder.shippingAddress.state}</span>
                      <span>Payment: <strong className="text-white">{selectedOrder.paymentMethod}</strong></span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
