import React from "react";
import { ProgramInterface, } from "../helpers";
import ReactMarkdown from "react-markdown"

interface Props {
  program: ProgramInterface
}

export const AboutProgram: React.FC<Props> = (props) => {

  if (props.program?.aboutSection) {
    return (<>

      <h4 style={{ marginTop: 40 }}>About {props.program.name}</h4>
      <ReactMarkdown>{props.program.aboutSection}</ReactMarkdown>
    </>);
  } else return null;

}

