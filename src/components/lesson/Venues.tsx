import { VenueInterface, ResourceInterface, ArrayHelper, BundleInterface, ExternalVideoInterface } from "@/utils";
import { Venue } from "./Venue";
import { Box, Tab } from "@mui/material";
import { useState } from "react";
import { TabContext, TabList, TabPanel } from "@mui/lab";

type Props = {
  useAccordion: boolean;
  venues: VenueInterface[];
  resources: ResourceInterface[];
  externalVideos: ExternalVideoInterface[];
  bundles: BundleInterface[];
};

export function Venues(props: Props) {
  const [selectedTab, setSelectedTab] = useState((props.venues?.length > 0) ? props.venues[0]?.id  || "" : "");

  const venueViews = props.venues.map((v, idx) => {
    const resources: ResourceInterface[] = [];

    v.sections?.forEach((s) => {
      s.roles?.forEach((r) => {
        r.actions?.forEach((a) => {
          if (a.resourceId) {
            if (props.resources) {
              const r: ResourceInterface = ArrayHelper.getOne(props.resources, "id", a.resourceId);
              if (r && resources.indexOf(r) === -1) resources.push(r);
            }
          }
        });
      });
    });

    const bundleIds = ArrayHelper.getUniqueValues(resources, "bundleId");
    const bundles = ArrayHelper.getAllArray(props.bundles, "id", bundleIds)
    resources.sort((a, b) => (a.name > b.name ? 1 : -1));

    if (props.venues.length === 1 || props.useAccordion) return (<Venue useAccordion={props.useAccordion} venue={v} resources={resources} externalVideos={props.externalVideos} bundles={bundles} print={0} />);
    else return (
      <TabPanel value={v.id} style={{paddingLeft:0, paddingRight:0}}>
        <Venue useAccordion={props.useAccordion} venue={v} resources={resources} externalVideos={props.externalVideos} bundles={bundles} print={0} />
      </TabPanel>
    );
  });

  const getVenueTabs = () => {
    if (props.venues.length === 1 || props.useAccordion) return (<></>);
    const tabs:JSX.Element[] = [];
    props.venues.forEach((v) => { tabs.push(<Tab label={v.name} value={v.id} />) });
    return (<Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
      <TabList onChange={(e, newValue) => {setSelectedTab(newValue);}} variant="scrollable">
        {tabs}
      </TabList>
    </Box>);
  }



  return <><TabContext value={selectedTab}>
    {getVenueTabs()}
    <div>{venueViews}</div>
  </TabContext>
  </>;
}
