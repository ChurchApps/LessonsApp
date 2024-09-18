"use client";

import React, { Suspense } from "react";

import { UserProvider } from "@/UserContext";
import { PersonInner } from "./components/PersonInner";
import { Metadata } from "next";
import { MetaHelper } from "@/utils/MetaHelper";


export async function generateMetadata(): Promise<Metadata> {
  return MetaHelper.getMetaData();
}

export default function PersonPage() {
  return <UserProvider><Suspense><PersonInner /></Suspense></UserProvider>
}
