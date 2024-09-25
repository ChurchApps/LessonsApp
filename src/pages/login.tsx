import { useRouter } from "next/router"
import { useCookies } from "react-cookie"
import { Layout } from "@/components";
import { LoginPage, ApiHelper, UserHelper } from "@churchapps/apphelper";
import React from "react";
import UserContext from "@/UserContext";
import { useUser } from "@/app/context/UserContext";

export default function Login() {
  const router = useRouter()
  const [cookies] = useCookies()

  const returnUrl= (router.query.returnUrl) ? router.query.returnUrl.toString() : "/portal";

  //if (ApiHelper.isAuthenticated && UserHelper.currentUserChurch) { router.push(returnUrl) }

  const context2 = useUser();

  const loginSuccess = () => {
    console.log("CONTEXT2 is", context2)
    context2.setPerson(UserHelper.person);

    router.push(returnUrl);
  }

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
      <LoginPage auth={auth} context={context} jwt={jwt} appName="Lessons.church" appUrl={appUrl} returnUrl={returnUrl} loginSuccessOverride={loginSuccess} />
    </Layout>
  );

}
