import React, { use } from "react";
import { About } from "./About";

import { ProgramInterface, ApiHelper, ProviderInterface } from "@/utils";
import { Connect } from "./Connect";
import { Testimonials } from "./Testimonials";
import { Hero } from "./Hero";
import { Programs } from "./Programs";

type Props = {

};


const getData = async () =>
{
  const programs = await (await fetch("https://api.lessons.church/programs/public", { method: "GET" })).json();
  const providers = await (await fetch("https://api.lessons.church/providers/public", { method: "GET" })).json();
  const studies = await (await fetch("https://api.lessons.church/studies/public", { method: "GET" })).json();
  const stats = await (await fetch("https://api.lessons.church/providers/stats", { method: "GET" })).json();

  //const programs: ProgramInterface[] = await ApiHelper.getAnonymous("/programs/public", "LessonsApi");
  //const providers: ProviderInterface[] = await ApiHelper.getAnonymous("/providers/public", "LessonsApi");
  //const studies: ProviderInterface[] = await ApiHelper.getAnonymous("/studies/public", "LessonsApi");
  //const stats: any = await ApiHelper.getAnonymous("/providers/stats", "LessonsApi");
  return { programs, providers, studies, stats }
  //return { programs }
}


export default function TestPage(props: Props) {

  const { programs, providers, studies, stats} = use(getData());
  //const { programs } = use(getData());

  //<Hero stats={stats} />

  return (
    <>
      <h1>Hello World</h1>

      <About />
      <Testimonials />
      <Connect />
      <Programs programs={programs} providers={providers} studies={studies} />
      <Testimonials />
      <Connect />


    </>
  );
}
