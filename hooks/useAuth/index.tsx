import * as React from "react";
import { useRouter } from "next/router";
import { useCookies } from "react-cookie";
import { AuthContext, initialAuthData } from "./context";
import { useChurch } from "../useChurch";
import { IAuth } from "./types";
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

  React.useEffect(() => {
    if (cookies.jwt) {
      setState({ ...state, user: { email: cookies.email } });
      login({ jwt: cookies.jwt });
    }
  }, []);

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
      router.push("/admin");
    }
  }, [churches, performFirstSelection, selectedChurch]);

  const contextValue: IAuth = {
    ...state,
    login: async (data) => {
      console.log("login initiated");
      setState({ ...state, loading: true, error: null });
      return login(data)
        .then(({ user, churches }: LoginResponseInterface) => {
          setState({
            ...state,
            loggedIn: true,
            user: user,
            loading: false,
            error: null,
          });
          setChurches(churches);
        })
        .catch((error) => {
          setState({
            ...state,
            error,
            loading: false,
          });
        });
    },
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
