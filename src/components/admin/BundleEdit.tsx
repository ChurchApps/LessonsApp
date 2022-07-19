import { useState, useEffect } from "react";
import { InputBox, ErrorMessages } from "../index";
import { ApiHelper, BundleInterface } from "@/utils";
import { TextField } from "@mui/material";

type Props = {
  bundle: BundleInterface;
  updatedCallback: (bundle: BundleInterface) => void;
  contentDisplayName: string;
};

export function BundleEdit(props: Props) {
  const [bundle, setBundle] = useState<BundleInterface>({} as BundleInterface);
  const [errors, setErrors] = useState([]);

  const handleCancel = () => props.updatedCallback(bundle);

  const handleKeyDown = (e: React.KeyboardEvent<any>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSave();
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    e.preventDefault();
    let v = { ...bundle };
    switch (e.currentTarget.name) {
      case "name":
        v.name = e.currentTarget.value;
        break;
    }
    setBundle(v);
  };

  const validate = () => {
    let errors = [];
    if (bundle.name === "") errors.push("Please enter a bundle name.");
    setErrors(errors);
    return errors.length === 0;
  };

  const handleSave = () => {
    if (validate()) {
      ApiHelper.post("/bundles", [bundle], "LessonsApi").then((data) => {
        setBundle(data);
        props.updatedCallback(data);
      });
    }
  };

  const getDeleteFunction = () => props.bundle?.id ? handleDelete : undefined;

  const handleDelete = () => {
    if (window.confirm("Are you sure you wish to permanently delete this bundle?  This will delete all variants and assets.")) {
      ApiHelper.delete("/bundles/" + bundle.id.toString(), "LessonsApi")
        .then(() => props.updatedCallback(null));
    }
  };

  useEffect(() => { setBundle(props.bundle); }, [props.bundle]);

  return (
    <>
      <InputBox id="bundleDetailsBox" headerText={props.contentDisplayName} headerIcon="insert_drive_file" saveFunction={handleSave} cancelFunction={handleCancel} deleteFunction={getDeleteFunction()} >
        <ErrorMessages errors={errors} />
        <TextField fullWidth label="Bundle Name" name="name" value={bundle.name} onChange={handleChange} onKeyDown={handleKeyDown} placeholder="Countdown Video" />
      </InputBox>
    </>
  );
}
