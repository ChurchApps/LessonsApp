import Head from "next/head";
import { Header } from "./Header";
import { Footer } from "./Footer";

type Props = {
  children: React.ReactNode;
  withoutNavbar?: boolean;
  withoutFooter?: boolean;
  pageTitle?: string;
  metaDescription?: string;
  ogDescription?: string;
  image?: string;
};



export function Layout(props: Props) {
  const getDescription = () => {
    if (props.metaDescription) return (<>
      <meta name="description" content={props.metaDescription}></meta>
      <meta property="og:description" content={props.ogDescription || props.metaDescription}></meta>
    </>);
  }

  const getImage = () => {
    if (props.image) return (<meta property="og:image" content={props.image}></meta>);
  }

  return (
    <div>
      <Head>
        <title>{props.pageTitle || "Lessons.church - Free Church Curriculum"}</title>
        {getDescription()}
        {getImage()}
      </Head>
      {!props.withoutNavbar && <Header />}
      <main>{props.children}</main>
      {!props.withoutFooter && <Footer />}
    </div>
  );
}
