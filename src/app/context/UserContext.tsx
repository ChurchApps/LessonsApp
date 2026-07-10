"use client";

import React, { useContext } from "react";
import {
  LoginUserChurchInterface,
  PersonInterface,
  UserContextInterface,
  UserInterface
} from "@churchapps/apphelper";

const UserContext = React.createContext<UserContextInterface | undefined>(undefined);

interface Props { children: React.ReactNode; }

export const UserProvider = ({ children }: Props) => {
  const [user, setUser] = React.useState<UserInterface>(null as unknown as UserInterface);
  const [person, setPerson] = React.useState<PersonInterface>(null as unknown as PersonInterface);

  const [userChurch, setUserChurch] = React.useState<LoginUserChurchInterface>(null as unknown as LoginUserChurchInterface);
  const [userChurches, setUserChurches] = React.useState<LoginUserChurchInterface[]>(null as unknown as LoginUserChurchInterface[]);

  return (
    <UserContext.Provider
      value={{
        user,
        setUser,
        userChurch,
        setUserChurch,
        userChurches,
        setUserChurches,
        person,
        setPerson
      }}>
      {children}{" "}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);
export default UserContext;
