import { test, expect, openPage, childLinks } from "./fixtures";

// Walks the public catalog from the home page down to one lesson. The pages are rendered
// on the server from LessonsApi, so a page that lists its children proves the data loaded.

test("home page lists programs and studies", async ({ page }) => {
  await openPage(page, "/");
  const studies = await page.locator("a[href]").evaluateAll((as) => as.map((a) => a.getAttribute("href") || "").filter((h) => /^\/[\w-]+\/[\w-]+$/.test(h)));
  expect(studies.length, "study links on the home page").toBeGreaterThan(0);
});

test("program, study and lesson pages render", async ({ page }) => {
  await openPage(page, "/");
  const study = await page.locator("a[href]").evaluateAll((as) => as.map((a) => a.getAttribute("href") || "").find((h) => /^\/[\w-]+\/[\w-]+$/.test(h)));
  expect(study, "a study link on the home page").toBeTruthy();
  const program = "/" + study!.split("/")[1];

  await openPage(page, program);
  const studies = await childLinks(page, program);
  expect(studies.length, `study links on ${program}`).toBeGreaterThan(0);

  await openPage(page, studies[0]);
  const lessons = await childLinks(page, studies[0]);
  expect(lessons.length, `lesson links on ${studies[0]}`).toBeGreaterThan(0);

  await openPage(page, lessons[0]);
});

test("search returns results", async ({ page }) => {
  const search = page.waitForResponse((r) => r.url().includes("/api/search"), { timeout: 30000 });
  await page.goto("/search?q=jesus");
  const res = await search;
  expect(res.status()).toBeLessThan(400);
  expect(((await res.json()).results || []).length, "search results for 'jesus'").toBeGreaterThan(0);
});

test("login page renders and reaches the API", async ({ page }) => {
  const providers = page.waitForResponse((r) => /\/membership\/users\/sso\/providers/.test(r.url()), { timeout: 30000 });
  await page.goto("/login");
  await expect(page.locator('input[type="email"]')).toBeVisible();
  expect((await providers).status()).toBeLessThan(400);
});
