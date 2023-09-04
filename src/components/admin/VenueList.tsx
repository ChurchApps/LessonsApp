import { useState, useEffect } from "react";
import Link from "next/link";
import { VenueInterface, ApiHelper } from "@/utils";
import { VenueEdit } from "../index";
import { DisplayBox, Loading, SmallButton } from "@churchapps/apphelper";
import { Icon } from "@mui/material";

type Props = {
  lessonId: string;
};

export function VenueList(props: Props) {
  const [venues, setVenues] = useState<VenueInterface[]>(null);
  const [editVenue, setEditVenue] = useState<VenueInterface>(null);

  const loadData = () => {
    if (props.lessonId)
      ApiHelper.get("/venues/lesson/" + props.lessonId, "LessonsApi").then(
        (data: any) => {
          setVenues(data);
        }
      );
  };

  const getRows = () => {
    const result: JSX.Element[] = [];
    venues.forEach((v) => {
      result.push(
        <tr className="venueRow" key={v.id}>
          <td>
            <Icon>map_marker</Icon>{" "}
            <Link href={"/admin/venue/" + v.id}>{v.name}</Link>
          </td>
          <td><SmallButton icon="edit" text="Edit" onClick={() => { setEditVenue(v); }} /></td>
        </tr>
      );
    });
    return result;
  };

  const getTable = () => {
    //<thead><tr><th>Name</th></tr></thead>
    if (venues === null) return <Loading />;
    else
      return (
        <table className="table">
          <tbody>{getRows()}</tbody>
        </table>
      );
  };

  const getEditContent = () => (<SmallButton icon="add" onClick={() => { setEditVenue({ lessonId: props.lessonId }); }} />);

  useEffect(loadData, [props.lessonId]);

  if (editVenue) return (<VenueEdit venue={editVenue} updatedCallback={() => { setEditVenue(null); loadData(); }} />);
  else
    return (<DisplayBox headerText="Venues" headerIcon="map_marker" editContent={getEditContent()}>
      {getTable()}
    </DisplayBox>);
}
