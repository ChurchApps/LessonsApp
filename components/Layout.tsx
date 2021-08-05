import Head from "next/head";
import { Header } from "./Header";

type Props = {
  children: React.ReactNode;
};

export function Layout({ children }: Props) {
  return (
    <div>
      <Head>
        <link rel="icon" href="/favicon.ico" />
        <link
          href="https://fonts.googleapis.com/css?family=Roboto"
          rel="stylesheet"
        />
      </Head>
      <Header />
      <main>{children}</main>
    </div>
  );
}
