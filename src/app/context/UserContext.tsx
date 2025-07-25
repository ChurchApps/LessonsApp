"use client";

import React, { useContext } from "react";
import { LoginUserChurchInterface,
  PersonInterface,
  UserContextInterface,
  UserInterface } from "@churchapps/apphelper";

const UserContext = React.createContext<UserContextInterface | undefined>(undefined);

interface Props {
  children: React.ReactNode;
}

export const UserProvider = ({ children }: Props) => {
  const [user, setUser] = React.useState<UserInterface>(null);
  const [person, setPerson] = React.useState<PersonInterface>(null);

  const [userChurch, setUserChurch] = React.useState<LoginUserChurchInterface>(null);
  const [userChurches, setUserChurches] = React.useState<LoginUserChurchInterface[]>(null);

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
