import { ActionInterface, ArrayHelper, CustomizationHelper, CustomizationInterface, FeedSectionInterface } from "@/helpers";
import { Action } from "./Action";
import { Card, CardContent, CardHeader } from "@mui/material";

interface Props {
  lessonId?: string;
  section: FeedSectionInterface;
  toggleActive: (id: string) => void;
  activeSectionId: string | string[];
  customizations?: CustomizationInterface[]
}

export function Section(props: Props) {

  const getActions = (action: ActionInterface) => {
    let result: JSX.Element = <></>;

    if (!shouldHide(action.id)) {
      result = <Action action={action} lessonId={props.lessonId} key={action.id} />
    }

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
      const customRoles = CustomizationHelper.applyCustomSort(props.customizations, props.section.actions, "role");
      customRoles.forEach((r) => {
        if (!shouldHide(r.roleId)) result.push(
          <div className="part" key={r.id}>
            {getActions(r)}
          </div>
        );
      });
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
