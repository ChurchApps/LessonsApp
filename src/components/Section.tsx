import { SectionInterface, ResourceInterface, ActionInterface, ArrayHelper, CustomizationInterface, CustomizationHelper, ExternalVideoInterface } from "@/utils";
import { Action } from "./Action";
import { Accordion, AccordionDetails, AccordionSummary, Icon } from "@mui/material";

type Props = {
  useAccordion: boolean;
  section: SectionInterface;
  resources: ResourceInterface[];
  externalVideos: ExternalVideoInterface[];
  toggleActive: (id: string) => void;
  activeSectionId: string | string[];
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
    const downloads:any = [];
    props.section.roles?.forEach(r => {
      r.actions.forEach(a => {
        if (a.actionType === "Download") downloads.push(a.content);
      })
    })
    if (props.section.materials) {
      return (<div className="materials">
        <b>Materials:</b> {props.section.materials} {downloads}
      </div>)
    }
  }



  if (shouldHide(props.section?.id)) return <></>
  else if (props.section?.roles?.length === 0) return <></>
  else if (!props.useAccordion) {
    return (<div id={"section-" + props.section.id} style={{clear:"both", marginBottom:40}}>
      <h3 style={{marginLeft:0, marginBottom:8, borderBottom: "1px solid #333", backgroundColor:"#03a9f4", color: "#FFFFFF", padding:10}}>{props.section.name}</h3>
      {getMaterials()}
      {getParts()}
    </div>);
  }
  else if (typeof props.activeSectionId === 'object' && props.activeSectionId) return (
    <Accordion expanded={true}>
      <AccordionSummary expandIcon={<Icon>expand_more</Icon>} aria-controls={props.section.id + "-content"} id={props.section.id + "-header"}>
        {props.section.name}
      </AccordionSummary>
      <AccordionDetails>
        {getMaterials()}
        {getParts()}
      </AccordionDetails>
    </Accordion>
  )
  else return (
    <Accordion expanded={props.activeSectionId === props.section?.id} onChange={() => { props.toggleActive((props.activeSectionId === props.section.id) ? null : props.section.id); }}>
      <AccordionSummary expandIcon={<Icon>expand_more</Icon>} aria-controls={props.section.id + "-content"} id={props.section.id + "-header"}>
        {props.section.name}
      </AccordionSummary>
      <AccordionDetails>
        {getMaterials()}
        {getParts()}
      </AccordionDetails>
    </Accordion>
  );

}
