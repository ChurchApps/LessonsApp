import * as React from "react";
import { useReactToPrint } from "react-to-print";
import { CustomizationInterface, CustomizationHelper, FeedVenueInterface, ArrayHelper } from "@/utils";
import { Section } from "./Section";
import { Icon, Button } from "@mui/material";


type Props = {
  useAccordion: boolean;
  venue: FeedVenueInterface;
  hidePrint?: boolean;
  customizations?: CustomizationInterface[]
  print: number;
};

export function Venue({ hidePrint = true, ...props }: Props) {
  const contentRef = React.useRef<HTMLDivElement>(null);
  const [activeSectionId, setActiveSectionId] = React.useState<string>(props.venue?.sections[0]?.name || "");
  const [displaySection, setDisplaySection] = React.useState<boolean>(false);

  const handleToggle = (sectionId: string) => { setActiveSectionId(sectionId); };

  const handlePrint = useReactToPrint({ content: () => contentRef.current });

  React.useEffect(() => { displaySection && handlePrint(); setDisplaySection(false); }, [displaySection])

  function getSections() {
    const sections: JSX.Element[] = [];

    if (props.venue?.sections) {
      const customSections = CustomizationHelper.applyCustomSort(props.customizations, props.venue?.sections, "section");
      customSections.forEach((s) => {
        if (!shouldHide(s.id)) {
          sections.push(<Section section={s} toggleActive={handleToggle} activeSectionId={activeSectionId} key={s.id} customizations={props.customizations} />);
        }
      });
    }

    return <div style={{ display: "inline-block" }}>{sections}</div>;
  }

  const shouldHide = (id: string) => {
    let result = false;
    if (props.customizations?.length > 0) {
      const removeItems = ArrayHelper.getAll(props.customizations, "action", "remove");
      if (removeItems.length > 0) result = ArrayHelper.getOne(removeItems, "contentId", id) !== null;
    }
    return result;
  }

  function getPrintSections() {
    const sections: JSX.Element[] = [];

    if (props.venue?.sections) {
      const customSections = CustomizationHelper.applyCustomSort(props.customizations, props.venue?.sections, "section");
      customSections.forEach((s) => {
        sections.push(<Section section={s} toggleActive={handleToggle} activeSectionId={[activeSectionId]} key={s.id} customizations={props.customizations} />);
      });
    }

    return <div className="accordion"> {sections}</div>;
  }

  const getPrint = () => {
    if (!hidePrint) {
      return (<Button size="small" variant="outlined" key={"print" + props.venue.name} sx={{ float: "right", marginBottom: "20px" }}
        onClick={() => { setDisplaySection(true) }} title="print" startIcon={<Icon>print</Icon>}>
          print
      </Button>);
    }
  }

  /*{getPrint()}*/

  React.useEffect(() => { if (props.print>0) setDisplaySection(true); }, [props.print]);

  return (
    <div>
      <div>
        <h2 className="printOnly">{props.venue?.name} Instructions</h2>
        {getPrint()}
        {getSections()}
      </div>
      <div ref={contentRef} style={displaySection ? {display: 'block'} : {display: 'none'}}>
        <h2 className="printOnly">{props.venue?.lessonName} Instructions</h2>
        {getPrintSections()}
      </div>

    </div>
  );
}
