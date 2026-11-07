import { Metadata } from "next";
import { unstable_cache } from "next/cache";
import { notFound, permanentRedirect } from "next/navigation";
import React from "react";
import { ApiHelper } from "@churchapps/apphelper";
import { EnvironmentHelper } from "@/helpers";
import { MetaHelper } from "@/helpers/MetaHelper";
import { SITE_URL, SeoHelper } from "@/helpers/SeoHelper";
import LessonClient from "./components/LessonClient";

type PageParams = { programSlug: string; studySlug: string; lessonSlug: string };

// Render each lesson on first request, then serve it from the cache and refresh hourly.
export const revalidate = 3600;
export async function generateStaticParams(): Promise<PageParams[]> { return []; }

// Lesson slugs are always lowercase, and the API matches slugs case-insensitively.
const getCanonicalPath = (venue: any, lessonSlug: string) => "/" + venue.programSlug + "/" + venue.studySlug + "/" + lessonSlug.toLowerCase();

// A lesson with no venues has nothing to show, so it 404s like a missing one.
const loadData = async (params: PageParams): Promise<{ lessonData?: any; errorMessage: string }> => {
  EnvironmentHelper.init();
  const lessonData = await ApiHelper.getAnonymous("/lessons/public/slugAlt/" + params.programSlug + "/" + params.studySlug + "/" + params.lessonSlug, "LessonsApi");
  return { lessonData: lessonData?.venues?.length ? lessonData : null, errorMessage: "" };
};

// loadData throws on failure so a failed load is never cached.
const loadSharedData = async (params: Promise<PageParams>): Promise<{ lessonData?: any; errorMessage: string }> => {
  const { programSlug, studySlug, lessonSlug } = await params;
  try {
    return await unstable_cache(loadData, ["/[programSlug]/[studySlug]/[lessonSlug]", programSlug, studySlug, lessonSlug], { tags: ["all"], revalidate: 3600 })({ programSlug, studySlug, lessonSlug });
  } catch (error: any) {
    return { errorMessage: error.message || "Failed to load lesson data." };
  }
};

export async function generateMetadata({ params }: { params: Promise<PageParams> }): Promise<Metadata> {
  const props = await loadSharedData(params);

  if (props.errorMessage || !props.lessonData || !props.lessonData.venues || props.lessonData.venues.length === 0) return MetaHelper.getMetaData("Lesson Not Found - Lessons.church", "The requested lesson could not be found.");

  const { lessonSlug } = await params;
  const selectedVenue = props.lessonData.venues[0];
  const title = SeoHelper.lessonTitle(selectedVenue?.programName, selectedVenue?.lessonName);
  return MetaHelper.getMetaData(title, SeoHelper.lessonDescription(selectedVenue), selectedVenue?.lessonImage, undefined, getCanonicalPath(selectedVenue, lessonSlug));
}

const getJsonLd = (venue: any, lessonSlug: string) => {
  const programUrl = SITE_URL + "/" + venue.programSlug;
  const studyUrl = programUrl + "/" + venue.studySlug;
  const url = SITE_URL + getCanonicalPath(venue, lessonSlug);
  const programName = SeoHelper.cleanName(venue.programName);
  const studyName = SeoHelper.cleanName(venue.studyName);
  const name = SeoHelper.cleanName(venue.lessonName);
  const lesson: Record<string, unknown> = {
    "@type": "LearningResource",
    "@id": url + "#lesson",
    name,
    url,
    description: SeoHelper.lessonDescription(venue),
    learningResourceType: "Lesson plan",
    ...SeoHelper.common(SeoHelper.publisherFromAbout(venue.programAbout)),
    isPartOf: {
      "@type": "Course",
      "@id": studyUrl + "#course",
      name: studyName,
      url: studyUrl,
      isPartOf: { "@type": "Course", "@id": programUrl + "#course", name: programName, url: programUrl }
    }
  };
  if (venue.bottomLine) lesson.teaches = SeoHelper.plainText(venue.bottomLine);
  if (venue.lessonImage?.startsWith("http")) lesson.image = venue.lessonImage;
  return {
    "@context": "https://schema.org",
    "@graph": [lesson, SeoHelper.breadcrumbs([{ name: programName, url: programUrl }, { name: studyName, url: studyUrl }, { name, url }])]
  };
};

export default async function LessonsPage({ params }: { params: Promise<PageParams> }) {
  const { lessonData, errorMessage } = await loadSharedData(params);
  // Throw rather than render an error page, so a failed API call is never cached as a 200.
  if (errorMessage) throw new Error(errorMessage);
  if (!lessonData) notFound();
  const { programSlug, studySlug, lessonSlug } = await params;
  const venue = lessonData.venues[0];
  const canonicalPath = getCanonicalPath(venue, lessonSlug);
  if (venue.programSlug && venue.studySlug && canonicalPath !== "/" + programSlug + "/" + studySlug + "/" + lessonSlug) permanentRedirect(canonicalPath);
  return (
    <>
      <LessonClient lessonData={lessonData} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: SeoHelper.jsonLd(getJsonLd(venue, lessonSlug)) }} />
    </>
  );
}
