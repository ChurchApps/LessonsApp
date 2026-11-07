import { SITE_URL, SeoHelper } from "./SeoHelper";

export const DEFAULT_DESCRIPTION = "Free church curriculum for preschool, elementary, youth and adults: 1,100+ video lessons with leader guides and downloads. No subscription, ever.";

export class MetaHelper {
  static getMetaData = (title?: string, description?: string, ogImage?: string, ogDescription?: string, path?: string) => {
    title = title ? SeoHelper.cleanName(title).replace(/ :/g, ":") : "Lessons.church - Free Church Curriculum";
    if (!description) description = DEFAULT_DESCRIPTION;

    if (!ogImage) ogImage = "https://lessons.church/images/og-image.png";
    if (!ogDescription) ogDescription = description;
    const url = SITE_URL + (path || "");

    return {
      title,
      description,
      keywords: "church curriculum, free curriculum, Sunday school, Bible lessons, Christian education",
      openGraph: {
        title,
        description: ogDescription,
        url,
        images: [ogImage],
        type: "website",
        siteName: "Lessons.church",
        locale: "en_US"
      },
      twitter: {
        card: "summary_large_image",
        title,
        description: ogDescription,
        images: [ogImage]
      },
      alternates: { canonical: url }
    };
  };
}
