"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import Tab from "@mui/material/Tab";
import Tabs from "@mui/material/Tabs";
import Box from "@mui/material/Box";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useTheme } from "@mui/material/styles";
import { DateHelper } from "@churchapps/apphelper";
import { Layout } from "@/components/Layout";
import { Venue } from "@/components/lesson/Venue";
import { ClassroomInterface,
  CustomizationInterface,
  FeedVenueInterface,
  ScheduleInterface } from "@/helpers/interfaces";

interface Props {
  classroom: ClassroomInterface;
  customizations: CustomizationInterface[];
  currentSchedule: ScheduleInterface;
  prevSchedule: ScheduleInterface;
  nextSchedule: ScheduleInterface;
  venue: FeedVenueInterface;
  autoPrint: boolean;
}

export function VenueClient(props: Props) {
  const [selectedTab, setSelectedTab] = useState<string>("");
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const getVenue = () => {
    if (props.venue) {
      return (
        <Venue
          useAccordion={true}
          venue={props.venue}
          hidePrint={false}
          print={props.autoPrint ? 1 : 0}
          customizations={props.customizations}
        />
      );
    }
  };

  const getTabs = () => {
    const result: JSX.Element[] = [];
    props.venue?.sections?.forEach(s => {
      if (s.actions?.length > 0) result.push(<Tab key={s.name} label={s.name} value={s.name} />);
    });
    if (result.length === 0) {
      return <></>;
    } else {
      return (
        <Box sx={{
          position: 'sticky',
          top: 0,
          zIndex: 1000,
          backgroundColor: 'background.paper',
          borderBottom: 1,
          borderColor: 'divider',
          width: '100%',
          maxWidth: '100vw',
          overflow: 'hidden'
        }}>
          <Tabs
            value={selectedTab}
            onChange={(e, newVal) => {
              handleChange(newVal);
            }}
            variant="scrollable"
            scrollButtons="auto"
            allowScrollButtonsMobile
            sx={{
              minHeight: isMobile ? 36 : 48,
              '& .MuiTab-root': {
                minHeight: isMobile ? 36 : 48,
                fontSize: isMobile ? '0.75rem' : '0.875rem',
                padding: isMobile ? '6px 8px' : '12px 16px'
              }
            }}>
            {result}
          </Tabs>
        </Box>
      );
    }
  };

  const handleChange = (newValue: string) => {
    setSelectedTab(newValue);
    const element = document.getElementById("section-" + newValue);
    if (element) {
      const scrollTop = element.offsetTop - (isMobile ? 80 : 100);
      window.scrollTo({ top: scrollTop, behavior: "smooth" });
    }
  };

  const handleHighlight = () => {
    const elements = document.getElementsByClassName("sectionCard");
    let maxTop = 0;
    let result = "";
    const offset = isMobile ? 100 : 120;
    for (let i = 0; i < elements.length; i++) {
      const el: any = elements[i];
      if (window.scrollY >= el.offsetTop - offset && el.offsetTop > 0) {
        if (el.offsetTop > maxTop) {
          maxTop = el.offsetTop;
          result = el.id.replace("section-", "");
        }
      }
    }

    if (result !== selectedTab) setSelectedTab(result);
  };

  useEffect(() => {
    window.addEventListener("scroll", handleHighlight);

    return () => {
      window.removeEventListener("scroll", handleHighlight);
    };
  }, []);

  if (props.venue === null) {
    return <></>;
  } else {
    return (
      <Layout withoutNavbar={true} withoutFooter={true}>
        <Box sx={{
          width: "100%",
          maxWidth: "100vw",
          overflow: "hidden",
          minHeight: "100vh",
          position: "relative",
          // Force all child elements to respect container width
          '& *': {
            maxWidth: '100% !important',
            boxSizing: 'border-box'
          }
        }}>
          <div id="b1Tabs">{getTabs()}</div>
          <Container maxWidth="lg" sx={{
            mt: 2,
            mb: 2,
            px: isMobile ? 1 : 3,
            width: '100%',
            maxWidth: '100%',
            overflow: 'hidden'
          }}>
            <Box sx={{
              display: 'flex',
              flexDirection: isMobile ? 'column' : 'row',
              alignItems: isMobile ? 'flex-start' : 'center',
              gap: 2,
              mb: 3
            }}>
              <Link
                href={"/b1/" + props.classroom?.churchId}
                style={{
                  textDecoration: 'none',
                  color: 'primary.main',
                  fontSize: isMobile ? '0.875rem' : '1rem'
                }}
              >
              ← Go back
              </Link>
            </Box>

            <Grid container spacing={isMobile ? 1 : 2} sx={{ mb: 3 }}>
              <Grid item xs={12} sm={4}>
                {props.prevSchedule && (
                  <Box sx={{
                    textAlign: isMobile ? 'left' : 'left',
                    fontSize: isMobile ? '0.875rem' : '1rem'
                  }}>
                    <Link
                      href={"/b1/venue/" + props.prevSchedule?.venueId + "?classroomId=" + props.classroom?.id}
                      style={{ textDecoration: 'none' }}
                    >
                    ← {DateHelper.prettyDate(DateHelper.toDate(props.prevSchedule.scheduledDate))}
                    </Link>
                  </Box>
                )}
              </Grid>
              <Grid item xs={12} sm={4}>
                {props.currentSchedule && (
                  <Box sx={{
                    textAlign: 'center',
                    fontWeight: 'bold',
                    fontSize: isMobile ? '1rem' : '1.125rem'
                  }}>
                    {DateHelper.prettyDate(DateHelper.toDate(props.currentSchedule.scheduledDate))}
                  </Box>
                )}
              </Grid>
              <Grid item xs={12} sm={4}>
                {props.nextSchedule && (
                  <Box sx={{
                    textAlign: isMobile ? 'left' : 'right',
                    fontSize: isMobile ? '0.875rem' : '1rem'
                  }}>
                    <Link
                      href={"/b1/venue/" + props.nextSchedule?.venueId + "?classroomId=" + props.classroom?.id}
                      style={{ textDecoration: 'none' }}
                    >
                      {DateHelper.prettyDate(DateHelper.toDate(props.nextSchedule.scheduledDate))} →
                    </Link>
                  </Box>
                )}
              </Grid>
            </Grid>

            <Box sx={{
              mb: 3,
              textAlign: isMobile ? 'left' : 'center'
            }}>
              <h1 style={{
                margin: 0,
                fontSize: isMobile ? '1.5rem' : '2rem',
                lineHeight: 1.2,
                wordBreak: 'break-word'
              }}>
                {props.venue?.lessonName}
              </h1>
            </Box>
          </Container>

          <Container maxWidth="lg" sx={{
            px: isMobile ? 1 : 3,
            width: '100%',
            maxWidth: '100%',
            overflow: 'hidden'
          }}>
            <Box className="b1" sx={{
              width: "100%",
              maxWidth: "100%",
              overflow: "hidden",
              '& .MuiCard-root': {
                mb: 2,
                width: "100%",
                maxWidth: "100%"
              },
              '& .sectionCard': {
                width: "100%",
                maxWidth: "100%",
                overflow: "hidden"
              },
              '& .sectionCard .MuiCardHeader-title': {
                display: isMobile ? 'block' : 'inline-block',
                width: isMobile ? '100%' : 'auto',
                fontSize: isMobile ? '18px' : '20px',
                marginBottom: isMobile ? '8px' : '0'
              },
              '& .sectionCard .MuiCardHeader-subheader': {
                display: isMobile ? 'block' : 'inline-block',
                paddingLeft: isMobile ? '0' : '20px',
                fontSize: isMobile ? '12px' : '13px',
                wordBreak: 'break-word'
              },
              '& .MuiCardContent-root': {
                width: "100%",
                maxWidth: "100%",
                overflow: "hidden"
              },
              '& .part': {
                width: "100%",
                maxWidth: "100%",
                overflow: "hidden"
              },
              // Fix mobile-specific layout issues
              '& pre': {
                whiteSpace: 'pre-wrap',
                wordBreak: 'break-word',
                overflowX: 'auto',
                maxWidth: '100%'
              },
              '& code': {
                wordBreak: 'break-word',
                whiteSpace: 'pre-wrap'
              },
              '& table': {
                width: '100%',
                maxWidth: '100%',
                overflowX: 'auto',
                display: 'block',
                whiteSpace: 'nowrap'
              },
              '& p, & div, & span': {
                wordBreak: 'break-word',
                overflowWrap: 'break-word',
                hyphens: 'auto'
              },
              ...(isMobile && {
                '& .playAction': {
                  height: 'auto !important',
                  minHeight: '60px',
                  display: 'flex',
                  flexDirection: 'row',
                  alignItems: 'center',
                  padding: '8px',
                  gap: '8px'
                },
                '& .playAction img': {
                  float: 'none !important',
                  width: '64px !important',
                  height: '36px !important',
                  borderRadius: '4px',
                  flexShrink: 0
                },
                '& .playAction .text': {
                  display: 'block !important',
                  padding: '0 !important',
                  fontSize: '14px !important',
                  lineHeight: 1.3,
                  flex: 1,
                  overflow: 'hidden',
                  textOverflow: 'ellipsis'
                },
                '& .playAction .duration': {
                  float: 'none !important',
                  padding: '0 !important',
                  fontSize: '12px',
                  flexShrink: 0
                },
                '& .part .note': {
                  paddingLeft: '8px !important',
                  backgroundSize: '24px',
                  backgroundPosition: '8px 8px',
                  minHeight: '40px !important'
                },
                '& .say p': {
                  width: '90% !important',
                  maxWidth: '100% !important',
                  marginLeft: '0 !important',
                  marginRight: '0 !important',
                  fontSize: '14px',
                  padding: '8px 12px !important'
                },
                '& .say p:nth-of-type(even)': {
                  float: 'none !important',
                  marginLeft: 'auto !important'
                },
                '& .actions': {
                  paddingLeft: '8px !important'
                },
                '& .actions li': {
                  fontSize: '14px !important'
                }
              })
            }}>
              {getVenue()}
            </Box>
          </Container>
        </Box>
      </Layout>
    );
  }
}
