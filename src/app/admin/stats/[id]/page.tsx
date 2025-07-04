"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import { ApiHelper, ProgramInterface, StudyStatsInterface } from "@/helpers";
import { ArrayHelper, DateHelper, ChurchInterface, DisplayBox, InputBox, Banner } from "@churchapps/apphelper";
import { Wrapper } from "@/components/Wrapper";
import { Grid, TextField } from "@mui/material";

const Map = dynamic(() => import("@/components/admin/Map").then(mod => ({ default: mod.Map })), {
  loading: () => <div>Loading map...</div>
});

type PageParams = {id:string }
export default function Admin() {
  const params = useParams<PageParams>()

  let initialStartDate = new Date(new Date().getFullYear(), new Date().getMonth(), 1);
  let initialEndDate = new Date(initialStartDate.toDateString());
  initialEndDate.setMonth(initialEndDate.getMonth() + 1);
  initialEndDate.setDate(initialEndDate.getDate() - 1);

  const [program, setProgram] = useState<ProgramInterface>(null);
  const [studies, setStudies] = useState<StudyStatsInterface[]>([]);
  const [churches, setChurches] = useState<ChurchInterface[]>([]);
  const [startDate, setStartDate] = useState<Date>(initialStartDate);
  const [endDate, setEndDate] = useState<Date>(initialEndDate);

  const router = useRouter();
  const { isAuthenticated } = ApiHelper
  const programId = params.id;

  useEffect(() => { if (!isAuthenticated) { router.push("/login"); } }, []);     // eslint-disable-line react-hooks/exhaustive-deps
  useEffect(() => { if (isAuthenticated) { loadData(); } }, [isAuthenticated]);

  function loadData() {
    ApiHelper.get("/programs/" + programId, "LessonsApi").then((data: ProgramInterface) => { setProgram(data); });
    filterResults();
  }

  const filterResults = () => {
    const dateString = "?startDate=" + DateHelper.formatHtml5Date(startDate) + "&endDate=" + DateHelper.formatHtml5Date(endDate);
    ApiHelper.get("/downloads/" + programId + "/studies" + dateString, "LessonsApi").then(d => setStudies(d));
    ApiHelper.get("/downloads/" + programId + "/churches" + dateString, "LessonsApi").then((churchList: ChurchInterface[]) => {
      const ids = ArrayHelper.getIds(churchList, "churchId");
      ApiHelper.post("/churches/byIds", ids, "MembershipApi").then(d => setChurches(d));
    });

  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const val = e.target.value;
    switch (e.target.name) {
      case "startDate": setStartDate(new Date(val)); break;
      case "endDate": setEndDate(new Date(val)); break;
    }
  }

  const getStudyRows = () => {
    const result: JSX.Element[] = []
    studies.forEach(s => {
      result.push(<tr>
        <td>{s.studyName}</td>
        <td>{s.downloadCount}</td>
      </tr>)
    })
    return result;
  }

  const getChurchRows = () => {
    const result: JSX.Element[] = []
    churches.forEach(c => {
      result.push(<tr>
        <td>{c.name}</td>
        <td>{c.city}, {c.state}</td>
      </tr>)
    })
    return result;
  }

  return (
    <Wrapper>
      <Banner><h1>Stats for {program?.name}</h1></Banner>
      <div id="mainContent">
        <Grid container spacing={3}>
          <Grid item md={8} xs={12}>
            <DisplayBox headerText="Unique Downloads by Study" headerIcon="bar_chart">
              <p style={{ marginTop: 0 }}>Note: These are <u>unique</u> counts.  A person may download multiple files within a lesson, download a lesson multiple times, or download multiple lessons within a series.  All of these scenarios counts as a single record on this report.</p>
              <table className="table reportTable">
                <thead>
                  <tr><th>Study</th><th>Unique Downloads</th></tr>
                </thead>
                {getStudyRows()}
              </table>
            </DisplayBox>



            <Map programId={program?.id} startDate={startDate} endDate={endDate} />

          </Grid>
          <Grid item md={4} xs={12}>
            <InputBox headerText="Filter" headerIcon="bar_chart" saveFunction={filterResults} saveText="Update">
              <TextField fullWidth label="Start Date" name="startDate" type="date" aria-label="date" value={DateHelper.formatHtml5Date(startDate)} onChange={handleChange} />
              <TextField fullWidth label="End Date" name="endDate" type="date" aria-label="date" value={DateHelper.formatHtml5Date(endDate)} onChange={handleChange} />
            </InputBox>

            <DisplayBox headerText="Church List" headerIcon="bar_chart">
              <p>Note: Login is not required to download items, so many churches will download the files anonymously.  This is a list of churches who were logged in when downloading resources.</p>
              <table className="table table-striped reportTable">
                <thead>
                  <tr><th>Church</th><th>Location</th></tr>
                </thead>
                {getChurchRows()}
              </table>
            </DisplayBox>

          </Grid>
        </Grid>
      </div>
    </Wrapper>
  );
}
