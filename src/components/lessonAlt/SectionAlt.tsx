import { SectionInterface, ResourceInterface, ActionInterface, ArrayHelper, CustomizationInterface, CustomizationHelper, ExternalVideoInterface, RoleInterface, AssetInterface, FileInterface, VariantInterface, ApiHelper, UserHelper } from "@/utils";
import { CardContent } from "@mui/material";
import Carousel from "react-material-ui-carousel";
import { AnalyticsHelper, CommonEnvironmentHelper } from "@churchapps/apphelper";
import { useState } from "react";
import { VideoModal } from "../VideoModal";
import { ActionAlt } from "./ActionAlt";
import { ActionsAlt } from "./ActionsAlt";

type Props = {
  section: SectionInterface;
  resources: ResourceInterface[];
  externalVideos: ExternalVideoInterface[];
  toggleActive: (id: string) => void;
  activeSectionId: string | string[];
  customizations?: CustomizationInterface[]
};

export function SectionAlt(props: Props) {
  const [previewVideo, setPreviewVideo] = useState<ExternalVideoInterface>(null);


  const trackView = (video: ExternalVideoInterface) => {
    const action = video.name;
    const label = window.location.pathname;
    AnalyticsHelper.logEvent("Preview", action, label);
    if (CommonEnvironmentHelper.GoogleAnalyticsTag !== "" && typeof(window)!=="undefined") gtag("event", "conversion", { send_to: "AW-427967381/iTZUCK6U7ZkYEJWHicwB" });
    const download = {
      lessonId: props.section.lessonId,
      fileId: "",
      userId: UserHelper.user?.id || "",
      churchId: UserHelper.currentUserChurch?.church?.id || "",
      ipAddress: "",
      downloadDate: new Date(),
      fileName: "Video - " + video.name
    }
    ApiHelper.post("/downloads", [download], "LessonsApi");
  }

  const getActions = (actions: ActionInterface[]) => {
    const result: JSX.Element[] = [];
    const customActions = CustomizationHelper.applyCustomSort(props.customizations, actions, "action");
    customActions.forEach((a) => {
      if (!shouldHide(a.id)) {
        result.push(<ActionAlt action={a} resources={props.resources} externalVideos={props.externalVideos} key={a.id} lessonId={props.section.lessonId} />);
      }
    });
    return result;
  };

  const shouldHide = (id: string) => {
    let result = false;
    if (props.customizations?.length > 0) {
      const removeItems = ArrayHelper.getAll(props.customizations, "action", "remove");
      result = ArrayHelper.getAll(removeItems, "contentId", id).length > 0;
    }
    return result;
  }

  const getParts = () => {
    const result: JSX.Element[] = [];
    if (props.section?.roles) {
      const customRoles = CustomizationHelper.applyCustomSort(props.customizations, props.section.roles, "role");
      customRoles.forEach((r) => {
        if (!shouldHide(r.id)) result.push(<>
          <ActionsAlt actions={r.actions} resources={props.resources} externalVideos={props.externalVideos} lessonId={props.section.lessonId}  />
        </>
        );
      });
    }
    return result;
  };

  const getMaterials = () => {
    const downloads:any = [];
    props.section.roles?.forEach(r => {
      r.actions.forEach(a => {
        if (a.actionType === "Download") downloads.push(a.content);
      })
    })
    if (props.section.materials) {
      return (<div className="materials" style={{marginTop:0,marginBottom:0}}>
        <b>Materials:</b> {props.section.materials} {downloads}
      </div>)
    }
  }


  const getSlide = (action:ActionInterface,) => {
    const video: ExternalVideoInterface = ArrayHelper.getOne(props.externalVideos || [], "id", action.externalVideoId);
    const resource: ResourceInterface = ArrayHelper.getOne(props.resources || [], "id", action.resourceId);
    const asset = (action.assetId && resource) ? ArrayHelper.getOne(resource?.assets || [], "id", action.assetId) : null;

    let files: FileInterface[] = [];
    resource?.variants?.forEach(v => { if (v.file) files.push(v.file) });

    if (asset?.file) files.push(asset.file);
    let result:any = <></>

    if (video)
    {
      //{showPreview && <VideoModal onClose={() => setShowPreview(false)} vimeoId={video.videoId} />}
      result = (<>
        <div className="playPreview2">
          <a href={"https://vimeo.com/" + video.videoId} rel="noopener noreferrer" onClick={(e) => { e.preventDefault(); trackView(video); setPreviewVideo(video); }}>
            <div className="img-container">
              <img src={video.thumbnail} alt={video.name} className="img-blur" aria-hidden="true" />
              <div style={{paddingLeft:"15%", paddingRight:"15%"}}>
                <img src={video.thumbnail} alt={video.name} className="img-fluid" />
              </div>
            </div>
          </a>
        </div>
      </>)

    } else {
      files.forEach(f => {
        if (f?.thumbPath) {
          result = (<div className="img-container">
            <img src={f.thumbPath || ""} alt={resource.name} className="img-blur" aria-hidden="true" />
            <div style={{paddingLeft:"15%", paddingRight:"15%"}}>
              <div className="img-fluid"><img src={f.thumbPath || ""} alt={resource.name} style={{height:"auto"}} /></div>
            </div>
          </div>);
        }
        else if (f?.fileType === "image/jpeg" || f?.fileType === "image/png") {
          result = (<div className="img-container">
            <img src={f.contentPath || ""} alt={resource.name} className="img-blur" aria-hidden="true" />
            <div style={{paddingLeft:"15%", paddingRight:"15%"}}>
              <div className="img-fluid"><img src={f.contentPath || ""} alt={resource.name}  style={{height:"auto"}} /></div>
            </div>
          </div>);
          //result = <div className="img-fluid"><img src={f.contentPath || ""} alt={resource.name}  style={{height:"auto"}} /></div>
        }
      })
    }

    //console.log("SLIDE", JSON.stringify(result));

    return (<div key={action.id}>{result}</div>);
  }

  const getSlides = () => {
    const result:any[] = [];
    if (props.section?.roles) {
      const customRoles:RoleInterface[] = CustomizationHelper.applyCustomSort(props.customizations, props.section.roles, "role");
      customRoles.forEach((r) => {
        if (!shouldHide(r.id)) {
          r.actions .forEach((a) => {
            if (a.actionType === "Play") {
              result.push(<div style={{backgroundColor:"#000"}}>
                <div>{getSlide(a)}</div>
              </div>);
            }
          })

        }
      });
    }
    return result;
  };

  const getCarousel = () => {
    let result = <></>
    const slides = getSlides();
    if (slides.length > 0) {
      result = <Carousel height={330} autoPlay={false} fullHeightHover={true} navButtonsAlwaysVisible={true}>
        {slides}
      </Carousel>
    }
    return result;
  }

  if (shouldHide(props.section?.id)) return <></>
  else if (props.section?.roles?.length === 0) return <></>
  else {
    return (<>
      <a className="anchor"  id={"anchor-" + props.section.id}></a>
      <div id={"section-" + props.section.id}>
        {previewVideo && <VideoModal onClose={() => setPreviewVideo(null)} vimeoId={previewVideo.videoId} />}
        <h3 style={{marginLeft:0, marginBottom:0, borderBottom: "1px solid #333", backgroundColor:"#03a9f4", color: "#FFFFFF", padding:10, marginTop:0}}>{props.section.name}</h3>
        {getMaterials()}
        {getCarousel()}

        <CardContent>
          {getParts()}
        </CardContent>
      </div>
    </>);
  }


}
