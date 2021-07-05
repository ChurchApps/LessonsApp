import React from "react";
import { ActionInterface } from "../../helpers";

interface Props {
  action: ActionInterface
}

export const Action: React.FC<Props> = (props) => {
  let result = <></>;

  switch (props.action.actionType) {
    case "Do":
      result = <ul className="actions"><li>{props.action.content}</li></ul>
      break;
    case "Say":
      result = <blockquote><p>{props.action.content}</p></blockquote>
      break;
    case "Play":
      result = <ul className="actions"><li>Play: {props.action.content}</li></ul>
      break;
  }

  return result;
}

