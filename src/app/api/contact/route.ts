import { NextResponse } from "next/server";
import { contactFormSchema } from "@/lib/validations/contact";
import { clientKey, rateLimit } from "@/lib/rate-limit";

/** Five submissions per IP per 10 minutes — generous for a human, tedious for a script. */
const LIMIT = 5;
const WINDOW_MS = 10 * 60 * 1000;

/** Reject oversized bodies before parsing rather than after. */
const MAX_BODY_BYTES = 16 * 1024;

export async function POST(request: Request) {
  const limited = rateLimit(clientKey(request), { limit: LIMIT, windowMs: WINDOW_MS });

  if (!limited.ok) {
    return NextResponse.json(
      {
        success: false,
        message: `Terlalu banyak percobaan. Silakan coba lagi dalam ${Math.ceil(
          limited.retryAfter / 60
        )} menit.`,
      },
      {
        status: 429,
        headers: {
          "Retry-After": String(limited.retryAfter),
          "RateLimit-Limit": String(limited.limit),
          "RateLimit-Remaining": "0",
        },
      }
    );
  }

  try {
    const declared = Number(request.headers.get("content-length") ?? 0);
    if (declared > MAX_BODY_BYTES) {
      return NextResponse.json(
        { success: false, message: "Data formulir terlalu besar." },
        { status: 413 }
      );
    }

    const raw = await request.text();
    if (raw.length > MAX_BODY_BYTES) {
      return NextResponse.json(
        { success: false, message: "Data formulir terlalu besar." },
        { status: 413 }
      );
    }

    let body: unknown;
    try {
      body = JSON.parse(raw);
    } catch {
      return NextResponse.json(
        { success: false, message: "Format data tidak valid." },
        { status: 400 }
      );
    }

    const validationResult = contactFormSchema.safeParse(body);

    if (!validationResult.success) {
      return NextResponse.json(
        {
          success: false,
          message: "Data formulir tidak valid",
          errors: validationResult.error.flatten().fieldErrors,
        },
        { status: 400 }
      );
    }

    const validatedData = validationResult.data;

    // Name and location only — the submitter's phone number is PII and stays out
    // of the logs.
    console.log(
      `[FULLHOME ID Lead] name=${validatedData.name} location=${validatedData.projectLocation}`
    );

    return NextResponse.json(
      {
        success: true,
        message: "Formulir konsultasi berhasil diterima.",
        lead: { name: validatedData.name, spaceType: validatedData.spaceType },
      },
      {
        status: 200,
        headers: {
          "RateLimit-Limit": String(limited.limit),
          "RateLimit-Remaining": String(limited.remaining),
        },
      }
    );
  } catch (error) {
    console.error("Contact form error:", error);
    return NextResponse.json(
      { success: false, message: "Terjadi kesalahan internal server." },
      { status: 500 }
    );
  }
}
