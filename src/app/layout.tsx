import { Roboto } from "next/font/google";
import { AppRouterCacheProvider } from "@mui/material-nextjs/v16-appRouter";
import { EnvironmentHelper } from "@/helpers/EnvironmentHelper";
import "@/styles/globals.css";
import { DEFAULT_DESCRIPTION } from "@/helpers/MetaHelper";
import { ORGANIZATION_ID, SITE_URL, SeoHelper, WEBSITE_ID } from "@/helpers/SeoHelper";
import ClientLayout from "./ClientLayout";

const roboto = Roboto({
  weight: ["400", "700"],
  subsets: ["latin"],
  display: "swap"
});

export const metadata = { title: "Lessons.church", description: DEFAULT_DESCRIPTION };

const siteJsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": ORGANIZATION_ID,
      name: "Lessons.church",
      url: SITE_URL + "/",
      logo: { "@type": "ImageObject", url: SITE_URL + "/android-chrome-192x192.png", width: 192, height: 192 },
      description: "Completely free church curriculum for preschool, elementary, youth and adults.",
      email: "support@churchapps.org",
      parentOrganization: { "@type": "NGO", name: "Live Church Solutions (ChurchApps)", url: "https://churchapps.org", nonprofitStatus: "Nonprofit501c3" },
      sameAs: ["https://github.com/ChurchApps/LessonsApp"]
    },
    {
      "@type": "WebSite",
      "@id": WEBSITE_ID,
      name: "Lessons.church",
      url: SITE_URL + "/",
      inLanguage: "en",
      publisher: { "@id": ORGANIZATION_ID }
    }
  ]
};

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
          async
          type="module"
          src="/js/lite-vimeo.js"></script>
        {/* Linked here instead of @import in globals.css so the icon stylesheet downloads in parallel with the app CSS. */}
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="stylesheet" href="https://fonts.googleapis.com/icon?family=Material+Icons&display=block" />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: SeoHelper.jsonLd(siteJsonLd) }} />
      </head>
      <body>
        <AppRouterCacheProvider>
          <ClientLayout>{children}</ClientLayout>
        </AppRouterCacheProvider>
      </body>
    </html>
  );
}
