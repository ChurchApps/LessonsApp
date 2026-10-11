import { Card, CardContent, CardHeader } from "@mui/material";
import {
  ActionInterface,
  ArrayHelper,
  CustomizationHelper,
  CustomizationInterface,
  FeedSectionInterface
} from "@/helpers";
import { Action } from "./Action";

interface Props {
  lessonId?: string;
  section: FeedSectionInterface;
  toggleActive: (id: string) => void;
  activeSectionId: string | string[];
  customizations?: CustomizationInterface[];
}

export function Section(props: Props) {
  const getActions = (action: ActionInterface) => {
    let result: React.JSX.Element = <></>;

    if (!shouldHide(action.id)) result = <Action action={action} lessonId={props.lessonId || ""} key={action.id} />;

    return result;
  };

  const shouldHide = (id: string | undefined) => {
    let result = false;
    if (props.customizations && props.customizations.length > 0) { const removeItems = ArrayHelper.getAll(props.customizations, "action", "remove"); result = ArrayHelper.getAll(removeItems, "contentId", id).length > 0; }
    return result;
  };

  const getParts = () => {
    const result: React.JSX.Element[] = [];
    if (props.section?.actions) {
      const customRoles = CustomizationHelper.applyCustomSort(props.customizations || [], props.section.actions, "role");
      customRoles.forEach(r => {
        if (!shouldHide(r.roleId)) {
          result.push(<div className="part" key={r.id}>
            {getActions(r)}
          </div>);
        }
      });
    }
    return result;
  };

  if (shouldHide(props.section?.name)) {
    return <></>;
  } else if (props.section?.actions?.length === 0) {
    return <></>;
  } else {
    return (
      <Card id={"section-" + props.section.name} className="sectionCard">
        <CardHeader
          title={props.section.name}
          subheader={
            props.section.materials && (
              <>
                <b>Materials:</b> {props.section.materials}
              </>
            )
          }
        />

        <CardContent>{getParts()}</CardContent>
      </Card>
    );
  }
}
