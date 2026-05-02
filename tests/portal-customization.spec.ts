// Coverage for ChurchAppsSupport/docs/lessons-church/customization/customizing-lessons.md.
// Church admins can customize a scheduled venue's content (remove sections/roles
// for their classroom). The customization UI lives at /portal/venue/[id].

import { portalTest as test, expect } from "./helpers/test-fixtures";
import { gotoAuthenticated } from "./helpers/navigation";
import { SEED } from "./helpers/fixtures";

test.describe("Lesson customization (portal)", () => {
  test("renders the venue page with the seeded structure", async ({ page }) => {
    // Navigate to the Creation/Preschool venue page in the context of the
    // Preschool classroom (which has it scheduled). Route through /login so
    // the page's client-side auth check doesn't bounce us to /portal.
    await gotoAuthenticated(
      page,
      `/portal/venue/VEN00000001?classroomId=${SEED.CLASSROOMS.PRESCHOOL.id}`
    );

    await expect(page.getByText("Welcome").first()).toBeVisible({ timeout: 30000 });
    await expect(page.getByText("Bible Story").first()).toBeVisible();
  });
});
