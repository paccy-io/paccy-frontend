import { notFound } from "next/navigation";
import { ReactNode } from "react";

interface EnvironmentGuardProps {
  children: ReactNode;
  requiredEnv?: "development" | "production";
  fallback?: ReactNode;
}

/**
 * Server component that protects routes based on environment
 * In production, completely blocks access to development-only features
 */
export default function EnvironmentGuard({
  children,
  requiredEnv = "development",
  fallback,
}: EnvironmentGuardProps) {
  // Server-side environment check
  const currentEnv = process.env.NODE_ENV;

  // If required environment doesn't match current environment
  if (requiredEnv !== currentEnv) {
    if (fallback) {
      return <>{fallback}</>;
    }

    // In production, throw 404 for development-only routes
    if (currentEnv === "production" && requiredEnv === "development") {
      notFound();
    }

    // In development, could show a different message for production-only features
    if (currentEnv === "development" && requiredEnv === "production") {
      return (
        <div className="min-h-screen bg-[#141414] flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-white mb-4">
              Production Only Feature
            </h1>
            <p className="text-white/70">
              This feature is only available in production environment.
            </p>
          </div>
        </div>
      );
    }
  }

  return <>{children}</>;
}
