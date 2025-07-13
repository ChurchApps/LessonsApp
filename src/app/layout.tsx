import { Roboto } from "next/font/google";
import { EnvironmentHelper } from "@/helpers/EnvironmentHelper";
import "@/styles/globals.css";
import ClientLayout from "./ClientLayout";

const roboto = Roboto({
  weight: ["400", "700"],
  subsets: ["latin"],
  display: "swap"
});

export const metadata = {
  title: "Lessons.church",
  description: "Free church curriculum for children, youth, and adults."
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  EnvironmentHelper.init();
  await EnvironmentHelper.initLocale();

  return (
    <html lang="en" className={roboto.className}>
      <head>
        <script
          async
          type="module"
          src="https://cdn.jsdelivr.net/npm/@slightlyoff/lite-vimeo@0.1.1/lite-vimeo.js"></script>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              name: "Lessons.church",
              url: "https://lessons.church",
              logo: "https://lessons.church/images/logo-dark.png",
              description: "Free church curriculum for children, youth, and adults."
            })
          }}
        />
      </head>
      <body>
        <ClientLayout>{children}</ClientLayout>
        <script type="text/javascript" id="hs-script-loader" async defer src="//js.hs-scripts.com/20077299.js"></script>
      </body>
    </html>
  );
}
