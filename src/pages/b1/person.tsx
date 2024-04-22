import React, { useState, useEffect } from "react";
import { Layout } from "@/components";
import { ApiHelper, ArrayHelper, ClassroomInterface } from "@/utils";
import Link from "next/link";
import { Container } from "@mui/material";
import UserContext from "@/UserContext";


export default function Venue() {
  //const [church, setChurch] = useState<ChurchInterface>(null);
  const [classrooms, setClassrooms] = useState<ClassroomInterface[]>([]);
  const context = React.useContext(UserContext);
  useEffect(() => { loadData(); }, [context.person]);

  const loadData = () => {
    if (context.person) {
      console.log("made it", context.person)
      let url = "/classrooms/person";
      ApiHelper.get(url, "LessonsApi").then((v: ClassroomInterface[]) => { setClassrooms(v); });
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
