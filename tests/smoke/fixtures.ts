import { test as base, expect, type Page } from "@playwright/test";

// Smoke specs run against a deployed site. They only navigate and read.
// Every test fails on an uncaught page error or a 5xx from our own hosts.

const FIRST_PARTY = /(^|\.)(churchapps\.org|lessons\.church)$|^localhost$|^127\.0\.0\.1$/;

type Watch = { pageErrors: string[]; serverErrors: string[] };

export const test = base.extend<{ watch: Watch }>({
  watch: [
    async ({ page }, use) => {
      const watch: Watch = { pageErrors: [], serverErrors: [] };
      page.on("pageerror", (e) => watch.pageErrors.push(e.message));
      page.on("response", (r) => {
        const type = r.request().resourceType();
        if (type !== "xhr" && type !== "fetch" && type !== "document") return;
        const url = new URL(r.url());
        if (FIRST_PARTY.test(url.hostname) && r.status() >= 500) watch.serverErrors.push(`${r.status()} ${r.request().method()} ${url.pathname}`);
      });
      await use(watch);
      expect(watch.pageErrors, "uncaught page errors").toEqual([]);
      expect(watch.serverErrors, "5xx responses from our servers").toEqual([]);
    },
    { auto: true }
  ]
});

/** Open a server-rendered page and check it answered with a non-error status and a heading. */
export async function openPage(page: Page, path: string) {
  const res = await page.goto(path);
  expect(res?.status(), `${path} status`).toBeLessThan(400);
  await expect(page.locator("h1").first()).not.toBeEmpty();
}

/** Same-site links under the current page, e.g. the studies on a program page. */
export async function childLinks(page: Page, prefix: string) {
  const hrefs = await page.locator("a[href]").evaluateAll((as) => as.map((a) => a.getAttribute("href") || ""));
  const depth = prefix.split("/").length;
  return [...new Set(hrefs.filter((h) => h.startsWith(prefix + "/") && h.split("/").length === depth + 1))];
}

export { expect };
