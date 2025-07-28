"use client";

import EnvironmentGuard from "../../components/EnvironmentGuard";
import ProtectedRoute from "../../components/ProtectedRoute";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <EnvironmentGuard requiredEnv="development">
      <ProtectedRoute>{children}</ProtectedRoute>
    </EnvironmentGuard>
  );
}
