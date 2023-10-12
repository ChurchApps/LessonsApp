import { FeedActionInterface, FeedVenueInterface, MarkdownPreview } from "@/utils";
import Image from "next/image";

type Props = {
  feed: FeedVenueInterface;
};

export function OlfScriptPrint(props: Props) {


  const getActions = (actions:FeedActionInterface[]) => {
    const result:JSX.Element[] = [];
    actions.forEach(a => {
      result.push(<li className={"olfAction " + a.actionType}><MarkdownPreview value={a.content} /></li>);
    });
    return result;
  }


  const getSections = () => {
    const result:JSX.Element[] = [];
    props.feed?.sections?.forEach((s, sectionIndex) => {
      result.push(<div className="olfScriptSection" key={"section" + sectionIndex}>
        <h2>{s.name}</h2>
        {getActions(s.actions)}

      </div>);
    });
    return result;
  }

  return <div id="olfScriptPrint">
    <div className="olfScriptHeader">
      {props.feed.lessonImage && <div style={{textAlign:"center"}}>
        <Image src={props.feed.lessonImage} alt="lesson image" width={320} height={180} />
      </div>}
      <h1>{props.feed.studyName}</h1>
      <h2>{props.feed.lessonName}</h2>
      <h3>{props.feed.name}</h3>
      <div>
        <MarkdownPreview value={props.feed.lessonDescription} />
      </div>
    </div>
    <div className="olfBody">
      {getSections()}
    </div>


  </div>
}
