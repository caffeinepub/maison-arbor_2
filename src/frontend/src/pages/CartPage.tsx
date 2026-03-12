import { useNavigate } from "@tanstack/react-router";
import { Minus, Plus, ShoppingBag, X } from "lucide-react";
import { useCart } from "../context/CartContext";
import { formatPrice } from "../types";

export default function CartPage() {
  const { items, removeItem, updateQuantity, totalPrice } = useCart();
  const navigate = useNavigate();

  return (
    <main
      className="pt-28 pb-24 px-6 md:px-12 min-h-screen"
      style={{ background: "var(--ivory)" }}
    >
      <div className="max-w-screen-xl mx-auto">
        <div className="mb-12">
          <p
            className="text-xs tracking-[0.3em] uppercase mb-2"
            style={{ color: "var(--bronze)" }}
          >
            Review
          </p>
          <h1 className="font-serif text-4xl font-light">Your Cart</h1>
        </div>

        {items.length === 0 ? (
          <div
            className="py-32 flex flex-col items-center gap-6"
            data-ocid="cart.empty_state"
          >
            <ShoppingBag
              size={48}
              strokeWidth={1}
              style={{ color: "var(--stone)" }}
            />
            <p className="font-serif text-2xl font-light opacity-50">
              Your cart is empty
            </p>
            <button
              type="button"
              onClick={() => navigate({ to: "/" })}
              className="btn-bronze"
            >
              Explore Collections
            </button>
          </div>
        ) : (
          <div className="grid md:grid-cols-3 gap-12">
            <div className="md:col-span-2 space-y-0">
              <div className="hidden md:grid grid-cols-4 text-xs tracking-[0.2em] uppercase opacity-40 pb-4 border-b border-stone">
                <span className="col-span-2">Product</span>
                <span className="text-center">Quantity</span>
                <span className="text-right">Price</span>
              </div>
              {items.map((item, idx) => (
                <div
                  key={item.product.id.toString()}
                  className="grid grid-cols-3 md:grid-cols-4 gap-4 items-center py-6 border-b border-stone"
                  data-ocid={`cart.item.${idx + 1}`}
                >
                  <div className="col-span-2 flex gap-4 items-center">
                    <div
                      className="w-16 h-16 md:w-20 md:h-20 flex-shrink-0 overflow-hidden"
                      style={{ background: "var(--stone)" }}
                    >
                      <img
                        src={item.product.imageUrl}
                        alt={item.product.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div>
                      <p className="font-serif text-base font-light">
                        {item.product.name}
                      </p>
                      <p
                        className="text-xs tracking-wider uppercase mt-1"
                        style={{ color: "var(--bronze)" }}
                      >
                        {item.product.material}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 justify-center">
                    <button
                      type="button"
                      onClick={() =>
                        updateQuantity(item.product.id, item.quantity - 1)
                      }
                      className="w-7 h-7 flex items-center justify-center border border-stone hover:border-charcoal transition-colors"
                    >
                      <Minus size={10} />
                    </button>
                    <span className="text-sm w-6 text-center">
                      {item.quantity}
                    </span>
                    <button
                      type="button"
                      onClick={() =>
                        updateQuantity(item.product.id, item.quantity + 1)
                      }
                      className="w-7 h-7 flex items-center justify-center border border-stone hover:border-charcoal transition-colors"
                    >
                      <Plus size={10} />
                    </button>
                  </div>

                  <div className="flex items-center justify-end gap-4">
                    <span className="font-light text-sm">
                      {formatPrice(item.product.price * BigInt(item.quantity))}
                    </span>
                    <button
                      type="button"
                      onClick={() => removeItem(item.product.id)}
                      className="text-stone hover:text-charcoal transition-colors"
                      data-ocid={`cart.remove_button.${idx + 1}`}
                    >
                      <X size={14} />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="border border-stone p-8 h-fit">
              <h3 className="font-serif text-xl font-light mb-6">
                Order Summary
              </h3>
              <div className="space-y-3 mb-6 text-sm">
                {items.map((item) => (
                  <div
                    key={item.product.id.toString()}
                    className="flex justify-between opacity-60"
                  >
                    <span className="truncate mr-4">
                      {item.product.name} ×{item.quantity}
                    </span>
                    <span>
                      {formatPrice(item.product.price * BigInt(item.quantity))}
                    </span>
                  </div>
                ))}
              </div>
              <div className="section-divider mb-4" />
              <div className="flex justify-between font-serif text-lg font-light mb-8">
                <span>Total</span>
                <span>{formatPrice(totalPrice)}</span>
              </div>
              <button
                type="button"
                className="btn-walnut w-full"
                onClick={() => navigate({ to: "/checkout" })}
                data-ocid="cart.checkout_button"
              >
                Proceed to Checkout
              </button>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
