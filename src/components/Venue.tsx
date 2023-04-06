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
};

export function Venue(props: Props) {
  const contentRef = React.useRef<HTMLDivElement>(null);
  const [activeSectionId, setActiveSectionId] = React.useState<string>(props.venue.sections[0]?.id || "");
  const [displaySection, setDisplaySection] = React.useState<boolean>(false);
  const [jumpSection, setJumpSection] = React.useState<string>(props.venue.sections[0]?.id || "");[0]

  const handleToggle = (sectionId: string) => { setActiveSectionId(sectionId); };

  const handlePrint = useReactToPrint({ content: () => contentRef.current });

  React.useEffect(() => { displaySection && handlePrint(); setDisplaySection(false); }, [displaySection])

  function getSections() {
    const sections: JSX.Element[] = [];

    if (props.venue.sections) {
      const customSections = CustomizationHelper.applyCustomSort(props.customizations, props.venue.sections, "section");
      customSections.forEach((s) => {
        sections.push(<Section useAccordion={props.useAccordion} section={s} resources={props.resources} externalVideos={props.externalVideos} toggleActive={handleToggle} activeSectionId={activeSectionId} key={s.id} customizations={props.customizations} />);
      });
    }

    return <div className="accordion"> {sections}</div>;
  }

  function getPrintSections() {
    const sections: JSX.Element[] = [];

    if (props.venue.sections) {
      const customSections = CustomizationHelper.applyCustomSort(props.customizations, props.venue.sections, "section");
      customSections.forEach((s) => {
        sections.push(<Section useAccordion={props.useAccordion} section={s} resources={props.resources} externalVideos={props.externalVideos} toggleActive={handleToggle} activeSectionId={[activeSectionId]} key={s.id} customizations={props.customizations} />);
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

  const getSectionMenuItems = () => {
    let result:JSX.Element[] = [];
    props.venue.sections?.forEach((s) => {
      if (s.roles?.length > 0) result.push(<MenuItem value={s.id}>{s.name}</MenuItem>);
    });
    return result;
  }

  const handleJumpSection = (sectionName:string) => {
    setJumpSection(sectionName);
    const scrollTop = document.getElementById("section-" + sectionName).offsetTop - 60;
    window.scrollTo({top: scrollTop, behavior: "smooth"});
  }

  return (
    <div>
      <h4 style={{ fontSize: "24px", fontWeight: 500, margin: "0 0 8px 0" }}>{props.venue.name}</h4>
      {!props.useAccordion
      && <Grid container spacing={3}>
        <Grid item xs={6} md={4}>
          <FormControl fullWidth>
            <InputLabel>Jump to Section</InputLabel>
            <Select size="small" fullWidth label="Jump to Section" value={jumpSection} onChange={(e) => { handleJumpSection(e.target.value); }}>
              {getSectionMenuItems()}
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={6} md={8}>
          <Box sx={{ display: "flex", justifyContent: "flex-end", gap: "8px", flexWrap: "wrap" }} style={{paddingTop:10}}>
            {getPrint()}
            <Downloads bundles={props.bundles} externalVideos={props.externalVideos} />
          </Box>
        </Grid>
      </Grid>
      }
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
