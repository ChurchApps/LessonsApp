import Link from "next/link";
import { useRouter } from "next/router"
import { UserHelper, Permissions, ApiHelper } from "@/utils";
import { ClickAwayListener, Icon, Menu, MenuItem, AppBar, Stack, Box } from "@mui/material";
import { useState } from "react";
import { SupportModal } from "@churchapps/apphelper";
import { usePathname } from "next/navigation";

type Props = {
  position?: "fixed" | "sticky" | "static" | "relative" | "absolute";
};

export function Header(props: Props) {
  const router = useRouter()
  const [menuAnchor, setMenuAnchor] = useState<any>(null);
  const [showSupport, setShowSupport] = useState(false);

  const adminItems = UserHelper.checkAccess(Permissions.lessonsApi.lessons.edit) && (
    <MenuItem onClick={() => { router.push("/admin") }}><Icon sx={{ marginRight: "5px" }}>admin_panel_settings</Icon> Admin</MenuItem>
  );

  const cpItems = UserHelper.checkAccess(Permissions.lessonsApi.lessons.editSchedules) && (
    <MenuItem onClick={() => { router.push("/portal") }}><Icon sx={{ marginRight: "5px" }}>calendar_month</Icon> Schedules</MenuItem>
  );

  function logout() {
    router.push("/logout")
  }

  const pathName = usePathname();
  const returnUrl = (router.pathname === "/") ? "" : `?returnUrl=${encodeURIComponent(pathName)}`;

  const userAction = ApiHelper.isAuthenticated
    ? (
      <>
        <ClickAwayListener onClickAway={() => setMenuAnchor(null)}>
          <a id="userMenuLink" href="about:blank" onClick={(e) => { e.preventDefault(); setMenuAnchor((Boolean(menuAnchor)) ? null : e.target); }}>{`${UserHelper.user.firstName} ${UserHelper.user.lastName}`}<Icon style={{ paddingTop: 6 }}>expand_more</Icon></a>
        </ClickAwayListener>
        <Menu id="userMenu" anchorEl={menuAnchor} open={Boolean(menuAnchor)} onClose={() => { setMenuAnchor(null) }} MenuListProps={{ "aria-labelledby": "userMenuLink" }} style={{ top: "0", width: "min-content" }}>
          {adminItems}
          {cpItems}
          <MenuItem onClick={() => { logout(); }}><Icon sx={{ marginRight: "5px" }}>logout</Icon> Logout</MenuItem>
        </Menu>
      </>
    )
    : (<>
      <Link href={"/login" + returnUrl} className="cta alt">Login</Link>
      <Link href="/register" style={{paddingRight:15}} className="cta">Register</Link>
    </>);
    // <a href="about:blank"  onClick={(e) => { e.preventDefault(); setShowSupport(!showSupport) }} style={{paddingRight:15}}>Support</a>

  return (
    <div>
      <AppBar id="navbar" position={props.position || "fixed"}>
        <Stack direction="row" justifyContent="space-between" alignItems="center">
          <Link href="/" className="logo"><img src="/images/logo-dark.png" alt="Lessons.church - Free Curriculum for Churches" className="img-fluid" /></Link>
          <Box sx={{ display: "flex", alignItems: "center", whiteSpace: "nowrap" }}>{userAction}</Box>
        </Stack>
      </AppBar>
      {showSupport && <SupportModal onClose={() => setShowSupport(false)} appName={"Lessons.church"} />}
    </div>
  );
}
