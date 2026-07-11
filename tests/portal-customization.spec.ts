import { portalTest as test, expect } from "./helpers/test-fixtures";
import { gotoAuthenticated } from "./helpers/navigation";
import { SEED } from "./helpers/fixtures";

test.describe("Lesson customization (portal)", () => {
  test("renders the venue page with the seeded structure", async ({ page }) => {
    // Route through /login to avoid client-side auth bounce to /portal.
    await gotoAuthenticated(
      page,
      `/portal/venue/VEN00000001?classroomId=${SEED.CLASSROOMS.PRESCHOOL.id}`
    );

    await expect(page.getByText("Welcome").first()).toBeVisible({ timeout: 30000 });
    await expect(page.getByText("Bible Story").first()).toBeVisible();
  });
});
