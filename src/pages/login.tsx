import { useRouter } from "next/router"
import { Layout } from "@/components";
import { ChurchInterface, UserHelper, GoogleAnalyticsHelper, EnvironmentHelper, UserInterface } from "@/utils";
import { useAuth } from "@/hooks/useAuth";
import { LoginPage } from "@/appBase/pageComponents/LoginPage";
import { ApiHelper } from "@/appBase/helpers"

export default function Login() {
  const { login, loggedIn } = useAuth();
  const router = useRouter()

  if (loggedIn) {
    router.push("/")
    //router.push("/admin") //temporary while coming soon page is up.
  }

  const loginSuccess = () => {
    login(UserHelper.user);
  }

  const postChurchRegister = async (church: ChurchInterface) => {
    await ApiHelper.post("/churchApps/register", { appName: "Lessons" }, "AccessApi");
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

  return (
    <Layout withoutNavbar withoutFooter>
      <LoginPage auth={null} context={null} jwt={null} appName="Lessons.church" loginSuccessOverride={loginSuccess} churchRegisteredCallback={postChurchRegister} appUrl={appUrl} userRegisteredCallback={trackUserRegister} />
    </Layout>
  );
}
