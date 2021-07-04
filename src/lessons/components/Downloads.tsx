import React from "react";

interface Props { }

export const Downloads: React.FC<Props> = (props) => {

  return (<div className="dropdown">
    <button className="btn btn-primary dropdown-toggle btn-sm float-right" type="button" id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
      Downloads
    </button>
    <div className="dropdown-menu" aria-labelledby="dropdownMenuButton">
      <a className="dropdown-item" href="about:blank"><i className="fas fa-file-video"></i> Videos</a>
      <a className="dropdown-item" href="about:blank"><i className="fas fa-file-image"></i> Slides</a>
    </div>
  </div>);
}

