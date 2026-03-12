import { useNavigate } from "@tanstack/react-router";
import { Check } from "lucide-react";

export default function OrderConfirmationPage() {
  const navigate = useNavigate();

  return (
    <main
      className="min-h-screen flex items-center justify-center px-6"
      style={{ background: "var(--ivory)" }}
    >
      <div className="text-center max-w-md">
        <div
          className="w-16 h-16 flex items-center justify-center mx-auto mb-8"
          style={{ border: "1px solid var(--bronze)" }}
        >
          <Check size={24} strokeWidth={1} style={{ color: "var(--bronze)" }} />
        </div>
        <p
          className="text-xs tracking-[0.4em] uppercase mb-4"
          style={{ color: "var(--bronze)" }}
        >
          Order Confirmed
        </p>
        <h1 className="font-serif text-4xl font-light mb-6">Thank You</h1>
        <p className="text-sm leading-8 opacity-60 mb-10">
          Your order has been placed and is being prepared with the care it
          deserves. You will receive confirmation details shortly.
        </p>
        <button
          type="button"
          className="btn-bronze"
          onClick={() => navigate({ to: "/" })}
          data-ocid="confirmation.continue_button"
        >
          Continue Shopping
        </button>
      </div>
    </main>
  );
}
