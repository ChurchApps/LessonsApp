import { ActionInterface, ArrayHelper, CustomizationInterface, FeedSectionInterface } from "@/utils";
import { Action } from "./Action";
import { Card, CardContent, CardHeader } from "@mui/material";

type Props = {
  lessonId?: string;
  section: FeedSectionInterface;
  toggleActive: (id: string) => void;
  activeSectionId: string | string[];
  customizations?: CustomizationInterface[]
};

export function Section(props: Props) {

  const getActions = (actions: ActionInterface[]) => {

    const result: JSX.Element[] = [];
    //const customActions = CustomizationHelper.applyCustomSort(props.customizations, actions, "action");
    const customActions = actions; //TODO: Fix
    customActions.forEach((a) => {
      if (!shouldHide(a.id)) {
        result.push(<Action action={a} lessonId={props.lessonId} key={a.id} />);
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
    if (props.section?.actions) {
      result.push(<div className="part" key={props.section.name}>
        {getActions(props.section.actions)}
      </div>);
      /*
      const customRoles = CustomizationHelper.applyCustomSort(props.customizations, props.section.actions, "role");  //todo fix
      customRoles.forEach((r) => {
        if (!shouldHide(r.id)) result.push(
          <div className="part" key={r.id}>
            {getActions(r.actions)}
          </div>
        );
      });
      */
    }
    return result;
  };

  if (shouldHide(props.section?.name)) return <></>
  else if (props.section?.actions?.length === 0) return <></>
  else {
    return (<Card id={"section-" + props.section.name} className="sectionCard">
      <CardHeader title={props.section.name} subheader={(props.section.materials) && <><b>Materials:</b> {props.section.materials}</>}  />


      <CardContent>
        {getParts()}
      </CardContent>
    </Card>)
    /*
    return (<div id={"section-" + props.section.id} style={{clear:"both", marginBottom:40}}>
      <h3 style={{marginLeft:0, marginBottom:8, borderBottom: "1px solid #333", backgroundColor:"#03a9f4", color: "#FFFFFF", padding:10}}>{props.section.name}</h3>
      {getMaterials()}
      {getParts()}
    </div>);*/
  }


}
