import { useEffect, useRef } from "react";
import { PlaylistFileInterface } from "@/helpers";

interface Props {
  file: PlaylistFileInterface;
}

export function PresenterSlide(props: Props) {
  if (!props.file) return null;
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (!videoRef.current) return;
    videoRef.current.load();
    videoRef.current.play().catch(() => null);
  }, [props.file.url]);

  let result = (
    <img
      src={props.file.url || ""}
      alt={props.file.name}
      className="img-fluid"
      style={{ maxWidth: "100%", maxHeight: "100%" }}
    />
  );
  const url = props.file.url;
  if (url.startsWith("vimeo:")) {
    const vimeoId = url.replace("vimeo:", "");
    result = (
      <div style={{ position: "relative", width: "100vw", height: "100vh", backgroundColor: "#000" }}>
        <iframe
          key={vimeoId}
          src={
            "https://player.vimeo.com/video/" +
            vimeoId +
            "?h=ceb1d1ff2b&autoplay=1&title=0&byline=0&portrait=0" +
            (props.file.loopVideo === true ? "&loop=1" : "&loop=0")
          }
          style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", border: "none", zIndex: 1 }}
          allow="autoplay; fullscreen"
          allowFullScreen
        />
      </div>
    );
  } else if (url.indexOf(".mp4") > -1 || url.indexOf(".webm") > -1) {
    result = (
      <video
        key={url}
        ref={videoRef}
        src={props.file.url || ""}
        style={{ width: "100vw", height: "100vh" }}
        autoPlay={true}
        playsInline
      />
    );
  }

  return result;
}
