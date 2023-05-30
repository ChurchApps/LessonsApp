import { ApiHelper, PlaylistFileInterface, VenueInterface } from "@/utils";
import { useEffect, useState } from "react";
import Carousel from "react-material-ui-carousel";

type Props = {
  venue: VenueInterface;
};

export function Presenter(props: Props) {

  const [files, setFiles] = useState<PlaylistFileInterface[]>([]);

  const loadData = () => {
    ApiHelper.get("/venues/playlist/" + props.venue.id + "?mode=web", "LessonsApi").then(data => {
      const result: PlaylistFileInterface[] = [];
      data?.messages?.forEach((m:any) => {
        m.files?.forEach((f:PlaylistFileInterface) => { result.push(f) })
      });
      setFiles(result);
    });
  }

  useEffect(() => {
    loadData();
    const element = document.getElementById("presenter");
    if (element) element.requestFullscreen();
  }, []);

  return (
    <div id="presenter">
      <p>Hello World {props.venue.id}</p>
      <Carousel height={"100vh"} autoPlay={false} fullHeightHover={true} navButtonsAlwaysVisible={true}>
        {files.map((f, i) => <div key={i}><img src={f.url || ""} alt={f.name + " - " + f.url} style={{ height: "auto" }} /></div>)}
      </Carousel>
    </div>
  )
}
