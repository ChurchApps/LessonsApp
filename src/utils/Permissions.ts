import { Permissions as BasePermissions } from "@/appBase/interfaces/Permissions"

export class Permissions extends BasePermissions {
  static lessonsApi = {
    lessons: {
      edit: { api: "LessonsApi", contentType: "Lessons", action: "Edit" }
    }
  }
}