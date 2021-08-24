import { useRouter } from "next/router"
import { Layout } from "@/components";
import { UserHelper } from "@/utils";
import { useAuth } from "@/hooks/useAuth";
import { LoginPage } from "@/appBase/pageComponents/LoginPage";

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

  return (
    <Layout withoutNavbar withoutFooter>
      <LoginPage auth={null} context={null} jwt={null} appName="Lessons.church" successCallback={loginSuccess} />
    </Layout>
  );
}
