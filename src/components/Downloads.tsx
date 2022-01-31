import { Row, Col, Dropdown } from "react-bootstrap";
import { ApiHelper, BundleInterface, GoogleAnalyticsHelper, UserHelper } from "@/utils";

type Props = {
  bundles: BundleInterface[];
};

export function Downloads(props: Props) {


  const trackDownload = (bundle: BundleInterface) => {
    const action = bundle.name;
    const label = window.location.pathname;
    GoogleAnalyticsHelper.gaEvent({ category: "Download", action: action, label: label });
    const download = {
      lessonId: bundle.contentId,
      fileId: bundle.file.id,
      userId: UserHelper.user?.id || "",
      churchId: UserHelper.currentChurch?.id || "",
      ipAddress: "",
      downloadDate: new Date(),
      fileName: "Bundle - " + bundle.name
    }
    ApiHelper.post("/downloads", [download], "LessonsApi");
  }


  const getBundles = () => {
    const result: JSX.Element[] = [];
    props.bundles?.forEach((b) => {
      const bundle = b;
      let downloadLink = (<a href={b.file?.contentPath + "&download=1"} onClick={() => { trackDownload(bundle) }} download={true} className="btn btn-sm btn-success">Download</a>);
      result.push(
        <div className="downloadResource" key={b.id}>
          <Row>
            <Col xs={8}>{b?.name}</Col>
            <Col xs={4} style={{ textAlign: "right" }}>{downloadLink}</Col>
          </Row>
        </div>
      );
    });
    return result;
  }



  return (
    props.bundles.length > 0 && (
      <Dropdown className="downloadsDropDown" alignRight={true} >
        <Dropdown.Toggle variant="light" id="dropdownMenuButton" size="sm" style={{ float: "right" }} >
          Downloads
        </Dropdown.Toggle>

        <Dropdown.Menu>
          {getBundles()}
        </Dropdown.Menu>
      </Dropdown>
    )
  );
}
