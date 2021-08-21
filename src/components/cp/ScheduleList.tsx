import { useState, useEffect } from "react";
import { ScheduleInterface, ApiHelper } from "@/utils";
import { DisplayBox, Loading, ScheduleEdit } from "../index";
import { DateHelper } from "@/appBase/helpers";


type Props = {
  classroomId: string;
};



export function ScheduleList(props: Props) {
  const [schedules, setSchedules] = useState<ScheduleInterface[]>(null);
  const [editSchedule, setEditSchedule] = useState<ScheduleInterface>(null);

  const loadData = () => {
    ApiHelper.get("/schedules/classroom/" + props.classroomId, "LessonsApi").then((data: any) => {
      setSchedules(data);
    });
  };

  const getRows = () => {
    const result: JSX.Element[] = [];
    schedules.forEach((s) => {
      result.push(
        <tr className="scheduleRow" key={s.id}>
          <td>
            <i className="fas fa-calendar-alt"></i>{" "}
            {DateHelper.formatHtml5Date(s?.scheduledDate)}
          </td>
          <td>
            {s.displayName}
          </td>
          <td style={{ textAlign: "right" }}>
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
      <a href="about:blank" onClick={(e) => { e.preventDefault(); setEditSchedule({ classroomId: props.classroomId, }); }}>
        <i className="fas fa-plus"></i>
      </a>
    );
  };

  useEffect(loadData, [props.classroomId]);

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
