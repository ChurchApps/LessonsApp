import type { Metadata } from "next";

// A church's parent take-home page: rendered in the browser with a generic title, and it repeats lessons that have their own pages.
export const metadata: Metadata = { robots: { index: false, follow: true } };

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
