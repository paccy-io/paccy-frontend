import { notFound } from "next/navigation";

/**
 * Server-side utility to enforce environment-based access control
 * Call this at the top of any page component that should be environment-restricted
 */
export function enforceEnvironment(
  requiredEnv: "development" | "production" = "development"
) {
  const currentEnv = process.env.NODE_ENV;

  if (requiredEnv !== currentEnv) {
    // In production trying to access development-only features
    if (currentEnv === "production" && requiredEnv === "development") {
      notFound(); // This will show the 404 page
    }

    // In development trying to access production-only features
    if (currentEnv === "development" && requiredEnv === "production") {
      throw new Error("This feature is only available in production");
    }
  }
}

/**
 * Check if current environment matches required environment
 */
export function isEnvironmentAllowed(
  requiredEnv: "development" | "production" = "development"
): boolean {
  return process.env.NODE_ENV === requiredEnv;
}

/**
 * Get current environment
 */
export function getCurrentEnvironment(): "development" | "production" | "test" {
  return (
    (process.env.NODE_ENV as "development" | "production" | "test") ||
    "development"
  );
}
