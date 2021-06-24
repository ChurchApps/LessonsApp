export * from "../appBase/interfaces";


export interface ProgramInterface { id?: string, providerId?: string, name?: string, }
export interface StudyInterface { id?: string, programId?: string, name?: string, image?: string }
export interface LessonInterface { id?: string, studyId?: string, name?: string, title: string }


export interface VenueInterface { name?: string, sections?: SectionInterface[] }
export interface SectionInterface { name?: string, roles: RoleInterface[], actions: ActionInterface[] }
export interface RoleInterface { name: string, actions?: ActionInterface }
export interface ActionInterface { actionType: string, contents: string }
