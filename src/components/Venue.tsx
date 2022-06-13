import * as React from "react";
import { useReactToPrint } from "react-to-print";
import { Row, Col, Accordion } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPrint } from "@fortawesome/free-solid-svg-icons";
import { VenueInterface, ResourceInterface, BundleInterface, CustomizationInterface, CustomizationHelper } from "@/utils";
import { Downloads } from "./Downloads";
import { Section } from "./Section";
import { Grid } from "@mui/material";

type Props = {
  venue: VenueInterface;
  resources: ResourceInterface[];
  bundles: BundleInterface[];
  hidePrint?: boolean;
  customizations?: CustomizationInterface[]
};

export function Venue(props: Props) {
  const contentRef = React.useRef<HTMLDivElement>(null);
  const [activeSectionId, setActiveSectionId] = React.useState<string>(props.venue.sections[0]?.id || "");

  const handleToggle = (sectionId: string) => { setActiveSectionId(sectionId); };

  const handlePrint = useReactToPrint({ content: () => contentRef.current });

  function getSections() {
    const sections: JSX.Element[] = [];

    if (props.venue.sections) {
      const customSections = CustomizationHelper.applyCustomSort(props.customizations, props.venue.sections, "section");
      customSections.forEach((s) => {
        sections.push(<Section section={s} resources={props.resources} toggleActive={handleToggle} activeSectionId={activeSectionId} key={s.id} customizations={props.customizations} />);
      });
    }

    return <Accordion defaultActiveKey={activeSectionId}>{sections}</Accordion>;
  }

  const getPrint = () => {
    if (!props.hidePrint) {
      return (<button type="button" className="btn btn-sm btn-light" key={"print" + props.venue.id} onClick={handlePrint} title="print" style={{ float: "right", marginRight: 10 }} >
        <FontAwesomeIcon icon={faPrint} />
      </button>);
    }
  }


  return (
    <div>
      <Grid container spacing={3}>
        <Grid item xs={6}>
          <h4>{props.venue.name}</h4>
        </Grid>
        <Grid item xs={6}>
          <Downloads bundles={props.bundles} />
          {getPrint()}
        </Grid>
      </Grid>
      <div ref={contentRef}>
        <h2 className="printOnly">{props.venue.name} Instructions</h2>
        {getSections()}
      </div>
    </div>
  );
}
