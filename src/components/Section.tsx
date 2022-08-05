import { SectionInterface, ResourceInterface, ActionInterface, ArrayHelper, CustomizationInterface, CustomizationHelper, ExternalVideoInterface } from "@/utils";
import { Action } from "./Action";
import { Accordion, AccordionDetails, AccordionSummary, Icon } from "@mui/material";

type Props = {
  section: SectionInterface;
  resources: ResourceInterface[];
  externalVideos: ExternalVideoInterface[];
  toggleActive: (id: string) => void;
  activeSectionId: string;
  customizations?: CustomizationInterface[]
};

export function Section(props: Props) {

  const getActions = (actions: ActionInterface[]) => {
    const result: JSX.Element[] = [];
    const customActions = CustomizationHelper.applyCustomSort(props.customizations, actions, "action");
    customActions.forEach((a) => {
      if (!shouldHide(a.id)) {
        result.push(<Action action={a} resources={props.resources} externalVideos={props.externalVideos} key={a.id} lessonId={props.section.lessonId} />);
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
        if (!shouldHide(r.id)) result.push(
          <div className="part" key={r.id}>
            <div className="role">
              <span>{r.name}</span>
            </div>
            {getActions(r.actions)}
          </div>
        );
      });
    }
    return result;
  };

  const getMaterials = () => {
    const downloads = [];
    props.section.roles?.forEach(r => {
      r.actions.forEach(a => {
        if (a.actionType === "Download") downloads.push(a.content);
      })
    })
    if (props.section.materials || downloads) {
      return (<div className="materials">
        <b>Materials:</b> {props.section.materials} {downloads}
      </div>)
    }
  }



  if (shouldHide(props.section?.id)) return <></>
  else return (
    <Accordion expanded={props.activeSectionId === props.section?.id} onChange={() => { props.toggleActive((props.activeSectionId === props.section.id) ? null : props.section.id); }}>
      <AccordionSummary expandIcon={<Icon>expand_more</Icon>} aria-controls="panel1bh-content" id="panel1bh-header" >
        {props.section.name}
      </AccordionSummary>
      <AccordionDetails>
        {getMaterials()}
        {getParts()}
      </AccordionDetails>
    </Accordion>
  );
}
