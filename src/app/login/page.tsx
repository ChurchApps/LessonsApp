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
    if (isClient && ApiHelper.isAuthenticated && UserHelper.currentUserChurch) {
      context.setUser(UserHelper.user);
      context.setPerson(UserHelper.person);
      context.setUserChurch(UserHelper.currentUserChurch);
      context.setUserChurches(UserHelper.userChurches);

      router.push(returnUrl);
    }
  }, [isClient, returnUrl, context, router]);

  const handleRedirect = (url: string) => {
    router.push(url);
  };

  const appUrl = isClient ? window.location.href : "";
  let jwt: string = "",
    auth: string = "";
  if (isClient && !ApiHelper.isAuthenticated) {
    auth = searchParams.auth || "";
    jwt = searchParams.jwt || cookies.jwt || "";
  }
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
