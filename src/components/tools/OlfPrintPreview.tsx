import { Dialog, DialogActions, DialogContent, DialogTitle, FormControl, Grid, InputLabel, MenuItem, Select } from "@mui/material";
import React, { useRef, useState } from "react";
import { FeedVenueInterface, SmallButton } from "@/utils";
import { useReactToPrint } from "react-to-print";
import { Section } from "../lesson/Section";
import { OlfPrint } from "./OlfPrint";

interface Props {
  onClose: () => void,
  feed: FeedVenueInterface,
}

export const OlfPrintPreview: React.FC<Props> = (props: Props) => {

  const contentRef = useRef<HTMLDivElement>(null);
  const handlePrint = useReactToPrint({ content: () => contentRef.current });
  const [format, setFormat] = useState("format1");


  const getPrintSections = () => {
    const sections: JSX.Element[] = [];

    if (props.feed.sections) {
      //const customSections = CustomizationHelper.applyCustomSort(props.customizations, props.venue?.sections, "section");
      props.feed.sections.forEach((s) => {
        sections.push(<Section section={s} toggleActive={() => {}} activeSectionId={[]} key={s.name} customizations={[]} />);
      });
    }

    return <div className="accordion"> {sections}</div>;
  }

  const getContent = () => {
    if (format==="format1") return <OlfPrint feed={props.feed} />;
    else return getPrintSections();
  }


  return (<>
    <Dialog open={true} onClose={props.onClose} fullScreen={true}>
      <Grid container>
        <Grid item sm={6}>
          <DialogTitle>Print Preview</DialogTitle>
        </Grid>
        <Grid item sm={6}>
          <DialogActions sx={{ paddingX: "16px", paddingBottom: "12px" }}>
            <FormControl size="small">
              <InputLabel>Print Format</InputLabel>
              <Select  size="small" label="Print Format" name="format" value={format} onChange={(e) => { setFormat(e.target.value); }}>
                <MenuItem value="format1" key="format1">Format 1</MenuItem>
                <MenuItem value="format2" key="format2">Format 2</MenuItem>
              </Select>
            </FormControl> &nbsp;
            <SmallButton icon="print" text="Print" onClick={() => { handlePrint(); }} /> &nbsp;
            <SmallButton icon="close" text="Close" onClick={props.onClose} />

          </DialogActions>
        </Grid>
      </Grid>

      <DialogContent>

        <div style={{ minWidth: 800 }}  ref={contentRef}>
          {getContent()}
        </div>
      </DialogContent>

    </Dialog>
  </>)
};
