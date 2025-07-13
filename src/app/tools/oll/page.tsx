"use client";

import dynamic from "next/dynamic";
import { Suspense } from "react";
import { Wrapper } from "@/components/Wrapper";

const OllInner = dynamic(() => import("./components/OllInner"), {
  loading: () => <div>Loading lesson builder...</div>
});

export default function CP() {
  return (
    <Wrapper>
      <Suspense>
        <OllInner />
      </Suspense>
    </Wrapper>
  );
}
