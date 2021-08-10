import * as React from "react";
import { useReactToPrint } from "react-to-print";
import { Row, Col, Accordion } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPrint } from "@fortawesome/free-solid-svg-icons";
import { VenueInterface, ResourceInterface } from "@utils/index";
import { Downloads } from "./Downloads";
import { SectionAlt } from "./SectionAlt";
import { Section } from "./Section";

type Props = {
  venue: VenueInterface;
  resources: ResourceInterface[];
};

export function Venue({ venue, resources }: Props) {
  const contentRef = React.useRef<HTMLDivElement>(null);
  const [activeSectionId, setActiveSectionId] = React.useState<string>(
    venue.sections[0].id
  );

  const handleToggle = (sectionId: string) => {
    setActiveSectionId(sectionId);
  };

  const handlePrint = useReactToPrint({
    content: () => contentRef.current,
  });

  function getSections() {
    const sections: JSX.Element[] = [];

    if (
      typeof window !== "undefined" &&
      window.location.href.indexOf("alt=1") > -1
    ) {
      venue.sections?.forEach((s) => {
        sections.push(
          <SectionAlt section={s} resources={resources} key={s.id} />
        );
      });
    } else {
      venue.sections?.forEach((s) => {
        sections.push(
          <Section
            section={s}
            resources={resources}
            toggleActive={handleToggle}
            activeSectionId={activeSectionId}
            key={s.id}
          />
        );
      });
    }

    return <Accordion defaultActiveKey={activeSectionId}>{sections}</Accordion>;
  }

  return (
    <div>
      <Row>
        <Col>
          <h4>{venue.name}</h4>
        </Col>
        <Col>
          <Downloads resources={resources} />
          <button
            type="button"
            className="btn btn-sm btn-light"
            key={"print" + venue.id}
            onClick={handlePrint}
            title="print"
            style={{ float: "right", marginRight: 10 }}
          >
            <FontAwesomeIcon icon={faPrint} />
          </button>
        </Col>
      </Row>
      <div ref={contentRef}>
        <h2 className="printOnly">{venue.name} Instructions</h2>
        {getSections()}
      </div>
    </div>
  );
}
