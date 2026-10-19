import { useState } from "react";
import { Alert } from "@mui/material";
import { InputBox } from "@churchapps/apphelper";
import { ApiHelper, AssetInterface, FileInterface } from "@/helpers";
import { BulkFileUpload } from "./BulkFileUpload";

interface Props { resourceId: string; existingCount?: number; updatedCallback: () => void; }

export function BulkAssetAdd(props: Props) {
  const [pendingFileSave, setPendingFileSave] = useState(false);
  const [error, setError] = useState("");

  const handleCancel = () => props.updatedCallback();

  const handleFileError = (message: string) => { setPendingFileSave(false); setError(message); };

  const handleFilesSaved = (files: FileInterface[]) => {
    const assets: AssetInterface[] = [];
    let i = (props.existingCount || 0) + 1;
    files.forEach(f => {
      assets.push({
        fileId: f.id,
        name: f.fileName,
        resourceId: props.resourceId,
        sort: i
      });
      i++;
    });

    ApiHelper.post("/assets", assets, "LessonsApi").then(() => { setPendingFileSave(false); props.updatedCallback(); }).catch((err: Error) => handleFileError(err.message));
  };

  const handleSave = () => { setError(""); setPendingFileSave(true); };

  return (
    <>
      <InputBox
        id="bulkAssetDetailsBox"
        headerText="Bulk Add Assets"
        headerIcon="content_copy"
        saveFunction={handleSave}
        cancelFunction={handleCancel}>
        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
        <BulkFileUpload resourceId={props.resourceId} pendingSave={pendingFileSave} saveCallback={handleFilesSaved} errorCallback={handleFileError} />
      </InputBox>
    </>
  );
}
