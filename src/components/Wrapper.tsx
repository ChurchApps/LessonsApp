import React from "react";
import UserContext from "../UserContext";
import { Box, CssBaseline, List, ThemeProvider } from "@mui/material";
import { SiteWrapper, NavItem, Themes } from "@churchapps/apphelper";
import { UserHelper, Permissions } from "@/utils";
import { useRouter } from "next/router"

interface Props { pageTitle?: string, children: React.ReactNode }

export const Wrapper: React.FC<Props> = props => {
  const context = React.useContext(UserContext);
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

  tabs.push(<NavItem url="/" label="Home" icon="home" router={router} />);
  if (UserHelper.checkAccess(Permissions.lessonsApi.lessons.edit)) tabs.push(<NavItem url="/admin" label="Admin" icon="admin_panel_settings" router={router} selected={selectedTab === "admin"} key="admin" />);
  if (UserHelper.checkAccess(Permissions.lessonsApi.lessons.editSchedules)) tabs.push(<NavItem url="/portal" label="Schedules" icon="calendar_month" router={router} selected={selectedTab === "cp"} key="cp" />);
  if (UserHelper.checkAccess(Permissions.lessonsApi.lessons.editSchedules)) tabs.push(<NavItem url="/portal/thirdParty" label="External Providers" icon="groups" router={router} selected={selectedTab === "external"} key="external" />);

  const navContent = <><List component="nav" sx={Themes.NavBarStyle}>{tabs}</List></>


  return <ThemeProvider theme={Themes.BaseTheme}>
    <CssBaseline />
    <Box sx={{ display: "flex", backgroundColor: "#EEE" }}>
      <SiteWrapper navContent={navContent} context={context} appName="Lessons.church" router={router}>{props.children}</SiteWrapper>
    </Box>
  </ThemeProvider>

};
