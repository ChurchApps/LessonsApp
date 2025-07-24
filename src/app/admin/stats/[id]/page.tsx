"use client";

import dynamic from "next/dynamic";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Box, Grid, Paper, Stack, TextField, Typography, Button } from "@mui/material";
import { BarChart as BarChartIcon, FilterList as FilterIcon, Map as MapIcon, Business as BusinessIcon } from "@mui/icons-material";
import { ArrayHelper, ChurchInterface, DateHelper } from "@churchapps/apphelper";
import { Wrapper } from "@/components/Wrapper";
import { PageHeader } from "@churchapps/apphelper";
import { ApiHelper, ProgramInterface, StudyStatsInterface } from "@/helpers";

const Map = dynamic(() => import("@/components/admin/Map").then(mod => ({ default: mod.Map })), {
  loading: () => <div>Loading map...</div>
});

type PageParams = { id: string };
export default function Admin() {
  const params = useParams<PageParams>();

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
  const { isAuthenticated } = ApiHelper;
  const programId = params.id;

  useEffect(() => {
    if (!isAuthenticated) router.push("/login");
  }, []); // eslint-disable-line react-hooks/exhaustive-deps
  useEffect(() => {
    if (isAuthenticated) loadData();
  }, [isAuthenticated]);

  function loadData() {
    ApiHelper.get("/programs/" + programId, "LessonsApi").then((data: ProgramInterface) => {
      setProgram(data);
    });
    filterResults();
  }

  const filterResults = () => {
    const dateString = "?startDate=" + DateHelper.formatHtml5Date(startDate) + "&endDate=" + DateHelper.formatHtml5Date(endDate);
    ApiHelper.get("/downloads/" + programId + "/studies" + dateString, "LessonsApi").then((d: StudyStatsInterface[]) => setStudies(d));
    ApiHelper.get("/downloads/" + programId + "/churches" + dateString, "LessonsApi").then((churchList: ChurchInterface[]) => {
      const ids = ArrayHelper.getIds(churchList, "churchId");
      ApiHelper.post("/churches/byIds", ids, "MembershipApi").then((d: ChurchInterface[]) => setChurches(d));
    });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const val = e.target.value;
    switch (e.target.name) {
    case "startDate":
      setStartDate(new Date(val));
      break;
    case "endDate":
      setEndDate(new Date(val));
      break;
    }
  };

  const getStudyRows = () => {
    const result: JSX.Element[] = [];
    studies.forEach((s, index) => {
      result.push(<tr key={index} style={{ borderBottom: '1px solid var(--admin-border)' }}>
        <td style={{ padding: '12px' }}>{s.studyName}</td>
        <td style={{ padding: '12px', fontWeight: 500 }}>{s.downloadCount}</td>
      </tr>);
    });
    return result;
  };

  const getChurchRows = () => {
    const result: JSX.Element[] = [];
    churches.forEach((c, index) => {
      result.push(<tr key={index} style={{ borderBottom: '1px solid var(--admin-border)' }}>
        <td style={{ padding: '12px' }}>{c.name}</td>
        <td style={{ padding: '12px', color: 'var(--c1d2)' }}>
          {c.city}, {c.state}
        </td>
      </tr>);
    });
    return result;
  };

  return (
    <Wrapper>
      <Box sx={{ p: 0 }}>
        <PageHeader
          icon={<BarChartIcon />}
          title={`Stats for ${program?.name || 'Program'}`}
          subtitle="Download statistics and church engagement metrics"
        />

        <Paper
          sx={{
            p: { xs: 2, md: 3 },
            borderRadius: "0 0 8px 8px",
            minHeight: "calc(100vh - 200px)"
          }}>
          <Grid container spacing={3}>
            <Grid item md={8} xs={12}>
              <Paper
                sx={{
                  borderRadius: 2,
                  border: '1px solid var(--admin-border)',
                  boxShadow: 'var(--admin-shadow-sm)',
                  overflow: 'hidden',
                  mb: 3
                }}>
                <Box
                  sx={{
                    p: 2,
                    borderBottom: '1px solid var(--admin-border)',
                    backgroundColor: 'var(--c1l7)'
                  }}>
                  <Stack direction="row" alignItems="center" spacing={1}>
                    <BarChartIcon sx={{ color: 'var(--c1d2)', fontSize: '1.5rem' }} />
                    <Typography variant="h6" sx={{
                      color: 'var(--c1d2)',
                      fontWeight: 600,
                      lineHeight: 1,
                      fontSize: '1.25rem',
                      display: 'flex',
                      alignItems: 'center'
                    }}>
                      Unique Downloads by Study
                    </Typography>
                  </Stack>
                </Box>
                <Box sx={{ p: 3 }}>
                  <Typography variant="body2" sx={{ mb: 2, color: 'text.secondary' }}>
                    Note: These are <strong>unique</strong> counts. A person may download multiple files within a lesson, download a
                    lesson multiple times, or download multiple lessons within a series. All of these scenarios count as a
                    single record on this report.
                  </Typography>
                  <Box sx={{ overflowX: 'auto' }}>
                    <table className="table" style={{ width: '100%', borderCollapse: 'collapse' }}>
                      <thead>
                        <tr style={{ backgroundColor: 'var(--c1l7)' }}>
                          <th style={{ padding: '12px', textAlign: 'left', fontWeight: 600, color: 'var(--c1d2)' }}>Study</th>
                          <th style={{ padding: '12px', textAlign: 'left', fontWeight: 600, color: 'var(--c1d2)' }}>Unique Downloads</th>
                        </tr>
                      </thead>
                      <tbody>
                        {getStudyRows()}
                      </tbody>
                    </table>
                  </Box>
                </Box>
              </Paper>

              <Paper
                sx={{
                  borderRadius: 2,
                  border: '1px solid var(--admin-border)',
                  boxShadow: 'var(--admin-shadow-sm)',
                  overflow: 'hidden'
                }}>
                <Box
                  sx={{
                    p: 2,
                    borderBottom: '1px solid var(--admin-border)',
                    backgroundColor: 'var(--c1l7)'
                  }}>
                  <Stack direction="row" alignItems="center" spacing={1}>
                    <MapIcon sx={{ color: 'var(--c1d2)', fontSize: '1.5rem' }} />
                    <Typography variant="h6" sx={{
                      color: 'var(--c1d2)',
                      fontWeight: 600,
                      lineHeight: 1,
                      fontSize: '1.25rem',
                      display: 'flex',
                      alignItems: 'center'
                    }}>
                      Geographic Distribution
                    </Typography>
                  </Stack>
                </Box>
                <Box sx={{ p: 2 }}>
                  <Map programId={program?.id} startDate={startDate} endDate={endDate} />
                </Box>
              </Paper>
            </Grid>

            <Grid item md={4} xs={12}>
              <Paper
                sx={{
                  borderRadius: 2,
                  border: '1px solid var(--admin-border)',
                  boxShadow: 'var(--admin-shadow-sm)',
                  overflow: 'hidden',
                  mb: 3
                }}>
                <Box
                  sx={{
                    p: 2,
                    borderBottom: '1px solid var(--admin-border)',
                    backgroundColor: 'var(--c1l7)'
                  }}>
                  <Stack direction="row" alignItems="center" spacing={1}>
                    <FilterIcon sx={{ color: 'var(--c1d2)', fontSize: '1.5rem' }} />
                    <Typography variant="h6" sx={{
                      color: 'var(--c1d2)',
                      fontWeight: 600,
                      lineHeight: 1,
                      fontSize: '1.25rem',
                      display: 'flex',
                      alignItems: 'center'
                    }}>
                      Date Filter
                    </Typography>
                  </Stack>
                </Box>
                <Box sx={{ p: 3 }}>
                  <Stack spacing={3}>
                    <TextField
                      fullWidth
                      label="Start Date"
                      name="startDate"
                      type="date"
                      value={DateHelper.formatHtml5Date(startDate)}
                      onChange={handleChange}
                      InputLabelProps={{
                        shrink: true,
                      }}
                    />
                    <TextField
                      fullWidth
                      label="End Date"
                      name="endDate"
                      type="date"
                      value={DateHelper.formatHtml5Date(endDate)}
                      onChange={handleChange}
                      InputLabelProps={{
                        shrink: true,
                      }}
                    />
                  </Stack>
                </Box>
                <Box
                  sx={{
                    p: 2,
                    borderTop: '1px solid var(--admin-border)',
                    backgroundColor: 'var(--admin-bg)',
                    display: 'flex',
                    justifyContent: 'flex-end'
                  }}>
                  <Button
                    variant="contained"
                    onClick={filterResults}
                    startIcon={<FilterIcon />}>
                    Update Results
                  </Button>
                </Box>
              </Paper>

              <Paper
                sx={{
                  borderRadius: 2,
                  border: '1px solid var(--admin-border)',
                  boxShadow: 'var(--admin-shadow-sm)',
                  overflow: 'hidden'
                }}>
                <Box
                  sx={{
                    p: 2,
                    borderBottom: '1px solid var(--admin-border)',
                    backgroundColor: 'var(--c1l7)'
                  }}>
                  <Stack direction="row" alignItems="center" spacing={1}>
                    <BusinessIcon sx={{ color: 'var(--c1d2)', fontSize: '1.5rem' }} />
                    <Typography variant="h6" sx={{
                      color: 'var(--c1d2)',
                      fontWeight: 600,
                      lineHeight: 1,
                      fontSize: '1.25rem',
                      display: 'flex',
                      alignItems: 'center'
                    }}>
                      Church List
                    </Typography>
                  </Stack>
                </Box>
                <Box sx={{ p: 3 }}>
                  <Typography variant="body2" sx={{ mb: 2, color: 'text.secondary' }}>
                    Note: Login is not required to download items, so many churches will download the files anonymously.
                    This is a list of churches who were logged in when downloading resources.
                  </Typography>
                  <Box sx={{ overflowX: 'auto' }}>
                    <table className="table" style={{ width: '100%', borderCollapse: 'collapse' }}>
                      <thead>
                        <tr style={{ backgroundColor: 'var(--c1l7)' }}>
                          <th style={{ padding: '12px', textAlign: 'left', fontWeight: 600, color: 'var(--c1d2)' }}>Church</th>
                          <th style={{ padding: '12px', textAlign: 'left', fontWeight: 600, color: 'var(--c1d2)' }}>Location</th>
                        </tr>
                      </thead>
                      <tbody>
                        {getChurchRows()}
                      </tbody>
                    </table>
                  </Box>
                </Box>
              </Paper>
            </Grid>
          </Grid>
        </Paper>
      </Box>
    </Wrapper>
  );
}
