import Link from "next/link";
import Image from "next/image";
import { Container, Col } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLock } from "@fortawesome/free-solid-svg-icons";
import { NavItems } from "./index";
import { useAuth } from "@/hooks/useAuth";

export function Header() {
  const { user } = useAuth();

  const userAction =
    user && user.firstName ? (
      <a
        href="about:blank"
        data-cy="settings-dropdown"
        id="userMenuLink"
        data-toggle="collapse"
        data-target="#userMenu"
        aria-controls="navbarToggleMenu"
        aria-expanded="false"
        aria-label="Toggle navigation"
        onClick={(e) => e.preventDefault()}
      >
        {`${user.firstName} ${user.lastName}`}{" "}
        <i className="fas fa-caret-down" />
      </a>
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
                  <Image
                    src="/images/logo.png"
                    alt="logo"
                    height={35}
                    width={200}
                  />
                </a>
              </Link>
            </div>

            <Col
              className="d-none d-md-block"
              style={{
                borderLeft: "2px solid #EEE",
                borderRight: "2px solid #EEE",
                maxWidth: "703px",
                margin: "0 15px",
              }}
            >
              <ul
                id="nav-main"
                className="nav nav-fill d-flex overflow-hidden"
                style={{ height: "55px" }}
              >
                <NavItems prefix="main" />
              </ul>
            </Col>

            <div className="d-flex align-items-center" id="navRight">
              {userAction}
            </div>
          </div>
        </Container>
      </div>
      <div className="container collapse" id="userMenu">
        <div>
          <ul id="nav-menu" className="nav d-flex flex-column">
            <NavItems />
            <Link href="/logout">
              <a>
                <FontAwesomeIcon icon={faLock} /> Logout
              </a>
            </Link>
          </ul>
        </div>
      </div>
      <div id="navSpacer" />
    </div>
  );
}
