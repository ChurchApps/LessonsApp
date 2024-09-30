"use client";

import { Wrapper } from "@/components/Wrapper";
import { Suspense } from "react";
import OllInner from "./components/OllInner";

export default function CP() {

  return (
    <Wrapper>
      <Suspense>
        <OllInner />
      </Suspense>
    </Wrapper>
  );
}

