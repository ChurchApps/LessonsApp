import Link from "next/link";
import { Container, Col, Dropdown } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLock } from "@fortawesome/free-solid-svg-icons";
import { NavItems } from "./index";
import { useAuth } from "@/hooks/useAuth";

export function Header() {
  const { user, logout, loggedIn } = useAuth();

  const userAction = loggedIn ? (
    <Dropdown>
      <Dropdown.Toggle className="no-default-style toggle-button" as="button">
        {`${user.firstName} ${user.lastName}`}
      </Dropdown.Toggle>

      <Dropdown.Menu>
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
                  <img
                    src="/images/logo.png"
                    alt="logo"
                  />
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
