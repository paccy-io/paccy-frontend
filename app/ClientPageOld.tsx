"use client";

import { useRouter } from "next/navigation";
import { useAuth } from "../components/AuthProvider";
import { useEffect, useState } from "react";
import {
  FaCheckCircle,
  FaCalendarAlt,
  FaDollarSign,
  FaBell,
  FaFileAlt,
  FaDollarSign as FaScholarship,
  FaSearch,
  FaTasks,
  FaUserTie,
  FaChartLine,
  FaHome,
  FaUniversity,
  FaPen,
  FaCalendar,
  FaTrophy,
} from "react-icons/fa";

export default function Home() {
  const router = useRouter();
  const { user } = useAuth();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (user) {
      router.push("/dashboard");
    }
  }, [user, router]);

  if (!mounted || user) {
    return null;
  }

  const features = [
    {
      icon: <FaBell className="text-2xl" />,
      title: "Never Miss a Deadline",
      description:
        "Automated reminders for every application due date so you're never late. Syncs with your Google Calendar.",
    },
    {
      icon: <FaFileAlt className="text-2xl" />,
      title: "Essay Version Control",
      description:
        "Keep all your drafts, feedback, and final versions organized. No more lost Google Docs or messy folders.",
    },
    {
      icon: <FaScholarship className="text-2xl" />,
      title: "Scholarship Matching",
      description:
        "Find financial aid opportunities tailored to your specific profile, GPA, and future career goals.",
    },
    {
      icon: <FaSearch className="text-2xl" />,
      title: "College Search",
      description:
        "Explore thousands of colleges with detailed data on admissions, campus life, and more.",
    },
    {
      icon: <FaTasks className="text-2xl" />,
      title: "Task Manager",
      description:
        "Break down big applications into manageable daily tasks so you avoid the last-minute crunch.",
    },
    {
      icon: <FaUserTie className="text-2xl" />,
      title: "Counselor Connect",
      description:
        "Invite your school counselor or parents to view your progress and leave notes on your applications.",
    },
    {
      icon: <FaChartLine className="text-lg" />,
      title: "Academic Tracking",
      description:
        "Monitor your GPA, test scores, and application competitiveness across all colleges.",
    },
    {
      icon: <FaUsers className="text-lg" />,
      title: "Peer Network",
      description:
        "Connect and collaborate with students worldwide on projects and applications.",
    },
    {
      icon: <FaBrain className="text-lg" />,
      title: "AI Assistance",
      description:
        "Get real-time suggestions and improvements powered by advanced AI technology.",
    },
  ];

  return (
    <div className="bg-[#0a0c10] min-h-screen">
      {/* Navbar */}
      <nav className="border-b border-neutral-800">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                <span className="text-white text-sm font-bold">🎓</span>
              </div>
              <span className="text-xl font-semibold text-white">
                CollegeTracker
              </span>
            </div>
            <div className="hidden md:flex items-center gap-8">
              <button className="text-sm text-neutral-400 hover:text-white transition-colors">
                Features
              </button>
              <button className="text-sm text-neutral-400 hover:text-white transition-colors">
                Pricing
              </button>
              <button className="text-sm text-neutral-400 hover:text-white transition-colors">
                About
              </button>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => router.push("/auth")}
                className="text-sm text-white hover:text-neutral-300 transition-colors px-4 py-2"
              >
                Log In
              </button>
              <button
                onClick={() => router.push("/auth")}
                className="text-sm bg-blue-600 text-white hover:bg-blue-700 transition-all px-5 py-2 rounded-lg font-medium"
              >
                Get Started
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative px-6 lg:px-8 pt-20 pb-32">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <div>
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight">
                Your Dream College is{" "}
                <span className="bg-gradient-to-r from-blue-500 via-purple-500 to-blue-600 bg-clip-text text-transparent">
                  Within Reach
                </span>
              </h1>

              <p className="text-lg md:text-xl text-white/60 mb-4 max-w-2xl mx-auto leading-relaxed">
                From essay management to deadline tracking—everything you need
                to organize your college applications in one powerful platform.
              </p>
              <p className="text-lg md:text-xl text-neutral-400 mb-8 max-w-xl">
                Stop stressing over spreadsheets. Track deadlines, essays, and
                decisions in one intelligent workspace designed to get you
                accepted.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 mb-12">
                <button
                  onClick={() => router.push("/auth")}
                  className="bg-blue-600 text-white px-8 py-3.5 rounded-lg font-medium hover:bg-blue-700 transition-all"
                >
                  Start Tracking F...
                </button>
                <button
                  onClick={() =>
                    document
                      .getElementById("features")
                      ?.scrollIntoView({ behavior: "smooth" })
                  }
                  className="bg-neutral-800 text-white px-8 py-3.5 rounded-lg font-medium hover:bg-neutral-700 transition-all"
                >
                  See How it Wor...
                </button>
              </div>
            </div>

            {/* Right - Laptop Mockup */}
            <div className="relative">
              <div className="relative rounded-xl overflow-hidden shadow-2xl border border-neutral-800">
                {/* Laptop Screen */}
                <div className="bg-[#0a0a0a] p-3">
                  <div className="bg-neutral-900 rounded-t-lg overflow-hidden">
                    {/* Browser Chrome */}
                    <div className="bg-neutral-800 px-3 py-2 flex items-center gap-2 border-b border-neutral-700">
                      <div className="flex gap-1.5">
                        <div className="w-2.5 h-2.5 rounded-full bg-red-500" />
                        <div className="w-2.5 h-2.5 rounded-full bg-yellow-500" />
                        <div className="w-2.5 h-2.5 rounded-full bg-green-500" />
                      </div>
                      <div className="flex-1 bg-neutral-900 rounded px-3 py-1 text-xs text-neutral-500">
                        dashboard.paccy.io
                      </div>
                    </div>
                    {/* Dashboard Preview */}
                    <div className="bg-neutral-900 p-6 h-96">
                      {/* Simple dashboard preview */}
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <div className="text-sm font-semibold text-white">
                            My Applications
                          </div>
                          <div className="text-xs text-neutral-500">
                            8 Total
                          </div>
                        </div>
                        <nav className="space-y-2">
                          {[
                            {
                              id: "dashboard",
                              label: "Dashboard",
                              icon: <FaHome className="text-xs" />,
                            },
                            {
                              id: "colleges",
                              label: "Colleges",
                              icon: <FaUniversity className="text-xs" />,
                            },
                            {
                              id: "essays",
                              label: "Essays",
                              icon: <FaPen className="text-xs" />,
                            },
                            {
                              id: "calendar",
                              label: "Calendar",
                              icon: <FaCalendar className="text-xs" />,
                            },
                            {
                              id: "extracurriculars",
                              label: "Activities",
                              icon: <FaTrophy className="text-xs" />,
                            },
                            {
                              id: "academic",
                              label: "Academic",
                              icon: <FaChartLine className="text-xs" />,
                            },
                          ].map((item) => (
                            <button
                              key={item.id}
                              onClick={() => setActiveDemoPage(item.id)}
                              className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-xs transition-all ${
                                activeDemoPage === item.id
                                  ? "bg-blue-500/10 text-blue-400 border border-blue-500/20"
                                  : "text-white/60 hover:text-white hover:bg-white/5"
                              }`}
                            >
                              {item.icon}
                              <span>{item.label}</span>
                            </button>
                          ))}
                        </nav>
                      </div>
                    </div>

                    {/* Main Content */}
                    <div className="flex-1 overflow-hidden flex flex-col">
                      {/* Mobile Nav */}
                      <div className="md:hidden flex gap-2 p-3 border-b border-neutral-800/50 overflow-x-auto">
                        {[
                          { id: "dashboard", label: "Home" },
                          { id: "colleges", label: "Colleges" },
                          { id: "essays", label: "Essays" },
                          { id: "calendar", label: "Calendar" },
                        ].map((item) => (
                          <button
                            key={item.id}
                            onClick={() => setActiveDemoPage(item.id)}
                            className={`px-3 py-1.5 rounded-lg text-xs whitespace-nowrap transition-all ${
                              activeDemoPage === item.id
                                ? "bg-blue-500/10 text-blue-400 border border-blue-500/20"
                                : "text-white/60 hover:text-white bg-white/5"
                            }`}
                          >
                            {item.label}
                          </button>
                        ))}
                      </div>

                      {/* Page Content */}
                      <div className="flex-1 overflow-y-auto p-4 md:p-6">
                        {/* Dashboard View */}
                        {activeDemoPage === "dashboard" && (
                          <div>
                            <div className="mb-4">
                              <h3 className="text-sm md:text-base font-semibold text-white mb-1">
                                Dashboard Overview
                              </h3>
                              <p className="text-xs text-white/50">
                                Track your college journey
                              </p>
                            </div>

                            {/* Stats Cards */}
                            <div className="grid grid-cols-3 gap-3 md:gap-4 mb-4 md:mb-6">
                              <div className="bg-gradient-to-br from-[#1a1a1a] to-[#141414] border border-neutral-700/30 rounded-xl p-3 md:p-4">
                                <div className="text-[10px] md:text-xs text-white/50 mb-1">
                                  Applications
                                </div>
                                <div className="text-lg md:text-2xl font-bold text-white">
                                  8
                                </div>
                                <div className="text-[9px] md:text-xs text-green-400 mt-1">
                                  ↑ 2 this week
                                </div>
                              </div>
                              <div className="bg-gradient-to-br from-[#1a1a1a] to-[#141414] border border-neutral-700/30 rounded-xl p-3 md:p-4">
                                <div className="text-[10px] md:text-xs text-white/50 mb-1">
                                  Essays
                                </div>
                                <div className="text-lg md:text-2xl font-bold text-white">
                                  12
                                </div>
                                <div className="text-[9px] md:text-xs text-blue-400 mt-1">
                                  3 in progress
                                </div>
                              </div>
                              <div className="bg-gradient-to-br from-[#1a1a1a] to-[#141414] border border-neutral-700/30 rounded-xl p-3 md:p-4">
                                <div className="text-[10px] md:text-xs text-white/50 mb-1">
                                  Deadlines
                                </div>
                                <div className="text-lg md:text-2xl font-bold text-white">
                                  5
                                </div>
                                <div className="text-[9px] md:text-xs text-orange-400 mt-1">
                                  2 upcoming
                                </div>
                              </div>
                            </div>

                            {/* College List */}
                            <div className="space-y-2 md:space-y-3">
                              <div className="bg-gradient-to-br from-[#1a1a1a] to-[#141414] border border-neutral-700/30 rounded-lg p-3 md:p-4 flex items-center gap-3 md:gap-4 hover:border-blue-500/30 transition-colors cursor-pointer">
                                <div className="w-8 h-8 md:w-10 md:h-10 bg-blue-500/10 rounded-lg border border-blue-500/20 flex items-center justify-center flex-shrink-0">
                                  <span className="text-xs md:text-sm">🎓</span>
                                </div>
                                <div className="flex-1 min-w-0">
                                  <div className="text-xs md:text-sm font-semibold text-white truncate">
                                    Stanford University
                                  </div>
                                  <div className="text-[10px] md:text-xs text-white/40">
                                    REA • Deadline: Nov 1
                                  </div>
                                </div>
                                <div className="flex items-center gap-2 flex-shrink-0">
                                  <div className="hidden md:block px-2 py-1 bg-yellow-500/10 border border-yellow-500/20 rounded text-[10px] text-yellow-400">
                                    In Progress
                                  </div>
                                  <div className="w-12 md:w-16 bg-neutral-800/50 rounded-full h-1.5 overflow-hidden">
                                    <div
                                      className="h-full bg-gradient-to-r from-blue-500 to-purple-600"
                                      style={{ width: "65%" }}
                                    />
                                  </div>
                                </div>
                              </div>

                              <div className="bg-gradient-to-br from-[#1a1a1a] to-[#141414] border border-neutral-700/30 rounded-lg p-3 md:p-4 flex items-center gap-3 md:gap-4 hover:border-blue-500/30 transition-colors cursor-pointer">
                                <div className="w-8 h-8 md:w-10 md:h-10 bg-purple-500/10 rounded-lg border border-purple-500/20 flex items-center justify-center flex-shrink-0">
                                  <span className="text-xs md:text-sm">🏛️</span>
                                </div>
                                <div className="flex-1 min-w-0">
                                  <div className="text-xs md:text-sm font-semibold text-white truncate">
                                    MIT
                                  </div>
                                  <div className="text-[10px] md:text-xs text-white/40">
                                    EA • Deadline: Nov 1
                                  </div>
                                </div>
                                <div className="flex items-center gap-2 flex-shrink-0">
                                  <div className="hidden md:block px-2 py-1 bg-green-500/10 border border-green-500/20 rounded text-[10px] text-green-400">
                                    Submitted
                                  </div>
                                  <div className="w-12 md:w-16 bg-neutral-800/50 rounded-full h-1.5 overflow-hidden">
                                    <div
                                      className="h-full bg-green-500"
                                      style={{ width: "100%" }}
                                    />
                                  </div>
                                </div>
                              </div>

                              <div className="bg-gradient-to-br from-[#1a1a1a] to-[#141414] border border-neutral-700/30 rounded-lg p-3 md:p-4 flex items-center gap-3 md:gap-4 hover:border-blue-500/30 transition-colors cursor-pointer">
                                <div className="w-8 h-8 md:w-10 md:h-10 bg-pink-500/10 rounded-lg border border-pink-500/20 flex items-center justify-center flex-shrink-0">
                                  <span className="text-xs md:text-sm">📚</span>
                                </div>
                                <div className="flex-1 min-w-0">
                                  <div className="text-xs md:text-sm font-semibold text-white truncate">
                                    UC Berkeley
                                  </div>
                                  <div className="text-[10px] md:text-xs text-white/40">
                                    RD • Deadline: Nov 30
                                  </div>
                                </div>
                                <div className="flex items-center gap-2 flex-shrink-0">
                                  <div className="hidden md:block px-2 py-1 bg-blue-500/10 border border-blue-500/20 rounded text-[10px] text-blue-400">
                                    Planning
                                  </div>
                                  <div className="w-12 md:w-16 bg-neutral-800/50 rounded-full h-1.5 overflow-hidden">
                                    <div
                                      className="h-full bg-gradient-to-r from-blue-500 to-purple-600"
                                      style={{ width: "30%" }}
                                    />
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        )}

                        {/* Colleges View */}
                        {activeDemoPage === "colleges" && (
                          <div>
                            <div className="mb-4 flex items-center justify-between">
                              <div>
                                <h3 className="text-sm md:text-base font-semibold text-white mb-1">
                                  My Colleges
                                </h3>
                                <p className="text-xs text-white/50">
                                  8 colleges tracked
                                </p>
                              </div>
                            </div>

                            <div className="space-y-3">
                              {[
                                {
                                  name: "Stanford University",
                                  type: "REA",
                                  deadline: "Nov 1",
                                  progress: 65,
                                  status: "In Progress",
                                  color: "red",
                                },
                                {
                                  name: "MIT",
                                  type: "EA",
                                  deadline: "Nov 1",
                                  progress: 100,
                                  status: "Submitted",
                                  color: "green",
                                },
                                {
                                  name: "UC Berkeley",
                                  type: "RD",
                                  deadline: "Nov 30",
                                  progress: 30,
                                  status: "Planning",
                                  color: "blue",
                                },
                                {
                                  name: "Harvard University",
                                  type: "REA",
                                  deadline: "Nov 1",
                                  progress: 45,
                                  status: "In Progress",
                                  color: "red",
                                },
                                {
                                  name: "Princeton",
                                  type: "REA",
                                  deadline: "Nov 1",
                                  progress: 55,
                                  status: "In Progress",
                                  color: "orange",
                                },
                              ].map((college, idx) => (
                                <div
                                  key={idx}
                                  className="bg-gradient-to-br from-[#1a1a1a] to-[#141414] border border-neutral-700/30 rounded-lg p-3 md:p-4 flex items-center gap-3 hover:border-blue-500/30 transition-colors cursor-pointer"
                                >
                                  <div
                                    className={`text-xl bg-${college.color}-500/10 rounded-lg p-2 flex-shrink-0`}
                                  >
                                    🎓
                                  </div>
                                  <div className="flex-1 min-w-0">
                                    <div className="text-xs md:text-sm font-semibold text-white truncate">
                                      {college.name}
                                    </div>
                                    <div className="text-[10px] md:text-xs text-white/40">
                                      {college.type} • Deadline:{" "}
                                      {college.deadline}
                                    </div>
                                  </div>
                                  <div className="flex items-center gap-2 flex-shrink-0">
                                    <div
                                      className={`hidden md:block px-2 py-1 bg-${college.color}-500/10 border border-${college.color}-500/20 rounded text-[10px] text-${college.color}-400`}
                                    >
                                      {college.status}
                                    </div>
                                    <div className="w-12 md:w-16 bg-neutral-800/50 rounded-full h-1.5 overflow-hidden">
                                      <div
                                        className={`h-full bg-gradient-to-r from-${college.color}-500 to-purple-600`}
                                        style={{
                                          width: `${college.progress}%`,
                                        }}
                                      />
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Essays View */}
                        {activeDemoPage === "essays" && (
                          <div>
                            <div className="mb-4">
                              <h3 className="text-sm md:text-base font-semibold text-white mb-1">
                                My Essays
                              </h3>
                              <p className="text-xs text-white/50">
                                12 essays • 3 in progress
                              </p>
                            </div>

                            <div className="space-y-3">
                              {[
                                {
                                  title: "Common App Personal Statement",
                                  college: "Common Application",
                                  words: "487/650",
                                  aiScore: 92,
                                  status: "Draft",
                                  color: "blue",
                                },
                                {
                                  title: "Why Stanford?",
                                  college: "Stanford University",
                                  words: "245/250",
                                  aiScore: 88,
                                  status: "Review",
                                  color: "purple",
                                },
                                {
                                  title: "Community Essay",
                                  college: "MIT",
                                  words: "650/650",
                                  aiScore: 95,
                                  status: "Complete",
                                  color: "green",
                                },
                                {
                                  title: "Intellectual Vitality",
                                  college: "Stanford University",
                                  words: "123/250",
                                  aiScore: 75,
                                  status: "Draft",
                                  color: "blue",
                                },
                                {
                                  title: "Why Major?",
                                  college: "UC Berkeley",
                                  words: "0/350",
                                  aiScore: 0,
                                  status: "Not Started",
                                  color: "gray",
                                },
                              ].map((essay, idx) => (
                                <div
                                  key={idx}
                                  className="bg-gradient-to-br from-[#1a1a1a] to-[#141414] border border-neutral-700/30 rounded-lg p-3 md:p-4 hover:border-purple-500/30 transition-colors cursor-pointer"
                                >
                                  <div className="flex items-start gap-3">
                                    <div className="text-xl bg-purple-500/10 rounded-lg p-2 flex-shrink-0">
                                      📝
                                    </div>
                                    <div className="flex-1 min-w-0">
                                      <div className="text-xs md:text-sm font-semibold text-white mb-1">
                                        {essay.title}
                                      </div>
                                      <div className="text-[10px] md:text-xs text-white/40 mb-2">
                                        {essay.college}
                                      </div>
                                      <div className="flex items-center gap-2 flex-wrap">
                                        <div className="text-[10px] text-white/50">
                                          {essay.words} words
                                        </div>
                                        {essay.aiScore > 0 && (
                                          <div className="flex items-center gap-1">
                                            <span className="text-[10px] text-white/50">
                                              AI Score:
                                            </span>
                                            <span
                                              className={`text-[10px] font-semibold ${
                                                essay.aiScore >= 90
                                                  ? "text-green-400"
                                                  : essay.aiScore >= 80
                                                  ? "text-blue-400"
                                                  : "text-orange-400"
                                              }`}
                                            >
                                              {essay.aiScore}/100
                                            </span>
                                          </div>
                                        )}
                                      </div>
                                    </div>
                                    <div
                                      className={`px-2 py-1 bg-${essay.color}-500/10 border border-${essay.color}-500/20 rounded text-[10px] text-${essay.color}-400 flex-shrink-0`}
                                    >
                                      {essay.status}
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Calendar View */}
                        {activeDemoPage === "calendar" && (
                          <div>
                            <div className="mb-4">
                              <h3 className="text-sm md:text-base font-semibold text-white mb-1">
                                November 2024
                              </h3>
                              <p className="text-xs text-white/50">
                                5 deadlines this month
                              </p>
                            </div>

                            {/* Mini Calendar */}
                            <div className="bg-gradient-to-br from-[#1a1a1a] to-[#141414] border border-neutral-700/30 rounded-lg p-3 md:p-4 mb-4">
                              <div className="grid grid-cols-7 gap-1 mb-2">
                                {["S", "M", "T", "W", "T", "F", "S"].map(
                                  (day, idx) => (
                                    <div
                                      key={idx}
                                      className="text-[10px] text-white/40 text-center"
                                    >
                                      {day}
                                    </div>
                                  )
                                )}
                              </div>
                              <div className="grid grid-cols-7 gap-1">
                                {Array.from(
                                  { length: 30 },
                                  (_, i) => i + 1
                                ).map((day) => (
                                  <div
                                    key={day}
                                    className={`aspect-square flex items-center justify-center text-[10px] rounded ${
                                      day === 1 || day === 15 || day === 30
                                        ? "bg-red-500/20 text-red-400 border border-red-500/30"
                                        : "text-white/60 hover:bg-white/5"
                                    }`}
                                  >
                                    {day}
                                  </div>
                                ))}
                              </div>
                            </div>

                            {/* Upcoming Deadlines */}
                            <div className="space-y-2">
                              {[
                                {
                                  date: "Nov 1",
                                  college: "Stanford REA",
                                  type: "Application",
                                  urgent: true,
                                },
                                {
                                  date: "Nov 1",
                                  college: "MIT EA",
                                  type: "Application",
                                  urgent: true,
                                },
                                {
                                  date: "Nov 15",
                                  college: "UC System",
                                  type: "Application",
                                  urgent: false,
                                },
                                {
                                  date: "Nov 30",
                                  college: "UC Berkeley",
                                  type: "Supplements",
                                  urgent: false,
                                },
                              ].map((deadline, idx) => (
                                <div
                                  key={idx}
                                  className={`bg-gradient-to-br from-[#1a1a1a] to-[#141414] border ${
                                    deadline.urgent
                                      ? "border-red-500/30"
                                      : "border-neutral-700/30"
                                  } rounded-lg p-3 flex items-center gap-3`}
                                >
                                  <div
                                    className={`text-sm font-bold ${
                                      deadline.urgent
                                        ? "text-red-400"
                                        : "text-blue-400"
                                    } flex-shrink-0 w-12 text-center`}
                                  >
                                    {deadline.date}
                                  </div>
                                  <div className="flex-1 min-w-0">
                                    <div className="text-xs font-semibold text-white">
                                      {deadline.college}
                                    </div>
                                    <div className="text-[10px] text-white/40">
                                      {deadline.type}
                                    </div>
                                  </div>
                                  {deadline.urgent && (
                                    <div className="px-2 py-1 bg-red-500/10 border border-red-500/20 rounded text-[10px] text-red-400">
                                      Urgent
                                    </div>
                                  )}
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Extracurriculars View */}
                        {activeDemoPage === "extracurriculars" && (
                          <div>
                            <div className="mb-4">
                              <h3 className="text-sm md:text-base font-semibold text-white mb-1">
                                Activities
                              </h3>
                              <p className="text-xs text-white/50">
                                10 activities tracked
                              </p>
                            </div>

                            <div className="space-y-3">
                              {[
                                {
                                  title: "Student Body President",
                                  category: "Leadership",
                                  hours: "15 hrs/week",
                                  years: "11-12",
                                  color: "blue",
                                },
                                {
                                  title: "Robotics Team Captain",
                                  category: "STEM",
                                  hours: "12 hrs/week",
                                  years: "9-12",
                                  color: "purple",
                                },
                                {
                                  title: "Volunteer Tutor",
                                  category: "Community Service",
                                  hours: "5 hrs/week",
                                  years: "10-12",
                                  color: "green",
                                },
                                {
                                  title: "Varsity Soccer",
                                  category: "Athletics",
                                  hours: "20 hrs/week",
                                  years: "9-12",
                                  color: "orange",
                                },
                              ].map((activity, idx) => (
                                <div
                                  key={idx}
                                  className="bg-gradient-to-br from-[#1a1a1a] to-[#141414] border border-neutral-700/30 rounded-lg p-3 md:p-4 hover:border-green-500/30 transition-colors cursor-pointer"
                                >
                                  <div className="flex items-start gap-3">
                                    <div
                                      className={`text-xl bg-${activity.color}-500/10 rounded-lg p-2 flex-shrink-0`}
                                    >
                                      🏆
                                    </div>
                                    <div className="flex-1 min-w-0">
                                      <div className="text-xs md:text-sm font-semibold text-white mb-1">
                                        {activity.title}
                                      </div>
                                      <div className="text-[10px] md:text-xs text-white/40 mb-2">
                                        {activity.category}
                                      </div>
                                      <div className="flex items-center gap-2 flex-wrap">
                                        <div className="px-2 py-0.5 bg-neutral-800/50 border border-neutral-700/30 rounded text-[10px] text-white/60">
                                          {activity.hours}
                                        </div>
                                        <div className="px-2 py-0.5 bg-neutral-800/50 border border-neutral-700/30 rounded text-[10px] text-white/60">
                                          Grades {activity.years}
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Academic View */}
                        {activeDemoPage === "academic" && (
                          <div>
                            <div className="mb-4">
                              <h3 className="text-sm md:text-base font-semibold text-white mb-1">
                                Academic Profile
                              </h3>
                              <p className="text-xs text-white/50">
                                GPA, test scores, and coursework
                              </p>
                            </div>

                            {/* GPA Card */}
                            <div className="bg-gradient-to-br from-[#1a1a1a] to-[#141414] border border-neutral-700/30 rounded-lg p-4 mb-4">
                              <div className="flex items-center justify-between mb-3">
                                <div>
                                  <div className="text-xs text-white/50 mb-1">
                                    Cumulative GPA
                                  </div>
                                  <div className="text-2xl font-bold text-white">
                                    3.92
                                  </div>
                                </div>
                                <div className="text-3xl">📊</div>
                              </div>
                              <div className="h-24 flex items-end gap-1">
                                {[3.8, 3.85, 3.9, 3.88, 3.95, 3.92].map(
                                  (gpa, idx) => (
                                    <div
                                      key={idx}
                                      className="flex-1 bg-gradient-to-t from-blue-500 to-purple-600 rounded-t"
                                      style={{
                                        height: `${(gpa / 4.0) * 100}%`,
                                      }}
                                    />
                                  )
                                )}
                              </div>
                            </div>

                            {/* Test Scores */}
                            <div className="grid grid-cols-2 gap-3 mb-4">
                              <div className="bg-gradient-to-br from-[#1a1a1a] to-[#141414] border border-neutral-700/30 rounded-lg p-3">
                                <div className="text-xs text-white/50 mb-1">
                                  SAT
                                </div>
                                <div className="text-xl font-bold text-white">
                                  1520
                                </div>
                                <div className="text-[10px] text-green-400 mt-1">
                                  98th percentile
                                </div>
                              </div>
                              <div className="bg-gradient-to-br from-[#1a1a1a] to-[#141414] border border-neutral-700/30 rounded-lg p-3">
                                <div className="text-xs text-white/50 mb-1">
                                  ACT
                                </div>
                                <div className="text-xl font-bold text-white">
                                  34
                                </div>
                                <div className="text-[10px] text-green-400 mt-1">
                                  99th percentile
                                </div>
                              </div>
                            </div>

                            {/* AP Exams */}
                            <div className="bg-gradient-to-br from-[#1a1a1a] to-[#141414] border border-neutral-700/30 rounded-lg p-4">
                              <div className="text-xs text-white/50 mb-3">
                                AP Exam Scores
                              </div>
                              <div className="space-y-2">
                                {[
                                  { subject: "AP Calculus BC", score: 5 },
                                  { subject: "AP Physics C", score: 5 },
                                  { subject: "AP English Lit", score: 4 },
                                  { subject: "AP US History", score: 5 },
                                ].map((exam, idx) => (
                                  <div
                                    key={idx}
                                    className="flex items-center justify-between"
                                  >
                                    <div className="text-[10px] text-white/70">
                                      {exam.subject}
                                    </div>
                                    <div
                                      className={`text-xs font-bold ${
                                        exam.score === 5
                                          ? "text-green-400"
                                          : "text-blue-400"
                                      }`}
                                    >
                                      {exam.score}/5
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section id="features" className="relative py-32 px-6 lg:px-8">
        <div className="max-w-[1200px] mx-auto relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4 tracking-tight">
              Everything you need,
              <br />
              <span className="text-white/40">nothing you don't</span>
            </h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, idx) => (
              <div
                key={idx}
                className="group relative bg-white/[0.02] hover:bg-white/[0.05] border border-white/10 rounded-2xl p-6 transition-all duration-300 hover:border-white/20"
              >
                <div className="mb-4 w-10 h-10 bg-gradient-to-br from-blue-500/10 to-purple-600/10 border border-blue-500/20 rounded-xl flex items-center justify-center text-blue-400 group-hover:border-blue-500/40 transition-colors">
                  {feature.icon}
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">
                  {feature.title}
                </h3>
                <p className="text-white/50 text-sm leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative py-32 px-6 lg:px-8">
        <div className="max-w-[800px] mx-auto relative z-10">
          <div className="relative bg-gradient-to-br from-white/[0.07] to-white/[0.02] border border-white/10 rounded-3xl p-12 md:p-16 text-center overflow-hidden backdrop-blur-xl">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-purple-500/5 to-transparent" />
            <div className="relative z-10">
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4 tracking-tight">
                Ready to take control?
              </h2>
              <p className="text-lg text-white/60 mb-8 max-w-md mx-auto">
                Join thousands of students organizing their college journey with
                Paccy.
              </p>
              <button
                onClick={() => router.push("/auth")}
                className="inline-flex items-center gap-2 bg-white text-black px-6 py-3 rounded-xl font-medium hover:bg-white/90 transition-all shadow-lg"
              >
                Start for free
                <FaArrowRight className="text-sm" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/5 py-12 px-6 lg:px-8">
        <div className="max-w-[1400px] mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <span className="text-sm text-white/40">
              © 2024 Paccy. All rights reserved.
            </span>
            <div className="flex items-center gap-8">
              <a
                href="/privacy"
                className="text-sm text-white/40 hover:text-white/60 transition-colors"
              >
                Privacy
              </a>
              <a
                href="/terms"
                className="text-sm text-white/40 hover:text-white/60 transition-colors"
              >
                Terms
              </a>
              <a
                href="/contact"
                className="text-sm text-white/40 hover:text-white/60 transition-colors"
              >
                Contact
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
