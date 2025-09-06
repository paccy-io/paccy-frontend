import { API_BASE_URL, API_ENDPOINTS } from "../../config/api";
import {
  Essay,
  CreateEssayDTO,
  UpdateEssayDTO,
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

  if (data.success) {
    return data.data;
  } else {
    const error = new ApiError(data.error.message, data.error.code);
    logApiError(data.error, context, {
      status: response.status,
      url: response.url,
    });
    showApiError(error, context);
    throw error;
  }
}

// Generic request function
async function makeRequest<T>(
  method: string,
  url: string,
  body?: any,
  context?: string
): Promise<T> {
  const token = getAuthToken();
  if (!token && !url.includes("/login") && !url.includes("/register")) {
    throw new ApiError("No authentication token found. Please log in again.");
  }

  const headers: HeadersInit = {
    "Content-Type": "application/json",
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  try {
    const response = await fetch(url, {
      method,
      headers,
      body: body ? JSON.stringify(body) : undefined,
    });

    if (response.status === 401) {
      localStorage.removeItem("auth-token");
      window.location.href = "/auth";
      throw new ApiError("Session expired. Please log in again.");
    }

    return await handleApiResponse<T>(response, context);
  } catch (error) {
    console.error("Request failed:", error);
    if (error instanceof ApiError) {
      throw error;
    }
    const apiError = new ApiError(
      error instanceof Error ? error.message : "Request failed"
    );
    logApiError(error, context, { method, url });
    showApiError(apiError, context);
    throw apiError;
  }
}

// Essays API functions
export const essaysApi = {
  // 1) POST /essays - Create Essay
  create: async (data: CreateEssayDTO): Promise<Essay> => {
    return makeRequest<Essay>(
      "POST",
      `${API_BASE_URL}${API_ENDPOINTS.ESSAYS}`,
      data,
      "Creating essay"
    );
  },

  // 2) GET /essays - Get All Essays for User
  getAll: async (): Promise<Essay[]> => {
    return makeRequest<Essay[]>(
      "GET",
      `${API_BASE_URL}${API_ENDPOINTS.ESSAYS}`,
      undefined,
      "Loading essays"
    );
  },

  // 3) GET /essays/:id - Get Essay by ID
  getById: async (id: string): Promise<Essay> => {
    return makeRequest<Essay>(
      "GET",
      `${API_BASE_URL}${API_ENDPOINTS.ESSAYS}/${id}`,
      undefined,
      "Loading essay"
    );
  },

  // 4) PUT /essays/:id - Update Essay
  update: async (id: string, data: UpdateEssayDTO): Promise<Essay> => {
    return makeRequest<Essay>(
      "PUT",
      `${API_BASE_URL}${API_ENDPOINTS.ESSAYS}/${id}`,
      data,
      "Updating essay"
    );
  },

  // 5) DELETE /essays/:id - Delete Essay
  delete: async (id: string): Promise<void> => {
    return makeRequest<void>(
      "DELETE",
      `${API_BASE_URL}${API_ENDPOINTS.ESSAYS}/${id}`,
      undefined,
      "Deleting essay"
    );
  },

  // 6) GET /college-applications/:college_application_id/essays - Get Essays for a College Application
  getByCollegeApplication: async (
    collegeApplicationId: string
  ): Promise<Essay[]> => {
    return makeRequest<Essay[]>(
      "GET",
      `${API_BASE_URL}${API_ENDPOINTS.COLLEGE_APPLICATIONS}/${collegeApplicationId}/essays`,
      undefined,
      "Loading essays for college application"
    );
  },
};

export { ApiError };
