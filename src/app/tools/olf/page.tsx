"use client";

import dynamic from "next/dynamic";
import { Suspense } from "react";
import { Wrapper } from "@/components/Wrapper";

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
