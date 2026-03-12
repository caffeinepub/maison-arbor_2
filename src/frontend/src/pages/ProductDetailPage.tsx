import { useQuery } from "@tanstack/react-query";
import { useNavigate, useParams } from "@tanstack/react-router";
import { ArrowLeft, Check, Minus, Plus } from "lucide-react";
import { useState } from "react";
import { ProductCard } from "../components/ProductCard";
import { useCart } from "../context/CartContext";
import { useActor } from "../hooks/useActor";
import { type Product, categoryNameToSlug, formatPrice } from "../types";

export default function ProductDetailPage() {
  const params = useParams({ strict: false }) as { id?: string };
  const productId = params.id ?? "0";
  const { actor, isFetching } = useActor();
  const { addItem } = useCart();
  const navigate = useNavigate();
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  const { data: optProduct, isLoading } = useQuery<[Product] | []>({
    queryKey: ["product", productId],
    queryFn: async () => {
      if (!actor) return [];
      return (actor as any).getProductById(BigInt(productId)) as Promise<
        [Product] | []
      >;
    },
    enabled: !!actor && !isFetching,
  });

  const product = optProduct && optProduct.length > 0 ? optProduct[0] : null;

  const { data: relatedProducts = [] } = useQuery<Product[]>({
    queryKey: ["related", product?.category],
    queryFn: async () => {
      if (!actor || !product) return [];
      return (actor as any).getProductsByCategory(product.category) as Promise<
        Product[]
      >;
    },
    enabled: !!actor && !!product,
  });

  const related = relatedProducts
    .filter((p) => p.id !== product?.id)
    .slice(0, 3);

  const handleAddToCart = () => {
    if (product) {
      addItem(product, quantity);
      setAdded(true);
      setTimeout(() => setAdded(false), 2000);
    }
  };

  if (isLoading) {
    return (
      <main className="pt-32 px-6 md:px-12 max-w-screen-xl mx-auto">
        <div className="grid md:grid-cols-2 gap-12">
          <div
            className="aspect-square"
            style={{ background: "var(--stone)" }}
          />
          <div className="space-y-4">
            <div className="h-4 w-1/2" style={{ background: "var(--stone)" }} />
            <div className="h-8 w-3/4" style={{ background: "var(--stone)" }} />
          </div>
        </div>
      </main>
    );
  }

  if (!product) {
    return (
      <main className="pt-40 text-center px-6">
        <p className="font-serif text-2xl font-light">Product not found</p>
        <button
          type="button"
          onClick={() => navigate({ to: "/" })}
          className="btn-bronze mt-8"
        >
          Return Home
        </button>
      </main>
    );
  }

  return (
    <main style={{ background: "var(--ivory)" }}>
      <section className="pt-28 pb-20 px-6 md:px-12">
        <div className="max-w-screen-xl mx-auto">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-xs tracking-wider uppercase mb-12 opacity-50">
            <button
              type="button"
              onClick={() => navigate({ to: "/" })}
              className="hover:opacity-60 flex items-center gap-1"
            >
              <ArrowLeft size={10} /> Home
            </button>
            <span>/</span>
            <button
              type="button"
              onClick={() =>
                navigate({
                  to: `/category/${categoryNameToSlug(product.category)}` as any,
                })
              }
              className="hover:opacity-60"
            >
              {product.category}
            </button>
            <span>/</span>
            <span style={{ color: "var(--bronze)" }}>{product.name}</span>
          </div>

          <div className="grid md:grid-cols-2 gap-12 md:gap-20">
            <div
              className="relative overflow-hidden"
              style={{ background: "var(--stone)", aspectRatio: "1/1" }}
            >
              <img
                src={product.imageUrl}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            </div>

            <div className="flex flex-col justify-center">
              <p
                className="text-xs tracking-[0.25em] uppercase mb-3"
                style={{ color: "var(--bronze)" }}
              >
                {product.material}
              </p>
              <h1 className="font-serif text-4xl md:text-5xl font-light leading-tight mb-2">
                {product.name}
              </h1>
              <p className="text-xs tracking-wider uppercase mb-8 opacity-40">
                {product.category}
              </p>
              <p
                className="font-serif text-3xl font-light mb-8"
                style={{ color: "var(--walnut)" }}
              >
                {formatPrice(product.price)}
              </p>
              <p className="text-sm leading-8 opacity-70 mb-10 max-w-md">
                {product.description}
              </p>

              {product.inStock ? (
                <div className="space-y-4">
                  <div className="flex items-center gap-4">
                    <span className="text-xs tracking-[0.2em] uppercase opacity-50 w-20">
                      Quantity
                    </span>
                    <div className="flex items-center border border-stone">
                      <button
                        type="button"
                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                        className="w-9 h-9 flex items-center justify-center hover:bg-stone transition-colors"
                      >
                        <Minus size={12} />
                      </button>
                      <span className="w-10 text-center text-sm">
                        {quantity}
                      </span>
                      <button
                        type="button"
                        onClick={() => setQuantity(quantity + 1)}
                        className="w-9 h-9 flex items-center justify-center hover:bg-stone transition-colors"
                      >
                        <Plus size={12} />
                      </button>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={handleAddToCart}
                    className="btn-bronze flex items-center gap-3"
                    data-ocid="product.add_button"
                  >
                    {added ? (
                      <>
                        <Check size={14} /> Added to Cart
                      </>
                    ) : (
                      "Add to Cart"
                    )}
                  </button>
                </div>
              ) : (
                <p className="text-xs tracking-[0.2em] uppercase opacity-40">
                  Currently Unavailable
                </p>
              )}
            </div>
          </div>
        </div>
      </section>

      {related.length > 0 && (
        <section
          className="py-16 md:py-24 px-6 md:px-12"
          style={{ background: "var(--stone-light)" }}
        >
          <div className="max-w-screen-xl mx-auto">
            <h2 className="font-serif text-2xl font-light mb-10">
              You May Also Like
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
              {related.map((p) => (
                <ProductCard key={p.id.toString()} product={p} />
              ))}
            </div>
          </div>
        </section>
      )}
    </main>
  );
}
