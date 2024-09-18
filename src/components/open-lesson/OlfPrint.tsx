import { FeedActionInterface, FeedSectionInterface, FeedVenueInterface } from "@/utils";
import { MarkdownPreview } from "@churchapps/apphelper/dist/components/markdownEditor/MarkdownPreview";
import Image from "next/image";

type Props = {
  feed: FeedVenueInterface;
};

export function OlfPrint(props: Props) {

  const getActionGroups = (section:FeedSectionInterface) => {
    const blocks = groupActions(section.actions || []);
    const result:JSX.Element[] = [];
    blocks.forEach(b => {
      result.push(
        <div className="olfActionBlock">
          <table>
            <tr>
              <td>{b.actions[0].actionType.toUpperCase()}</td>
              <td><ul>{getActions(b.actions)}</ul></td>
            </tr>
          </table>
        </div>)
    });
    return result;
  }

  const getActions = (actions:FeedActionInterface[]) => {
    const result:JSX.Element[] = [];
    actions.forEach(a => {
      result.push(<li className="olfAction"><MarkdownPreview value={a.content} /></li>);
    });
    return result;
  }

  const groupActions = (actions: FeedActionInterface[]) => {
    let lastActionType = "";
    const result:any[] = [];
    actions?.forEach((a) => {
      if (lastActionType !== a.actionType || result.length === 0) {
        result.push({ actions: [a]});
        lastActionType = a.actionType
      }
      else result[result.length - 1].actions.push(a);
    });
    return result;
  }

  const getSections = () => {
    const result:JSX.Element[] = [];
    props.feed?.sections?.forEach((s, sectionIndex) => {
      result.push(<div className="olfSection" key={"section" + sectionIndex}>
        <h2>{s.name}</h2>
        {getActionGroups(s)}

      </div>);
    });
    return result;
  }

  return <div id="olfPrint">
    <div className="olfHeader">
      {props.feed.lessonImage && <div>
        <Image src={props.feed.lessonImage} alt="lesson image" width={256} height={144} style={{float:"right"}} />
      </div>}
      <h1>{props.feed.studyName}</h1>
      <h2>{props.feed.lessonName} | {props.feed.name}</h2>
      <div>
        <MarkdownPreview value={props.feed.lessonDescription} />
      </div>
      <div style={{clear:"both"}}></div>
    </div>
    <div className="olfBody">
      {getSections()}
    </div>


  </div>
}
