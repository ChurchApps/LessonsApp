import { Row, Col, Dropdown, Accordion, Card } from "react-bootstrap";
import { ArrayHelper, ResourceInterface } from "@/utils";
import { forwardRef, LegacyRef } from "react"
import { faChevronDown } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

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

  const getAccordion = (categories: string[]) => {
    const accordionItems: JSX.Element[] = [];
    categories.forEach(cat => {
      const catName = cat ? cat : "Other";
      const catResources: JSX.Element[] = [];
      ArrayHelper.getAll(resources, "category", cat).forEach(r => {
        catResources.push(getResource(r));
      });

      accordionItems.push(<Card>
        <Accordion.Toggle eventKey={catName}><FontAwesomeIcon icon={faChevronDown} /> {catName}</Accordion.Toggle>
        <Accordion.Collapse eventKey={catName}>
          <Card.Body>{catResources}</Card.Body>
        </Accordion.Collapse>
      </Card>);
    });

    return (
      <Accordion className="downloadAccordion" >
        {accordionItems}
      </Accordion>
    );

  }

  function getNoAccordion() {
    const result: JSX.Element[] = [];
    resources?.forEach((r) => { result.push(getResource(r)); });
    return result;
  }

  const getResource = (resource: ResourceInterface) => {
    if (resource.variants.length === 1) return (getSingleVariant(resource));
    else if (resource.variants.length > 1) return (getMultiVariantAlt(resource)); //result.concat(getMultiVariant(r));
  }

  const getResources = () => {
    resources.forEach(r => { if (!r.category) r.category = ""; });
    const categories = ArrayHelper.getUniqueValues(resources, "category");
    if (categories.length > 1) return getAccordion(categories);
    else return getNoAccordion();
  }

  const CustomMenu = forwardRef(
    (refProps: any, ref: LegacyRef<HTMLDivElement>) => {
      return (<div ref={ref} style={refProps.style} className={refProps.className} >
        {refProps.children}
      </div>);
    },
  );



  return (
    resources.length > 0 && (
      <Dropdown className="downloadsDropDown" style={{ float: "right" }}>
        <Dropdown.Toggle variant="light" id="dropdownMenuButton" size="sm">
          Downloads
        </Dropdown.Toggle>

        <Dropdown.Menu as={CustomMenu}>
          {getResources()}
        </Dropdown.Menu>
      </Dropdown>
    )
  );
}
