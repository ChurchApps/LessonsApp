import Link from "next/link";
import Image from "next/image";
import { Row, Col } from "react-bootstrap";
import { StudyInterface } from "@utils/index";

type Props = {
  studies: StudyInterface[];
  slug: string;
};

export function Studies({ studies, slug }: Props) {
  const createStudy = (study: StudyInterface) => {
    const studyUrl = slug + `/${study.slug}`;
    return (
      <Row
        style={{
          paddingBottom: 20,
          paddingTop: 20,
          borderBottom: "1px solid #CCC",
        }}
        key={study.id}
      >
        <Col xl={3}>
          <Link href={studyUrl}>
            <a>
              <Image
                src={study.image}
                className="img-fluid"
                alt={study.name}
                width={260}
                height={145}
              />
            </a>
          </Link>
        </Col>
        <Col xl={9}>
          <h3>
            <Link href={studyUrl}>
              <a>{study.name}</a>
            </Link>
          </h3>
          <p>
            <i>{study.shortDescription}</i>
          </p>
          <p>{study.description}</p>
        </Col>
      </Row>
    );
  };

  return (
    <div>
      <h2>Studies</h2>
      {studies.map(createStudy)}
    </div>
  );
}
