import axios from "axios";
import type { AxiosProgressEvent } from "axios";
import { useEffect, useState } from "react";
import { LinearProgress } from "@mui/material";
import { ApiHelper, FileInterface, PresignedUploadInterface } from "@/helpers";

interface Props {
  resourceId?: string;
  contentType?: string;
  contentId?: string;
  fileId: string;
  pendingSave: boolean;
  saveCallback: (file: FileInterface) => void;
}

export function FileUpload(props: Props) {
  const [file, setFile] = useState<FileInterface>({} as FileInterface);
  const [uploadedFile, setUploadedFile] = useState<File>({} as File);
  const [uploadProgress, setUploadProgress] = useState(-1);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    setUploadedFile(e.target.files[0]);
  };

  const loadData = () => {
    if (props.fileId) {
      ApiHelper.get("/files/" + props.fileId, "LessonsApi").then((data: FileInterface) => {
        data.resourceId = props.resourceId;
        setFile(data);
      });
    } else {
      setFile({ resourceId: props.resourceId });
    }
  };

  const convertBase64 = () =>
    new Promise((resolve, reject) => {
      const fileReader = new FileReader();
      fileReader.readAsDataURL(uploadedFile);
      fileReader.onload = () => {
        resolve(fileReader.result);
      };
      fileReader.onerror = error => {
        reject(error);
      };
    });

  const handleSave = async () => {
    const f = { ...file };
    f.size = uploadedFile.size;
    f.fileType = uploadedFile.type;
    f.fileName = uploadedFile.name;
    f.contentType = props.contentType;
    f.contentId = props.contentId;

    console.log("Handling file save", f);
    const preUploaded: boolean = await preUpload();
    console.log("Preuploaded", preUploaded);
    if (!preUploaded) {
      const base64 = await convertBase64();
      f.fileContents = base64 as string;
    }
    const data: FileInterface[] = await ApiHelper.post("/files", [f], "LessonsApi");
    setFile(data[0]);
    props.saveCallback(data[0]);
  };

  const checkSave = () => {
    console.log("CHECK SAVE", props.pendingSave);
    if (props.pendingSave) {
      if (uploadedFile.size > 0) handleSave();
      else props.saveCallback(file);
    }
  };

  const getResourcePresigned = async () => {
    const params = { resourceId: props.resourceId, fileName: uploadedFile.name };
    const presigned = await ApiHelper.post("/files/postUrl", params, "LessonsApi");
    return presigned;
  };

  const getOtherPresigned = async () => {
    const params = { fileName: uploadedFile.name };
    const presigned = await ApiHelper.post("/files/postUrl/content/" + props.contentType + "/" + props.contentId, params, "LessonsApi");
    return presigned;
  };

  const preUpload = async () => {
    const presigned = props.resourceId ? await getResourcePresigned() : await getOtherPresigned();
    const doUpload = presigned.key !== undefined;
    if (doUpload) await postPresignedFile(presigned);
    return doUpload;
  };

  //This will throw a CORS error if ran from localhost
  const postPresignedFile = (presigned: PresignedUploadInterface) => {
    const formData = new FormData();
    formData.append("acl", "public-read");
    formData.append("Content-Type", uploadedFile.type);
    for (const property in presigned.fields) formData.append(property, presigned.fields[property]);
    const f = document.getElementById("fileUpload") as HTMLInputElement;
    formData.append("file", f.files[0]);
    //const requestOptions: RequestInit = { method: "POST", body: formData };

    const axiosConfig = {
      headers: { "Content-Type": "multipart/form-data" },
      onUploadProgress: (data: AxiosProgressEvent) => {
        setUploadProgress(Math.round((100 * data.loaded) / (data.total || 1)));
      }
    };

    return axios.post(presigned.url, formData, axiosConfig);
  };

  useEffect(loadData, [props.fileId, props.resourceId]);
  useEffect(checkSave, [props.pendingSave]);

  const getFileLink = () => {
    if (uploadProgress > -1) {
      return <LinearProgress value={uploadProgress} />;
    } else if (file) {
      return (
        <div>
          <a href={file.contentPath}>{file.fileName}</a>
        </div>
      );
    }
  };

  return (
    <>
      <label>File</label>
      {getFileLink()}
      <input id="fileUpload" type="file" onChange={handleChange} />
    </>
  );
}
