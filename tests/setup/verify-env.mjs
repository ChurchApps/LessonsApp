const DEFAULT_BASE_URL = "http://localhost:3501";
const API_BASE = "http://localhost:8084";
const LESSONS_API_BASE = "http://localhost:8090";
const ALLOWED_ENVIRONMENTS = ["demo", "dev"];

class VerifyEnvError extends Error {
  constructor(message) {
    super(message);
    this.name = "VerifyEnvError";
  }
}

function refuse(lines) {
  const body = Array.isArray(lines) ? lines.join("\n  ") : lines;
  throw new VerifyEnvError(
    [
      "",
      "========================================",
      "LessonsApp tests refused to run.",
      `  ${body}`,
      "========================================",
      "",
    ].join("\n")
  );
}

function checkBaseUrl() {
  const raw = process.env.BASE_URL || DEFAULT_BASE_URL;
  let url;
  try {
    url = new URL(raw);
  } catch {
    refuse(`BASE_URL "${raw}" is not a valid URL.`);
  }
  if (url.hostname !== "localhost" && url.hostname !== "127.0.0.1") {
    refuse([
      `BASE_URL "${raw}" is not local.`,
      "Tests only run against http://localhost:3501. Unset BASE_URL or point it at localhost.",
    ]);
  }
}

async function checkApiHealth() {
  let health;
  try {
    const res = await fetch(`${API_BASE}/health`);
    if (!res.ok) refuse(`GET ${API_BASE}/health returned HTTP ${res.status}.`);
    health = await res.json();
  } catch (err) {
    if (err instanceof VerifyEnvError) throw err;
    refuse([
      `Could not reach Api at ${API_BASE}/health.`,
      `Error: ${err instanceof Error ? err.message : String(err)}`,
      "The Api dev server should already be running (Playwright webServer starts it).",
    ]);
  }
  if (!ALLOWED_ENVIRONMENTS.includes(health.environment)) {
    refuse([
      `Api reports environment="${health.environment}" but must be one of: ${ALLOWED_ENVIRONMENTS.join(", ")}.`,
      "Set ENVIRONMENT=demo in Api/.env and restart the Api.",
    ]);
  }
}

async function checkLessonsApiHealth() {
  let health;
  try {
    const res = await fetch(`${LESSONS_API_BASE}/health`);
    if (!res.ok) refuse(`GET ${LESSONS_API_BASE}/health returned HTTP ${res.status}.`);
    health = await res.json();
  } catch (err) {
    if (err instanceof VerifyEnvError) throw err;
    refuse([
      `Could not reach LessonsApi at ${LESSONS_API_BASE}/health.`,
      `Error: ${err instanceof Error ? err.message : String(err)}`,
      "Start LessonsApi with `cd LessonsApi && npm run dev` (or let Playwright's webServer start it).",
    ]);
  }
  if (!ALLOWED_ENVIRONMENTS.includes(health.environment)) {
    refuse([
      `LessonsApi reports environment="${health.environment}" but must be one of: ${ALLOWED_ENVIRONMENTS.join(", ")}.`,
      "Set APP_ENV=demo in LessonsApi/.env and restart the API.",
    ]);
  }
  const loaded = health?.modules?.loaded ?? [];
  if (!loaded.includes("lessons")) {
    refuse([
      `LessonsApi reports modules.loaded=${JSON.stringify(loaded)}, missing "lessons".`,
      "Check CONNECTION_STRING in LessonsApi/.env.",
    ]);
  }
}

export async function verifyEnv({ fullCheck } = {}) {
  checkBaseUrl();
  if (fullCheck) {
    await checkApiHealth();
    await checkLessonsApiHealth();
  }
}

export { VerifyEnvError };
