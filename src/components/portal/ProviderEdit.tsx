import { useEffect, useState } from "react";
import { Box, Button, IconButton, Paper, SelectChangeEvent, Stack, TextField, Typography } from "@mui/material";
import { Extension as ExtensionIcon, Save as SaveIcon, Cancel as CancelIcon, Delete as DeleteIcon } from "@mui/icons-material";
import { ErrorMessages } from "@churchapps/apphelper";
import { ApiHelper, ExternalProviderInterface } from "@/helpers";

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
      case "name":
        p.name = e.target.value;
        break;
      case "apiUrl":
        p.apiUrl = e.target.value;
        break;
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
      ApiHelper.post("/externalProviders", [provider], "LessonsApi").then(data => {
        setProvider(data);
        props.updatedCallback(data);
      });
    }
  };

  const handleDelete = () => {
    if (window.confirm("Are you sure you wish to permanently delete this provider?")) {
      ApiHelper.delete("/externalProviders/" + provider.id.toString(), "LessonsApi").then(() =>
        props.updatedCallback(null)
      );
    }
  };

  useEffect(() => {
    setProvider(props.provider);
  }, [props.provider]);

  if (!provider) {
    return <></>;
  } else {
    return (
      <Paper
        sx={{
          borderRadius: 2,
          border: '1px solid var(--admin-border)',
          boxShadow: 'var(--admin-shadow-sm)',
          overflow: 'hidden'
        }}>
        {/* HEADER */}
        <Box
          sx={{
            p: 2,
            borderBottom: '1px solid var(--admin-border)',
            backgroundColor: 'var(--c1l7)'
          }}>
          <Stack direction="row" alignItems="center" spacing={1}>
            <ExtensionIcon sx={{ color: 'var(--c1d2)', fontSize: '1.5rem' }} />
            <Typography variant="h6" sx={{
              color: 'var(--c1d2)',
              fontWeight: 600,
              lineHeight: 1,
              fontSize: '1.25rem'
            }}>
              {provider?.id ? "Edit Provider" : "Create Provider"}
            </Typography>
          </Stack>
        </Box>

        {/* CONTENT */}
        <Box sx={{ p: 3 }}>
          <ErrorMessages errors={errors} />
          
          <Stack spacing={3}>
            <TextField 
              fullWidth 
              label="Provider Name" 
              name="name" 
              value={provider?.name || ''} 
              onChange={handleChange}
              placeholder="My External Provider"
              required
            />
            
            <TextField 
              fullWidth 
              label="API URL" 
              name="apiUrl" 
              value={provider?.apiUrl || ''} 
              onChange={handleChange}
              placeholder="https://api.example.com/lessons"
              helperText="The API endpoint that provides lessons in Open Lesson Format"
              required
            />
          </Stack>
        </Box>

        {/* FOOTER */}
        <Box
          sx={{
            p: 2,
            borderTop: '1px solid var(--admin-border)',
            backgroundColor: 'var(--admin-bg)',
            display: 'flex',
            justifyContent: 'flex-end',
            gap: 1,
            flexWrap: 'wrap'
          }}>
          <Button startIcon={<SaveIcon />} variant="contained" onClick={handleSave}>
            Save
          </Button>
          <Button startIcon={<CancelIcon />} variant="outlined" onClick={handleCancel}>
            Cancel
          </Button>
          {provider.id && (
            <IconButton color="error" onClick={handleDelete}>
              <DeleteIcon />
            </IconButton>
          )}
        </Box>
      </Paper>
    );
  }
}
