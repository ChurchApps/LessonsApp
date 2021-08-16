import { UserInterface } from "@/utils";

export type LoginPayload =
  | UserInterface
  | { jwt: string }
  | { authGuid: string };

export interface IAuth {
  loading: boolean;
  loggedIn: boolean;
  isRelogin: boolean;
  error: string;
  user: UserInterface;

  login: (data: LoginPayload) => Promise<void>;
  logout: () => void;
}
