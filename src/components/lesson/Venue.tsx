import * as React from "react";
import { useReactToPrint } from "react-to-print";
import { CustomizationInterface, CustomizationHelper, FeedVenueInterface, ArrayHelper } from "@/helpers";
import { Section } from "./Section";
import { Icon, Button } from "@mui/material";


interface Props {
  useAccordion: boolean;
  venue: FeedVenueInterface;
  hidePrint?: boolean;
  customizations?: CustomizationInterface[]
  print: number;
}

const Venue = React.memo(({ hidePrint = true, ...props }: Props) => {
  const contentRef = React.useRef<HTMLDivElement>(null);
  const [activeSectionId, setActiveSectionId] = React.useState<string>(props.venue?.sections[0]?.name || "");
  const [displaySection, setDisplaySection] = React.useState<boolean>(false);

  const handleToggle = React.useCallback((sectionId: string) => {
    setActiveSectionId(sectionId);
  }, []);

  const handlePrint = useReactToPrint({ contentRef });

  const checkPrint = React.useCallback(() => {
    try {
      const w = window as any;
      w.ReactNativeWebView.postMessage("print");
    } catch (e) {
      handlePrint();
    }
  }, [handlePrint]);

  React.useEffect(() => {
    if (displaySection) {
      checkPrint();
      setDisplaySection(false);
    }
  }, [displaySection, checkPrint]);

  const shouldHide = React.useCallback((id: string) => {
    let result = false;
    if (props.customizations?.length > 0) {
      const removeItems = ArrayHelper.getAll(props.customizations, "action", "remove");
      if (removeItems.length > 0) result = ArrayHelper.getOne(removeItems, "contentId", id) !== null;
    }
    return result;
  }, [props.customizations]);

  const customSections = React.useMemo(() =>
    CustomizationHelper.applyCustomSort(props.customizations, props.venue?.sections, "section"),
  [props.customizations, props.venue?.sections]
  );

  const getSections = React.useCallback(() => {
    const sections: JSX.Element[] = [];

    if (props.venue?.sections) {
      customSections.forEach((s) => {
        if (!shouldHide(s.id)) {
          sections.push(<Section section={s} toggleActive={handleToggle} activeSectionId={activeSectionId} key={s.id} customizations={props.customizations} />);
        }
      });
    }

    return <div style={{ display: "inline-block" }}>{sections}</div>;
  }, [customSections, shouldHide, handleToggle, activeSectionId, props.customizations, props.venue?.sections]);

  const getPrintSections = React.useCallback(() => {
    const sections: JSX.Element[] = [];

    if (props.venue?.sections) {
      customSections.forEach((s) => {
        if (!shouldHide(s.id)) {
          sections.push(<Section section={s} toggleActive={handleToggle} activeSectionId={[activeSectionId]} key={s.id} customizations={props.customizations} />);
        }
      });
    }

    return <div className="accordion"> {sections}</div>;
  }, [customSections, shouldHide, handleToggle, activeSectionId, props.customizations, props.venue?.sections]);

  const getPrint = React.useCallback(() => {
    if (!hidePrint) {
      return (<Button size="small" variant="outlined" key={"print" + props.venue.name} sx={{ float: "right", marginBottom: "20px" }}
        onClick={() => { setDisplaySection(true) }} title="print" startIcon={<Icon>print</Icon>}>
          print
      </Button>);
    }
  }, [hidePrint, props.venue.name]);

  React.useEffect(() => {
    if (props.print > 0) setDisplaySection(true);
  }, [props.print]);

  const sections = React.useMemo(() => getSections(), [getSections]);
  const printSections = React.useMemo(() => getPrintSections(), [getPrintSections]);

  return (
    <div>
      <div>
        <h2 className="printOnly">{props.venue?.name} Instructions</h2>
        {getPrint()}
        {sections}
      </div>
      <div ref={contentRef} style={displaySection ? {display: 'block'} : {display: 'none'}}>
        <h2 className="printOnly">{props.venue?.lessonName} Instructions</h2>
        {printSections}
      </div>

    </div>
  );
});

Venue.displayName = 'Venue';

export { Venue };
