import Link from "next/link";
import { useRouter } from "next/router"
import { Container, Dropdown } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLock, faUser } from "@fortawesome/free-solid-svg-icons";
import { useAuth } from "@/hooks/useAuth";
import { UserHelper, Permissions } from "@/utils";

export function Header() {
  const { user, logout, loggedIn } = useAuth();
  const router = useRouter()

  const adminItems = UserHelper.checkAccess(
    Permissions.lessonsApi.lessons.edit
  ) && (
    <Dropdown.Item as="button" onClick={() => router.push("/admin")}>
      <FontAwesomeIcon icon={faUser} /> Admin
    </Dropdown.Item>
  );

  const userAction = loggedIn ? (
    <Dropdown>
      <Dropdown.Toggle className="no-default-style toggle-button" as="button">
        {`${user.firstName} ${user.lastName}`}
      </Dropdown.Toggle>

      <Dropdown.Menu>
        {adminItems}
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
                  <img src="/images/logo.png" alt="logo" />
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
