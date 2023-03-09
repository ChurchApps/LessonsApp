import LiteYouTubeEmbed from "react-lite-youtube-embed";
import "react-lite-youtube-embed/dist/LiteYouTubeEmbed.css";

type Props = {
  videoEmbedUrl: string;
  title: string;
};

export function EmbeddedVideo(props: Props) {
  const youTubeBase = "https://www.youtube.com/embed/";
  const vimeoBase = "https://player.vimeo.com/video/";// 738981143?h=526752b554&badge=0&autopause=0&player_id=0&app_id=58479/embed
  let youTubeId = (props.videoEmbedUrl?.indexOf(youTubeBase) > -1) ? props.videoEmbedUrl?.replace(youTubeBase, "") : "";
  let vimeoId = (props.videoEmbedUrl?.indexOf(vimeoBase) > -1) ? props.videoEmbedUrl?.replace(vimeoBase, "").split("?")[0] : "";

  if (youTubeId) return <LiteYouTubeEmbed  id={youTubeId} title={props.title} poster="maxresdefault"  />;
  else if (vimeoId) {
    let html = "<lite-vimeo videoid=\"" + vimeoId + "\"></lite-vimeo>";
    return (<span dangerouslySetInnerHTML={{ __html: html }} ></span>);
  }
  else return (
    <div className="videoWrapper">
      <iframe
        width="992"
        height="558"
        src={props.videoEmbedUrl}
        title={props.title}
        frameBorder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      ></iframe>
    </div>
  );
}
