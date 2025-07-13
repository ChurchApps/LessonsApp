"use client";

import { useState } from "react";
import Icon from "@mui/material/Icon";
import { AnalyticsHelper } from "@churchapps/apphelper/dist/helpers/AnalyticsHelper";
import { ApiHelper } from "@churchapps/apphelper/dist/helpers/ApiHelper";
import { Presenter } from "@/components/Presenter";
import {
  PlaylistFileInterface,
  PlaylistMessageInterface,
  PlaylistResponseInterface,
  VenueInterface
} from "@/helpers/interfaces";

interface Props {
  selectedVenue: VenueInterface;
}

export function PresenterLink(props: Props) {
  const [presenterFiles, setPresenterFiles] = useState<PlaylistFileInterface[]>(null);

  const loadPresenterData = async () => {
    AnalyticsHelper.logEvent("Presenter", "Start", props.selectedVenue.name);
    ApiHelper.get("/venues/playlist/" + props.selectedVenue.id + "?mode=web", "LessonsApi").then(
      (data: PlaylistResponseInterface) => {
        const result: PlaylistFileInterface[] = [];
        data?.messages?.forEach((m: PlaylistMessageInterface) => {
          m.files?.forEach((f: PlaylistFileInterface) => {
            result.push(f);
          });
        });
        setPresenterFiles(result);
      }
    );
  };

  return (
    <>
      <a
        href="about:blank"
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
