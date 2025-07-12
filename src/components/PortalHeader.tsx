"use client";

import { SiteHeader } from "@churchapps/apphelper";
import UserContext from "@/app/context/UserContext";
import React, { useEffect } from "react";
import { SecondaryMenuHelper } from "@/helpers/SecondaryMenuHelper";
import { useRouter } from "next/navigation";
import { UserHelper, Permissions } from "@/helpers";
import { usePathname } from 'next/navigation'

interface Props {
  position?: "fixed" | "sticky" | "static" | "relative" | "absolute";
}

export function PortalHeader(props: Props) {
  const context = React.useContext(UserContext);
  const router = useRouter();
  const [secondaryMenu, setSecondaryMenu] = React.useState({menuItems:[], label:""});
  const pathname = usePathname();

  const getPrimaryMenu = () => {
    const menuItems:{ url: string, icon:string, label: string }[] = []
    menuItems.push({url: "/", icon:"home", label: "Home" });
    menuItems.push({url: "/portal", icon:"calendar_month", label: "Schedules" });
    if (UserHelper.checkAccess(Permissions.lessonsApi.lessons.edit)) menuItems.push({ url:"/admin", label: "Admin", icon:"admin_panel_settings" });

    // if (UserHelper.checkAccess(Permissions.membershipApi.server.admin)) tabs.push(<NavItem key="/admin" url="/admin" label={Locale.label("components.wrapper.servAdmin")} icon="admin_panel_settings" selected={selectedTab === "admin"} />);
    return menuItems;
  }

  const getPrimaryLabel = () => {
    const path = pathname;
    let result = "Schedules";
    if (path.startsWith("/portal") || path.startsWith("/portal/thirdParty")) result = "Schedules";
    if (path.startsWith("/admin")) result = "Admin";
    return result;
  }



  const handleNavigate = (url: string) => {
    router.push(url);
  }

  useEffect(() => {
    const items = SecondaryMenuHelper.getSecondaryMenu(window.location.pathname, {})
    setSecondaryMenu(items);
  }, [pathname]);

  /*<Typography variant="h6" noWrap>{UserHelper.currentUserChurch?.church?.name || ""}</Typography>*/
  return (<SiteHeader primaryMenuItems={getPrimaryMenu()} primaryMenuLabel={getPrimaryLabel()} secondaryMenuItems={secondaryMenu.menuItems} secondaryMenuLabel={secondaryMenu.label} context={context} appName={"Lessons"} onNavigate={handleNavigate} /> );

}
