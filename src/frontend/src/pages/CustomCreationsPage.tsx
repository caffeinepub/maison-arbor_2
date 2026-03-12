import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { CheckCircle2, FileText, Loader2, Upload } from "lucide-react";
import { useRef, useState } from "react";
import { useActor } from "../hooks/useActor";
import { useFadeIn } from "../hooks/useFadeIn";
import { CATEGORIES } from "../types";
import { uploadFile } from "../utils/upload";

export default function CustomCreationsPage() {
  const { actor } = useActor();
  const heroRef = useFadeIn();
  const formRef = useFadeIn();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    category: "",
    budget: "",
    description: "",
  });
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const update = (k: string, v: string) => setForm((f) => ({ ...f, [k]: v }));

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (f) setFile(f);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!actor) {
      setError("Please wait while connecting...");
      return;
    }
    setSubmitting(true);
    setError("");
    try {
      let fileId = "";
      if (file) {
        setUploading(true);
        fileId = await uploadFile(file, (pct) => setUploadProgress(pct));
        setUploading(false);
      }
      // 7 individual string arguments (new API signature)
      const result = await actor.submitCustomRequest(
        form.name,
        form.email,
        form.phone,
        form.description,
        form.category,
        form.budget,
        fileId,
      );
      if ("ok" in result) {
        setSuccess(true);
      } else {
        setError("Submission failed. Please try again.");
      }
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
      setUploading(false);
    }
  };

  const BUDGET_OPTIONS = [
    "Under \u20B950,000",
    "\u20B950,000\u2013\u20B91,00,000",
    "\u20B91,00,000\u2013\u20B92,50,000",
    "Above \u20B92,50,000",
  ];

  return (
    <main style={{ background: "var(--ivory)" }}>
      {/* Hero */}
      <section
        className="flex items-end pb-16"
        style={{
          minHeight: "55vh",
          background: "var(--stone)",
          paddingTop: "8rem",
        }}
      >
        <div
          className="max-w-screen-xl mx-auto px-6 md:px-12 w-full"
          ref={heroRef}
        >
          <p
            className="text-xs tracking-[0.4em] uppercase mb-4"
            style={{ color: "var(--walnut)" }}
          >
            Bespoke
          </p>
          <h1 className="font-serif text-5xl md:text-7xl font-light leading-tight mb-6">
            You Dream It,
            <br />
            We Make It
          </h1>
          <p className="text-sm leading-8 opacity-60 max-w-xl">
            Every extraordinary home begins with a singular vision. Tell us
            yours. Our master craftspeople will bring it to life—in wood, in
            form, in permanence.
          </p>
        </div>
      </section>

      {/* Form */}
      <section className="py-24 md:py-32 px-6 md:px-12">
        <div className="max-w-2xl mx-auto" ref={formRef}>
          {success ? (
            <div className="py-16 text-center" data-ocid="custom.success_state">
              <CheckCircle2
                size={48}
                strokeWidth={1}
                className="mx-auto mb-6"
                style={{ color: "var(--bronze)" }}
              />
              <h2 className="font-serif text-3xl font-light mb-4">
                Request Received
              </h2>
              <p className="text-sm leading-8 opacity-60 max-w-md mx-auto">
                Thank you for sharing your vision. Our team will review your
                request and reach out within 48 hours to begin the conversation.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-7">
              <div>
                <p
                  className="text-xs tracking-[0.3em] uppercase mb-2"
                  style={{ color: "var(--bronze)" }}
                >
                  Your Details
                </p>
                <div className="section-divider mb-7" />
              </div>

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
                    data-ocid="custom.name_input"
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
                    data-ocid="custom.email_input"
                  />
                </div>
              </div>

              <div>
                <Label className="text-xs tracking-wider uppercase opacity-50 mb-2 block">
                  Phone
                </Label>
                <Input
                  required
                  value={form.phone}
                  onChange={(e) => update("phone", e.target.value)}
                  className="border-stone focus:border-bronze bg-transparent rounded-none"
                  data-ocid="custom.phone_input"
                />
              </div>

              <div>
                <p
                  className="text-xs tracking-[0.3em] uppercase mb-2"
                  style={{ color: "var(--bronze)" }}
                >
                  Your Vision
                </p>
                <div className="section-divider mb-7" />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-xs tracking-wider uppercase opacity-50 mb-2 block">
                    Preferred Category
                  </Label>
                  <Select
                    value={form.category}
                    onValueChange={(v) => update("category", v)}
                  >
                    <SelectTrigger
                      className="border-stone focus:border-bronze bg-transparent rounded-none"
                      data-ocid="custom.category_select"
                    >
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent style={{ background: "var(--ivory)" }}>
                      {CATEGORIES.map((cat) => (
                        <SelectItem key={cat.slug} value={cat.name}>
                          {cat.name}
                        </SelectItem>
                      ))}
                      <SelectItem value="Other">Other / Not Sure</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label className="text-xs tracking-wider uppercase opacity-50 mb-2 block">
                    Budget Range
                  </Label>
                  <Select
                    value={form.budget}
                    onValueChange={(v) => update("budget", v)}
                  >
                    <SelectTrigger
                      className="border-stone focus:border-bronze bg-transparent rounded-none"
                      data-ocid="custom.budget_select"
                    >
                      <SelectValue placeholder="Select budget" />
                    </SelectTrigger>
                    <SelectContent style={{ background: "var(--ivory)" }}>
                      {BUDGET_OPTIONS.map((b) => (
                        <SelectItem key={b} value={b}>
                          {b}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label className="text-xs tracking-wider uppercase opacity-50 mb-2 block">
                  Describe Your Vision
                </Label>
                <Textarea
                  required
                  rows={5}
                  value={form.description}
                  onChange={(e) => update("description", e.target.value)}
                  placeholder="Dimensions, materials, style references, room context..."
                  className="border-stone focus:border-bronze bg-transparent rounded-none resize-none"
                  data-ocid="custom.description_textarea"
                />
              </div>

              <div>
                <Label className="text-xs tracking-wider uppercase opacity-50 mb-2 block">
                  Upload Your Design
                </Label>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  accept="image/*,.pdf"
                  className="hidden"
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full border border-dashed flex flex-col items-center gap-3 py-8 transition-colors hover:border-bronze"
                  style={{ borderColor: "var(--stone)" }}
                  data-ocid="custom.upload_button"
                >
                  {file ? (
                    <>
                      <FileText size={24} style={{ color: "var(--bronze)" }} />
                      <span className="text-xs tracking-wider">
                        {file.name}
                      </span>
                    </>
                  ) : (
                    <>
                      <Upload
                        size={24}
                        strokeWidth={1}
                        style={{ color: "var(--stone)" }}
                      />
                      <span className="text-xs tracking-wider opacity-50">
                        Sketch, reference image or PDF
                      </span>
                    </>
                  )}
                </button>
                {uploading && (
                  <div className="mt-2">
                    <div className="h-0.5 bg-stone overflow-hidden">
                      <div
                        className="h-full bg-bronze transition-all"
                        style={{ width: `${uploadProgress}%` }}
                      />
                    </div>
                    <p className="text-xs opacity-40 mt-1">
                      {uploadProgress}% uploaded
                    </p>
                  </div>
                )}
              </div>

              {error && <p className="text-xs text-red-500">{error}</p>}

              <button
                type="submit"
                className="btn-walnut flex items-center gap-3"
                disabled={submitting}
                data-ocid="custom.submit_button"
              >
                {submitting && <Loader2 size={14} className="animate-spin" />}
                {submitting ? "Submitting..." : "Submit Your Vision"}
              </button>
            </form>
          )}
        </div>
      </section>
    </main>
  );
}
