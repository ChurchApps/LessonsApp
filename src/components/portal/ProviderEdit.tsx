import { useState, useEffect } from "react";
import { InputBox, ErrorMessages } from "@churchapps/apphelper";
import { ApiHelper, ExternalProviderInterface } from "@/helpers";
import { SelectChangeEvent, TextField } from "@mui/material";

interface Props {
  provider: ExternalProviderInterface;
  updatedCallback: (provider: ExternalProviderInterface) => void;
}

export function ProviderEdit(props: Props) {
  const [provider, setProvider] = useState<ExternalProviderInterface>(props.provider);
  const [errors, setErrors] = useState([]);

  const handleCancel = () => props.updatedCallback(provider);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | SelectChangeEvent<string>) => {
    e.preventDefault();
    let p = { ...provider };
    switch (e.target.name) {
      case "name": p.name = e.target.value; break;
      case "apiUrl": p.apiUrl = e.target.value; break;
    }
    setProvider(p);
  };

  const validate = () => {
    let errors = [];
    if (!provider.name) errors.push("Please enter a provider name.");
    if (!provider.apiUrl) errors.push("Please enter an api url.");
    setErrors(errors);
    return errors.length === 0;
  };

  const handleSave = () => {
    if (validate()) {
      ApiHelper.post("/externalProviders", [provider], "LessonsApi").then((data) => {
        setProvider(data);
        props.updatedCallback(data);
      });
    }
  };

  const handleDelete = () => {
    if (window.confirm("Are you sure you wish to permanently delete this provider?")) {
      ApiHelper.delete("/externalProviders/" + provider.id.toString(), "LessonsApi").then(
        () => props.updatedCallback(null)
      );
    }
  };

  useEffect(() => {
    setProvider(props.provider)
  }, [props.provider]);


  if (!provider) return <></>
  else {
    return (
      <>
        <InputBox id="scheduleDetailsBox" headerText="Edit Schedule" headerIcon="school" saveFunction={handleSave} cancelFunction={handleCancel} deleteFunction={handleDelete}>
          <ErrorMessages errors={errors} />
          <TextField fullWidth label="Name" name="name" value={provider?.name} onChange={handleChange} />
          <TextField fullWidth label="API URL" name="apiUrl" value={provider?.apiUrl} onChange={handleChange} />
        </InputBox>
      </>
    );
  }
}
