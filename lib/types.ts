// Enums matching backend specification
export enum Status {
  NOT_STARTED = "not_started",
  IN_PROGRESS = "in_progress",
  SUBMITTED = "submitted",
  UNDER_REVIEW = "under_review",
  ACCEPTED = "accepted",
  REJECTED = "rejected",
  DEFERRED = "deferred",
  WAITLISTED = "waitlisted",
  WITHDRAWN = "withdrawn",
}

export enum ApplicationType {
  EARLY_DECISION = "early_decision",
  EARLY_ACTION = "early_action",
  REGULAR_DECISION = "regular_decision",
  ROLLING_ADMISSION = "rolling_admission",
}

export enum Priority {
  REACH = "reach",
  TARGET = "target",
  SAFETY = "safety",
}

export enum Category {
  APPLICATION = "application",
  FINANCIAL_AID = "financial_aid",
  SCHOLARSHIP = "scholarship",
  HOUSING = "housing",
  ACADEMIC = "academic",
  PERSONAL = "personal",
  OTHER = "other",
}

export enum TaskPriority {
  HIGH = "high",
  MEDIUM = "medium",
  LOW = "low",
}

export enum TaskType {
  DOCUMENT_PREPARATION = "document_preparation",
  SUBMISSION = "submission",
  REVIEW = "review",
  FOLLOW_UP = "follow_up",
  RESEARCH = "research",
  WRITING = "writing",
  SCHEDULING = "scheduling",
  OTHER = "other",
}

export enum TaskComponent {
  COMMON_APP = "common_app",
  SUPPLEMENTAL_ESSAY = "supplemental_essay",
  ACADEMIC_RECORDS = "academic_records",
  STANDARDIZED_TESTS = "standardized_tests",
  SUPPORTING_DOCUMENTS = "supporting_documents",
  FINANCIAL_DOCUMENTS = "financial_documents",
  OTHER = "other",
}

export enum TaskStatus {
  NOT_STARTED = "not_started",
  IN_PROGRESS = "in_progress",
  UNDER_REVIEW = "under_review",
  COMPLETED = "completed",
  WAITING = "waiting",
}

export enum TaskResponsible {
  STUDENT = "student",
  PARENT = "parent",
  COUNSELOR = "counselor",
  TEACHER = "teacher",
  SCHOOL_OFFICE = "school_office",
  OTHER = "other",
}

// Essay Status Enum matching backend
export enum EssayStatus {
  NOT_STARTED = "not_started",
  IN_PROGRESS = "in_progress",
  NOT_SUBMITTED = "not_submitted",
  REVIEW_NEEDED = "review_needed",
  SUBMITTED = "submitted",
  COMPLETED = "completed",
}

// Model interfaces
export interface Task {
  id: string;
  name: string;
  deadline: string | null; // ISO 8601 or null
  priority: TaskPriority;
  type: TaskType;
  component: TaskComponent;
  status: TaskStatus;
  responsible: TaskResponsible;
  notes?: string;
  completed: boolean;
  created_at: string;
  updated_at: string;
}

export interface Checklist {
  id: string;
  name: string;
  category: Category;
  description?: string;
  tasks: Task[];
  progress: number;
  created_at: string;
  updated_at: string;
}

export interface CollegeApplication {
  id: string;
  name: string;
  location?: string;
  deadline?: string; // ISO 8601
  websites?: string[];
  tags?: string[];
  notes?: string;
  status: Status;
  application_type: ApplicationType;
  priority: Priority;
  major: string;
  application_fee?: number;
  contact_email?: string;
  checklists: Checklist[];
  progress: number;
  created_at: string;
  updated_at: string;
}

// Essay interface
export interface Essay {
  id: string;
  title: string;
  college_application_id: string;
  college_name?: string; // Included in responses
  status: EssayStatus;
  prompt?: string;
  content?: string;
  ai_score?: number; // 0-10
  ai_feedbacks?: string[];
  ai_suggestion?: string;
  created_at: string;
  updated_at: string;
}

// DTO interfaces for requests
export interface CreateTaskDTO {
  name: string;
  deadline?: string; // ISO 8601, optional
  priority: TaskPriority;
  type: TaskType;
  component: TaskComponent;
  status: TaskStatus;
  responsible: TaskResponsible;
  notes?: string;
}

export interface CreateChecklistDTO {
  name: string;
  category: Category;
  description?: string;
  tasks?: CreateTaskDTO[];
}

export interface CreateCollegeApplicationDTO {
  name: string;
  location?: string;
  deadline?: string; // ISO 8601
  websites?: string[];
  tags?: string[];
  notes?: string;
  status: Status;
  application_type: ApplicationType;
  priority: Priority;
  major: string;
  application_fee?: number;
  contact_email?: string;
  checklists?: CreateChecklistDTO[];
}

export interface UpdateTaskDTO {
  id?: string;
  completed?: boolean;
  name?: string;
  deadline?: string;
  priority?: TaskPriority;
  type?: TaskType;
  component?: TaskComponent;
  status?: TaskStatus;
  responsible?: TaskResponsible;
  notes?: string;
}

export interface UpdateChecklistDTO {
  id?: string;
  name?: string;
  category?: Category;
  description?: string;
  tasks?: UpdateTaskDTO[];
}

export interface UpdateCollegeApplicationDTO {
  name?: string;
  location?: string;
  deadline?: string;
  websites?: string[];
  tags?: string[];
  notes?: string;
  status?: Status;
  application_type?: ApplicationType;
  priority?: Priority;
  major?: string;
  application_fee?: number;
  contact_email?: string;
  checklists?: UpdateChecklistDTO[];
}

export interface StandaloneCreateChecklistDTO {
  application_id: string;
  name: string;
  category: Category;
  description?: string;
}

export interface StandaloneUpdateChecklistDTO {
  name?: string;
  category?: Category;
  description?: string;
}

export interface StandaloneCreateTaskDTO {
  application_id: string;
  checklist_id: string;
  name: string;
  deadline: string | null; // ISO 8601 or null
  priority: TaskPriority;
  type: TaskType;
  component: TaskComponent;
  status: TaskStatus;
  responsible: TaskResponsible;
  notes?: string;
}

export interface StandaloneUpdateTaskDTO {
  completed?: boolean;
  name?: string;
  deadline?: string | null;
  priority?: TaskPriority;
  type?: TaskType;
  component?: TaskComponent;
  status?: TaskStatus;
  responsible?: TaskResponsible;
  notes?: string;
}

// Essay DTO interfaces
export interface CreateEssayDTO {
  title: string;
  college_application_id: string;
  status: EssayStatus;
  prompt?: string;
  content?: string;
}

export interface UpdateEssayDTO {
  title?: string;
  status?: EssayStatus;
  prompt?: string;
  content?: string;
  ai_score?: number;
  ai_feedbacks?: string[];
  ai_suggestion?: string;
}

// API Response interfaces
export interface ApiResponse<T> {
  success: true;
  data: T;
}

export interface ApiError {
  success: false;
  error: {
    code?: string;
    message: string;
    details?: any;
  };
}

export type ApiResult<T> = ApiResponse<T> | ApiError;

// Custom error class for API errors
export class ApiError extends Error {
  public code?: string;

  constructor(message: string, code?: string) {
    super(message);
    this.name = "ApiError";
    this.code = code;
  }
}
