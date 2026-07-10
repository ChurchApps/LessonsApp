import { useEffect, useState } from "react";
import { Alert, FormControl, InputLabel, MenuItem, Select, TextField } from "@mui/material";
import { InputBox } from "@churchapps/apphelper";
import { ApiHelper, FileInterface, VariantInterface } from "@/helpers";
import { FileUpload } from "./FileUpload";
import { useForm, Controller } from "react-hook-form";

interface Props { variant: VariantInterface; updatedCallback: (variant: VariantInterface | null) => void; }

type AnyRecord = Record<string, any>;

export function VariantEdit(props: Props) {
  const [pendingFileSave, setPendingFileSave] = useState(false);
  const [pendingValues, setPendingValues] = useState<AnyRecord | null>(null);

  const { control, register, handleSubmit, reset, formState } = useForm<AnyRecord>({ defaultValues: { name: "", hidden: "false" } });
  const e = formState.errors as any;
  const summaryErrors: string[] = [];
  if (e.name?.message) summaryErrors.push(e.name.message);

  const handleCancel = () => props.updatedCallback(props.variant);
  const getDeleteFunction = () => (props.variant?.id ? handleDelete : undefined);
  const handleDelete = () => { if (window.confirm("Are you sure you wish to permanently delete this variant?")) ApiHelper.delete("/variants/" + props.variant.id!.toString(), "LessonsApi").then(() => props.updatedCallback(null)); };

  const handleFileSaved = (file: FileInterface) => {
    const base = pendingValues ?? {};
    const v: VariantInterface = { ...props.variant, name: base.name, hidden: base.hidden === "true", fileId: file.id };
    ApiHelper.post("/variants", [v], "LessonsApi").then(data => {
      setPendingFileSave(false);
      setPendingValues(null);
      props.updatedCallback(data);
    });
  };

  const onValid = (values: AnyRecord) => {
    setPendingValues(values);
    setPendingFileSave(true);
  };

  useEffect(() => {
    if (props.variant) reset({ name: props.variant.name ?? "", hidden: props.variant.hidden ? "true" : "false" });
  }, [props.variant, reset]);

  if (!props.variant) {
    return <></>;
  } else {
    return (
      <InputBox id="variantDetailsBox" headerText="Edit Variant" headerIcon="content_copy" saveFunction={handleSubmit(onValid)} cancelFunction={handleCancel} deleteFunction={getDeleteFunction()}>
        {summaryErrors.length > 0 && <Alert severity="error" sx={{ mb: 2 }}>{summaryErrors.map((msg) => <div key={msg}>{msg}</div>)}</Alert>}
        <FormControl fullWidth>
          <InputLabel>Hidden</InputLabel>
          <Controller name="hidden" control={control} render={({ field }) => (
            <Select {...field} label="Hidden">
              <MenuItem value="false">No</MenuItem>
              <MenuItem value="true">Yes</MenuItem>
            </Select>
          )} />
        </FormControl>
        <TextField fullWidth label="Variant Name" placeholder="PDF" error={!!e.name} helperText={e.name?.message} {...register("name", { required: "Please enter a variant name." })} />
        <FileUpload resourceId={props.variant?.resourceId} fileId={props.variant?.fileId || ""} pendingSave={pendingFileSave} saveCallback={handleFileSaved} />
      </InputBox>
    );
  }
}
