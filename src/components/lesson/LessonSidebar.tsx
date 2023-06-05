import { AppBar, Box, Container, FormControl, Grid, Icon, InputLabel, Link, MenuItem, Select, Stack } from "@mui/material";
import { ArrayHelper, BundleInterface, ExternalVideoInterface, ProgramInterface, SectionInterface, VenueInterface } from "@/utils";
import React, { useEffect } from "react";
import { Downloads } from "./Downloads";

type Props = {
  program: ProgramInterface,
  venues: VenueInterface[],
  selectedVenue: VenueInterface,
  bundles: BundleInterface[],
  externalVideos: ExternalVideoInterface[],
  onVenueChange: (venue: VenueInterface) => void,
  onPrint: () => void
};

export function LessonSidebar(props: Props) {

  const handleAffix = () => {
    const sidebar = document.getElementById("lessonSidebar");
    const inner = document.getElementById("lessonSidebarInner");
    const footer = document.getElementById("footer");

    const shouldAffix = window.scrollY > (sidebar.offsetTop + 100)
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
  }

  const handleHighlight = () => {
    const elements = document.getElementsByClassName("sectionCard");
    let maxTop=0;
    let result = "";
    for (let i=0;i<elements.length;i++) {
      const el:any = elements[i];
      if (window.scrollY>=el.offsetTop - 20 && el.offsetTop>0) {
        if (el.offsetTop > maxTop) {
          maxTop = el.offsetTop;
          result=el.id.replace("section-", "sectionLink-");
        }
      }
    }

    document.querySelectorAll("a.sectionLink").forEach((a) => {
      if (a.id === result) {
        if (!a.classList.contains("active")) a.classList.add("active");
      } else {
        if (a.classList.contains("active")) a.classList.remove("active");
      }
    });
  }

  useEffect(() => {
    const handleScroll = () => {
      handleAffix();
      handleHighlight();
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
          <a href="about:blank" style={{float:"right", color:"#28235d"}} onClick={(e) => { e.preventDefault(); props.onPrint() }}><Icon style={{fontSize:20}}>print</Icon></a>
          <h3>Sections</h3>
          <ul>
            {props.selectedVenue.sections?.map((s) => (s.roles?.length > 0) && (<li><a className="sectionLink" id={"sectionLink-" + s.id} href={"#section-" + s.id}>{s.name}</a></li>))}
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
          {props.program.aboutSection && (<div dangerouslySetInnerHTML={{ __html: props.program.aboutSection }}></div>)}
        </Container>
      </div>
    </div>

  );
}
