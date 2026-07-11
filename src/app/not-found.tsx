import Link from "next/link";

export default function NotFound() {
  return (
    <div style={{ textAlign: "center", padding: "80px 20px" }}>
      <h1>Page Not Found</h1>
      <p>The page you're looking for doesn't exist or has been moved.</p>
      <Link href="/">Return to Lessons.church</Link>
    </div>
  );
}
