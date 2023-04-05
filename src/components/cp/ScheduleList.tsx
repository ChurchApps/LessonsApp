import { useState, useEffect } from "react";
import { ScheduleInterface, ApiHelper } from "@/utils";
import { DisplayBox, Loading, ScheduleEdit } from "../index";
import { DateHelper } from "@/appBase/helpers";
import Link from "next/link";
import { SmallButton } from "@/appBase/components";
import { Icon } from "@mui/material";


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
            <Icon sx={{ marginRight: "5px" }}>calendar_month</Icon>
            {DateHelper.formatHtml5Date(s?.scheduledDate)}
          </td>
          <td>
            <Link href={"/cp/venue/" + s.venueId}><Icon sx={{ marginRight: "5px" }}>psychology</Icon></Link>
            {s.displayName}
          </td>
          <td style={{ textAlign: "right" }}>
            <a href="about:blank" onClick={(e) => { e.preventDefault(); setEditSchedule(s); }}><Icon>edit</Icon></a>
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
    const newSchedule = { classroomId: props.classroomId, scheduledDate: new Date(), lessonId: "", venueId: "" };
    newSchedule.scheduledDate.setHours(0, 0, 0, 0);
    return (<SmallButton icon="add" onClick={() => { setEditSchedule(newSchedule); }} />);
  };

  useEffect(loadData, [props.classroomId]);

  if (editSchedule) return (<ScheduleEdit schedule={editSchedule} updatedCallback={() => { setEditSchedule(null); loadData(); }} />);
  else
    return (
      <>
        <DisplayBox headerText="Schedules" headerIcon="calendar_month" editContent={getEditContent()}>
          {getTable()}
        </DisplayBox>
      </>
    );
}
