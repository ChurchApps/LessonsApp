"use client";

import { redirect } from "next/navigation";
import { useRouter } from "next/navigation";
import React, { useState, useEffect } from "react";
import { List, ThemeProvider } from "@mui/material";
import { NavItem, ApiHelper } from "@churchapps/apphelper";
import "@churchapps/apphelper-markdown/dist/components/markdownEditor/editor.css";
import { useUser } from "@/app/context/UserContext";
import { Permissions, UserHelper } from "@/helpers";
import { Themes } from "@/helpers/Themes";
import { PortalHeader } from "./PortalHeader";

interface Props {
  pageTitle?: string;
  children: React.ReactNode;
}

export const Wrapper: React.FC<Props> = props => {
  const context = useUser();
  const [tabs, setTabs] = useState<React.ReactElement[]>([]);
  const [isClient, setIsClient] = useState(false);

  const router = useRouter();

  useEffect(() => {
    setIsClient(true);
  }, []);

  // Protect portal routes - redirect to login if not authenticated
  useEffect(() => {
    if (isClient && typeof window !== "undefined") {
      const path = window.location.pathname;
      const isPortalRoute = path.startsWith("/portal") || path.startsWith("/admin");

      if (isPortalRoute && !ApiHelper.isAuthenticated) {
        const returnUrl = encodeURIComponent(path);
        router.push(`/login?returnUrl=${returnUrl}`);
      }
    }
  }, [isClient, router]);

  const getSelectedTab = () => {
    let result = "";
    if (typeof window !== "undefined") {
      const path = window.location.pathname;
      if (path.startsWith("/admin")) result = "admin";
      else if (path.startsWith("/portal/thirdParty")) result = "external";
      else if (path.startsWith("/portal")) result = "cp";
    }
    return result;
  };

  const selectedTab = getSelectedTab();
  //const dummyRouter = {}
  const handleNavigate = (url: string) => {
    router.push(url);
  };

  useEffect(() => {
    if (!isClient) return;

    const newTabs: React.ReactElement[] = [];

    newTabs.push(<NavItem
      url="/"
      label="Home"
      icon="home"
      onNavigate={handleNavigate}
      onClick={() => {
        redirect("/");
      }}
      key="home"
    />);

    if (UserHelper.checkAccess?.(Permissions.lessonsApi.lessons.edit)) {
      newTabs.push(<NavItem
        url="/admin"
        label="Admin"
        icon="admin_panel_settings"
        onNavigate={handleNavigate}
        onClick={() => {
          router.push("/admin");
        }}
        selected={selectedTab === "admin"}
        key="admin"
      />);
    }

    if (UserHelper.checkAccess?.(Permissions.lessonsApi.lessons.editSchedules)) {
      newTabs.push(<NavItem
        url="/portal"
        label="Schedules"
        icon="calendar_month"
        onNavigate={handleNavigate}
        onClick={() => {
          router.push("/portal");
        }}
        selected={selectedTab === "cp"}
        key="cp"
      />);
    }

    if (UserHelper.checkAccess?.(Permissions.lessonsApi.lessons.editSchedules)) {
      newTabs.push(<NavItem
        url="/portal/thirdParty"
        label="External Providers"
        icon="groups"
        onNavigate={handleNavigate}
        onClick={() => {
          console.log("THIRD PARTY");
          router.push("/portal/thirdParty");
        }}
        selected={selectedTab === "external"}
        key="external"
      />);
    }

    setTabs(newTabs);
  }, [isClient, selectedTab]);

  const navContent = (
    <>
      <List component="nav" sx={Themes.NavBarStyle}>
        {tabs}
      </List>
    </>
  );

  console.log("CONTEXT IS", context);
  /*
  <Box sx={{ display: "flex", backgroundColor: "#EEE" }}>
      <SiteWrapper navContent={navContent} context={context} appName="Lessons.church" router={router}>{props.children}</SiteWrapper>
    </Box>*/

  return (
    <ThemeProvider theme={Themes.BaseTheme}>
      <PortalHeader />

      <div style={{ width: "100%" }}>
        {props.children}
      </div>
    </ThemeProvider>
  );
};
