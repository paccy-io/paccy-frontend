// Global error notification utility
// This allows API functions to show user-friendly error messages

type NotificationCallback = (message: string, duration?: number) => void;

let globalErrorCallback: NotificationCallback | null = null;
let globalSuccessCallback: NotificationCallback | null = null;

// Set the global notification callbacks (called once from a component that has useToast)
export const setGlobalNotificationCallbacks = (
  errorCallback: NotificationCallback,
  successCallback: NotificationCallback
) => {
  globalErrorCallback = errorCallback;
  globalSuccessCallback = successCallback;
};

// Show user-friendly error notification
export const showApiError = (error: unknown, context?: string) => {
  let baseMessage = "An unexpected error occurred";
  let errorDetails = "";

  if (error instanceof Error) {
    // Extract the actual error message for user understanding
    errorDetails = error.message;

    // Check for common error types and provide user-friendly base messages
    if (error.message.includes("fetch") || error.message.includes("Network")) {
      baseMessage =
        "Network error. Please check your connection and try again.";
    } else if (
      error.message.includes("401") ||
      error.message.includes("authentication") ||
      error.message.includes("Unauthorized")
    ) {
      baseMessage = "Authentication failed. Please log in again.";
    } else if (
      error.message.includes("403") ||
      error.message.includes("forbidden") ||
      error.message.includes("Forbidden")
    ) {
      baseMessage = "You don't have permission to perform this action.";
    } else if (
      error.message.includes("404") ||
      error.message.includes("not found") ||
      error.message.includes("Not Found")
    ) {
      baseMessage = "The requested resource was not found.";
    } else if (
      error.message.includes("500") ||
      error.message.includes("internal server") ||
      error.message.includes("Internal Server Error")
    ) {
      baseMessage = "Server error. Please try again later.";
    } else if (error.message.includes("timeout")) {
      baseMessage = "Request timed out. Please try again.";
    } else if (
      error.message.includes("validation") ||
      error.message.includes("Invalid")
    ) {
      baseMessage = "Invalid data provided.";
    } else {
      // For other errors, use the error message as the base if it's reasonably short
      if (error.message.length < 80 && !error.message.includes("HTTP")) {
        baseMessage = error.message;
        errorDetails = ""; // Don't duplicate the message
      } else {
        baseMessage = "An error occurred while processing your request.";
      }
    }
  }

  // Construct the final message
  let finalMessage = baseMessage;

  // Add context if provided
  if (context) {
    finalMessage = `${context}: ${baseMessage}`;
  }

  // Add error details if they provide additional useful information
  if (
    errorDetails &&
    errorDetails !== baseMessage &&
    errorDetails.length < 150
  ) {
    // Clean up technical prefixes from error details
    let cleanDetails = errorDetails
      .replace(/^HTTP \d+:\s*/i, "")
      .replace(/^Error:\s*/i, "")
      .replace(/^API Error:\s*/i, "");

    if (cleanDetails && cleanDetails !== baseMessage) {
      finalMessage += ` (${cleanDetails})`;
    }
  }

  // Show the notification if callback is available
  if (globalErrorCallback) {
    globalErrorCallback(finalMessage, 8000); // Show error for 8 seconds to allow reading details
  } else {
    // Fallback to console if no notification system is available
    console.error("API Error:", finalMessage, error);
  }
};

// Show success notification
export const showApiSuccess = (message: string) => {
  if (globalSuccessCallback) {
    globalSuccessCallback(message, 4000); // Show success for 4 seconds
  } else {
    console.log("API Success:", message);
  }
};

// Enhanced error logging for development
export const logApiError = (
  error: unknown,
  context?: string,
  requestDetails?: any
) => {
  if (process.env.NODE_ENV === "development") {
    console.group(`🚨 API Error${context ? ` - ${context}` : ""}`);
    console.error("Error:", error);
    if (requestDetails) {
      console.log("Request details:", requestDetails);
    }
    console.groupEnd();
  }
};
