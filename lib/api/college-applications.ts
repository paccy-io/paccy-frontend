import { API_BASE_URL, API_ENDPOINTS } from "../../config/api";
import {
  CollegeApplication,
  Checklist,
  Task,
  CreateCollegeApplicationDTO,
  UpdateCollegeApplicationDTO,
  StandaloneCreateChecklistDTO,
  StandaloneUpdateChecklistDTO,
  StandaloneCreateTaskDTO,
  StandaloneUpdateTaskDTO,
  ApiResponse,
  ApiError as ApiErrorType,
  ApiResult,
} from "../types";
import { showApiError, logApiError } from "../utils/errorNotification";

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
  let data: ApiResult<T>;

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
    const error = data as any;
    // Create more descriptive error message including server error details
    let errorMessage: any = data.error || "Unknown server error";

    // Add error code if available
    if (response.status) {
      errorMessage = `${errorMessage} (Code: ${response.status})`;
    }

    // Add status code context
    if (response.status !== 200) {
      errorMessage = `HTTP ${response.status}: ${errorMessage}`;
    }

    const apiError = new ApiError(errorMessage, error.error.code);
    logApiError(apiError, context, {
      status: response.status,
      url: response.url,
      serverError: error.error,
    });
    showApiError(apiError, context);
    throw apiError;
  }

  return (data as ApiResponse<T>).data;
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

    return handleApiResponse<T>(response, context);
  } catch (error) {
    // If it's already an ApiError that was handled, just re-throw it
    if (error instanceof ApiError) {
      throw error;
    }

    // Handle network errors or other fetch errors with more specific messages
    let errorMessage = "Network error occurred";

    if (error instanceof TypeError) {
      if (error.message.includes("fetch")) {
        errorMessage =
          "Unable to connect to server. Please check your internet connection.";
      } else if (error.message.includes("network")) {
        errorMessage = "Network error. Please try again.";
      } else {
        errorMessage = `Connection error: ${error.message}`;
      }
    } else if (error instanceof Error) {
      errorMessage = error.message.includes("timeout")
        ? "Request timed out. Please try again."
        : `Request failed: ${error.message}`;
    }

    const apiError = new ApiError(errorMessage);
    logApiError(error, context, { method, url, body, originalError: error });
    showApiError(apiError, context);
    throw apiError;
  }
}

// College Applications API functions
export const collegeApplicationsApi = {
  // 1) GET /college-applications
  getAll: async (): Promise<CollegeApplication[]> => {
    return makeRequest<CollegeApplication[]>(
      "GET",
      `${API_BASE_URL}${API_ENDPOINTS.COLLEGE_APPLICATIONS}`,
      undefined,
      "Loading college applications"
    );
  },

  // 2) POST /college-applications
  create: async (
    data: CreateCollegeApplicationDTO
  ): Promise<CollegeApplication> => {
    return makeRequest<CollegeApplication>(
      "POST",
      `${API_BASE_URL}${API_ENDPOINTS.COLLEGE_APPLICATIONS}`,
      data,
      "Creating college application"
    );
  },

  // 3) GET /college-applications/:id
  getById: async (id: string): Promise<CollegeApplication> => {
    return makeRequest<CollegeApplication>(
      "GET",
      `${API_BASE_URL}${API_ENDPOINTS.COLLEGE_APPLICATIONS}/${id}`,
      undefined,
      "Loading college details"
    );
  },

  // 4) PUT /college-applications/:id
  update: async (
    id: string,
    data: UpdateCollegeApplicationDTO
  ): Promise<CollegeApplication> => {
    return makeRequest<CollegeApplication>(
      "PUT",
      `${API_BASE_URL}${API_ENDPOINTS.COLLEGE_APPLICATIONS}/${id}`,
      data,
      "Updating college information"
    );
  },

  // 5) DELETE /college-applications/:id
  delete: async (id: string): Promise<void> => {
    return makeRequest<void>(
      "DELETE",
      `${API_BASE_URL}${API_ENDPOINTS.COLLEGE_APPLICATIONS}/${id}`,
      undefined,
      "Deleting college application"
    );
  },

  // 6) GET /college-applications/deadlines/upcoming
  getUpcomingDeadlines: async (): Promise<CollegeApplication[]> => {
    return makeRequest<CollegeApplication[]>(
      "GET",
      `${API_BASE_URL}${API_ENDPOINTS.COLLEGE_APPLICATION_DEADLINES}`,
      undefined,
      "Loading upcoming deadlines"
    );
  },
};

// Standalone Checklists API functions
export const checklistsApi = {
  // 7) POST /college-applications/checklists
  create: async (
    data: StandaloneCreateChecklistDTO
  ): Promise<Checklist | CollegeApplication> => {
    return makeRequest<Checklist | CollegeApplication>(
      "POST",
      `${API_BASE_URL}${API_ENDPOINTS.COLLEGE_APPLICATION_CHECKLISTS}`,
      data,
      "Creating checklist"
    );
  },

  // 8) GET /college-applications/:applicationId/checklists/:checklistId
  getById: async (
    applicationId: string,
    checklistId: string
  ): Promise<Checklist> => {
    return makeRequest<Checklist>(
      "GET",
      `${API_BASE_URL}${API_ENDPOINTS.COLLEGE_APPLICATIONS}/${applicationId}/checklists/${checklistId}`,
      undefined,
      "Loading checklist"
    );
  },

  // 9) PUT /college-applications/:applicationId/checklists/:checklistId
  update: async (
    applicationId: string,
    checklistId: string,
    data: StandaloneUpdateChecklistDTO
  ): Promise<Checklist | CollegeApplication> => {
    return makeRequest<Checklist | CollegeApplication>(
      "PUT",
      `${API_BASE_URL}${API_ENDPOINTS.COLLEGE_APPLICATIONS}/${applicationId}/checklists/${checklistId}`,
      data,
      "Updating checklist"
    );
  },

  // 10) DELETE /college-applications/:applicationId/checklists/:checklistId
  delete: async (applicationId: string, checklistId: string): Promise<void> => {
    return makeRequest<void>(
      "DELETE",
      `${API_BASE_URL}${API_ENDPOINTS.COLLEGE_APPLICATIONS}/${applicationId}/checklists/${checklistId}`,
      undefined,
      "Deleting checklist"
    );
  },
};

// Standalone Tasks API functions
export const tasksApi = {
  // 11) POST /college-applications/tasks
  create: async (
    data: StandaloneCreateTaskDTO
  ): Promise<Task | CollegeApplication> => {
    return makeRequest<Task | CollegeApplication>(
      "POST",
      `${API_BASE_URL}${API_ENDPOINTS.COLLEGE_APPLICATION_TASKS}`,
      data,
      "Creating task"
    );
  },

  // 12) GET /college-applications/:applicationId/checklists/:checklistId/tasks/:taskId
  getById: async (
    applicationId: string,
    checklistId: string,
    taskId: string
  ): Promise<Task> => {
    return makeRequest<Task>(
      "GET",
      `${API_BASE_URL}${API_ENDPOINTS.COLLEGE_APPLICATIONS}/${applicationId}/checklists/${checklistId}/tasks/${taskId}`,
      undefined,
      "Loading task"
    );
  },

  // 13) PUT /college-applications/:applicationId/checklists/:checklistId/tasks/:taskId
  update: async (
    applicationId: string,
    checklistId: string,
    taskId: string,
    data: StandaloneUpdateTaskDTO
  ): Promise<Task | CollegeApplication> => {
    return makeRequest<Task | CollegeApplication>(
      "PUT",
      `${API_BASE_URL}${API_ENDPOINTS.COLLEGE_APPLICATIONS}/${applicationId}/checklists/${checklistId}/tasks/${taskId}`,
      data,
      "Updating task"
    );
  },

  // 14) DELETE /college-applications/:applicationId/checklists/:checklistId/tasks/:taskId
  delete: async (
    applicationId: string,
    checklistId: string,
    taskId: string
  ): Promise<void> => {
    return makeRequest<void>(
      "DELETE",
      `${API_BASE_URL}${API_ENDPOINTS.COLLEGE_APPLICATIONS}/${applicationId}/checklists/${checklistId}/tasks/${taskId}`,
      undefined,
      "Deleting task"
    );
  },
};

// Export unified API object
export const api = {
  collegeApplications: collegeApplicationsApi,
  checklists: checklistsApi,
  tasks: tasksApi,
};

export { ApiError };
