import React from "react";
import { ApiHelper, InputBox, ErrorMessages, AssetInterface, FileInterface } from ".";
import { FormGroup, FormControl, FormLabel } from "react-bootstrap";
import { FileUpload } from "./FileUpload";

interface Props {
  asset: AssetInterface,
  updatedCallback: (asset: AssetInterface) => void
}

export const AssetEdit: React.FC<Props> = (props) => {
  const [asset, setAsset] = React.useState<AssetInterface>({} as AssetInterface);
  const [errors, setErrors] = React.useState([]);
  const [pendingFileSave, setPendingFileSave] = React.useState(false);

  const handleCancel = () => props.updatedCallback(asset);
  const handleKeyDown = (e: React.KeyboardEvent<any>) => { if (e.key === "Enter") { e.preventDefault(); handleSave(); } }
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    e.preventDefault();
    let a = { ...asset };
    switch (e.currentTarget.name) {
      case "name": a.name = e.currentTarget.value; break;
      case "sort": a.sort = parseInt(e.currentTarget.value); break;
    }
    setAsset(a);
  }

  const validate = () => {
    let errors = [];
    if (asset.name === "") errors.push("Please enter a asset name.");
    setErrors(errors);
    return errors.length === 0;
  }

  const handleFileSaved = (file: FileInterface) => {
    const v = { ...asset };
    v.fileId = file.id;
    ApiHelper.post("/assets", [v], "LessonsApi").then(data => {
      setAsset(data);
      setPendingFileSave(false);
      props.updatedCallback(data);
    });
  }

  const handleSave = () => {
    if (validate()) setPendingFileSave(true);
  }

  const getDeleteFunction = () => (props.asset?.id) ? handleDelete : undefined

  const handleDelete = () => {
    if (window.confirm("Are you sure you wish to permanently delete this asset?")) {
      ApiHelper.delete("/assets/" + asset.id.toString(), "LessonsApi").then(() => props.updatedCallback(null));
    }
  }

  React.useEffect(() => { setAsset(props.asset) }, [props.asset]);


  return (<>
    <InputBox id="assetDetailsBox" headerText="Edit Asset" headerIcon="fas fa-copy" saveFunction={handleSave} cancelFunction={handleCancel} deleteFunction={getDeleteFunction()}>
      <ErrorMessages errors={errors} />

      <FormGroup>
        <FormLabel>Order</FormLabel>
        <FormControl type="number" name="sort" value={asset.sort} onChange={handleChange} onKeyDown={handleKeyDown} placeholder="1" />
      </FormGroup>

      <FormGroup>
        <FormLabel>Asset Name</FormLabel>
        <FormControl type="text" name="name" value={asset.name} onChange={handleChange} onKeyDown={handleKeyDown} placeholder="Asset 1" />
      </FormGroup>
      <FileUpload resourceId={props.asset?.resourceId} fileId={asset?.fileId} pendingSave={pendingFileSave} saveCallback={handleFileSaved} />
    </InputBox>
  </>);
}
