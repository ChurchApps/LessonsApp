import { Wrapper } from "@/components/Wrapper";
import { OlfActionEdit } from "@/components/tools/OlfActionEdit";
import { OlfSectionEdit } from "@/components/tools/OlfSectionEdit";
import { FeedActionInterface, FeedSectionInterface, FeedVenueInterface } from "@/utils";
import { DisplayBox, MarkdownPreview, SmallButton } from "@churchapps/apphelper";
import { Button, Grid, Table, TableBody, TableCell, TableHead, TableRow, TextField } from "@mui/material";
import { useState } from "react";

export default function CP() {

  const [data, setData] = useState<FeedVenueInterface>({} as FeedVenueInterface);
  const [editSectionIndex, setEditSectionIndex] = useState<number>(null);
  const [editActionIndex, setEditActionIndex] = useState<number>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    e.preventDefault();
    let d = { ...data };
    switch (e.currentTarget.name) {
      case "name": d.name = e.currentTarget.value; break;
      case "lessonName": d.lessonName = e.currentTarget.value; break;
      case "lessonDescription": d.lessonDescription = e.currentTarget.value; break;
      case "studyName": d.studyName = e.currentTarget.value; break;
      case "programName": d.programName = e.currentTarget.value; break;
    }
    setData(d);
  };

  const handleDownload = () => {
    const content = JSON.stringify(data, null, 2);
    const link = document.createElement("a");
    const file = new Blob([content], { type: 'application/json' });
    link.href = URL.createObjectURL(file);
    link.download = "olf.json";
    link.click();
    URL.revokeObjectURL(link.href);
  }

  const handleUpload = () => {
    const f: any = document.getElementById("fileUpload");
    f.click();
  }

  const handleFileChange = () => {
    const f: any = document.getElementById("fileUpload");
    const reader = new FileReader();
    reader.onload = (e: any) => { setData(JSON.parse(e.target.result)); };
    reader.readAsText(f.files[0]);
  }

  const getFiles = (a: FeedActionInterface) => {
    if (a.actionType==="play")
    {
      const fileCount = a.files.length;
      return <a href="about:blank">{fileCount} file{(fileCount!==1) && "s"}</a>
    } else return null;
  }

  const getActions = (s: FeedSectionInterface, sectionIndex:number) => {
    let result:JSX.Element[] = [];
    s.actions?.forEach((a, j) => {
      result.push(<TableRow key={j}>
        <TableCell></TableCell>
        <TableCell>
          {(j!==0) && <SmallButton icon="arrow_upward" onClick={() => { moveAction(sectionIndex, j, "up") }} />}
          {(j!==s.actions.length-1) && <SmallButton icon="arrow_downward" onClick={() => { moveAction(sectionIndex, j, "down") }} />}
        </TableCell>

        <TableCell><a href="about:blank" onClick={(e) => { e.preventDefault(); handleEditAction(sectionIndex, j); }}>{a.actionType}</a></TableCell>
        <TableCell><MarkdownPreview value={a.content} /></TableCell>
        <TableCell style={{whiteSpace:"nowrap"}}>{getFiles(a)}</TableCell>
      </TableRow>);
    });
    return result;
  }

  const getSections = () => {
    let result:JSX.Element[] = [];
    data.sections?.forEach((s, i) => {
      result.push(<TableRow key={"section" + i}>
        <TableCell>
          {(i!==0) && <SmallButton icon="arrow_upward" onClick={() => { moveSection(i, "up") }} />}
          {(i<data.sections.length-1) && <SmallButton icon="arrow_downward" onClick={() => { moveSection(i, "down") }} />}
        </TableCell>
        <TableCell colSpan={2}><a href="about:blank" onClick={(e) => { e.preventDefault(); setEditSectionIndex(i); }}>{s.name}</a></TableCell>
        <TableCell colSpan={2} style={{ textAlign:"right" }}><SmallButton icon="add" text="Action" onClick={() => { setEditSectionIndex(i); setEditActionIndex(-1); }} /></TableCell>
      </TableRow>);
      result = result.concat(getActions(s, i));
    });
    return result;
  }

  const moveSection = (index: number, direction: "up" | "down") => {
    let d = {...data};
    if (direction === "up")
    {
      const item = d.sections.splice(index-1, 1)[0];
      d.sections.splice(index, 0, item);
    } else {
      const item = d.sections.splice(index, 1)[0];
      d.sections.splice(index + 1, 0, item);
    }
    setData(d);
  }

  const moveAction = (sectionIndex:number, index: number, direction: "up" | "down") => {
    let d = {...data};
    let s = d.sections[sectionIndex];
    if (direction === "up")
    {
      const item = s.actions.splice(index-1, 1)[0];
      s.actions.splice(index, 0, item);
    } else {
      const item = s.actions.splice(index, 1)[0];
      s.actions.splice(index + 1, 0, item);
    }
    setData(d);
  }

  const handleEditAction = (sectionIndex:number, index:number) => {
    setEditSectionIndex(sectionIndex);
    setEditActionIndex(index);
  }

  let editAction = null;
  let editSection = null;
  if (editSectionIndex!==null)
  {
    if (editSectionIndex>-1 && editActionIndex!==null) {
      if (editActionIndex>-1) editAction=data.sections[editSectionIndex].actions[editActionIndex];
      else editAction = {actionType:"say", content:""};
    } else {
      if (editSectionIndex>-1) editSection = data.sections[editSectionIndex];
      else editSection = {name:""};
    }
  }

  const handleSectionSave = (section:FeedSectionInterface, cancelled:boolean) => {
    if (!cancelled)
    {
      const d = {...data};
      if (!section && editSectionIndex>-1) d.sections.splice(editSectionIndex, 1);
      else {
        if (editSectionIndex>-1) d.sections[editSectionIndex] = section;
        else {
          if (!d.sections) d.sections = [];
          d.sections.push(section);
        }
      }
      setData(d);
    }
    setEditSectionIndex(null);
  }

  const handleActionSave = (action:FeedActionInterface, cancelled:boolean) => {
    if (!cancelled)
    {
      const d = {...data};
      if (!action && editActionIndex>-1) d.sections[editSectionIndex].actions.splice(editActionIndex, 1);
      else {
        if (editActionIndex>-1) d.sections[editSectionIndex].actions[editActionIndex] = action;
        else {
          const sect = d.sections[editSectionIndex];
          if (!sect.actions) sect.actions = [];
          sect.actions.push(action);
        }
      }
      setData(d);
    }
    setEditSectionIndex(null);
    setEditActionIndex(null);
  }

  return (
    <Wrapper>

      <h1>Manually Create Open Lesson Format</h1>
      <Grid container spacing={3}>
        <Grid item md={8} xs={12}>
          <DisplayBox headerText="Venue Details" headerIcon="map_marker">
            <Grid container spacing={3}>
              <Grid item xs={6}>
                <TextField label="Program Name" fullWidth name="programName" value={data.programName} onChange={handleChange} placeholder="The Ark Kids" />
              </Grid>
              <Grid item xs={6}>
                <TextField label="Study Name" fullWidth name="studyName" value={data.studyName} onChange={handleChange} placeholder="Peace" />
              </Grid>
            </Grid>
            <Grid container spacing={3}>
              <Grid item xs={6}>
                <TextField label="Lesson Name" fullWidth name="lessonName" value={data.lessonName} onChange={handleChange} placeholder="I Can Have Peace When I'm Angry" />
                <TextField label="Lesson Description" fullWidth name="lessonDescription" value={data.lessonDescription} onChange={handleChange} placeholder="There are many things in life that could be considered overrated… wealth, fame, power, titles, and the list goes on.  But there may be one thing that we could all agree is never overrated, maybe it is even priceless. Peace. Peace of mind. Peace with others. We all know what it’s like to not have peace, and kids are no exception." multiline />
              </Grid>
              <Grid item xs={6}>
                <TextField label="Venue Name" fullWidth name="name" value={data.name} onChange={handleChange} placeholder="Classroom" />
              </Grid>
            </Grid>
          </DisplayBox>

          <DisplayBox headerText="Sections" headerIcon="list_alt">
            <Table id="olfTable" size="small">
              <TableHead>
                <TableRow>
                  <TableCell />
                  <TableCell>Section</TableCell>
                  <TableCell>Action</TableCell>
                  <TableCell colSpan={2}>
                    <span style={{float:"right"}}><SmallButton icon="add" text="Section" onClick={() => { setEditSectionIndex(-1); }} /></span>
                    Content
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {getSections()}
              </TableBody>

            </Table>

          </DisplayBox>

        </Grid>
        <Grid item md={4} xs={12}>
          <DisplayBox headerText="OLF File" headerIcon="map_marker">
            <Button variant="outlined" onClick={handleUpload}>Upload</Button> &nbsp;
            <Button variant="outlined" onClick={handleDownload}>Download</Button>
            <input id="fileUpload" type="file" onChange={handleFileChange} style={{display:"none"}}  />
            <div style={{ fontSize: 12, overflow: "scroll", maxHeight: 500, whiteSpace:"pre", border:"1px solid #CCC", padding:15, marginTop:20 }}>{JSON.stringify(data, null, 2)}</div>
          </DisplayBox>
          {editAction && <OlfActionEdit action={editAction} updatedCallback={handleActionSave} /> }
          {editSection && <OlfSectionEdit section={editSection} updatedCallback={handleSectionSave} /> }


        </Grid>
      </Grid>


    </Wrapper>
  );
}

