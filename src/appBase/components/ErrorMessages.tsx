import React from "react";

interface Props {
    errors: string[]
}

export const ErrorMessages: React.FC<Props> = props => {
  const items = [];
  let result = <></>
  if (props.errors != null && props.errors.length > 0) {
    for (let i = 0; i < props.errors.length; i++) items.push(<p key={i.toString() || props.errors[i].slice(0, 10)}>{props.errors[i]}</p>);
    result = <div className="alert alert-warning" role="alert">{items}</div>;
  }
  return result;
}
