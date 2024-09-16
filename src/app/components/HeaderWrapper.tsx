"use client";

import { UserProvider } from "@/UserContext";
import { Header } from "@/components/Header";

type Props = {
  position?: "fixed" | "sticky" | "static" | "relative" | "absolute";
};

export function HeaderWrapper(props: Props) {
  return <UserProvider>
    <Header position={props.position} />
  </UserProvider>
}
