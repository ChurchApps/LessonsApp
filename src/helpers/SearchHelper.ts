import { ApiHelper } from "@churchapps/apphelper";
import { EnvironmentHelper } from "./EnvironmentHelper";

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

type SearchDocument = Omit<SearchResult, "score">;

const TYPE_BOOST: Record<string, number> = {
  program: 1.5,
  study: 1.2,
  lesson: 1.0
};

const FIELD_WEIGHTS: Partial<Record<keyof SearchDocument, number>> = {
  name: 3,
  categories: 2,
  programName: 1.5,
  studyName: 1.5,
  age: 1,
  description: 1
};

const CACHE_TTL = 60 * 60 * 1000;
let cachedDocs: SearchDocument[] | null = null;
let cachedAt = 0;
let pending: Promise<SearchDocument[]> | null = null;

function tokenize(text: string): string[] {
  return (text || "").toLowerCase().split(/[^\p{L}\p{N}]+/u).filter(t => t.length > 0);
}

async function loadDocuments(): Promise<SearchDocument[]> {
  if (cachedDocs && Date.now() - cachedAt < CACHE_TTL) return cachedDocs;
  if (!pending) {
    EnvironmentHelper.init();
    pending = ApiHelper.getAnonymous("/search/export", "LessonsApi")
      .then((docs: SearchDocument[]) => {
        cachedDocs = Array.isArray(docs) ? docs : [];
        cachedAt = Date.now();
        return cachedDocs;
      })
      .finally(() => { pending = null; });
  }
  return pending;
}

function scoreDocument(doc: SearchDocument, terms: string[]): number {
  let score = 0;
  for (const [field, weight] of Object.entries(FIELD_WEIGHTS)) {
    const words = tokenize(String(doc[field as keyof SearchDocument] ?? ""));
    for (const term of terms) {
      if (words.includes(term)) score += weight!;
      else if (words.some(w => w.startsWith(term))) score += weight! * 0.5;
    }
  }
  return score;
}

export async function textSearch(query: string, limit: number = 20): Promise<SearchResponse> {
  const startTime = Date.now();
  const terms = tokenize(query);
  const docs = await loadDocuments();

  const matches: SearchResult[] = [];
  for (const doc of docs) {
    const score = scoreDocument(doc, terms);
    if (score > 0) matches.push({ ...doc, score: score * (TYPE_BOOST[doc.type] || 1.0) });
  }
  matches.sort((a, b) => b.score - a.score);

  return {
    results: matches.slice(0, limit),
    elapsed: Date.now() - startTime,
    count: matches.length
  };
}
