import * as React from "react";
import { useReactToPrint } from "react-to-print";
import { VenueInterface, ResourceInterface, BundleInterface, CustomizationInterface, CustomizationHelper, ExternalVideoInterface } from "@/utils";
import { Downloads } from "./Downloads";
import { Section } from "./Section";
import { Grid, Icon, Button, Box } from "@mui/material";

type Props = {
  venue: VenueInterface;
  resources: ResourceInterface[];
  externalVideos: ExternalVideoInterface[];
  bundles: BundleInterface[];
  hidePrint?: boolean;
  customizations?: CustomizationInterface[]
};

export function Venue(props: Props) {
  const contentRef = React.useRef<HTMLDivElement>(null);
  const [activeSectionId, setActiveSectionId] = React.useState<string>(props.venue.sections[0]?.id || "");
  const [displaySection, setDisplaySection] = React.useState<boolean>(false);

  const handleToggle = (sectionId: string) => { setActiveSectionId(sectionId); };

  const handlePrint = useReactToPrint({ content: () => contentRef.current });

  React.useEffect(() => {
    displaySection && handlePrint();
    setDisplaySection(false);
  }, [displaySection])

  function getSections() {
    const sections: JSX.Element[] = [];

    if (props.venue.sections) {
      const customSections = CustomizationHelper.applyCustomSort(props.customizations, props.venue.sections, "section");
      customSections.forEach((s) => {
        sections.push(<Section section={s} resources={props.resources} externalVideos={props.externalVideos} toggleActive={handleToggle} activeSectionId={activeSectionId} key={s.id} customizations={props.customizations} />);
      });
    }

    return <div className="accordion"> {sections}</div>;
  }

  function getPrintSections() {
    const sections: JSX.Element[] = [];

    if (props.venue.sections) {
      const customSections = CustomizationHelper.applyCustomSort(props.customizations, props.venue.sections, "section");
      console.log("customSections ",customSections, props.customizations)
      customSections.forEach((s) => {
        sections.push(<Section section={s} resources={props.resources} externalVideos={props.externalVideos} toggleActive={handleToggle} activeSectionId={[activeSectionId]} key={s.id} customizations={props.customizations} />);
      });
    }

    return <div className="accordion"> {sections}</div>;
  }

  const getPrint = () => {
    if (!props.hidePrint) {
      return (<Button size="small" variant="outlined" key={"print" + props.venue.id} onClick={() => {
        setDisplaySection(true)
      }}
      title="print">
        <Icon>print</Icon>
      </Button>);
    }
  }

  return (
    <div>
      <Grid container spacing={3}>
        <Grid item xs={6}>
          <h4 style={{ fontSize: "24px", fontWeight: 500, margin: "0 0 8px 0" }}>{props.venue.name}</h4>
        </Grid>
        <Grid item xs={6}>
          <Box sx={{ display: "flex", justifyContent: "flex-end", gap: "8px", flexWrap: "wrap" }}>
            {getPrint()}
            <Downloads bundles={props.bundles} externalVideos={props.externalVideos} />
          </Box>
        </Grid>
      </Grid>
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
