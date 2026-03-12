import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useNavigate } from "@tanstack/react-router";
import { Loader2, Lock } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { useCart } from "../context/CartContext";
import { useActor } from "../hooks/useActor";
import { formatPrice } from "../types";

declare global {
  interface Window {
    Razorpay: any;
  }
}

const STEPS = ["Customer Details", "Payment"];

export default function CheckoutPage() {
  const navigate = useNavigate();
  const { actor } = useActor();
  const { items, totalPrice, clearCart } = useCart();
  const [step, setStep] = useState(1);
  const [isProcessing, setIsProcessing] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    pincode: "",
  });

  const updateForm = (k: string, v: string) =>
    setForm((f) => ({ ...f, [k]: v }));

  const handleStep1 = (e: React.FormEvent) => {
    e.preventDefault();
    setStep(2);
  };

  const loadRazorpay = (): Promise<boolean> =>
    new Promise((resolve) => {
      if (window.Razorpay) return resolve(true);
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });

  const handlePayment = async () => {
    if (!actor || items.length === 0) return;
    setIsProcessing(true);
    try {
      const loaded = await loadRazorpay();
      if (!loaded) {
        toast.error("Payment service unavailable");
        setIsProcessing(false);
        return;
      }

      const keyId = await actor.getRazorpayKeyId();
      const totalPaise = Number(totalPrice);
      const receiptId = `receipt_${Date.now()}`;
      const orderResult = await actor.createRazorpayOrder(
        BigInt(totalPaise),
        receiptId,
      );

      let razorpayOrderId = "";
      if ("ok" in orderResult) {
        try {
          const parsed = JSON.parse(orderResult.ok);
          razorpayOrderId = parsed.id || "";
        } catch {
          razorpayOrderId = orderResult.ok;
        }
      } else {
        toast.error("Could not create payment order. Please try again.");
        setIsProcessing(false);
        return;
      }

      const rzpOptions = {
        key: keyId,
        amount: totalPaise,
        currency: "INR",
        name: "Maison Arbor",
        description: "Luxury Furniture",
        order_id: razorpayOrderId,
        handler: async (response: any) => {
          try {
            const cartItems = items.map((i) => ({
              productId: i.product.id,
              quantity: BigInt(i.quantity),
            }));
            const orderRes = await actor.createOrder(
              form,
              cartItems,
              BigInt(totalPaise),
              razorpayOrderId,
            );
            if ("ok" in orderRes) {
              // confirmPayment returns OkVoidErr — check result
              const confirmRes = await actor.confirmPayment(
                orderRes.ok,
                response.razorpay_payment_id,
              );
              if ("err" in confirmRes) {
                toast.error(
                  "Payment confirmation failed. Please contact support.",
                );
                return;
              }
              // clearCart on backend also returns OkVoidErr
              await actor.clearCart();
              clearCart(); // clear local cart state
              navigate({ to: "/order-confirmation" });
            } else {
              toast.error("Order creation failed. Please contact support.");
            }
          } catch {
            toast.error(
              "Payment recorded. Please contact support with your payment ID.",
            );
          }
        },
        prefill: { name: form.name, email: form.email, contact: form.phone },
        theme: { color: "#6A4E3B" },
        modal: { ondismiss: () => setIsProcessing(false) },
      };

      const rzp = new window.Razorpay(rzpOptions);
      rzp.open();
    } catch {
      toast.error("Payment failed. Please try again.");
      setIsProcessing(false);
    }
  };

  if (items.length === 0) {
    return (
      <main
        className="pt-40 text-center px-6"
        style={{ background: "var(--ivory)" }}
      >
        <p className="font-serif text-2xl font-light">Your cart is empty</p>
        <button
          type="button"
          onClick={() => navigate({ to: "/" })}
          className="btn-bronze mt-8"
        >
          Shop Now
        </button>
      </main>
    );
  }

  return (
    <main
      className="pt-28 pb-24 px-6 md:px-12 min-h-screen"
      style={{ background: "var(--ivory)" }}
    >
      <div className="max-w-4xl mx-auto">
        <div className="mb-12">
          <p
            className="text-xs tracking-[0.3em] uppercase mb-2"
            style={{ color: "var(--bronze)" }}
          >
            Checkout
          </p>
          <h1 className="font-serif text-4xl font-light">
            Complete Your Order
          </h1>
        </div>

        {/* Step Indicator */}
        <div className="flex items-center gap-4 mb-12">
          {STEPS.map((label, i) => (
            <div key={label} className="flex items-center gap-3">
              <div
                className="w-7 h-7 flex items-center justify-center text-xs"
                style={{
                  background: step > i ? "var(--walnut)" : "transparent",
                  border: "1px solid",
                  borderColor: step > i ? "var(--walnut)" : "var(--stone)",
                  color: step > i ? "var(--ivory)" : "var(--charcoal)",
                }}
              >
                {i + 1}
              </div>
              <span className="text-xs tracking-wider uppercase opacity-60">
                {label}
              </span>
              {i === 0 && <span className="text-stone mx-2">—</span>}
            </div>
          ))}
        </div>

        <div className="grid md:grid-cols-3 gap-10">
          <div className="md:col-span-2">
            {step === 1 ? (
              <form onSubmit={handleStep1} className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-xs tracking-wider uppercase opacity-60 mb-2 block">
                      Full Name
                    </Label>
                    <Input
                      required
                      value={form.name}
                      onChange={(e) => updateForm("name", e.target.value)}
                      className="border-stone focus:border-bronze bg-transparent rounded-none"
                      data-ocid="checkout.name_input"
                    />
                  </div>
                  <div>
                    <Label className="text-xs tracking-wider uppercase opacity-60 mb-2 block">
                      Email
                    </Label>
                    <Input
                      required
                      type="email"
                      value={form.email}
                      onChange={(e) => updateForm("email", e.target.value)}
                      className="border-stone focus:border-bronze bg-transparent rounded-none"
                      data-ocid="checkout.email_input"
                    />
                  </div>
                </div>
                <div>
                  <Label className="text-xs tracking-wider uppercase opacity-60 mb-2 block">
                    Phone
                  </Label>
                  <Input
                    required
                    type="tel"
                    value={form.phone}
                    onChange={(e) => updateForm("phone", e.target.value)}
                    className="border-stone focus:border-bronze bg-transparent rounded-none"
                    data-ocid="checkout.phone_input"
                  />
                </div>
                <div>
                  <Label className="text-xs tracking-wider uppercase opacity-60 mb-2 block">
                    Delivery Address
                  </Label>
                  <Textarea
                    required
                    value={form.address}
                    onChange={(e) => updateForm("address", e.target.value)}
                    rows={3}
                    className="border-stone focus:border-bronze bg-transparent rounded-none resize-none"
                    data-ocid="checkout.address_textarea"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-xs tracking-wider uppercase opacity-60 mb-2 block">
                      City
                    </Label>
                    <Input
                      required
                      value={form.city}
                      onChange={(e) => updateForm("city", e.target.value)}
                      className="border-stone focus:border-bronze bg-transparent rounded-none"
                      data-ocid="checkout.city_input"
                    />
                  </div>
                  <div>
                    <Label className="text-xs tracking-wider uppercase opacity-60 mb-2 block">
                      Pincode
                    </Label>
                    <Input
                      required
                      value={form.pincode}
                      onChange={(e) => updateForm("pincode", e.target.value)}
                      className="border-stone focus:border-bronze bg-transparent rounded-none"
                      data-ocid="checkout.pincode_input"
                    />
                  </div>
                </div>
                <button type="submit" className="btn-walnut">
                  Continue to Payment
                </button>
              </form>
            ) : (
              <div className="space-y-6">
                <div className="p-6 border border-stone">
                  <h3 className="font-serif text-lg font-light mb-4">
                    Delivery Details
                  </h3>
                  <div className="text-sm opacity-60 space-y-1">
                    <p>{form.name}</p>
                    <p>
                      {form.address}, {form.city} — {form.pincode}
                    </p>
                    <p>
                      {form.phone} · {form.email}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    className="text-xs tracking-wider uppercase mt-3"
                    style={{ color: "var(--bronze)" }}
                  >
                    Edit
                  </button>
                </div>
                <div className="flex items-center gap-2 text-xs opacity-40 tracking-wider">
                  <Lock size={12} /> Secured by Razorpay
                </div>
                <button
                  type="button"
                  className="btn-walnut flex items-center gap-3"
                  onClick={handlePayment}
                  disabled={isProcessing}
                  data-ocid="checkout.pay_button"
                >
                  {isProcessing && (
                    <Loader2 size={14} className="animate-spin" />
                  )}
                  {isProcessing
                    ? "Processing..."
                    : `Pay ${formatPrice(totalPrice)}`}
                </button>
              </div>
            )}
          </div>

          <div className="border border-stone p-6 h-fit">
            <h3 className="font-serif text-lg font-light mb-5">Summary</h3>
            <div className="space-y-3 mb-5">
              {items.map((item) => (
                <div
                  key={item.product.id.toString()}
                  className="flex gap-3 items-center"
                >
                  <div
                    className="w-12 h-12 overflow-hidden flex-shrink-0"
                    style={{ background: "var(--stone)" }}
                  >
                    <img
                      src={item.product.imageUrl}
                      alt={item.product.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs truncate">{item.product.name}</p>
                    <p className="text-xs opacity-40">×{item.quantity}</p>
                  </div>
                  <span className="text-xs flex-shrink-0">
                    {formatPrice(item.product.price * BigInt(item.quantity))}
                  </span>
                </div>
              ))}
            </div>
            <div className="section-divider mb-3" />
            <div className="flex justify-between font-serif font-light">
              <span>Total</span>
              <span>{formatPrice(totalPrice)}</span>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
