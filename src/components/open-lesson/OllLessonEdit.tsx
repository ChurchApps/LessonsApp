import { useEffect, useState } from "react";
import { SelectChangeEvent, TextField } from "@mui/material";
import { ErrorMessages, InputBox, MarkdownEditor } from "@churchapps/apphelper";
import { FeedLessonInterface } from "@/helpers";

interface Props {
  lesson: FeedLessonInterface;
  updatedCallback: (lesson: FeedLessonInterface, cancelled: boolean) => void;
}

export function OllLessonEdit(props: Props) {
  const [lesson, setLesson] = useState<FeedLessonInterface>(null);
  const [errors, setErrors] = useState([]);
  const handleCancel = () => props.updatedCallback(null, true);

  const handleMarkdownChange = (newValue: string) => {
    let l = { ...lesson };
    l.description = newValue;
    setLesson(l);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | SelectChangeEvent<string>) => {
    e.preventDefault();
    let l = { ...lesson };
    switch (e.target.name) {
      case "id":
        l.id = e.target.value;
        break;
      case "name":
        l.name = e.target.value;
        break;
      case "image":
        l.image = e.target.value;
        break;
      case "description":
        l.description = e.target.value;
        break;
    }
    setLesson(l);
  };

  const validate = () => {
    let errors = [];
    if (lesson.name === "") errors.push("Please enter a name.");
    if (lesson.id === "") errors.push("Please enter an id.");
    setErrors(errors);
    return errors.length === 0;
  };

  const handleSave = () => {
    if (validate()) props.updatedCallback(lesson, false);
  };

  const handleDelete = () => {
    if (window.confirm("Are you sure you wish to delete this lesson?")) props.updatedCallback(null, false);
  };

  useEffect(() => {
    setLesson(props.lesson);
  }, [props.lesson]);

  if (!lesson) {
    return <></>;
  } else {
    return (
      <>
        <InputBox
          id="lessonDetailsBox"
          headerText={props.lesson ? "Edit Lesson" : "Create Lesson"}
          headerIcon="check"
          saveFunction={handleSave}
          cancelFunction={handleCancel}
          deleteFunction={handleDelete}>
          <ErrorMessages errors={errors} />
          <TextField fullWidth label="Id" name="id" value={lesson.id} onChange={handleChange} />
          <TextField fullWidth label="Name" name="name" value={lesson.name} onChange={handleChange} />
          <TextField fullWidth label="Image" name="image" value={lesson.image} onChange={handleChange} />
          <label>Description</label>
          <MarkdownEditor value={lesson.description} onChange={handleMarkdownChange} />
        </InputBox>
      </>
    );
  }
}
