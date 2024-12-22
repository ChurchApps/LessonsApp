import React from "react";
import { Layout } from "@/components/Layout";
import { ApiHelper } from "@churchapps/apphelper/dist/helpers/ApiHelper";
import Link from "next/link";
import { Container } from "@mui/material";
import { Metadata } from "next";
import { MetaHelper } from "@/helpers/MetaHelper";

type PageParams = {churchId:string }

export async function generateMetadata(): Promise<Metadata> {
  return MetaHelper.getMetaData();
}

export default async function Venue({params}: { params:Promise<PageParams> }) {
  const { churchId } = await params;
  const classrooms = await ApiHelper.get("/classrooms/public/church/" + churchId, "LessonsApi");

  const getRows = () => {
    const result: JSX.Element[] = [];
    classrooms?.forEach((c:any) => {
      let url = "/b1/classroom/" + c.id;
      result.push(<Link href={url} className="bigLink">{c.name}</Link>)
    })
    return result;
  }

  if (classrooms?.length === 1) window.location.href = "/b1/classroom/" + classrooms[0].id;
  else {
    return (
      <Layout withoutNavbar={true} withoutFooter={true}>
        <Container fixed>
          <h1>Select a Room</h1>
        </Container>
        {getRows()}
        <br />
      </Layout>
    );
  }
}
