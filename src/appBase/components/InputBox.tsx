import React from "react";
import { Row, Col, Button } from "react-bootstrap";

interface Props {
  id?: string;
  children?: React.ReactNode;
  headerIcon: string;
  headerText: string;
  saveText?: string;
  headerActionContent?: React.ReactNode;
  cancelFunction?: () => void;
  deleteFunction?: () => void;
  saveFunction: () => void;
  "data-cy"?: string;
  className?: string;
  isSubmitting?: boolean;
  ariaLabelDelete?: string;
  ariaLabelSave?: string;
}
export function InputBox({
  id,
  children,
  headerIcon,
  headerText,
  saveText = "Save",
  headerActionContent,
  "data-cy": dataCy,
  cancelFunction,
  deleteFunction,
  saveFunction,
  className = "",
  isSubmitting = false,
  ariaLabelDelete = "",
  ariaLabelSave = ""
}: Props) {
  let buttons = [];

  if (cancelFunction)
    buttons.push(
      <Col key="cancel">
        <Button variant="warning" block onClick={cancelFunction}>
          Cancel
        </Button>
      </Col>
    );

  if (deleteFunction)
    buttons.push(
      <Col key="delete">
        <Button
          id="delete"
          variant="danger"
          block
          aria-label={ariaLabelDelete}
          onClick={deleteFunction}
        >
          Delete
        </Button>
      </Col>
    );

  if (saveFunction)
    buttons.push(
      <Col key="save">
        <Button
          type="submit"
          variant="success"
          block
          aria-label={ariaLabelSave}
          onClick={saveFunction}
          disabled={isSubmitting}
        >
          {saveText}
        </Button>
      </Col>
    );

  let classNames = ["inputBox"];
  if (className) {
    classNames.push(className);
  }

  return (
    <div id={id} className={classNames.join(" ").trim()} data-cy={dataCy}>
      <div className="header" data-cy="header">
        <Row>
          <Col xs={8}>
            <i className={headerIcon}></i> {headerText}
          </Col>
          <Col xs={4} style={{ textAlign: "right" }}>
            {headerActionContent}
          </Col>
        </Row>
      </div>
      <div className="content">{children}</div>
      <div className="footer">
        <Row>{buttons}</Row>
      </div>
    </div>
  );
}
