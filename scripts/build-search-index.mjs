/**
 * Build script for generating the Orama search index with semantic embeddings.
 *
 * This script:
 * 1. Fetches all programs, studies, and lessons from the API
 * 2. Generates embeddings using Transformers.js (all-MiniLM-L6-v2 model)
 * 3. Creates an Orama index with vector search capabilities
 * 4. Saves the index to public/search-index.json
 *
 * Run with: node scripts/build-search-index.mjs
 */

import { create, insertMultiple, save } from '@orama/orama';
import { pipeline } from '@xenova/transformers';
import { writeFileSync, mkdirSync, existsSync } from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const PROJECT_ROOT = join(__dirname, '..');

// API Configuration
const API_BASE = process.env.LESSONS_API || 'https://api.lessons.church';

/**
 * Fetch data from the Lessons API
 */
async function fetchFromApi(endpoint) {
  const url = `${API_BASE}${endpoint}`;
  console.log(`Fetching: ${url}`);
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Failed to fetch ${url}: ${response.status}`);
  }
  return response.json();
}

/**
 * Load all content from the API
 */
async function loadAllContent() {
  console.log('\n📚 Loading content from API...\n');

  // Fetch programs
  const programs = await fetchFromApi('/programs/public');
  console.log(`  Found ${programs.length} programs`);

  // Fetch all studies
  const studies = await fetchFromApi('/studies/public');
  console.log(`  Found ${studies.length} studies`);

  // Fetch study categories for each program
  const allCategories = [];
  for (const program of programs) {
    try {
      const categories = await fetchFromApi(`/studyCategories/public/program/${program.id}`);
      allCategories.push(...categories);
    } catch (e) {
      // Some programs may not have categories
    }
  }
  console.log(`  Found ${allCategories.length} study categories`);

  // Create a map of studyId -> categories
  const studyCategoryMap = new Map();
  for (const cat of allCategories) {
    if (!studyCategoryMap.has(cat.studyId)) {
      studyCategoryMap.set(cat.studyId, []);
    }
    studyCategoryMap.get(cat.studyId).push(cat.categoryName);
  }

  // Create a map of programId -> program
  const programMap = new Map(programs.map(p => [p.id, p]));

  return { programs, studies, programMap, studyCategoryMap };
}

/**
 * Build searchable documents from content
 */
function buildDocuments(programs, studies, programMap, studyCategoryMap) {
  console.log('\n📝 Building searchable documents...\n');

  const documents = [];

  // Add programs as searchable documents
  for (const program of programs) {
    documents.push({
      id: `program-${program.id}`,
      type: 'program',
      name: program.name || '',
      description: program.description || program.shortDescription || '',
      slug: program.slug || '',
      image: program.image || '',
      age: program.age || '',
      programName: program.name || '',
      programSlug: program.slug || '',
      studyName: '',
      studySlug: '',
      categories: '',
      // Text to embed - combine all relevant fields
      searchText: [
        program.name,
        program.description,
        program.shortDescription,
        program.age
      ].filter(Boolean).join(' ')
    });
  }

  // Add studies as searchable documents
  for (const study of studies) {
    const program = programMap.get(study.programId);
    const categories = studyCategoryMap.get(study.id) || [];

    documents.push({
      id: `study-${study.id}`,
      type: 'study',
      name: study.name || '',
      description: study.description || study.shortDescription || '',
      slug: study.slug || '',
      image: study.image || '',
      age: program?.age || '',
      programName: program?.name || '',
      programSlug: program?.slug || '',
      studyName: study.name || '',
      studySlug: study.slug || '',
      categories: categories.join(', '),
      lessonCount: study.lessonCount || 0,
      // Text to embed - combine all relevant fields
      searchText: [
        study.name,
        study.description,
        study.shortDescription,
        program?.name,
        program?.age,
        ...categories
      ].filter(Boolean).join(' ')
    });
  }

  console.log(`  Created ${documents.length} searchable documents`);
  return documents;
}

/**
 * Generate embeddings for all documents
 */
async function generateEmbeddings(documents) {
  console.log('\n🧠 Generating semantic embeddings...\n');
  console.log('  Loading model (this may take a moment on first run)...');

  // Load the embedding pipeline
  const embedder = await pipeline('feature-extraction', 'Xenova/all-MiniLM-L6-v2');

  console.log('  Model loaded! Generating embeddings...\n');

  const embeddings = [];
  for (let i = 0; i < documents.length; i++) {
    const doc = documents[i];
    const text = doc.searchText || doc.name || '';

    // Generate embedding
    const output = await embedder(text, { pooling: 'mean', normalize: true });
    const embedding = Array.from(output.data);

    embeddings.push(embedding);

    // Progress indicator
    if ((i + 1) % 10 === 0 || i === documents.length - 1) {
      process.stdout.write(`\r  Processed ${i + 1}/${documents.length} documents`);
    }
  }

  console.log('\n');
  return embeddings;
}

/**
 * Create the Orama search index
 */
async function createSearchIndex(documents, embeddings) {
  console.log('🔍 Creating Orama search index...\n');

  // Create the index with vector support
  const db = await create({
    schema: {
      id: 'string',
      type: 'string',
      name: 'string',
      description: 'string',
      slug: 'string',
      image: 'string',
      age: 'string',
      programName: 'string',
      programSlug: 'string',
      studyName: 'string',
      studySlug: 'string',
      categories: 'string',
      lessonCount: 'number',
      embedding: 'vector[384]' // all-MiniLM-L6-v2 produces 384-dim vectors
    }
  });

  // Prepare documents with embeddings
  const docsWithEmbeddings = documents.map((doc, i) => ({
    ...doc,
    lessonCount: doc.lessonCount || 0,
    embedding: embeddings[i]
  }));

  // Insert all documents
  await insertMultiple(db, docsWithEmbeddings);

  console.log(`  Indexed ${documents.length} documents with embeddings`);

  return db;
}

/**
 * Save the index to disk
 */
async function saveIndex(db) {
  console.log('\n💾 Saving search index...\n');

  // Ensure the public directory exists
  const publicDir = join(PROJECT_ROOT, 'public');
  if (!existsSync(publicDir)) {
    mkdirSync(publicDir, { recursive: true });
  }

  // Export the database
  const indexData = await save(db);

  // Save to file
  const outputPath = join(publicDir, 'search-index.json');
  writeFileSync(outputPath, JSON.stringify(indexData));

  const fileSizeKB = Math.round(JSON.stringify(indexData).length / 1024);
  console.log(`  Saved to: ${outputPath}`);
  console.log(`  File size: ${fileSizeKB} KB`);
}

/**
 * Main build function
 */
async function main() {
  console.log('═══════════════════════════════════════════════════════════');
  console.log('   Lessons.church Search Index Builder');
  console.log('   Powered by Orama + Transformers.js');
  console.log('═══════════════════════════════════════════════════════════');

  try {
    // Load content
    const { programs, studies, programMap, studyCategoryMap } = await loadAllContent();

    // Build documents
    const documents = buildDocuments(programs, studies, programMap, studyCategoryMap);

    // Generate embeddings
    const embeddings = await generateEmbeddings(documents);

    // Create index
    const db = await createSearchIndex(documents, embeddings);

    // Save index
    await saveIndex(db);

    console.log('\n✅ Search index built successfully!\n');

  } catch (error) {
    console.error('\n❌ Error building search index:', error);
    process.exit(1);
  }
}

main();
