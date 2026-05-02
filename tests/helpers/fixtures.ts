import { Page } from "@playwright/test";

// Curriculum seeded by LessonsApi/tools/dbScripts/demo.sql.
export const SEED = {
  PROVIDER: { id: "PRO00000001", name: "Lessons.church Free" },
  PROGRAMS: {
    OT: { id: "PGM00000001", name: "Old Testament Heroes", slug: "old-testament-heroes" },
    NT: { id: "PGM00000002", name: "New Testament Stories", slug: "new-testament-stories" },
  },
  STUDIES: {
    GENESIS: { id: "STU00000001", name: "Genesis Stories", slug: "genesis-stories" },
    EXODUS: { id: "STU00000002", name: "Exodus Adventures", slug: "exodus-adventures" },
    BIRTH: { id: "STU00000003", name: "Birth of Jesus", slug: "birth-of-jesus" },
    PARABLES: { id: "STU00000004", name: "Parables", slug: "parables" },
  },
  LESSONS: {
    CREATION: { id: "LSN00000001", name: "Creation", slug: "creation" },
    NOAH: { id: "LSN00000002", name: "Noah's Ark", slug: "noahs-ark" },
    SAMARITAN: { id: "LSN00000007", name: "The Good Samaritan", slug: "good-samaritan" },
  },
  CLASSROOMS: {
    PRESCHOOL: { id: "CLS00000001", name: "Preschool Room" },
    ELEMENTARY: { id: "CLS00000002", name: "Elementary Room" },
  },
  EXTERNAL_PROVIDER: { id: "EXT00000001", name: "Bible Project Lessons" },
} as const;

// MUI icon-button helpers — useful when buttons are visually icon-only.
export const editIconButton = (page: Page) => page.locator('button:has(svg[data-testid="EditIcon"])');
export const closeIconButton = (page: Page) => page.locator('button:has(svg[data-testid="CloseIcon"])');
export const addIconButton = (page: Page) => page.locator('button:has(svg[data-testid="AddIcon"])');
export const trashIconButton = (page: Page) => page.locator('button:has(svg[data-testid="DeleteIcon"])');
