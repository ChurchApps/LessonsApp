"use client";

import { useState } from "react";
import { Alert, PaperProps } from "@mui/material";
import type { LoginUserChurchInterface, PersonInterface, UserInterface } from "@churchapps/helpers";
import { Layout } from "@/components";
import { LoginPage } from "@churchapps/apphelper/login";
import { UserHelper } from "@churchapps/apphelper";
import { useRouter, useSearchParams } from "next/navigation";
import { useUser } from "@/app/context/UserContext";

// Paths like "/\evil.com" start with "/" but resolve off-site; keep redirects on this origin.
const sameOriginPath = (url: string) => {
  try {
    const u = new URL(url, window.location.origin);
    return u.origin === window.location.origin ? u.pathname + u.search + u.hash : "/portal";
  } catch {
    return "/portal";
  }
};

interface Props {
  showLogo?: boolean;
  redirectAfterLogin?: string;
  loginContainerCssProps?: PaperProps;
  keyName?: string;
}

export function LoginClient({ showLogo, redirectAfterLogin, loginContainerCssProps, keyName }: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const context = useUser();
  // Read cookies synchronously on first client render so the jwt is available
  // before LoginPage's init() runs — otherwise auto-login from an existing
  // session cookie misses its window. SSR returns an empty object.
  const [cookies] = useState<Record<string, string>>(() => {
    if (typeof document === "undefined") return {};
    const cookieObj: Record<string, string> = {};
    document.cookie.split(";").forEach(cookie => {
      const [key, value] = cookie.trim().split("=");
      if (key && value) { cookieObj[key] = value; }
    });
    return cookieObj;
  });

  if (!context) return null;

  const handleRedirect = (
    url: string,
    user?: UserInterface,
    person?: PersonInterface,
    currentUserChurch?: LoginUserChurchInterface,
    userChurches?: LoginUserChurchInterface[]
  ) => {
    UserHelper.user = user as UserInterface;
    UserHelper.person = person as PersonInterface;
    UserHelper.currentUserChurch = currentUserChurch as LoginUserChurchInterface;
    UserHelper.userChurches = userChurches || [];

    context.setUser(user as UserInterface);
    context.setPerson(person as PersonInterface);
    context.setUserChurch(currentUserChurch as LoginUserChurchInterface);
    context.setUserChurches(userChurches || []);

    router.replace(sameOriginPath(url));
  };

  const jwt = searchParams.get("jwt") || cookies.jwt;

  return (
    <Layout withoutNavbar withoutFooter>
      {process.env.NEXT_PUBLIC_STAGE === "demo" && (<Alert severity="error" style={{ marginTop: 0 }}>
        <b>Demo:</b> This is the demo environment.  All data is erased nightly.<br />
        You can log into a test church with the credentials demo@lessons.church / password .
      </Alert>)}
      <LoginPage
        auth={searchParams.get("auth") || ""}
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
