import { useEffect } from "react";
import { Alert, FormControl, InputLabel, MenuItem, Select, TextField } from "@mui/material";
import { InputBox } from "@churchapps/apphelper";
import { ApiHelper, ExternalVideoInterface } from "@/helpers";
import { useForm, Controller } from "react-hook-form";

interface Props {
  externalVideo: ExternalVideoInterface;
  updatedCallback: (externalVideo: ExternalVideoInterface) => void;
  contentDisplayName: string;
}

type AnyRecord = Record<string, any>;

export function ExternalVideoEdit(props: Props) {
  const { control, register, handleSubmit, reset, formState } = useForm<AnyRecord>({ defaultValues: { name: "", videoProvider: "Vimeo", videoId: "", loopVideo: "false" } });
  const e = formState.errors as any;
  const summaryErrors: string[] = [];
  if (e.name?.message) summaryErrors.push(e.name.message);

  const handleCancel = () => props.updatedCallback(props.externalVideo);
  const getDeleteFunction = () => (props.externalVideo?.id ? handleDelete : undefined);

  const handleDelete = () => {
    if (window.confirm("Are you sure you wish to permanently delete this video?")) {
      ApiHelper.delete("/externalVideos/" + props.externalVideo.id.toString(), "LessonsApi").then(() => props.updatedCallback(null));
    }
  };

  const onValid = (values: AnyRecord) => {
    const v: ExternalVideoInterface = { ...props.externalVideo, name: values.name, videoProvider: values.videoProvider, videoId: values.videoId, loopVideo: values.loopVideo === "true" };
    ApiHelper.post("/externalVideos", [v], "LessonsApi").then(data => { props.updatedCallback(data); });
  };

  useEffect(() => {
    if (props.externalVideo) {
      reset({ name: props.externalVideo.name ?? "", videoProvider: props.externalVideo.videoProvider ?? "Vimeo", videoId: props.externalVideo.videoId ?? "", loopVideo: props.externalVideo.loopVideo ? "true" : "false" });
    }
  }, [props.externalVideo, reset]);

  if (!props.externalVideo) {
    return <></>;
  } else {
    return (
      <>
        <InputBox id="externalVideoDetailsBox" headerText={props.contentDisplayName} headerIcon="insert_drive_file" saveFunction={handleSubmit(onValid)} cancelFunction={handleCancel} deleteFunction={getDeleteFunction()}>
          {summaryErrors.length > 0 && <Alert severity="error" sx={{ mb: 2 }}>{summaryErrors.map((msg) => <div key={msg}>{msg}</div>)}</Alert>}
          <TextField fullWidth label="Video Name" placeholder="Lesson 1" error={!!e.name} helperText={e.name?.message} {...register("name", { required: "Please enter a video name." })} />
          <FormControl fullWidth>
            <InputLabel>Provider</InputLabel>
            <Controller name="videoProvider" control={control} render={({ field }) => (
              <Select {...field} fullWidth label="Provider" aria-label="provider">
                <MenuItem value="Vimeo">Vimeo</MenuItem>
              </Select>
            )} />
          </FormControl>
          <TextField fullWidth label="Video Id" placeholder="abc123" {...register("videoId")} />
          <FormControl fullWidth>
            <InputLabel>Looping Video</InputLabel>
            <Controller name="loopVideo" control={control} render={({ field }) => (
              <Select {...field} label="Looping Video">
                <MenuItem value="false">No</MenuItem>
                <MenuItem value="true">Yes</MenuItem>
              </Select>
            )} />
          </FormControl>
        </InputBox>
      </>
    );
  }
}
