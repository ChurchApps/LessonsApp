// always place bootstrap css above custom css to allow overriding.

import "bootstrap/dist/css/bootstrap.min.css";
import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { EnvironmentHelper } from "@/utils";
import { AuthProvider } from "@/hooks/useAuth";
import { ChurchProvider } from "@/hooks/useChurch";

EnvironmentHelper.init();

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ChurchProvider>
      <AuthProvider>
        <Component {...pageProps} />
      </AuthProvider>
    </ChurchProvider>
  );
}
export default MyApp;
