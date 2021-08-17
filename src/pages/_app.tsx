// always place bootstrap css above custom css to allow overriding.

import "bootstrap/dist/css/bootstrap.min.css";
import "react-activity/dist/Dots.css";
import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { EnvironmentHelper } from "@/utils";
import { AuthProvider } from "@/hooks/useAuth";

EnvironmentHelper.init();

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <AuthProvider>
      <Component {...pageProps} />
    </AuthProvider>
  );
}
export default MyApp;
