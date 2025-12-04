import { NextRequest, NextResponse } from "next/server";
import { hybridSearch, textSearch } from "@/helpers/SearchHelper";

// Cache for embeddings to avoid regenerating
const embeddingCache = new Map<string, number[]>();

/**
 * Generate embedding for a query using Transformers.js
 * This runs on the server during the API call
 */
async function generateQueryEmbedding(query: string): Promise<number[]> {
  // Check cache first
  const cacheKey = query.toLowerCase().trim();
  if (embeddingCache.has(cacheKey)) {
    return embeddingCache.get(cacheKey)!;
  }

  // Dynamically import transformers (only works on server)
  const { pipeline } = await import("@xenova/transformers");

  // Get or create the embedder pipeline
  const embedder = await pipeline("feature-extraction", "Xenova/all-MiniLM-L6-v2");

  // Generate embedding
  const output = await embedder(query, { pooling: "mean", normalize: true });
  const embedding = Array.from(output.data) as number[];

  // Cache the embedding (limit cache size)
  if (embeddingCache.size > 1000) {
    const firstKey = embeddingCache.keys().next().value;
    if (firstKey) embeddingCache.delete(firstKey);
  }
  embeddingCache.set(cacheKey, embedding);

  return embedding;
}

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const query = searchParams.get("q");
  const mode = searchParams.get("mode") || "hybrid"; // 'text', 'semantic', or 'hybrid'
  const limit = parseInt(searchParams.get("limit") || "20", 10);

  if (!query || query.trim().length === 0) {
    return NextResponse.json({ error: "Query parameter 'q' is required" }, { status: 400 });
  }

  try {
    let response;

    if (mode === "text") {
      // Text-only search (faster, keyword-based)
      response = await textSearch(query, limit);
    } else {
      // Semantic or hybrid search (requires embedding generation)
      const embedding = await generateQueryEmbedding(query);
      response = await hybridSearch(query, embedding, limit);
    }

    return NextResponse.json(response);
  } catch (error) {
    console.error("Search error:", error);

    // Check if it's a missing index error
    if (error instanceof Error && error.message.includes("Search index not found")) {
      return NextResponse.json(
        {
          error: "Search index not available",
          message: "The search index needs to be built. Run 'npm run build:search' first."
        },
        { status: 503 }
      );
    }

    return NextResponse.json({ error: "Search failed", message: String(error) }, { status: 500 });
  }
}
