"use client";

import Head from "next/head";
import { Container, CssBaseline } from "@mui/material";
import { Footer } from "./Footer";
import { Header } from "./Header";

interface Props {
  children: React.ReactNode;
  withoutNavbar?: boolean;
  withoutFooter?: boolean;
  pageTitle?: string;
  metaDescription?: string;
  ogDescription?: string;
  image?: string;
}

export function Layout(props: Props) {
  const getDescription = () => {
    if (props.metaDescription) {
      return (
        <>
          <meta name="description" content={props.metaDescription}></meta>
          <meta property="og:description" content={props.ogDescription || props.metaDescription}></meta>
        </>
      );
    }
  };

  const getImage = () => {
    if (props.image) return <meta property="og:image" content={props.image}></meta>;
  };

  return (
    <>
      <CssBaseline />
      <div>
        <Head>
          <title>{props.pageTitle || "Lessons.church - Free Church Curriculum"}</title>
          {getDescription()}
          {getImage()}
        </Head>
        {!props.withoutNavbar && (
          <div id="studyHero" style={{ minHeight: 80 }}>
            <div className="content">
              <Container fixed>
                <Header position="static" />
              </Container>
            </div>
          </div>
        )}
        <main>{props.children}</main>
        {!props.withoutFooter && <Footer />}
      </div>
    </>
  );
}
