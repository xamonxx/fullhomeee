import { NextResponse } from "next/server";
import { getCategories } from "@/lib/portfolio-manifest";
import { FALLBACK_CATEGORIES } from "@/lib/portfolio-fallback";

export async function GET() {
  try {
    const categories = getCategories();
    return NextResponse.json({
      categories: categories.length > 0 ? categories : FALLBACK_CATEGORIES,
    });
  } catch (err) {
    console.error("Portfolio categories error:", err);
    return NextResponse.json({ categories: FALLBACK_CATEGORIES });
  }
}
