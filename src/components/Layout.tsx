import Head from "next/head";
import { Header } from "./Header";
import { Footer } from "./Footer";

type Props = {
  children: React.ReactNode;
  withoutNavbar?: boolean;
  withoutFooter?: boolean;
};

export function Layout({
  children,
  withoutNavbar = false,
  withoutFooter = false,
}: Props) {
  return (
    <div>
      <Head>
        <title>Lessons.church - Free Church Curriculum</title>
      </Head>
      {!withoutNavbar && <Header />}
      <main>{children}</main>
      {!withoutFooter && <Footer />}
    </div>
  );
}
