import axios from "axios";
import type { AxiosProgressEvent } from "axios";
import { useEffect, useState } from "react";
import { Box, LinearProgress, Typography, Button } from "@mui/material";
import { CloudUpload as CloudUploadIcon } from "@mui/icons-material";
import { ApiHelper, FileInterface, PresignedUploadInterface } from "@/helpers";

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

  const checkSave = () => {
    if (props.pendingSave) handleSave();
  };

  const preUpload = async () => {
    for (let i = 0; i < uploadedFiles.length; i++) {
      const uf = uploadedFiles[i];
      const params = { resourceId: props.resourceId, fileName: uf.name };
      const presigned = await ApiHelper.post("/files/postUrl", params, "LessonsApi");
      const doUpload = presigned.key !== undefined;
      if (doUpload) await postPresignedFile(presigned, uf, i);
    }
  };

  //This will throw a CORS error if ran from localhost
  const postPresignedFile = (presigned: PresignedUploadInterface, uploadedFile: File, index: number) => {
    const formData = new FormData();
    formData.append("acl", "public-read");
    formData.append("Content-Type", uploadedFile.type);

    for (const property in presigned.fields) formData.append(property, presigned.fields[property]);
    const _f = document.getElementById("fileUpload") as HTMLInputElement;
    formData.append("file", uploadedFile);

    const completedPercent = Math.round((index / uploadedFiles.length) * 100);

    const axiosConfig = {
      headers: { "Content-Type": "multipart/form-data" },
      onUploadProgress: (data: AxiosProgressEvent) => {
        const currentFilePercent = Math.round((100 * data.loaded) / (data.total || 1));
        const overallPercent = completedPercent + Math.round(currentFilePercent / uploadedFiles.length);
        setUploadProgress(overallPercent);
      }
    };

    return axios.post(presigned.url, formData, axiosConfig);
  };

  useEffect(checkSave, [props.pendingSave]);

  const getFileLink = () => {
    if (uploadProgress > -1) {
      return (
        <Box sx={{ width: "100%", mt: 1 }}>
          <LinearProgress
            variant="determinate"
            value={uploadProgress}
            sx={{
              backgroundColor: "var(--c1l6)",
              "& .MuiLinearProgress-bar": { backgroundColor: "var(--c1)" }
            }}
          />
          <Typography variant="caption" sx={{ color: "var(--c1d2)", mt: 0.5 }}>
            Uploading... {uploadProgress}%
          </Typography>
        </Box>
      );
    } else if (uploadedFiles && uploadedFiles.length > 0) {
      return (
        <Box sx={{ mt: 1 }}>
          <Typography variant="body2" sx={{ color: "var(--c1d2)" }}>
            {uploadedFiles.length} file(s) selected
          </Typography>
        </Box>
      );
    }
    return null;
  };

  return (
    <Box sx={{ mt: 2 }}>
      <Typography
        variant="subtitle2"
        sx={{
          color: "var(--c1d2)",
          fontWeight: 600,
          mb: 1,
          display: "flex",
          alignItems: "center",
          gap: 0.5
        }}
      >
        <CloudUploadIcon sx={{ fontSize: "1.2rem" }} />
        Bulk File Upload
      </Typography>
      {getFileLink()}
      <Button
        variant="outlined"
        component="label"
        sx={{
          mt: 1,
          color: "var(--c1)",
          borderColor: "var(--c1)",
          backgroundColor: "var(--admin-surface)",
          "&:hover": {
            borderColor: "var(--c1d1)",
            backgroundColor: "var(--c1l7)"
          }
        }}
      >
        Choose Files
        <input
          id="fileUpload"
          type="file"
          onChange={handleChange}
          multiple={true}
          style={{ display: "none" }}
        />
      </Button>
    </Box>
  );
}
