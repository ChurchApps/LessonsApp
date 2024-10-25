import { ApiHelper } from "@churchapps/apphelper/dist/helpers/ApiHelper";
import Error from "@/components/Error";
import React from "react";
import LessonClient from "./components/LessonClient";
import { MetaHelper } from "@/utils/MetaHelper";
import { Metadata } from "next";
import { unstable_cache } from "next/cache";
import { EnvironmentHelper } from "@/utils";

type PageParams = {programSlug:string, studySlug:string, lessonSlug:string }

const loadData = async (params:PageParams) => {
  try {
    EnvironmentHelper.init();
    const lessonData = await ApiHelper.getAnonymous("/lessons/public/slugAlt/" + params.programSlug + "/" + params.studySlug + "/" + params.lessonSlug, "LessonsApi");
    if (lessonData.venues.length === 0) return {errorMessage: "No venues for lesson."}
    else return { lessonData, errorMessage: "" }
  } catch (error: any) {
    console.log("inside catch: ", error)
    return {errorMessage: error.message}
  }
}

const loadSharedData = async (params:Promise<PageParams>) => {
  const {programSlug, studySlug, lessonSlug} = await params;
  const p = {programSlug, studySlug, lessonSlug};
  const result = unstable_cache(loadData, ["/[programSlug]/[studySlug]/[lessonSlug]", programSlug, studySlug, lessonSlug], {tags:["all"]});
  return result(p);
}

export async function generateMetadata({params}:{params:Promise<PageParams>}): Promise<Metadata> {
  const props = await loadSharedData(params);
  const selectedVenue = props.lessonData.venues[0];
  const title = selectedVenue?.programName + ": " + selectedVenue?.lessonName + " - Free Church Curriculum";
  if (!props.errorMessage) return MetaHelper.getMetaData(title, selectedVenue?.lessonDescription, selectedVenue?.lessonImage);
}

export default async function LessonsPage({params}: {params:Promise<PageParams>}) {
  const {lessonData, errorMessage} = await loadSharedData(params);
  if (errorMessage) return <Error message={errorMessage} />
  else return <LessonClient lessonData={lessonData} />
}
