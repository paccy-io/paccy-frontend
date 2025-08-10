"use client";

import ProtectedRoute from "../../components/ProtectedRoute";

interface DashboardContentProps {
  children: React.ReactNode;
}

export default function DashboardContent({ children }: DashboardContentProps) {
  // Dashboard is now public - no authentication protection
  return <>{children}</>;
}
