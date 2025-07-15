import React, { useRef, useState } from "react";
import { useReactToPrint } from "react-to-print";
import { Box, Dialog, DialogActions, DialogContent, DialogTitle, Grid, Tab, Tabs } from "@mui/material";
import { SmallButton } from "@churchapps/apphelper/dist/components/SmallButton";
import { FeedVenueInterface } from "@/helpers";
import { Section } from "../lesson/Section";
import { OlfPrint } from "./OlfPrint";
import { OlfScriptPrint } from "./OlfScriptPrint";

interface Props {
  onClose: () => void;
  feed: FeedVenueInterface;
}

export const OlfPrintPreview: React.FC<Props> = (props: Props) => {
  const contentRef = useRef<HTMLDivElement>(null);
  const handlePrint = useReactToPrint({ contentRef });
  const [format, setFormat] = useState("colorCoded");

  const getPrintSections = () => {
    const sections: JSX.Element[] = [];

    if (props.feed.sections) {
      //const customSections = CustomizationHelper.applyCustomSort(props.customizations, props.venue?.sections, "section");
      props.feed.sections.forEach(s => {
        sections.push(<Section section={s} toggleActive={() => {}} activeSectionId={[]} key={s.name} customizations={[]} />);
      });
    }

    return <div className="accordion"> {sections}</div>;
  };

  const getContent = () => {
    if (format === "colorCoded") return <OlfPrint feed={props.feed} />;
    else if (format === "script") return <OlfScriptPrint feed={props.feed} />;
    else return getPrintSections();
  };

  const getTabs = () => (
    <>
      Format:
      <Box sx={{ borderBottom: 1, borderColor: "divider" }} style={{ marginRight: 30 }}>
        <Tabs
          value={format}
          onChange={(e, newValue) => {
            setFormat(newValue);
          }}
          aria-label="basic tabs example">
          <Tab label="Lessons.church" value="lessons.church" />
          <Tab label="Color Coded" value="colorCoded" />
          <Tab label="Script" value="script" />
        </Tabs>
      </Box>
    </>
  );

  return (
    <>
      <Dialog open={true} onClose={props.onClose} fullScreen={true}>
        <Grid container>
          <Grid item sm={4}>
            <DialogTitle>Print Preview</DialogTitle>
          </Grid>
          <Grid item sm={8}>
            <DialogActions sx={{ paddingX: "16px", paddingBottom: "12px" }}>
              {getTabs()}
              &nbsp;
              <SmallButton
                icon="print"
                text="Print"
                onClick={() => {
                  handlePrint();
                }}
              />{" "}
              &nbsp;
              <SmallButton icon="close" text="Close" onClick={props.onClose} />
            </DialogActions>
          </Grid>
        </Grid>

        <DialogContent>
          <div style={{ minWidth: 800 }} ref={contentRef}>
            {getContent()}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};
