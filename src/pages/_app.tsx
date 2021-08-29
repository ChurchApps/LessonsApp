// always place bootstrap css above custom css to allow overriding.

import "bootstrap/dist/css/bootstrap.min.css";
import "react-activity/dist/Dots.css";
import "@/styles/globals.css";
import { useEffect } from "react";
import type { AppProps } from "next/app";
import Head from "next/head";
import { useRouter } from "next/router";
import { EnvironmentHelper, GoogleAnalyticsHelper } from "@/utils";
import { AuthProvider } from "@/hooks/useAuth";

EnvironmentHelper.init();

function MyApp({ Component, pageProps }: AppProps) {
  const router = useRouter();
  useEffect(() => {
    if (EnvironmentHelper.GoogleAnalyticsTag) {
      const handleRouteChange = (url: string) => {
        GoogleAnalyticsHelper.pageview(url);
      };
      router.events.on("routeChangeComplete", handleRouteChange);
      return () => {
        router.events.off("routeChangeComplete", handleRouteChange);
      };
    }
  }, [router.events]);

  return (
    <AuthProvider>
      <Head>
        {EnvironmentHelper.GoogleAnalyticsTag && (
          <>
            <script async src={`https://www.googletagmanager.com/gtag/js?id=${EnvironmentHelper.GoogleAnalyticsTag}`} />
            <script
              dangerouslySetInnerHTML={{
                __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${EnvironmentHelper.GoogleAnalyticsTag}', {
              page_path: window.location.pathname,
            });
          `,
              }}
            />
          </>
        )}
      </Head>
      <Component {...pageProps} />
    </AuthProvider>
  );
}
export default MyApp;
