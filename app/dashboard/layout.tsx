"use client";

import { useState } from "react";
import DashboardSidebar from "../../components/Dashboard/DashboardSidebar";
import { ThemeProvider, useTheme } from "../../components/ThemeProvider";

function DashboardLayoutContent({ children }: { children: React.ReactNode }) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const { theme } = useTheme();

  return (
    <div
      className={`flex min-h-screen transition-colors duration-300 ${
        theme === "dark" ? "bg-[#0a0a0a]" : "bg-gray-50"
      }`}
    >
      <DashboardSidebar
        collapsed={sidebarCollapsed}
        onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
      />
      <main
        className={`flex-1 transition-all duration-300 ${
          sidebarCollapsed ? "lg:ml-20" : "lg:ml-72"
        }`}
      >
        {children}
      </main>
    </div>
  );
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ThemeProvider>
      <DashboardLayoutContent>{children}</DashboardLayoutContent>
    </ThemeProvider>
  );
}
