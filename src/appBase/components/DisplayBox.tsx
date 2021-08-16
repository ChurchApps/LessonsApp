import React from "react";
import { Row, Col } from "react-bootstrap";

interface Props {
    id?: string,
    children: React.ReactNode,
    headerIcon: string,
    headerText: string,
    editFunction?: () => void
    editContent?: React.ReactNode;
    "data-cy"?: string;
    ariaLabel?: string;
}

export const DisplayBox = React.forwardRef<HTMLDivElement, Props>((props, ref) => {
  let editContent: JSX.Element;
  if (props.editFunction !== undefined) editContent = <button className="no-default-style" aria-label={props.ariaLabel || "editButton"} onClick={props.editFunction}><i className="fas fa-pencil-alt"></i></button>;
  else if (props.editContent !== undefined) editContent = <div>{props.editContent}</div>;
  return (
    <div className="inputBox" id={props.id} data-cy={props["data-cy"] || ""}>
      <div className="header">
        <Row>
          <Col xs={!editContent ? 12 : 8}><i className={props.headerIcon}></i> {props.headerText}</Col>
          <Col xs={4} style={{ textAlign: "right" }}>{editContent}</Col>
        </Row>
      </div>
      <div className="content" ref={ref} data-cy="content">
        {props.children}
      </div>
    </div>
  );
})
