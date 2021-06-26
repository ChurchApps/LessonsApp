import React from "react";
import { DisplayBox, ApiHelper, VenueInterface, Loading, VenueEdit } from "./"
import { Link } from "react-router-dom"

interface Props { lessonId: string }

export const VenueList: React.FC<Props> = (props) => {
  const [venues, setVenues] = React.useState<VenueInterface[]>(null);
  const [editVenue, setEditVenue] = React.useState<VenueInterface>(null);

  const loadData = () => {
    if (props.lessonId) ApiHelper.get("/venues/lesson/" + props.lessonId, "LessonsApi").then((data: any) => { setVenues(data); });
  };

  const getRows = () => {
    const result: JSX.Element[] = [];
    venues.forEach(v => {
      result.push(<tr className="venueRow">
        <td><i className="fas fa-map-marker"></i> <Link to={"/admin/venue/" + v.id}>{v.name}</Link></td>
        <td><a href="about:blank" onClick={(e) => { e.preventDefault(); setEditVenue(v); }}><i className="fas fa-pencil-alt"></i></a></td>
      </tr>);
    });
    return result;
  }

  const getTable = () => {
    //<thead><tr><th>Name</th></tr></thead>
    if (venues === null) return <Loading />
    else return (
      <table className="table">
        <tbody>
          {getRows()}
        </tbody>
      </table>
    )
  }


  const getEditContent = () => {
    return (<a href="about:blank" onClick={(e) => { e.preventDefault(); setEditVenue({ lessonId: props.lessonId }) }}><i className="fas fa-plus"></i></a>);
  }

  React.useEffect(loadData, [props.lessonId]);

  if (editVenue) return <VenueEdit venue={editVenue} updatedCallback={() => { setEditVenue(null); loadData() }} />
  else return (<>
    <DisplayBox headerText="Venues" headerIcon="fas fa-map-marker" editContent={getEditContent()} >
      {getTable()}
    </DisplayBox>
  </>);
}
