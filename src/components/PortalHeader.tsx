"use client";

import { useRouter } from "next/navigation";
import { usePathname } from "next/navigation";
import React, { useEffect, useState } from "react";
import { SiteHeader, UserHelper } from "@churchapps/apphelper";
import UserContext from "@/app/context/UserContext";
import { Permissions } from "@/helpers";
import { SecondaryMenuHelper } from "@/helpers/SecondaryMenuHelper";

interface Props {
  position?: "fixed" | "sticky" | "static" | "relative" | "absolute";
}

export function PortalHeader(_props: Props) {
  const context = React.useContext(UserContext);
  const router = useRouter();
  const [secondaryMenu, setSecondaryMenu] = React.useState({ menuItems: [], label: "" });
  const [primaryMenu, setPrimaryMenu] = React.useState<{ url: string; icon: string; label: string }[]>([]);
  const [isClient, setIsClient] = useState(false);
  const pathname = usePathname();

  // Populate context with user data if authenticated but context is empty
  React.useEffect(() => {
    if (isClient && !context.user && UserHelper.user) {
      context.setUser(UserHelper.user);
      context.setPerson(UserHelper.person);
      context.setUserChurch(UserHelper.currentUserChurch);
      context.setUserChurches(UserHelper.userChurches);
    }
  }, [isClient, context, context.user]);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (!isClient) return;

    const menuItems: { url: string; icon: string; label: string }[] = [];
    menuItems.push({ url: "/", icon: "home", label: "Home" });
    menuItems.push({ url: "/portal", icon: "calendar_month", label: "Schedules" });
    if (UserHelper.checkAccess?.(Permissions.lessonsApi.lessons.edit)) {
      menuItems.push({ url: "/admin", label: "Admin", icon: "admin_panel_settings" });
    }

    setPrimaryMenu(menuItems);
  }, [isClient]);

  const getPrimaryMenu = () => {
    return primaryMenu;
  };

  const getPrimaryLabel = () => {
    const path = pathname;
    let result = "Schedules";
    if (path.startsWith("/portal") || path.startsWith("/portal/thirdParty")) result = "Schedules";
    if (path.startsWith("/admin")) result = "Admin";
    return result;
  };

  const handleNavigate = (url: string) => {
    router.push(url);
  };

  useEffect(() => {
    const items = SecondaryMenuHelper.getSecondaryMenu(window.location.pathname, {});
    setSecondaryMenu(items);
  }, [pathname]);

  /*<Typography variant="h6" noWrap>{UserHelper.currentUserChurch?.church?.name || ""}</Typography>*/
  return (
    <SiteHeader
      primaryMenuItems={getPrimaryMenu()}
      primaryMenuLabel={getPrimaryLabel()}
      secondaryMenuItems={secondaryMenu.menuItems}
      secondaryMenuLabel={secondaryMenu.label}
      context={context}
      appName={"Lessons"}
      onNavigate={handleNavigate}
    />
  );
}
