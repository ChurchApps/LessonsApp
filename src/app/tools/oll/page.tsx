"use client";

import { Wrapper } from "@/components/Wrapper";
import { Suspense } from "react";
import dynamic from "next/dynamic";

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

