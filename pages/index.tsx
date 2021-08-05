import Head from "next/head";
import { Layout } from "@components/index";

export default function Home() {
  return (
    <Layout>
      <Head>
        <title>Lessons.church - Free Church Curriculum</title>
      </Head>
      <h1>This is Home Page</h1>
    </Layout>
  );
}
