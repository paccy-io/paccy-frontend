"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import {
  FaUniversity,
  FaPen,
  FaCalendar,
  FaFile,
  FaTrophy,
  FaCog,
  FaGraduationCap,
  FaUsers,
  FaPlus,
  FaArrowRight,
} from "react-icons/fa";

// Mock user data - in real app this would come from authentication
const mockUser = {
  name: "John Doe",
  email: "john@example.com",
  profileCompletion: 75,
  memberSince: "January 2025",
  applications: 3,
  saved: 8,
  profileViews: 12,
};

// Quick actions data
const quickActions = [
  {
    title: "Add New College",
    description: "Track a new university application",
    icon: <FaUniversity className="w-6 h-6" />,
    link: "/dashboard/colleges",
    color: "from-blue-500 to-blue-600",
  },
  {
    title: "Write Essay",
    description: "Create or edit essay drafts",
    icon: <FaPen className="w-6 h-6" />,
    link: "/dashboard/essays",
    color: "from-purple-500 to-purple-600",
  },
  {
    title: "View Calendar",
    description: "Check upcoming deadlines",
    icon: <FaCalendar className="w-6 h-6" />,
    link: "/dashboard/calendar",
    color: "from-green-500 to-green-600",
  },
  {
    title: "Upload Document",
    description: "Organize your application files",
    icon: <FaFile className="w-6 h-6" />,
    link: "/dashboard/documents",
    color: "from-yellow-500 to-yellow-600",
  },
];

// Dashboard sections
const dashboardSections = [
  {
    title: "College Tracker",
    description: "Manage your university applications",
    icon: <FaUniversity className="w-8 h-8" />,
    link: "/dashboard/colleges",
    stats: "3 Active Applications",
  },
  {
    title: "Essay Manager",
    description: "Write and organize your essays",
    icon: <FaPen className="w-8 h-8" />,
    link: "/dashboard/essays",
    stats: "5 Essays in Progress",
  },
  {
    title: "Calendar & Deadlines",
    description: "Never miss an important date",
    icon: <FaCalendar className="w-8 h-8" />,
    link: "/dashboard/calendar",
    stats: "2 Upcoming Deadlines",
  },
  {
    title: "Document Organizer",
    description: "Keep all your files organized",
    icon: <FaFile className="w-8 h-8" />,
    link: "/dashboard/documents",
    stats: "12 Documents Uploaded",
  },
  {
    title: "Extracurriculars",
    description: "Track your activities and achievements",
    icon: <FaTrophy className="w-8 h-8" />,
    link: "/dashboard/extracurriculars",
    stats: "8 Activities Added",
  },
  {
    title: "Academic Tracker",
    description: "Monitor your academic progress",
    icon: <FaGraduationCap className="w-8 h-8" />,
    link: "/dashboard/academy",
    stats: "GPA 3.85 • 4 Exams",
  },
  {
    title: "Peer Network",
    description: "Connect with fellow students worldwide",
    icon: <FaUsers className="w-8 h-8" />,
    link: "/dashboard/peers",
    stats: "5 Connections • 8 Countries",
  },
  {
    title: "Settings",
    description: "Manage your account and preferences",
    icon: <FaCog className="w-8 h-8" />,
    link: "/dashboard/settings",
    stats: "Profile 75% Complete",
  },
];

export default function Dashboard() {
  const router = useRouter();

  useEffect(() => {
    document.title = "Dashboard | Paccy";
  }, []);

  // In a real app, you'd check authentication here
  useEffect(() => {
    // Mock authentication check - redirect to auth if not logged in
    // For demo purposes, we'll assume user is logged in
  }, []);

  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      <Navbar />

      <div className="max-w-screen-2xl mx-auto px-4 md:px-10 py-8 pt-28">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-[#FEEBD8] mb-2">
            Welcome back, {mockUser.name}! 👋
          </h1>
          <p className="text-[#FEEBD8]/70 text-lg">
            Let's continue building your future together.
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-[#141414] border border-neutral-700/50 rounded-lg p-6 hover:border-[#FEEBD8]/30 transition-colors">
            <div className="text-2xl font-bold text-[#FEEBD8] mb-1">
              {mockUser.applications}
            </div>
            <div className="text-[#FEEBD8]/70 text-sm">Active Applications</div>
          </div>

          <div className="bg-[#141414] border border-neutral-700/50 rounded-lg p-6 hover:border-[#FEEBD8]/30 transition-colors">
            <div className="text-2xl font-bold text-[#FEEBD8] mb-1">
              {mockUser.saved}
            </div>
            <div className="text-[#FEEBD8]/70 text-sm">Saved Universities</div>
          </div>

          <div className="bg-[#141414] border border-neutral-700/50 rounded-lg p-6 hover:border-[#FEEBD8]/30 transition-colors">
            <div className="text-2xl font-bold text-[#FEEBD8] mb-1">
              {mockUser.profileViews}
            </div>
            <div className="text-[#FEEBD8]/70 text-sm">Profile Views</div>
          </div>

          <div className="bg-[#141414] border border-neutral-700/50 rounded-lg p-6 hover:border-[#FEEBD8]/30 transition-colors">
            <div className="text-2xl font-bold text-[#FEEBD8] mb-1">
              {mockUser.profileCompletion}%
            </div>
            <div className="text-[#FEEBD8]/70 text-sm">Profile Complete</div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mb-8">
          <h2 className="text-2xl font-semibold text-[#FEEBD8] mb-4">
            Quick Actions
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {quickActions.map((action, index) => (
              <Link
                key={index}
                href={action.link}
                className="group bg-[#141414] border border-neutral-700/50 rounded-lg p-4 hover:border-[#FEEBD8]/30 transition-all duration-300 hover:shadow-lg"
              >
                <div
                  className={`w-12 h-12 bg-gradient-to-r ${action.color} rounded-lg flex items-center justify-center text-white mb-3 group-hover:scale-110 transition-transform`}
                >
                  {action.icon}
                </div>
                <h3 className="font-semibold text-[#FEEBD8] mb-1">
                  {action.title}
                </h3>
                <p className="text-[#FEEBD8]/70 text-sm">
                  {action.description}
                </p>
              </Link>
            ))}
          </div>
        </div>

        {/* Dashboard Sections */}
        <div className="mb-8">
          <h2 className="text-2xl font-semibold text-[#FEEBD8] mb-6">
            Dashboard Sections
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {dashboardSections.map((section, index) => (
              <Link
                key={index}
                href={section.link}
                className="group bg-[#141414] border border-neutral-700/50 rounded-lg p-6 hover:border-[#FEEBD8]/30 transition-all duration-300 hover:shadow-lg"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="text-[#FEEBD8] group-hover:text-white transition-colors">
                    {section.icon}
                  </div>
                  <FaArrowRight className="text-[#FEEBD8]/40 group-hover:text-[#FEEBD8] group-hover:translate-x-1 transition-all" />
                </div>
                <h3 className="text-xl font-semibold text-[#FEEBD8] mb-2 group-hover:text-white transition-colors">
                  {section.title}
                </h3>
                <p className="text-[#FEEBD8]/70 text-sm mb-3 group-hover:text-[#FEEBD8]/90 transition-colors">
                  {section.description}
                </p>
                <div className="text-xs text-[#FEEBD8]/60 font-medium">
                  {section.stats}
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Profile Completion */}
        <div className="bg-[#141414] border border-neutral-700/50 rounded-lg p-6">
          <h3 className="text-xl font-semibold text-[#FEEBD8] mb-4">
            Complete Your Profile
          </h3>
          <div className="mb-4">
            <div className="flex justify-between text-sm text-[#FEEBD8]/70 mb-2">
              <span>Profile Completion</span>
              <span>{mockUser.profileCompletion}%</span>
            </div>
            <div className="w-full bg-neutral-700 rounded-full h-2">
              <div
                className="bg-gradient-to-r from-[#FEEBD8] to-[#E5D5B7] h-2 rounded-full transition-all duration-300"
                style={{ width: `${mockUser.profileCompletion}%` }}
              ></div>
            </div>
          </div>
          <Link
            href="/dashboard/settings"
            className="inline-block bg-[#FEEBD8] text-[#141414] px-4 py-2 rounded-lg font-medium hover:bg-[#E5D5B7] transition-colors"
          >
            Complete Profile
          </Link>
        </div>
      </div>

      <Footer />
    </div>
  );
}
