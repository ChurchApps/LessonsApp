import { useState, useEffect } from "react";
import Link from "next/link";
import { VenueInterface, ApiHelper } from "@/utils";
import { DisplayBox, Loading, VenueEdit } from "../index";

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
            <i className="fas fa-map-marker"></i>{" "}
            <Link href={"/admin/venue/" + v.id}>
              <a>{v.name}</a>
            </Link>
          </td>
          <td>
            <a
              href="about:blank"
              onClick={(e) => {
                e.preventDefault();
                setEditVenue(v);
              }}
            >
              <i className="fas fa-pencil-alt"></i>
            </a>
          </td>
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

  const getEditContent = () => {
    return (
      <a
        href="about:blank"
        onClick={(e) => {
          e.preventDefault();
          setEditVenue({ lessonId: props.lessonId });
        }}
      >
        <i className="fas fa-plus"></i>
      </a>
    );
  };

  useEffect(loadData, [props.lessonId]);

  if (editVenue)
    return (
      <VenueEdit
        venue={editVenue}
        updatedCallback={() => {
          setEditVenue(null);
          loadData();
        }}
      />
    );
  else
    return (
      <>
        <DisplayBox
          headerText="Venues"
          headerIcon="fas fa-map-marker"
          editContent={getEditContent()}
        >
          {getTable()}
        </DisplayBox>
      </>
    );
}
