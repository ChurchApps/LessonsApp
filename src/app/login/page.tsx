"use client";

import { useRouter, useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import { useCookies } from "react-cookie";
import { ApiHelper, UserHelper } from "@churchapps/apphelper";
import { LoginPage } from "@churchapps/apphelper-login";
import { Layout } from "@/components";
import { useUser } from "../context/UserContext";

export default function Login() {
  const [cookies] = useCookies();
  const router = useRouter();
  const searchParams = useSearchParams();
  const context = useUser();

  const returnUrl = searchParams.get("returnUrl") || "/portal";

  const handleRedirect = (url: string) => {
    console.log("Redirecting to:", url);
    // The LoginPage component will have already set up UserHelper values
    // We just need to update our context
    context.setUser(UserHelper.user);
    context.setPerson(UserHelper.person);
    context.setUserChurch(UserHelper.currentUserChurch);
    context.setUserChurches(UserHelper.userChurches);
    
    router.push(url);
  };

  // Get JWT from search params or cookies, similar to B1App
  const jwt = searchParams.get("jwt") || cookies.jwt || "";
  const auth = searchParams.get("auth") || "";

  console.log("JWT IS", jwt);
  console.log("Return Url is", returnUrl);

  return (
    <Layout withoutNavbar withoutFooter>
      <LoginPage
        auth={auth}
        context={context}
        jwt={jwt}
        appName="Lessons.church"
        appUrl={typeof window !== "undefined" ? window.location.href : ""}
        returnUrl={returnUrl}
        handleRedirect={handleRedirect}
      />
    </Layout>
  );
}