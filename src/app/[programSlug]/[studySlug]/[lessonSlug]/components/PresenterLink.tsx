"use client";

import { useState } from "react";
import Icon from "@mui/material/Icon";
import { AnalyticsHelper, ApiHelper } from "@churchapps/apphelper";
import { Presenter } from "@/components/Presenter";
import { PlaylistFileInterface,
  PlaylistMessageInterface,
  PlaylistResponseInterface,
  VenueInterface } from "@/helpers/interfaces";

interface Props {
  selectedVenue: VenueInterface;
}

export function PresenterLink(props: Props) {
  const [presenterFiles, setPresenterFiles] = useState<PlaylistFileInterface[]>(null);

  const loadPresenterData = async () => {
    try {
      AnalyticsHelper.logEvent("Presenter", "Start", props.selectedVenue.name);
    } catch (error) {
      console.warn('Analytics logging failed:', error);
    }
    ApiHelper.get("/venues/playlist/" + props.selectedVenue.id + "?mode=web", "LessonsApi").then((data: PlaylistResponseInterface) => {
      const result: PlaylistFileInterface[] = [];
      data?.messages?.forEach((m: PlaylistMessageInterface) => {
        m.files?.forEach((f: PlaylistFileInterface) => {
          result.push(f);
        });
      });
      setPresenterFiles(result);
    });
  };

  return (
    <>
      <a
        href="#"
        onClick={e => {
          e.preventDefault();
          loadPresenterData();
        }}
        className="cta">
        <Icon style={{ float: "left", marginRight: 10 }}>play_circle</Icon>Start Lesson
      </a>
      {presenterFiles && (
        <Presenter
          files={presenterFiles}
          onClose={() => {
            setPresenterFiles(null);
          }}
        />
      )}
    </>
  );
}
