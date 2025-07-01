import { PlaylistFileInterface } from "@/helpers";
import { useEffect, useState } from "react";
import Carousel from "react-material-ui-carousel";
import { PresenterSlide } from "./PresenterSlide";

interface Props {
  files: PlaylistFileInterface[];
  onClose: () => void;
}

export function Presenter(props: Props) {

  const [index, setIndex] = useState<number>(0);
  const [pendingGoBack, setPendingGoBack] = useState<number>(0);
  const [pendingGoForward, setPendingGoForward] = useState<number>(0);


  const handleFullScreenChanged = () => {
    if (!document.fullscreenElement) props.onClose();
  }

  const upHandler = (data: KeyboardEvent) => {
    if (data.key.toString() === "ArrowLeft") { setPendingGoBack(Math.random()); }
    if (data.key.toString() === "ArrowRight") { setPendingGoForward(Math.random()); }
  }

  useEffect(() => {
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
  useEffect(() => { if (pendingGoForward !== 0 && index<props.files?.length-1) setIndex(index+1); }, [pendingGoForward]);


  return (
    <div id="presenter">
      <Carousel height={"100vh"} autoPlay={false} fullHeightHover={true} navButtonsAlwaysVisible={false} next={(next)  => { setIndex(next) } } index={index}>
        {props.files.map((f, i) => <div key={i}>
          {(i===index) ? <PresenterSlide file={f} /> : <div></div>}
        </div>)}
      </Carousel>
    </div>
  )
}
