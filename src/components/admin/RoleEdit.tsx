import { useEffect, useState } from "react";
import { Box, Button, IconButton, Paper, Stack, TextField, Typography } from "@mui/material";
import { Person as PersonIcon, Save as SaveIcon, Cancel as CancelIcon, Delete as DeleteIcon } from "@mui/icons-material";
import { ErrorMessages } from "@churchapps/apphelper";
import { ApiHelper, RoleInterface } from "@/helpers";

interface Props {
  role: RoleInterface;
  updatedCallback: (role: RoleInterface, created: boolean) => void;
}

export function RoleEdit(props: Props) {
  const [role, setRole] = useState<RoleInterface>({} as RoleInterface);
  const [errors, setErrors] = useState([]);

  const handleCancel = () => props.updatedCallback(role, false);

  const handleKeyDown = (e: React.KeyboardEvent<any>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSave();
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    e.preventDefault();
    let r = { ...role };
    switch (e.currentTarget.name) {
    case "name":
      r.name = e.currentTarget.value;
      break;
    case "sort":
      r.sort = parseInt(e.currentTarget.value);
      break;
    }
    setRole(r);
  };

  const validate = () => {
    let errors = [];
    if (role.name === "") errors.push("Please enter a role name.");
    setErrors(errors);
    return errors.length === 0;
  };

  const handleSave = () => {
    if (validate()) {
      ApiHelper.post("/roles", [role], "LessonsApi").then(data => {
        setRole(data);
        props.updatedCallback(data[0], !props.role.id);
      });
    }
  };

  const handleDelete = () => {
    if (window.confirm("Are you sure you wish to permanently delete this role?")) ApiHelper.delete("/roles/" + role.id.toString(), "LessonsApi").then(() => props.updatedCallback(null, false));
  };

  useEffect(() => {
    setRole(props.role);
  }, [props.role]);

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
          <PersonIcon sx={{ color: 'var(--c1d2)', fontSize: '1.5rem' }} />
          <Typography variant="h6" sx={{
            color: 'var(--c1d2)',
            fontWeight: 600,
            lineHeight: 1,
            fontSize: '1.25rem'
          }}>
            {role?.id ? "Edit Role" : "Create Role"}
          </Typography>
        </Stack>
      </Box>

      {/* CONTENT */}
      <Box sx={{ p: 3 }}>
        <ErrorMessages errors={errors} />

        <Stack spacing={3}>
          <TextField
            fullWidth
            label="Order"
            type="number"
            name="sort"
            value={role.sort || ''}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            placeholder="1"
            helperText="Display order for this role within the section"
          />

          <TextField
            fullWidth
            label="Role Name"
            name="name"
            value={role.name || ''}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            placeholder="Leader"
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
        {role.id && (
          <IconButton color="error" onClick={handleDelete}>
            <DeleteIcon />
          </IconButton>
        )}
      </Box>
    </Paper>
  );
}
