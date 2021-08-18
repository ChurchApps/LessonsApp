import { useState, useEffect } from "react";
import Link from "next/link";
import { ScheduleInterface, ApiHelper } from "@/utils";
import { DisplayBox, Loading, ScheduleEdit } from "../index";


type Props = {
  classroomId: string;
};



export function ScheduleList(props: Props) {
  const [schedules, setSchedules] = useState<ScheduleInterface[]>(null);
  const [editSchedule, setEditSchedule] = useState<ScheduleInterface>(null);

  const loadData = () => {
    ApiHelper.get("/schedules", "LessonsApi").then((data: any) => {
      setSchedules(data);
    });
  };

  const getRows = () => {
    const result: JSX.Element[] = [];
    schedules.forEach((s) => {
      result.push(
        <tr className="scheduleRow" key={s.id}>
          <td>
            <i className="fas fa-map-marker"></i>{" "}
            <Link href={"/admin/schedule/" + s.id}><a>{s.displayName}</a></Link>
          </td>
          <td>
            <a href="about:blank" onClick={(e) => { e.preventDefault(); setEditSchedule(s); }} >
              <i className="fas fa-pencil-alt"></i>
            </a>
          </td>
        </tr>
      );
    });
    return result;
  };

  const getTable = () => {
    if (schedules === null) return <Loading />;
    else
      return (
        <table className="table">
          <tbody>{getRows()}</tbody>
        </table>
      );
  };

  const getEditContent = () => {
    return (
      <a href="about:blank" onClick={(e) => { e.preventDefault(); setEditSchedule({}); }}>
        <i className="fas fa-plus"></i>
      </a>
    );
  };

  useEffect(loadData, []);

  if (editSchedule) return (<ScheduleEdit schedule={editSchedule} updatedCallback={() => { setEditSchedule(null); loadData(); }} />);
  else
    return (
      <>
        <DisplayBox headerText="Schedules" headerIcon="fas fa-calendar-alt" editContent={getEditContent()} >
          {getTable()}
        </DisplayBox>
      </>
    );
}
