import { NextRequest, NextResponse } from "next/server";
import { getProjectsPage } from "@/lib/portfolio-manifest";
import { FALLBACK_PROJECTS, fallbackProjectsPage } from "@/lib/portfolio-fallback";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const category = searchParams.get("category") ?? "all";
  const search = (searchParams.get("search") ?? "").toLowerCase().trim();
  const page = parseInt(searchParams.get("page") ?? "1", 10);

  try {
    const result = getProjectsPage({ category, search, page });
    if (result.total === 0) {
      return NextResponse.json(fallbackProjectsPage(category, search, page));
    }
    return NextResponse.json(result);
  } catch (err) {
    console.error("Portfolio projects error:", err);
    return NextResponse.json({
      projects: FALLBACK_PROJECTS,
      total: FALLBACK_PROJECTS.length,
      totalPages: 1,
      page: 1,
    });
  }
}
