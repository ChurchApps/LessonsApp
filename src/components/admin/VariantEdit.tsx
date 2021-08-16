import React from "react";
import { FormGroup, FormControl, FormLabel } from "react-bootstrap";
import { InputBox, ErrorMessages } from "../index";
import { ApiHelper, VariantInterface, FileInterface } from "@/utils";
import { FileUpload } from "./FileUpload";

type Props = {
  variant: VariantInterface;
  updatedCallback: (variant: VariantInterface) => void;
};

export function VariantEdit(props: Props) {
  const [variant, setVariant] = React.useState<VariantInterface>(
    {} as VariantInterface
  );
  const [errors, setErrors] = React.useState([]);
  const [pendingFileSave, setPendingFileSave] = React.useState(false);

  const handleCancel = () => props.updatedCallback(variant);
  const handleKeyDown = (e: React.KeyboardEvent<any>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSave();
    }
  };
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    e.preventDefault();
    let v = { ...variant };
    switch (e.currentTarget.name) {
      case "name":
        v.name = e.currentTarget.value;
        break;
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
    if (
      window.confirm(
        "Are you sure you wish to permanently delete this variant?"
      )
    ) {
      ApiHelper.delete("/variants/" + variant.id.toString(), "LessonsApi").then(
        () => props.updatedCallback(null)
      );
    }
  };

  React.useEffect(() => {
    setVariant(props.variant);
  }, [props.variant]);

  return (
    <>
      <InputBox
        id="variantDetailsBox"
        headerText="Edit Variant"
        headerIcon="fas fa-copy"
        saveFunction={handleSave}
        cancelFunction={handleCancel}
        deleteFunction={getDeleteFunction()}
      >
        <ErrorMessages errors={errors} />
        <FormGroup>
          <FormLabel>Variant Name</FormLabel>
          <FormControl
            type="text"
            name="name"
            value={variant.name}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            placeholder="Variant 1"
          />
        </FormGroup>
        <FileUpload
          resourceId={props.variant?.resourceId}
          fileId={variant?.fileId}
          pendingSave={pendingFileSave}
          saveCallback={handleFileSaved}
        />
      </InputBox>
    </>
  );
}
