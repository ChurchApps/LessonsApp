"use client";

import { useEffect, useState } from "react";
import { Alert } from "@mui/material";
import { Layout } from "@/components";
import { LoginPage } from "@churchapps/apphelper-login";
import { UserHelper } from "@churchapps/apphelper";
import { useSearchParams } from "next/navigation";
import { redirect } from "next/navigation";
import { useUser } from "@/app/context/UserContext";

interface Props {
  showLogo?: boolean;
  redirectAfterLogin?: string;
  loginContainerCssProps?: any;
  keyName?: string;
}

export function LoginClient({ showLogo, redirectAfterLogin, loginContainerCssProps, keyName }: Props) {
  const searchParams = useSearchParams();
  const context = useUser();
  const [cookies, setCookies] = useState<any>({});

  useEffect(() => {
    // Get cookies manually to avoid react-cookie SSR issues
    const cookieString = document.cookie;
    const cookieObj: any = {};
    cookieString.split(';').forEach(cookie => {
      const [key, value] = cookie.trim().split('=');
      if (key && value) {
        cookieObj[key] = value;
      }
    });
    setCookies(cookieObj);
  }, []);

  const handleRedirect = (
    url: string,
    user: any,
    person: any,
    currentUserChurch: any,
    userChurches: any[]
  ) => {
    console.log("Redirecting to:", url);
    console.log("Auth data received:", { user, person, currentUserChurch, userChurches });

    // Update UserHelper values to ensure they're available immediately
    UserHelper.user = user;
    UserHelper.person = person;
    UserHelper.currentUserChurch = currentUserChurch;
    UserHelper.userChurches = userChurches;

    // Update context with values passed from LoginPage component
    context.setUser(user);
    context.setPerson(person);
    context.setUserChurch(currentUserChurch);
    context.setUserChurches(userChurches);

    redirect(url);
  };

  const jwt = searchParams.get("jwt") || cookies.jwt;

  return (
    <Layout withoutNavbar withoutFooter>
      {process.env.NEXT_PUBLIC_STAGE === "demo" && (<Alert severity="error" style={{ marginTop: 0 }}>
        <b>Demo:</b> This is the demo environment.  All data is erased nightly.<br />
        You can log into a test church with the credentials demo@lessons.church / password .
      </Alert>)}
      <LoginPage
        auth={searchParams.get("auth")}
        context={context}
        jwt={jwt}
        appName="Lessons.church"
        appUrl="https://lessons.church"
        showLogo={showLogo}
        loginContainerCssProps={loginContainerCssProps}
        keyName={keyName}
        returnUrl={searchParams.get("returnUrl") || redirectAfterLogin || "/portal"}
        handleRedirect={handleRedirect}
        defaultEmail={process.env.NEXT_PUBLIC_STAGE === "demo" ? "demo@lessons.church" : undefined}
        defaultPassword={process.env.NEXT_PUBLIC_STAGE === "demo" ? "password" : undefined}
        showFooter={true}
      />
    </Layout>
  );
}