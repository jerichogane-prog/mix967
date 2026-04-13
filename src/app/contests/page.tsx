import Sidebar from "@/components/layout/Sidebar";
import BannerAd from "@/components/ads/BannerAd";
import GravityForm from "@/components/forms/GravityForm";
import type { FormField } from "@/components/forms/GravityForm";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contests",
  description: "Enter to win prizes, concert tickets, and more from Mix 96.7 FM!",
};

const SUBSCRIBE_FIELDS: FormField[] = [
  { name: "firstName", label: "First Name", type: "text", required: true, inputKey: "input_1.3" },
  { name: "lastName", label: "Last Name", type: "text", required: true, inputKey: "input_1.6" },
  { name: "email", label: "Email", type: "email", required: true, inputKey: "input_2" },
];

export default function ContestsPage() {
  return (
    <div className="mx-auto max-w-[var(--content-wide)] px-4 py-8 sm:px-6">
      <div className="flex flex-col gap-8 lg:flex-row">
        <div className="min-w-0 flex-1">
          <h1
            className="font-[family-name:var(--font-display)] font-bold tracking-tight"
            style={{ fontSize: "var(--text-3xl)" }}
          >
            Contests
          </h1>

          <p
            className="mt-3 max-w-2xl text-base leading-relaxed"
            style={{ color: "var(--color-text-secondary)" }}
          >
            Want to win prizes, concert tickets, and exclusive experiences? Subscribe to our contests list and be the first to know when new giveaways go live. Listen for the cue-to-call and you could be our next winner!
          </p>

          <BannerAd className="mt-6" />

          {/* Subscribe form */}
          <div
            className="mt-8 rounded-xl border p-6 sm:p-8"
            style={{ borderColor: "oklch(0% 0 0 / 0.08)" }}
          >
            <h2 className="mb-1 font-[family-name:var(--font-display)] text-lg font-bold">
              Join the Contest List
            </h2>
            <p className="mb-6 text-sm" style={{ color: "var(--color-text-muted)" }}>
              Sign up to receive contest alerts and never miss a chance to win.
            </p>
            <GravityForm
              formId={1}
              fields={SUBSCRIBE_FIELDS}
              submitLabel="Subscribe"
              consentText="I agree to receive contest notifications and promotional emails from Mix 96.7 FM. You can unsubscribe at any time."
            />
          </div>

          <BannerAd className="mt-8" />
        </div>

        <Sidebar />
      </div>
    </div>
  );
}
