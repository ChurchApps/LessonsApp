"use client";
import UserContext from "@/UserContext";
import { ApiHelper } from "@churchapps/apphelper/dist/helpers/ApiHelper";
import React from "react";



export default function Test() {

  const context = React.useContext(UserContext);

  return (
    <>
      <h1>Test Page</h1>
      <p>Context: {JSON.stringify(context)}</p>
      <p>Authenticated: {ApiHelper.isAuthenticated}</p>

    </>
  );
}
