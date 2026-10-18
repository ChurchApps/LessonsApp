import type { Metadata } from "next";

// Embeds are iframed on church sites; keep them out of search results.
export const metadata: Metadata = { robots: { index: false } };

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
