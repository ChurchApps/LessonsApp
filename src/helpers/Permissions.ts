import { Permissions as BasePermissions } from "@churchapps/apphelper";

export class Permissions extends BasePermissions {
  static lessonsApi = {
    lessons: {
      edit: { api: "LessonsApi", contentType: "Lessons", action: "Edit" },
      editSchedules: { api: "LessonsApi", contentType: "Schedules", action: "Edit" }
    }
  };
}
