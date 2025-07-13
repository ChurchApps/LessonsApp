"use client";

import { useParams, useSearchParams } from "next/navigation";
import React, { useEffect } from "react";
import { ApiHelper } from "@churchapps/apphelper/dist/helpers/ApiHelper";
import {
  ClassroomInterface,
  CustomizationInterface,
  FeedVenueInterface,
  ScheduleInterface
} from "@/helpers/interfaces";
import { VenueClient } from "./components/VenueClient";

type PageParams = { id: string };

export default function B1Venue() {
  const params = useParams<PageParams>();

  const searchParams = useSearchParams();
  const autoPrint = searchParams.get("autoPrint") === "1";
  const [data, setData] = React.useState<any>(null);

  const loadInternal = async () => {
    const venue: FeedVenueInterface = await ApiHelper.get("/venues/public/feed/" + params.id, "LessonsApi");
    return venue;
  };

  const loadExternal = async (externalProviderId: string, venueId: string) => {
    const venue = await ApiHelper.get("/externalProviders/" + externalProviderId + "/venue/" + venueId, "LessonsApi");
    return venue;
  };

  const loadData = async () => {
    let search = new URLSearchParams(process.browser ? window.location.search : "");
    const externalProviderId = search.get("externalProviderId");
    let venue: FeedVenueInterface = null;
    if (externalProviderId) venue = await loadExternal(externalProviderId, params.id.toString());
    else venue = await loadInternal();

    const classroomId = search.get("classroomId");
    const classroom: ClassroomInterface = await ApiHelper.get("/classrooms/" + classroomId, "LessonsApi");
    const customizations: CustomizationInterface[] = await ApiHelper.get(
      "/customizations/public/venue/" + params.id + "/" + classroom.churchId + "?classroomId=" + classroomId,
      "LessonsApi"
    );
    const schedules: ScheduleInterface[] = await ApiHelper.get(
      "/schedules/public/classroom/" + classroomId,
      "LessonsApi"
    );
    let currentSchedule: ScheduleInterface = null;
    let prevSchedule: ScheduleInterface = null;
    let nextSchedule: ScheduleInterface = null;

    let currentIndex = -1;
    for (let i = 0; i < schedules.length; i++) if (schedules[i].venueId === params.id) currentIndex = i;

    if (currentIndex > -1) {
      currentSchedule = schedules[currentIndex];
      if (currentIndex > 0) prevSchedule = schedules[currentIndex - 1];
      if (currentIndex < schedules.length - 1) nextSchedule = schedules[currentIndex + 1];
    }

    //return {classroom, customizations, currentSchedule, prevSchedule, nextSchedule, venue};
    setData({ classroom, customizations, currentSchedule, prevSchedule, nextSchedule, venue });
  };

  //const {classroom, customizations, currentSchedule, prevSchedule, nextSchedule, venue } = await loadData();
  useEffect(() => {
    loadData();
  }, []);

  return (
    <VenueClient
      venue={data?.venue}
      classroom={data?.classroom}
      customizations={data?.customizations}
      currentSchedule={data?.currentSchedule}
      prevSchedule={data?.prevSchedule}
      nextSchedule={data?.nextSchedule}
      autoPrint={autoPrint}
    />
  );
}
