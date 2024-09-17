import React from "react";
import { ClassroomInterface, CustomizationInterface, FeedVenueInterface, ScheduleInterface } from "@/utils/interfaces";
import { ApiHelper } from "@churchapps/apphelper/dist/helpers/ApiHelper";
import { VenueClient } from "./components/VenueClient";

export default async function B1Venue({params}: { params:{id:string }}) {
  /*
  const [venue, setVenue] = useState<FeedVenueInterface>(null);
  const [classroom, setClassroom] = useState<ClassroomInterface>(null);
  const [customizations, setCustomizations] = useState<CustomizationInterface[]>([]);
  const [currentSchedule, setCurrentSchedule] = useState<ScheduleInterface>(null);
  const [prevSchedule, setPrevSchedule] = useState<ScheduleInterface>(null);
  const [nextSchedule, setNextSchedule] = useState<ScheduleInterface>(null);

  const [selectedTab, setSelectedTab] = useState<string>("");
  const router = useRouter();
  const id = router.query.id;*/
  //const autoPrint = router.query.autoPrint;


  const loadInternal = async () => {
    const venue: FeedVenueInterface = await ApiHelper.get("/venues/public/feed/" + params.id, "LessonsApi");
    return venue;
  }

  const loadExternal = async (externalProviderId:string, venueId:string) => {
    const venue = await ApiHelper.get("/externalProviders/" + externalProviderId + "/venue/" + venueId, "LessonsApi")
    return venue;
  }

  const loadData = async () => {

    let search = new URLSearchParams(process.browser ? window.location.search : "");
    const externalProviderId = search.get("externalProviderId");
    let venue: FeedVenueInterface = null;
    if (externalProviderId) venue = await loadExternal(externalProviderId, params.id.toString())
    else venue = await loadInternal();

    const classroomId = search.get("classroomId");
    const classroom:ClassroomInterface = await ApiHelper.get("/classrooms/" + classroomId, "LessonsApi");
    const customizations:CustomizationInterface[] = await ApiHelper.get("/customizations/public/venue/" + params.id + "/" + classroom.churchId, "LessonsApi");
    const schedules:ScheduleInterface[] = await ApiHelper.get("/schedules/public/classroom/" + classroomId, "LessonsApi");
    let currentSchedule: ScheduleInterface = null;
    let prevSchedule: ScheduleInterface = null;
    let nextSchedule: ScheduleInterface = null;

    let currentIndex = -1;
    for (let i = 0; i < schedules.length; i++) {
      if (schedules[i].venueId === params.id) currentIndex = i;
    }
    if (currentIndex > -1) {
      currentSchedule = schedules[currentIndex]
      if (currentIndex > 0) prevSchedule = schedules[currentIndex - 1];
      if (currentIndex < schedules.length - 1) nextSchedule = schedules[currentIndex + 1];
    }

    return {classroom, customizations, currentSchedule, prevSchedule, nextSchedule, venue};
  }

  const {classroom, customizations, currentSchedule, prevSchedule, nextSchedule, venue } = await loadData();

  return <VenueClient venue={venue} classroom={classroom} customizations={customizations} currentSchedule={currentSchedule} prevSchedule={prevSchedule} nextSchedule={nextSchedule} />;
}
