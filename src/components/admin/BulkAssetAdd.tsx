import { useState } from "react";
import { ApiHelper, AssetInterface, FileInterface } from "@/utils";
import { InputBox } from "../index";
import { BulkFileUpload } from "./BulkFileUpload";

type Props = {
  resourceId: string;
  updatedCallback: () => void;
};

export function BulkAssetAdd(props: Props) {
  const [pendingFileSave, setPendingFileSave] = useState(false);

  const handleCancel = () => props.updatedCallback();

  const handleFilesSaved = (files: FileInterface[]) => {
    let assets: AssetInterface[] = [];
    let i = 1;
    files.forEach(f => {
      assets.push({
        fileId: f.id,
        name: f.fileName,
        resourceId: props.resourceId,
        sort: i
      });
      i++;
    })

    ApiHelper.post("/assets", assets, "LessonsApi").then(() => {
      setPendingFileSave(false);
      props.updatedCallback();
    });
  };

  const handleSave = () => {
    setPendingFileSave(true);
  };

  return (
    <>
      <InputBox id="bulkAssetDetailsBox" headerText="Bulk Add Assets" headerIcon="content_copy" saveFunction={handleSave} cancelFunction={handleCancel}>
        <BulkFileUpload resourceId={props.resourceId} pendingSave={pendingFileSave} saveCallback={handleFilesSaved} />
      </InputBox>
    </>
  );
}
