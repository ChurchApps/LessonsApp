import { useState, useEffect } from "react";
import { FormGroup, FormControl, FormLabel } from "react-bootstrap";
import { InputBox, ErrorMessages } from "../index";
import { ApiHelper, BundleInterface, LessonInterface, ResourceInterface, StudyInterface } from "@/utils";

type Props = {
  resource: ResourceInterface;
  updatedCallback: (resource: ResourceInterface) => void;
  contentDisplayName: string;
};

export function ResourceEdit(props: Props) {
  const [bundles, setBundles] = useState<BundleInterface[]>([]);
  const [resource, setResource] = useState<ResourceInterface>({} as ResourceInterface);
  const [errors, setErrors] = useState([]);

  const handleCancel = () => props.updatedCallback(resource);

  const handleKeyDown = (e: React.KeyboardEvent<any>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSave();
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    e.preventDefault();
    let r = { ...resource };
    switch (e.currentTarget.name) {
      case "name":
        r.name = e.currentTarget.value;
        break;
      case "bundleId":
        r.bundleId = e.currentTarget.value;
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
      ApiHelper.post("/resources", [resource], "LessonsApi").then((data) => {
        setResource(data);
        props.updatedCallback(data);
      });
    }
  };

  const getDeleteFunction = () => props.resource?.id ? handleDelete : undefined;

  const handleDelete = () => {
    if (window.confirm("Are you sure you wish to permanently delete this resource?  This will delete all variants and assets.")) {
      ApiHelper.delete("/resources/" + resource.id.toString(), "LessonsApi")
        .then(() => props.updatedCallback(null));
    }
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
        let lesson: LessonInterface = await ApiHelper.get("/lessons/" + currentBundle.contentId, "LessonsApi")
        studyId = lesson.studyId;
        study = await ApiHelper.get("/studies/" + studyId, "LessonsApi");
        programId = study.programId;
        break;
    }
    const available: BundleInterface[] = await ApiHelper.get("/bundles/available?programId=" + programId + "&studyId=" + studyId, "LessonsApi");
    setBundles(available);
  }

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
      result.push(<option value={b.id}>{displayType} - {b.contentName}: {b.name}</option>)
    });
    return result;
  }

  return (
    <>
      <InputBox id="resourceDetailsBox" headerText={props.contentDisplayName} headerIcon="fas fa-file-alt" saveFunction={handleSave} cancelFunction={handleCancel} deleteFunction={getDeleteFunction()} >
        <ErrorMessages errors={errors} />
        <FormGroup>
          <FormLabel>Bundle</FormLabel>
          <FormControl as="select" name="bundleId" value={resource.bundleId} onChange={handleChange}>
            {getBundleOptions()}
          </FormControl>
        </FormGroup>
        <FormGroup>
          <FormLabel>Resource Name</FormLabel>
          <FormControl type="text" name="name" value={resource.name} onChange={handleChange} onKeyDown={handleKeyDown} placeholder="Countdown Video" />
        </FormGroup>
      </InputBox>
    </>
  );
}
