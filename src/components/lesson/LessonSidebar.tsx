import { AppBar, Box, Container, FormControl, Grid, InputLabel, Link, MenuItem, Select, Stack } from "@mui/material";
import { ArrayHelper, BundleInterface, ExternalVideoInterface, ProgramInterface, SectionInterface, VenueInterface } from "@/utils";
import { MarkdownPreview } from "..";
import React, { useEffect } from "react";
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

  useEffect(() => {
    const handleScroll = () => {
      const sidebar = document.getElementById("lessonSidebar");
      const inner = document.getElementById("lessonSidebarInner");
      const footer = document.getElementById("footer");

      console.log(document.documentElement.offsetHeight, footer.offsetHeight);

      const shouldAffix = window.scrollY > sidebar.offsetTop
      && window.scrollY < (document.documentElement.offsetHeight - footer.offsetHeight - window.innerHeight)
      ;
      if (shouldAffix) {
        if (!inner.classList.contains("affix")) {
          inner.classList.add("affix");
          inner.style.maxWidth = sidebar.offsetWidth.toString() + "px";
        }
      } else {
        if (inner.classList.contains("affix")) inner.classList.remove("affix");
      }
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <div id="lessonSidebar">
      <div id="lessonSidebarInner">
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
            {props.selectedVenue.sections?.map((s) => (s.roles?.length > 0) && (<li><a href={"#section-" + s.id}>{s.name}</a></li>))}
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
    </div>

  );
}
