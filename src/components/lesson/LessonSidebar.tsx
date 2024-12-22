import { Container, Icon, Menu, MenuItem, Select } from "@mui/material";
import { ArrayHelper, FeedVenueInterface } from "@/helpers";
import { B1ShareModal, MarkdownPreviewLight } from "@churchapps/apphelper";
import React, { useEffect, useState } from "react";
import { Downloads } from "./Downloads";
import { OlfPrintPreview } from "../open-lesson/OlfPrintPreview";

type Props = {
  venues: FeedVenueInterface[],
  selectedVenue: FeedVenueInterface,
  onVenueChange: (venue: FeedVenueInterface) => void,
  onPrint: () => void
};

export function LessonSidebar(props: Props) {
  const [showPrintPreview, setShowPrintPreview] = useState(false);
  const [shareAnchor, setShareAnchor] = React.useState<null | HTMLElement>(null);
  const [showB1Share, setShowB1Share] = React.useState(false);

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

  const handleB1Share = (e:React.MouseEvent) => {
    setShareAnchor(null);
    setShowB1Share(true);
  }

  const handleExport = (e:React.MouseEvent) => {
    e.preventDefault();
    setShareAnchor(null);
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
            <a href="about:blank" style={{color:"#28235d"}} title="Share" onClick={(e) => { e.preventDefault(); setShareAnchor(e.currentTarget); }}><Icon style={{fontSize:20}}>share</Icon></a> &nbsp;
            <a href="about:blank" style={{color:"#28235d"}} title="Print" onClick={(e) => { e.preventDefault(); setShowPrintPreview(true); }}><Icon style={{fontSize:20}}>print</Icon></a>
          </span>
          <Menu id="shareMenu" anchorEl={shareAnchor} open={Boolean(shareAnchor)} onClose={() => setShareAnchor(null)}>
            <MenuItem onClick={handleB1Share}>Share to B1 Group</MenuItem>
            <MenuItem onClick={handleExport}>Export to OLF</MenuItem>
          </Menu>
          {showB1Share && <B1ShareModal contentDisplayName={props.selectedVenue.name} contentType="venue" contentId={props.selectedVenue.id} onClose={() => { setShowB1Share(false); }} /> }

          <h3>Sections</h3>
          <ul>
            {props.selectedVenue?.sections?.map((s, idx) => (s.actions?.length > 0) && (<li key={"section-" + idx}><a className="sectionLink" id={"sectionLink-" + idx} href={"#section-" + s.name}>{s.name}</a></li>))}
          </ul>
        </Container>

        {props.selectedVenue.downloads && (<>
          <hr />
          <Container>
            <h3>Downloads</h3>
            <Downloads lessonId={props.selectedVenue.lessonId} downloads={props.selectedVenue.downloads} />
          </Container>
        </>)}

        {props.selectedVenue.programAbout && (<>
          <hr />
          <Container>
            <h3>About</h3>
            <MarkdownPreviewLight value={props.selectedVenue.programAbout} />
          </Container>
        </>)}
      </div>

      {showPrintPreview && <OlfPrintPreview feed={props.selectedVenue} onClose={() => { setShowPrintPreview(false) }} /> }

    </div>

  );
}
