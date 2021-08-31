import { Row, Col, Dropdown } from "react-bootstrap";
import { ResourceInterface } from "@/utils";

type Props = {
  resources: ResourceInterface[];
};

export function Downloads({ resources }: Props) {

  const getSingleVariant = (r: ResourceInterface) => {
    let downloadLink = (<a href={r.variants[0].file?.contentPath} download={true} className="btn btn-sm btn-success">Download</a>);
    return (
      <div className="dropdown-item" key={r.id}>
        <Row>
          <Col>{r?.name}</Col>
          <Col style={{ textAlign: "right" }}>{downloadLink}</Col>
        </Row>
      </div>
    );
  }

  const getMultiVariant = (r: ResourceInterface) => {
    const result: JSX.Element[] = []
    result.push(<h6 key={r.id}>{r.name}</h6>);
    r.variants.forEach((v) => {
      let downloadLink = (<a href={v.file?.contentPath} download={true} className="btn btn-sm btn-success">Download</a>);
      result.push(
        <div className="dropdown-item" key={v.id}>
          <Row>
            <Col>{v?.name}</Col>
            <Col style={{ textAlign: "right" }}>{downloadLink}</Col>
          </Row>
        </div>
      );
    });
    result.push(<div className="dropdown-divider" key={`divider-${r.id}`}></div>);
    return result;
  }

  const getMultiVariantAlt = (r: ResourceInterface) => {
    const dropdownItems: JSX.Element[] = []
    r.variants.forEach((v) => {
      dropdownItems.push(<Dropdown.Item href={v.file?.contentPath} download={true}>{v.name}</Dropdown.Item>);
    });

    return (
      <div className="dropdown-item" key={r.id}>
        <Row>
          <Col>{r?.name}</Col>
          <Col style={{ textAlign: "right" }}>
            <Dropdown>
              <Dropdown.Toggle size="sm" variant="success">Download</Dropdown.Toggle>
              <Dropdown.Menu>
                {dropdownItems}
              </Dropdown.Menu>
            </Dropdown>
          </Col>
        </Row>
      </div>
    );
  }


  function getResources() {
    const result: JSX.Element[] = [];
    resources?.forEach((r) => {
      if (r.variants.length === 1) result.push(getSingleVariant(r));
      else if (r.variants.length > 1) result.push(getMultiVariantAlt(r)); //result.concat(getMultiVariant(r));
    });
    console.log(result);
    return result;
  }

  return (
    resources.length > 0 && (
      <Dropdown className="downloadsDropDown" style={{ float: "right" }}>
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
