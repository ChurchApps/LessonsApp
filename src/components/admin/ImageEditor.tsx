import "cropperjs/dist/cropper.css";
import React, { useEffect } from "react";
import Cropper from "react-cropper";
import { InputBox, SmallButton } from "@churchapps/apphelper";

interface Props {
  imageUrl: string;
  updatedFunction: (dataUrl: string) => void;
  onCancel: () => void;
}

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
      const url = reader.result.toString();
      setCurrentUrl(url);
      setDataUrl(url);
      setTimeout(selectDefaultCropZone, 500);
    };
    reader.readAsDataURL(files[0]);
  };

  const getHeaderButton = () => (
    <div>
      <input type="file" onChange={handleUpload} id="fileUpload" accept="image/*" style={{ display: "none" }} />
      <SmallButton
        text="Upload"
        onClick={() => {
          document.getElementById("fileUpload").click();
        }}
        icon="upload"
      />
    </div>
  );

  const cropperRef = React.useRef(null);

  const selectDefaultCropZone = () => {
    const imageElement: any = cropperRef?.current;
    const cropper: any = imageElement?.cropper;
    const aspectRatio = 16 / 9;

    const desiredAspect = aspectRatio;
    const containerData = cropper.getContainerData();
    const imgAspect = cropper.getImageData().aspectRatio;
    const scale = imgAspect / desiredAspect;
    if (scale < 1) {
      const imgWidth = cropper.getImageData().width;
      const l = (containerData.width - imgWidth) / 2.0;
      const t = (containerData.height - containerData.height * scale) / 2.0;
      cropper.setCropBoxData({ width: imgWidth, height: imgWidth / desiredAspect, left: l, top: t });
    } else {
      const imgHeight = cropper.getImageData().height;
      const l = (containerData.width - imgHeight * desiredAspect) / 2.0;
      const t = cropper.canvasData.top;
      cropper.setCropBoxData({ width: imgHeight * desiredAspect, height: imgHeight, left: l, top: t });
    }
  };

  const cropCallback = () => {
    if (cropperRef.current !== null) {
      const url = cropperRef.current.cropper.getCroppedCanvas({ width: 1280, height: 720 }).toDataURL();
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

  useEffect(() => {
    setCurrentUrl(props.imageUrl || "/images/blank.png");
  }, [props.imageUrl]);

  return (
    <InputBox
      id="cropperBox"
      headerIcon=""
      headerText="Crop"
      saveFunction={handleSave}
      saveText={"Update"}
      cancelFunction={props.onCancel}
      deleteFunction={handleDelete}
      headerActionContent={getHeaderButton()}>
      <Cropper
        ref={cropperRef}
        src={currentUrl}
        style={{ height: 240, width: "100%" }}
        aspectRatio={16 / 9}
        guides={false}
        crop={handleCrop}
      />
    </InputBox>
  );
}
