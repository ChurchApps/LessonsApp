import { GetStaticProps } from "next";
import { HomeAbout, HomeConnect, Layout, Programs } from "@/components";
import { ApiHelper, ProgramInterface, ProviderInterface, StudyInterface } from "@/utils";
import { FloatingSupport } from "@churchapps/apphelper";
import Error from "./_error";
import { HomeTestimonials } from "@/components/home/HomeTestimonials";
import { HomeHero } from "@/components/home/HomeHero";

type Props = {
  programs: ProgramInterface[];
  providers: ProviderInterface[];
  studies: StudyInterface[];
  stats: any;
  hasError: Boolean;
  error: {
    message: string;
  };
};

export default function Home({ programs, providers, studies, stats, hasError, error }: Props) {

  if (hasError) {
    return <Error message={error.message} />
  }

  let description = "Church budgets prohibit teaching the word of God in the most effective way possible. We provide high quality content to churches completely free of charge, thanks to our generous partners."
  let ogDescription = "We provide high quality content to churches completely free of charge, thanks to our generous partners."
  let pageImage = "https://lessons.church/images/og-image.png";


  return (
    <Layout metaDescription={description} image={pageImage} ogDescription={ogDescription} withoutNavbar>
      <HomeHero stats={stats} />
      <HomeAbout />
      <Programs programs={programs} providers={providers} studies={studies} />
      <HomeTestimonials />
      <HomeConnect />

      <FloatingSupport appName="Lessons.church" />
    </Layout>
  );
}

export const getStaticProps: GetStaticProps = async () => {
  try {
    const programs: ProgramInterface[] = await ApiHelper.getAnonymous("/programs/public", "LessonsApi");
    const providers: ProviderInterface[] = await ApiHelper.getAnonymous("/providers/public", "LessonsApi");
    const studies: ProviderInterface[] = await ApiHelper.getAnonymous("/studies/public", "LessonsApi");
    const stats: any = await ApiHelper.getAnonymous("/providers/stats", "LessonsApi");
    return {
      props: { programs, providers, studies, stats, hasError: false },
      revalidate: 30,
    };
  } catch (error:any) {
    return {
      props: {
        hasError: true, error: {
          message: error.message
        }
      }
    }
  }
};
