import { useEffect, useState } from "react";
import { Alert, TextField } from "@mui/material";
import { InputBox } from "@churchapps/apphelper";
import { ApiHelper, AssetInterface, FileInterface } from "@/helpers";
import { FileUpload } from "./FileUpload";
import { useForm } from "react-hook-form";

interface Props { asset: AssetInterface; updatedCallback: (asset: AssetInterface) => void; }

type AnyRecord = Record<string, any>;

export function AssetEdit(props: Props) {
  const [pendingFileSave, setPendingFileSave] = useState(false);
  const [pendingValues, setPendingValues] = useState<AnyRecord | null>(null);

  const { register, handleSubmit, reset, formState } = useForm<AnyRecord>({ defaultValues: { name: "", sort: "" } });
  const e = formState.errors as any;
  const summaryErrors: string[] = [];
  if (e.name?.message) summaryErrors.push(e.name.message);

  const handleCancel = () => props.updatedCallback(props.asset);
  const getDeleteFunction = () => (props.asset?.id ? handleDelete : undefined);
  const handleDelete = () => { if (window.confirm("Are you sure you wish to permanently delete this asset?")) ApiHelper.delete("/assets/" + props.asset.id.toString(), "LessonsApi").then(() => props.updatedCallback(null)); };

  const handleFileSaved = (file: FileInterface) => {
    const base = pendingValues ?? {};
    const v: AssetInterface = { ...props.asset, name: base.name, sort: parseInt(base.sort) || 0, fileId: file.id };
    ApiHelper.post("/assets", [v], "LessonsApi").then((data: AssetInterface[]) => {
      setPendingFileSave(false);
      setPendingValues(null);
      props.updatedCallback(data[0]);
    });
  };

  const onValid = (values: AnyRecord) => {
    setPendingValues(values);
    setPendingFileSave(true);
  };

  useEffect(() => {
    if (props.asset) reset({ name: props.asset.name ?? "", sort: props.asset.sort ?? "" });
  }, [props.asset, reset]);

  return (
    <>
      <InputBox id="assetDetailsBox" headerText="Edit Asset" headerIcon="content_copy" saveFunction={handleSubmit(onValid)} cancelFunction={handleCancel} deleteFunction={getDeleteFunction()}>
        {summaryErrors.length > 0 && <Alert severity="error" sx={{ mb: 2 }}>{summaryErrors.map((msg) => <div key={msg}>{msg}</div>)}</Alert>}
        <TextField label="Order" fullWidth type="number" placeholder="1" {...register("sort")} />
        <TextField label="Asset Name" fullWidth placeholder="Asset 1" error={!!e.name} helperText={e.name?.message} {...register("name", { required: "Please enter a asset name." })} />
        <FileUpload resourceId={props.asset?.resourceId} fileId={props.asset?.fileId} pendingSave={pendingFileSave} saveCallback={handleFileSaved} />
      </InputBox>
    </>
  );
}
