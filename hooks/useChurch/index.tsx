import * as React from "react";
import { useCookies } from "react-cookie";
import { ChurchContext, initialChurchData } from "./context";
import { AuthContext } from "../useAuth/context";
import { IChurch } from "./types";
import { ChurchInterface } from "@/utils";

export function useChurch() {
  const churchContext = React.useContext(ChurchContext);
  const authContext = React.useContext(AuthContext);

  if (!authContext) {
    throw new Error("useChurch must be used within AuthProvider");
  }

  if (!churchContext) {
    throw new Error("useChurch must be used within ChurchProvider");
  }

  return churchContext;
}

type Props = {
  children: React.ReactNode;
};

const APP_NAME = "Lessons";

export function ChurchProvider({ children }: Props) {
  const [state, setState] = React.useState<IChurch>(initialChurchData);
  const [_, setCookie] = useCookies(["jwt"]);

  // perform automatic church selection on login
  React.useEffect(() => {
    if (state.churches?.length > 0) {
      selectChurch();
    }
  }, [state.churches]);

  function selectChurch(churchId?: string, keyName?: string) {
    const churchesCopy = [...state.churches];
    let church = churchesCopy.filter(
      (c) => c.id === churchId || c.subDomain === keyName
    )[0];

    if (!church) {
      church = state.churches[0];
    }
    church.apis.forEach((api) => {
      if (api.keyName === "AccessApi") setCookie("jwt", api.jwt, { path: "/" });
    });

    setState({ ...state, selectedChurch: church });
  }

  const contextValue: IChurch = {
    ...state,
    setChurches: (churches) => {
      let lessonChurches: ChurchInterface[] = [];
      churches.forEach((church) => {
        if (church.apps.some((c) => c.appName === APP_NAME)) {
          lessonChurches.push(church);
        }
      });

      setState({
        ...state,
        churches: lessonChurches,
        performFirstSelection: true,
      });
    },
    selectChurch,
  };

  return (
    <ChurchContext.Provider value={contextValue}>
      {children}
    </ChurchContext.Provider>
  );
}
