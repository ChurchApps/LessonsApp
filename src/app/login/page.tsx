"use client";

import { useRouter, useSearchParams } from "next/navigation";
import React, { Suspense } from "react";
import { useCookies } from "react-cookie";
import { UserHelper } from "@churchapps/apphelper";
import { LoginPage } from "@churchapps/apphelper-login";
import { Layout } from "@/components";
import { useUser } from "../context/UserContext";

function LoginContent() {
  const [cookies] = useCookies();
  const router = useRouter();
  const searchParams = useSearchParams();
  const context = useUser();

  const returnUrl = searchParams.get("returnUrl") || "/portal";

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

    router.push(url);
  };

  // Get JWT from search params or cookies, similar to B1App
  const jwt = searchParams.get("jwt") || cookies.jwt || "";
  const auth = searchParams.get("auth") || "";

  console.log("JWT IS", jwt);
  console.log("Return Url is", returnUrl);

  return (
    <LoginPage
      auth={auth}
      context={context}
      jwt={jwt}
      appName="Lessons.church"
      appUrl={typeof window !== "undefined" ? window.location.href : ""}
      returnUrl={returnUrl}
      handleRedirect={handleRedirect}
    />
  );
}

export default function Login() {
  return (
    <Layout withoutNavbar withoutFooter>
      <Suspense fallback={<div>Loading...</div>}>
        <LoginContent />
      </Suspense>
    </Layout>
  );
}