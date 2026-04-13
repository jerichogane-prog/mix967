import Sidebar from "@/components/layout/Sidebar";
import BannerAd from "@/components/ads/BannerAd";
import GravityForm from "@/components/forms/GravityForm";
import type { FormField } from "@/components/forms/GravityForm";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "VIP Listener",
  description: "Join the Mix 96.7 FM VIP Listener club for exclusive perks and prizes.",
};

const VIP_FIELDS: FormField[] = [
  { name: "firstName", label: "First Name", type: "text", inputKey: "input_3.3" },
  { name: "lastName", label: "Last Name", type: "text", inputKey: "input_3.6" },
  { name: "gender", label: "Gender", type: "radio", inputKey: "input_5", choices: ["Male", "Female"] },
  { name: "street", label: "Street Address", type: "text", inputKey: "input_6.1" },
  { name: "city", label: "City", type: "text", inputKey: "input_6.3" },
  { name: "state", label: "State", type: "text", inputKey: "input_6.4" },
  { name: "email", label: "Email", type: "email", inputKey: "input_7" },
];

export default function VIPListenerPage() {
  return (
    <div className="mx-auto max-w-[var(--content-wide)] px-4 py-8 sm:px-6">
      <div className="flex flex-col gap-8 lg:flex-row">
        <div className="min-w-0 flex-1">
          <h1
            className="font-[family-name:var(--font-display)] font-bold tracking-tight"
            style={{ fontSize: "var(--text-3xl)" }}
          >
            VIP Listener
          </h1>

          <p
            className="mt-3 max-w-2xl text-base leading-relaxed"
            style={{ color: "var(--color-text-secondary)" }}
          >
            Become a Mix 96.7 FM VIP Listener and enjoy exclusive access to station events, early contest entries, meet-and-greets, and special prize packs. It&apos;s free to join!
          </p>

          <BannerAd className="mt-6" />

          <div
            className="mt-8 rounded-xl border p-6 sm:p-8"
            style={{ borderColor: "oklch(0% 0 0 / 0.08)" }}
          >
            <h2 className="mb-1 font-[family-name:var(--font-display)] text-lg font-bold">
              Sign Up for VIP
            </h2>
            <p className="mb-6 text-sm" style={{ color: "var(--color-text-muted)" }}>
              Fill out the form below to join the VIP Listener club.
            </p>
            <GravityForm
              formId={2}
              fields={VIP_FIELDS}
              submitLabel="Join VIP"
              consentText="I agree to receive VIP updates and promotional emails from Mix 96.7 FM."
            />
          </div>

          <BannerAd className="mt-8" />
        </div>

        <Sidebar />
      </div>
    </div>
  );
}
