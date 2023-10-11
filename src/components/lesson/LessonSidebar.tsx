import { Container, Icon, MenuItem, Select } from "@mui/material";
import { ArrayHelper, FeedVenueInterface } from "@/utils";
import { MarkdownPreview } from "@churchapps/apphelper";
import React, { useEffect } from "react";
import { Downloads } from "./Downloads";

type Props = {
  venues: FeedVenueInterface[],
  selectedVenue: FeedVenueInterface,
  onVenueChange: (venue: FeedVenueInterface) => void,
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

  const handleExport = (e:React.MouseEvent) => {
    e.preventDefault();
    const feedUrl = "https://api.lessons.church/venues/public/feed/" + props.selectedVenue.id;
    window.location.href = "/tools/olf?feedUrl=" + encodeURIComponent(feedUrl);
  }

  return (
    <div id="lessonSidebar">
      <div id="lessonSidebarInner">
        <Container>
          <h3>Venue</h3>
          <Select fullWidth size="small" value={props.selectedVenue?.name} onChange={(e) => { props.onVenueChange(ArrayHelper.getOne(props.venues, "name", e.target.value)); }}>
            {props.venues.map((v) => (<MenuItem key={v.name} value={v.name}>{v.name}</MenuItem>))}
          </Select>
        </Container>
        <hr />
        <Container>
          <span style={{float:"right"}}>
            <a href="about:blank" style={{color:"#28235d"}} title="Export to OLF" onClick={handleExport}><Icon style={{fontSize:20}}>download</Icon></a> &nbsp;
            <a href="about:blank" style={{color:"#28235d"}} title="print" onClick={(e) => { e.preventDefault(); props.onPrint() }}><Icon style={{fontSize:20}}>print</Icon></a>
          </span>

          <h3>Sections</h3>
          <ul>
            {props.selectedVenue?.sections?.map((s, idx) => (s.actions?.length > 0) && (<li key={"section-" + idx}><a className="sectionLink" id={"sectionLink-" + idx} href={"#section-" + idx}>{s.name}</a></li>))}
          </ul>
        </Container>
        <hr />
        <Container>
          <h3>Downloads</h3>
          <Downloads lessonId={props.selectedVenue.lessonId} downloads={props.selectedVenue.downloads} />
        </Container>
        <hr />
        <Container>
          <h3>About</h3>
          {props.selectedVenue.programAbout && ( <><MarkdownPreview value={props.selectedVenue.programAbout} /></> )}
        </Container>
      </div>
    </div>

  );
}
