import { useRouter } from "next/router"
import { useCookies } from "react-cookie"
import { Layout } from "@/components";
import { LoginPage, ApiHelper, UserHelper } from "@churchapps/apphelper";
import React from "react";
import UserContext from "@/UserContext";

export default function Login() {
  const router = useRouter()
  const [cookies] = useCookies()

  if (ApiHelper.isAuthenticated && UserHelper.currentUserChurch) { router.push("/portal") }

  /*
  const loginSuccess = () => {
    router.push("/portal");
  }*/

  const appUrl = (process.browser) ? window.location.href : "";
  let jwt: string = "", auth: string = "";
  if (!ApiHelper.isAuthenticated) {
    auth = router.query.auth as string
    let search = new URLSearchParams(process.browser ? window.location.search : "");
    jwt = search.get("jwt") || cookies.jwt
  }

  const context = React.useContext(UserContext);

  return (
    <Layout withoutNavbar withoutFooter>
      <LoginPage auth={auth} context={context} jwt={jwt} appName="Lessons.church" appUrl={appUrl} returnUrl="/portal" />
    </Layout>
  );

}
