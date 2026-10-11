import { Metadata } from "next";
import { notFound } from "next/navigation";
import { MetaHelper } from "@/helpers/MetaHelper";
import { comparisons } from "./comparisons";
import { CompareClient } from "./CompareClient";

type PageParams = { competitor: string };

export async function generateMetadata({ params }: { params: Promise<PageParams> }): Promise<Metadata> {
  const { competitor } = await params;
  const data = comparisons[competitor];
  if (!data) return MetaHelper.getMetaData();
  return MetaHelper.getMetaData(`Lessons.church vs ${data.competitor} - Free Church Curriculum Comparison`, data.description, undefined, undefined, `/compare/${competitor}`);
}

export default async function ComparePage({ params }: { params: Promise<PageParams> }) {
  const { competitor } = await params;
  const data = comparisons[competitor];
  if (!data) notFound();
  const schema = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "name": `Lessons.church vs ${data.competitor} Comparison`,
    "description": data.description,
    "mainEntity": {
      "@type": "ItemList",
      "itemListElement": [
        { "@type": "SoftwareApplication", "name": "Lessons.church", "applicationCategory": "EducationalApplication", "offers": { "@type": "Offer", "price": "0", "priceCurrency": "USD" } },
        { "@type": "SoftwareApplication", "name": data.competitor, "applicationCategory": "EducationalApplication" }
      ]
    }
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      <CompareClient competitor={competitor} />
    </>
  );
}
