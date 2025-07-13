import { useEffect, useState } from "react";
import { FormControl, InputLabel, MenuItem, Select, SelectChangeEvent, TextField } from "@mui/material";
import { ErrorMessages, InputBox } from "@churchapps/apphelper";
import { ApiHelper, BundleInterface, LessonInterface, ResourceInterface, StudyInterface } from "@/helpers";

interface Props {
  resource: ResourceInterface;
  updatedCallback: (resource: ResourceInterface) => void;
  contentDisplayName: string;
}

export function ResourceEdit(props: Props) {
  const [bundles, setBundles] = useState<BundleInterface[]>([]);
  const [resource, setResource] = useState<ResourceInterface>(null);
  const [errors, setErrors] = useState([]);

  const handleCancel = () => props.updatedCallback(resource);

  const handleKeyDown = (e: React.KeyboardEvent<any>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSave();
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | SelectChangeEvent<string>) => {
    e.preventDefault();
    let r = { ...resource };
    switch (e.target.name) {
    case "name":
      r.name = e.target.value;
      break;
    case "bundleId":
      r.bundleId = e.target.value;
      break;
    case "loopVideo":
      r.loopVideo = e.target.value === "true";
      break;
    }
    setResource(r);
  };

  const validate = () => {
    let errors = [];
    if (resource.name === "") errors.push("Please enter a resource name.");
    setErrors(errors);
    return errors.length === 0;
  };

  const handleSave = () => {
    if (validate()) {
      ApiHelper.post("/resources", [resource], "LessonsApi").then(data => {
        setResource(data);
        props.updatedCallback(data);
      });
    }
  };

  const getDeleteFunction = () => (props.resource?.id ? handleDelete : undefined);

  const handleDelete = () => {
    if (
      window.confirm("Are you sure you wish to permanently delete this resource?  This will delete all variants and assets.")
    ) ApiHelper.delete("/resources/" + resource.id.toString(), "LessonsApi").then(() => props.updatedCallback(null));
  };

  const loadBundles = async (currentBundle: BundleInterface) => {
    let programId = "";
    let studyId = "";
    switch (currentBundle.contentType) {
    case "program":
      programId = currentBundle.contentId;
      break;
    case "study":
      studyId = currentBundle.contentId;
      let study: StudyInterface = await ApiHelper.get("/studies/" + studyId, "LessonsApi");
      programId = study.programId;
      break;
    case "lesson":
      let lesson: LessonInterface = await ApiHelper.get("/lessons/" + currentBundle.contentId, "LessonsApi");
      studyId = lesson.studyId;
      study = await ApiHelper.get("/studies/" + studyId, "LessonsApi");
      programId = study.programId;
      break;
    }
    const available: BundleInterface[] = await ApiHelper.get("/bundles/available?programId=" + programId + "&studyId=" + studyId, "LessonsApi");
    setBundles(available);
  };

  useEffect(() => {
    setResource(props.resource);
    ApiHelper.get("/bundles/" + props.resource.bundleId, "LessonsApi").then(bundle => {
      loadBundles(bundle);
    });
  }, [props.resource]);

  const getBundleOptions = () => {
    const result: JSX.Element[] = [];
    bundles?.forEach(b => {
      let displayType = "Lesson";
      if (b.contentType === "study") displayType = "Study";
      if (b.contentType === "program") displayType = "Program";
      result.push(<MenuItem value={b.id}>
        {displayType} - {b.contentName}: {b.name}
      </MenuItem>);
    });
    return result;
  };

  if (!resource) {
    return <></>;
  } else {
    return (
      <InputBox
        id="resourceDetailsBox"
        headerText={props.contentDisplayName}
        headerIcon="insert_drive_file"
        saveFunction={handleSave}
        cancelFunction={handleCancel}
        deleteFunction={getDeleteFunction()}>
        <ErrorMessages errors={errors} />
        <FormControl fullWidth>
          <InputLabel>Bundle</InputLabel>
          <Select label="Bundle" name="bundleId" value={resource.bundleId} onChange={handleChange}>
            {getBundleOptions()}
          </Select>
        </FormControl>
        <TextField
          fullWidth
          label="Resource Name"
          name="name"
          value={resource.name}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          placeholder="Countdown Video"
        />
        <FormControl fullWidth>
          <InputLabel>Looping Video</InputLabel>
          <Select label="Looping Video" name="loopVideo" value={resource.loopVideo?.toString()} onChange={handleChange}>
            <MenuItem value="false">No</MenuItem>
            <MenuItem value="true">Yes</MenuItem>
          </Select>
        </FormControl>
      </InputBox>
    );
  }
}
