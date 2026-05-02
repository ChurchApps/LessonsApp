// Coverage for the bundle / resource / variant / asset hierarchy described in
// ChurchAppsSupport/docs/lessons-church/admin/managing-lessons.md (resources
// section). The UI for these is highly nested (BundleList -> ResourceEdit ->
// AssetEdit chains); we exercise the persistence path at the API level which
// runs entirely on the local lessons DB and disk file store in demo mode.

import { test, expect } from "@playwright/test";
import { getApi, lessonsApi } from "./helpers/api";

const PROGRAM_ID = "PGM00000001"; // Old Testament Heroes

test.describe("Bundles / resources CRUD (API)", () => {
  test("bundle CRUD lifecycle", async () => {
    const api = await getApi("lessons-admin");
    try {
      const created = await lessonsApi(api, "post", "/bundles", [
        { contentType: "program", contentId: PROGRAM_ID, name: "Zacchaeus Bundle" },
      ]);
      const body = await created.text();
      expect(created.status(), `bundle POST: ${body.slice(0, 300)}`).toBe(200);
      const bundle = JSON.parse(body)[0];
      expect(bundle.id).toBeTruthy();

      // Read back via /content/:contentType/:contentId.
      const list = await lessonsApi(api, "get", `/bundles/content/program/${PROGRAM_ID}`);
      expect(list.ok()).toBeTruthy();
      const items = await list.json();
      expect(items.some((b: any) => b.id === bundle.id)).toBeTruthy();

      // Delete.
      const del = await lessonsApi(api, "delete", `/bundles/${bundle.id}`);
      expect(del.ok()).toBeTruthy();
    } finally {
      await api.request.dispose();
    }
  });

  test("resource CRUD lifecycle (under a bundle)", async () => {
    const api = await getApi("lessons-admin");
    try {
      // Create a parent bundle first.
      const bundleResp = await lessonsApi(api, "post", "/bundles", [
        { contentType: "program", contentId: PROGRAM_ID, name: "Resource Test Bundle" },
      ]);
      const bundle = (await bundleResp.json())[0];

      const resourceResp = await lessonsApi(api, "post", "/resources", [
        {
          contentType: "program",
          contentId: PROGRAM_ID,
          bundleId: bundle.id,
          name: "Zacchaeus Resource",
          category: "Handouts",
        },
      ]);
      expect(resourceResp.ok()).toBeTruthy();
      const resource = (await resourceResp.json())[0];
      expect(resource.id).toBeTruthy();

      // Read.
      const list = await lessonsApi(api, "get", `/resources/content/program/${PROGRAM_ID}`);
      const items = await list.json();
      expect(items.some((r: any) => r.id === resource.id)).toBeTruthy();

      // Update via re-POST with id.
      const updateResp = await lessonsApi(api, "post", "/resources", [
        { ...resource, name: "Zacchaeus Renamed Resource" },
      ]);
      expect(updateResp.ok()).toBeTruthy();

      // Delete resource and bundle.
      const delR = await lessonsApi(api, "delete", `/resources/${resource.id}`);
      expect(delR.ok()).toBeTruthy();
      const delB = await lessonsApi(api, "delete", `/bundles/${bundle.id}`);
      expect(delB.ok()).toBeTruthy();
    } finally {
      await api.request.dispose();
    }
  });
});
