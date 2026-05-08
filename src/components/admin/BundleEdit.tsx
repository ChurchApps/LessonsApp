import { useEffect } from "react";
import { Alert, TextField } from "@mui/material";
import { InputBox } from "@churchapps/apphelper";
import { ApiHelper, BundleInterface } from "@/helpers";
import { useForm } from "react-hook-form";

interface Props {
  bundle: BundleInterface;
  updatedCallback: (bundle: BundleInterface) => void;
  contentDisplayName: string;
}

type AnyRecord = Record<string, any>;

export function BundleEdit(props: Props) {
  const { register, handleSubmit, reset, formState } = useForm<AnyRecord>({ defaultValues: { name: "" } });
  const e = formState.errors as any;
  const summaryErrors: string[] = [];
  if (e.name?.message) summaryErrors.push(e.name.message);

  const handleCancel = () => props.updatedCallback(props.bundle);

  const getDeleteFunction = () => (props.bundle?.id ? handleDelete : undefined);

  const handleDelete = () => {
    if (window.confirm("Are you sure you wish to permanently delete this bundle?  This will delete all variants and assets.")) {
      ApiHelper.delete("/bundles/" + props.bundle.id.toString(), "LessonsApi").then(() => props.updatedCallback(null));
    }
  };

  const onValid = (values: AnyRecord) => {
    const b: BundleInterface = { ...props.bundle, name: values.name };
    ApiHelper.post("/bundles", [b], "LessonsApi").then(data => { props.updatedCallback(data); });
  };

  useEffect(() => {
    if (props.bundle) reset({ name: props.bundle.name ?? "" });
  }, [props.bundle, reset]);

  return (
    <>
      <InputBox id="bundleDetailsBox" headerText={props.contentDisplayName} headerIcon="insert_drive_file" saveFunction={handleSubmit(onValid)} cancelFunction={handleCancel} deleteFunction={getDeleteFunction()}>
        {summaryErrors.length > 0 && <Alert severity="error" sx={{ mb: 2 }}>{summaryErrors.map((msg) => <div key={msg}>{msg}</div>)}</Alert>}
        <TextField fullWidth label="Bundle Name" placeholder="Countdown Video" error={!!e.name} helperText={e.name?.message} {...register("name", { required: "Please enter a bundle name." })} />
      </InputBox>
    </>
  );
}
