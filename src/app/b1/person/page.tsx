"use client";

import React, { Suspense } from "react";

import { PersonInner } from "./components/PersonInner";

export default function PersonPage() {
  return <Suspense><PersonInner /></Suspense>
}
