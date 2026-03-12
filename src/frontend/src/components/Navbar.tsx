import { useNavigate } from "@tanstack/react-router";
import { ChevronDown, Menu, ShoppingBag, X } from "lucide-react";
import { useEffect, useState } from "react";
import { useCart } from "../context/CartContext";
import { CATEGORIES } from "../types";

export function Navbar({
  cartOpen,
  setCartOpen,
}: { cartOpen: boolean; setCartOpen: (v: boolean) => void }) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [collectionsOpen, setCollectionsOpen] = useState(false);
  const { totalItems } = useCart();
  const navigate = useNavigate();

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, []);

  const navBg = scrolled ? "bg-ivory border-b border-stone" : "bg-transparent";
  const textColor = scrolled ? "text-charcoal" : "text-ivory";

  const goTo = (path: string) => {
    navigate({ to: path as any });
    setMobileOpen(false);
    setCollectionsOpen(false);
  };

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${navBg}`}
      style={{ fontFamily: "'DM Sans', sans-serif" }}
    >
      <div className="max-w-screen-xl mx-auto px-6 md:px-12">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <button
            type="button"
            onClick={() => goTo("/")}
            className={`font-serif text-lg md:text-xl tracking-[0.35em] font-light transition-colors ${textColor}`}
            data-ocid="nav.link"
          >
            MAISON ARBOR
          </button>

          {/* Desktop Nav */}
          <div
            className={`hidden md:flex items-center gap-8 text-xs tracking-[0.15em] uppercase transition-colors ${textColor}`}
          >
            <button
              type="button"
              onClick={() => goTo("/")}
              className="hover:opacity-60 transition-opacity"
              data-ocid="nav.link"
            >
              Home
            </button>

            {/* Collections Dropdown */}
            <div
              className="relative"
              onMouseLeave={() => setCollectionsOpen(false)}
            >
              <button
                type="button"
                className="flex items-center gap-1 hover:opacity-60 transition-opacity"
                onMouseEnter={() => setCollectionsOpen(true)}
                onClick={() => setCollectionsOpen(!collectionsOpen)}
                data-ocid="nav.link"
              >
                Collections <ChevronDown size={12} />
              </button>
              {collectionsOpen && (
                <div
                  className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-52 bg-ivory border border-stone shadow-luxury z-50"
                  onMouseEnter={() => setCollectionsOpen(true)}
                >
                  {CATEGORIES.map((cat) => (
                    <button
                      key={cat.slug}
                      type="button"
                      onClick={() => goTo(`/category/${cat.slug}`)}
                      className="block w-full text-left px-5 py-3 text-xs tracking-wider text-charcoal hover:bg-stone transition-colors"
                      data-ocid="nav.link"
                    >
                      {cat.name}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <button
              type="button"
              onClick={() => goTo("/about")}
              className="hover:opacity-60 transition-opacity"
              data-ocid="nav.link"
            >
              About
            </button>
            <button
              type="button"
              onClick={() => goTo("/custom-creations")}
              className="hover:opacity-60 transition-opacity"
              data-ocid="nav.link"
            >
              Custom
            </button>
            <button
              type="button"
              onClick={() => goTo("/contact")}
              className="hover:opacity-60 transition-opacity"
              data-ocid="nav.link"
            >
              Contact
            </button>
          </div>

          {/* Cart + Mobile Toggle */}
          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={() => setCartOpen(!cartOpen)}
              className={`relative transition-colors ${textColor} hover:opacity-60`}
              data-ocid="nav.cart_button"
            >
              <ShoppingBag size={20} strokeWidth={1.5} />
              {totalItems > 0 && (
                <span
                  className="absolute -top-2 -right-2 text-[9px] w-4 h-4 flex items-center justify-center rounded-full"
                  style={{ background: "var(--bronze)", color: "var(--ivory)" }}
                >
                  {totalItems}
                </span>
              )}
            </button>
            <button
              type="button"
              className={`md:hidden transition-colors ${textColor}`}
              onClick={() => setMobileOpen(!mobileOpen)}
              data-ocid="nav.toggle"
            >
              {mobileOpen ? (
                <X size={20} strokeWidth={1.5} />
              ) : (
                <Menu size={20} strokeWidth={1.5} />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="md:hidden bg-ivory border-t border-stone">
          <div className="px-6 py-6 flex flex-col gap-5">
            {[
              { label: "Home", path: "/" },
              { label: "About", path: "/about" },
              { label: "Custom Creations", path: "/custom-creations" },
              { label: "Contact", path: "/contact" },
              { label: "Cart", path: "/cart" },
            ].map((item) => (
              <button
                key={item.path}
                type="button"
                onClick={() => goTo(item.path)}
                className="text-left text-xs tracking-[0.2em] uppercase text-charcoal hover:text-walnut transition-colors"
                data-ocid="nav.link"
              >
                {item.label}
              </button>
            ))}
            <div className="section-divider" />
            <p className="text-xs text-stone tracking-widest uppercase">
              Collections
            </p>
            {CATEGORIES.map((cat) => (
              <button
                key={cat.slug}
                type="button"
                onClick={() => goTo(`/category/${cat.slug}`)}
                className="text-left text-xs tracking-wider text-charcoal hover:text-walnut transition-colors pl-2"
                data-ocid="nav.link"
              >
                {cat.name}
              </button>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
}
