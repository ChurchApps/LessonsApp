import { ApiHelper } from "@churchapps/apphelper/dist/helpers/ApiHelper";
import Error from "@/pages/_error";
import React from "react";
import LessonClient from "./components/LessonClient";
import { EnvironmentHelper } from "@/utils/EnvironmentHelper";
import { MetaHelper } from "@/utils/MetaHelper";
import { Metadata } from "next";

type PageParams = {programSlug:string, studySlug:string, lessonSlug:string }

const loadData = async (params:PageParams) => {
  EnvironmentHelper.init();
  try {
    const lessonData = await ApiHelper.getAnonymous("/lessons/public/slugAlt/" + params.programSlug + "/" + params.studySlug + "/" + params.lessonSlug, "LessonsApi");
    if (lessonData.venues.length === 0) return {errorMessage: "No venues for lesson."}
    else return { lessonData, errorMessage: "" }
  } catch (error: any) {
    console.log("inside catch: ", error)
    return {errorMessage: error.message}
  }
}

let loadDataPromise:ReturnType<typeof loadData>;

const loadSharedData = async (params:PageParams) => {
  if (!loadDataPromise) loadDataPromise = loadData(params);
  return loadDataPromise;
}

export async function generateMetadata({params}:{params:PageParams}): Promise<Metadata> {
  const props = await loadSharedData(params);
  const selectedVenue = props.lessonData.venues[0];
  const title = selectedVenue?.programName + ": " + selectedVenue?.lessonName + " - Free Church Curriculum";
  return MetaHelper.getMetaData(title, selectedVenue?.lessonDescription, selectedVenue?.lessonImage);
}

export default async function LessonsPage({params}: {params:{programSlug:string, studySlug:string, lessonSlug:string}}) {
  const {lessonData, errorMessage} = await loadSharedData(params);
  if (errorMessage) return <Error message={errorMessage} />
  else return <LessonClient lessonData={lessonData} />
}
