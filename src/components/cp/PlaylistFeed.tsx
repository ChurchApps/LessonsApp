import { useState, useEffect } from "react";
import { FormGroup, FormControl, FormLabel } from "react-bootstrap";
import { InputBox, ErrorMessages } from "../index";
import { ApiHelper, ClassroomInterface } from "@/utils";
import { VenueInterface } from "@/utils/interfaces";

type Props = {
  classroomId: string;
  hideFeed: () => void;
};

export function PlaylistFeed(props: Props) {
  const [venues, setVenues] = useState<VenueInterface[]>([]);
  const [venueName, setVenueName] = useState("")

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    e.preventDefault();
    setVenueName(e.currentTarget.value);
  };

  const handleCancel = () => {
    props.hideFeed();
  };

  const loadData = () => {
    ApiHelper.get("/venues/names/classroom/" + props.classroomId, "LessonsApi").then((data: any) => {
      setVenues(data);
      if (data.length > 0) setVenueName(data[0].name);
    });
  }

  useEffect(loadData, [props.classroomId]);

  const getContents = () => {
    if (venues.length == 0) return getNoVenues();
    else return getVenues();
  }

  const getNoVenues = () => {
    return <p>There are currently no schedules for this room.  Schedule at least one session first.</p>
  }

  const getVenueOptions = () => {
    const result: JSX.Element[] = [];
    venues.forEach(v => {
      result.push(<option>{v.name}</option>);
    });
    return result;
  }

  const getFeedUrl = () => {
    return "https://api.lessons.church/classrooms/playlist/" + props.classroomId + "?venueName=" + escape(venueName);
  }

  const getVenues = () => {
    return (<>
      <FormGroup>
        <FormLabel>Venue</FormLabel>
        <FormControl as="select" name="name" value={venueName} onChange={handleChange}>
          {getVenueOptions()}
        </FormControl>
      </FormGroup>
      <FormGroup>
        <FormLabel>Feed Url</FormLabel>
        <FormControl type="text" name="feedUrl" value={getFeedUrl()} />
      </FormGroup>
    </>);

  }

  return (
    <>
      <InputBox id="feedBox" headerText="Get Feed" headerIcon="fas fa-rss" saveFunction={handleCancel} >
        {getContents()}
      </InputBox>
    </>
  );
}
