"use client";
import { useUser } from '@/app/context/UserContext';

import { ApiHelper } from "@churchapps/apphelper/dist/helpers/ApiHelper";
import React from "react";



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
