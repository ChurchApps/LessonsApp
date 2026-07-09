import { Metadata } from "next";
import { comparisons } from "./comparisons";
import { CompareClient } from "./CompareClient";

type PageParams = { competitor: string };

export async function generateMetadata({ params }: { params: Promise<PageParams> }): Promise<Metadata> {
  const { competitor } = await params;
  const data = comparisons[competitor];
  if (!data) return { title: "Curriculum Comparisons - Lessons.church", description: "See how Lessons.church compares to paid curriculum providers." };
  return {
    title: `Lessons.church vs ${data.competitor} - Free Church Curriculum Comparison`,
    description: data.description,
    alternates: { canonical: `https://lessons.church/compare/${competitor}` }
  };
}

export default async function ComparePage({ params }: { params: Promise<PageParams> }) {
  const { competitor } = await params;
  const data = comparisons[competitor];
  const schema = data && {
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
      {schema && <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />}
      <CompareClient competitor={competitor} />
    </>
  );
}
