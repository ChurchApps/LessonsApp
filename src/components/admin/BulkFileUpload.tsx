import { useState, useEffect } from "react";
import axios from "axios";
import { ApiHelper, FileInterface } from "@/helpers";
import { LinearProgress } from "@mui/material";

interface Props {
  resourceId: string;
  pendingSave: boolean;
  saveCallback: (files: FileInterface[]) => void;
}

export function BulkFileUpload(props: Props) {
  const [uploadedFiles, setUploadedFiles] = useState<FileList>(null);
  const [uploadProgress, setUploadProgress] = useState(-1);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    setUploadedFiles(e.target.files);
  };

  const handleSave = async () => {
    const files: FileInterface[] = [];
    for (let i = 0; i < uploadedFiles.length; i++) {
      const uf = uploadedFiles[i];
      files.push({ size: uf.size, fileType: uf.type, fileName: uf.name, resourceId: props.resourceId });
    }
    await preUpload();
    const data: FileInterface[] = await ApiHelper.post("/files", files, "LessonsApi");
    props.saveCallback(data);
  };

  const checkSave = () => { if (props.pendingSave) handleSave(); };

  const preUpload = async () => {
    for (let i = 0; i < uploadedFiles.length; i++) {
      const uf = uploadedFiles[i];
      const params = { resourceId: props.resourceId, fileName: uf.name, };
      const presigned = await ApiHelper.post("/files/postUrl", params, "LessonsApi");
      const doUpload = presigned.key !== undefined;
      if (doUpload) await postPresignedFile(presigned, uf, i);
    }
  };

  //This will throw a CORS error if ran from localhost
  const postPresignedFile = (presigned: any, uploadedFile: File, index: number) => {
    const formData = new FormData();
    formData.append("key", presigned.key);
    formData.append("acl", "public-read");
    formData.append("Content-Type", uploadedFile.type);
    for (const property in presigned.fields) formData.append(property, presigned.fields[property]);
    const f: any = document.getElementById("fileUpload");
    formData.append("file", uploadedFile);

    const completedPercent = Math.round((index / uploadedFiles.length) * 100);

    const axiosConfig = {
      headers: { "Content-Type": "multipart/form-data", },
      onUploadProgress: (data: any) => {
        const currentFilePercent = Math.round((100 * data.loaded) / data.total);
        let overallPercent = completedPercent + Math.round(currentFilePercent / uploadedFiles.length);
        setUploadProgress(overallPercent);
      },
    };

    return axios.post(presigned.url, formData, axiosConfig);
  };

  useEffect(checkSave, [props.pendingSave]); //eslint-disable-line

  const getFileLink = () => {
    if (uploadProgress > -1) {
      return <LinearProgress value={uploadProgress} />;
    } else return <br />
  };

  return (
    <>
      <label>Files:</label>
      {getFileLink()}
      <input id="fileUpload" type="file" onChange={handleChange} multiple={true} />
    </>
  );
}
