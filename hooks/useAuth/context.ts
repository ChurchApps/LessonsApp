import * as React from "react";

import { IAuth } from "./types";

export const initialAuthData: IAuth = {
  loading: false,
  loggedIn: false,
  isRelogin: false,
  error: null,
  user: null,

  login: () => Promise.resolve(),
  logout: () => {},
};

export const AuthContext = React.createContext<IAuth>(initialAuthData);
