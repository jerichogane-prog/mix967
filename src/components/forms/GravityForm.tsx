"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

/* ============================================
   GravityForm — reusable form component that
   renders fields and submits to /api/form-submit
   which proxies to the GF REST API.
   ============================================ */

export interface FormField {
  name: string;
  label: string;
  type: "text" | "email" | "phone" | "textarea" | "select" | "radio" | "checkbox";
  required?: boolean;
  placeholder?: string;
  choices?: string[];
  /** GF input key, e.g. "input_1.3" for name.first */
  inputKey: string;
}

interface GravityFormProps {
  formId: number;
  fields: FormField[];
  submitLabel?: string;
  consentText?: string;
}

export default function GravityForm({
  formId,
  fields,
  submitLabel = "Submit",
  consentText,
}: GravityFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [values, setValues] = useState<Record<string, string>>(() => {
    const init: Record<string, string> = {};
    for (const f of fields) {
      init[f.inputKey] = "";
    }
    if (consentText) init["consent"] = "";
    return init;
  });

  const setValue = (key: string, value: string) => {
    setValues((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      const res = await fetch("/api/form-submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ formId, fields: values }),
      });

      const data = await res.json();

      if (data.success) {
        router.push(`/thank-you?form=${formId}`);
      } else {
        setError(data.error || "Something went wrong. Please try again.");
      }
    } catch {
      setError("Network error. Please check your connection and try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {fields.map((field) => (
        <FieldRenderer
          key={field.inputKey}
          field={field}
          value={values[field.inputKey] ?? ""}
          onChange={(v) => setValue(field.inputKey, v)}
        />
      ))}

      {consentText && (
        <label className="flex items-start gap-3">
          <input
            type="checkbox"
            required
            checked={values["consent"] === "1"}
            onChange={(e) => setValue("consent", e.target.checked ? "1" : "")}
            className="mt-1 h-4 w-4 rounded border accent-[var(--color-primary)]"
            style={{ borderColor: "oklch(0% 0 0 / 0.2)" }}
          />
          <span className="text-sm leading-relaxed" style={{ color: "var(--color-text-secondary)" }}>
            {consentText}
          </span>
        </label>
      )}

      {error && (
        <div
          className="rounded-lg px-4 py-3 text-sm font-medium"
          style={{ background: "oklch(65% 0.2 25 / 0.1)", color: "oklch(50% 0.2 25)" }}
        >
          {error}
        </div>
      )}

      <button
        type="submit"
        disabled={isSubmitting}
        className="inline-flex items-center gap-2 rounded-full px-8 py-3 text-sm font-bold transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-60"
        style={{
          background: "var(--color-primary)",
          color: "white",
        }}
      >
        {isSubmitting ? (
          <>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="animate-spin">
              <circle cx="8" cy="8" r="6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeDasharray="28" strokeDashoffset="10" />
            </svg>
            Submitting...
          </>
        ) : (
          submitLabel
        )}
      </button>
    </form>
  );
}

function FieldRenderer({
  field,
  value,
  onChange,
}: {
  field: FormField;
  value: string;
  onChange: (v: string) => void;
}) {
  const labelEl = (
    <label className="mb-1.5 block text-sm font-semibold">
      {field.label}
      {field.required && <span style={{ color: "var(--color-primary)" }}> *</span>}
    </label>
  );

  const inputClass =
    "w-full rounded-lg border px-4 py-2.5 text-sm outline-none transition-colors focus:border-[var(--color-primary)]";
  const inputStyle = { borderColor: "oklch(0% 0 0 / 0.12)" };

  switch (field.type) {
    case "textarea":
      return (
        <div>
          {labelEl}
          <textarea
            value={value}
            onChange={(e) => onChange(e.target.value)}
            required={field.required}
            placeholder={field.placeholder}
            rows={5}
            className={inputClass}
            style={inputStyle}
          />
        </div>
      );

    case "select":
      return (
        <div>
          {labelEl}
          <select
            value={value}
            onChange={(e) => onChange(e.target.value)}
            required={field.required}
            className={inputClass}
            style={inputStyle}
          >
            <option value="">Select...</option>
            {field.choices?.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>
      );

    case "radio":
      return (
        <div>
          {labelEl}
          <div className="flex flex-wrap gap-4">
            {field.choices?.map((c) => (
              <label key={c} className="flex items-center gap-2 text-sm">
                <input
                  type="radio"
                  name={field.inputKey}
                  value={c}
                  checked={value === c}
                  onChange={(e) => onChange(e.target.value)}
                  required={field.required}
                  className="accent-[var(--color-primary)]"
                />
                {c}
              </label>
            ))}
          </div>
        </div>
      );

    default:
      return (
        <div>
          {labelEl}
          <input
            type={field.type}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            required={field.required}
            placeholder={field.placeholder}
            className={inputClass}
            style={inputStyle}
          />
        </div>
      );
  }
}
