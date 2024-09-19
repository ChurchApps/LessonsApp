import React, { useState, useEffect } from "react";
import { Layout } from "@/components/Layout";

import Link from "next/link";
import { Container } from "@mui/material";
import UserContext from "@/UserContext";
import { redirect, useSearchParams } from "next/navigation";
import { ClassroomInterface } from "@/utils/interfaces";
import { EnvironmentHelper } from "@/utils/EnvironmentHelper";
import { ApiHelper } from "@churchapps/apphelper/dist/helpers/ApiHelper";
import { ArrayHelper } from "@churchapps/apphelper/dist/helpers/ArrayHelper";
//import { useRouter } from "next/router";


export function PersonInner() {
  //const router = useRouter();

  //const [church, setChurch] = useState<ChurchInterface>(null);
  const [classrooms, setClassrooms] = useState<ClassroomInterface[]>([]);
  const context = React.useContext(UserContext);
  const params = useSearchParams()
  useEffect(() => { loadData(); }, [context?.person]);

  const loadData = () => {
    if (context.person) {
      EnvironmentHelper.init();
      let url = "/classrooms/person";
      ApiHelper.get(url, "LessonsApi").then((c: ClassroomInterface[]) => {
        if (c.length === 0) redirect("/b1/" + (params.get("churchId") || context.userChurch.church.id));
        else setClassrooms(c);
      });
    }
  }

  const getRows = () => {
    const result: JSX.Element[] = [];
    classrooms?.forEach(c => {
      let url = "/b1/classroom/" + c.id;
      if (ArrayHelper.getOne(context.userChurch.groups, "id", c.recentGroupId)) url += "?recent=1";
      result.push(<Link href={url} className="bigLink">{c.name}</Link>)
    })
    return result;
  }

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
