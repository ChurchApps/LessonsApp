"use client";

import { Header } from "@/components/Header";

type Props = {
  position?: "fixed" | "sticky" | "static" | "relative" | "absolute";
};

export function HeaderWrapper(props: Props) {
  return <Header position={props.position} />
}
