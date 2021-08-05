import Link from "next/link";
import Image from "next/image";
import { Container, Col } from "react-bootstrap";
import { NavItems } from "./index";
import Logo from "@public/images/logo.png";

export function Header() {
  return (
    <div>
      <div id="navbar" className="fixed-top">
        <Container>
          <div className="d-flex justify-content-between">
            <div>
              <Link href="/">
                <a className="navbar-brand">
                  <Image src={Logo} alt="logo" />
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
              <Link href="/login">
                <a
                  href="about:blank"
                  data-cy="settings-dropdown"
                  id="userMenuLink"
                  data-toggle="collapse"
                  data-target="#userMenu"
                  aria-controls="navbarToggleMenu"
                  aria-expanded="false"
                  aria-label="Toggle navigation"
                >
                  Login
                </a>
              </Link>
            </div>
          </div>
        </Container>
      </div>
    </div>
  );
}
