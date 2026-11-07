import { Metadata } from "next";
import { MetaHelper } from "@/helpers/MetaHelper";

// The page itself is a client component, so its metadata (including the canonical) lives here.
export const metadata: Metadata = MetaHelper.getMetaData("Open Lesson Format Builder - Lessons.church", "Build and preview lessons in the Open Lesson Format, a free, open JSON format for sharing church curriculum between apps.", undefined, undefined, "/tools/olf");

export default function Layout({ children }: { children: React.ReactNode }) { return children; }
