export * from "../appBase/interfaces";

export interface VenueInterface { name?: string, sections?: SectionInterface[] }
export interface SectionInterface { name?: string, roles: RoleInterface[], actions: ActionInterface[] }
export interface RoleInterface { name: string, actions?: ActionInterface }
export interface ActionInterface { actionType: string, contents: string }
