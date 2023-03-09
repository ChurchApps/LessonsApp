import LiteYouTubeEmbed from 'react-lite-youtube-embed';
import 'react-lite-youtube-embed/dist/LiteYouTubeEmbed.css'

type Props = {
  videoEmbedUrl: string;
  title: string;
};

export function EmbeddedVideo(props: Props) {

  const youTubeBase = "https://www.youtube.com/embed/";
  let youTubeId = (props.videoEmbedUrl?.indexOf(youTubeBase)>-1) ? props.videoEmbedUrl?.replace(youTubeBase, "") : "";
  if (youTubeId) return <LiteYouTubeEmbed  id={youTubeId} title={props.title} />;
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
