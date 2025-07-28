"use client";

import ProtectedRoute from "../../components/ProtectedRoute";

interface DashboardContentProps {
  children: React.ReactNode;
}

export default function DashboardContent({ children }: DashboardContentProps) {
  return <ProtectedRoute>{children}</ProtectedRoute>;
}
