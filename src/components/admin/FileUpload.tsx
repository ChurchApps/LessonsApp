import { useState, useEffect } from "react";
import { FormGroup, FormLabel, ProgressBar } from "react-bootstrap";
import axios from "axios";
import { ApiHelper, FileInterface } from "@/utils";

type Props = {
  resourceId: string;
  fileId: string;
  pendingSave: boolean;
  saveCallback: (file: FileInterface) => void;
};

export function FileUpload(props: Props) {
  const [file, setFile] = useState<FileInterface>({} as FileInterface);
  const [uploadedFile, setUploadedFile] = useState<File>({} as File);
  const [uploadProgress, setUploadProgress] = useState(-1);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    setUploadedFile(e.target.files[0]);
  };

  const loadData = () => {
    if (props.fileId)
      ApiHelper.get("/files/" + props.fileId, "LessonsApi").then(
        (data: FileInterface) => {
          data.resourceId = props.resourceId;
          setFile(data);
        }
      );
    else {
      setFile({ resourceId: props.resourceId });
    }
  };

  const convertBase64 = () => {
    return new Promise((resolve, reject) => {
      const fileReader = new FileReader();
      fileReader.readAsDataURL(uploadedFile);
      fileReader.onload = () => {
        resolve(fileReader.result);
      };
      fileReader.onerror = (error) => {
        reject(error);
      };
    });
  };

  const handleSave = async () => {
    const f = { ...file };
    f.size = uploadedFile.size;
    f.fileType = uploadedFile.type;
    f.fileName = uploadedFile.name;

    const preUploaded: boolean = await preUpload();
    if (!preUploaded) {
      const base64 = await convertBase64();
      f.fileContents = base64 as string;
    }
    const data: FileInterface[] = await ApiHelper.post(
      "/files",
      [f],
      "LessonsApi"
    );
    setFile(data[0]);
    props.saveCallback(data[0]);
  };

  const checkSave = () => {
    if (props.pendingSave) {
      if (uploadedFile.size > 0) handleSave();
      else props.saveCallback(file);
    }
  };

  const preUpload = async () => {
    const params = {
      resourceId: props.resourceId,
      fileName: uploadedFile.name,
    };
    const presigned = await ApiHelper.post(
      "/files/postUrl",
      params,
      "LessonsApi"
    );
    const doUpload = presigned.key !== undefined;
    if (doUpload) await postPresignedFile(presigned);
    return doUpload;
  };

  //This will throw a CORS error if ran from localhost
  const postPresignedFile = (presigned: any) => {
    const formData = new FormData();
    formData.append("key", presigned.key);
    formData.append("acl", "public-read");
    formData.append("Content-Type", uploadedFile.type);
    for (const property in presigned.fields)
      formData.append(property, presigned.fields[property]);
    const f: any = document.getElementById("fileUpload");
    formData.append("file", f.files[0]);
    //const requestOptions: RequestInit = { method: "POST", body: formData };

    const axiosConfig = {
      headers: {
        "Content-Type": "multipart/form-data",
      },
      onUploadProgress: (data: any) => {
        setUploadProgress(Math.round((100 * data.loaded) / data.total));
      },
    };

    return axios.post(presigned.url, formData, axiosConfig);
    //return fetch(presigned.url, requestOptions);
  };

  useEffect(loadData, [props.fileId, props.resourceId]);
  useEffect(
    checkSave,
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [props.pendingSave]
  );

  const getFileLink = () => {
    if (uploadProgress > -1) {
      return <ProgressBar now={uploadProgress} />;
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
      <FormGroup>
        <FormLabel>File</FormLabel>
        {getFileLink()}
        <input id="fileUpload" type="file" onChange={handleChange} />
      </FormGroup>
    </>
  );
}
