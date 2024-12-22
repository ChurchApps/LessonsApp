"use client";

import { Locale, SiteHeader } from "@churchapps/apphelper";
import UserContext from "@/app/context/UserContext";
import React from "react";
import { SecondaryMenuHelper } from "@/utils/SecondaryMenuHelper";
import { useRouter } from "next/navigation";

type Props = {
  position?: "fixed" | "sticky" | "static" | "relative" | "absolute";
};

export function PortalHeader(props: Props) {
  const context = React.useContext(UserContext);
  const router = useRouter();

  const getPrimaryMenu = () => {
    const menuItems:{ url: string, icon:string, label: string }[] = []
    menuItems.push({url: "/", icon:"home", label: Locale.label("components.wrapper.dash")});
    menuItems.push({url: "/people", icon:"person", label: Locale.label("components.wrapper.ppl")});

    // if (UserHelper.checkAccess(Permissions.membershipApi.server.admin)) tabs.push(<NavItem key="/admin" url="/admin" label={Locale.label("components.wrapper.servAdmin")} icon="admin_panel_settings" selected={selectedTab === "admin"} />);
    return menuItems;
  }
  /*
  const getSecondaryMenu = () => {
    const menuItems:{ url: string, label: string }[] = []
    menuItems.push({url: "/groups", label: Locale.label("components.wrapper.groups")});
    menuItems.push({url: "/people", label: Locale.label("components.wrapper.ppl")});
    if (UserHelper.checkAccess(Permissions.attendanceApi.attendance.viewSummary)) menuItems.push({url:"/attendance", label: Locale.label("components.wrapper.att")});
    return menuItems;
  }*/

  const getPrimaryLabel = () => {
    const path = window.location.pathname;
    let result = "Schedules";
    if (path.startsWith("/portal") || path.startsWith("/portal/thirdParty")) result = "Schedules";
    return result;
  }

  const secondaryMenu = SecondaryMenuHelper.getSecondaryMenu(window.location.pathname, {});

  const handleNavigate = (url: string) => {
    router.push(url);
  }

  /*<Typography variant="h6" noWrap>{UserHelper.currentUserChurch?.church?.name || ""}</Typography>*/
  return (<SiteHeader primaryMenuItems={getPrimaryMenu()} primaryMenuLabel={getPrimaryLabel()} secondaryMenuItems={secondaryMenu.menuItems} secondaryMenuLabel={secondaryMenu.label} context={context} appName={"Lessons"} onNavigate={handleNavigate} /> );

}
