import { ArrayHelper } from ".";

export class ExternalProviderHelper {

  static getLesson = (lessonList:any, programId:string, studyId:string, lessonId:string) => {
    const program = ArrayHelper.getOne(lessonList.programs, "id", programId);
    const study = ArrayHelper.getOne(program?.studies, "id", studyId);
    const lesson = ArrayHelper.getOne(study?.lessons, "id", lessonId);
    return {lesson, study, program};
  }

  static getStudy = (lessonList:any, programId:string, studyId:string) => {
    const program = ArrayHelper.getOne(lessonList.programs, "id", programId);
    const study = ArrayHelper.getOne(program?.studies, "id", studyId);
    return {study, program};
  }

}
