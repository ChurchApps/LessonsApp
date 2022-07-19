import { ApiHelper, BundleInterface, GoogleAnalyticsHelper, UserHelper } from "@/utils";
import { Grid, Menu, MenuItem, Icon, Button } from "@mui/material";
import { useState } from "react";

type Props = {
  bundles: BundleInterface[];
};

export function Downloads(props: Props) {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

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
      let downloadLink = (<Button href={b.file?.contentPath + "&download=1"} size="small" onClick={() => { trackDownload(bundle) }} download={true} color="success" component="a" variant="contained">Download</Button>);
      result.push(
        <div className="downloadResource" key={b.id}>
          <MenuItem>
            <Grid container columnSpacing={2}>
              <Grid item xs={7}>{b?.name}</Grid>
              <Grid item xs={5} style={{ textAlign: "right" }}>{downloadLink}</Grid>
            </Grid>
          </MenuItem>
        </div>
      );
    });
    return result;
  }



  return (
    props.bundles.length > 0 && (
      <>
        <Button id="downloadButton" variant="contained" onClick={(e) => setAnchorEl(e.currentTarget)} endIcon={<Icon>keyboard_arrow_down</Icon>} size="small" style={{ float: "right" }}>Downloads</Button>
        <Menu id="basic-menu" anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={() => { setAnchorEl(null) }} MenuListProps={{ "aria-labelledby": "downloadButton" }}>
          {getBundles()}
        </Menu>
      </>
    )
  );
}
