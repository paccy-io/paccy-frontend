"use client";

import Sidebar from "./Sidebar";
import DashboardHeader from "./DashboardHeader";

interface DashboardLayoutProps {
  children: React.ReactNode;
  userData?: {
    name?: string;
    email?: string;
    profileCompletion?: number;
    avatarUrl?: string;
  };
}

export default function DashboardLayout({
  children,
  userData,
}: DashboardLayoutProps) {
  return (
    <div className="flex min-h-screen bg-[#0a0a0a]">
      {/* Sidebar */}
      <Sidebar userData={userData} />

      {/* Main Content */}
      <div className="flex-1 md:ml-56">
        {/* Header */}
        <DashboardHeader userData={userData} />

        {/* Page Content */}
        <main className="pt-20 p-6 md:p-8">{children}</main>
      </div>
    </div>
  );
}
