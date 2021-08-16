import { ChurchInterface } from "@/utils";

export interface IChurch {
  selectedChurch: ChurchInterface;
  churches: ChurchInterface[];
  performFirstSelection: boolean;

  setChurches: (churches: ChurchInterface[]) => void;
  selectChurch: (churchId?: string, keyName?: string) => void;
  checkAccess: () => void;
}
