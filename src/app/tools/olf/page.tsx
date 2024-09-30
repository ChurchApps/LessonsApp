"use client";

import { Wrapper } from "@/components/Wrapper";
import { Suspense } from "react";
import OlfInner from "./components/OlfInner";

export default function CP() {

  return (
    <Wrapper>
      <Suspense>
        <OlfInner />
      </Suspense>
    </Wrapper>
  );
}

