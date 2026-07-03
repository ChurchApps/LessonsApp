import { test, expect } from "@playwright/test";
import { getApi, lessonsApi, TINY_PNG_DATA_URL } from "./helpers/api";

test.describe("Image uploads (local disk only)", () => {
  test("program image upload returns a contentRoot URL keyed by id", async () => {
    const api = await getApi("lessons-admin");
    try {
      const created = await lessonsApi(api, "post", "/programs", [{ name: "ImageUploadProgram", slug: "image-upload-program", live: false, image: TINY_PNG_DATA_URL }]);
      expect(created.ok()).toBeTruthy();
      const arr = await created.json();
      const program = arr[0];
      expect(program.id).toBeTruthy();
      // Image URL must use the assigned id, not "undefined" if missing.
      expect(program.image).toContain(`/programs/${program.id}.png`);
      expect(program.image).not.toContain("undefined");
      expect(program.image.startsWith("http")).toBeTruthy();

      const del = await lessonsApi(api, "delete", `/programs/${program.id}`);
      expect(del.ok()).toBeTruthy();
    } finally {
      await api.request.dispose();
    }
  });

  test("lesson image upload returns a contentRoot URL keyed by id", async () => {
    const api = await getApi("lessons-admin");
    try {
      const created = await lessonsApi(api, "post", "/lessons", [
        {
          studyId: "STU00000001",
          name: "ImgLesson",
          slug: "img-lesson",
          title: "Title",
          sort: 99,
          live: false,
          image: TINY_PNG_DATA_URL
        }
      ]);
      expect(created.ok()).toBeTruthy();
      const arr = await created.json();
      const lesson = arr[0];
      expect(lesson.id).toBeTruthy();
      expect(lesson.image).toContain(`/lessons/${lesson.id}.png`);

      const del = await lessonsApi(api, "delete", `/lessons/${lesson.id}`);
      expect(del.ok()).toBeTruthy();
    } finally {
      await api.request.dispose();
    }
  });

  test("study image upload returns a contentRoot URL keyed by id", async () => {
    const api = await getApi("lessons-admin");
    try {
      const created = await lessonsApi(api, "post", "/studies", [
        {
          programId: "PGM00000001",
          name: "ImgStudy",
          slug: "img-study",
          live: false,
          sort: 99,
          image: TINY_PNG_DATA_URL
        }
      ]);
      expect(created.ok()).toBeTruthy();
      const arr = await created.json();
      const study = arr[0];
      expect(study.id).toBeTruthy();
      expect(study.image).toContain(`/studies/${study.id}.png`);

      const del = await lessonsApi(api, "delete", `/studies/${study.id}`);
      expect(del.ok()).toBeTruthy();
    } finally {
      await api.request.dispose();
    }
  });

  test("contentRoot is localhost in demo mode (never S3)", async () => {
    const api = await getApi("lessons-admin");
    try {
      const created = await lessonsApi(api, "post", "/programs", [{ name: "DemoContentCheck", slug: "demo-content-check", live: false, image: TINY_PNG_DATA_URL }]);
      const arr = await created.json();
      const program = arr[0];
      expect(program.image).toMatch(/^http:\/\/localhost(:\d+)?\/content\//);
      expect(program.image).not.toMatch(/amazonaws\.com|\.s3\./);

      await lessonsApi(api, "delete", `/programs/${program.id}`);
    } finally {
      await api.request.dispose();
    }
  });
});
