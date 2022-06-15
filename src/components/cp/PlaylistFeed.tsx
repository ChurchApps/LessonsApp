import { useState, useEffect } from "react";
import { InputBox } from "../index";
import { ApiHelper } from "@/utils";
import { VenueInterface } from "@/utils/interfaces";
import { TextField } from "@mui/material";

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


  const getFeedUrl = () => {
    return "https://api.lessons.church/classrooms/playlist/" + props.classroomId;
  }

  const getContents = () => {
    return (<TextField fullWidth multiline label="Feed Url" type="text" name="feedUrl" value={getFeedUrl()} />);
  }

  return (
    <>
      <InputBox id="feedBox" headerText="Get Feed" headerIcon="fas fa-rss" saveFunction={handleCancel} saveText="Done" >
        {getContents()}
      </InputBox>
    </>
  );
}
