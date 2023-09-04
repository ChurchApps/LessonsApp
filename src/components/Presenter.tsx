import { ApiHelper, PlaylistFileInterface, VenueInterface } from "@/utils";
import { useEffect, useState } from "react";
import Carousel from "react-material-ui-carousel";
import { PresenterSlide } from "./PresenterSlide";
import { AnalyticsHelper } from "@churchapps/apphelper";

type Props = {
  venue: VenueInterface;
  onClose: () => void;
};

export function Presenter(props: Props) {

  const [files, setFiles] = useState<PlaylistFileInterface[]>([]);
  const [index, setIndex] = useState<number>(0);
  const [pendingGoBack, setPendingGoBack] = useState<number>(0);
  const [pendingGoForward, setPendingGoForward] = useState<number>(0);

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

  const upHandler = (data:any) => {
    if (data.key.toString() === "ArrowLeft") { setPendingGoBack(Math.random()); }
    if (data.key.toString() === "ArrowRight") { setPendingGoForward(Math.random()); }
  }

  useEffect(() => {
    AnalyticsHelper.logEvent("Presenter", "Start", props.venue.name);
    loadData();
    const element = document.getElementById("presenter");
    if (element && window) {
      try { element.requestFullscreen(); }
      catch (ex) { props.onClose(); }
      element.addEventListener("fullscreenchange", handleFullScreenChanged);
    }
    window.addEventListener("keyup", upHandler);
    return () => {
      window.removeEventListener("keyup", upHandler);
      element?.removeEventListener("fullscreenchange", handleFullScreenChanged);
    };
  }, []);

  useEffect(() => { if (pendingGoBack !== 0 && index>0) setIndex(index-1); }, [pendingGoBack]);
  useEffect(() => { if (pendingGoForward !== 0 && index<files?.length-1) setIndex(index+1); }, [pendingGoForward]);


  return (
    <div id="presenter">
      <Carousel height={"100vh"} autoPlay={false} fullHeightHover={true} navButtonsAlwaysVisible={false} next={(next)  => { setIndex(next) } } index={index}>
        {files.map((f, i) => <div key={i}>
          {(i===index) ? <PresenterSlide file={f} /> : <div></div>}
        </div>)}
      </Carousel>
    </div>
  )
}
