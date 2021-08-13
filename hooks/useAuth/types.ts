import { UserInterface } from "@/utils";

export interface IAuth {
  loading: boolean;
  loggedIn: boolean;
  error: string;
  user: UserInterface;

  login: (data: UserInterface) => Promise<void>;
  logout: () => void;
}
