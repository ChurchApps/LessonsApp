import Link from "next/link";
import { Container, Row, Col } from "react-bootstrap";
import { ProgramInterface, ProviderInterface } from "@/utils";

type Props = {
  programs: ProgramInterface[];
  providers: ProviderInterface[];
};

export function Programs({ programs, providers }: Props) {
  function createProgram({
    slug,
    image,
    name,
    shortDescription,
    description,
    id,
  }: ProgramInterface) {
    const url = "/" + slug + "/";
    return (
      <div key={id}>
        <Row>
          <Col xl={4}>
            <Link href={url}>
              <a>
                <img
                  src={image}
                  className="img-fluid"
                  alt={name}
                />
              </a>
            </Link>
          </Col>
          <Col xl={8}>
            <Link href={url}>
              <a>
                <h3>{name}</h3>
              </a>
            </Link>
            <p>
              <i>{shortDescription}</i>
            </p>
            <p>{description}</p>
          </Col>
        </Row>
        <hr />
      </div>
    );
  }

  const programsView = providers
    .map((provider) => {
      const view = programs
        .filter((program) => program.providerId === provider.id)
        .map((p) => createProgram(p));

      return (
        view.length > 0 && (
          <div key={provider.id}>
            <h3 className="mb-4" style={{ fontWeight: "bold" }}>
              {provider.name}
            </h3>
            {view}
          </div>
        )
      );
    })
    .filter((p) => p);

  return (
    programsView.length > 0 && (
      <div className="homeSection">
        <Container>
          <h2 className="text-center">
            Browse <span>Available Programs</span>
          </h2>
          {programsView}
        </Container>
      </div>
    )
  );
}
