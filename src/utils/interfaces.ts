export * from "@churchapps/apphelper";

export interface ExternalProviderInterface {
  id?: string;
  name?: string;
  apiUrl?: string;
}

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
  age?: string;
  sort?: number;
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
  lessonCount?: number;
}
export interface StudyCategoryInterface {
  id?: string;
  programId?: string;
  studyId?: string;
  categoryName?: string;
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
  thumbPath?: string;
  contentType?: string;
  contentId?: string;
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
  addOnId?: string;
  externalVideoId?: string;
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
export interface BundleInterface {
  id?: string;
  contentType?: string;
  contentId?: string;
  name?: string;
  resources?: ResourceInterface[];
  file?: FileInterface;
  contentName?: string;
}
export interface ExternalVideoInterface {
  id?: string;
  contentType?: string;
  contentId?: string;
  name?: string;
  videoProvider?: string;
  videoId?: string;
  seconds?: string;
  loopVideo?: boolean;
  download720?: string;
  download1080?: string;
  download4k?: string;
  play720?: string;
  play1080?: string;
  play4k?: string;
  thumbnail?: string;
  downloadsExpire?: Date;
}
export interface ResourceInterface {
  id?: string;
  bundleId?: string;
  category?: string;
  name?: string;
  variants?: VariantInterface[];
  assets?: AssetInterface[];
  loopVideo?: boolean;
}
export interface ClassroomInterface {
  id?: string;
  churchId?: string;
  name?: string;
  recentGroupId?: string;
  upcomingGroupId?: string;
}

export interface CustomizationInterface {
  id?: string;
  churchId?: string;
  venueId?: string;
  contentType?: string;
  contentId?: string;
  action?: string;
  actionContent?: string;
}

export interface ScheduleInterface {
  id?: string;
  churchId?: string;
  classroomId?: string;
  scheduledDate?: Date;
  externalProviderId?: string;
  programId?: string;
  studyId?: string;
  lessonId?: string;
  venueId?: string;
  displayName?: string;
}

export interface CopySectionInterface {
  sourceLessonId?: string,
  sourceVenueId?: string,
  sourceSectionId?: string
}

export interface DownloadInterface {
  id?: string,
  lessonId?: string,
  fileId?: string,
  userId?: string,
  ipAddress?: string,
  downloadDate?: Date,
  fileName?: string
}

export interface AddOnInterface {
  id?: string;
  providerId?: string;
  category?: string;
  name?: string;
  image?: string;
  addOnType?: string;
  fileId?: string;
}

export interface PlaylistFileInterface { name: string, url: string, seconds: number, loopVideo: boolean }


export interface FeedActionInterface { actionType?: string, content?: string, role?: string,  files?: FeedFileInterface[] }
export interface FeedDownloadInterface { name?: string, files?: FeedFileInterface[] }
export interface FeedFileInterface { name?: string, url?: string, streamUrl?: string, bytes?: number, fileType?: string, seconds?: number, thumbnail?: string, loop?: boolean, id?: string; expires?: Date }
export interface FeedSectionInterface { name?: string, actions?: FeedActionInterface[], materials?: string }
export interface FeedVenueInterface { id?: string, name?: string, lessonId:string, lessonName?: string, lessonImage?: string, lessonDescription?: string, studyName?: string, studySlug?: string, programName?: string, programSlug?: string, programAbout?:string, downloads?: FeedDownloadInterface[], sections?: FeedSectionInterface[] }

export interface FeedVenueLinkInterface { id?: string, name?: string, apiUrl?:string }
export interface FeedLessonInterface { id?: string, name?: string, slug?: string, image?: string, description?: string, venues: FeedVenueLinkInterface[] }
export interface FeedStudyInterface { id?: string, name?: string, slug?: string, image?: string, description?: string, lessons:FeedLessonInterface[] }
export interface FeedProgramInterface { id?: string, name?: string, slug?: string, image?: string, description?: string, studies:FeedStudyInterface[] }
export interface FeedListInterface { programs?: FeedProgramInterface[] }
