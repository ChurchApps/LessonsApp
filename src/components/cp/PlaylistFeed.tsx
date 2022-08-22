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

  const getClassroomUrl = () => {
    return "https://lessons.church/classroom/" + props.classroomId;
  }

  return (
    <>
      <InputBox id="feedBox" headerText="Subscribe" headerIcon="rss_feed" saveFunction={handleCancel} saveText="Done" >
        <b>Display in Your Classroom</b>
        <p>See the bottom of this page for instructions on how to display lessons in your classroom using the Lesson.church app and get leader instructions via the B1.church app.</p>
        <b>Use with Digital Signage</b>
        <p>For use with external digital signage software, right click and copy <a href={getFeedUrl()} target="_blank" rel="noreferrer nooppener">this url</a>.  Follow <a href="https://support.signpresenter.com/topics/lessons-dot-church.html" target="_blank" rel="noreferrer nooppener">these instructions</a> to connect to SignPresenter.</p>
        <b>Share Your Current Lesson</b>
        <p>Link to <a href={getClassroomUrl()} target="_blank" rel="noreferrer nooppener">this page</a> to easily share with your students (or parents) what was studied each week.  You can customize the look by uploading a church logo <a href="https://accounts.churchapps.org/" target="_blank" rel="noreferrer nooppener">here</a>.</p>
      </InputBox>
    </>
  );
}
