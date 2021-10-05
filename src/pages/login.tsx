import { useRouter } from "next/router"
import { useCookies } from "react-cookie"
import { Layout } from "@/components";
import { ChurchInterface, GoogleAnalyticsHelper, EnvironmentHelper, UserInterface } from "@/utils";
import { LoginPage } from "@/appBase/pageComponents/LoginPage";
import { ApiHelper, UserHelper } from "@/appBase/helpers"

export default function Login() {
  const router = useRouter()
  const [cookies] = useCookies()

  if (ApiHelper.isAuthenticated && UserHelper.currentChurch) {
    router.push("/")
    //router.push("/admin") //temporary while coming soon page is up.
  }

  const loginSuccess = () => {
    console.log("login success callback...");
    router.push("/");
  }

  const postChurchRegister = async (church: ChurchInterface) => {
    if (EnvironmentHelper.GoogleAnalyticsTag !== "") {
      GoogleAnalyticsHelper.gaEvent({ category: "Church", action: "Register" })
    }
  }

  const trackUserRegister = async (user: UserInterface) => {
    if (EnvironmentHelper.GoogleAnalyticsTag !== "") {
      GoogleAnalyticsHelper.gaEvent({ category: "User", action: "Register" });
    }
  }

  const appUrl = (process.browser) ? window.location.href : "";
  let jwt: string = "", auth: string = "";
  if (!ApiHelper.isAuthenticated) {
    auth = router.query.auth as string
    let search = new URLSearchParams(process.browser ? window.location.search : "");
    jwt = search.get("jwt") || cookies.jwt
  }

  return (
    <Layout withoutNavbar withoutFooter>
      <LoginPage auth={auth} context={null} jwt={jwt} appName="Lessons.church" loginSuccessOverride={loginSuccess} churchRegisteredCallback={postChurchRegister} appUrl={appUrl} userRegisteredCallback={trackUserRegister} />
    </Layout>
  );
}
