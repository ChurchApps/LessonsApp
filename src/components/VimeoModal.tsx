import { Button, Dialog, DialogActions, DialogContent, DialogTitle } from "@mui/material";
import React from "react";

interface Props {
  onClose: () => void,
  vimeoId: string
}

export const VimeoModal: React.FC<Props> = (props: Props) => (<>
  <Dialog open={true} onClose={props.onClose}>
    <DialogTitle>Preview Video</DialogTitle>
    <DialogContent>
      <div style={{ minWidth: 500 }}>
        <div style={{ padding: "56.25% 0 0 0", position: "relative" }}>
          <iframe src={"https://player.vimeo.com/video/" + props.vimeoId + "?h=ceb1d1ff2b&autoplay=1&title=0&byline=0&portrait=0"}
            style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%" }}
            frameBorder="0" allow="autoplay; fullscreen; picture-in-picture" allowFullScreen={true}></iframe>
        </div>
        <script async src="https://player.vimeo.com/api/player.js"></script>
      </div>
    </DialogContent>
    <DialogActions sx={{ paddingX: "16px", paddingBottom: "12px" }}>
      <Button variant="outlined" onClick={props.onClose}>Close</Button>
    </DialogActions>
  </Dialog>
</>);
