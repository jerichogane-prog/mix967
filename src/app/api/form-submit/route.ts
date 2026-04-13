import { NextResponse } from "next/server";

/* ============================================
   Form Submission Proxy — /api/form-submit

   Forwards form submissions to the custom
   WordPress REST endpoint which uses GFAPI
   to create Gravity Forms entries.
   ============================================ */

const WP_URL = process.env.NEXT_PUBLIC_WORDPRESS_URL ?? "http://localhost:10003";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { formId, fields } = body as {
      formId: number;
      fields: Record<string, string>;
    };

    if (!formId || !fields) {
      return NextResponse.json(
        { success: false, error: "Missing formId or fields" },
        { status: 400 }
      );
    }

    // Forward to WordPress custom endpoint
    const res = await fetch(`${WP_URL}/wp-json/mix967/v1/form-submit`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ form_id: formId, fields }),
    });

    const data = await res.json();

    if (data.success) {
      return NextResponse.json({
        success: true,
        entryId: data.entry_id,
        confirmationMessage: data.confirmation_message,
      });
    }

    // Validation errors from Gravity Forms
    if (data.validation_errors && data.validation_errors.length > 0) {
      return NextResponse.json(
        {
          success: false,
          error: data.validation_errors.join(". "),
        },
        { status: 422 }
      );
    }

    return NextResponse.json(
      { success: false, error: data.error || "Submission failed" },
      { status: res.status }
    );
  } catch (err) {
    console.error("[Form] Submission error:", err);
    return NextResponse.json(
      { success: false, error: "Failed to submit form. Please try again." },
      { status: 500 }
    );
  }
}
