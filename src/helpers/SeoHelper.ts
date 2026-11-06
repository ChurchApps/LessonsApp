// Builds plain-text meta descriptions and schema.org JSON-LD for program, study and lesson pages.
export const SITE_URL = "https://lessons.church";
export const ORGANIZATION_ID = SITE_URL + "/#organization";
export const WEBSITE_ID = SITE_URL + "/#website";

const MAX_DESCRIPTION = 160;

export interface Crumb { name: string; url: string; }
export interface Publisher { name: string; url?: string; }

export class SeoHelper {
  // Strips Markdown and HTML so database text is safe to use as plain-text metadata.
  static plainText(value?: string | null): string {
    if (!value) return "";
    return value
      .replace(/<[^>]*>/g, " ")
      .replace(/!\[[^\]]*\]\([^)]*\)/g, " ")
      .replace(/\[([^\]]*)\]\([^)]*\)/g, "$1")
      .replace(/[*_`#>]+/g, "")
      .replace(/[●➢•]/g, " ")
      .replace(/\s+/g, " ")
      .trim();
  }

  static cleanName(value?: string | null): string {
    return (value || "").replace(/\s+/g, " ").trim();
  }

  // Cuts at a word boundary so search snippets don't end mid-word.
  static truncate(value: string, max = MAX_DESCRIPTION): string {
    if (value.length <= max) return value;
    const cut = value.slice(0, max - 1);
    const lastSpace = cut.lastIndexOf(" ");
    return (lastSpace > max * 0.6 ? cut.slice(0, lastSpace) : cut).replace(/[\s,;:.-]+$/, "") + "…";
  }

  static description(value?: string | null, fallback?: string): string {
    const text = SeoHelper.plainText(value);
    if (text.length >= 50) return SeoHelper.truncate(text);
    // A short database blurb like "Free youth ministry curriculum" needs its own full stop before the fallback.
    const lead = text && !/[.!?…]$/.test(text) ? text + "." : text;
    return SeoHelper.truncate([lead, fallback].filter(Boolean).join(" ").trim());
  }

  // The page's own name leads the title: searchers type "penitential psalms", not "NextLevel Online".
  static lessonTitle(programName?: string | null, lessonName?: string | null): string {
    return SeoHelper.cleanName(lessonName) + " | Free " + SeoHelper.cleanName(programName) + " Lesson";
  }

  static studyTitle(programName?: string | null, studyName?: string | null): string {
    return SeoHelper.cleanName(studyName) + " | Free " + SeoHelper.cleanName(programName) + " Curriculum";
  }

  static programDescription(name: string, age?: string, description?: string) {
    const audience = age ? age.toLowerCase() + " " : "";
    return SeoHelper.description(description, `${name} is free ${audience}church curriculum with videos, lesson guides and downloads on Lessons.church.`);
  }

  static studyDescription(programName: string, studyName: string, lessonCount?: number, description?: string) {
    const count = lessonCount ? `${lessonCount} free lesson${lessonCount === 1 ? "" : "s"}` : "Free lessons";
    return SeoHelper.description(description, `${studyName} from ${programName}: ${count} with videos, teaching guides and downloads for your church.`);
  }

  static lessonDescription(venue: { lessonName?: string; lessonDescription?: string; bottomLine?: string; verse?: string; studyName?: string; programName?: string }) {
    const verse = SeoHelper.plainText(venue.verse).split(" - ")[0];
    const parts = [
      `${SeoHelper.cleanName(venue.lessonName)} is a free ${SeoHelper.cleanName(venue.programName)} lesson from the ${SeoHelper.cleanName(venue.studyName)} study, ready to teach at your church.`,
      venue.bottomLine ? `Bottom line: ${SeoHelper.plainText(venue.bottomLine)}.` : "",
      verse ? `Scripture: ${verse}.` : ""
    ];
    return SeoHelper.description(venue.lessonDescription, parts.filter(Boolean).join(" "));
  }

  // Program "about" text looks like: "This content is provided free of charge by [The Ark Church.](https://...)"
  static publisherFromAbout(about?: string | null): Publisher | undefined {
    if (!about) return undefined;
    const link = about.match(/\[([^\]]+)\]\((https?:[^)\s]+)\)/);
    if (link) return { name: link[1].replace(/[.\s]+$/, "").trim(), url: link[2] };
    const plain = SeoHelper.plainText(about).match(/provided (?:free of charge )?by (.+?)\.?$/i);
    return plain ? { name: plain[1].trim() } : undefined;
  }

  static organizationRef() {
    return { "@type": "Organization", "@id": ORGANIZATION_ID, name: "Lessons.church", url: SITE_URL + "/" };
  }

  static breadcrumbs(crumbs: Crumb[]) {
    return {
      "@type": "BreadcrumbList",
      itemListElement: [{ name: "Home", url: SITE_URL + "/" }, ...crumbs].map((c, i) => ({ "@type": "ListItem", position: i + 1, name: c.name, item: c.url }))
    };
  }

  static common(publisher?: Publisher, age?: string) {
    const result: Record<string, unknown> = {
      inLanguage: "en",
      isAccessibleForFree: true,
      provider: SeoHelper.organizationRef(),
      publisher: publisher ? { "@type": "Organization", name: publisher.name, ...(publisher.url ? { url: publisher.url } : {}) } : SeoHelper.organizationRef()
    };
    if (age) {
      result.educationalLevel = age;
      result.audience = { "@type": "EducationalAudience", educationalRole: "teacher", audienceType: age + " ministry leaders and volunteers" };
    }
    return result;
  }

  static jsonLd(data: unknown) {
    return JSON.stringify(data).replace(/</g, "\\u003c");
  }
}
