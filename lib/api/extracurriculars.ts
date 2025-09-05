import { API_BASE_URL, API_ENDPOINTS } from "../../config/api";
import {
  Extracurricular,
  CreateExtracurricularDTO,
  UpdateExtracurricularDTO,
  ExtracurricularCategory,
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
  console.log(`=== ${method} ${url} ===`);
  console.log("Request context:", context);
  console.log("Request body:", body);

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

    console.log("Response status:", response.status);

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

// Extracurriculars API functions
export const extracurricularsApi = {
  // 1) POST /extracurriculars - Create Extracurricular
  create: async (data: CreateExtracurricularDTO): Promise<Extracurricular> => {
    return makeRequest<Extracurricular>(
      "POST",
      `${API_BASE_URL}${API_ENDPOINTS.EXTRACURRICULARS}`,
      data,
      "Creating extracurricular activity"
    );
  },

  // 2) GET /extracurriculars - Get All Extracurriculars for User
  getAll: async (): Promise<Extracurricular[]> => {
    return makeRequest<Extracurricular[]>(
      "GET",
      `${API_BASE_URL}${API_ENDPOINTS.EXTRACURRICULARS}`,
      undefined,
      "Loading extracurricular activities"
    );
  },

  // 3) GET /extracurriculars/:id - Get Extracurricular by ID
  getById: async (id: string): Promise<Extracurricular> => {
    return makeRequest<Extracurricular>(
      "GET",
      `${API_BASE_URL}${API_ENDPOINTS.EXTRACURRICULARS}/${id}`,
      undefined,
      "Loading extracurricular activity"
    );
  },

  // 4) PUT /extracurriculars/:id - Update Extracurricular
  update: async (
    id: string,
    data: UpdateExtracurricularDTO
  ): Promise<Extracurricular> => {
    return makeRequest<Extracurricular>(
      "PUT",
      `${API_BASE_URL}${API_ENDPOINTS.EXTRACURRICULARS}/${id}`,
      data,
      "Updating extracurricular activity"
    );
  },

  // 5) DELETE /extracurriculars/:id - Delete Extracurricular
  delete: async (id: string): Promise<void> => {
    return makeRequest<void>(
      "DELETE",
      `${API_BASE_URL}${API_ENDPOINTS.EXTRACURRICULARS}/${id}`,
      undefined,
      "Deleting extracurricular activity"
    );
  },

  // 6) GET /extracurriculars/category/:category - Get Extracurriculars by Category
  getByCategory: async (
    category: ExtracurricularCategory
  ): Promise<Extracurricular[]> => {
    return makeRequest<Extracurricular[]>(
      "GET",
      `${API_BASE_URL}${API_ENDPOINTS.EXTRACURRICULARS}/category/${category}`,
      undefined,
      `Loading ${category} extracurricular activities`
    );
  },
};

export { ApiError };
