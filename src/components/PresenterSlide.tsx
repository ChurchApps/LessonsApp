import { PlaylistFileInterface } from "@/utils";


type Props = {
  file: PlaylistFileInterface;
};

export function PresenterSlide(props: Props) {

  let result = <img src={props.file.url || ""} alt={props.file.name} style={{ maxWidth:"100%", maxHeight: "100%" }} />
  const url = props.file.url;
  if (url.startsWith("vimeo:")) {
    const vimeoId = url.replace("vimeo:", "");
    result = <>
      <iframe src={"https://player.vimeo.com/video/" + vimeoId + "?h=ceb1d1ff2b&autoplay=1&title=0&byline=0&portrait=0" + (props.file.loopVideo === true ? "&loop=1" : "&loop=0")} style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%" }} allow="autoplay; fullscreen" allowFullScreen></iframe>
      <script async src="https://player.vimeo.com/api/player.js"></script>
    </>
  } else if (url.indexOf(".mp4")>-1 || url.indexOf(".webm")>-1) {
    result = <video src={props.file.url || ""} style={{ width:"100vw", height: "100vh" }} autoPlay={true} />
  }


  return result;
}
