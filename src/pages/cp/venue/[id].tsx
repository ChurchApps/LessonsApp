import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { Layout, DisplayBox, Loading } from "@/components";
import { VenueInterface, LessonInterface, StudyInterface, SectionInterface, RoleInterface, ActionInterface, ApiHelper, ArrayHelper, CustomizationInterface, CustomizationHelper } from "@/utils";
import { Container, Icon, Box } from "@mui/material";

export default function Venue() {
  const [venue, setVenue] = useState<VenueInterface>(null);
  const [lesson, setLesson] = useState<LessonInterface>(null);
  const [study, setStudy] = useState<StudyInterface>(null);
  const [sections, setSections] = useState<SectionInterface[]>(null);
  const [roles, setRoles] = useState<RoleInterface[]>(null);
  const [actions, setActions] = useState<ActionInterface[]>(null);
  const [customizations, setCustomizations] = useState<CustomizationInterface[]>([]);


  const { isAuthenticated } = ApiHelper;
  const router = useRouter();
  const pathId = router.query.id;

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => { if (!isAuthenticated) router.push("/login"); }, []);
  useEffect(() => { if (isAuthenticated) { loadData(); } }, [pathId, isAuthenticated]);


  function loadData() {
    ApiHelper.get("/venues/public/" + pathId, "LessonsApi").then((v: VenueInterface) => {
      setVenue(v);
      ApiHelper.get("/lessons/public/" + v.lessonId, "LessonsApi").then((data: any) => {
        setLesson(data);
        ApiHelper.get("/studies/public/" + data.studyId, "LessonsApi").then((d: any) => { setStudy(d); });
      });
      ApiHelper.get("/sections/public/venue/" + v.id, "LessonsApi").then((data: any) => { setSections(data); });
      ApiHelper.get("/roles/public/lesson/" + v.lessonId, "LessonsApi").then((data: any) => { setRoles(data); });
      ApiHelper.get("/actions/public/lesson/" + v.lessonId, "LessonsApi").then((data: any) => { setActions(data); });
      ApiHelper.get("/customizations/venue/" + v.id, "LessonsApi").then(data => setCustomizations(data));
    });
  }

  const toggleTrash = async (contentType: string, contentId: string) => {
    const contentItems = ArrayHelper.getAll(customizations, "contentType", contentType);
    const item = ArrayHelper.getOne(contentItems, "contentId", contentId);
    if (item) {
      await ApiHelper.delete("/customizations/" + item.id, "LessonsApi");
    } else {
      const c: CustomizationInterface = { contentType, contentId, venueId: venue.id, action: "remove" }
      await ApiHelper.post("/customizations", [c], "LessonsApi");
    }
    ApiHelper.get("/customizations/venue/" + venue.id, "LessonsApi").then(data => setCustomizations(data));
  }



  const move = async (contentType: string, item: any, swap: any) => {
    const contentCustomizations = ArrayHelper.getAll(customizations, "contentType", contentType);
    let itemCust: CustomizationInterface = ArrayHelper.getOne(contentCustomizations, "contentId", item.id);
    let swapCust: CustomizationInterface = ArrayHelper.getOne(contentCustomizations, "contentId", swap.id);

    if (!itemCust) itemCust = { contentType, contentId: item.id, venueId: venue.id, action: "sort", actionContent: item.sort };
    if (!swapCust) swapCust = { contentType, contentId: swap.id, venueId: venue.id, action: "sort", actionContent: swap.sort };

    const swapSort = swapCust.actionContent;
    swapCust.actionContent = itemCust.actionContent;
    itemCust.actionContent = swapSort;

    await ApiHelper.post("/customizations", [itemCust, swapCust], "LessonsApi");
    ApiHelper.get("/customizations/venue/" + venue.id, "LessonsApi").then(data => setCustomizations(data));
  }

  const getRows = () => {
    const result: JSX.Element[] = [];
    const sorted: SectionInterface[] = CustomizationHelper.applyCustomSort(customizations, sections, "section");
    let idx = 0;
    sorted.forEach((s) => {
      const removed = determineRemoved(s.id);
      const removedClass = (removed) ? " removed" : "";
      const links = getLinks("section", s.id, false, idx, sorted);

      result.push(<tr className={"sectionRow hoverHighlight" + removedClass} key={`s-${s.id}`}>
        <td>
          <Icon sx={{ marginRight: "5px" }}>list_alt</Icon> {s.name}
        </td>
        <td>
          {links}
        </td>
      </tr>);
      getRoles(s.id, removed).forEach((r) => result.push(r));
      idx++;
    });
    return result;
  };

  const getRoles = (sectionId: string, parentRemoved: boolean) => {
    const result: JSX.Element[] = [];
    if (roles) {
      let idx = 0;
      const filtered = ArrayHelper.getAll(roles, "sectionId", sectionId)
      const sorted: RoleInterface[] = CustomizationHelper.applyCustomSort(customizations, filtered, "role");
      sorted.forEach((r) => {
        const removed = parentRemoved || determineRemoved(r.id);
        const removedClass = (removed) ? " removed" : "";
        const links = getLinks("role", r.id, parentRemoved, idx, sorted);

        result.push(<tr className={"roleRow hoverHighlight" + removedClass} key={`r-${r.id}`}>
          <td><Box sx={{ display: "flex", alignItems: "center" }}><Icon sx={{ marginRight: "5px" }}>person</Icon> {r.name}</Box></td>
          <td>{links}</td>
        </tr>);
        getActions(r.id, removed).forEach((i) => result.push(i));
        idx++;
      });
    }
    return result;
  };

  const determineRemoved = (contentId: string) => {
    let result = false;
    const allRemoved = ArrayHelper.getAll(customizations, "action", "remove");
    if (allRemoved.length > 0) result = ArrayHelper.getOne(allRemoved, "contentId", contentId) !== null
    return result;
  }

  const getActions = (roleId: string, parentRemoved: boolean) => {
    const result: JSX.Element[] = [];
    if (actions) {
      let idx = 0;
      const filtered = ArrayHelper.getAll(actions, "roleId", roleId);
      const sorted: ActionInterface[] = CustomizationHelper.applyCustomSort(customizations, filtered, "action");
      sorted.forEach((a: ActionInterface) => {
        const removed = parentRemoved || determineRemoved(a.id);
        const removedClass = (removed) ? " removed" : "";

        const links = getLinks("action", a.id, parentRemoved, idx, sorted);
        result.push(
          <tr className={"actionRow hoverHighlight" + removedClass} key={`a-${a.id}`}>
            <td>
              <span><Icon sx={{ marginRight: "5px" }}>check</Icon> {a.actionType}: {a.content}</span>
            </td>
            <td>{links}</td>
          </tr>
        );
        idx++;
      });
    }
    return result;
  };

  const getTable = () => {
    if (sections === null) return <Loading />;
    else return (<table className="table table-sm" id="adminTree">
      <tbody>{getRows()}</tbody>
    </table>);
  };



  const getDeleteLink = (contentType: string, contentId: string) => {
    return (<a href="about:blank" onClick={(e) => { e.preventDefault(); toggleTrash(contentType, contentId) }}><Icon color="error">delete</Icon></a>)
  }

  const getUpLink = (contentType: string, item: any, swapItem: any) => {
    return (<a href="about:blank" onClick={(e) => { e.preventDefault(); move(contentType, item, swapItem) }}><Icon>arrow_upward</Icon></a>)
  }

  const getDownLink = (contentType: string, item: any, swapItem: any) => {
    return (<a href="about:blank" onClick={(e) => { e.preventDefault(); move(contentType, item, swapItem) }}><Icon>arrow_downward</Icon></a>)
  }

  const getLinks = (contentType: string, contentId: string, parentRemoved: boolean, index: number, array: any[]) => {
    const result: JSX.Element[] = [];
    if (index > 0) result.push(getUpLink(contentType, array[index], array[index - 1]));
    if (index < array.length - 1) result.push(getDownLink(contentType, array[index], array[index + 1]));
    if (!parentRemoved) result.push(getDeleteLink(contentType, contentId));
    return result;
  }

  return (
    <Layout>
      <Container fixed>
        <h1>Customize Lesson</h1>
        <p>You can customize each lesson for you church by removing sections you do not wish to use.</p>
        <h4>{study?.name} - {lesson?.name}: {venue?.name}</h4>
        <DisplayBox headerText="Sections" headerIcon="none">
          {getTable()}
        </DisplayBox>
      </Container>
    </Layout>
  );
}
