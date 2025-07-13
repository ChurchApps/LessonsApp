import { Metadata } from "next";
import { unstable_cache } from "next/cache";
import React from "react";
import { ApiHelper } from "@churchapps/apphelper/dist/helpers/ApiHelper";
import Error from "@/components/Error";
import { EnvironmentHelper } from "@/helpers";
import { MetaHelper } from "@/helpers/MetaHelper";
import LessonClient from "./components/LessonClient";

type PageParams = { programSlug: string; studySlug: string; lessonSlug: string };

const loadData = async (params: PageParams) => {
  try {
    EnvironmentHelper.init();
    const lessonData = await ApiHelper.getAnonymous("/lessons/public/slugAlt/" + params.programSlug + "/" + params.studySlug + "/" + params.lessonSlug, "LessonsApi");

    if (!lessonData) return { errorMessage: "Lesson not found." };
    if (!lessonData.venues || lessonData.venues.length === 0) return { errorMessage: "No venues for lesson." };

    return { lessonData, errorMessage: "" };
  } catch (error: any) {
    console.log("inside catch: ", error);
    return { errorMessage: error.message || "Failed to load lesson data." };
  }
};

const loadSharedData = async (params: Promise<PageParams>) => {
  const { programSlug, studySlug, lessonSlug } = await params;
  const p = { programSlug, studySlug, lessonSlug };
  const result = unstable_cache(loadData, ["/[programSlug]/[studySlug]/[lessonSlug]", programSlug, studySlug, lessonSlug], { tags: ["all"] });
  return result(p);
};

export async function generateMetadata({ params }: { params: Promise<PageParams> }): Promise<Metadata> {
  const props = await loadSharedData(params);

  if (props.errorMessage || !props.lessonData || !props.lessonData.venues || props.lessonData.venues.length === 0) return MetaHelper.getMetaData("Lesson Not Found - Lessons.church", "The requested lesson could not be found.");

  const selectedVenue = props.lessonData.venues[0];
  const title = selectedVenue?.programName + ": " + selectedVenue?.lessonName + " - Free Church Curriculum";
  return MetaHelper.getMetaData(title, selectedVenue?.lessonDescription, selectedVenue?.lessonImage);
}

export default async function LessonsPage({ params }: { params: Promise<PageParams> }) {
  const { lessonData, errorMessage } = await loadSharedData(params);
  if (errorMessage) return <Error message={errorMessage} />;
  else return <LessonClient lessonData={lessonData} />;
}
