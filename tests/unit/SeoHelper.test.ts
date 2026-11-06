import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { SeoHelper } from "../../src/helpers/SeoHelper.ts";

describe("SeoHelper.plainText", () => {
  // /ark-preschool's description put raw Markdown into its JSON-LD and meta description.
  it("strips Markdown links, emphasis and stray bullet glyphs", () => {
    const value = "Lessons include videos.\n\n**[View the Three-Year Scope & Sequence](https://arkcurriculum.com/scope-and-sequence)** to see more. ● One ➢ Two";
    assert.equal(SeoHelper.plainText(value), "Lessons include videos. View the Three-Year Scope & Sequence to see more. One Two");
  });

  it("collapses whitespace in names like 'For Ministry Resources Youth Series   '", () => {
    assert.equal(SeoHelper.cleanName("For Ministry Resources Youth Series   "), "For Ministry Resources Youth Series");
  });
});

describe("SeoHelper.description", () => {
  it("keeps descriptions at or under 160 characters and cuts on a word boundary", () => {
    const result = SeoHelper.description("word ".repeat(80));
    assert.ok(result.length <= 160);
    assert.ok(result.endsWith("word…"));
  });

  it("falls back when the database description is missing or too short", () => {
    assert.equal(SeoHelper.description("", "Fallback text."), "Fallback text.");
    assert.equal(SeoHelper.description("Short.", "Fallback text."), "Short. Fallback text.");
    assert.equal(SeoHelper.description("Free youth ministry curriculum", "Fallback text."), "Free youth ministry curriculum. Fallback text.");
  });

  it("builds a lesson description from the bottom line and verse when the lesson has none", () => {
    const result = SeoHelper.lessonDescription({ programName: "NextLevel Online", studyName: "Acts", lessonName: "Agility", bottomLine: "God is on the move", verse: "Acts 1:8 (NIV) - But you will receive power" });
    assert.equal(result, "Agility is a free NextLevel Online lesson from the Acts study, ready to teach at your church. Bottom line: God is on the move. Scripture: Acts 1:8 (NIV).");
  });
});

describe("SeoHelper.publisherFromAbout", () => {
  it("reads the partner from the program's about text", () => {
    assert.deepEqual(SeoHelper.publisherFromAbout("This content is provided free of charge by [The Ark Church.](https://www.thearkchurch.com/)"), { name: "The Ark Church", url: "https://www.thearkchurch.com/" });
    assert.equal(SeoHelper.publisherFromAbout("FMR develops youth ministry curriculum that is free to all local churches."), undefined);
  });
});

describe("SeoHelper titles", () => {
  // GSC: "what are the penitential psalms" had 4,125 impressions and 1 click with the program name first.
  it("leads lesson titles with the lesson name", () => {
    assert.equal(SeoHelper.lessonTitle("NextLevel Online", "The Penitential Psalms (Psalm 51)"), "The Penitential Psalms (Psalm 51) | Free NextLevel Online Lesson");
  });

  it("leads study titles with the study name and cleans stray spaces", () => {
    assert.equal(SeoHelper.studyTitle("For Ministry Resources Youth Series   ", "Jonah "), "Jonah | Free For Ministry Resources Youth Series Curriculum");
  });
});
