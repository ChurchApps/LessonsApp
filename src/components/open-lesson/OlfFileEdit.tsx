import { useEffect } from "react";
import { FormControl, InputLabel, MenuItem, Select, TextField, Alert } from "@mui/material";
import { InputBox } from "@churchapps/apphelper";
import { FeedFileInterface } from "@/helpers";
import { useForm, Controller } from "react-hook-form";

interface Props { file: FeedFileInterface; updatedCallback: (file: FeedFileInterface, cancelled: boolean) => void; }

type AnyRecord = Record<string, any>;

export function OlfFileEdit(props: Props) {
  const { control, register, handleSubmit, reset, watch, formState } = useForm<AnyRecord>({ defaultValues: { name: "", url: "", thumbnail: "", streamUrl: "", loop: "false", seconds: 0 } });
  const e = formState.errors as any;
  const summaryErrors: string[] = [];
  if (e.name?.message) summaryErrors.push(e.name.message);
  if (e.url?.message) summaryErrors.push(e.url.message);

  const watchedLoop = watch("loop");

  const handleCancel = () => props.updatedCallback(null, true);

  const handleDelete = () => { if (window.confirm("Are you sure you wish to delete this action?")) props.updatedCallback(null, false); };

  const onValid = (values: AnyRecord) => {
    const f: FeedFileInterface = {
      ...props.file,
      name: values.name,
      url: values.url,
      thumbnail: values.thumbnail,
      streamUrl: values.streamUrl,
      loop: values.loop === "true",
      seconds: values.loop === "true" ? null : parseInt(values.seconds) || 0
    };
    props.updatedCallback(f, false);
  };

  useEffect(() => {
    if (props.file) {
      reset({
        name: props.file.name ?? "",
        url: props.file.url ?? "",
        thumbnail: props.file.thumbnail ?? "",
        streamUrl: props.file.streamUrl ?? "",
        loop: props.file.loop ? "true" : "false",
        seconds: props.file.seconds ?? 0
      });
    }
  }, [props.file]);

  if (!props.file) {
    return <></>;
  } else {
    return (
      <>
        <InputBox id="fileDetailsBox" headerText={props.file ? "Edit File" : "Add File"} headerIcon="check" saveFunction={handleSubmit(onValid)} cancelFunction={handleCancel} deleteFunction={handleDelete}>
          {summaryErrors.length > 0 && <Alert severity="error" sx={{ mb: 2 }}>{summaryErrors.map((msg) => <div key={msg}>{msg}</div>)}</Alert>}
          <TextField fullWidth autoFocus label="Name" error={!!e.name} helperText={e.name?.message} {...register("name", { required: "Please enter file name" })} />
          <TextField fullWidth label="URL" error={!!e.url} helperText={e.url?.message} {...register("url", { required: "Please enter url" })} />
          <b>Video Details</b>
          <TextField fullWidth label="Thumbnail (optional)" {...register("thumbnail")} />
          <TextField fullWidth label="Stream URL (optional)" {...register("streamUrl")} />
          <FormControl fullWidth>
            <InputLabel>Loop Video</InputLabel>
            <Controller name="loop" control={control} render={({ field }) => (
              <Select {...field} label="Loop Video">
                <MenuItem value="false" key="false">No</MenuItem>
                <MenuItem value="true" key="true">Yes</MenuItem>
              </Select>
            )} />
          </FormControl>
          {watchedLoop !== "true" && (
            <TextField fullWidth label="Seconds" type="number" {...register("seconds")} />
          )}
        </InputBox>
      </>
    );
  }
}
