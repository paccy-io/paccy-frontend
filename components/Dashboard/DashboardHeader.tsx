"use client";

import { useAuth } from "../AuthProvider";
import Link from "next/link";
import { FaUser, FaSignOutAlt, FaCog, FaBell, FaPlus } from "react-icons/fa";
import { useState } from "react";

interface DashboardHeaderProps {
  userData?: {
    name?: string;
    email?: string;
    profileCompletion?: number;
    avatarUrl?: string;
  };
}

export default function DashboardHeader({ userData }: DashboardHeaderProps) {
  const { user, logout } = useAuth();
  const [showUserMenu, setShowUserMenu] = useState(false);

  const handleLogout = async () => {
    await logout();
  };

  return (
    <header className="fixed top-0 right-0 left-0 md:left-56 h-16 bg-[#0f0f0f] border-b border-[#2a2a2a] flex items-center justify-between px-6 z-40">
      {/* Left side - Page title */}
      <div className="hidden md:block">
        <h1 className="text-xl font-bold text-white">
          Welcome back, {user?.first_name || "there"} 👋
        </h1>
      </div>

      {/* Right side - Action button */}
      <div className="flex items-center gap-4 ml-auto">
        <Link
          href="/dashboard/colleges"
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium text-sm flex items-center gap-2 transition-colors"
        >
          <FaPlus className="w-4 h-4" />
          Add College
        </Link>
      </div>
    </header>
  );
}
