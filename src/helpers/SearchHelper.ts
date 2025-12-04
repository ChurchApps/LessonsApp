import { OramaClient } from "@oramacloud/client";

export interface SearchResult {
  id: string;
  type: "program" | "study" | "lesson";
  name: string;
  description: string;
  slug: string;
  image: string;
  age: string;
  programName: string;
  programSlug: string;
  studyName: string;
  studySlug: string;
  lessonSlug: string;
  categories: string;
  lessonCount?: number;
  score: number;
}

export interface SearchResponse {
  results: SearchResult[];
  elapsed: number;
  count: number;
}

// Type boost multipliers: programs > studies > lessons
const TYPE_BOOST: Record<string, number> = {
  program: 1.5,
  study: 1.2,
  lesson: 1.0
};

// Orama Cloud client singleton
let client: OramaClient | null = null;

function getClient(): OramaClient {
  if (!client) {
    client = new OramaClient({
      endpoint: "https://cloud.orama.run/v1/indexes/lessons-v0ztnp",
      api_key: "WhbbkClNXUSLZfgeJIz7TRBOl2RfkHeW"
    });
  }
  return client;
}

/**
 * Apply type-based score boosting and re-sort results
 */
function applyTypeBoost(results: SearchResult[]): SearchResult[] {
  return results
    .map(r => ({
      ...r,
      score: r.score * (TYPE_BOOST[r.type] || 1.0)
    }))
    .sort((a, b) => b.score - a.score);
}

/**
 * Perform a text search using Orama Cloud
 */
export async function textSearch(query: string, limit: number = 20): Promise<SearchResponse> {
  const orama = getClient();
  const startTime = Date.now();

  const results = await orama.search({
    term: query,
    limit,
    mode: "fulltext"
  });

  const searchResults: SearchResult[] = (results.hits || []).map((hit: any) => ({
    id: hit.document.id as string,
    type: hit.document.type as "program" | "study" | "lesson",
    name: hit.document.name as string,
    description: hit.document.description as string,
    slug: hit.document.slug as string,
    image: hit.document.image as string,
    age: hit.document.age as string,
    programName: hit.document.programName as string,
    programSlug: hit.document.programSlug as string,
    studyName: hit.document.studyName as string,
    studySlug: hit.document.studySlug as string,
    lessonSlug: hit.document.lessonSlug as string,
    categories: hit.document.categories as string,
    lessonCount: hit.document.lessonCount as number,
    score: hit.score
  }));

  return {
    results: applyTypeBoost(searchResults),
    elapsed: Date.now() - startTime,
    count: results.count || 0
  };
}

/**
 * Perform a hybrid search using Orama Cloud (text + vector)
 */
export async function hybridSearch(query: string, limit: number = 20): Promise<SearchResponse> {
  const orama = getClient();
  const startTime = Date.now();

  const results = await orama.search({
    term: query,
    limit,
    mode: "hybrid"
  });

  const searchResults: SearchResult[] = (results.hits || []).map((hit: any) => ({
    id: hit.document.id as string,
    type: hit.document.type as "program" | "study" | "lesson",
    name: hit.document.name as string,
    description: hit.document.description as string,
    slug: hit.document.slug as string,
    image: hit.document.image as string,
    age: hit.document.age as string,
    programName: hit.document.programName as string,
    programSlug: hit.document.programSlug as string,
    studyName: hit.document.studyName as string,
    studySlug: hit.document.studySlug as string,
    lessonSlug: hit.document.lessonSlug as string,
    categories: hit.document.categories as string,
    lessonCount: hit.document.lessonCount as number,
    score: hit.score
  }));

  return {
    results: applyTypeBoost(searchResults),
    elapsed: Date.now() - startTime,
    count: results.count || 0
  };
}
