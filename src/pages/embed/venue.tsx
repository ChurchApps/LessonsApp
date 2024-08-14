import React, { useState, useEffect } from "react";
import { Layout, Venue } from "@/components";
import { FeedVenueInterface, SmallButton } from "@/utils";
import { Tab } from "@mui/material";
import { OlfPrintPreview } from "@/components/open-lesson/OlfPrintPreview";

export default function B1Venue() {
  const [venue, setVenue] = useState<FeedVenueInterface>(null);
  const [selectedTab, setSelectedTab] = useState<string>("");
  const [showPrintPreview, setShowPrintPreview] = useState(false);

  let search = new URLSearchParams(process.browser ? window.location.search : "");
  const id = search.get("id")
  const apiUrl = search.get("apiUrl")


  useEffect(() => { loadData(); }, [id]);


  const sendHeight = () => {
    if (typeof window !== "undefined") {
      if (window?.parent?.postMessage) {
        const height = document.body.clientHeight;
        window.parent.postMessage(height, "*");
      }
    }
  }



  const loadData = async () => {
    const data = await fetch(apiUrl).then(resp => resp.json());
    setVenue(data);
  }

  const getVenue = () => {
    if (venue) {
      return <Venue useAccordion={true} venue={venue} print={0} />
    }
  }

  const getTabs = () => {
    const result: JSX.Element[] = [];
    venue?.sections?.forEach(s => {
      if (s.actions?.length>0) result.push(<Tab label={s.name} value={s.name} />)

    })
    return result;
  }

  const handleChange = (newValue: string) => {
    setSelectedTab(newValue);
    const scrollTop = document.getElementById("section-" + newValue).offsetTop - 50;
    window.scrollTo({top: scrollTop, behavior: "smooth"});
  };

  const handleHighlight = () => {
    const elements = document.getElementsByClassName("sectionCard");
    let maxTop=0;
    let result = "";
    for (let i=0;i<elements.length;i++) {
      const el:any = elements[i];
      if (window.scrollY>=el.offsetTop - 60 && el.offsetTop>0) {
        if (el.offsetTop > maxTop) {
          maxTop = el.offsetTop;
          result=el.id.replace("section-", "");
        }
      }
    }

    if (result !== selectedTab) setSelectedTab(result);
  }

  useEffect(() => {
    //window.addEventListener('scroll', handleHighlight);

    setTimeout(() => { sendHeight(); }, 300);


  //  return () => {
    //      window.removeEventListener('scroll', handleHighlight);
    //};
  }, []);




  return (
    <div style={{backgroundColor:"#fff"}}>
      <Layout withoutNavbar={true} withoutFooter={true}>


        <div style={{textAlign:"right", marginBottom:30}}>
          <SmallButton icon="print" text="Print" onClick={() => { setShowPrintPreview(true) }} />
        </div>

        <div className="b1">

          {getVenue()}
        </div>
        <br />
      </Layout>
      {showPrintPreview && <OlfPrintPreview feed={venue} onClose={() => { setShowPrintPreview(false) }} /> }
    </div>
  );
}
