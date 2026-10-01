import { ApiHelper } from "@churchapps/apphelper";
import { EnvironmentHelper } from "@/helpers";
import { LessonInterface, ProgramInterface, StudyInterface } from "@/helpers/interfaces";

// Programs, studies and lessons come from the database, so next-sitemap's build-time crawl never sees them.
export const revalidate = 3600;

const SITE = "https://lessons.church";

const escapeXml = (value: string) => value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&apos;");

export async function GET() {
  EnvironmentHelper.init();
  const paths: string[] = [];
  const programs: ProgramInterface[] = await ApiHelper.getAnonymous("/programs/public", "LessonsApi");
  const studies: StudyInterface[] = await ApiHelper.getAnonymous("/studies/public", "LessonsApi");
  const studyIds = studies.map((s) => s.id).filter(Boolean);
  const lessons: LessonInterface[] = studyIds.length > 0 ? await ApiHelper.getAnonymous("/lessons/public/studies?ids=" + studyIds.join(","), "LessonsApi") : [];

  programs.filter((p) => p.slug).forEach((program) => {
    const programPath = "/" + program.slug;
    paths.push(programPath);
    studies.filter((s) => s.programId === program.id && s.slug).forEach((study) => {
      const studyPath = programPath + "/" + study.slug;
      paths.push(studyPath);
      lessons.filter((l) => l.studyId === study.id && l.slug).forEach((lesson) => paths.push(studyPath + "/" + lesson.slug));
    });
  });

  const body = "<?xml version=\"1.0\" encoding=\"UTF-8\"?>\n"
    + "<urlset xmlns=\"http://www.sitemaps.org/schemas/sitemap/0.9\">\n"
    + paths.map((p) => "  <url><loc>" + escapeXml(SITE + p) + "</loc></url>").join("\n")
    + "\n</urlset>";
  return new Response(body, { headers: { "Content-Type": "application/xml" } });
}
