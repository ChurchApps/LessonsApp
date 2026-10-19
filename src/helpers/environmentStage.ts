// Staging was retired on 2026-10-18: api.staging.lessons.church and api.staging.churchapps.org no
// longer resolve, so nothing may fall back to them. LessonsApi has no demo stage, so previews and
// local dev read lesson content from the production LessonsApi unless NEXT_PUBLIC_LESSONS_API
// says otherwise. ChurchApps (membership, messaging) has a demo stage, and that is what previews use.

export const PROD_LESSONS_API = "https://api.lessons.church";
export const SITE_ROOT = "https://lessons.church";

export interface StageEnv {
  STAGE?: string;
  NEXT_PUBLIC_LESSONS_API?: string;
  NEXT_PUBLIC_API_BASE?: string;
}

/** The LessonsApi base URL for this build. */
export function lessonsApiFor(env: StageEnv): string {
  return env.NEXT_PUBLIC_LESSONS_API || PROD_LESSONS_API;
}

/** The stage CommonEnvironmentHelper.init gets. "" is its dev mode, where the NEXT_PUBLIC_* overrides apply. */
export function commonStageFor(env: StageEnv): string {
  switch (env.STAGE) {
    case "prod": return "prod";
    case "demo": return "demo";
    case "staging": return "demo"; // retired; anything still configured this way runs as a preview
    default: return env.NEXT_PUBLIC_API_BASE ? "" : "demo";
  }
}
