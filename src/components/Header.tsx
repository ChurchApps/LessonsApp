import Link from "next/link";
import { useRouter } from "next/router"
import { UserHelper, Permissions, ApiHelper } from "@/utils";
import { Container, Icon, Menu, MenuItem } from "@mui/material";
import { useState } from "react";

export function Header() {
  const router = useRouter()
  const [menuAnchor, setMenuAnchor] = useState<any>(null);

  const adminItems = UserHelper.checkAccess(Permissions.lessonsApi.lessons.edit) && (
    <MenuItem onClick={() => { router.push("/admin") }} ><Icon>admin_panel_settings</Icon> Admin</MenuItem>
  );

  const cpItems = UserHelper.checkAccess(Permissions.lessonsApi.lessons.editSchedules) && (
    <MenuItem onClick={() => { router.push("/cp") }} ><Icon>calendar_month</Icon> Schedules</MenuItem>
  );

  function logout() {
    router.push("/logout")
  }

  const userAction = ApiHelper.isAuthenticated ? (
    <>
      <a id="userMenuLink" href="about:blank" onClick={(e) => { e.preventDefault(); console.log("Menu Click"); setMenuAnchor((Boolean(menuAnchor)) ? null : document.getElementById("navSpacer")); }}>{`${UserHelper.user.firstName} ${UserHelper.user.lastName}`}<Icon style={{ paddingTop: 6 }}>expand_more</Icon></a>
      <Menu id="userMenu" anchorEl={menuAnchor} open={Boolean(menuAnchor)} onClose={() => { setMenuAnchor(null) }} MenuListProps={{ "aria-labelledby": "userMenuLink" }} style={{ marginRight: 120, marginTop: -55 }} >
        {adminItems}
        {cpItems}
        <MenuItem onClick={() => { logout(); }} ><Icon>logout</Icon> Logout</MenuItem>
      </Menu>
    </>
  ) : (
    <Link href="/login">
      <a>Login</a>
    </Link>
  );

  console.log("Menu anchor is: ")
  console.log(menuAnchor);

  return (
    <div>
      <div id="navbar" className="fixed-top">
        <Container fixed>
          <div className="d-flex justify-content-between">
            <div>
              <Link href="/">
                <a className="navbar-brand">
                  <img src="/images/logo.png" alt="Lessons.church - Free Curriculum for Churches" />
                </a>
              </Link>
            </div>
            <div className="d-flex align-items-center" id="navRight">
              {userAction}
            </div>
          </div>
        </Container>
      </div>
      <div id="navSpacer" />
    </div>
  );
}
