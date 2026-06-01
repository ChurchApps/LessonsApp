import { Roboto } from "next/font/google";
import { AppRouterCacheProvider } from "@mui/material-nextjs/v15-appRouter";
import { EnvironmentHelper } from "@/helpers/EnvironmentHelper";
import "@/styles/globals.css";
import ClientLayout from "./ClientLayout";

const roboto = Roboto({
  weight: ["400", "700"],
  subsets: ["latin"],
  display: "swap"
});

export const metadata = { title: "Lessons.church", description: "Free church curriculum for children, youth, and adults." };

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  EnvironmentHelper.init();

  return (
    <html lang="en" className={roboto.className} data-scroll-behavior="smooth">
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(w,d,t,u,n,a,m){w['MauticTrackingObject']=n;w[n]=w[n]||function(){(w[n].q=w[n].q||[]).push(arguments)},w[n].l=1*new Date();a=d.createElement(t),m=d.getElementsByTagName(t)[0];a.async=1;a.src=u;m.parentNode.insertBefore(a,m)})(window,document,'script','https://mautic.churchapps.org/mtc.js','mt');mt('send','pageview');`
          }}
        />
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
        <AppRouterCacheProvider>
          <ClientLayout>{children}</ClientLayout>
        </AppRouterCacheProvider>
      </body>
    </html>
  );
}
