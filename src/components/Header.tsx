import Link from "next/link";
import { useRouter } from "next/router"
import { Dropdown } from "react-bootstrap";
import { UserHelper, Permissions, ApiHelper, EnvironmentHelper } from "@/utils";
import { Container, Icon } from "@mui/material";

export function Header() {
  const router = useRouter()

  const adminItems = UserHelper.checkAccess(Permissions.lessonsApi.lessons.edit) && (
    <Dropdown.Item as="button" onClick={() => router.push("/admin")}>
      <Icon>admin_panel_settings</Icon> Admin
    </Dropdown.Item>
  );

  const cpItems = UserHelper.checkAccess(Permissions.lessonsApi.lessons.editSchedules) && (
    <Dropdown.Item as="button" onClick={() => router.push("/cp")}>
      <Icon>calendar_month</Icon> Schedules
    </Dropdown.Item>
  );

  function logout() {
    router.push("/logout")
  }

  const userAction = ApiHelper.isAuthenticated ? (
    <Dropdown>
      <Dropdown.Toggle className="no-default-style toggle-button" as="button">
        {`${UserHelper.user.firstName} ${UserHelper.user.lastName}`}
      </Dropdown.Toggle>

      <Dropdown.Menu>
        {adminItems}
        {cpItems}
        <Dropdown.Item href={EnvironmentHelper.AccountsAppUrl + "/login?jwt=" + UserHelper.user.jwt + "&returnUrl=%2Fprofile&keyName=" + UserHelper.currentChurch?.subDomain}>
          <Icon>person</Icon> Profile
        </Dropdown.Item>
        <Dropdown.Item as="button" onClick={logout}>
          <Icon>logout</Icon> Logout
        </Dropdown.Item>
      </Dropdown.Menu>
    </Dropdown>
  ) : (
    <Link href="/login">
      <a>Login</a>
    </Link>
  );

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
