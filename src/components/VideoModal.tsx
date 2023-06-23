import { Button, Dialog, DialogActions, DialogContent, DialogTitle } from "@mui/material";
import React from "react";

interface Props {
  onClose: () => void,
  vimeoId?: string,
  url?: string,
  loopVideo?: boolean
}

export const VideoModal: React.FC<Props> = (props: Props) => {

  const getVimeo = (vimeoId:string) => (<>
    <div style={{ padding: "56.25% 0 0 0", position: "relative" }}>
      <iframe src={"https://player.vimeo.com/video/" + vimeoId + "?h=ceb1d1ff2b&autoplay=1&title=0&byline=0&portrait=0" + (props.loopVideo === true ? "&loop=1" : "&loop=0")}
        style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%" }}
        frameBorder="0" allow="autoplay; fullscreen; picture-in-picture" allowFullScreen={true}></iframe>
    </div>
    <script async src="https://player.vimeo.com/api/player.js"></script>
  </>)

  const getYoutube = (youtubeId:string) => (<>
    <div style={{ padding: "56.25% 0 0 0", position: "relative" }}>
      <iframe src={"https://www.youtube.com/embed/" + youtubeId + "?autoplay=1"}
        style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%" }}
        frameBorder="0" allow="autoplay; fullscreen; picture-in-picture" allowFullScreen={true}></iframe>
    </div>
  </>)

  const getVideoElement = () => {
    let result = <></>;
    if (props.vimeoId) result = getVimeo(props.vimeoId);
    else {
      console.log("url", props.url);
      if (props.url.startsWith("https://www.youtube.com/embed/"))
      {
        const youtubeId = props.url.split("?")[0].replace("https://www.youtube.com/embed/", "");
        result = getYoutube(youtubeId);
      } else if (props.url.startsWith("https://player.vimeo.com/video/")) {
        const vimeoId = props.url.split("?")[0].replace("https://player.vimeo.com/video/", "");
        result = getVimeo(vimeoId);
      }
    }
    return result;
  }

  return (<>
    <Dialog open={true} onClose={props.onClose} fullScreen={true}>
      <DialogTitle>Preview Video</DialogTitle>
      <DialogContent>
        <div style={{ minWidth: 500 }}>
          {getVideoElement()}
        </div>
      </DialogContent>
      <DialogActions sx={{ paddingX: "16px", paddingBottom: "12px" }}>
        <Button variant="outlined" onClick={props.onClose}>Close</Button>
      </DialogActions>
    </Dialog>
  </>)
};
