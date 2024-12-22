"use client";

import React from "react";
import { List, ThemeProvider } from "@mui/material";
import { NavItem } from "@churchapps/apphelper";
import { UserHelper, Permissions } from "@/utils";
import { useUser } from "@/app/context/UserContext";
import { redirect } from "next/navigation";
import { useRouter } from "next/navigation";
import "@churchapps/apphelper/dist/components/markdownEditor/editor.css";
import { Themes } from "@/utils/Themes";
import { PortalHeader } from "./PortalHeader";

interface Props { pageTitle?: string, children: React.ReactNode }



export const Wrapper: React.FC<Props> = props => {
  const context = useUser();
  const tabs = []

  const router = useRouter();

  const getSelectedTab = () => {
    let result = "";
    if (typeof window !== "undefined") {
      const path = window.location.pathname;
      if (path.startsWith("/admin")) result = "admin";
      else if (path.startsWith("/portal/thirdParty")) result = "external";
      else if (path.startsWith("/portal")) result = "cp";
    }
    return result;
  }

  const selectedTab = getSelectedTab();
  //const dummyRouter = {}
  const handleNavigate = (url: string) => { router.push(url) }

  tabs.push(<NavItem url="/" label="Home" icon="home" onNavigate={handleNavigate} onClick={() => { redirect("/") }} />);
  if (UserHelper.checkAccess(Permissions.lessonsApi.lessons.edit)) tabs.push(<NavItem url="/admin" label="Admin" icon="admin_panel_settings" onNavigate={handleNavigate} onClick={() => { router.push("/admin") }} selected={selectedTab === "admin"} key="admin" />);
  if (UserHelper.checkAccess(Permissions.lessonsApi.lessons.editSchedules)) tabs.push(<NavItem url="/portal" label="Schedules" icon="calendar_month" onNavigate={handleNavigate} onClick={() => { router.push("/portal") }} selected={selectedTab === "cp"} key="cp" />);
  if (UserHelper.checkAccess(Permissions.lessonsApi.lessons.editSchedules)) tabs.push(<NavItem url="/portal/thirdParty" label="External Providers" icon="groups" onNavigate={handleNavigate} onClick={() => { console.log("THIRD PARTY"); router.push("/portal/thirdParty") }} selected={selectedTab === "external"} key="external" />);

  const navContent = <><List component="nav" sx={Themes.NavBarStyle}>{tabs}</List></>

  console.log("CONTEXT IS", context)
  /*
  <Box sx={{ display: "flex", backgroundColor: "#EEE" }}>
      <SiteWrapper navContent={navContent} context={context} appName="Lessons.church" router={router}>{props.children}</SiteWrapper>
    </Box>*/

  return <ThemeProvider theme={Themes.BaseTheme}>
    <PortalHeader />

    <div style={{width:"100%"}}>
      <div id="appBarSpacer"></div>
      {props.children}
    </div>
  </ThemeProvider>

};
