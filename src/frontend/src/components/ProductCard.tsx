import { useNavigate } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { useState } from "react";
import { useCart } from "../context/CartContext";
import { type Product, formatPrice } from "../types";

export function ProductCard({
  product,
  index,
}: { product: Product; index?: number }) {
  const [hovered, setHovered] = useState(false);
  const { addItem } = useCart();
  const navigate = useNavigate();

  const handleClick = () =>
    navigate({ to: `/product/${product.id.toString()}` as any });

  return (
    <div
      className="group"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      data-ocid={index !== undefined ? `featured.item.${index}` : undefined}
    >
      {/* Image */}
      <button
        type="button"
        className="img-zoom relative overflow-hidden w-full block"
        style={{ background: "var(--stone)", aspectRatio: "1 / 1" }}
        onClick={handleClick}
        aria-label={`View ${product.name}`}
      >
        <img
          src={product.imageUrl}
          alt={product.name}
          className="w-full h-full object-cover"
          loading="lazy"
        />
        {!product.inStock && (
          <div className="absolute top-3 left-3 bg-charcoal text-ivory text-[9px] tracking-[0.2em] uppercase px-2 py-1">
            Sold Out
          </div>
        )}
        <div
          className={`absolute inset-0 flex items-end justify-center pb-6 transition-opacity duration-300 ${
            hovered ? "opacity-100" : "opacity-0"
          }`}
          style={{ background: "rgba(27,27,27,0.08)" }}
        >
          <span className="text-ivory text-xs tracking-[0.25em] uppercase flex items-center gap-2">
            View Details <ArrowRight size={12} />
          </span>
        </div>
      </button>

      {/* Info */}
      <div className="pt-4 pb-2">
        <p
          className="text-xs tracking-[0.15em] uppercase mb-1"
          style={{ color: "var(--bronze)" }}
        >
          {product.material}
        </p>
        <button
          type="button"
          className="font-serif text-lg font-light cursor-pointer hover:opacity-70 transition-opacity text-left w-full"
          onClick={handleClick}
        >
          {product.name}
        </button>
        <div className="flex items-center justify-between mt-2">
          <p className="font-light text-sm" style={{ color: "var(--walnut)" }}>
            {formatPrice(product.price)}
          </p>
          {product.inStock && (
            <button
              type="button"
              className="text-xs tracking-wider uppercase opacity-0 group-hover:opacity-100 transition-all duration-300"
              style={{ color: "var(--bronze)" }}
              onClick={(e) => {
                e.stopPropagation();
                addItem(product);
              }}
            >
              Add to Cart
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
