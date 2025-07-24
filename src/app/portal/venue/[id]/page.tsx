"use client";

import { useParams, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Box,
  Button,
  Container,
  FormControl,
  FormControlLabel,
  FormLabel,
  Icon,
  Menu,
  MenuItem,
  Radio,
  RadioGroup } from "@mui/material";
import { DisplayBox, Loading } from "@churchapps/apphelper";
import { Layout } from "@/components";
import { ActionInterface,
  ApiHelper,
  ArrayHelper,
  CustomizationHelper,
  CustomizationInterface,
  LessonInterface,
  RoleInterface,
  SectionInterface,
  StudyInterface,
  VenueInterface } from "@/helpers";

type PageParams = { id: string };

export default function Venue() {
  const params = useParams<PageParams>();
  const searchParams = useSearchParams();
  const [venue, setVenue] = useState<VenueInterface>(null);
  const [lesson, setLesson] = useState<LessonInterface>(null);
  const [study, setStudy] = useState<StudyInterface>(null);
  const [sections, setSections] = useState<SectionInterface[]>(null);
  const [roles, setRoles] = useState<RoleInterface[]>(null);
  const [actions, setActions] = useState<ActionInterface[]>(null);
  const [customizations, setCustomizations] = useState<CustomizationInterface[]>([]);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [customizationFor, setCustomizationFor] = useState<string>(null);

  const { isAuthenticated } = ApiHelper;
  const router = useRouter();
  const pathId = params.id;
  const classroomId = searchParams.get("classroomId");
  const open = Boolean(anchorEl);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    if (!isAuthenticated) router.push("/login");
  }, []);
  useEffect(() => {
    if (isAuthenticated) loadData();
  }, [pathId, isAuthenticated]);

  const getInitialCustomizationState = (contentType: string, contentId: string) => {
    const contentItems = ArrayHelper.getAll(customizations, "contentType", contentType);
    const items = ArrayHelper.getAll(contentItems, "contentId", contentId);
    const ITEM = ArrayHelper.getOne(items, "action", "remove");
    if (!ITEM) return null;
    return ITEM.classroomId ? "specific" : "all";
  };

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
    const contentType = event.currentTarget.dataset.contentType;
    const contentId = event.currentTarget.dataset.contentId;
    const initialState = getInitialCustomizationState(contentType, contentId);
    setCustomizationFor(initialState);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  function loadData() {
    ApiHelper.get("/venues/public/" + pathId, "LessonsApi").then((v: VenueInterface) => {
      setVenue(v);
      ApiHelper.get("/lessons/public/" + v.lessonId, "LessonsApi").then((data: any) => {
        setLesson(data);
        ApiHelper.get("/studies/public/" + data.studyId, "LessonsApi").then((d: any) => {
          setStudy(d);
        });
      });
      ApiHelper.get("/sections/public/venue/" + v.id, "LessonsApi").then((data: any) => {
        setSections(data);
      });
      ApiHelper.get("/roles/public/lesson/" + v.lessonId, "LessonsApi").then((data: any) => {
        setRoles(data);
      });
      ApiHelper.get("/actions/public/lesson/" + v.lessonId, "LessonsApi").then((data: any) => {
        setActions(data);
      });
      ApiHelper.get("/customizations/venue/" + v.id + "?classroomId=" + classroomId, "LessonsApi").then((data: CustomizationInterface[]) =>
        setCustomizations(data));
    });
  }

  const toggleTrash = async (contentType: string, contentId: string, type: string) => {
    const contentItems = ArrayHelper.getAll(customizations, "contentType", contentType);
    const items = ArrayHelper.getAll(contentItems, "contentId", contentId);
    const ITEM = ArrayHelper.getOne(items, "action", "remove");
    if (ITEM) {
      if (type === "none") {
        await ApiHelper.delete("/customizations/" + ITEM.id, "LessonsApi");
      } else {
        let id = type === "specific" ? classroomId : null;
        const c: CustomizationInterface = { ...ITEM };
        c.classroomId = id;
        await ApiHelper.post("/customizations", [c], "LessonsApi");
      }
    } else {
      let id = type === "specific" ? classroomId : null;
      const c: CustomizationInterface = {
        contentType,
        contentId,
        venueId: venue.id,
        action: "remove",
        classroomId: id
      };
      await ApiHelper.post("/customizations", [c], "LessonsApi");
    }
    ApiHelper.get("/customizations/venue/" + venue.id + "?classroomId=" + classroomId, "LessonsApi").then((data: CustomizationInterface[]) =>
      setCustomizations(data));
  };

  const move = async (contentType: string, item: any, swap: any, type: string) => {
    const contentCustomizations = ArrayHelper.getAll(customizations, "contentType", contentType);
    let itemCust: CustomizationInterface = ArrayHelper.getOne(contentCustomizations, "contentId", item.id);
    let swapCust: CustomizationInterface = ArrayHelper.getOne(contentCustomizations, "contentId", swap.id);
    const id = type === "specific" ? classroomId : null;

    if (!itemCust) {
      itemCust = {
        contentType,
        contentId: item.id,
        venueId: venue.id,
        action: "sort",
        actionContent: item.sort,
        classroomId: id
      };
    } else {
      itemCust = { ...itemCust, classroomId: id };
    }
    if (!swapCust) {
      swapCust = {
        contentType,
        contentId: swap.id,
        venueId: venue.id,
        action: "sort",
        actionContent: swap.sort,
        classroomId: id
      };
    } else {
      swapCust = { ...swapCust, classroomId: id };
    }

    const swapSort = swapCust.actionContent;
    swapCust.actionContent = itemCust.actionContent;
    itemCust.actionContent = swapSort;

    await ApiHelper.post("/customizations", [itemCust, swapCust], "LessonsApi");
    ApiHelper.get("/customizations/venue/" + venue.id + "?classroomId=" + classroomId, "LessonsApi").then((data: CustomizationInterface[]) =>
      setCustomizations(data));
  };

  const handleSave = (type: string) => {
    const contentType = anchorEl.dataset.contentType;
    if (anchorEl.id === "delete-button") {
      toggleTrash(contentType, anchorEl.dataset.contentId, type);
    } else if (anchorEl.id === "up-button" || anchorEl.id === "down-button") {
      const item = JSON.parse(anchorEl.dataset.item);
      const swapItem = JSON.parse(anchorEl.dataset.swapItem);
      move(contentType, item, swapItem, type);
    }
    handleClose();
  };

  const getRows = () => {
    const result: JSX.Element[] = [];
    const sorted: SectionInterface[] = CustomizationHelper.applyCustomSort(customizations, sections, "section");
    let idx = 0;
    sorted.forEach(s => {
      const removed = determineRemoved(s.id);
      const removedClass = removed ? " removed" : "";
      const links = getLinks("section", s.id, false, idx, sorted);

      result.push(<tr className={"sectionRow hoverHighlight" + removedClass} key={`s-${s.id}`}>
        <td>
          <Icon sx={{ marginRight: "5px" }}>list_alt</Icon> {s.name}
        </td>
        <td>{links}</td>
      </tr>);
      getRoles(s.id, removed).forEach(r => result.push(r));
      idx++;
    });
    return result;
  };

  const getRoles = (sectionId: string, parentRemoved: boolean) => {
    const result: JSX.Element[] = [];
    if (roles) {
      let idx = 0;
      const filtered = ArrayHelper.getAll(roles, "sectionId", sectionId);
      const sorted: RoleInterface[] = CustomizationHelper.applyCustomSort(customizations, filtered, "role");
      sorted.forEach(r => {
        const removed = parentRemoved || determineRemoved(r.id);
        const removedClass = removed ? " removed" : "";
        const links = getLinks("role", r.id, parentRemoved, idx, sorted);

        result.push(<tr className={"roleRow hoverHighlight" + removedClass} key={`r-${r.id}`}>
          <td>
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <Icon sx={{ marginRight: "5px" }}>person</Icon> {r.name}
            </Box>
          </td>
          <td>{links}</td>
        </tr>);
        getActions(r.id, removed).forEach(i => result.push(i));
        idx++;
      });
    }
    return result;
  };

  const determineRemoved = (contentId: string) => {
    let result = false;
    const allRemoved = ArrayHelper.getAll(customizations, "action", "remove");
    if (allRemoved.length > 0) result = ArrayHelper.getOne(allRemoved, "contentId", contentId) !== null;
    return result;
  };

  const getActions = (roleId: string, parentRemoved: boolean) => {
    const result: JSX.Element[] = [];
    if (actions) {
      let idx = 0;
      const filtered = ArrayHelper.getAll(actions, "roleId", roleId);
      const sorted: ActionInterface[] = CustomizationHelper.applyCustomSort(customizations, filtered, "action");
      sorted.forEach((a: ActionInterface) => {
        const removed = parentRemoved || determineRemoved(a.id);
        const removedClass = removed ? " removed" : "";

        const links = getLinks("action", a.id, parentRemoved, idx, sorted);
        result.push(<tr className={"actionRow hoverHighlight" + removedClass} key={`a-${a.id}`}>
          <td>
            <span>
              <Icon sx={{ marginRight: "5px" }}>check</Icon> {a.actionType}: {a.content}
            </span>
          </td>
          <td>{links}</td>
        </tr>);
        idx++;
      });
    }
    return result;
  };

  const getTable = () => {
    if (sections === null) {
      return <Loading />;
    } else {
      return (
        <table className="table table-sm" id="adminTree">
          <tbody>{getRows()}</tbody>
        </table>
      );
    }
  };

  const getDeleteLink = (contentType: string, contentId: string) => (
    <Button
      id="delete-button"
      data-content-type={contentType}
      data-content-id={contentId}
      aria-controls={open ? "basic-menu" : undefined}
      aria-haspopup="true"
      aria-expanded={open ? "true" : undefined}
      onClick={handleClick}
      size="small">
      <Icon color="error">delete</Icon>
    </Button>
  );

  const getUpLink = (contentType: string, item: any, swapItem: any) => (
    <Button
      id="up-button"
      data-content-type={contentType}
      data-item={JSON.stringify(item)}
      data-swap-item={JSON.stringify(swapItem)}
      aria-controls={open ? "basic-menu" : undefined}
      aria-haspopup="true"
      aria-expanded={open ? "true" : undefined}
      onClick={handleClick}
      size="small">
      <Icon>arrow_upward</Icon>
    </Button>
  );

  const getDownLink = (contentType: string, item: any, swapItem: any) => (
    <Button
      id="down-button"
      data-content-type={contentType}
      data-item={JSON.stringify(item)}
      data-swap-item={JSON.stringify(swapItem)}
      aria-controls={open ? "basic-menu" : undefined}
      aria-haspopup="true"
      aria-expanded={open ? "true" : undefined}
      onClick={handleClick}
      size="small">
      <Icon>arrow_downward</Icon>
    </Button>
  );

  const getLinks = (contentType: string, contentId: string, parentRemoved: boolean, index: number, array: any[]) => {
    const result: JSX.Element[] = [];
    if (index > 0) result.push(getUpLink(contentType, array[index], array[index - 1]));
    if (index < array.length - 1) result.push(getDownLink(contentType, array[index], array[index + 1]));
    if (!parentRemoved) result.push(getDeleteLink(contentType, contentId));
    return result;
  };

  return (
    <Layout>
      <Container fixed>
        <h1>Customize Lesson</h1>
        <p>You can customize each lesson for you church by removing sections you do not wish to use.</p>
        <h4>
          {study?.name} - {lesson?.name}: {venue?.name}
        </h4>
        <DisplayBox headerText="Sections" headerIcon="none">
          {getTable()}
        </DisplayBox>
        <Menu
          id="basic-menu"
          anchorEl={anchorEl}
          open={open}
          onClose={handleClose}
          MenuListProps={{
            "aria-labelledby": "delete-button up-button down-button"
          }}>
          <FormControl fullWidth>
            <FormLabel sx={{ paddingLeft: 2, paddingRight: 2 }} id="customization-menu-heading">
              Apply selected customization to:
            </FormLabel>
            <RadioGroup
              aria-labelledby="customization-menu-heading"
              name="customization-radio-buttons"
              value={customizationFor}
              onChange={e => {
                e.preventDefault();
                setCustomizationFor(e.target.value);
                handleSave(e.target.value);
              }}>
              <MenuItem dense>
                <FormControlLabel value="specific" control={<Radio />} label="This Classroom" />
              </MenuItem>
              <MenuItem dense>
                <FormControlLabel value="all" control={<Radio />} label="All the Classrooms" />
              </MenuItem>
              {anchorEl?.id === "delete-button" && customizationFor !== null && (
                <MenuItem dense>
                  <FormControlLabel value="none" control={<Radio />} label="None" />
                </MenuItem>
              )}
            </RadioGroup>
          </FormControl>
        </Menu>
      </Container>
    </Layout>
  );
}
