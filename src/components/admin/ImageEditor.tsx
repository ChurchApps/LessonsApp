import React, { useEffect } from "react";
import Cropper from "react-cropper";
import "cropperjs/dist/cropper.css";
import { InputBox } from "../index";
import { SmallButton } from "@/appBase/components";

type Props = {
  imageUrl: string;
  updatedFunction: (dataUrl: string) => void;
  onCancel: () => void;
};

export function ImageEditor(props: Props) {
  const [currentUrl, setCurrentUrl] = React.useState("about:blank");
  const [dataUrl, setDataUrl] = React.useState(null);
  let timeout: any = null;

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    let files;
    if (e.target) files = e.target.files;
    const reader = new FileReader();
    reader.onload = () => {
      let url = reader.result.toString();
      setCurrentUrl(url);
      setDataUrl(url);
    };
    reader.readAsDataURL(files[0]);
  };

  const getHeaderButton = () => (
    <div>
      <input type="file" onChange={handleUpload} id="fileUpload" accept="image/*" style={{ display: "none" }} />
      <SmallButton text="Upload" onClick={() => { document.getElementById("fileUpload").click(); }} icon="upload" />
    </div>
  );

  const cropper = React.useRef(null);

  const cropCallback = () => {
    if (cropper.current !== null) {
      let url = cropper.current
        .getCroppedCanvas({ width: 1280, height: 720 })
        .toDataURL();
      setDataUrl(url);
    }
  };

  const handleCrop = () => {
    if (timeout !== null) {
      window.clearTimeout(timeout);
      timeout = null;
    }
    timeout = window.setTimeout(cropCallback, 200);
  };

  const handleSave = () => props.updatedFunction(dataUrl);
  const handleDelete = () => props.updatedFunction("");

  useEffect(() => { setCurrentUrl(props.imageUrl || "/images/blank.png"); }, [props.imageUrl]);

  return (
    <InputBox id="cropperBox" headerIcon="" headerText="Crop" saveFunction={handleSave} saveText={"Update"} cancelFunction={props.onCancel} deleteFunction={handleDelete} headerActionContent={getHeaderButton()}>
      <Cropper ref={cropper} src={currentUrl} style={{ height: 240, width: "100%" }} aspectRatio={16 / 9} guides={false} crop={handleCrop} />
    </InputBox>
  );
}
