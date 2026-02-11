import { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import React from "react";
import { Container } from "@mui/material";
import { ApiHelper } from "@churchapps/apphelper";
import { Layout } from "@/components/Layout";
import { MetaHelper } from "@/helpers/MetaHelper";

type PageParams = { churchId: string };

export async function generateMetadata(): Promise<Metadata> {
  return MetaHelper.getMetaData();
}

export default async function Venue({ params }: { params: Promise<PageParams> }) {
  const { churchId } = await params;
  const classrooms = await ApiHelper.get("/classrooms/public/church/" + churchId, "LessonsApi");

  const getRows = () => {
    const result: React.JSX.Element[] = [];
    classrooms?.forEach((c: any) => {
      const url = "/b1/classroom/" + c.id;
      result.push(<Link href={url} className="bigLink">
        {c.name}
      </Link>);
    });
    return result;
  };

  if (classrooms?.length === 1) {
    redirect("/b1/classroom/" + classrooms[0].id);
  }

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
