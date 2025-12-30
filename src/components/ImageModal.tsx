import Image from "next/image";
import React from "react";
import { Button, Dialog, DialogActions, DialogContent, DialogTitle } from "@mui/material";

interface Props {
  onClose: () => void;
  url?: string;
}

export const ImageModal: React.FC<Props> = (props: Props) => {
  const getImageElement = () => {
    if (!props.url) return null;

    let result = <Image src={props.url} alt="lesson slide" width={1280} height={720} className="img-fluid" />;
    if (props.url.indexOf(".mp4") > -1 || props.url.indexOf(".webm") > -1) {
      result = (
        <div style={{ textAlign: "center" }}>
          <video src={props.url || ""} style={{ width: "75vw", height: "75vh" }} autoPlay={true} />
        </div>
      );
    }
    return result;
  };

  return (
    <>
      <Dialog open={true} onClose={props.onClose} fullScreen={true}>
        <DialogTitle>Slide Preview</DialogTitle>
        <DialogContent>
          <div style={{ minWidth: 500 }}>{getImageElement()}</div>
        </DialogContent>
        <DialogActions sx={{ paddingX: "16px", paddingBottom: "12px" }}>
          <Button variant="outlined" onClick={props.onClose}>
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};
