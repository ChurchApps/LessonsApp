import * as React from "react";
import { useRouter } from "next/router";
import { useCookies } from "react-cookie";
import { AuthContext, initialAuthData } from "./context";
import { useChurch } from "../useChurch";
import { IAuth, LoginPayload } from "./types";
import { login } from "@/services/authService";
import { ApiHelper, LoginResponseInterface } from "@/utils";

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

const protectedRoutes = ["/admin"];

export function AuthProvider({ children }: Props) {
  const [state, setState] = React.useState<IAuth>(initialAuthData);
  const [cookies, setCookies, removeCookie] = useCookies(["jwt", "email"]);
  const router = useRouter();
  const { setChurches, churches, performFirstSelection, selectedChurch } =
    useChurch();

  // auto-login when user refreshes the page
  React.useEffect(() => {
    if (cookies.jwt) {
      setState({ ...state, user: { email: cookies.email } });
      performLogin({ jwt: cookies.jwt });
    }
  }, []);

  // check if the user has access to the app
  React.useEffect(() => {
    if (performFirstSelection && churches?.length === 0) {
      setState({
        ...state,
        error: "The provided login does not have access to this application.",
      });
      return;
    }
    if (selectedChurch) {
      setCookies("email", `${state.user?.email}`, { path: "/" });
      setState({ ...state, loggedIn: true });
      router.push("/admin");
    }
  }, [churches, performFirstSelection, selectedChurch]);

  async function performLogin(data: LoginPayload) {
    try {
      setState({ ...state, loading: true, error: null });
      const { user, churches }: LoginResponseInterface = await login(data);
      setState({
        ...state,
        user: user,
        loading: false,
        error: null,
      });
      setChurches(churches);
    } catch (error) {
      setState({
        ...state,
        error,
        loading: false,
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
