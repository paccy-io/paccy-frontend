import { API_BASE_URL } from "../../config/api";
import { showApiError, logApiError } from "../utils/errorNotification";

// Types based on API documentation
export interface Exam {
  id: string;
  type: ExamType;
  name: string;
  score: string;
  max_score: string;
  exam_date: string; // YYYY-MM format
  notes?: string;
  created_at: string;
  updated_at: string;
}

export interface CreateExamData {
  type: ExamType;
  name: string;
  score: string;
  max_score: string;
  exam_date: string; // YYYY-MM format
  notes?: string;
}

export interface UpdateExamData {
  type?: ExamType;
  name?: string;
  score?: string;
  max_score?: string;
  exam_date?: string; // YYYY-MM format
  notes?: string;
}

export interface HighSchoolGPA {
  id: string;
  scale: GPAScale;
  gpa_1?: string; // Grade 9
  gpa_2?: string; // Grade 10
  gpa_3?: string; // Grade 11
  gpa_4?: string; // Grade 12
  created_at: string;
  updated_at: string;
}

export interface HighSchoolGPAData {
  scale?: GPAScale;
  gpa_1?: string;
  gpa_2?: string;
  gpa_3?: string;
  gpa_4?: string;
}

// Enums as per API documentation
export type ExamType =
  | "SAT"
  | "ACT"
  | "SAT Subject Test"
  | "AP"
  | "IB"
  | "TOEFL"
  | "IELTS"
  | "GRE"
  | "GMAT"
  | "LSAT"
  | "MCAT"
  | "other";

export type GPAScale = "4.0" | "5.0" | "100";

// API Response types
interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data?: T;
  error?: string;
}

// Custom error class for API errors
class ApiError extends Error {
  public code?: string;

  constructor(message: string, code?: string) {
    super(message);
    this.name = "ApiError";
    this.code = code;
  }
}

// Helper function to get auth token
function getAuthToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("auth-token");
}

// Helper function to handle API responses
async function handleApiResponse<T>(
  response: Response,
  context?: string
): Promise<T> {
  let data: any;

  try {
    data = await response.json();
  } catch (e) {
    console.error("Failed to parse response as JSON:", e);
    const error = new ApiError(
      `Invalid server response (Status: ${response.status})`
    );
    logApiError(e, context, { status: response.status, url: response.url });
    showApiError(error, context);
    throw error;
  }

  if (!data.success) {
    const errorMessage = data.error || "Unknown server error";
    const apiError = new ApiError(errorMessage);
    logApiError(apiError, context, {
      status: response.status,
      url: response.url,
      serverError: data.error,
    });
    showApiError(apiError, context);
    throw apiError;
  }

  return data.data;
}

// Helper function for making authenticated requests
async function makeRequest<T>(
  method: string,
  url: string,
  body?: any,
  context?: string
): Promise<T> {
  const token = getAuthToken();
  if (!token) {
    const error = new ApiError("No authentication token found");
    showApiError(error, "Authentication");
    throw error;
  }

  const headers: Record<string, string> = {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
  };

  const config: RequestInit = {
    method,
    headers,
  };

  if (body && (method === "POST" || method === "PUT")) {
    config.body = JSON.stringify(body);
  }

  try {
    const response = await fetch(url, config);
    return await handleApiResponse<T>(response, context);
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }

    const apiError = new ApiError(
      error instanceof Error ? error.message : "Unknown error occurred"
    );
    logApiError(apiError, context, { originalError: error });
    showApiError(apiError, context);
    throw apiError;
  }
}

class AcademicApi {
  // EXAM ENDPOINTS

  // Create a new exam
  async createExam(examData: CreateExamData): Promise<Exam> {
    return makeRequest<Exam>(
      "POST",
      `${API_BASE_URL}/exams`,
      examData,
      "Create Exam"
    );
  }

  // Get all user's exams
  async getExams(): Promise<Exam[]> {
    return makeRequest<Exam[]>(
      "GET",
      `${API_BASE_URL}/exams`,
      undefined,
      "Get Exams"
    );
  }

  // Get exam by ID
  async getExam(id: string): Promise<Exam> {
    return makeRequest<Exam>(
      "GET",
      `${API_BASE_URL}/exams/${id}`,
      undefined,
      "Get Exam"
    );
  }

  // Get exams by type
  async getExamsByType(type: ExamType): Promise<Exam[]> {
    return makeRequest<Exam[]>(
      "GET",
      `${API_BASE_URL}/exams/type/${type}`,
      undefined,
      "Get Exams by Type"
    );
  }

  // Update exam
  async updateExam(id: string, examData: UpdateExamData): Promise<Exam> {
    return makeRequest<Exam>(
      "PUT",
      `${API_BASE_URL}/exams/${id}`,
      examData,
      "Update Exam"
    );
  }

  // Delete exam
  async deleteExam(id: string): Promise<void> {
    return makeRequest<void>(
      "DELETE",
      `${API_BASE_URL}/exams/${id}`,
      undefined,
      "Delete Exam"
    );
  }

  // HIGH SCHOOL GPA ENDPOINTS

  // Get user's high school GPA
  async getHighSchoolGPA(): Promise<HighSchoolGPA | null> {
    try {
      return await makeRequest<HighSchoolGPA>(
        "GET",
        `${API_BASE_URL}/high-school-gpa`,
        undefined,
        "Get High School GPA"
      );
    } catch (error) {
      // Return null if GPA doesn't exist (404)
      if (error instanceof ApiError && error.message.includes("404")) {
        return null;
      }
      throw error;
    }
  }

  // Create high school GPA
  async createHighSchoolGPA(
    gpaData: HighSchoolGPAData
  ): Promise<HighSchoolGPA> {
    return makeRequest<HighSchoolGPA>(
      "POST",
      `${API_BASE_URL}/high-school-gpa`,
      gpaData,
      "Create High School GPA"
    );
  }

  // Update high school GPA
  async updateHighSchoolGPA(
    gpaData: HighSchoolGPAData
  ): Promise<HighSchoolGPA> {
    return makeRequest<HighSchoolGPA>(
      "PUT",
      `${API_BASE_URL}/high-school-gpa`,
      gpaData,
      "Update High School GPA"
    );
  }

  // Delete high school GPA
  async deleteHighSchoolGPA(): Promise<void> {
    return makeRequest<void>(
      "DELETE",
      `${API_BASE_URL}/high-school-gpa`,
      undefined,
      "Delete High School GPA"
    );
  }

  // Convenience method to save GPA (creates if doesn't exist, updates if exists)
  async saveHighSchoolGPA(gpaData: HighSchoolGPAData): Promise<HighSchoolGPA> {
    try {
      // First try to get existing GPA
      const existingGPA = await this.getHighSchoolGPA();

      if (existingGPA) {
        // Update existing GPA
        return await this.updateHighSchoolGPA(gpaData);
      } else {
        // Create new GPA
        return await this.createHighSchoolGPA(gpaData);
      }
    } catch (error) {
      // If getting GPA fails, try to create
      return await this.createHighSchoolGPA(gpaData);
    }
  }
}

export const academicApi = new AcademicApi();
