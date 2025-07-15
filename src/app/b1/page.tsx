"use client";

import React from "react";
import { ApiHelper } from "@churchapps/apphelper/dist/helpers/ApiHelper";
import { useUser } from "@/app/context/UserContext";

export default function Test() {
  const userData = useUser();

  return (
    <>
      <h1>Test Page</h1>
      <p>Context: {JSON.stringify(userData)}</p>
      <p>Authenticated: {ApiHelper.isAuthenticated}</p>
    </>
  );
}
