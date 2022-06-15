import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { DisplayBox, InputBox } from "@/components";
import { ApiHelper, ChurchInterface, ProgramInterface } from "@/utils";
import { ArrayHelper, DateHelper } from "@/appBase/helpers";
import { Wrapper } from "@/components/Wrapper";
import { Grid, TextField } from "@mui/material";

export default function Admin() {

  let initialStartDate = new Date(new Date().getFullYear(), new Date().getMonth(), 1);
  let initialEndDate = new Date(initialStartDate.toDateString());
  initialEndDate.setMonth(initialEndDate.getMonth() + 1);
  initialEndDate.setDate(initialEndDate.getDate() - 1);

  const [program, setProgram] = useState<ProgramInterface>(null);
  const [studies, setStudies] = useState<any[]>([]);
  const [churches, setChurches] = useState<ChurchInterface[]>([]);
  const [startDate, setStartDate] = useState<Date>(initialStartDate);
  const [endDate, setEndDate] = useState<Date>(initialEndDate);

  const router = useRouter();
  const { isAuthenticated } = ApiHelper
  const programId = router.query.id;

  useEffect(() => { if (!isAuthenticated) { router.push("/login"); } }, []);     // eslint-disable-line react-hooks/exhaustive-deps
  useEffect(() => { if (isAuthenticated) { loadData(); } }, [isAuthenticated]);

  function loadData() {
    ApiHelper.get("/programs/" + programId, "LessonsApi").then((data: any) => { setProgram(data); });
    filterResults();
  }

  const filterResults = () => {
    const dateString = "?startDate=" + DateHelper.formatHtml5Date(startDate) + "&endDate=" + DateHelper.formatHtml5Date(endDate);
    ApiHelper.get("/downloads/" + programId + "/studies" + dateString, "LessonsApi").then(d => setStudies(d));
    ApiHelper.get("/downloads/" + programId + "/churches" + dateString, "LessonsApi").then((churchList: any[]) => {
      const ids = ArrayHelper.getIds(churchList, "churchId");
      ApiHelper.post("/churches/byIds", ids, "AccessApi").then(d => setChurches(d));
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
      <h1>Stats for {program?.name}</h1>
      <Grid container spacing={3}>
        <Grid item md={8} xs={12}>
          <DisplayBox headerText="Unique Downloads by Study" headerIcon="fas fa-chart-bar" >
            <p>Note: These are <u>unique</u> counts.  A person may download multiple files within a lesson, download a lesson multiple times, or download multiple lessons within a series.  All of these scenarios counts as a single record on this report.</p>
            <table className="table table-striped reportTable">
              <thead>
                <tr><th>Study</th><th>Unique Downloads</th></tr>
              </thead>
              {getStudyRows()}
            </table>
          </DisplayBox>

          <DisplayBox headerText="Church List" headerIcon="fas fa-chart-bar" >
            <p>Note: Login is not required to download items, so many churches will download the files anonymously.  This is a list of churches who were logged in when downloading resources.</p>
            <table className="table table-striped reportTable">
              <thead>
                <tr><th>Church</th><th>Location</th></tr>
              </thead>
              {getChurchRows()}
            </table>
          </DisplayBox>
        </Grid>
        <Grid item md={4} xs={12}>
          <InputBox headerText="Filter" headerIcon="fas fa-chart-bar" saveFunction={filterResults} saveText="Update" >
            <TextField fullWidth label="Start Date" name="startDate" type="date" aria-label="date" value={DateHelper.formatHtml5Date(startDate)} onChange={handleChange} />
            <TextField fullWidth label="End Date" name="endDate" type="date" aria-label="date" value={DateHelper.formatHtml5Date(endDate)} onChange={handleChange} />
          </InputBox>
        </Grid>
      </Grid>
    </Wrapper>
  );
}
