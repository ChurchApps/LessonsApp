"use client";

import { redirect, useRouter } from "next/navigation";
import React from "react";
import { useCookies } from "react-cookie";
import { ApiHelper, LoginPage, UserHelper } from "@churchapps/apphelper";
import { Layout } from "@/components";
import { useUser } from "../context/UserContext";

export default function Login(params: any) {
  const [cookies] = useCookies();
  const router = useRouter();

  const returnUrl = params.searchParams.returnUrl ? params.searchParams.returnUrl.toString() : "/portal";

  const context = useUser();

  console.log("CONTExT IS", context);
  console.log("Params are", params.searchParams);
  console.log("Return Url is", returnUrl);

  if (ApiHelper.isAuthenticated && UserHelper.currentUserChurch) {
    //context2.setPerson(UserHelper.person);
    //context2.setUserChurch(UserHelper.currentUserChurch);

    redirect(returnUrl);
  }

  const handleRedirect = (url: string) => {
    router.push(url);
  };

  const appUrl = process.browser ? window.location.href : "";
  let jwt: string = "",
    auth: string = "";
  if (!ApiHelper.isAuthenticated) {
    auth = params.searchParams.auth as string;
    jwt = params.searchParams.jwt || cookies.jwt;
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
