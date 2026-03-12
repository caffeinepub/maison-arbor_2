import { useNavigate } from "@tanstack/react-router";
import { Minus, Plus, ShoppingBag, X } from "lucide-react";
import { useCart } from "../context/CartContext";
import { formatPrice } from "../types";

export function CartSidebar({
  open,
  onClose,
}: { open: boolean; onClose: () => void }) {
  const { items, removeItem, updateQuantity, totalPrice, totalItems } =
    useCart();
  const navigate = useNavigate();

  return (
    <>
      {/* Overlay */}
      {open && (
        <div
          className="fixed inset-0 bg-charcoal/30 z-40 transition-opacity"
          onClick={onClose}
          onKeyDown={(e) => e.key === "Escape" && onClose()}
          role="button"
          tabIndex={-1}
          aria-label="Close cart"
        />
      )}

      {/* Drawer */}
      <div
        className={`fixed top-0 right-0 h-full w-full max-w-md bg-ivory z-50 flex flex-col transition-transform duration-500 ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
        style={{ borderLeft: "1px solid var(--stone)" }}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-8 py-6 border-b border-stone">
          <div>
            <h2 className="font-serif text-xl font-light tracking-wide">
              Your Cart
            </h2>
            <p className="text-xs text-stone tracking-widest uppercase mt-0.5">
              {totalItems} {totalItems === 1 ? "item" : "items"}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-charcoal hover:opacity-50 transition-opacity"
          >
            <X size={20} strokeWidth={1.5} />
          </button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto px-8 py-6">
          {items.length === 0 ? (
            <div
              className="h-full flex flex-col items-center justify-center gap-4 text-center"
              data-ocid="cart.empty_state"
            >
              <ShoppingBag
                size={40}
                strokeWidth={1}
                style={{ color: "var(--stone)" }}
              />
              <p className="font-serif text-lg font-light text-charcoal">
                Your cart is empty
              </p>
              <p className="text-xs tracking-wider text-stone uppercase">
                Discover our collections
              </p>
              <button
                type="button"
                onClick={() => {
                  onClose();
                  navigate({ to: "/" });
                }}
                className="btn-bronze mt-4"
              >
                Explore
              </button>
            </div>
          ) : (
            <div className="flex flex-col gap-6">
              {items.map((item, idx) => (
                <div
                  key={item.product.id.toString()}
                  className="flex gap-4"
                  data-ocid={`cart.item.${idx + 1}`}
                >
                  <div className="w-20 h-20 bg-stone flex-shrink-0 img-zoom">
                    <img
                      src={item.product.imageUrl}
                      alt={item.product.name}
                      className="w-full h-full"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-serif text-sm font-light truncate">
                      {item.product.name}
                    </p>
                    <p
                      className="text-xs tracking-wider uppercase"
                      style={{ color: "var(--bronze)" }}
                    >
                      {item.product.material}
                    </p>
                    <p className="text-sm mt-1 font-light">
                      {formatPrice(item.product.price)}
                    </p>
                    <div className="flex items-center gap-3 mt-2">
                      <button
                        type="button"
                        onClick={() =>
                          updateQuantity(item.product.id, item.quantity - 1)
                        }
                        className="w-6 h-6 flex items-center justify-center border border-stone hover:border-charcoal transition-colors"
                      >
                        <Minus size={10} />
                      </button>
                      <span className="text-xs w-4 text-center">
                        {item.quantity}
                      </span>
                      <button
                        type="button"
                        onClick={() =>
                          updateQuantity(item.product.id, item.quantity + 1)
                        }
                        className="w-6 h-6 flex items-center justify-center border border-stone hover:border-charcoal transition-colors"
                      >
                        <Plus size={10} />
                      </button>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => removeItem(item.product.id)}
                    className="text-stone hover:text-charcoal transition-colors flex-shrink-0"
                  >
                    <X size={14} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="px-8 py-6 border-t border-stone">
            <div className="flex justify-between items-center mb-6">
              <span className="text-xs tracking-[0.2em] uppercase">
                Subtotal
              </span>
              <span className="font-serif text-lg font-light">
                {formatPrice(totalPrice)}
              </span>
            </div>
            <button
              type="button"
              className="btn-walnut w-full"
              onClick={() => {
                onClose();
                navigate({ to: "/checkout" });
              }}
            >
              Proceed to Checkout
            </button>
            <button
              type="button"
              className="btn-bronze w-full mt-3"
              onClick={() => {
                onClose();
                navigate({ to: "/cart" });
              }}
            >
              View Cart
            </button>
          </div>
        )}
      </div>
    </>
  );
}
