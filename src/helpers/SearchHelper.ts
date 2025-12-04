import { type Orama, create, load, search } from "@orama/orama";

export interface SearchResult {
  id: string;
  type: "program" | "study";
  name: string;
  description: string;
  slug: string;
  image: string;
  age: string;
  programName: string;
  programSlug: string;
  studyName: string;
  studySlug: string;
  categories: string;
  lessonCount?: number;
  score: number;
}

export interface SearchResponse {
  results: SearchResult[];
  elapsed: number;
  count: number;
}

// Singleton for the search database
let db: Orama<any> | null = null;
let dbPromise: Promise<Orama<any>> | null = null;

/**
 * Load the search index from the public folder (server-side)
 */
async function loadSearchIndex(): Promise<Orama<any>> {
  // Return existing database if already loaded
  if (db) return db;

  // Return existing promise if loading is in progress
  if (dbPromise) return dbPromise;

  dbPromise = (async () => {
    // Dynamically import fs for server-side only
    const fs = await import("fs");
    const path = await import("path");

    const indexPath = path.join(process.cwd(), "public", "search-index.json");

    if (!fs.existsSync(indexPath)) {
      throw new Error("Search index not found. Run 'npm run build:search' to generate it.");
    }

    const indexData = JSON.parse(fs.readFileSync(indexPath, "utf-8"));

    // Create a new database with the same schema
    const newDb = await create({
      schema: {
        id: "string",
        type: "string",
        name: "string",
        description: "string",
        slug: "string",
        image: "string",
        age: "string",
        programName: "string",
        programSlug: "string",
        studyName: "string",
        studySlug: "string",
        categories: "string",
        lessonCount: "number",
        embedding: "vector[384]"
      }
    });

    // Load the saved data
    await load(newDb, indexData);

    db = newDb;
    return db;
  })();

  return dbPromise;
}

/**
 * Perform a text search (keyword-based)
 */
export async function textSearch(query: string, limit: number = 20): Promise<SearchResponse> {
  const database = await loadSearchIndex();
  const startTime = Date.now();

  const results = await search(database, {
    term: query,
    properties: ["name", "description", "categories", "programName", "age"],
    limit,
    boost: {
      name: 2,
      categories: 1.5,
      programName: 1.2
    }
  });

  const searchResults: SearchResult[] = results.hits.map(hit => ({
    id: hit.document.id as string,
    type: hit.document.type as "program" | "study",
    name: hit.document.name as string,
    description: hit.document.description as string,
    slug: hit.document.slug as string,
    image: hit.document.image as string,
    age: hit.document.age as string,
    programName: hit.document.programName as string,
    programSlug: hit.document.programSlug as string,
    studyName: hit.document.studyName as string,
    studySlug: hit.document.studySlug as string,
    categories: hit.document.categories as string,
    lessonCount: hit.document.lessonCount as number,
    score: hit.score
  }));

  return {
    results: searchResults,
    elapsed: Date.now() - startTime,
    count: results.count
  };
}

/**
 * Perform a semantic/vector search
 * Requires generating an embedding for the query first
 */
export async function semanticSearch(queryEmbedding: number[], limit: number = 20): Promise<SearchResponse> {
  const database = await loadSearchIndex();
  const startTime = Date.now();

  const results = await search(database, {
    mode: "vector",
    vector: {
      value: queryEmbedding,
      property: "embedding"
    },
    limit,
    similarity: 0.5 // Minimum similarity threshold
  });

  const searchResults: SearchResult[] = results.hits.map(hit => ({
    id: hit.document.id as string,
    type: hit.document.type as "program" | "study",
    name: hit.document.name as string,
    description: hit.document.description as string,
    slug: hit.document.slug as string,
    image: hit.document.image as string,
    age: hit.document.age as string,
    programName: hit.document.programName as string,
    programSlug: hit.document.programSlug as string,
    studyName: hit.document.studyName as string,
    studySlug: hit.document.studySlug as string,
    categories: hit.document.categories as string,
    lessonCount: hit.document.lessonCount as number,
    score: hit.score
  }));

  return {
    results: searchResults,
    elapsed: Date.now() - startTime,
    count: results.count
  };
}

/**
 * Perform a hybrid search (text + semantic)
 * This combines keyword matching with semantic understanding
 */
export async function hybridSearch(query: string, queryEmbedding: number[], limit: number = 20): Promise<SearchResponse> {
  const database = await loadSearchIndex();
  const startTime = Date.now();

  const results = await search(database, {
    mode: "hybrid",
    term: query,
    vector: {
      value: queryEmbedding,
      property: "embedding"
    },
    properties: ["name", "description", "categories", "programName", "age"],
    limit,
    similarity: 0.3
  });

  const searchResults: SearchResult[] = results.hits.map(hit => ({
    id: hit.document.id as string,
    type: hit.document.type as "program" | "study",
    name: hit.document.name as string,
    description: hit.document.description as string,
    slug: hit.document.slug as string,
    image: hit.document.image as string,
    age: hit.document.age as string,
    programName: hit.document.programName as string,
    programSlug: hit.document.programSlug as string,
    studyName: hit.document.studyName as string,
    studySlug: hit.document.studySlug as string,
    categories: hit.document.categories as string,
    lessonCount: hit.document.lessonCount as number,
    score: hit.score
  }));

  return {
    results: searchResults,
    elapsed: Date.now() - startTime,
    count: results.count
  };
}
