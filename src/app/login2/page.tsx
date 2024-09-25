"use client"

import { useCookies } from "react-cookie"
import { Layout } from "@/components";
import { LoginPage, ApiHelper, UserHelper } from "@churchapps/apphelper";
import React from "react";
import UserContext from "@/UserContext";
import { redirect } from "next/navigation";
import { EnvironmentHelper } from "@/utils";
import { useUser } from "../context/UserContext";

export default function Login(params: any) {
  const [cookies] = useCookies()

  const returnUrl= (params.searchParams.returnUrl) ? params.searchParams.returnUrl.toString() : "/portal";

  const context2 = useUser();
  console.log("CONTExT 2 IS", context2)
  console.log("Params are", params.searchParams)
  console.log("Return Url is", returnUrl)

  if (ApiHelper.isAuthenticated && UserHelper.currentUserChurch) {
    //context2.setPerson(UserHelper.person);
    //context2.setUserChurch(UserHelper.currentUserChurch);

    redirect(returnUrl)
  }


  /*
  const loginSuccess = () => {
    router.push("/portal");
  }*/

  const appUrl = (process.browser) ? window.location.href : "";
  let jwt: string = "", auth: string = "";
  if (!ApiHelper.isAuthenticated) {
    auth = params.auth as string
    let search = new URLSearchParams(process.browser ? window.location.search : "");
    jwt = search.get("jwt") || cookies.jwt
  }

  EnvironmentHelper.init();

  const context = React.useContext(UserContext);

  return (
    <Layout withoutNavbar withoutFooter>
      <LoginPage auth={auth} context={context2} jwt={jwt} appName="Lessons.church" appUrl={appUrl} returnUrl={returnUrl} />
    </Layout>
  );

}
