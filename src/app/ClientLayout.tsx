"use client";

import React, { useEffect } from "react";
import { CookiesProvider } from "react-cookie";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import { AnalyticsHelper, ErrorLogInterface, UserHelper, ErrorHelper, ErrorMessages } from "@churchapps/apphelper";
import { ErrorAppDataInterface } from "@churchapps/helpers";
import { ErrorBoundary } from "@/components";
import { EnvironmentHelper } from "@/helpers/EnvironmentHelper";
import { UserProvider } from "./context/UserContext";

EnvironmentHelper.initLocale();
EnvironmentHelper.init();

function ClientLayout({ children }: { children: React.ReactNode }) {
  const [errors, setErrors] = React.useState([]);
  const [localeInit, setLocaleInit] = React.useState(false);
  const location = typeof window === "undefined" ? null : window.location;

  useEffect(() => {
    EnvironmentHelper.initLocale().then(() => setLocaleInit(true));
    EnvironmentHelper.init();
    AnalyticsHelper.init();
  }, []);

  useEffect(() => {
    AnalyticsHelper.logPageView();
  }, [location]);

  const getErrorAppData = () => {
    const result: ErrorAppDataInterface = {
      churchId: UserHelper.currentUserChurch?.church?.id || "",
      userId: UserHelper.user?.id || "",
      originUrl: location?.toString(),
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

  AnalyticsHelper.init();
  ErrorHelper.init(getErrorAppData, customErrorHandler);
  React.useEffect(() => {
    AnalyticsHelper.logPageView();
  }, [location]);

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
