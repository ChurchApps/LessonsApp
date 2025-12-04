import { NextRequest, NextResponse } from "next/server";
import { hybridSearch, textSearch } from "@/helpers/SearchHelper";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const query = searchParams.get("q");
  const mode = searchParams.get("mode") || "hybrid";
  const limit = parseInt(searchParams.get("limit") || "20", 10);

  if (!query || query.trim().length === 0) {
    return NextResponse.json({ error: "Query parameter 'q' is required" }, { status: 400 });
  }

  try {
    const response = mode === "text"
      ? await textSearch(query, limit)
      : await hybridSearch(query, limit);

    return NextResponse.json(response);
  } catch (error) {
    console.error("Search error:", error);
    return NextResponse.json({ error: "Search failed", message: String(error) }, { status: 500 });
  }
}
