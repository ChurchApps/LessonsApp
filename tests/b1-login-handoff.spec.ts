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

test.describe("B1 app token handoff", () => {
  test.use({ storageState: { cookies: [], origins: [] } });

  test("a framed /b1/login signs the person in and lands on their rooms", async ({ page, baseURL }) => {
    const jwt = await b1Jwt();
    const src = `${baseURL}/b1/login?returnUrl=/b1/person&churchId=${CHURCH_ID}#jwt=${encodeURIComponent(jwt)}`;
    // A real server on 127.0.0.1 stands in for the B1 app: a different origin from localhost:3501.
    const b1 = http.createServer((_req, res) => { res.setHeader("Content-Type", "text/html"); res.end(`<iframe id="lessons" src="${src}" style="width:800px;height:600px"></iframe>`); });
    await new Promise<void>((resolve) => b1.listen(0, "127.0.0.1", resolve));
    await page.goto(`http://127.0.0.1:${(b1.address() as AddressInfo).port}/mobile/lessons`);

    // Signed in, the handoff replaces itself with the person's rooms (or the church's when they have none).
    await expect.poll(() => new URL(page.frames().find((f) => f !== page.mainFrame())?.url() || "about:blank").pathname, { timeout: 60000 }).toMatch(/^\/b1\/(person|CHU00000001|classroom\/)/);
    await expect(page.frameLocator("#lessons").locator("h1, .bigLink").first()).toBeVisible();
    b1.close();
  });

  test("the password login page still refuses framing", async ({ request: req }) => {
    const res = await req.get("/login");
    expect(res.headers()["content-security-policy"]).toContain("frame-ancestors 'self'");
    expect(res.headers()["x-frame-options"]).toBe("SAMEORIGIN");
  });
});
