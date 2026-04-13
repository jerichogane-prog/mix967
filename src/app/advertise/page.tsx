import Sidebar from "@/components/layout/Sidebar";
import BannerAd from "@/components/ads/BannerAd";
import GravityForm from "@/components/forms/GravityForm";
import type { FormField } from "@/components/forms/GravityForm";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Advertise",
  description: "Advertise your business on Mix 96.7 FM — Northeast Nevada's #1 Hit Music Station.",
};

const ADVERTISE_FIELDS: FormField[] = [
  { name: "firstName", label: "First Name", type: "text", required: true, inputKey: "input_1.3" },
  { name: "lastName", label: "Last Name", type: "text", required: true, inputKey: "input_1.6" },
  { name: "email", label: "Email", type: "email", required: true, inputKey: "input_3" },
  { name: "phone", label: "Phone", type: "phone", inputKey: "input_4" },
  { name: "subject", label: "Subject", type: "text", inputKey: "input_5" },
  { name: "message", label: "How can we help?", type: "textarea", inputKey: "input_6" },
];

export default function AdvertisePage() {
  return (
    <div className="mx-auto max-w-[var(--content-wide)] px-4 py-8 sm:px-6">
      <div className="flex flex-col gap-8 lg:flex-row">
        <div className="min-w-0 flex-1">
          <h1
            className="font-[family-name:var(--font-display)] font-bold tracking-tight"
            style={{ fontSize: "var(--text-3xl)" }}
          >
            Advertise With Us
          </h1>

          <p
            className="mt-3 max-w-2xl text-base leading-relaxed"
            style={{ color: "var(--color-text-secondary)" }}
          >
            Reach Northeast Nevada&apos;s most engaged audience with Mix 96.7 FM. Whether you&apos;re a local business or a national brand, our multi-platform advertising solutions can help you connect with listeners on-air, online, and at events.
          </p>

          <BannerAd className="mt-6" />

          {/* Benefits */}
          <div className="mt-8 grid gap-4 sm:grid-cols-3">
            {[
              { icon: "📻", title: "On-Air Spots", desc: "30 and 60 second commercials reaching thousands of daily listeners" },
              { icon: "🌐", title: "Digital Ads", desc: "Banner ads, sponsored content, and social media promotion" },
              { icon: "🎪", title: "Event Sponsorship", desc: "Brand presence at station events and community activities" },
            ].map((b) => (
              <div
                key={b.title}
                className="rounded-lg border p-4"
                style={{ borderColor: "oklch(0% 0 0 / 0.08)" }}
              >
                <span className="text-2xl">{b.icon}</span>
                <h3 className="mt-2 text-sm font-bold">{b.title}</h3>
                <p className="mt-1 text-xs leading-relaxed" style={{ color: "var(--color-text-muted)" }}>{b.desc}</p>
              </div>
            ))}
          </div>

          {/* Form */}
          <div
            className="mt-8 rounded-xl border p-6 sm:p-8"
            style={{ borderColor: "oklch(0% 0 0 / 0.08)" }}
          >
            <h2 className="mb-1 font-[family-name:var(--font-display)] text-lg font-bold">
              Get in Touch
            </h2>
            <p className="mb-6 text-sm" style={{ color: "var(--color-text-muted)" }}>
              Tell us about your business and we&apos;ll create a custom advertising package for you.
            </p>
            <GravityForm
              formId={3}
              fields={ADVERTISE_FIELDS}
              submitLabel="Send Inquiry"
              consentText="I consent to Mix 96.7 FM contacting me regarding advertising opportunities."
            />
          </div>

          <BannerAd className="mt-8" />
        </div>

        <Sidebar />
      </div>
    </div>
  );
}
