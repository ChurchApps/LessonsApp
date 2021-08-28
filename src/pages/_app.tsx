// always place bootstrap css above custom css to allow overriding.

import "bootstrap/dist/css/bootstrap.min.css";
import "react-activity/dist/Dots.css";
import "@/styles/globals.css";
import { useEffect } from "react"
import type { AppProps } from "next/app";
import { useRouter } from "next/router"
import { EnvironmentHelper, pageview } from "@/utils";
import { AuthProvider } from "@/hooks/useAuth";

EnvironmentHelper.init();

function MyApp({ Component, pageProps }: AppProps) {
  const router = useRouter()
  useEffect(() => {
    const handleRouteChange = (url: string) => {
      pageview(url)
    }
    router.events.on('routeChangeComplete', handleRouteChange)
    return () => {
      router.events.off('routeChangeComplete', handleRouteChange)
    }
  }, [router.events])

  return (
    <AuthProvider>
      <Component {...pageProps} />
    </AuthProvider>
  );
}
export default MyApp;
