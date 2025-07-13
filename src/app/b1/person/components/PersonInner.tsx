import Link from "next/link";
import { redirect, useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import { Container } from "@mui/material";
import { ApiHelper } from "@churchapps/apphelper/dist/helpers/ApiHelper";
import { ArrayHelper } from "@churchapps/apphelper/dist/helpers/ArrayHelper";
import { useUser } from "@/app/context/UserContext";
import { Layout } from "@/components/Layout";
import { ClassroomInterface } from "@/helpers/interfaces";

//import { useRouter } from "next/router";

export function PersonInner() {
  //const router = useRouter();

  //const [church, setChurch] = useState<ChurchInterface>(null);
  const [classrooms, setClassrooms] = useState<ClassroomInterface[]>([]);
  const context = useUser();
  const params = useSearchParams();
  useEffect(() => {
    loadData();
  }, [context?.person]);

  const loadData = () => {
    if (context.person) {
      let url = "/classrooms/person";
      ApiHelper.get(url, "LessonsApi").then((c: ClassroomInterface[]) => {
        if (c.length === 0) redirect("/b1/" + (params.get("churchId") || context.userChurch.church.id));
        else setClassrooms(c);
      });
    }
  };

  const getRows = () => {
    const result: JSX.Element[] = [];
    classrooms?.forEach(c => {
      let url = "/b1/classroom/" + c.id;
      if (ArrayHelper.getOne(context.userChurch.groups, "id", c.recentGroupId)) url += "?recent=1";
      result.push(
        <Link href={url} className="bigLink">
          {c.name}
        </Link>
      );
    });
    return result;
  };

  //TODO: figure out how to add this back.
  //if (classrooms?.length === 1) router.push("/b1/classroom/" + classrooms[0].id);
  //else {
  return (
    <Layout withoutNavbar={true} withoutFooter={true}>
      <Container fixed>
        <h1>Select a Room</h1>
      </Container>
      {getRows()}
      <br />
    </Layout>
  );
  //}
}
