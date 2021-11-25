import Link from "next/link";
import { useRouter } from "next/router"
import { Container, Dropdown } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLock, faUser, faCalendarAlt } from "@fortawesome/free-solid-svg-icons";
import { UserHelper, Permissions, ApiHelper, EnvironmentHelper } from "@/utils";

export function Header() {
  const router = useRouter()

  const adminItems = UserHelper.checkAccess(Permissions.lessonsApi.lessons.edit) && (
    <Dropdown.Item as="button" onClick={() => router.push("/admin")}>
      <FontAwesomeIcon icon={faUser} /> Admin
    </Dropdown.Item>
  );

  const cpItems = UserHelper.checkAccess(Permissions.lessonsApi.lessons.editSchedules) && (
    <Dropdown.Item as="button" onClick={() => router.push("/cp")}>
      <FontAwesomeIcon icon={faCalendarAlt} /> Schedules
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
        <Dropdown.Item href={EnvironmentHelper.AccountsAppUrl + "/login?jwt=" + UserHelper.user.jwt + "&returnUrl=%2Fprofile&keyName=" + UserHelper.currentChurch.subDomain}>
          <FontAwesomeIcon icon={faUser} /> Profile
        </Dropdown.Item>
        <Dropdown.Item as="button" onClick={logout}>
          <FontAwesomeIcon icon={faLock} /> Logout
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
        <Container>
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
