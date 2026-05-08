import { useEffect, useState } from "react";
import { Alert, FormControl, InputLabel, MenuItem, Select, TextField } from "@mui/material";
import { InputBox } from "@churchapps/apphelper";
import { ApiHelper, BundleInterface, LessonInterface, ResourceInterface, StudyInterface } from "@/helpers";
import { useForm, Controller } from "react-hook-form";

interface Props {
  resource: ResourceInterface;
  updatedCallback: (resource: ResourceInterface) => void;
  contentDisplayName: string;
}

type AnyRecord = Record<string, any>;

export function ResourceEdit(props: Props) {
  const [bundles, setBundles] = useState<BundleInterface[]>([]);

  const { control, register, handleSubmit, reset, formState } = useForm<AnyRecord>({ defaultValues: { name: "", bundleId: "", loopVideo: "false" } });
  const e = formState.errors as any;
  const summaryErrors: string[] = [];
  if (e.name?.message) summaryErrors.push(e.name.message);

  const handleCancel = () => props.updatedCallback(props.resource);
  const getDeleteFunction = () => (props.resource?.id ? handleDelete : undefined);

  const handleDelete = () => {
    if (window.confirm("Are you sure you wish to permanently delete this resource?  This will delete all variants and assets.")) {
      ApiHelper.delete("/resources/" + props.resource.id.toString(), "LessonsApi").then(() => props.updatedCallback(null));
    }
  };

  const onValid = (values: AnyRecord) => {
    const r: ResourceInterface = { ...props.resource, name: values.name, bundleId: values.bundleId, loopVideo: values.loopVideo === "true" };
    ApiHelper.post("/resources", [r], "LessonsApi").then(data => { props.updatedCallback(data); });
  };

  const loadBundles = async (currentBundle: BundleInterface) => {
    let programId = "";
    let studyId = "";
    switch (currentBundle.contentType) {
      case "program": programId = currentBundle.contentId; break;
      case "study":
        studyId = currentBundle.contentId;
        const study: StudyInterface = await ApiHelper.get("/studies/" + studyId, "LessonsApi");
        programId = study.programId;
        break;
      case "lesson":
        const lesson: LessonInterface = await ApiHelper.get("/lessons/" + currentBundle.contentId, "LessonsApi");
        studyId = lesson.studyId;
        const lessonStudy: StudyInterface = await ApiHelper.get("/studies/" + studyId, "LessonsApi");
        programId = lessonStudy.programId;
        break;
    }
    const available: BundleInterface[] = await ApiHelper.get("/bundles/available?programId=" + programId + "&studyId=" + studyId, "LessonsApi");
    setBundles(available);
  };

  useEffect(() => {
    if (props.resource) {
      reset({ name: props.resource.name ?? "", bundleId: props.resource.bundleId ?? "", loopVideo: props.resource.loopVideo ? "true" : "false" });
      ApiHelper.get("/bundles/" + props.resource.bundleId, "LessonsApi").then(bundle => { loadBundles(bundle); });
    }
  }, [props.resource, reset]);

  const getBundleOptions = () => {
    const result: React.JSX.Element[] = [];
    bundles?.forEach(b => {
      let displayType = "Lesson";
      if (b.contentType === "study") displayType = "Study";
      if (b.contentType === "program") displayType = "Program";
      result.push(<MenuItem key={b.id} value={b.id}>{displayType} - {b.contentName}: {b.name}</MenuItem>);
    });
    return result;
  };

  if (!props.resource) {
    return <></>;
  } else {
    return (
      <InputBox id="resourceDetailsBox" headerText={props.contentDisplayName} headerIcon="insert_drive_file" saveFunction={handleSubmit(onValid)} cancelFunction={handleCancel} deleteFunction={getDeleteFunction()}>
        {summaryErrors.length > 0 && <Alert severity="error" sx={{ mb: 2 }}>{summaryErrors.map((msg) => <div key={msg}>{msg}</div>)}</Alert>}
        <FormControl fullWidth>
          <InputLabel>Bundle</InputLabel>
          <Controller name="bundleId" control={control} render={({ field }) => (
            <Select {...field} label="Bundle">{getBundleOptions()}</Select>
          )} />
        </FormControl>
        <TextField fullWidth label="Resource Name" placeholder="Countdown Video" error={!!e.name} helperText={e.name?.message} {...register("name", { required: "Please enter a resource name." })} />
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
    );
  }
}
