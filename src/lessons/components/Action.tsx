import React from "react";
import { ActionInterface } from "../../helpers";
import ReactMarkdown from "react-markdown"

interface Props {
  action: ActionInterface
}

export const Action: React.FC<Props> = (props) => {
  let result = <></>;

  switch (props.action.actionType) {
    case "Do":
      result = <ul className="actions"><li><ReactMarkdown>{props.action.content}</ReactMarkdown></li></ul>
      break;
    case "Say":
      result = <blockquote><p><ReactMarkdown>{props.action.content}</ReactMarkdown></p></blockquote>
      break;
    case "Play":
      result = <ul className="actions"><li>Play: {props.action.content}</li></ul>
      break;
  }

  return result;
}

