
import "@/styles/globals.css";
import { EnvironmentHelper } from "@/utils/EnvironmentHelper";

import ClientLayout from "./ClientLayout";


export const metadata = {
  title: 'Lessons.church',
  description: 'Free church curriculum for children, youth, and adults.',
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {

  EnvironmentHelper.init();
  await EnvironmentHelper.initLocale();


  return (
    <html lang="en">
      <head>
        <link rel="preload" href="https://fonts.googleapis.com/css2?family=Roboto:wght@400;700&display=swap" as="font" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Roboto:wght@400;700&display=swap" rel="stylesheet" />
        <link rel="stylesheet" href="https://fonts.googleapis.com/icon?family=Material+Icons" />
        <link rel="stylesheet" href="/apphelper/css/styles.css"  />
        <script async type="module" src="https://cdn.jsdelivr.net/npm/@slightlyoff/lite-vimeo@0.1.1/lite-vimeo.js"></script>
      </head>
      <body>
        <ClientLayout>
          {children}
        </ClientLayout>
        <script type="text/javascript" id="hs-script-loader" async defer src="//js.hs-scripts.com/20077299.js"></script>
      </body>
    </html>
  )
}
