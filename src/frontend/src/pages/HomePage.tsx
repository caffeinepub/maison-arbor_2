import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { useRef } from "react";
import { ProductCard } from "../components/ProductCard";
import { useActor } from "../hooks/useActor";
import { useFadeIn } from "../hooks/useFadeIn";
import { CATEGORIES, type Product } from "../types";

const LOOKBOOK_IMGS = [
  "/assets/generated/lookbook-1.dim_1200x800.jpg",
  "/assets/generated/lookbook-2.dim_1200x800.jpg",
  "/assets/generated/lookbook-3.dim_1200x800.jpg",
];

export default function HomePage() {
  const navigate = useNavigate();
  const { actor, isFetching } = useActor();

  const { data: featured = [] } = useQuery<Product[]>({
    queryKey: ["featured"],
    queryFn: async () => {
      if (!actor) return [];
      return (actor as any).getFeaturedProducts() as Promise<Product[]>;
    },
    enabled: !!actor && !isFetching,
  });

  const manifestoRef = useFadeIn();
  const categoriesRef = useFadeIn();
  const featuredRef = useFadeIn();
  const craftRef = useFadeIn();
  const lookbookRef = useFadeIn();
  const lookbookScrollRef = useRef<HTMLDivElement>(null);
  const dragState = useRef({ isDragging: false, startX: 0, scrollLeft: 0 });

  const onMouseDown = (e: React.MouseEvent) => {
    dragState.current.isDragging = true;
    dragState.current.startX =
      e.pageX - (lookbookScrollRef.current?.offsetLeft || 0);
    dragState.current.scrollLeft = lookbookScrollRef.current?.scrollLeft || 0;
  };
  const onMouseMove = (e: React.MouseEvent) => {
    if (!dragState.current.isDragging || !lookbookScrollRef.current) return;
    e.preventDefault();
    const x = e.pageX - (lookbookScrollRef.current.offsetLeft || 0);
    lookbookScrollRef.current.scrollLeft =
      dragState.current.scrollLeft - (x - dragState.current.startX);
  };
  const onMouseUp = () => {
    dragState.current.isDragging = false;
  };

  return (
    <main>
      {/* Hero */}
      <section
        className="relative h-screen flex items-center justify-center"
        style={{ background: "var(--charcoal)" }}
      >
        <div className="absolute inset-0">
          <img
            src="/assets/generated/hero-interior.dim_1920x1080.jpg"
            alt="Maison Arbor — Luxury Interiors"
            className="w-full h-full object-cover"
            style={{ opacity: 0.75 }}
          />
        </div>
        <div
          className="absolute inset-0"
          style={{ background: "rgba(0,0,0,0.22)" }}
        />
        <div className="relative z-10 text-center px-6">
          <h1
            className="font-serif font-light text-ivory mb-4"
            style={{
              fontSize: "clamp(2.5rem, 8vw, 7rem)",
              letterSpacing: "0.3em",
            }}
          >
            MAISON ARBOR
          </h1>
          <p
            className="text-xs tracking-[0.5em] uppercase mb-12"
            style={{ color: "var(--bronze)" }}
          >
            Rooted in Excellence
          </p>
          <button
            type="button"
            onClick={() =>
              navigate({
                to: "/category/$slug",
                params: { slug: "coffee-tables" },
              })
            }
            className="text-ivory text-xs tracking-[0.25em] uppercase flex items-center gap-2 mx-auto group"
            style={{ borderBottom: "1px solid transparent" }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderBottomColor = "var(--bronze)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderBottomColor = "transparent";
            }}
            data-ocid="hero.primary_button"
          >
            Discover the Collection
            <ArrowRight
              size={14}
              className="transition-transform group-hover:translate-x-1"
            />
          </button>
        </div>
      </section>

      {/* Brand Manifesto */}
      <section
        className="py-28 md:py-36 px-6 md:px-16 max-w-screen-xl mx-auto"
        ref={manifestoRef}
      >
        <div className="grid md:grid-cols-2 gap-12 md:gap-20 items-center">
          <div>
            <span
              className="font-serif text-[8rem] leading-none font-light select-none"
              style={{ color: "var(--stone)" }}
            >
              “
            </span>
          </div>
          <div>
            <h2 className="font-serif text-4xl md:text-5xl font-light leading-tight mb-8">
              Permanence
              <br />
              Over Trends
            </h2>
            <p className="text-sm leading-8 mb-5 opacity-70 max-w-lg">
              At Maison Arbor, we craft furniture that refuses to be
              fashionable. Each piece is built to outlast the season it was made
              in—designed with architectural intention, shaped by master
              craftspeople, and finished with materials that improve with age.
            </p>
            <p className="text-sm leading-8 opacity-70 max-w-lg">
              We believe the finest things in a home should feel inevitable. Our
              tables, units and stands are not ornaments. They are
              structures—grounded in form, honest in material, enduring by
              design.
            </p>
            <button
              type="button"
              onClick={() => navigate({ to: "/about" })}
              className="mt-8 text-xs tracking-[0.25em] uppercase flex items-center gap-2 group"
              style={{ color: "var(--bronze)" }}
            >
              Our Story{" "}
              <ArrowRight
                size={12}
                className="transition-transform group-hover:translate-x-1"
              />
            </button>
          </div>
        </div>
      </section>

      <div className="section-divider max-w-screen-xl mx-auto" />

      {/* Category Gallery */}
      <section className="py-24 md:py-32 px-6 md:px-12" ref={categoriesRef}>
        <div className="max-w-screen-xl mx-auto">
          <div className="mb-12">
            <p
              className="text-xs tracking-[0.3em] uppercase mb-3"
              style={{ color: "var(--bronze)" }}
            >
              Collections
            </p>
            <h2 className="font-serif text-3xl md:text-4xl font-light">
              The Edit
            </h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {CATEGORIES.map((cat, idx) => (
              <button
                type="button"
                key={cat.slug}
                className="group text-left"
                onClick={() =>
                  navigate({
                    to: "/category/$slug",
                    params: { slug: cat.slug },
                  })
                }
                data-ocid={`categories.item.${idx + 1}`}
              >
                <div
                  className="img-zoom relative overflow-hidden"
                  style={{
                    aspectRatio: idx % 3 === 0 ? "4/5" : "3/4",
                    background: "var(--stone)",
                  }}
                >
                  <img
                    src={cat.image}
                    alt={cat.name}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                  <div
                    className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity"
                    style={{
                      border: "1px solid var(--bronze)",
                      pointerEvents: "none",
                    }}
                  />
                </div>
                <p className="font-serif text-base font-light mt-3">
                  {cat.name}
                </p>
                <p
                  className="text-xs tracking-wider uppercase mt-1 opacity-0 group-hover:opacity-100 transition-opacity"
                  style={{ color: "var(--bronze)" }}
                >
                  Explore →
                </p>
              </button>
            ))}
          </div>
        </div>
      </section>

      <div
        className="section-divider"
        style={{ background: "var(--stone-light)" }}
      />

      {/* Featured Products */}
      <section className="py-24 md:py-32 px-6 md:px-12" ref={featuredRef}>
        <div className="max-w-screen-xl mx-auto">
          <div className="mb-12">
            <p
              className="text-xs tracking-[0.3em] uppercase mb-3"
              style={{ color: "var(--bronze)" }}
            >
              Featured
            </p>
            <h2 className="font-serif text-3xl md:text-4xl font-light">
              Selected Works
            </h2>
          </div>
          {featured.length === 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {[1, 2, 3, 4].map((i) => (
                <div key={i}>
                  <div
                    className="aspect-square"
                    style={{ background: "var(--stone)" }}
                  />
                  <div
                    className="h-3 mt-4 w-2/3"
                    style={{ background: "var(--stone-light)" }}
                  />
                  <div
                    className="h-3 mt-2 w-1/3"
                    style={{ background: "var(--stone-light)" }}
                  />
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {featured.slice(0, 4).map((p, i) => (
                <ProductCard key={p.id.toString()} product={p} index={i + 1} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Craftsmanship */}
      <section
        className="py-24 md:py-32"
        style={{ background: "var(--stone)" }}
        ref={craftRef}
      >
        <div className="max-w-screen-xl mx-auto px-6 md:px-12">
          <div className="grid md:grid-cols-2 gap-8 mb-12">
            <div
              className="img-zoom overflow-hidden"
              style={{ aspectRatio: "3/2" }}
            >
              <img
                src="/assets/generated/craft-wood-grain.dim_1200x800.jpg"
                alt="Wood grain detail"
                className="w-full h-full object-cover"
                loading="lazy"
              />
            </div>
            <div
              className="img-zoom overflow-hidden"
              style={{ aspectRatio: "3/2" }}
            >
              <img
                src="/assets/generated/craft-joinery.dim_1200x800.jpg"
                alt="Joinery craftsmanship"
                className="w-full h-full object-cover"
                loading="lazy"
              />
            </div>
          </div>
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div />
            <div>
              <p
                className="text-xs tracking-[0.3em] uppercase mb-4"
                style={{ color: "var(--walnut)" }}
              >
                Craftsmanship
              </p>
              <h2 className="font-serif text-3xl md:text-4xl font-light mb-6 leading-tight">
                The Craft of
                <br />
                Permanence
              </h2>
              <p className="text-sm leading-8 opacity-70 mb-4">
                Every joint, every grain, every finish is deliberate. We work
                with FSC-certified hardwoods—solid sheesham, walnut, teak, and
                oak—sourced for their character as much as their durability.
              </p>
              <p className="text-sm leading-8 opacity-70">
                Our craftspeople are third-generation artisans. The mortise and
                tenon joints are cut by hand. The finishes are applied in four
                coats. Nothing is hurried. Everything is built to last.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Lookbook */}
      <section className="py-24 md:py-32 px-6 md:px-12" ref={lookbookRef}>
        <div className="max-w-screen-xl mx-auto">
          <div className="mb-10">
            <p
              className="text-xs tracking-[0.3em] uppercase mb-3"
              style={{ color: "var(--bronze)" }}
            >
              Lookbook
            </p>
            <h2 className="font-serif text-3xl md:text-4xl font-light">
              Living Spaces
            </h2>
          </div>
          <div
            className="flex gap-5 overflow-x-auto cursor-grab active:cursor-grabbing select-none"
            style={{ scrollbarWidth: "none" }}
            ref={lookbookScrollRef}
            onMouseDown={onMouseDown}
            onMouseMove={onMouseMove}
            onMouseUp={onMouseUp}
            onMouseLeave={onMouseUp}
            data-ocid="lookbook.panel"
          >
            {LOOKBOOK_IMGS.map((src) => (
              <div
                key={src}
                className="img-zoom flex-shrink-0 overflow-hidden"
                style={{
                  width: "clamp(280px, 70vw, 800px)",
                  aspectRatio: "3/2",
                }}
              >
                <img
                  src={src}
                  alt="Lifestyle interior"
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
