import path from "node:path";
import { fileURLToPath } from "node:url";
import nextEnv from "@next/env";

// @next/env is CommonJS, so destructure off the default import rather than relying on
// named-export interop.
const { loadEnvConfig } = nextEnv;

// Playwright runs outside Next.js, so nothing loads `.env` for us. Without this the
// TEST_* overrides documented in dotenv.sample.txt would silently never apply.
// Uses Next's own loader so tests and `next dev` resolve .env files identically
// (.env.development.local -> .env.local -> .env.development -> .env). Real environment
// variables always win over file values, so CI secrets are not clobbered.
const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..", "..");

loadEnvConfig(ROOT, true);
