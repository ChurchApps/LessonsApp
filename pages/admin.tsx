import { useEffect } from "react";
import { useRouter } from "next/router";
import { Layout } from "@/components";
import { useAuth } from "@/hooks/useAuth";
import { useChurch } from "@/hooks/useChurch";

export default function Admin() {
  const router = useRouter();
  const { loggedIn } = useAuth();

  useEffect(() => {
    if (!loggedIn) {
      // TODO - figure out why this works for xd site
      router.push("/login");
    }
  }, []);

  console.log("On Admin Page!!");

  return (
    <Layout>
      <h1>This is admin page and its protected route.</h1>
    </Layout>
  );
}
