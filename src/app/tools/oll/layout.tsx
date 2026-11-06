import { Metadata } from "next";
import { MetaHelper } from "@/helpers/MetaHelper";

// The page itself is a client component, so its metadata (including the canonical) lives here.
export const metadata: Metadata = MetaHelper.getMetaData("Open Lesson List Builder - Lessons.church", "Build lesson lists in the Open Lesson List format to share free church curriculum programs, studies and lessons between apps.", undefined, undefined, "/tools/oll");

export default function Layout({ children }: { children: React.ReactNode }) { return children; }
