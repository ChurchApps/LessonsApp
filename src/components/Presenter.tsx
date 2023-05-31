import { ApiHelper, PlaylistFileInterface, VenueInterface } from "@/utils";
import { useEffect, useState } from "react";
import Carousel from "react-material-ui-carousel";
import { PresenterSlide } from "./PresenterSlide";

type Props = {
  venue: VenueInterface;
  onClose: () => void;
};

export function Presenter(props: Props) {

  const [files, setFiles] = useState<PlaylistFileInterface[]>([]);
  const [index, setIndex] = useState<number>(0);

  const loadData = () => {
    ApiHelper.get("/venues/playlist/" + props.venue.id + "?mode=web", "LessonsApi").then(data => {
      const result: PlaylistFileInterface[] = [];
      data?.messages?.forEach((m:any) => {
        m.files?.forEach((f:PlaylistFileInterface) => { result.push(f) })
      });
      setFiles(result);
    });
  }

  const handleFullScreenChanged = () => {
    if (!document.fullscreenElement) props.onClose();
  }

  useEffect(() => {
    loadData();
    const element = document.getElementById("presenter");
    if (element && window) {
      try { element.requestFullscreen(); }
      catch (ex) { props.onClose(); }
      element.addEventListener("fullscreenchange", handleFullScreenChanged);
    }

  }, []);

  return (
    <div id="presenter">
      <Carousel height={"100vh"} autoPlay={false} fullHeightHover={true} navButtonsAlwaysVisible={true} next={(next, active)  => { setIndex(next) } }>
        {files.map((f, i) => <div key={i}>
          {(i===index) ? <PresenterSlide file={f} /> : <div></div>}
        </div>)}
      </Carousel>
    </div>
  )
}
