import React from "react";
import { VenueInterface, ApiHelper, Loading, Venue } from ".";


interface Props {
  lessonId: string
}

export const Venues: React.FC<Props> = (props) => {

  const [venues, setVenues] = React.useState<VenueInterface[]>(null);

  const loadData = () => {
    if (props.lessonId !== "") ApiHelper.getAnonymous("/venues/public/lesson/" + props.lessonId, "LessonsApi").then(data => setVenues(data));
  };

  React.useEffect(() => { loadData() }, [props.lessonId]);

  const getVenues = () => {
    if (venues === null) return <Loading />
    else {
      const result: JSX.Element[] = [];
      venues.forEach(v => { result.push(<Venue venue={v} />) });
      return <>{result}</>;
    }
  }

  return (<>
    <br /><br />
    <h3>Outlines</h3>
    {getVenues()}
  </>);
}
