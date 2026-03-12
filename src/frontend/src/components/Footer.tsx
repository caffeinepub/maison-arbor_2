import { useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { SiInstagram, SiPinterest } from "react-icons/si";
import { CATEGORIES } from "../types";

export function Footer() {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);
  const navigate = useNavigate();
  const year = new Date().getFullYear();

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setSubscribed(true);
      setEmail("");
    }
  };

  const goTo = (path: string) => navigate({ to: path as any });

  return (
    <footer style={{ background: "var(--charcoal)", color: "var(--ivory)" }}>
      <div
        style={{ height: "1px", background: "var(--bronze)", width: "100%" }}
      />

      <div className="max-w-screen-xl mx-auto px-6 md:px-12 py-16 md:py-20">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-10 md:gap-16">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <p className="font-serif text-lg tracking-[0.35em] font-light mb-3">
              MAISON ARBOR
            </p>
            <p
              className="text-xs tracking-[0.3em] uppercase mb-5"
              style={{ color: "var(--bronze)" }}
            >
              Rooted in Excellence
            </p>
            <p className="text-xs leading-relaxed opacity-60 max-w-xs">
              Handcrafted furniture for spaces that endure. Permanence over
              trends.
            </p>
            <div className="flex gap-4 mt-6">
              <button
                type="button"
                className="opacity-50 hover:opacity-100 transition-opacity"
                aria-label="Instagram"
              >
                <SiInstagram size={16} />
              </button>
              <button
                type="button"
                className="opacity-50 hover:opacity-100 transition-opacity"
                aria-label="Pinterest"
              >
                <SiPinterest size={16} />
              </button>
            </div>
          </div>

          {/* Collections */}
          <div>
            <p className="text-xs tracking-[0.25em] uppercase mb-5 opacity-50">
              Collections
            </p>
            <div className="flex flex-col gap-3">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat.slug}
                  type="button"
                  onClick={() => goTo(`/category/${cat.slug}`)}
                  className="text-xs text-left opacity-60 hover:opacity-100 transition-opacity tracking-wide"
                >
                  {cat.name}
                </button>
              ))}
            </div>
          </div>

          {/* Company */}
          <div>
            <p className="text-xs tracking-[0.25em] uppercase mb-5 opacity-50">
              Company
            </p>
            <div className="flex flex-col gap-3">
              {[
                { label: "Our Story", path: "/about" },
                { label: "Contact", path: "/contact" },
                { label: "Custom Creations", path: "/custom-creations" },
                { label: "Cart", path: "/cart" },
              ].map((item) => (
                <button
                  key={item.path}
                  type="button"
                  onClick={() => goTo(item.path)}
                  className="text-xs text-left opacity-60 hover:opacity-100 transition-opacity tracking-wide"
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          {/* Newsletter */}
          <div>
            <p className="text-xs tracking-[0.25em] uppercase mb-5 opacity-50">
              Join the Arbor
            </p>
            <p className="text-xs opacity-50 mb-4 leading-relaxed">
              New arrivals, craft stories, and exclusive previews.
            </p>
            {subscribed ? (
              <p
                className="text-xs tracking-wider"
                style={{ color: "var(--bronze)" }}
              >
                Thank you for subscribing.
              </p>
            ) : (
              <form onSubmit={handleSubscribe} className="flex flex-col gap-3">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Your email"
                  className="bg-transparent text-xs border-b pb-2 outline-none placeholder-opacity-40 focus:border-bronze transition-colors"
                  style={{
                    borderBottomColor: "var(--stone)",
                    color: "var(--ivory)",
                  }}
                  data-ocid="footer.newsletter_input"
                />
                <button
                  type="submit"
                  className="btn-bronze text-left"
                  data-ocid="footer.submit_button"
                >
                  Subscribe
                </button>
              </form>
            )}
          </div>
        </div>

        {/* Bottom bar */}
        <div
          className="mt-16 pt-8 border-t flex flex-col md:flex-row justify-between items-start md:items-center gap-3"
          style={{ borderColor: "rgba(214,210,204,0.15)" }}
        >
          <p className="text-xs opacity-40 tracking-wide">
            &copy; {year} Maison Arbor. All rights reserved.
          </p>
          <p className="text-xs opacity-40">
            Built with love using{" "}
            <a
              href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:opacity-80 transition-opacity"
              style={{ color: "var(--bronze)" }}
            >
              caffeine.ai
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
