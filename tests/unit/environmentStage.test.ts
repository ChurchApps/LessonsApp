import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { commonStageFor, lessonsApiFor } from "../../src/helpers/environmentStage.ts";

// Staging was retired on 2026-10-18 and its hosts no longer resolve. Vercel previews build with
// STAGE=staging (or unset) and prerender the home page from LessonsApi, so a fallback to
// api.staging.lessons.church fails the whole Preview build while Production keeps working.
describe("environment stage", () => {
  for (const STAGE of ["staging", "demo", undefined]) {
    it(`STAGE=${STAGE} builds against the production LessonsApi and demo ChurchApps`, () => {
      assert.equal(lessonsApiFor({ STAGE }), "https://api.lessons.church");
      assert.equal(commonStageFor({ STAGE }), "demo");
    });
  }

  it("prod stays prod", () => {
    assert.equal(lessonsApiFor({ STAGE: "prod" }), "https://api.lessons.church");
    assert.equal(commonStageFor({ STAGE: "prod" }), "prod");
  });

  it("local overrides win", () => {
    assert.equal(lessonsApiFor({ STAGE: "staging", NEXT_PUBLIC_LESSONS_API: "http://localhost:8090" }), "http://localhost:8090");
    assert.equal(commonStageFor({ NEXT_PUBLIC_API_BASE: "http://localhost:8084" }), "");
    assert.equal(commonStageFor({ STAGE: "demo", NEXT_PUBLIC_API_BASE: "http://localhost:8084" }), "demo");
  });
});
