import { useFadeIn } from "../hooks/useFadeIn";

export default function AboutPage() {
  const heroRef = useFadeIn();
  const sec1Ref = useFadeIn();
  const sec2Ref = useFadeIn();
  const sec3Ref = useFadeIn();

  return (
    <main style={{ background: "var(--ivory)" }} data-ocid="about.page">
      {/* Hero */}
      <section
        className="relative"
        style={{ height: "70vh", background: "var(--charcoal)" }}
      >
        <div className="absolute inset-0">
          <img
            src="/assets/generated/about-craftsman.dim_1400x800.jpg"
            alt="Master craftsman"
            className="w-full h-full object-cover"
            style={{ opacity: 0.6 }}
          />
        </div>
        <div
          className="absolute inset-0"
          style={{ background: "rgba(0,0,0,0.3)" }}
        />
        <div
          className="relative z-10 h-full flex flex-col justify-end pb-16 px-6 md:px-16 max-w-screen-xl mx-auto"
          ref={heroRef}
        >
          <p
            className="text-xs tracking-[0.4em] uppercase mb-4"
            style={{ color: "var(--bronze)" }}
          >
            Our Story
          </p>
          <h1 className="font-serif text-5xl md:text-7xl font-light text-ivory">
            Maison Arbor
          </h1>
        </div>
      </section>

      {/* Section 1: Origins */}
      <section
        className="py-24 md:py-32 px-6 md:px-16 max-w-screen-xl mx-auto"
        ref={sec1Ref}
      >
        <div className="grid md:grid-cols-2 gap-12 md:gap-24 items-center">
          <div>
            <p
              className="text-xs tracking-[0.3em] uppercase mb-4"
              style={{ color: "var(--bronze)" }}
            >
              Origins
            </p>
            <h2 className="font-serif text-4xl font-light mb-8 leading-tight">
              Built from the
              <br />
              Ground Up
            </h2>
            <p className="text-sm leading-8 opacity-70 mb-5">
              Maison Arbor was born from a simple belief: that the furniture in
              your home should outlast every trend, every season, every restless
              redesign. We started as a small workshop in the heart of a craft
              district, with five artisans and a single philosophy—permanence
              over trend.
            </p>
            <p className="text-sm leading-8 opacity-70">
              Today, we design and make furniture for people who choose things
              once and choose them forever. Every piece is built by hand, from
              wood that is responsibly sourced and personally selected.
            </p>
          </div>
          <div
            className="img-zoom overflow-hidden"
            style={{ aspectRatio: "4/5", background: "var(--stone)" }}
          >
            <img
              src="/assets/generated/craft-joinery.dim_1200x800.jpg"
              alt="Craftsmanship"
              className="w-full h-full object-cover"
              loading="lazy"
            />
          </div>
        </div>
      </section>

      <div className="section-divider" />

      {/* Section 2: Materials */}
      <section
        className="py-24 md:py-32"
        style={{ background: "var(--stone)" }}
        ref={sec2Ref}
      >
        <div className="max-w-screen-xl mx-auto px-6 md:px-16">
          <div className="grid md:grid-cols-2 gap-12 md:gap-24 items-center">
            <div
              className="img-zoom overflow-hidden"
              style={{ aspectRatio: "4/3", background: "var(--stone-light)" }}
            >
              <img
                src="/assets/generated/craft-wood-grain.dim_1200x800.jpg"
                alt="Wood grain"
                className="w-full h-full object-cover"
                loading="lazy"
              />
            </div>
            <div>
              <p
                className="text-xs tracking-[0.3em] uppercase mb-4"
                style={{ color: "var(--walnut)" }}
              >
                Materials
              </p>
              <h2 className="font-serif text-4xl font-light mb-8 leading-tight">
                Wood That
                <br />
                Tells a Story
              </h2>
              <p className="text-sm leading-8 opacity-70 mb-5">
                We work exclusively with FSC-certified hardwoods: solid walnut
                from central India, sheesham from sustainably managed forests,
                teak from Kerala’s oldest certified sources, and mango wood
                reclaimed from retired orchards.
              </p>
              <p className="text-sm leading-8 opacity-70">
                Each piece of wood is inspected for grain, density and character
                before it is allowed into the workshop. The result is furniture
                that does not just look premium—it feels it.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Section 3: Promise */}
      <section
        className="py-24 md:py-32 px-6 md:px-16 max-w-screen-xl mx-auto"
        ref={sec3Ref}
      >
        <div className="max-w-2xl mx-auto text-center">
          <p
            className="text-xs tracking-[0.3em] uppercase mb-6"
            style={{ color: "var(--bronze)" }}
          >
            The Promise
          </p>
          <h2 className="font-serif text-4xl md:text-5xl font-light mb-8 leading-tight">
            Built to Last
            <br />a Lifetime
          </h2>
          <p className="text-sm leading-8 opacity-70 mb-5">
            Every Maison Arbor piece comes with a lifetime structural warranty.
            We believe that if we build it right, we should stand behind it
            forever. No depreciation schedules. No product cycles. Just
            furniture that ages like the finest wine.
          </p>
          <p className="text-sm leading-8 opacity-70">
            This is our promise: to make things that last, from materials that
            matter, with hands that care.
          </p>
        </div>
      </section>
    </main>
  );
}
