import { Button, Dialog, DialogActions, DialogContent, DialogTitle } from "@mui/material";
import React from "react";
import Image from "next/image";

interface Props {
  onClose: () => void,
  url?: string,
}

export const ImageModal: React.FC<Props> = (props: Props) => {


  const getImageElement = () => <Image src={props.url} alt="lesson slide" width={1280} height={720} style={{ maxWidth:"100%", maxHeight:"80%" }} />

  return (<>
    <Dialog open={true} onClose={props.onClose} fullScreen={true}>
      <DialogTitle>Slide Preview</DialogTitle>
      <DialogContent>
        <div style={{ minWidth: 500 }}>
          {getImageElement()}
        </div>
      </DialogContent>
      <DialogActions sx={{ paddingX: "16px", paddingBottom: "12px" }}>
        <Button variant="outlined" onClick={props.onClose}>Close</Button>
      </DialogActions>
    </Dialog>
  </>)
};
