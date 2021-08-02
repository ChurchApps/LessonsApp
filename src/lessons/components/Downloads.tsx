import React from "react";
import { ResourceInterface } from ".";
import { Row, Col } from "react-bootstrap";


interface Props {
  resources: ResourceInterface[]
}

export const Downloads: React.FC<Props> = (props) => {

  /*
  <a className="dropdown-item" href="about:blank"><i className="fas fa-file-video"></i> Videos</a>
      <a className="dropdown-item" href="about:blank"><i className="fas fa-file-image"></i> Slides</a>
  */

  const getResources = () => {
    const result: JSX.Element[] = []
    props.resources?.forEach(r => {
      if (r.variants.length === 1) {
        let downloadLink = <a href={r.variants[0].file?.contentPath} download={true} className="btn btn-sm btn-success" >Download</a>
        result.push(<div className="dropdown-item"><Row><Col>{r?.name}</Col><Col style={{ textAlign: "right" }}>{downloadLink}</Col></Row></div>);
      } else if (r.variants.length > 1) {
        result.push(<h6>{r.name}</h6>);
        r.variants.forEach(v => {
          let downloadLink = <a href={v.file?.contentPath} download={true} className="btn btn-sm btn-success">Download</a>
          result.push(<div className="dropdown-item"><Row><Col>{v?.name}</Col><Col style={{ textAlign: "right" }}>{downloadLink}</Col></Row></div>);
        });
        result.push(<div className="dropdown-divider"></div>)
      }

    });
    return result;
  }

  if (props.resources && props.resources.length > 0) {
    return (<div className="dropdown">
      <button className="btn btn-light dropdown-toggle btn-sm float-right" type="button" id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
        Downloads
      </button>
      <div className="dropdown-menu" aria-labelledby="dropdownMenuButton">
        {getResources()}
      </div>
    </div>);
  } else return null;

}

