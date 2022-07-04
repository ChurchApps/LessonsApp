import { useState, useEffect } from "react";
import Link from "next/link";
import { ClassroomInterface, ApiHelper } from "@/utils";
import { DisplayBox, Loading, ClassroomEdit } from "../index";
import { SmallButton } from "@/appBase/components";
import { Icon, Stack } from "@mui/material";

type Props = {
  classroomSelected: (classroomId: string) => void;
  showFeed: (classroomId: string) => void;
};

export function ClassroomList(props: Props) {
  const [classrooms, setClassrooms] = useState<ClassroomInterface[]>(null);
  const [editClassroom, setEditClassroom] = useState<ClassroomInterface>(null);

  const loadData = () => {
    ApiHelper.get("/classrooms", "LessonsApi").then((data: any) => {
      setClassrooms(data);
    });
  };

  const getRows = () => {
    const result: JSX.Element[] = [];
    classrooms.forEach((c) => {
      result.push(
        <tr className="classroomRow" key={c.id}>
          <td>
            <Stack direction="row" alignItems="center">
              <Icon  sx={{marginRight: "5px"}}>school</Icon>
              <a href="about:blank" onClick={(e) => { e.preventDefault(); props.classroomSelected(c.id); }} >
                {c.name}
              </a>
            </Stack>
          </td>
          <td>
            <Stack direction="row" alignItems="center" justifyContent="flex-end" sx={{flexWrap: "wrap", gap: "5px"}}>
              <SmallButton icon="rss_feed" text="Subscribe" onClick={() => { props.showFeed(c.id); }} />
              <SmallButton icon="edit" text="Edit" onClick={() => { setEditClassroom(c); }} />
            </Stack>
          </td>
        </tr>
      );
    });
    return result;
  };

  const getTable = () => {
    if (classrooms === null) return <Loading />;
    else
      return (
        <table className="table classroomTable">
          <tbody>{getRows()}</tbody>
        </table>
      );
  };

  const getEditContent = () => {
    return (<SmallButton icon="add" onClick={() => { setEditClassroom({}) }} />);
  };

  useEffect(loadData, []);

  if (editClassroom) return (<ClassroomEdit classroom={editClassroom} updatedCallback={() => { setEditClassroom(null); loadData(); }} />);
  else
    return (
      <>
        <DisplayBox headerText="Classrooms" headerIcon="school" editContent={getEditContent()} >
          {getTable()}
        </DisplayBox>
      </>
    );
}
