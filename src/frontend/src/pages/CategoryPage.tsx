import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useQuery } from "@tanstack/react-query";
import { useNavigate, useParams } from "@tanstack/react-router";
import { useState } from "react";
import { ProductCard } from "../components/ProductCard";
import { useActor } from "../hooks/useActor";
import { useFadeIn } from "../hooks/useFadeIn";
import { CATEGORIES, type Product, slugToCategoryName } from "../types";

export default function CategoryPage() {
  const params = useParams({ strict: false }) as { slug?: string };
  const slug = params.slug ?? "";
  const categoryName = slugToCategoryName(slug);
  const catData = CATEGORIES.find((c) => c.slug === slug);

  const { actor, isFetching } = useActor();
  const [inStockOnly, setInStockOnly] = useState(false);
  const navigate = useNavigate();
  const titleRef = useFadeIn();

  const { data: products = [], isLoading } = useQuery<Product[]>({
    queryKey: ["products", categoryName],
    queryFn: async () => {
      if (!actor) return [];
      return (actor as any).getProductsByCategory(categoryName) as Promise<
        Product[]
      >;
    },
    enabled: !!actor && !isFetching,
  });

  const filtered = inStockOnly ? products.filter((p) => p.inStock) : products;

  return (
    <main style={{ background: "var(--ivory)" }}>
      <section
        className="relative flex items-end pb-16 pt-32"
        style={{ minHeight: "50vh", background: "var(--charcoal)" }}
      >
        {catData && (
          <div className="absolute inset-0">
            <img
              src={catData.image}
              alt={categoryName}
              className="w-full h-full object-cover opacity-50"
            />
          </div>
        )}
        <div
          className="absolute inset-0"
          style={{ background: "rgba(0,0,0,0.35)" }}
        />
        <div
          className="relative z-10 max-w-screen-xl mx-auto px-6 md:px-12 w-full"
          ref={titleRef}
        >
          <p
            className="text-xs tracking-[0.3em] uppercase mb-3"
            style={{ color: "var(--bronze)" }}
          >
            Collection
          </p>
          <h1 className="font-serif text-4xl md:text-6xl font-light text-ivory">
            {categoryName}
          </h1>
        </div>
      </section>

      <section className="py-16 md:py-24 px-6 md:px-12">
        <div className="max-w-screen-xl mx-auto">
          <div className="flex items-center justify-between mb-10">
            <p className="text-xs tracking-wider opacity-50">
              {filtered.length} pieces
            </p>
            <div className="flex items-center gap-3">
              <Label
                htmlFor="instock"
                className="text-xs tracking-wider uppercase opacity-70"
              >
                In Stock Only
              </Label>
              <Switch
                id="instock"
                checked={inStockOnly}
                onCheckedChange={setInStockOnly}
                data-ocid="category.instock.toggle"
              />
            </div>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-6 md:gap-8">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} data-ocid={`category.item.${i}`}>
                  <div
                    className="aspect-square"
                    style={{ background: "var(--stone)" }}
                  />
                  <div
                    className="h-3 mt-4 w-2/3"
                    style={{ background: "var(--stone-light)" }}
                  />
                </div>
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <div className="py-24 text-center" data-ocid="category.empty_state">
              <p className="font-serif text-2xl font-light opacity-50">
                No pieces available
              </p>
              <button
                type="button"
                onClick={() => navigate({ to: "/" })}
                className="btn-bronze mt-8"
              >
                Return Home
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-6 md:gap-8">
              {filtered.map((p, i) => (
                <div key={p.id.toString()} data-ocid={`category.item.${i + 1}`}>
                  <ProductCard product={p} />
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
