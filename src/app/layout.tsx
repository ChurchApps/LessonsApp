import "@/styles/globals.css";
import { EnvironmentHelper } from "@/utils/EnvironmentHelper";

export const metadata = {
  title: 'Lessons.church',
  description: 'Free church curriculum for children, youth, and adults.',
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {

  await EnvironmentHelper.init();

  return (
    <html lang="en">
      <head>
        <link rel="preload" href="https://fonts.googleapis.com/css2?family=Roboto:wght@400;700&display=swap" as="font" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Roboto:wght@400;700&display=swap" rel="stylesheet" />
        <link rel="stylesheet" href="https://fonts.googleapis.com/icon?family=Material+Icons" />
        <script async type="module" src="https://cdn.jsdelivr.net/npm/@slightlyoff/lite-vimeo@0.1.1/lite-vimeo.js"></script>
      </head>
      <body>{children}</body>
    </html>
  )
}
