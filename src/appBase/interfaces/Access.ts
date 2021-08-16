export interface ApiInterface { name: string, keyName?: string, permissions: RolePermissionInterface[], jwt: string }
export interface ApplicationInterface { name: string, keyName?: string, permissions: RolePermissionInterface[] }
export interface ChurchAppInterface { id?: string, churchId?: string, appName?: string }
export interface ChurchInterface { id?: string, name?: string, registrationDate?: Date, apis?: ApiInterface[], apps?: ChurchAppInterface[], address1?: string, address2?: string, city?: string, state?: string, zip?: string, country?: string, subDomain?: string, personId?: string, jwt?: string }
export interface ForgotResponse { emailed: boolean }
export interface LoadCreateUserRequestInterface { userEmail: string, fromEmail?: string, subject?: string, body?: string, firstName: string, lastName: string }
export interface LoginResponseInterface { user: UserInterface, churches: ChurchInterface[], errors: string[] }
export interface PermissionInterface { apiName?: string, section?: string, action?: string, displaySection?: string, displayAction?: string }
export interface RegisterInterface { churchName?: string, firstName?: string, lastName: string, email?: string, subDomain?: string, appName: string, appUrl: string }
export interface RegisterUserInterface { firstName?: string, lastName: string, email?: string, appName: string, appUrl: string }
export interface RoleInterface { id?: string, churchId?: string, name?: string }
export interface RolePermissionInterface { id?: string, churchId?: string, roleId?: string, apiName?: string, contentType?: string, contentId?: string, action?: string }
export interface RoleMemberInterface { id?: string, churchId?: string, roleId?: string, userId?: string, user?: UserInterface, personId?: string }
export interface ResetPasswordRequestInterface { userEmail: string }
export interface ResetPasswordResponseInterface { emailed: boolean }
export interface SwitchAppRequestInterface { appName: string, churchId: string }
export interface SwitchAppResponseInterface { appName: string, churchId: string }
export interface UserInterface { id?: string, email?: string, authGuid?: string, firstName?: string, lastName?: string, registrationDate?: Date, lastLogin?: Date, password?: string, jwt?: string }
export interface GenericSettingInterface { id?: string, churchId?: string, keyName?: string, value?: string, public?: number }
export interface UserChurchInterface { id?: string, userId?: string, churchId?: string, personId?: string }

export interface ApiConfig { keyName: string, url: string, jwt: string, permisssions: RolePermissionInterface[] }
export type ApiListType = "AccessApi" | "MembershipApi" | "AttendanceApi" | "GivingApi" | "MessagingApi" | "StreamingLiveApi" | "B1Api" | "LessonsApi";
export interface IPermission { api: string, contentType: string, action: string }
