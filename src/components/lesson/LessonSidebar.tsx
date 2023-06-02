import { AppBar, Box, Container, FormControl, Grid, InputLabel, Link, MenuItem, Select, Stack } from "@mui/material";
import { ArrayHelper, BundleInterface, ExternalVideoInterface, ProgramInterface, SectionInterface, VenueInterface } from "@/utils";
import { MarkdownPreview } from "..";
import React from "react";
import { Downloads } from "../Downloads";

type Props = {
  program: ProgramInterface,
  venues: VenueInterface[],
  selectedVenue: VenueInterface,
  bundles: BundleInterface[],
  externalVideos: ExternalVideoInterface[],
  onVenueChange: (venue: VenueInterface) => void
};

export function LessonSidebar(props: Props) {

  const handleJumpSection = (sectionName:string) => {
    const scrollTop = document.getElementById("section-" + sectionName).offsetTop - 60;
    window.scrollTo({top: scrollTop, behavior: "smooth"});
  }

  return (
    <div id="lessonSidebar">
      <Container>
        <h3>Venue</h3>
        <Select fullWidth size="small" value={props.selectedVenue.id} onChange={(e) => { props.onVenueChange(ArrayHelper.getOne(props.venues, "id", e.target.value)); }}>
          {props.venues.map((v) => (<MenuItem value={v.id}>{v.name}</MenuItem>))}
        </Select>
      </Container>
      <hr />
      <Container>
        <h3>Sections</h3>
        <ul>
          {props.selectedVenue.sections?.map((s) => (<li><a href={"#section-" + s.id}>{s.name}</a></li>))}
        </ul>
      </Container>
      <hr />
      <Container>
        <h3>Downloads</h3>
        <Downloads bundles={props.bundles} externalVideos={props.externalVideos} />
      </Container>
      <hr />
      <Container>
        <h3>About</h3>
        {props.program.aboutSection && ( <><MarkdownPreview value={props.program.aboutSection} /></> )}
      </Container>
    </div>

  );
}
