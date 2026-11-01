import { Metadata } from "next";
import { MetaHelper } from "@/helpers/MetaHelper";

// The page itself is a client component, so its metadata (including the canonical) and its h1 live here;
// the visible title comes from PageHeader, which is not a heading.
export const metadata: Metadata = MetaHelper.getMetaData("Open Lesson Format Builder - Lessons.church", "Build and preview lessons in the Open Lesson Format, a free, open JSON format for sharing church curriculum between apps.", undefined, undefined, "/tools/olf");

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <h1 style={{ position: "absolute", width: 1, height: 1, overflow: "hidden", clip: "rect(0 0 0 0)", whiteSpace: "nowrap" }}>Open Lesson Format Builder</h1>
      {children}
    </>
  );
}
