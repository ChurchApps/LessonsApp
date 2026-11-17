// The B1 mobile app's Lessons tab frames lessons.church on another origin and hands the session over
// with #jwt. /login refuses framing (password form), so the handoff needs its own frameable route.
import http from "node:http";
import type { AddressInfo } from "node:net";
import { test, expect, request } from "@playwright/test";

const MAIN_API = process.env.API_BASE || "http://localhost:8084";
const CHURCH_ID = "CHU00000001";

async function b1Jwt() {
  const ctx = await request.newContext();
  const res = await ctx.post(`${MAIN_API}/membership/users/login`, { data: { email: "demo@b1.church", password: "password" } });
  expect(res.ok()).toBeTruthy();
  const uc = (await res.json()).userChurches.find((c: any) => c.church?.id === CHURCH_ID);
  await ctx.dispose();
  return uc.jwt as string;
}

// A real server on 127.0.0.1 stands in for the B1 app: a different origin from localhost:3501.
async function frameFromB1(src: string) {
  const b1 = http.createServer((_req, res) => { res.setHeader("Content-Type", "text/html"); res.end(`<iframe id="lessons" src="${src}" style="width:800px;height:600px"></iframe>`); });
  await new Promise<void>((resolve) => b1.listen(0, "127.0.0.1", resolve));
  return { b1, url: `http://127.0.0.1:${(b1.address() as AddressInfo).port}/mobile/lessons` };
}

// Frames /b1/login cross-origin and records any credential field the frame ever adds to its DOM, from the
// first parsed node on, then waits for the frame to hand off to /login.
async function expectNoPasswordForm(page: import("@playwright/test").Page, src: string) {
  const seen: string[] = [];
  await page.exposeFunction("reportLoginField", (id: string) => { seen.push(id); });
  await page.addInitScript(() => {
    const ids = ["login-email-field", "login-password-field"];
    const check = () => ids.forEach((id) => { if (document.getElementById(id)) (window as any).reportLoginField(id); });
    new MutationObserver(check).observe(document, { childList: true, subtree: true });
  });
  const { b1, url } = await frameFromB1(src);
  const toLogin = page.waitForRequest((r) => r.frame() !== page.mainFrame() && new URL(r.url()).pathname === "/login", { timeout: 60000 });
  await page.goto(url);
  const loginUrl = new URL((await toLogin).url());
  expect(loginUrl.searchParams.get("returnUrl")).toBe("/b1/person");
  expect(loginUrl.searchParams.get("churchId")).toBe(CHURCH_ID);
  expect(seen).toEqual([]);
  b1.close();
}

test.describe("B1 app token handoff", () => {
  test.use({ storageState: { cookies: [], origins: [] } });

  test("a framed /b1/login signs the person in and lands on their rooms", async ({ page, baseURL }) => {
    const jwt = await b1Jwt();
    const src = `${baseURL}/b1/login?returnUrl=/b1/person&churchId=${CHURCH_ID}#jwt=${encodeURIComponent(jwt)}`;
    const { b1, url } = await frameFromB1(src);
    await page.goto(url);

    // Signed in, the handoff replaces itself with the person's rooms (or the church's when they have none).
    await expect.poll(() => new URL(page.frames().find((f) => f !== page.mainFrame())?.url() || "about:blank").pathname, { timeout: 60000 }).toMatch(/^\/b1\/(person|CHU00000001|classroom\/)/);
    await expect(page.frameLocator("#lessons").locator("h1, .bigLink").first()).toBeVisible();
    b1.close();
  });

  test("a framed /b1/login with no jwt never shows the password form and goes to /login", async ({ page, baseURL }) => {
    await expectNoPasswordForm(page, `${baseURL}/b1/login?returnUrl=/b1/person&churchId=${CHURCH_ID}`);
  });

  test("a framed /b1/login with a rejected jwt never shows the password form and goes to /login", async ({ page, baseURL }) => {
    await expectNoPasswordForm(page, `${baseURL}/b1/login?returnUrl=/b1/person&churchId=${CHURCH_ID}#jwt=not-a-token`);
  });

  test("the handoff route stays frameable", async ({ request: req }) => {
    const res = await req.get("/b1/login");
    expect(res.headers()["x-frame-options"]).not.toBe("SAMEORIGIN");
    expect(res.headers()["content-security-policy"] || "").not.toContain("frame-ancestors 'self'");
  });

  test("the password login page still refuses framing", async ({ request: req }) => {
    const res = await req.get("/login");
    expect(res.headers()["content-security-policy"]).toContain("frame-ancestors 'self'");
    expect(res.headers()["x-frame-options"]).toBe("SAMEORIGIN");
  });
});
