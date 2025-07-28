"use client";

import ProtectedRoute from "./ProtectedRoute";

interface DashboardLayoutClientProps {
  children: React.ReactNode;
}

export default function DashboardLayoutClient({
  children,
}: DashboardLayoutClientProps) {
  return <ProtectedRoute>{children}</ProtectedRoute>;
}
