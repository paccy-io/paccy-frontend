"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  FaUniversity,
  FaPen,
  FaCalendar,
  FaFile,
  FaTrophy,
  FaCog,
  FaGraduationCap,
  FaUsers,
  FaClipboardList,
  FaBars,
  FaTimes,
  FaDollarSign,
} from "react-icons/fa";
import { MdDashboard, MdSchool } from "react-icons/md";

interface NavItem {
  title: string;
  icon: React.ReactNode;
  link: string;
}

interface SidebarProps {
  userData?: {
    name?: string;
    email?: string;
    profileCompletion?: number;
  };
}

const navItems: NavItem[] = [
  {
    title: "Dashboard",
    icon: <MdDashboard className="w-5 h-5" />,
    link: "/dashboard",
  },
  {
    title: "Colleges",
    icon: <MdSchool className="w-5 h-5" />,
    link: "/dashboard/colleges",
  },
  {
    title: "Essays",
    icon: <FaPen className="w-5 h-5" />,
    link: "/dashboard/essays",
  },
  {
    title: "Financial Aid",
    icon: <FaDollarSign className="w-5 h-5" />,
    link: "/dashboard/financial-aid",
  },
  {
    title: "Settings",
    icon: <FaCog className="w-5 h-5" />,
    link: "/dashboard/settings",
  },
];

export default function Sidebar({ userData }: SidebarProps) {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  const isActive = (link: string) => pathname === link;

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed top-20 left-4 z-50 md:hidden bg-[#FEEBD8] text-[#141414] p-2 rounded-lg"
      >
        {isOpen ? (
          <FaTimes className="w-5 h-5" />
        ) : (
          <FaBars className="w-5 h-5" />
        )}
      </button>

      {/* Sidebar */}
      <aside
        className={`fixed left-0 top-0 h-screen w-56 bg-[#0f0f0f] border-r border-[#2a2a2a] pt-6 transition-transform duration-300 z-40 md:translate-x-0 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } overflow-y-auto`}
      >
        <div className="px-4 py-4">
          {/* User Profile */}
          {userData && (
            <div className="flex items-center gap-3 px-2 py-3 mb-6">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                {userData.name?.charAt(0) || "U"}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-white truncate">
                  {userData.name || "User"}
                </p>
                <p className="text-xs text-gray-400 truncate">
                  {userData.email || "Class of 2025"}
                </p>
              </div>
            </div>
          )}

          {/* Main Navigation */}
          <nav className="space-y-1">
            {navItems.map((item) => (
              <Link
                key={item.link}
                href={item.link}
                onClick={() => setIsOpen(false)}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${
                  isActive(item.link)
                    ? "bg-blue-500/10 text-blue-400 border border-blue-500/20"
                    : "text-gray-300 hover:bg-[#1a1a1a] hover:text-white"
                }`}
              >
                {item.icon}
                <span className="font-medium text-sm">{item.title}</span>
              </Link>
            ))}
          </nav>
        </div>
      </aside>

      {/* Overlay for mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
}
