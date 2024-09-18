"use client";

import React, { Suspense } from "react";

import { UserProvider } from "@/UserContext";
import { PersonInner } from "./components/PersonInner";


export default function PersonPage() {
  return <UserProvider><Suspense><PersonInner /></Suspense></UserProvider>
}
