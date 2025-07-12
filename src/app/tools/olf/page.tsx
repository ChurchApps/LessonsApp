"use client";

import { Wrapper } from "@/components/Wrapper";
import { Suspense } from "react";
import dynamic from "next/dynamic";

const OlfInner = dynamic(() => import("./components/OlfInner"), {
  loading: () => <div>Loading lesson builder...</div>
});

export default function CP() {

  return (
    <Wrapper>
      <Suspense>
        <OlfInner />
      </Suspense>
    </Wrapper>
  );
}

