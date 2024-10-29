"use client"

import { AnalyticsHelper, UserHelper, ErrrorAppDataInterface, ErrorLogInterface } from "@churchapps/apphelper";
import React, { useEffect } from "react";
import { ErrorHelper } from "@churchapps/apphelper";
import { ErrorMessages } from "@churchapps/apphelper";
import { UserProvider } from "./context/UserContext";
import { EnvironmentHelper } from "@/utils/EnvironmentHelper";


EnvironmentHelper.initLocale();
EnvironmentHelper.init();

function ClientLayout({ children}: {children: React.ReactNode}) {
  const [errors, setErrors] = React.useState([]);
  const [localeInit, setLocaleInit] = React.useState(false);
  const location = (typeof(window) === "undefined") ? null : window.location;



  useEffect(()=>{
    EnvironmentHelper.initLocale().then(() => setLocaleInit(true));
    EnvironmentHelper.init();
    AnalyticsHelper.init();
  },[])

  useEffect(() => { AnalyticsHelper.logPageView() }, [location]);


  const getErrorAppData = () => {
    const result: ErrrorAppDataInterface = {
      churchId: UserHelper.currentUserChurch?.church?.id || "",
      userId: UserHelper.user?.id || "",
      originUrl: location?.toString(),
      application: "B1"
    }
    return result;
  }

  const customErrorHandler = (error: ErrorLogInterface) => {
    switch (error.errorType) {
      case "401": setErrors(["Access denied when loading " + error.message]); break;
      case "500": setErrors(["Server error when loading " + error.message]); break;
    }
  }

  AnalyticsHelper.init();
  ErrorHelper.init(getErrorAppData, customErrorHandler);
  React.useEffect(() => { AnalyticsHelper.logPageView() }, [location]);

  return (
    <UserProvider>
      <ErrorMessages errors={errors} />
      <>{children}</>
    </UserProvider>
  );
}
export default ClientLayout;
