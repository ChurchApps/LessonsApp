import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Grid, TextField } from "@mui/material";
import { useState } from "react";
import ReactMarkdown from "react-markdown";

type Props = {
  value: string;
  onChange: (newValue: string) => void;
};

export function MarkdownEditor(props: Props) {
  const [showModal, setShowModal] = useState(false);


  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    e.preventDefault();
    props.onChange(e.target.value);
  }

  const getModal = () => {
    if (showModal) return (<>
      <Dialog open={true} onClose={() => { setShowModal(false) }} fullScreen={true}>
        <DialogTitle>Markdown Editor</DialogTitle>
        <DialogContent>
          {getModalContent()}
        </DialogContent>
        <DialogActions sx={{ paddingX: "16px", paddingBottom: "12px" }}>
          <Button variant="outlined" onClick={(e) => { e.preventDefault(); setShowModal(false) }}>Close</Button>
        </DialogActions>
      </Dialog>
    </>);
  }

  const getModalContent = () => {
    const guideLink = <a href="https://www.markdownguide.org/cheat-sheet/" target="_blank" rel="noopener noreferrer" style={{ float: "right" }}>Markdown Guide</a>
    return (
      <Grid container spacing={3}>
        <Grid item xs={6}>
          <TextField fullWidth multiline label={<>Content &nbsp; {guideLink}</>} name="modalMarkdown" className="modalMarkdown" InputProps={{ style: { height: "80vh" } }} value={props.value} onChange={handleChange} placeholder="" />
        </Grid>
        <Grid item xs={6}>
          <div style={{ border: "1px solid #BBB", borderRadius: 5, marginTop: 15, padding: 10, height: "80vh" }}>
            <div style={{ marginTop: -20, marginBottom: -10 }}><span style={{ backgroundColor: "#FFFFFF", color: "#999", fontSize: 13 }}> &nbsp; Preview &nbsp; </span></div>
            <ReactMarkdown>
              {props.value}
            </ReactMarkdown>
          </div>
        </Grid>
      </Grid >
    )
  }

  //const markdownLink = <a href="https://www.markdownguide.org/cheat-sheet/" target="_blank" rel="noopener noreferrer" style={{ float: "right" }}>Markdown Guide</a>
  const markdownLink = <a href="about:blank" style={{ float: "right" }} onClick={(e) => { e.preventDefault(); setShowModal(true) }} >Markdown Editor</a>
  return <>
    <TextField fullWidth multiline label={<>Content &nbsp; {markdownLink}</>} name="content" rows={8} value={props.value} onChange={handleChange} placeholder="" />
    {getModal()}
  </>
}
