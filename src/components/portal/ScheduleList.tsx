import { useState, useEffect } from "react";
import { ScheduleInterface, ApiHelper } from "@/utils";
import { ScheduleEdit } from "../index";
import { DisplayBox, Loading, ArrayHelper, DateHelper, SmallButton } from "@churchapps/apphelper";
import Link from "next/link";
import { Icon } from "@mui/material";

type Props = {
  classroomId: string;
};

export function ScheduleList(props: Props) {
  const [schedules, setSchedules] = useState<ScheduleInterface[]>(null);
  const [editSchedule, setEditSchedule] = useState<ScheduleInterface>(null);

  const loadData = () => {
    ApiHelper.get("/schedules/classroom/" + props.classroomId, "LessonsApi").then((data: any) => {
      ArrayHelper.sortBy(data, "scheduledDate", true);
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
            <Link href={"/portal/venue/" + s.venueId}><Icon sx={{ marginRight: "5px" }}>psychology</Icon></Link>
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
    const newSchedule:ScheduleInterface = { classroomId: props.classroomId, scheduledDate: new Date(), lessonId: "", venueId: "" };
    if (schedules?.length > 0) {
      const lastSchedule = schedules[0];
      newSchedule.lessonId = lastSchedule.lessonId;
      newSchedule.venueId = lastSchedule.venueId;
      newSchedule.scheduledDate = DateHelper.addDays(new Date(lastSchedule.scheduledDate), 7);
    }

    return (<SmallButton icon="add" onClick={() => { setEditSchedule(newSchedule); }} />);
  };

  useEffect(loadData, [props.classroomId]);

  if (editSchedule) return (<ScheduleEdit schedule={editSchedule} schedules={schedules} updatedCallback={() => { setEditSchedule(null); loadData(); }} />);
  else
    return (
      <>
        <DisplayBox headerText="Schedules" headerIcon="calendar_month" editContent={getEditContent()}>
          {getTable()}
        </DisplayBox>
      </>
    );
}
