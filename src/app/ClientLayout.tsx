"use client";

import React, { useEffect, useState } from "react";
import { CookiesProvider } from "react-cookie";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import { AnalyticsHelper, ErrorLogInterface, UserHelper, ErrorHelper, ErrorMessages } from "@churchapps/apphelper";
import { ErrorAppDataInterface } from "@churchapps/helpers";
import { ErrorBoundary } from "@/components";
import { EnvironmentHelper } from "@/helpers/EnvironmentHelper";
import { UserProvider } from "./context/UserContext";

function ClientLayout({ children }: { children: React.ReactNode }) {
  const [errors, setErrors] = useState<string[]>([]);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    EnvironmentHelper.initLocale();
    EnvironmentHelper.init();

    try {
      AnalyticsHelper.init();
    } catch (error) {
      console.warn('Analytics initialization failed:', error);
    }

    ErrorHelper.init(getErrorAppData, customErrorHandler);

    // Load HubSpot script after hydration to prevent hydration mismatch
    const script = document.createElement('script');
    script.type = 'text/javascript';
    script.id = 'hs-script-loader';
    script.async = true;
    script.defer = true;
    script.src = '//js.hs-scripts.com/20077299.js';
    document.body.appendChild(script);
  }, []);

  useEffect(() => {
    if (isClient) {
      try {
        AnalyticsHelper.logPageView();
      } catch (error) {
        console.warn('Analytics page view logging failed:', error);
      }
    }
  }, [isClient]);

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
    switch (error.errorType) {
    case "401":
      setErrors(["Access denied when loading " + error.message]);
      break;
    case "500":
      setErrors(["Server error when loading " + error.message]);
      break;
    }
  };

  const mdTheme = createTheme({
    palette: {
      secondary: {
        main: "#444444"
      }
    },
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
