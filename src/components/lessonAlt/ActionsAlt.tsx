import React, { useState } from "react";
import { ResourceInterface, ArrayHelper, ActionInterface, VariantInterface, AssetInterface, UserHelper, ApiHelper, FileInterface, ExternalVideoInterface, CustomizationHelper } from "@/utils";
import { VideoModal } from "../VideoModal";
import { MarkdownPreview } from "../index"
import Image from "next/image";
import { AnalyticsHelper } from "@/appBase/helpers";
import { CommonEnvironmentHelper } from "@/appBase/helpers/CommonEnvironmentHelper";
import { TabList, TabContext } from "@mui/lab";
import { Tab, Box } from "@mui/material";
import { ActionAlt } from "./ActionAlt";

type Props = {
  actions: ActionInterface[];
  resources: ResourceInterface[];
  externalVideos: ExternalVideoInterface[];
  lessonId: string;
};

export function ActionsAlt(props: Props) {
  let showScript = false;
  let showNotes = false;

  props.actions.forEach((action) => {
    if (action.actionType==="Say" || action.actionType==="Do") showScript = true;
    if (action.actionType==="Note") showNotes = true;
  });

  const [selectedTab, setSelectedTab] = useState((showScript) ? "Script" : "Notes");
  const [showMore, setShowMore] = useState(false);


  const getActionTabs = () => {
    const tabs:JSX.Element[] = [];
    if (showScript) tabs.push(<Tab label={"Script"} value={"Script"} />);
    if (showNotes) tabs.push(<Tab label={"Notes"} value={"Notes"} />);

    return (<Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
      <TabList onChange={(e, newValue) => {setSelectedTab(newValue);}} variant="scrollable">
        {tabs}
      </TabList>
    </Box>);
  }

  const getActions = (actionTypes:string[]) => {
    const result: JSX.Element[] = [];
    props.actions.forEach((a) => {
      if (actionTypes.includes(a.actionType)) {
        result.push(<ActionAlt action={a} resources={props.resources} externalVideos={props.externalVideos} key={a.id} lessonId={props.lessonId} />);
      }
    });

    if ((showScript || showNotes) && !showMore) {
      return (<>
        <div className="limitedText">{result}</div>
        <div style={{textAlign:"center"}}>
          <a href="about:blank" onClick={(e) => { e.preventDefault(); setShowMore(true); }}>Show More</a>
        </div>
      </>);
    } else return result;
  }



  return <><TabContext value={selectedTab}>
    {getActionTabs()}
    {selectedTab==="Script" && (<div>{getActions(["Say", "Do", "Play"])}</div>)}
    {selectedTab==="Notes" && (<div>{getActions(["Note"])}</div>)}
  </TabContext>
  </>;

}
