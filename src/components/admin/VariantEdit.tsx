import React from "react";
import { InputBox, ErrorMessages } from "@churchapps/apphelper";
import { ApiHelper, VariantInterface, FileInterface } from "@/helpers";
import { FileUpload } from "./FileUpload";
import { FormControl, InputLabel, MenuItem, Select, SelectChangeEvent, TextField } from "@mui/material";

type Props = {
  variant: VariantInterface;
  updatedCallback: (variant: VariantInterface) => void;
};

export function VariantEdit(props: Props) {
  const [variant, setVariant] = React.useState<VariantInterface>(null);
  const [errors, setErrors] = React.useState([]);
  const [pendingFileSave, setPendingFileSave] = React.useState(false);

  const handleCancel = () => props.updatedCallback(variant);
  const handleKeyDown = (e: React.KeyboardEvent<any>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSave();
    }
  };
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | SelectChangeEvent<string>) => {
    e.preventDefault();
    let v = { ...variant };
    switch (e.target.name) {
      case "hidden": v.hidden = e.target.value === "true"; break;
      case "name": v.name = e.target.value; break;
    }
    setVariant(v);
  };

  const validate = () => {
    let errors = [];
    if (variant.name === "") errors.push("Please enter a variant name.");
    setErrors(errors);
    return errors.length === 0;
  };

  const handleFileSaved = (file: FileInterface) => {
    const v = { ...variant };
    v.fileId = file.id;
    ApiHelper.post("/variants", [v], "LessonsApi").then((data) => {
      setVariant(data);
      setPendingFileSave(false);
      props.updatedCallback(data);
    });
  };

  const handleSave = () => {
    if (validate()) setPendingFileSave(true);
  };

  const getDeleteFunction = () =>
    props.variant?.id ? handleDelete : undefined;

  const handleDelete = () => {
    if (window.confirm("Are you sure you wish to permanently delete this variant?")) {
      ApiHelper.delete("/variants/" + variant.id.toString(), "LessonsApi").then(() => props.updatedCallback(null));
    }
  };

  React.useEffect(() => { setVariant(props.variant); }, [props.variant]);

  if (!variant) return <></>
  else return (
    <InputBox id="variantDetailsBox" headerText="Edit Variant" headerIcon="content_copy" saveFunction={handleSave} cancelFunction={handleCancel} deleteFunction={getDeleteFunction()}>
      <ErrorMessages errors={errors} />
      <FormControl fullWidth>
        <InputLabel>Hidden</InputLabel>
        <Select label="Hidden" name="hidden" value={variant.hidden?.toString()} onChange={handleChange}>
          <MenuItem value="false">No</MenuItem>
          <MenuItem value="true">Yes</MenuItem>
        </Select>
      </FormControl>
      <TextField fullWidth label="Variant Name" name="name" value={variant.name} onChange={handleChange} onKeyDown={handleKeyDown} placeholder="PDF" />
      <FileUpload resourceId={props.variant?.resourceId} fileId={variant?.fileId} pendingSave={pendingFileSave} saveCallback={handleFileSaved} />
    </InputBox>
  );

}
