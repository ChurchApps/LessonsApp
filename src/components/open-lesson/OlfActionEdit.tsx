import { useEffect, useState } from "react";
import {
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TextField
} from "@mui/material";
import { ErrorMessages, InputBox, MarkdownEditor, SmallButton } from "@churchapps/apphelper";
import { FeedActionInterface, FeedFileInterface } from "@/helpers";
import { OlfFileEdit } from "./OlfFileEdit";

interface Props {
  action: FeedActionInterface;
  updatedCallback: (action: FeedActionInterface, cancelled: boolean) => void;
}

export function OlfActionEdit(props: Props) {
  const [action, setAction] = useState<FeedActionInterface>(null);
  const [errors, setErrors] = useState([]);
  const handleCancel = () => props.updatedCallback(null, true);
  const [editFileIndex, setEditFileIndex] = useState(null);

  const handleMarkdownChange = (newValue: string) => {
    let a = { ...action };
    a.content = newValue;
    setAction(a);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | SelectChangeEvent<string>) => {
    e.preventDefault();
    let a = { ...action };
    switch (e.target.name) {
      case "actionType":
        a.actionType = e.target.value;
        if (a.actionType === "play" && !a.files) a.files = [];
        break;
      case "role":
        a.role = e.target.value;
        break;
      case "content":
        a.content = e.target.value;
        break;
    }
    setAction(a);
  };

  const validate = () => {
    let errors = [];
    if (action.content === "") errors.push("Please enter content text.");
    setErrors(errors);
    return errors.length === 0;
  };

  const handleSave = () => {
    if (validate()) {
      const a = action;
      if (!a.actionType) a.actionType = "say";
      props.updatedCallback(a, false);
    }
  };

  const handleDelete = () => {
    if (window.confirm("Are you sure you wish to delete this action?")) props.updatedCallback(null, false);
  };

  const getContent = () => {
    if (action.actionType !== "play" && action.actionType !== "download")
      return <MarkdownEditor value={action.content} onChange={handleMarkdownChange} />;
    else
      return <TextField fullWidth label="Display Name" name="content" value={action.content} onChange={handleChange} />;
  };

  const getFiles = () => {
    if (action.actionType !== "play") return;

    const rows: JSX.Element[] = [];
    action.files?.forEach((f, i) => {
      rows.push(
        <TableRow key={i}>
          <TableCell colSpan={2}>
            <a
              href="about:blank"
              onClick={e => {
                e.preventDefault();
                setEditFileIndex(i);
              }}>
              {f.name}
            </a>
          </TableCell>
        </TableRow>
      );
    });

    return (
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Files</TableCell>
            <TableCell style={{ textAlign: "right" }}>
              <SmallButton
                icon="add"
                text="File"
                onClick={() => {
                  setEditFileIndex(-1);
                }}
              />
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>{rows}</TableBody>
      </Table>
    );
  };

  const handleFileSave = (file: FeedFileInterface, cancelled: boolean) => {
    if (!cancelled) {
      const a = { ...action };
      if (!a.files) a.files = [];
      if (!file && editFileIndex > -1) {
        a.files.splice(editFileIndex, 1);
      } else {
        if (editFileIndex > -1) a.files[editFileIndex] = file;
        else a.files.push(file);
      }
      setAction(a);
    }
    setEditFileIndex(null);
  };

  useEffect(() => {
    setAction(null);
    setTimeout(() => {
      setAction(props.action);
    }, 100);
  }, [props.action]);

  let editFile: FeedFileInterface = null;
  if (editFileIndex !== null) {
    if (editFileIndex === -1) editFile = { name: "", url: "" };
    else if (action.files) editFile = action.files[editFileIndex];
  }

  if (!action) {
    return <></>;
  } else if (editFile) {
    return <OlfFileEdit file={editFile} updatedCallback={handleFileSave} />;
  } else {
    return (
      <>
        <InputBox
          id="actionDetailsBox"
          headerText={props.action ? "Edit Action" : "Create Action"}
          headerIcon="check"
          saveFunction={handleSave}
          cancelFunction={handleCancel}
          deleteFunction={handleDelete}>
          <ErrorMessages errors={errors} />

          <FormControl fullWidth>
            <InputLabel>Action Type</InputLabel>
            <Select label="Action Type" name="actionType" value={action.actionType} onChange={handleChange}>
              <MenuItem value="say" key="say">
                Say
              </MenuItem>
              <MenuItem value="do" key="do">
                Do
              </MenuItem>
              <MenuItem value="play" key="play">
                Play
              </MenuItem>
              <MenuItem value="note" key="note">
                Note
              </MenuItem>
            </Select>
          </FormControl>
          <TextField fullWidth label="Role (Optional)" name="role" value={action.role} onChange={handleChange} />
          {getContent()}
          {getFiles()}
        </InputBox>
      </>
    );
  }
}
