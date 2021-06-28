export * from "../appBase/interfaces";

export interface ProviderInterface { id?: string, name?: string, }
export interface ProgramInterface { id?: string, providerId?: string, name?: string, image?: string, shortDescription?: string, description?: string, videoEmbedUrl?: string }
export interface StudyInterface { id?: string, programId?: string, name?: string, image?: string, shortDescription?: string, description?: string, videoEmbedUrl?: string }
export interface LessonInterface { id?: string, studyId?: string, name?: string, title?: string, image?: string, description?: string, live?: boolean, sort?: number }

export interface VenueInterface { id?: string, lessonId?: string, name?: string, sections?: SectionInterface[], sort?: number }
export interface SectionInterface { id?: string, lessonId?: string, venueId?: string, name?: string, sort?: number, roles?: RoleInterface[], actions?: ActionInterface[] }
export interface RoleInterface { id?: string, lessonId?: string, sectionId?: string, name?: string, sort?: number, actions?: ActionInterface }
export interface ActionInterface { id?: string, lessonId?: string, roleId?: string, actionType?: string, content?: string, sort?: number }

export interface ResourceInterface { id?: string, contentType?: string, contentId?: string, name?: string, }
export interface AssetInterface { id?: string, resourceId?: string, fileId?: string, name?: string, sort?: string }
export interface VariantInterface { id?: string, resourceId?: string, fileId?: string, name?: string, downloadDefault?: boolean, playerDefault?: boolean }