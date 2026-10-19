"use client";

import React, { useEffect, useState } from "react";
import { CookiesProvider } from "react-cookie";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import { AnalyticsHelper, ErrorLogInterface, UserHelper, ErrorHelper, ErrorMessages } from "@churchapps/apphelper";
import { ErrorAppDataInterface } from "@churchapps/helpers";
import ErrorBoundary from "@/components/ErrorBoundary";
import { EnvironmentHelper } from "@/helpers/EnvironmentHelper";
import { UserProvider } from "./context/UserContext";

// Initialize synchronously so ApiHelper.apiConfigs is populated before child useEffect fires.
if (typeof window !== "undefined") EnvironmentHelper.init();

function ClientLayout({ children }: { children: React.ReactNode }) {
  const [errors, setErrors] = useState<string[]>([]);
  useEffect(() => {
    EnvironmentHelper.initLocale();
    EnvironmentHelper.init();

    try {
      AnalyticsHelper.init();
    } catch (error) {
      console.warn("Analytics initialization failed:", error);
    }

    ErrorHelper.init(getErrorAppData, customErrorHandler);

    // Embeds, B1 webviews and classroom displays run on other sites and screens; keep the marketing tracker off them.
    if (/^\/(embed|b1|classroom)(\/|$)/.test(window.location.pathname)) return;
    const script = document.createElement("script");
    script.type = "text/javascript";
    script.id = "hs-script-loader";
    script.async = true;
    script.defer = true;
    script.src = "//js.hs-scripts.com/20077299.js";
    document.body.appendChild(script);
  }, []);

  const getErrorAppData = () => {
    const result: ErrorAppDataInterface = {
      churchId: UserHelper.currentUserChurch?.church?.id || "",
      userId: UserHelper.user?.id || "",
      originUrl: typeof window !== "undefined" ? window.location.toString() : "",
      application: "B1"
    };
    return result;
  };

  const customErrorHandler = (error: ErrorLogInterface) => {
    switch (error.errorType) { case "401": setErrors(["Access denied when loading " + error.message]); break; case "500": setErrors(["Server error when loading " + error.message]); break; }
  };

  const mdTheme = createTheme({
    palette: { secondary: { main: "#444444" } },
    components: {
      MuiTextField: { defaultProps: { margin: "normal" } },
      MuiFormControl: { defaultProps: { margin: "normal" } }
    }
  });

  return (
    <CookiesProvider>
      <ThemeProvider theme={mdTheme}>
        <UserProvider>
          <ErrorMessages errors={errors} />
          <ErrorBoundary>{children}</ErrorBoundary>
        </UserProvider>
      </ThemeProvider>
    </CookiesProvider>
  );
}
export default ClientLayout;
