import React from "react";
import { ApiHelper, FileInterface } from ".";
import { FormGroup, FormLabel } from "react-bootstrap";

interface Props {
  resourceId: string,
  fileId: string,
  pendingSave: boolean,
  saveCallback: (file: FileInterface) => void
}

export const FileUpload: React.FC<Props> = (props) => {
  const [file, setFile] = React.useState<FileInterface>({} as FileInterface);
  const [uploadedFile, setUploadedFile] = React.useState<File>({} as File);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    setUploadedFile(e.target.files[0]);
  }

  const loadData = () => {
    if (props.fileId) ApiHelper.get("/files/" + props.fileId, "LessonsApi").then((data: FileInterface) => {
      data.resourceId = props.resourceId;
      setFile(data);
    });
    else {
      setFile({ resourceId: props.resourceId });
    }
  };

  const convertBase64 = () => {
    return new Promise((resolve, reject) => {
      const fileReader = new FileReader();
      fileReader.readAsDataURL(uploadedFile)
      fileReader.onload = () => {
        resolve(fileReader.result);
      }
      fileReader.onerror = (error) => {
        reject(error);
      }
    })
  }

  const handleSave = async () => {
    const f = { ...file }
    f.size = uploadedFile.size;
    f.fileType = uploadedFile.type;
    f.fileName = uploadedFile.name;

    const preUploaded: boolean = await preUpload();
    if (!preUploaded) {
      const base64 = await convertBase64();
      f.fileContents = base64 as string;
    }
    const data: FileInterface[] = await ApiHelper.post("/files", [f], "LessonsApi");
    setFile(data[0]);
    props.saveCallback(data[0]);
  }

  const checkSave = () => {
    if (props.pendingSave) {
      if (uploadedFile.size > 0) handleSave();
      else props.saveCallback(file);
    }
  }

  const preUpload = async () => {
    const params = { resourceId: props.resourceId, fileName: uploadedFile.name }
    const presigned = await ApiHelper.post("/files/postUrl", params, "LessonsApi");
    const doUpload = presigned.key !== undefined;
    if (doUpload) await postPresignedFile(presigned);
    return doUpload;
  }

  //This will throw a CORS error if ran from localhost
  const postPresignedFile = (presigned: any) => {
    const formData = new FormData();
    formData.append("key", presigned.key);
    formData.append("acl", "public-read");
    for (const property in presigned.fields) formData.append(property, presigned.fields[property]);
    const f: any = document.getElementById('fileUpload');
    formData.append("file", f.files[0])
    const requestOptions: RequestInit = { method: "POST", body: formData };
    return fetch(presigned.url, requestOptions);
  }


  React.useEffect(loadData, [props.fileId]);
  React.useEffect(checkSave, [props.pendingSave]);

  const getFileLink = () => {
    if (file) {
      console.log(file.contentPath);
      return <div><a href={file.contentPath}>{file.fileName}</a></div>
    }
  }

  return (<>
    <FormGroup>
      <FormLabel>File</FormLabel>
      {getFileLink()}
      <input id="fileUpload" type="file" onChange={handleChange} />
    </FormGroup>
  </>);
}
