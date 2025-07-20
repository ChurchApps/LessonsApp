"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { AppBar, Box, ClickAwayListener, Icon, Menu, Stack } from "@mui/material";
import { SupportModal } from "@churchapps/apphelper";
import { ApiHelper, UserHelper } from "@churchapps/apphelper";
import { Permissions } from "../helpers/Permissions";

interface Props {
  position?: "fixed" | "sticky" | "static" | "relative" | "absolute";
}

export function Header(props: Props) {
  const [menuAnchor, setMenuAnchor] = useState<any>(null);
  const [showSupport, setShowSupport] = useState(false);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const adminItems = isClient && UserHelper.checkAccess?.(Permissions.lessonsApi.lessons.edit) && (
    <Link href="/admin">
      <Icon sx={{ marginRight: "5px" }}>admin_panel_settings</Icon> Admin
    </Link>
  );

  const cpItems = isClient && UserHelper.checkAccess?.(Permissions.lessonsApi.lessons.editSchedules) && (
    <Link href="/portal">
      <Icon sx={{ marginRight: "5px" }}>calendar_month</Icon> Schedules
    </Link>
  );

  const pathName = usePathname();
  //const returnUrl = (router.pathname === "/") ? "" : `?returnUrl=${encodeURIComponent(pathName)}`;

  const userAction = isClient && ApiHelper.isAuthenticated ? (
    <>
      <ClickAwayListener onClickAway={() => setMenuAnchor(null)}>
        <a
          id="userMenuLink"
          href="about:blank"
          onClick={e => {
            e.preventDefault();
            setMenuAnchor(Boolean(menuAnchor) ? null : e.target);
          }}>
          {UserHelper.user ? `${UserHelper.user.firstName} ${UserHelper.user.lastName}` : 'User'}
          <Icon style={{ paddingTop: 6 }}>expand_more</Icon>
        </a>
      </ClickAwayListener>
      <Menu
        id="userMenu"
        anchorEl={menuAnchor}
        open={Boolean(menuAnchor)}
        onClose={() => {
          setMenuAnchor(null);
        }}
        MenuListProps={{ "aria-labelledby": "userMenuLink" }}
        style={{ top: "0", width: "min-content" }}>
        {adminItems}
        {cpItems}

        <Link href="/logout">
          <Icon sx={{ marginRight: "5px" }}>logout</Icon> Logout
        </Link>
      </Menu>
    </>
  ) : (
    <>
      <Link href={"/login"} className="cta alt">
        Login
      </Link>
      <Link href="/register" style={{ paddingRight: 15 }} className="cta">
        Register
      </Link>
    </>
  );
  // <a href="about:blank"  onClick={(e) => { e.preventDefault(); setShowSupport(!showSupport) }} style={{paddingRight:15}}>Support</a>

  return (
    <div>
      <AppBar id="navbar" position={props.position || "fixed"}>
        <Stack direction="row" justifyContent="space-between" alignItems="center">
          <Link href="/" className="logo">
            <img
              src="/images/logo-dark.png"
              alt="Lessons.church - Free Curriculum for Churches"
              className="img-fluid"
            />
          </Link>
          <Box sx={{ display: "flex", alignItems: "center", whiteSpace: "nowrap" }}>{userAction}</Box>
        </Stack>
      </AppBar>
      {showSupport && <SupportModal onClose={() => setShowSupport(false)} appName={"Lessons.church"} />}
    </div>
  );
}
