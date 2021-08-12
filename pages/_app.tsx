// always place bootstrap css above custom css to allow overriding.

import "bootstrap/dist/css/bootstrap.min.css";
import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { EnvironmentHelper } from "@/utils";

EnvironmentHelper.init();

function MyApp({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />;
}
export default MyApp;
