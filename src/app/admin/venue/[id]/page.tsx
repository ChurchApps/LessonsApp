"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Box, CircularProgress, IconButton, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Menu, MenuItem, Paper, Stack, Typography } from "@mui/material";
import { Add as AddIcon, ContentCopy as CopyIcon, List as ListIcon, Person as PersonIcon, Check as CheckIcon, LocationOn as LocationIcon } from "@mui/icons-material";
import { ActionEdit, RoleEdit, SectionCopy, SectionEdit } from "@/components";
import { PageHeader } from "@/components/admin";
import { Wrapper } from "@/components/Wrapper";
import {
  ActionInterface,
  AddOnInterface,
  ApiHelper,
  ArrayHelper,
  AssetInterface,
  CopySectionInterface,
  ExternalVideoInterface,
  LessonInterface,
  ResourceInterface,
  RoleInterface,
  SectionInterface,
  StudyInterface,
  VenueInterface
} from "@/helpers";

type PageParams = { id: string };

export default function Venue() {
  const params = useParams<PageParams>();
  const [venue, setVenue] = useState<VenueInterface>(null);
  const [lesson, setLesson] = useState<LessonInterface>(null);
  const [study, setStudy] = useState<StudyInterface>(null);
  const [sections, setSections] = useState<SectionInterface[]>(null);
  const [roles, setRoles] = useState<RoleInterface[]>(null);
  const [actions, setActions] = useState<ActionInterface[]>(null);
  const [copySection, setCopySection] = useState<CopySectionInterface>(null);
  const [editSection, setEditSection] = useState<SectionInterface>(null);
  const [editRole, setEditRole] = useState<RoleInterface>(null);
  const [editAction, setEditAction] = useState<ActionInterface>(null);
  const [menuAnchor, setMenuAnchor] = useState<any>(null);

  const [lessonResources, setLessonResources] = useState<ResourceInterface[]>(null);
  const [studyResources, setStudyResources] = useState<ResourceInterface[]>(null);
  const [programResources, setProgramResources] = useState<ResourceInterface[]>(null);
  const [addOns, setAddOns] = useState<AddOnInterface[]>(null);

  const [lessonVideos, setLessonVideos] = useState<ExternalVideoInterface[]>(null);
  const [studyVideos, setStudyVideos] = useState<ExternalVideoInterface[]>(null);
  const [programVideos, setProgramVideos] = useState<ExternalVideoInterface[]>(null);

  const [allAssets, setAllAssets] = useState<AssetInterface[]>(null);
  const { isAuthenticated } = ApiHelper;
  const router = useRouter();
  const pathId = params.id;

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    if (!isAuthenticated) router.push("/login");
  }, []);
  useEffect(() => {
    if (isAuthenticated) loadData();
  }, [pathId, isAuthenticated]);
  useEffect(() => {
    if (isAuthenticated) {
      loadResources();
      loadVideos();
    }
  }, [lesson, study, isAuthenticated]);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    if (isAuthenticated) loadAssets();
  }, [lessonResources, studyResources, programResources, isAuthenticated]);

  function loadResources() {
    if (lesson && study) {
      ApiHelper.get("/resources/content/lesson/" + lesson.id, "LessonsApi").then((data: any) => {
        setLessonResources(data);
      });
      ApiHelper.get("/resources/content/study/" + study.id, "LessonsApi").then((data: any) => {
        setStudyResources(data);
      });
      ApiHelper.get("/resources/content/program/" + study.programId, "LessonsApi").then((data: any) => {
        setProgramResources(data);
      });
    }
  }

  const loadVideos = () => {
    if (lesson && study) {
      ApiHelper.get("/externalVideos/content/lesson/" + lesson.id, "LessonsApi").then((data: any) => { setLessonVideos(data); });
      ApiHelper.get("/externalVideos/content/study/" + study.id, "LessonsApi").then((data: any) => { setStudyVideos(data); });
      ApiHelper.get("/externalVideos/content/program/" + study.programId, "LessonsApi").then((data: any) => { setProgramVideos(data); });
    }
  };

  function loadAssets() {
    if (allAssets === null) {
      if (lessonResources && studyResources && programResources) {
        const allResources = [].concat(lessonResources).concat(studyResources).concat(programResources);
        if (allResources.length > 0) {
          const resourceIds: string[] = ArrayHelper.getUniqueValues(allResources, "id");
          ApiHelper.get("/assets/resourceIds?resourceIds=" + resourceIds.join(","), "LessonsApi").then((data: any) => {
            setAllAssets(data);
          });
        }
      }
    }
  }

  async function loadData() {
    ApiHelper.get("/venues/" + pathId, "LessonsApi").then((v: VenueInterface) => {
      setVenue(v);
      ApiHelper.get("/lessons/" + v.lessonId, "LessonsApi").then((data: any) => {
        setLesson(data);
        ApiHelper.get("/studies/" + data.studyId, "LessonsApi").then((d: any) => {
          setStudy(d);
        });
      });
      ApiHelper.get("/sections/venue/" + v.id, "LessonsApi").then((data: any) => {
        setSections(data);
      });
      ApiHelper.get("/roles/public/lesson/" + v.lessonId, "LessonsApi").then((data: any) => {
        setRoles(data);
      });
      ApiHelper.get("/actions/public/lesson/" + v.lessonId, "LessonsApi").then((data: any) => {
        setActions(data);
      });
      ApiHelper.get("/addOns/public", "LessonsApi").then((data: any) => {
        setAddOns(data);
      });
    });
  }

  const clearEdits = () => {
    setEditSection(null);
    setEditRole(null);
    setEditAction(null);
    setCopySection(null);
  };

  const handleUpdated = () => {
    loadData();
    clearEdits();
  };

  const handleSectionUpdated = (section: SectionInterface, created: boolean) => {
    handleUpdated();
    if (created) createRole(section.id);
  };

  const handleRoleUpdated = (role: RoleInterface, created: boolean) => {
    handleUpdated();
    if (created) createAction(role.id);
  };

  const handleActionUpdated = (action: ActionInterface, created: boolean) => {
    handleUpdated();
    if (created) createAction(action.roleId, action.sort + 1);
  };

  const createSection = () => {
    clearEdits();
    setEditSection({
      lessonId: venue.lessonId,
      venueId: venue.id,
      sort: sections.length + 1
    });
  };

  const duplicateSection = () => {
    clearEdits();
    setCopySection({ sourceLessonId: lesson.id });
  };

  const createRole = (sectionId: string) => {
    const sort = ArrayHelper.getAll(roles, "sectionId", sectionId).length + 1;
    clearEdits();
    setEditRole({ lessonId: venue.lessonId, sectionId: sectionId, sort: sort });
  };

  const createAction = (roleId: string, sort?: number) => {
    if (!sort) sort = ArrayHelper.getAll(actions, "roleId", roleId).length + 1;
    clearEdits();
    // The markdown editor won't refresh if you simple send it new content.  This delay is to force a full re-render.
    setTimeout(() => {
      setEditAction({ lessonId: venue.lessonId, roleId: roleId, sort: sort, actionType: "Say", content: "" });
    }, 50);
  };

  const getSectionsTree = () => {
    if (sections === null) {
      return (
        <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
          <CircularProgress />
        </Box>
      );
    }

    if (sections.length === 0) {
      return (
        <Box sx={{ textAlign: 'center', p: 4, color: 'text.secondary' }}>
          <ListIcon sx={{ fontSize: 48, mb: 2, opacity: 0.5 }} />
          <Typography variant="body1">No sections found</Typography>
          <Typography variant="body2">Create your first section to get started.</Typography>
        </Box>
      );
    }

    return (
      <List sx={{ p: 0 }}>
        {sections.map((s, sectionIndex) => (
          <Box key={s.id}>
            {/* Section */}
            <ListItem
              disablePadding
              sx={{
                borderBottom: '1px solid var(--admin-border)'
              }}>
              <ListItemButton
                onClick={() => {
                  clearEdits();
                  setEditSection(s);
                }}
                sx={{
                  py: 1,
                  minHeight: 48,
                  '&:hover': {
                    backgroundColor: 'var(--c1l7)'
                  }
                }}>
                <ListItemIcon sx={{ minWidth: 32 }}>
                  <ListIcon sx={{ color: 'var(--c1d2)', fontSize: '1.25rem' }} />
                </ListItemIcon>
                <ListItemText
                  primary={
                    <Typography variant="subtitle2" sx={{ fontWeight: 600, fontSize: '0.95rem' }}>
                      {s.name}
                    </Typography>
                  }
                />
              </ListItemButton>
              <Box sx={{ pr: 1 }}>
                <IconButton
                  size="small"
                  onClick={(e) => {
                    e.stopPropagation();
                    createRole(s.id);
                  }}
                  sx={{
                    color: 'var(--c1d2)',
                    '&:hover': {
                      backgroundColor: 'rgba(21, 101, 192, 0.1)'
                    }
                  }}
                  title="Add Role">
                  <AddIcon fontSize="small" />
                </IconButton>
              </Box>
            </ListItem>
            
            {/* Roles */}
            {roles && getRolesList(s.id)}
          </Box>
        ))}
      </List>
    );
  };

  const getRolesList = (sectionId: string) => {
    const sectionRoles = ArrayHelper.getAll(roles, "sectionId", sectionId);
    
    return sectionRoles.map((r) => (
      <Box key={r.id} sx={{ ml: 4 }}>
        {/* Role */}
        <ListItem
          disablePadding
          sx={{
            borderBottom: '1px solid var(--admin-border-light)'
          }}>
          <ListItemButton
            onClick={() => {
              clearEdits();
              setEditRole(r);
            }}
            sx={{
              py: 0.75,
              minHeight: 40,
              '&:hover': {
                backgroundColor: 'var(--admin-bg-light)'
              }
            }}>
            <ListItemIcon sx={{ minWidth: 28 }}>
              <PersonIcon sx={{ color: 'var(--c1d1)', fontSize: '1.1rem' }} />
            </ListItemIcon>
            <ListItemText
              primary={
                <Typography variant="body2" sx={{ fontWeight: 500, color: 'var(--c1d1)', fontSize: '0.875rem' }}>
                  {r.name}
                </Typography>
              }
            />
          </ListItemButton>
          <Box sx={{ pr: 1 }}>
            <IconButton
              size="small"
              onClick={(e) => {
                e.stopPropagation();
                createAction(r.id);
              }}
              sx={{
                color: 'var(--c1d1)',
                '&:hover': {
                  backgroundColor: 'rgba(21, 101, 192, 0.1)'
                }
              }}
              title="Add Action">
              <AddIcon fontSize="small" />
            </IconButton>
          </Box>
        </ListItem>
        
        {/* Actions */}
        {actions && getActionsList(r.id)}
      </Box>
    ));
  };

  const getActionsList = (roleId: string) => {
    const roleActions = ArrayHelper.getAll(actions, "roleId", roleId);
    
    return roleActions.map((a) => (
      <ListItem
        key={a.id}
        disablePadding
        sx={{
          ml: 4,
          borderBottom: '1px solid var(--admin-border-light)'
        }}>
        <ListItemButton
          onClick={() => {
            clearEdits();
            setEditAction(a);
          }}
          sx={{
            py: 0.5,
            minHeight: 32,
            '&:hover': {
              backgroundColor: 'var(--admin-bg-lighter)'
            }
          }}>
          <ListItemIcon sx={{ minWidth: 24 }}>
            <CheckIcon sx={{ color: 'var(--c1)', fontSize: '0.875rem' }} />
          </ListItemIcon>
          <ListItemText
            primary={
              <Typography variant="caption" sx={{ color: 'var(--c1)', fontSize: '0.8rem', lineHeight: 1.2 }}>
                <strong>{a.actionType}:</strong> {a.content?.substring(0, 80)}{a.content?.length > 80 ? '...' : ''}
              </Typography>
            }
          />
        </ListItemButton>
      </ListItem>
    ));
  };


  const getSidebar = () => {
    const result: JSX.Element[] = [];
    if (editSection) {
      result.push(<SectionEdit section={editSection} updatedCallback={handleSectionUpdated} key="sectionEdit" />);
    } else if (editRole) {
      result.push(<RoleEdit role={editRole} updatedCallback={handleRoleUpdated} />);
    } else if (copySection) {
      result.push(<SectionCopy copySection={copySection} venueId={venue.id} updatedCallback={handleUpdated} />);
    } else if (editAction) {
      result.push(
        <ActionEdit
          action={editAction}
          updatedCallback={handleActionUpdated}
          lessonResources={lessonResources}
          studyResources={studyResources}
          programResources={programResources}
          lessonVideos={lessonVideos}
          studyVideos={studyVideos}
          programVideos={programVideos}
          allAssets={allAssets}
          key="actionEdit"
          addOns={addOns}
        />
      );
    }
    return result;
  };

  const handleAddMenuClick = (event: React.MouseEvent<HTMLElement>) => {
    setMenuAnchor(event.currentTarget);
  };

  const handleAddMenuClose = () => {
    setMenuAnchor(null);
  };

  return (
    <Wrapper>
      <Box sx={{ p: 0 }}>
        <PageHeader
          icon={<LocationIcon />}
          title={`${lesson?.name || 'Lesson'}: ${venue?.name || 'Venue'}`}
          subtitle="Manage sections, roles, and actions for this venue"
          actions={[
            <IconButton
              key="add-menu"
              onClick={handleAddMenuClick}
              sx={{
                color: 'white',
                border: '1px solid rgba(255,255,255,0.5)',
                '&:hover': {
                  borderColor: 'white',
                  backgroundColor: 'rgba(255,255,255,0.1)'
                }
              }}>
              <AddIcon />
            </IconButton>
          ]}
        />

        <Paper
          sx={{
            p: { xs: 2, md: 3 },
            borderRadius: "0 0 8px 8px",
            minHeight: "calc(100vh - 200px)"
          }}>
          {/* Edit Panel - appears at top when editing */}
          {getSidebar().length > 0 && (
            <Box sx={{ mb: 3 }}>
              {getSidebar()}
            </Box>
          )}
          
          {/* Sections List - Full Width */}
          <Paper
            sx={{
              borderRadius: 2,
              border: "1px solid var(--admin-border)",
              boxShadow: "var(--admin-shadow-sm)",
              overflow: "hidden"
            }}>
            <Box
              sx={{
                p: 2,
                borderBottom: "1px solid var(--admin-border)",
                backgroundColor: "var(--c1l7)",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between"
              }}>
              <Stack direction="row" alignItems="center" spacing={1}>
                <ListIcon sx={{ color: "var(--c1d2)", fontSize: "1.5rem" }} />
                <Typography
                  variant="h6"
                  sx={{
                    color: "var(--c1d2)",
                    fontWeight: 600,
                    lineHeight: 1,
                    fontSize: "1.25rem",
                    display: "flex",
                    alignItems: "center"
                  }}>
                  Lesson Structure
                </Typography>
              </Stack>
            </Box>
            
            <Box sx={{ maxHeight: '70vh', overflow: 'auto' }}>
              {getSectionsTree()}
            </Box>
          </Paper>
        </Paper>

        {/* Add Menu */}
        <Menu
          anchorEl={menuAnchor}
          open={Boolean(menuAnchor)}
          onClose={handleAddMenuClose}
          PaperProps={{
            sx: {
              mt: 1,
              borderRadius: 2,
              boxShadow: 'var(--admin-shadow-md)'
            }
          }}>
          <MenuItem
            onClick={() => {
              createSection();
              handleAddMenuClose();
            }}
            sx={{ py: 1.5 }}>
            <AddIcon sx={{ mr: 2, color: 'var(--c1d2)' }} />
            Create New Section
          </MenuItem>
          <MenuItem
            onClick={() => {
              duplicateSection();
              handleAddMenuClose();
            }}
            sx={{ py: 1.5 }}>
            <CopyIcon sx={{ mr: 2, color: 'var(--c1d2)' }} />
            Copy Existing Section
          </MenuItem>
        </Menu>
      </Box>
    </Wrapper>
  );
}
