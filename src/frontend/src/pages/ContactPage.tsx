import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { CheckCircle2, Loader2, Mail, MapPin, Phone } from "lucide-react";
import { useState } from "react";
import { useActor } from "../hooks/useActor";
import { useFadeIn } from "../hooks/useFadeIn";

const CONTACT_INFO = [
  {
    key: "address",
    icon: <MapPin size={14} />,
    text: "123 Craft Lane, Design District, Bengaluru 560001",
  },
  { key: "phone", icon: <Phone size={14} />, text: "+91 98765 43210" },
  { key: "email", icon: <Mail size={14} />, text: "hello@maisonarbor.com" },
];

export default function ContactPage() {
  const { actor } = useActor();
  const ref = useFadeIn();
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const update = (k: string, v: string) => setForm((f) => ({ ...f, [k]: v }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!actor) return;
    setSubmitting(true);
    setError("");
    try {
      const result = await (actor as any).submitContact(
        form.name,
        form.email,
        form.phone,
        form.message,
      );
      if ("ok" in result) {
        setSuccess(true);
        setForm({ name: "", email: "", phone: "", message: "" });
      } else {
        setError("Submission failed. Please try again.");
      }
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="pt-28 pb-24" style={{ background: "var(--ivory)" }}>
      <div className="max-w-screen-xl mx-auto px-6 md:px-12">
        <div className="grid md:grid-cols-2 gap-16 md:gap-24">
          <div ref={ref} className="pt-8">
            <p
              className="text-xs tracking-[0.3em] uppercase mb-4"
              style={{ color: "var(--bronze)" }}
            >
              Get in Touch
            </p>
            <h1 className="font-serif text-4xl md:text-5xl font-light mb-8 leading-tight">
              We Would Love
              <br />
              to Hear from You
            </h1>
            <p className="text-sm leading-8 opacity-60 mb-12 max-w-sm">
              Whether you have a question about a piece, a custom project, or
              simply want to visit our showroom—we are here.
            </p>
            <div className="space-y-5">
              {CONTACT_INFO.map((item) => (
                <div key={item.key} className="flex items-start gap-3">
                  <span className="mt-0.5 opacity-40">{item.icon}</span>
                  <span className="text-sm opacity-60">{item.text}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-8">
            {success ? (
              <div
                className="py-12 text-center"
                data-ocid="contact.success_state"
              >
                <CheckCircle2
                  size={40}
                  strokeWidth={1}
                  className="mx-auto mb-4"
                  style={{ color: "var(--bronze)" }}
                />
                <h3 className="font-serif text-2xl font-light mb-3">
                  Message Received
                </h3>
                <p className="text-sm opacity-60">
                  We will respond within 24 hours.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-xs tracking-wider uppercase opacity-50 mb-2 block">
                      Name
                    </Label>
                    <Input
                      required
                      value={form.name}
                      onChange={(e) => update("name", e.target.value)}
                      className="border-stone focus:border-bronze bg-transparent rounded-none"
                      data-ocid="contact.name_input"
                    />
                  </div>
                  <div>
                    <Label className="text-xs tracking-wider uppercase opacity-50 mb-2 block">
                      Email
                    </Label>
                    <Input
                      required
                      type="email"
                      value={form.email}
                      onChange={(e) => update("email", e.target.value)}
                      className="border-stone focus:border-bronze bg-transparent rounded-none"
                      data-ocid="contact.email_input"
                    />
                  </div>
                </div>
                <div>
                  <Label className="text-xs tracking-wider uppercase opacity-50 mb-2 block">
                    Phone
                  </Label>
                  <Input
                    value={form.phone}
                    onChange={(e) => update("phone", e.target.value)}
                    className="border-stone focus:border-bronze bg-transparent rounded-none"
                    data-ocid="contact.phone_input"
                  />
                </div>
                <div>
                  <Label className="text-xs tracking-wider uppercase opacity-50 mb-2 block">
                    Message
                  </Label>
                  <Textarea
                    required
                    rows={5}
                    value={form.message}
                    onChange={(e) => update("message", e.target.value)}
                    className="border-stone focus:border-bronze bg-transparent rounded-none resize-none"
                    data-ocid="contact.message_textarea"
                  />
                </div>
                {error && <p className="text-xs text-red-500">{error}</p>}
                <button
                  type="submit"
                  className="btn-walnut flex items-center gap-3"
                  disabled={submitting}
                  data-ocid="contact.submit_button"
                >
                  {submitting && <Loader2 size={14} className="animate-spin" />}
                  {submitting ? "Sending..." : "Send Message"}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
