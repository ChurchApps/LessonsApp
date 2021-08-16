export interface AnswerInterface { id?: string, value?: string, questionId?: string, formSubmissionId?: string }
export interface CampusInterface { id?: string, name?: string }
export interface ContactInfoInterface { address1?: string, address2?: string, city?: string, state?: string, zip?: string, homePhone?: string, mobilePhone?: string, workPhone?: string, email?: string }
export interface FormInterface { id?: string, name?: string, contentType?: string }
export interface FormSubmissionInterface { id?: string, formId?: string, contentType?: string, contentId?: string, form?: FormInterface, answers?: AnswerInterface[], questions?: QuestionInterface[] }
export interface GroupInterface { id?: string, name?: string, categoryName?: string, memberCount?: number, trackAttendance?: boolean, parentPickup?: boolean }
export interface GroupMemberInterface { id?: string, personId: string, person?: PersonInterface, groupId: string, group?: GroupInterface }
export interface GroupServiceTimeInterface { id?: string, groupId?: string, serviceTimeId?: string, serviceTime?: ServiceTimeInterface }
export interface HouseholdInterface { id?: string, name?: string }
export interface HouseholdMemberInterface { id?: string, householdId?: string, household?: HouseholdInterface, personId?: string, person?: PersonInterface, role?: string }
export interface NameInterface { first?: string, middle?: string, last?: string, nick?: string, display?: string }
export interface NoteInterface { id?: string, churchId?: string, contentType?: string, contentId?: string, noteType?: string, addedBy?: string, contents?: string, createdAt?: string, updatedAt?: string, person?: PersonInterface }
export interface ReportInterface { id?: string, keyName?: string, title?: string, query?: string, parameters?: string, reportType: string, columns?: ReportColumnInterface[], values?: ReportValueInterface[], results?: any[] }
export interface ReportColumnInterface { field?: string, heading?: string, grouped?: boolean, formatType?: string }
export interface ReportValueInterface { key?: string, value?: any }
export interface PersonInterface { id?: string, name: NameInterface, contactInfo: ContactInfoInterface, membershipStatus?: string, gender?: string, birthDate?: Date, maritalStatus?: string, anniversary?: Date, photo?: string, photoUpdated?: Date, householdId?: string, householdRole?: string, userId?: string, formSubmissions?: [FormSubmissionInterface] }
export interface QuestionInterface { id?: string, formId?: string, title?: string, fieldType?: string, placeholder?: string, description?: string, choices?: [{ value?: string, text?: string }] }
export interface ServiceInterface { id?: string, campusId?: string, name?: string, campus?: CampusInterface }
export interface ServiceTimeInterface { id?: string, name?: string, longName?: string, serviceId?: string, groups?: GroupInterface[] }
