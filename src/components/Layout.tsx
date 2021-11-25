import Head from "next/head";
import { Header } from "./Header";
import { Footer } from "./Footer";

type Props = {
  children: React.ReactNode;
  withoutNavbar?: boolean;
  withoutFooter?: boolean;
  pageTitle?: string;
  metaDescription?: string;
};



export function Layout(props: Props) {
  const getDescription = () => {
    if (props.metaDescription) return (<meta name="description" content={props.metaDescription}></meta>);
  }

  return (
    <div>
      <Head>
        <title>{props.pageTitle || "Lessons.church - Free Church Curriculum"}</title>
        {getDescription()}
      </Head>
      {!props.withoutNavbar && <Header />}
      <main>{props.children}</main>
      {!props.withoutFooter && <Footer />}
    </div>
  );
}
