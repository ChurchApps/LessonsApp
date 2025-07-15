import React from "react";
import { FormControl, InputLabel, MenuItem, Select, SelectChangeEvent, TextField, Typography } from "@mui/material";

interface FormFieldOption {
  value: string;
  label: string;
  disabled?: boolean;
  sx?: any;
}

interface FormFieldProps {
  type: "text" | "select" | "date" | "textarea" | "email" | "password" | "number";
  label: string;
  name: string;
  value: any;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | SelectChangeEvent<string>) => void;
  onKeyDown?: (e: React.KeyboardEvent) => void;
  options?: FormFieldOption[];
  placeholder?: string;
  required?: boolean;
  helperText?: string;
  multiline?: boolean;
  rows?: number;
  disabled?: boolean;
  error?: boolean;
  fullWidth?: boolean;
}

export function FormField({
  type,
  label,
  name,
  value,
  onChange,
  onKeyDown,
  options = [],
  placeholder,
  required = false,
  helperText,
  multiline = false,
  rows = 4,
  disabled = false,
  error = false,
  fullWidth = true
}: FormFieldProps) {
  if (type === "select") {
    return (
      <FormControl fullWidth={fullWidth} error={error} disabled={disabled}>
        <InputLabel required={required}>{label}</InputLabel>
        <Select label={label} name={name} value={value || ""} onChange={onChange} required={required}>
          {options.map(option => (
            <MenuItem key={option.value} value={option.value} disabled={option.disabled} sx={option.sx}>
              {option.label}
            </MenuItem>
          ))}
        </Select>
        {helperText && (
          <Typography variant="body2" color={error ? "error" : "text.secondary"} sx={{ mt: 1, fontStyle: "italic" }}>
            {helperText}
          </Typography>
        )}
      </FormControl>
    );
  }

  if (type === "textarea") {
    return (
      <TextField
        fullWidth={fullWidth}
        label={label}
        name={name}
        value={value || ""}
        onChange={onChange}
        onKeyDown={onKeyDown}
        placeholder={placeholder}
        required={required}
        multiline
        rows={rows}
        disabled={disabled}
        error={error}
        helperText={helperText}
      />
    );
  }

  return (
    <TextField
      fullWidth={fullWidth}
      label={label}
      name={name}
      type={type}
      value={value || ""}
      onChange={onChange}
      onKeyDown={onKeyDown}
      placeholder={placeholder}
      required={required}
      multiline={multiline}
      rows={multiline ? rows : undefined}
      disabled={disabled}
      error={error}
      helperText={helperText}
    />
  );
}
