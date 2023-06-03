import * as React from "react";
import { useReactToPrint } from "react-to-print";
import { VenueInterface, ResourceInterface, BundleInterface, CustomizationInterface, CustomizationHelper, ExternalVideoInterface } from "@/utils";
import { Downloads } from "./Downloads";
import { Section } from "./Section";
import { Grid, Icon, Button, Box, FormControl, InputLabel, Select, MenuItem } from "@mui/material";


type Props = {
  useAccordion: boolean;
  venue: VenueInterface;
  resources: ResourceInterface[];
  externalVideos: ExternalVideoInterface[];
  bundles: BundleInterface[];
  hidePrint?: boolean;
  customizations?: CustomizationInterface[]
  print: number;
};

export function Venue(props: Props) {
  const contentRef = React.useRef<HTMLDivElement>(null);
  const [activeSectionId, setActiveSectionId] = React.useState<string>(props.venue.sections[0]?.id || "");
  const [displaySection, setDisplaySection] = React.useState<boolean>(false);

  const handleToggle = (sectionId: string) => { setActiveSectionId(sectionId); };

  const handlePrint = useReactToPrint({ content: () => contentRef.current });

  React.useEffect(() => { displaySection && handlePrint(); setDisplaySection(false); }, [displaySection])

  function getSections() {
    const sections: JSX.Element[] = [];

    if (props.venue.sections) {
      const customSections = CustomizationHelper.applyCustomSort(props.customizations, props.venue.sections, "section");
      customSections.forEach((s) => {
        sections.push(<Section section={s} resources={props.resources} externalVideos={props.externalVideos} toggleActive={handleToggle} activeSectionId={activeSectionId} key={s.id} customizations={props.customizations} />);
      });
    }

    return <div>{sections}</div>;
  }

  function getPrintSections() {
    const sections: JSX.Element[] = [];

    if (props.venue.sections) {
      const customSections = CustomizationHelper.applyCustomSort(props.customizations, props.venue.sections, "section");
      customSections.forEach((s) => {
        sections.push(<Section section={s} resources={props.resources} externalVideos={props.externalVideos} toggleActive={handleToggle} activeSectionId={[activeSectionId]} key={s.id} customizations={props.customizations} />);
      });
    }

    return <div className="accordion"> {sections}</div>;
  }

  const getPrint = () => {
    if (!props.hidePrint) {
      return (<Button size="small" variant="outlined" key={"print" + props.venue.id}
        onClick={() => { setDisplaySection(true) }} title="print">
        <Icon>print</Icon>
      </Button>);
    }
  }

  /*{getPrint()}*/

  React.useEffect(() => { if (props.print>0) setDisplaySection(true); }, [props.print]);

  return (
    <div>
      <div>
        <h2 className="printOnly">{props.venue.name} Instructions</h2>
        {getSections()}
      </div>
      <div ref={contentRef} style={displaySection ? {display: 'block'} : {display: 'none'}}>
        <h2 className="printOnly">{props.venue.name} Instructions</h2>
        {getPrintSections()}
      </div>

    </div>
  );
}
