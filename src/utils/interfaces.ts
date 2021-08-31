export * from "@/appBase/interfaces";

export interface ProviderInterface {
  id?: string;
  name?: string;
}
export interface ProgramInterface {
  id?: string;
  providerId?: string;
  name?: string;
  slug?: string;
  image?: string;
  shortDescription?: string;
  description?: string;
  videoEmbedUrl?: string;
  live?: boolean;
  aboutSection?: string;
}
export interface StudyInterface {
  id?: string;
  programId?: string;
  name?: string;
  slug?: string;
  image?: string;
  shortDescription?: string;
  description?: string;
  videoEmbedUrl?: string;
  live?: boolean;
  sort?: number;
}
export interface LessonInterface {
  id?: string;
  studyId?: string;
  name?: string;
  slug?: string;
  title?: string;
  image?: string;
  description?: string;
  live?: boolean;
  sort?: number;
  videoEmbedUrl?: string;
}

export interface FileInterface {
  id?: string;
  resourceId?: string;
  fileName?: string;
  contentPath?: string;
  fileType?: string;
  size?: number;
  dateModified?: Date;
  fileContents?: string;
}
export interface VenueInterface {
  id?: string;
  lessonId?: string;
  name?: string;
  sections?: SectionInterface[];
  sort?: number;
}
export interface SectionInterface {
  id?: string;
  lessonId?: string;
  venueId?: string;
  name?: string;
  sort?: number;
  materials?: string;
  roles?: RoleInterface[];
}
export interface RoleInterface {
  id?: string;
  lessonId?: string;
  sectionId?: string;
  name?: string;
  sort?: number;
  actions?: ActionInterface[];
}
export interface ActionInterface {
  id?: string;
  lessonId?: string;
  roleId?: string;
  actionType?: string;
  content?: string;
  sort?: number;
  resourceId?: string;
  assetId?: string;
}

export interface AssetInterface {
  id?: string;
  resourceId?: string;
  fileId?: string;
  name?: string;
  sort?: number;
  file?: FileInterface;
}
export interface VariantInterface {
  id?: string;
  resourceId?: string;
  fileId?: string;
  name?: string;
  downloadDefault?: boolean;
  playerDefault?: boolean;
  hidden?: boolean;
  file?: FileInterface;
}
export interface ResourceInterface {
  id?: string;
  contentType?: string;
  contentId?: string;
  category?: string;
  name?: string;
  variants?: VariantInterface[];
  assets?: AssetInterface[];
}
export interface ClassroomInterface {
  id?: string;
  churchId?: string;
  name?: string;
}
export interface ScheduleInterface {
  id?: string;
  churchId?: string;
  classroomId?: string;
  scheduledDate?: Date;
  lessonId?: string;
  displayName?: string;
}