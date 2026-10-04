import { Metadata } from "next";
import { unstable_cache } from "next/cache";
import { notFound } from "next/navigation";
import React from "react";
import { ApiHelper } from "@churchapps/apphelper";
import Error from "@/components/Error";
import { EnvironmentHelper } from "@/helpers";
import { MetaHelper } from "@/helpers/MetaHelper";
import LessonClient from "./components/LessonClient";

type PageParams = { programSlug: string; studySlug: string; lessonSlug: string };

const loadData = async (params: PageParams) => {
  try {
    EnvironmentHelper.init();
    const lessonData = await ApiHelper.getAnonymous("/lessons/public/slugAlt/" + params.programSlug + "/" + params.studySlug + "/" + params.lessonSlug, "LessonsApi");

    if (!lessonData?.venues) return { lessonData: null, errorMessage: "" };
    if (!lessonData.venues || lessonData.venues.length === 0) return { errorMessage: "No venues for lesson." };

    return { lessonData, errorMessage: "" };
  } catch (error: any) {
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

  const { programSlug, studySlug, lessonSlug } = await params;
  const selectedVenue = props.lessonData.venues[0];
  const title = selectedVenue?.programName + ": " + selectedVenue?.lessonName + " - Free Church Curriculum";
  return MetaHelper.getMetaData(title, selectedVenue?.lessonDescription, selectedVenue?.lessonImage, undefined, "/" + programSlug + "/" + studySlug + "/" + lessonSlug);
}

const getJsonLd = (venue: any, path: PageParams) => {
  const site = "https://lessons.church";
  const programUrl = site + "/" + path.programSlug;
  const studyUrl = programUrl + "/" + path.studySlug;
  const result: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "LearningResource",
    name: venue.lessonName,
    url: studyUrl + "/" + path.lessonSlug,
    isPartOf: {
      "@type": "Course",
      name: venue.studyName,
      url: studyUrl,
      isPartOf: { "@type": "Course", name: venue.programName, url: programUrl }
    },
    provider: { "@type": "Organization", name: "Lessons.church", sameAs: site }
  };
  if (venue.lessonDescription) result.description = venue.lessonDescription;
  if (venue.lessonImage?.startsWith("http")) result.image = venue.lessonImage;
  return result;
};

export default async function LessonsPage({ params }: { params: Promise<PageParams> }) {
  const { lessonData, errorMessage } = await loadSharedData(params);
  if (!errorMessage && !lessonData) notFound();
  if (errorMessage) return <Error message={errorMessage} />;
  const { programSlug, studySlug, lessonSlug } = await params;
  return (
    <>
      <LessonClient lessonData={lessonData} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(getJsonLd(lessonData.venues[0], { programSlug, studySlug, lessonSlug })).replace(/</g, "\\u003c") }} />
    </>
  );
}
