import * as React from "react";
import { useRouter } from "next/router";
import { useCookies } from "react-cookie";
import { AuthContext, initialAuthData } from "./context";
import { IAuth, LoginPayload } from "./types";
import { login } from "@/services/authService";
import {
  ApiHelper,
  LoginResponseInterface,
  UserHelper,
  ChurchInterface,
} from "@/utils";

export function useAuth() {
  const context = React.useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }

  return context;
}

type Props = {
  children: React.ReactNode;
};

const APP_NAME = "Lessons";

const protectedRoutes = ["/admin"];

export function AuthProvider({ children }: Props) {
  const [state, setState] = React.useState<IAuth>(initialAuthData);
  const [cookies, setCookie, removeCookie] = useCookies(["jwt", "email"]);
  const router = useRouter();

  // auto-login when user refreshes the page
  React.useEffect(() => {
    if (cookies.jwt) {
      const mutatedState = {
        user: {
          email: cookies.email,
        },
        isRelogin: true,
      };
      performLogin({ jwt: cookies.jwt }, mutatedState);
    }
  }, []);

  async function performLogin(data: LoginPayload, stateUpdates?: any) {
    try {
      setState({ ...state, loading: true, error: null, ...stateUpdates });
      const { user, churches }: LoginResponseInterface = await login(data);

      const lessonChurches: ChurchInterface[] = [];
      churches.forEach((church) => {
        if (church.apps.some((c) => c.appName === APP_NAME)) {
          lessonChurches.push(church);
        }
      });
      UserHelper.churches = lessonChurches;
      UserHelper.selectChurch();

      if (!UserHelper.currentChurch) {
        setState({
          ...state,
          error: "The provided login does not have access to this application.",
        });
        return;
      }

      setCookie("email", user.email, { path: "/" });
      UserHelper.currentChurch.apis.forEach((api) => {
        if (api.keyName === "AccessApi")
          setCookie("jwt", api.jwt, { path: "/" });
      });

      setState({
        ...state,
        user: user,
        loading: false,
        error: null,
        loggedIn: true,
        isRelogin: false,
      });

      // redirection for login / auto login on refresh
      const paths = ["login", "admin"];
      if (paths.some((p) => router.pathname.includes(p))) {
        router.push("/admin");
      }
    } catch (error) {
      setState({
        ...state,
        error,
        loading: false,
        isRelogin: false,
      });
    }
  }

  const contextValue: IAuth = {
    ...state,
    login: performLogin,
    logout: () => {
      removeCookie("jwt");
      removeCookie("email");

      ApiHelper.clearPermissions();

      if (protectedRoutes.includes(router.pathname)) {
        router.push("/");
      }
    },
  };

  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
}
