"use client";

import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { useCookies } from "react-cookie";
import { ApiHelper, UserHelper } from "@churchapps/apphelper";
import { LoginPage } from "@churchapps/apphelper-login";
import { Layout } from "@/components";
import { useUser } from "../context/UserContext";

export default function Login() {
  const [cookies] = useCookies();
  const router = useRouter();
  const [searchParams, setSearchParams] = useState<{ [key: string]: string }>({});
  const [isClient, setIsClient] = useState(false);

  const context = useUser();

  // Extract search params on client side
  useEffect(() => {
    setIsClient(true);
    if (typeof window !== "undefined") {
      const urlParams = new URLSearchParams(window.location.search);
      const params: { [key: string]: string } = {};
      urlParams.forEach((value, key) => {
        params[key] = value;
      });
      setSearchParams(params);
    }
  }, []);

  const returnUrl = searchParams.returnUrl || "/portal";

  console.log("CONTExT IS", context);
  console.log("Search Params are", searchParams);
  console.log("Return Url is", returnUrl);

  useEffect(() => {
    // Don't auto-redirect if there's a JWT parameter, let LoginPage handle it
    const hasJwtParam = searchParams.jwt;
    if (isClient && !hasJwtParam && ApiHelper.isAuthenticated && UserHelper.currentUserChurch) {
      context.setUser(UserHelper.user);
      context.setPerson(UserHelper.person);
      context.setUserChurch(UserHelper.currentUserChurch);
      context.setUserChurches(UserHelper.userChurches);

      router.push(returnUrl);
    }
  }, [isClient, returnUrl, context, router, searchParams.jwt]);

  const handleRedirect = (
    url: string,
    user: any,
    person: any,
    currentUserChurch: any,
    userChurches: any[]
  ) => {
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

    console.log("Person is", person);
    router.push(url);
  };

  const appUrl = isClient ? window.location.href : "";
  // Always extract JWT and auth params, similar to B1App
  const auth = isClient ? (searchParams.auth || "") : "";
  const jwt = isClient ? (searchParams.jwt || cookies.jwt || "") : "";
  console.log("JWT IS", jwt);

  return (
    <Layout withoutNavbar withoutFooter>
      <LoginPage
        auth={auth}
        context={context}
        jwt={jwt}
        appName="Lessons.church"
        appUrl={appUrl}
        returnUrl={returnUrl}
        handleRedirect={handleRedirect}
      />
    </Layout>
  );
}
