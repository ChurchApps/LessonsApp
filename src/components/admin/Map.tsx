import { useState, useEffect } from "react";
import { ApiHelper } from "@/helpers";
import { DisplayBox, DateHelper } from "@churchapps/apphelper";
import { ComposableMap, Geographies, Geography, ZoomableGroup, Marker } from "react-simple-maps"
import {Tooltip} from "react-tooltip";

interface Props {
  programId: string;
  startDate: Date;
  endDate: Date;
}

export const Map: React.FC<Props> = (props) => {

  const geoUrl = "/countries-10m.json"
  const [ipData, setIpData] = useState<any[]>([]);
  const [tooltipIp, setTooltipIp] = useState<any>(null);

  const loadData = () => {
    const dateString = "?startDate=" + DateHelper.formatHtml5Date(props.startDate) + "&endDate=" + DateHelper.formatHtml5Date(props.endDate);
    ApiHelper.get("/downloads/" + props.programId + "/geo" + dateString, "LessonsApi").then(d => setIpData(d));
  }

  const getMarkers = () => {
    const result: JSX.Element[] = [];
    ipData.forEach(ip => {
      result.push(<Marker coordinates={[ip.lon, ip.lat]}><circle r={2} fill="#1976d2" onMouseOver={() => { setTooltipIp(ip) }} onMouseLeave={() => { setTooltipIp(null) }} /></Marker>);
    })
    //result.push(<Marker coordinates={[-95, 36]}><circle r={1} fill="#FF5533" /></Marker>);
    return result;
  }

  const getTooltip = () => {
    if (tooltipIp) {
      return <>
        {tooltipIp.city}, {tooltipIp.state}<br />
        {tooltipIp.country}<br />
        Total Downloads: {tooltipIp.totalDownloads}</>
    } else return ""
  }

  useEffect(() => { if (props.programId) { loadData(); } }, [props.startDate, props.endDate, props.programId]);

  return (
    <DisplayBox headerText="Map of Downloads" headerIcon="map">

      <div>
        <ComposableMap data-tip="">
          <ZoomableGroup center={[0, 0]} zoom={1}>
            <Geographies geography={geoUrl}>
              {({ geographies }) => geographies.map(geo =>
                <Geography key={geo.rsmKey} geography={geo} fill="#9998A3" stroke="#EAEAEC" />
              )}
            </Geographies>
            {getMarkers()}
          </ZoomableGroup>
        </ComposableMap>
        <Tooltip>{getTooltip()}</Tooltip>
      </div>
    </DisplayBox>
  );
}
