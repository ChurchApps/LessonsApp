import Link from "next/link";
import { useEffect, useState } from "react";
import { Box, Button, CircularProgress, IconButton, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Paper, Stack, Typography } from "@mui/material";
import { LocationOn as LocationIcon, Add as AddIcon, Edit as EditIcon } from "@mui/icons-material";
import { ApiHelper, VenueInterface } from "@/helpers";
import { VenueEdit } from "../index";

interface Props {
  lessonId: string;
}

export function VenueList(props: Props) {
  const [venues, setVenues] = useState<VenueInterface[]>(null);
  const [editVenue, setEditVenue] = useState<VenueInterface>(null);

  const loadData = () => {
    if (props.lessonId) {
      ApiHelper.get("/venues/lesson/" + props.lessonId, "LessonsApi").then((data: any) => {
        setVenues(data);
      });
    }
  };

  const getVenuesList = () => {
    if (venues === null) {
      return (
        <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
          <CircularProgress />
        </Box>
      );
    }

    if (venues.length === 0) {
      return (
        <Box sx={{ textAlign: 'center', p: 4, color: 'text.secondary' }}>
          <LocationIcon sx={{ fontSize: 48, mb: 2, opacity: 0.5 }} />
          <Typography variant="body1">No venues found</Typography>
          <Typography variant="body2">Click the "Add Venue" button to create your first venue.</Typography>
        </Box>
      );
    }

    return (
      <List sx={{ p: 0 }}>
        {venues.map((v, index) => (
          <ListItem
            key={v.id}
            disablePadding
            sx={{
              borderBottom: index < venues.length - 1 ? '1px solid var(--admin-border)' : 'none'
            }}>
            <ListItemButton
              component={Link}
              href={`/admin/venue/${v.id}`}
              sx={{
                py: 2,
                '&:hover': {
                  backgroundColor: 'var(--c1l7)'
                }
              }}>
              <ListItemIcon>
                <LocationIcon sx={{ color: 'var(--c1d2)' }} />
              </ListItemIcon>
              <ListItemText
                primary={
                  <Typography variant="subtitle1" sx={{ fontWeight: 500 }}>
                    {v.name}
                  </Typography>
                }
              />
            </ListItemButton>
            <Box sx={{ pr: 2 }}>
              <IconButton
                size="small"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setEditVenue(v);
                }}
                sx={{ color: 'var(--c1d2)' }}
                title="Edit Venue">
                <EditIcon fontSize="small" />
              </IconButton>
            </Box>
          </ListItem>
        ))}
      </List>
    );
  };


  const handleAddNew = () => {
    setEditVenue({ lessonId: props.lessonId });
  };

  useEffect(loadData, [props.lessonId]);

  if (editVenue) {
    return (
      <VenueEdit
        venue={editVenue}
        updatedCallback={() => {
          setEditVenue(null);
          loadData();
        }}
      />
    );
  } else {
    return (
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
            backgroundColor: 'var(--c1l7)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}>
          <Stack direction="row" alignItems="center" spacing={1}>
            <LocationIcon sx={{ color: 'var(--c1d2)', fontSize: '1.5rem' }} />
            <Typography variant="h6" sx={{
              color: 'var(--c1d2)',
              fontWeight: 600,
              lineHeight: 1,
              fontSize: '1.25rem',
              display: 'flex',
              alignItems: 'center'
            }}>
              Venues
            </Typography>
          </Stack>
          <Button
            variant="outlined"
            size="small"
            startIcon={<AddIcon />}
            onClick={handleAddNew}
            sx={{
              color: 'var(--c1d2)',
              borderColor: 'var(--c1d2)',
              '&:hover': {
                borderColor: 'var(--c1d1)',
                backgroundColor: 'rgba(21, 101, 192, 0.1)'
              }
            }}>
            Add Venue
          </Button>
        </Box>
        <Box>
          {getVenuesList()}
        </Box>
      </Paper>
    );
  }
}
