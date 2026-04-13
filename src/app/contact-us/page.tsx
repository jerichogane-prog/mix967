import Sidebar from "@/components/layout/Sidebar";
import BannerAd from "@/components/ads/BannerAd";
import GravityForm from "@/components/forms/GravityForm";
import type { FormField } from "@/components/forms/GravityForm";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact Us",
  description: "Get in touch with Mix 96.7 FM — phone, email, or send us a message.",
};

const CONTACT_FIELDS: FormField[] = [
  { name: "name", label: "Name", type: "text", inputKey: "input_1" },
  { name: "email", label: "Email", type: "email", required: true, inputKey: "input_2" },
  { name: "message", label: "Message", type: "textarea", required: true, inputKey: "input_3" },
];

export default function ContactUsPage() {
  return (
    <div className="mx-auto max-w-[var(--content-wide)] px-4 py-8 sm:px-6">
      <div className="flex flex-col gap-8 lg:flex-row">
        <div className="min-w-0 flex-1">
          <h1
            className="font-[family-name:var(--font-display)] font-bold tracking-tight"
            style={{ fontSize: "var(--text-3xl)" }}
          >
            Contact Us
          </h1>

          <p
            className="mt-3 max-w-2xl text-base leading-relaxed"
            style={{ color: "var(--color-text-secondary)" }}
          >
            Have a question, song request, or just want to say hi? We&apos;d love to hear from you.
          </p>

          <BannerAd className="mt-6" />

          {/* Contact info cards */}
          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            <div
              className="rounded-lg border p-5"
              style={{ borderColor: "oklch(0% 0 0 / 0.08)" }}
            >
              <h3 className="flex items-center gap-2 text-sm font-bold">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="var(--color-primary)" strokeWidth="1.5" strokeLinecap="round">
                  <path d="M14 11v2a1.5 1.5 0 01-1.5 1.5A11.5 11.5 0 011.5 3.5 1.5 1.5 0 013 2h2l1.5 3-2 1.5a8 8 0 004 4L10 9l3 1.5z" />
                </svg>
                Phone
              </h3>
              <a href="tel:7757771196" className="mt-2 block text-sm font-medium hover:underline" style={{ color: "var(--color-text-secondary)" }}>
                (775) 777-1196
              </a>
            </div>
            <div
              className="rounded-lg border p-5"
              style={{ borderColor: "oklch(0% 0 0 / 0.08)" }}
            >
              <h3 className="flex items-center gap-2 text-sm font-bold">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="var(--color-primary)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="1" y="3" width="14" height="10" rx="1.5" />
                  <polyline points="1,3 8,9 15,3" />
                </svg>
                Email
              </h3>
              <a href="mailto:info@global1media.com" className="mt-2 block text-sm font-medium hover:underline" style={{ color: "var(--color-text-secondary)" }}>
                info@global1media.com
              </a>
            </div>
          </div>

          {/* Form */}
          <div
            className="mt-8 rounded-xl border p-6 sm:p-8"
            style={{ borderColor: "oklch(0% 0 0 / 0.08)" }}
          >
            <h2 className="mb-1 font-[family-name:var(--font-display)] text-lg font-bold">
              Send a Message
            </h2>
            <p className="mb-6 text-sm" style={{ color: "var(--color-text-muted)" }}>
              We&apos;ll get back to you as soon as possible.
            </p>
            <GravityForm
              formId={4}
              fields={CONTACT_FIELDS}
              submitLabel="Send Message"
            />
          </div>

          <BannerAd className="mt-8" />
        </div>

        <Sidebar />
      </div>
    </div>
  );
}
