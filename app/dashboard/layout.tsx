"use client";

import EnvironmentGuard from "../../components/EnvironmentGuard";
import ProtectedRoute from "../../components/ProtectedRoute";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Dashboard is now public - no environment or authentication protection
  return <>{children}</>;
}
