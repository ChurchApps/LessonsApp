import * as React from "react";

import { IChurch } from "./types";

export const initialChurchData: IChurch = {
  selectedChurch: null,
  churches: null,
  performFirstSelection: false,

  setChurches: () => {},
  selectChurch: () => {},
  checkAccess: () => {},
};

export const ChurchContext = React.createContext<IChurch>(initialChurchData);
