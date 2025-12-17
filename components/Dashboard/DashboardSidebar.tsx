"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { useAuth } from "../AuthProvider";
import { useTheme } from "../ThemeProvider";
import { generateAvatarUrl } from "../../lib/avatar";
import {
  FaHome,
  FaUniversity,
  FaPen,
  FaCalendar,
  FaFile,
  FaTrophy,
  FaGraduationCap,
  FaUsers,
  FaClipboardList,
  FaCog,
  FaBars,
  FaTimes,
  FaChevronLeft,
  FaChevronRight,
  FaSun,
  FaMoon,
} from "react-icons/fa";

const menuItems = [
  {
    label: "Overview",
    icon: <FaHome className="w-5 h-5" />,
    href: "/dashboard",
    exact: true,
  },
  {
    label: "Colleges",
    icon: <FaUniversity className="w-5 h-5" />,
    href: "/dashboard/colleges",
  },
  {
    label: "Essays",
    icon: <FaPen className="w-5 h-5" />,
    href: "/dashboard/essays",
  },
  {
    label: "Calendar",
    icon: <FaCalendar className="w-5 h-5" />,
    href: "/dashboard/calendar",
  },
  {
    label: "Extracurriculars",
    icon: <FaTrophy className="w-5 h-5" />,
    href: "/dashboard/extracurriculars",
  },
  {
    label: "Academic",
    icon: <FaGraduationCap className="w-5 h-5" />,
    href: "/dashboard/academy",
  },
  {
    label: "Documents",
    icon: <FaFile className="w-5 h-5" />,
    href: "/dashboard/documents",
    badge: "Demo",
  },
  {
    label: "Peers",
    icon: <FaUsers className="w-5 h-5" />,
    href: "/dashboard/peers",
    badge: "Demo",
  },
  {
    label: "Templates",
    icon: <FaClipboardList className="w-5 h-5" />,
    href: "/dashboard/templates",
    badge: "New",
  },
  {
    label: "Settings",
    icon: <FaCog className="w-5 h-5" />,
    href: "/dashboard/settings",
  },
];

interface DashboardSidebarProps {
  collapsed?: boolean;
  onToggleCollapse?: () => void;
}

export default function DashboardSidebar({
  collapsed = false,
  onToggleCollapse,
}: DashboardSidebarProps) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const { user } = useAuth();
  const { theme, toggleTheme } = useTheme();

  const isActive = (href: string, exact?: boolean) => {
    if (exact) {
      return pathname === href;
    }
    return pathname?.startsWith(href);
  };

  // Get user display name
  const getUserName = () => {
    if (user?.first_name && user?.last_name) {
      return `${user.first_name} ${user.last_name}`;
    }
    if (user?.name) {
      return user.name;
    }
    if (user?.username) {
      return user.username;
    }
    return "User";
  };

  // Get user avatar
  const getUserAvatar = () => {
    if (user?.profile?.avatar_url) {
      return user.profile.avatar_url;
    }
    if (user?.avatar) {
      return user.avatar;
    }
    return generateAvatarUrl(getUserName());
  };

  // Calculate class year from graduation_year
  const getClassYear = () => {
    const graduationYear = user?.profile?.graduation_year;
    if (graduationYear) {
      return `Class of ${graduationYear}`;
    }
    return null;
  };

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={() => setMobileOpen(!mobileOpen)}
        className={`lg:hidden fixed top-4 left-4 z-50 rounded-lg p-3 border transition-colors ${
          theme === "dark"
            ? "bg-[#141414] border-neutral-700/50 text-white hover:border-white/30"
            : "bg-white border-gray-200 text-gray-900 hover:border-gray-300 shadow-md"
        }`}
      >
        {mobileOpen ? (
          <FaTimes className="w-5 h-5" />
        ) : (
          <FaBars className="w-5 h-5" />
        )}
      </button>

      {/* Mobile Overlay */}
      {mobileOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed left-0 top-0 h-screen border-r z-40 transition-all duration-300 ${
          theme === "dark"
            ? "bg-[#0a0a0a] border-neutral-800"
            : "bg-white border-gray-200"
        } ${collapsed ? "w-20" : "w-72"} ${
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0 flex flex-col`}
      >
        {/* Logo Section */}
        <div
          className={`h-20 flex items-center justify-between px-6 border-b ${
            theme === "dark" ? "border-neutral-800" : "border-gray-200"
          }`}
        >
          {!collapsed && (
            <Link href="/dashboard" className="group flex items-center">
              <div className="relative">
                <span
                  className={`text-3xl font-bold font-climate-crisis ${
                    theme === "dark" ? "text-white" : "text-gray-900"
                  }`}
                >
                  paccy
                </span>
                <div
                  className={`absolute -bottom-1 left-0 w-0 h-0.5 group-hover:w-full transition-all duration-300 ${
                    theme === "dark" ? "bg-white" : "bg-gray-900"
                  }`}
                ></div>
              </div>
            </Link>
          )}
          {collapsed && (
            <Link
              href="/dashboard"
              className="w-full flex justify-center group"
            >
              <span
                className={`text-2xl font-bold font-climate-crisis ${
                  theme === "dark" ? "text-white" : "text-gray-900"
                }`}
              >
                p
              </span>
            </Link>
          )}
        </div>

        {/* User Card */}
        {user && !collapsed && (
          <div
            className={`mx-4 mt-4 mb-2 p-3 border rounded-lg ${
              theme === "dark"
                ? "bg-white/5 border-neutral-700/50"
                : "bg-gray-50 border-gray-200"
            }`}
          >
            <div className="flex items-center gap-3">
              <img
                src={getUserAvatar()}
                alt={getUserName()}
                className="w-10 h-10 rounded-full bg-white/10 border border-neutral-700/50"
                onError={(e) => {
                  e.currentTarget.src = generateAvatarUrl(getUserName());
                }}
              />
              <div className="flex-1 min-w-0">
                <p
                  className={`text-sm font-semibold truncate ${
                    theme === "dark" ? "text-white" : "text-gray-900"
                  }`}
                >
                  {getUserName()}
                </p>
                {getClassYear() && (
                  <p
                    className={`text-xs ${
                      theme === "dark" ? "text-white/60" : "text-gray-600"
                    }`}
                  >
                    {getClassYear()}
                  </p>
                )}
              </div>
            </div>
          </div>
        )}

        {user && collapsed && (
          <div className="mx-2 mt-4 mb-2 flex justify-center">
            <img
              src={getUserAvatar()}
              alt={getUserName()}
              title={`${getUserName()}${
                getClassYear() ? ` - ${getClassYear()}` : ""
              }`}
              className={`w-10 h-10 rounded-full border ${
                theme === "dark"
                  ? "bg-white/10 border-neutral-700/50"
                  : "bg-gray-100 border-gray-200"
              }`}
              onError={(e) => {
                e.currentTarget.src = generateAvatarUrl(getUserName());
              }}
            />
          </div>
        )}

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto py-6 px-3">
          <ul className="space-y-1">
            {menuItems.map((item) => {
              const active = isActive(item.href, item.exact);
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    onClick={() => setMobileOpen(false)}
                    className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all group ${
                      active
                        ? theme === "dark"
                          ? "bg-white/10 text-white border border-white/20"
                          : "bg-blue-50 text-blue-600 border border-blue-200"
                        : theme === "dark"
                        ? "text-white/70 hover:bg-[#141414] hover:text-white"
                        : "text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                    } ${collapsed ? "justify-center" : ""}`}
                    title={collapsed ? item.label : undefined}
                  >
                    <span
                      className={
                        active
                          ? theme === "dark"
                            ? "text-white"
                            : "text-blue-600"
                          : theme === "dark"
                          ? "text-white/70 group-hover:text-white"
                          : "text-gray-700 group-hover:text-gray-900"
                      }
                    >
                      {item.icon}
                    </span>
                    {!collapsed && (
                      <>
                        <span className="flex-1 font-medium">{item.label}</span>
                        {item.badge && (
                          <span
                            className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                              item.badge === "New"
                                ? "bg-green-500/20 text-green-300 border border-green-500/30"
                                : "bg-amber-500/20 text-amber-300 border border-amber-500/30"
                            }`}
                          >
                            {item.badge}
                          </span>
                        )}
                      </>
                    )}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Theme Toggle */}
        <div
          className={`border-t p-4 ${
            theme === "dark" ? "border-neutral-800" : "border-gray-200"
          }`}
        >
          <button
            onClick={toggleTheme}
            className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg transition-colors ${
              theme === "dark"
                ? "text-white/70 hover:text-white hover:bg-[#141414]"
                : "text-gray-700 hover:text-gray-900 hover:bg-gray-100"
            }`}
            title={
              theme === "dark" ? "Switch to light mode" : "Switch to dark mode"
            }
          >
            {theme === "dark" ? (
              <FaSun className="w-5 h-5" />
            ) : (
              <FaMoon className="w-5 h-5" />
            )}
            {!collapsed && (
              <span className="text-sm font-medium">
                {theme === "dark" ? "Light Mode" : "Dark Mode"}
              </span>
            )}
          </button>
        </div>

        {/* Collapse Toggle (Desktop Only) */}
        <div
          className={`hidden lg:block border-t p-4 ${
            theme === "dark" ? "border-neutral-800" : "border-gray-200"
          }`}
        >
          <button
            onClick={onToggleCollapse}
            className={`w-full flex items-center justify-center gap-2 px-4 py-2 rounded-lg transition-colors ${
              theme === "dark"
                ? "text-white/70 hover:text-white hover:bg-[#141414]"
                : "text-gray-700 hover:text-gray-900 hover:bg-gray-100"
            }`}
            title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {collapsed ? (
              <FaChevronRight className="w-4 h-4" />
            ) : (
              <>
                <FaChevronLeft className="w-4 h-4" />
                <span className="text-sm font-medium">Collapse</span>
              </>
            )}
          </button>
        </div>
      </aside>
    </>
  );
}
