"use client";

import React from "react";
import { Box, CssBaseline, List, ThemeProvider } from "@mui/material";
import { SiteWrapper, NavItem, Themes } from "@churchapps/apphelper";
import { UserHelper, Permissions } from "@/utils";
import { useUser } from "@/app/context/UserContext";
import { redirect } from "next/navigation";
import { useRouter } from "next/navigation";

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
  const dummyRouter = {}

  tabs.push(<NavItem url="/" label="Home" icon="home" router={dummyRouter} onClick={() => { redirect("/") }} />);
  if (UserHelper.checkAccess(Permissions.lessonsApi.lessons.edit)) tabs.push(<NavItem url="/admin" label="Admin" icon="admin_panel_settings" router={dummyRouter} onClick={() => { redirect("/admin") }} selected={selectedTab === "admin"} key="admin" />);
  if (UserHelper.checkAccess(Permissions.lessonsApi.lessons.editSchedules)) tabs.push(<NavItem url="/portal" label="Schedules" icon="calendar_month" router={dummyRouter}  onClick={() => { redirect("/portal") }} selected={selectedTab === "cp"} key="cp" />);
  if (UserHelper.checkAccess(Permissions.lessonsApi.lessons.editSchedules)) tabs.push(<NavItem url="/portal/thirdParty" label="External Providers" icon="groups" router={dummyRouter} onClick={() => { console.log("THIRD PARTY"); router.push("/portal/thirdParty") }} selected={selectedTab === "external"} key="external" />);

  const navContent = <><List component="nav" sx={Themes.NavBarStyle}>{tabs}</List></>

  console.log("CONTEXT IS", context)

  return <ThemeProvider theme={Themes.BaseTheme}>
    <CssBaseline />
    <Box sx={{ display: "flex", backgroundColor: "#EEE" }}>
      <SiteWrapper navContent={navContent} context={context} appName="Lessons.church" router={dummyRouter}>{props.children}</SiteWrapper>
    </Box>
  </ThemeProvider>

};
