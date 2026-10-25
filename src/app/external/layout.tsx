import type { Metadata } from "next";

// Another provider's curriculum shown through Lessons.church: rendered in the browser with a generic title, and the content belongs to that provider.
export const metadata: Metadata = { robots: { index: false, follow: true } };

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
