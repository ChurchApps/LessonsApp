import React from "react";
import { useCookies } from "react-cookie"
import "./Login.css"
import { ApiHelper } from "../helpers";
import { UserContextInterface } from "../interfaces";

interface Props { context: UserContextInterface, }

export const LogoutPage: React.FC<Props> = (props) => {
  const [, , removeCookie] = useCookies(["jwt", "email", "name"]);

  removeCookie("jwt");
  removeCookie("email");
  removeCookie("name");

  ApiHelper.clearPermissions();
  props.context.setUserName("");
  setTimeout(() => { window.location.href = "/"; }, 300);
  return null;
}
