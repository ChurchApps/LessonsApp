import { browseTest as test, expect } from "./helpers/test-fixtures";
import { SEED } from "./helpers/fixtures";

const SITE = "https://lessons.church";
const programPath = `/${SEED.PROGRAMS.OT.slug}`;
const studyPath = `${programPath}/${SEED.STUDIES.GENESIS.slug}`;
const lessonPath = `${studyPath}/${SEED.LESSONS.CREATION.slug}`;

const linkHref = (html: string, rel: string) => [...html.matchAll(new RegExp(`<link[^>]*rel="${rel}"[^>]*>`, "g"))].map((m) => /href="([^"]*)"/.exec(m[0])?.[1]);
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
});
