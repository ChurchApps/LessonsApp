import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { downloadRequest } from "../../src/helpers/downloadRequest.ts";

// Sentry LESSONS-3T (268 events, 32 users): clicking a download link both logs the download and starts
// the file; Safari cancels the ordinary fetch when the navigation begins ("Load failed").
const download = { lessonId: "L1", fileId: "F1", userId: "", churchId: "", ipAddress: "", downloadDate: new Date("2026-10-18T00:00:00Z"), fileName: "Slides.pptx" };

describe("downloadRequest", () => {
  it("posts JSON with keepalive so the request survives the page navigating away", () => {
    const init = downloadRequest([download]);
    assert.equal(init.method, "POST");
    assert.equal(init.keepalive, true);
    assert.equal((init.headers as Record<string, string>)["Content-Type"], "application/json");
    assert.deepEqual(JSON.parse(init.body as string), [JSON.parse(JSON.stringify(download))]);
  });

  it("carries the login when there is one", () => {
    assert.equal((downloadRequest([download], "jwt-123").headers as Record<string, string>).Authorization, "Bearer jwt-123");
    assert.equal((downloadRequest([download]).headers as Record<string, string>).Authorization, undefined);
    assert.equal((downloadRequest([download], "").headers as Record<string, string>).Authorization, undefined);
  });
});
