import { ApiHelper } from "@churchapps/apphelper/dist/helpers/ApiHelper";
import Error from "@/pages/_error";
import React from "react";
import LessonClient from "./components/LessonClient";

export default async function LessonsPage({params}: {params:{programSlug:string, studySlug:string, lessonSlug:string}}) {

  const loadData = async () => {
    try {
      const lessonData = await ApiHelper.getAnonymous("/lessons/public/slugAlt/" + params.programSlug + "/" + params.studySlug + "/" + params.lessonSlug, "LessonsApi");

      if (lessonData.venues.length === 0) return {errorMessage: "No venues for lesson."}
      else return { lessonData, errorMessage: "" }
    } catch (error: any) {
      console.log("inside catch: ", error)
      return {errorMessage: error.message}
    }
  }

  const {lessonData, errorMessage} = await loadData();





  if (errorMessage) return <Error message={errorMessage} />
  else return <LessonClient lessonData={lessonData} />


}
