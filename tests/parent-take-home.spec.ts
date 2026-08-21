import { adminTest, browseTest, expect } from "./helpers/test-fixtures";
import { SEED } from "./helpers/fixtures";
import { getApi, lessonsApi } from "./helpers/api";

const TAKE_HOME = {
  bottomLine: "God keeps His promises.",
  verse: "Genesis 9:13 — I have set my rainbow in the clouds.",
  parentQuestion: "What is one promise God has kept in our family?",
  parentNote: "Pray together tonight."
};

function todayYmd() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

async function seedLiveLesson(opts: { slug: string; takeHome: boolean; name?: string }) {
  const api = await getApi("lessons-admin");
  try {
    const payload: any = {
      studyId: SEED.STUDIES.GENESIS.id,
      name: opts.name || "Take Home Public",
      title: "Parent Preview",
      slug: opts.slug,
      live: true,
      sort: 90,
      description: "Catalog copy about the story."
    };
    if (opts.takeHome) Object.assign(payload, TAKE_HOME);
    const created = await lessonsApi(api, "post", "/lessons", [payload]);
    const body = await created.text();
    expect(created.status(), `lesson POST: ${body.slice(0, 300)}`).toBe(200);
    const lesson = JSON.parse(body)[0];
    const venueRes = await lessonsApi(api, "post", "/venues", [{ lessonId: lesson.id, name: "Elementary", sort: 1 }]);
    expect(venueRes.ok()).toBeTruthy();
    const venue = (await venueRes.json())[0];
    return { lesson, venue };
  } finally {
    await api.request.dispose();
  }
}

adminTest.describe("Admin parent take-home", () => {
  adminTest("edits take-home fields, saves, and values persist after reload", async ({ page }) => {
    const suffix = Date.now().toString();
    const name = `Take Home ${suffix}`;
    const title = `Persist ${suffix}`;
    const slug = `take-home-persist-${suffix}`;

    await page.getByText(SEED.PROGRAMS.OT.name).first().click();
    await page.getByText(SEED.STUDIES.GENESIS.name).first().click();
    await page.getByRole("button", { name: /Add lesson to this study/i }).click();
    await expect(page.getByRole("heading", { name: "Add Lesson" })).toBeVisible();

    await page.locator('input[name="name"]').fill(name);
    await page.locator('input[name="title"]').fill(title);
    await page.locator('input[name="slug"]').fill(slug);
    await page.getByRole("button", { name: "Check" }).click();
    await page.locator('input[name="bottomLine"]').fill(TAKE_HOME.bottomLine);
    await page.locator('input[name="verse"]').fill(TAKE_HOME.verse);
    await page.locator('input[name="parentQuestion"]').fill(TAKE_HOME.parentQuestion);
    await page.locator('textarea[name="parentNote"]').fill(TAKE_HOME.parentNote);
    await page.getByRole("button", { name: "Save" }).click();

    await expect(page.getByTestId("admin-main").getByText(`${name}: ${title}`)).toBeVisible({ timeout: 15000 });
    await page.getByTestId("admin-main").getByText(`${name}: ${title}`).click();
    await expect(page.getByRole("heading", { name: "Edit Lesson" })).toBeVisible();
    await expect(page.locator('input[name="bottomLine"]')).toHaveValue(TAKE_HOME.bottomLine);
    await expect(page.locator('input[name="verse"]')).toHaveValue(TAKE_HOME.verse);
    await expect(page.locator('input[name="parentQuestion"]')).toHaveValue(TAKE_HOME.parentQuestion);
    await expect(page.locator('textarea[name="parentNote"]')).toHaveValue(TAKE_HOME.parentNote);
  });
});

browseTest.describe("Public and classroom parent take-home", () => {
  browseTest("does not show For parents on the public lesson page even with take-home fields", async ({ page }) => {
    const slug = `take-home-show-${Date.now()}`;
    await seedLiveLesson({ slug, takeHome: true });

    await page.goto(`/${SEED.PROGRAMS.OT.slug}/${SEED.STUDIES.GENESIS.slug}/${slug}`);
    await expect(page.getByRole("heading", { name: "Take Home Public" }).first()).toBeVisible({ timeout: 30000 });
    await expect(page.getByTestId("parent-take-home")).toHaveCount(0);
  });

  browseTest("classroom parent page renders take-home for a scheduled lesson", async ({ page }) => {
    const slug = `take-home-class-${Date.now()}`;
    const { lesson, venue } = await seedLiveLesson({ slug, takeHome: true, name: "Take Home Class" });

    const grace = await getApi("grace");
    try {
      const sched = await lessonsApi(grace, "post", "/schedules", [{ classroomId: SEED.CLASSROOMS.ELEMENTARY.id, scheduledDate: todayYmd(), programId: SEED.PROGRAMS.OT.id, studyId: SEED.STUDIES.GENESIS.id, lessonId: lesson.id, venueId: venue.id, displayName: "Take Home Class (Elementary)" }]);
      expect(sched.status(), `schedule POST: ${(await sched.text()).slice(0, 300)}`).toBe(200);
    } finally {
      await grace.request.dispose();
    }

    await page.goto(`/classroom/${SEED.CLASSROOMS.ELEMENTARY.id}`);
    const block = page.locator(`a[href*="${slug}"]`).getByTestId("parent-take-home");
    await expect(block).toBeVisible({ timeout: 30000 });
    await expect(block.getByText(TAKE_HOME.bottomLine)).toBeVisible();
    await expect(block.getByText(TAKE_HOME.verse)).toBeVisible();
    await expect(block.getByText(TAKE_HOME.parentQuestion)).toBeVisible();
    await expect(block.getByText(TAKE_HOME.parentNote)).toBeVisible();
  });
});
