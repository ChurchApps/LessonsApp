export class MetaHelper {
  static getMetaData = (title?:string, description?:string, ogImage?:string, ogDescription?:string) => {
    if (!title) title = "Lessons.church - Free Church Curriculum";
    if (!description) description = "Church budgets prohibit teaching the word of God in the most effective way possible. We provide high quality content to churches completely free of charge, thanks to our generous partners.";
    if (!ogImage) ogImage = "https://lessons.church/images/og-image.png";
    if (!ogDescription) ogDescription = description;

    return {
      title,
      description,
      openGraph: {
        title,
        description:  ogDescription,
        images: [ogImage],
      },
    };
  }
}
