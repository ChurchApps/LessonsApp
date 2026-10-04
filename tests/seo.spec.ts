import { browseTest as test, expect } from "./helpers/test-fixtures";
import { SEED } from "./helpers/fixtures";

const SITE = "https://lessons.church";
const programPath = `/${SEED.PROGRAMS.OT.slug}`;
const studyPath = `${programPath}/${SEED.STUDIES.GENESIS.slug}`;
const lessonPath = `${studyPath}/${SEED.LESSONS.CREATION.slug}`;

const linkHref = (html: string, rel: string) => [...html.matchAll(new RegExp(`<link[^>]*rel="${rel}"[^>]*>`, "g"))].map((m) => /href="([^"]*)"/.exec(m[0])?.[1]);
const jsonLd = (html: string) => [...html.matchAll(/<script type="application\/ld\+json">([^<]*)<\/script>/g)].map((m) => JSON.parse(m[1]));
const metaContent = (html: string, property: string) => [...html.matchAll(new RegExp(`<meta[^>]*property="${property}"[^>]*>`, "g"))].map((m) => /content="([^"]*)"/.exec(m[0])?.[1]);

test.describe("SEO", () => {
  for (const path of [programPath, studyPath, lessonPath]) {
    test(`${path} has its own canonical and og:url`, async ({ request }) => {
      const response = await request.get(path);
      expect(response.status()).toBe(200);
      const html = await response.text();
      expect(linkHref(html, "canonical")).toEqual([SITE + path]);
      expect(metaContent(html, "og:url")).toEqual([SITE + path]);
    });
  }

  test("home page canonical stays on the root", async ({ request }) => {
    const html = await (await request.get("/")).text();
    expect(linkHref(html, "canonical")).toEqual([SITE]);
  });

  for (const [label, parent] of [["program", ""], ["study", programPath], ["lesson", studyPath]]) {
    test(`unknown ${label} is a real 404`, async ({ request }) => {
      // Unique per run: the pages cache their API answer, so a reused slug could replay an older result.
      const response = await request.get(`${parent}/missing-${Date.now()}`, { timeout: 30000 });
      expect(response.status()).toBe(404);
    });
  }

  test("content sitemap lists programs, studies and lessons", async ({ request }) => {
    const response = await request.get("/sitemap-content.xml");
    expect(response.status()).toBe(200);
    expect(response.headers()["content-type"]).toContain("xml");
    const xml = await response.text();
    const locs = [...xml.matchAll(/<loc>([^<]*)<\/loc>/g)].map((m) => m[1]);
    expect(locs).toContain(SITE + programPath);
    expect(locs).toContain(SITE + studyPath);
    expect(locs).toContain(SITE + lessonPath);
    expect(locs.every((l) => l.startsWith(SITE + "/"))).toBe(true);
  });

  test("a lesson describes itself as a learning resource in its study and program", async ({ request }) => {
    const html = await (await request.get(lessonPath)).text();
    const lesson = jsonLd(html).find((d) => d["@type"] === "LearningResource");
    expect(lesson).toBeTruthy();
    expect(html).toContain(`<title>${SEED.PROGRAMS.OT.name}: ${lesson.name} - `);
    expect(lesson.url).toBe(SITE + lessonPath);
    expect(lesson.isPartOf).toMatchObject({ "@type": "Course", url: SITE + studyPath, isPartOf: { "@type": "Course", url: SITE + programPath } });
  });
});
