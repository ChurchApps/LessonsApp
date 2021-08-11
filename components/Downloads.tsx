import { Row, Col, Dropdown } from "react-bootstrap";
import { ResourceInterface } from "@/utils";

type Props = {
  resources: ResourceInterface[];
};

export function Downloads({ resources }: Props) {
  function getResources() {
    const result: JSX.Element[] = [];
    resources?.forEach((r) => {
      if (r.variants.length === 1) {
        let downloadLink = (
          <a
            href={r.variants[0].file?.contentPath}
            download={true}
            className="btn btn-sm btn-success"
          >
            Download
          </a>
        );
        result.push(
          <div className="dropdown-item" key={r.id}>
            <Row>
              <Col>{r?.name}</Col>
              <Col style={{ textAlign: "right" }}>{downloadLink}</Col>
            </Row>
          </div>
        );
      } else if (r.variants.length > 1) {
        result.push(<h6 key={r.id}>{r.name}</h6>);
        r.variants.forEach((v) => {
          let downloadLink = (
            <a
              href={v.file?.contentPath}
              download={true}
              className="btn btn-sm btn-success"
            >
              Download
            </a>
          );
          result.push(
            <div className="dropdown-item" key={v.id}>
              <Row>
                <Col>{v?.name}</Col>
                <Col style={{ textAlign: "right" }}>{downloadLink}</Col>
              </Row>
            </div>
          );
        });
        result.push(
          <div className="dropdown-divider" key={`divider-${r.id}`}></div>
        );
      }
    });
    return result;
  }

  return (
    resources.length > 0 && (
      <Dropdown style={{ float: "right" }}>
        <Dropdown.Toggle variant="light" id="dropdownMenuButton" size="sm">
          Downloads
        </Dropdown.Toggle>

        <Dropdown.Menu style={{ width: "215px" }}>
          {getResources()}
        </Dropdown.Menu>
      </Dropdown>
    )
  );
}
