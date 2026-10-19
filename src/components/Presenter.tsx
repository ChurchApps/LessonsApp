import { useEffect, useState } from "react";
import { IconButton } from "@mui/material";
import { Close as CloseIcon } from "@mui/icons-material";
import { SimpleCarousel } from "./SimpleCarousel";
import { PlaylistFileInterface } from "@/helpers";
import { PresenterSlide } from "./PresenterSlide";

interface Props { files: PlaylistFileInterface[]; onClose: () => void; }

export function Presenter(props: Props) {
  const [index, setIndex] = useState<number>(0);
  const [pendingGoBack, setPendingGoBack] = useState<number>(0);
  const [pendingGoForward, setPendingGoForward] = useState<number>(0);

  const handleFullScreenChanged = () => { if (!document.fullscreenElement) props.onClose(); };

  const upHandler = (data: KeyboardEvent) => {
    if (data.key.toString() === "ArrowLeft") setPendingGoBack(Math.random());

    if (data.key.toString() === "ArrowRight") setPendingGoForward(Math.random());

    if (data.key.toString() === "Escape" && !document.fullscreenElement) props.onClose();
  };

  const handleClose = () => {
    if (document.fullscreenElement) document.exitFullscreen().catch(() => props.onClose());
    else props.onClose();
  };

  useEffect(() => {
    const element = document.getElementById("presenter");
    if (element) {
      // Fullscreen can be refused (expired gesture, iframe, iPhone); the fixed overlay and close button still work.
      element.requestFullscreen?.().catch(() => null);
      element.addEventListener("fullscreenchange", handleFullScreenChanged);
    }
    window.addEventListener("keyup", upHandler);
    return () => { window.removeEventListener("keyup", upHandler); element?.removeEventListener("fullscreenchange", handleFullScreenChanged); };
  }, []);

  useEffect(() => { if (pendingGoBack !== 0 && index > 0) setIndex(index - 1); }, [pendingGoBack]);
  useEffect(() => { if (pendingGoForward !== 0 && index < props.files?.length - 1) setIndex(index + 1); }, [pendingGoForward]);

  return (
    <div id="presenter" style={{ position: "fixed", inset: 0, zIndex: 1300, backgroundColor: "#000" }}>
      <IconButton aria-label="Close presenter" onClick={handleClose} sx={{ position: "absolute", top: 8, right: 8, zIndex: 2, color: "#fff", backgroundColor: "rgba(0,0,0,0.4)", "&:hover": { backgroundColor: "rgba(0,0,0,0.6)" } }}>
        <CloseIcon />
      </IconButton>
      <SimpleCarousel
        height={"100vh"}
        autoPlay={false}
        fullHeightHover={true}
        navButtonsAlwaysVisible={false}
        next={next => { setIndex(next); }}
        index={index}>
        {props.files.map((f, i) => (
          <div key={i}>{i === index ? <PresenterSlide file={f} /> : <div></div>}</div>
        ))}
      </SimpleCarousel>
    </div>
  );
}
