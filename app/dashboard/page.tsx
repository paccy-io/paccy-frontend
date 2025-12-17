"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "../../components/AuthProvider";
import { useTheme } from "../../components/ThemeProvider";
import { collegeApplicationsApi } from "../../lib/api/college-applications";
import { essaysApi } from "../../lib/api/essays";
import { extracurricularsApi } from "../../lib/api/extracurriculars";
import { academicApi } from "../../lib/api/academic";
import { calendarApi } from "../../lib/api/calendar";
import { templatesApi } from "../../lib/api/templates";
import {
  Essay,
  CollegeApplication,
  EssayStatus,
  Extracurricular,
  CalendarEvent,
} from "../../lib/types";
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
  FaClipboardList,
  FaCheckCircle,
  FaExclamationTriangle,
  FaSpinner,
  FaChevronRight,
} from "react-icons/fa";
import { FaClock } from "react-icons/fa6";
import StatsCard from "../../components/Dashboard/StatsCard";

// Quick actions - static UI data (not backend data)
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
    title: "Import Template",
    description: "Use pre-built university checklists",
    icon: <FaClipboardList className="w-6 h-6" />,
    link: "/dashboard/templates",
    color: "from-indigo-500 to-indigo-600",
  },
];

export default function Dashboard() {
  const router = useRouter();
  const { isAuthenticated, user, loading, verifyTokenAndFetchUser } = useAuth();
  const { theme } = useTheme();

  // State for real data from backend
  const [applications, setApplications] = useState<CollegeApplication[]>([]);
  const [essays, setEssays] = useState<Essay[]>([]);
  const [extracurriculars, setExtracurriculars] = useState<Extracurricular[]>(
    []
  );
  const [calendarEvents, setCalendarEvents] = useState<CalendarEvent[]>([]);
  const [academicData, setAcademicData] = useState({
    exams: [] as any[],
    gpa: null as any,
    loading: true,
  });
  const [templatesCount, setTemplatesCount] = useState<number>(0);
  const [dataLoading, setDataLoading] = useState(true);

  useEffect(() => {
    document.title = "Dashboard | Paccy";
  }, []);

  // Load all dashboard data from backend
  const loadDashboardData = async () => {
    try {
      setDataLoading(true);
      const [
        applicationsData,
        essaysData,
        extracurricularsData,
        calendarEventsData,
        templatesData,
      ] = await Promise.all([
        collegeApplicationsApi.getAll().catch(() => []),
        essaysApi.getAll().catch(() => []),
        extracurricularsApi.getAll().catch(() => []),
        calendarApi.getAll().catch(() => []),
        templatesApi.getAvailableTemplates().catch(() => []),
      ]);

      setApplications(applicationsData);
      setEssays(essaysData);
      setExtracurriculars(extracurricularsData);
      setCalendarEvents(calendarEventsData);
      setTemplatesCount(templatesData?.length || 0);

      // Load academic data separately to avoid blocking other data
      loadAcademicData();
    } catch (error) {
      console.warn("Failed to load dashboard data:", error);
      // Use empty arrays as fallback - no mock data
      setApplications([]);
      setEssays([]);
      setExtracurriculars([]);
      setCalendarEvents([]);
      setTemplatesCount(0);
    } finally {
      setDataLoading(false);
    }
  };

  // Load academic data
  const loadAcademicData = async () => {
    try {
      setAcademicData((prev) => ({ ...prev, loading: true }));
      const [examsData, gpaData] = await Promise.all([
        academicApi.getExams().catch(() => []),
        academicApi.getHighSchoolGPA().catch(() => null),
      ]);
      setAcademicData({
        exams: examsData,
        gpa: gpaData,
        loading: false,
      });
    } catch (error) {
      console.warn("Failed to load academic data:", error);
      setAcademicData({
        exams: [],
        gpa: null,
        loading: false,
      });
    }
  };

  // Load data when authenticated
  useEffect(() => {
    if (!loading && isAuthenticated) {
      loadDashboardData();
    }
  }, [loading, isAuthenticated]);

  // Simple auth check - redirect if not authenticated after loading is done
  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push("/auth");
    }
  }, [loading, isAuthenticated, router]);

  // Optional: Try to fetch fresh user data in background (non-blocking)
  useEffect(() => {
    if (!loading && isAuthenticated && verifyTokenAndFetchUser) {
      // Only run this once when component mounts and user is authenticated
      verifyTokenAndFetchUser().catch((error) => {
        console.warn("Background user data fetch failed:", error);
        // Silently fail - don't block the UI
      });
    }
  }, []); // Empty dependency array - only run once on mount

  // Calculate real stats
  const getActiveApplicationsCount = () => {
    if (!applications || !Array.isArray(applications)) return 0;
    return applications.filter(
      (app) => app.status !== "rejected" && app.status !== "withdrawn"
    ).length;
  };

  const getEssaysInProgressCount = () => {
    if (!essays || !Array.isArray(essays)) return 0;
    return essays.filter(
      (essay) =>
        essay.status === EssayStatus.IN_PROGRESS ||
        essay.status === EssayStatus.NOT_STARTED ||
        essay.status === EssayStatus.REVIEW_NEEDED
    ).length;
  };

  // Calculate cumulative GPA
  const calculateCumulativeGPA = () => {
    if (!academicData.gpa) return null;

    const gpaValues = [
      academicData.gpa.gpa_1,
      academicData.gpa.gpa_2,
      academicData.gpa.gpa_3,
      academicData.gpa.gpa_4,
    ]
      .filter(Boolean)
      .map(parseFloat);

    if (gpaValues.length === 0) return null;

    // Convert to 4.0 scale for calculation
    const normalizedGPAs = gpaValues.map((gpa) => {
      const scale = academicData.gpa.scale;
      if (scale === "5.0") return (gpa / 5) * 4;
      if (scale === "100") return (gpa / 100) * 4;
      return gpa; // Already 4.0 scale
    });

    return (
      normalizedGPAs.reduce((sum, gpa) => sum + gpa, 0) / normalizedGPAs.length
    );
  };

  // Get academic stats for dashboard
  const getAcademicStats = () => {
    if (academicData.loading) return "Loading...";

    const gpa = calculateCumulativeGPA();
    const examCount = academicData.exams.length;

    if (gpa && examCount > 0) {
      return `GPA ${gpa.toFixed(2)} • ${examCount} ${
        examCount === 1 ? "Exam" : "Exams"
      }`;
    } else if (gpa) {
      return `GPA ${gpa.toFixed(2)}`;
    } else if (examCount > 0) {
      return `${examCount} ${examCount === 1 ? "Exam" : "Exams"} Logged`;
    } else {
      return "Track your academic progress";
    }
  };

  const getTotalEssaysCount = () => {
    if (!essays || !Array.isArray(essays)) return 0;
    return essays.length;
  };

  // Calculate total hours per week for extracurriculars
  const getTotalExtracurricularHours = () => {
    if (!extracurriculars || !Array.isArray(extracurriculars)) return 0;
    return extracurriculars.reduce((total, activity) => {
      return total + (activity.hours_per_week || 0);
    }, 0);
  };

  // Get upcoming deadlines count from real calendar data
  const getUpcomingDeadlinesCount = () => {
    if (!calendarEvents || !Array.isArray(calendarEvents)) return 0;

    const now = new Date();
    const thirtyDaysFromNow = new Date();
    thirtyDaysFromNow.setDate(now.getDate() + 30);

    return calendarEvents.filter((event) => {
      if (!event.date) return false;
      const eventDate = new Date(event.date);
      return eventDate >= now && eventDate <= thirtyDaysFromNow;
    }).length;
  };

  // Calculate profile completion based on real user data
  const calculateProfileCompletion = (user: any) => {
    if (!user) return 0;

    let completion = 0;
    const totalFields = 10;

    // Basic info
    if (user.first_name) completion++;
    if (user.last_name) completion++;
    if (user.email) completion++;
    if (user.username) completion++;

    // Profile info
    if (user.profile?.bio) completion++;
    if (user.profile?.school) completion++;
    if (user.profile?.graduation_year && user.profile.graduation_year > 0)
      completion++;
    if (user.profile?.website) completion++;
    if (user.profile?.avatar_url) completion++;

    // Preferences
    if (user.preferences) completion++;

    return Math.round((completion / totalFields) * 100);
  };

  // Get current user data from backend - no mock data
  const getCurrentUser = () => {
    if (!user) {
      return null;
    }

    const profileCompletion = calculateProfileCompletion(user);
    const createdDate = user.created_at
      ? new Date(user.created_at)
      : new Date();
    const memberSince = createdDate.toLocaleDateString("en-US", {
      month: "long",
      year: "numeric",
    });

    return {
      name:
        user.name ||
        `${user.first_name || ""} ${user.last_name || ""}`.trim() ||
        user.username ||
        user.email,
      email: user.email,
      profileCompletion,
      memberSince,
      school: user.profile?.school || "Not specified",
      graduationYear: user.profile?.graduation_year || "Not specified",
      bio: user.profile?.bio || "No bio added yet",
      theme: user.preferences?.theme || "dark",
      verificationLevel: user.verification_level || 1,
    };
  };

  // Show loading state - only while auth is loading
  if (loading) {
    return (
      <div
        className={`min-h-screen flex items-center justify-center transition-colors duration-300 ${
          theme === "dark" ? "bg-[#0a0a0a]" : "bg-gray-50"
        }`}
      >
        <div className="text-center">
          <div
            className={`text-lg mb-4 ${
              theme === "dark" ? "text-white" : "text-gray-900"
            }`}
          >
            Loading your dashboard...
          </div>
          <div
            className={`text-sm ${
              theme === "dark" ? "text-white/60" : "text-gray-600"
            }`}
          >
            This should only take a moment
          </div>
        </div>
      </div>
    );
  }

  const currentUser = getCurrentUser();

  return (
    <div
      className={`min-h-screen transition-colors duration-300 ${
        theme === "dark" ? "bg-[#0a0a0a]" : "bg-gray-50"
      }`}
    >
      {/* Dashboard Content */}
      <div className="p-6 md:p-8 mt-8">
        {/* Welcome Section */}
        <div className="max-w-screen-2xl mx-auto mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1
                className={`text-2xl md:text-4xl font-extrabold ${
                  theme === "dark" ? "text-white" : "text-gray-900"
                }`}
              >
                Welcome back, {currentUser?.name || "Student"}! 👋
              </h1>
              <p
                className={`text-sm md:text-base ${
                  theme === "dark" ? "text-white/60" : "text-gray-600"
                }`}
              >
                Let's continue building your future together.
              </p>
            </div>
            <Link
              href="/dashboard/colleges"
              className="flex items-center gap-2 bg-blue-500 text-white px-4 py-2 rounded-lg font-semibold hover:bg-blue-600 transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/20"
            >
              <FaPlus className="text-sm" />
              <span className="hidden sm:inline">Add College</span>
            </Link>
          </div>
        </div>
        <div className="max-w-screen-2xl mx-auto">
          {/* Stats Cards - Real Data Only */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <StatsCard
              icon={<FaUniversity />}
              value={getActiveApplicationsCount()}
              label="Active Applications"
              loading={dataLoading}
              emptyMessage="Start by adding your first college!"
              iconColor="blue"
            />

            <StatsCard
              icon={<FaPen />}
              value={getTotalEssaysCount()}
              label="Total Essays"
              loading={dataLoading}
              emptyMessage={
                !dataLoading && getEssaysInProgressCount() > 0
                  ? `${getEssaysInProgressCount()} in progress`
                  : undefined
              }
              iconColor="purple"
            />

            <StatsCard
              icon={<FaTrophy />}
              value={extracurriculars.length}
              label="Extracurriculars"
              loading={dataLoading}
              emptyMessage={
                !dataLoading &&
                extracurriculars.length > 0 &&
                getTotalExtracurricularHours() > 0
                  ? `${getTotalExtracurricularHours()} hours/week total`
                  : extracurriculars.length === 0
                  ? "Showcase your activities"
                  : undefined
              }
              iconColor="orange"
            />

            <StatsCard
              icon={<FaCalendar />}
              value={getUpcomingDeadlinesCount()}
              label="Upcoming Deadlines"
              loading={dataLoading}
              emptyMessage={
                !dataLoading && getUpcomingDeadlinesCount() > 0
                  ? "Next 30 days"
                  : undefined
              }
              iconColor="green"
            />
          </div>

          {/* Progress Overview */}
          <div className="mb-10">
            <h2
              className={`text-2xl font-semibold mb-5 flex items-center gap-2 ${
                theme === "dark" ? "text-white" : "text-gray-900"
              }`}
            >
              <div className="p-2 bg-green-500/10 rounded-lg">
                <FaCheckCircle className="text-xl text-green-400" />
              </div>
              Progress Overview
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Application Status Breakdown */}
              <div
                className={`rounded-xl p-5 border transition-all duration-300 ${
                  theme === "dark"
                    ? "bg-gradient-to-br from-[#141414] to-[#1a1a1a] border-neutral-700/50"
                    : "bg-white border-gray-200"
                }`}
              >
                <div className="flex items-center gap-2 mb-4">
                  <div className="p-2 bg-blue-500/10 rounded-lg">
                    <FaUniversity className="text-lg text-blue-400" />
                  </div>
                  <h3
                    className={`font-semibold ${
                      theme === "dark" ? "text-white" : "text-gray-900"
                    }`}
                  >
                    Application Status
                  </h3>
                </div>
                {dataLoading ? (
                  <div className="flex justify-center py-4">
                    <FaSpinner
                      className={`animate-spin ${
                        theme === "dark" ? "text-white/50" : "text-gray-400"
                      }`}
                    />
                  </div>
                ) : applications.length === 0 ? (
                  <p
                    className={`text-sm ${
                      theme === "dark" ? "text-white/60" : "text-gray-500"
                    }`}
                  >
                    No applications yet
                  </p>
                ) : (
                  <div className="space-y-2">
                    {[
                      "not_started",
                      "in_progress",
                      "submitted",
                      "under_review",
                      "accepted",
                    ].map((status) => {
                      const count = applications.filter(
                        (app) => app.status === status
                      ).length;
                      if (count === 0) return null;
                      return (
                        <div
                          key={status}
                          className="flex items-center justify-between text-sm"
                        >
                          <span className="text-white/70 capitalize">
                            {status.replace(/_/g, " ")}
                          </span>
                          <span className="text-white font-semibold">
                            {count}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Essay Progress */}
              <div
                className={`rounded-xl p-5 ${
                  theme === "dark"
                    ? "bg-gradient-to-br from-[#141414] to-[#1a1a1a] border border-neutral-700/50"
                    : "bg-white border border-gray-200"
                }`}
              >
                <div className="flex items-center gap-2 mb-4">
                  <FaPen className="text-lg text-purple-400" />
                  <h3
                    className={`font-semibold ${
                      theme === "dark" ? "text-white" : "text-gray-900"
                    }`}
                  >
                    Essay Progress
                  </h3>
                </div>
                {dataLoading ? (
                  <div className="flex justify-center py-4">
                    <FaSpinner
                      className={`animate-spin ${
                        theme === "dark" ? "text-white/50" : "text-gray-400"
                      }`}
                    />
                  </div>
                ) : essays.length === 0 ? (
                  <p
                    className={`text-sm ${
                      theme === "dark" ? "text-white/60" : "text-gray-500"
                    }`}
                  >
                    No essays yet
                  </p>
                ) : (
                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-sm">
                      <span
                        className={
                          theme === "dark" ? "text-white/70" : "text-gray-600"
                        }
                      >
                        Completed
                      </span>
                      <span className="text-green-400 font-semibold">
                        {
                          essays.filter(
                            (e) => e.status === EssayStatus.COMPLETED
                          ).length
                        }
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span
                        className={
                          theme === "dark" ? "text-white/70" : "text-gray-600"
                        }
                      >
                        In Progress
                      </span>
                      <span className="text-blue-400 font-semibold">
                        {
                          essays.filter(
                            (e) => e.status === EssayStatus.IN_PROGRESS
                          ).length
                        }
                      </span>
                    </div>
                    <div
                      className={`w-full rounded-full h-2 mt-3 ${
                        theme === "dark" ? "bg-neutral-700/50" : "bg-gray-200"
                      }`}
                    >
                      <div
                        className="bg-gradient-to-r from-purple-500 to-purple-600 h-2 rounded-full transition-all"
                        style={{
                          width: `${
                            essays.length > 0
                              ? (essays.filter(
                                  (e) => e.status === EssayStatus.COMPLETED
                                ).length /
                                  essays.length) *
                                100
                              : 0
                          }%`,
                        }}
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Next Deadline */}
              <div
                className={`rounded-xl p-5 ${
                  theme === "dark"
                    ? "bg-gradient-to-br from-[#141414] to-[#1a1a1a] border border-neutral-700/50"
                    : "bg-white border border-gray-200"
                }`}
              >
                <div className="flex items-center gap-2 mb-4">
                  <div className="p-2 bg-amber-500/10 rounded-lg">
                    <FaClock className="text-lg text-amber-400" />
                  </div>
                  <h3
                    className={`font-semibold ${
                      theme === "dark" ? "text-white" : "text-gray-900"
                    }`}
                  >
                    Next Deadline
                  </h3>
                </div>
                {dataLoading ? (
                  <div className="flex justify-center py-4">
                    <FaSpinner
                      className={`animate-spin ${
                        theme === "dark" ? "text-white/50" : "text-gray-400"
                      }`}
                    />
                  </div>
                ) : (
                  (() => {
                    // Find the nearest upcoming deadline
                    const now = new Date();
                    const upcomingDeadlines = [
                      ...applications
                        .filter((app) => app.deadline)
                        .map((app) => ({
                          type: "application" as const,
                          name: app.name,
                          date: new Date(app.deadline!),
                          link: `/dashboard/colleges/${app.id}`,
                        })),
                      ...calendarEvents
                        .filter((event) => event.date)
                        .map((event) => ({
                          type: "event" as const,
                          name: event.title,
                          date: new Date(event.date!),
                          link: `/dashboard/calendar`,
                        })),
                    ]
                      .filter((item) => item.date >= now)
                      .sort((a, b) => a.date.getTime() - b.date.getTime());

                    const nextDeadline = upcomingDeadlines[0];

                    if (!nextDeadline) {
                      return (
                        <p
                          className={`text-sm ${
                            theme === "dark" ? "text-white/60" : "text-gray-500"
                          }`}
                        >
                          No upcoming deadlines
                        </p>
                      );
                    }

                    const daysUntil = Math.ceil(
                      (nextDeadline.date.getTime() - now.getTime()) /
                        (1000 * 60 * 60 * 24)
                    );

                    return (
                      <Link
                        href={nextDeadline.link}
                        className={`block group -m-2 p-2 rounded-lg transition-colors ${
                          theme === "dark"
                            ? "hover:bg-white/5"
                            : "hover:bg-gray-50"
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          {nextDeadline.type === "application" ? (
                            <FaUniversity className="text-blue-400 mt-1 flex-shrink-0" />
                          ) : (
                            <FaCalendar className="text-green-400 mt-1 flex-shrink-0" />
                          )}
                          <div className="flex-1">
                            <p
                              className={`font-semibold text-sm group-hover:text-blue-400 transition-colors line-clamp-1 ${
                                theme === "dark"
                                  ? "text-white"
                                  : "text-gray-900"
                              }`}
                            >
                              {nextDeadline.name}
                            </p>
                            <p
                              className={`text-xs mt-1 ${
                                theme === "dark"
                                  ? "text-white/60"
                                  : "text-gray-600"
                              }`}
                            >
                              {nextDeadline.date.toLocaleDateString("en-US", {
                                month: "short",
                                day: "numeric",
                                year: "numeric",
                              })}
                            </p>
                            <p
                              className={`text-xs font-semibold mt-1 ${
                                daysUntil <= 7
                                  ? "text-red-400"
                                  : daysUntil <= 14
                                  ? "text-orange-400"
                                  : "text-amber-400"
                              }`}
                            >
                              {daysUntil === 0
                                ? "Today!"
                                : daysUntil === 1
                                ? "Tomorrow"
                                : `${daysUntil} days away`}
                            </p>
                          </div>
                        </div>
                      </Link>
                    );
                  })()
                )}
              </div>
            </div>
          </div>

          <div className="mb-10">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* College Applications - Takes 2 columns */}
              <div className="lg:col-span-2">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-semibold text-white flex items-center gap-2">
                    <div className="p-2 bg-blue-500/10 rounded-lg">
                      <FaUniversity className="text-xl text-blue-400" />
                    </div>
                    College Applications
                  </h2>
                  <Link
                    href="/dashboard/colleges"
                    className="text-sm text-blue-400 hover:text-blue-300 flex items-center gap-1"
                  >
                    View All <FaArrowRight className="text-xs" />
                  </Link>
                </div>
                {dataLoading ? (
                  <div className="flex items-center justify-center py-12">
                    <FaSpinner
                      className={`animate-spin text-3xl ${
                        theme === "dark" ? "text-white/50" : "text-gray-400"
                      }`}
                    />
                  </div>
                ) : applications.length === 0 ? (
                  <div
                    className={`rounded-xl p-12 text-center ${
                      theme === "dark"
                        ? "bg-gradient-to-br from-[#141414] to-[#1a1a1a] border border-neutral-700/50"
                        : "bg-white border border-gray-200"
                    }`}
                  >
                    <FaUniversity
                      className={`text-5xl mx-auto mb-4 ${
                        theme === "dark" ? "text-white/30" : "text-gray-300"
                      }`}
                    />
                    <h3
                      className={`text-xl font-semibold mb-2 ${
                        theme === "dark" ? "text-white" : "text-gray-900"
                      }`}
                    >
                      No applications yet
                    </h3>
                    <p
                      className={`mb-4 ${
                        theme === "dark" ? "text-white/60" : "text-gray-600"
                      }`}
                    >
                      Start tracking your college applications to stay organized
                    </p>
                    <Link
                      href="/dashboard/colleges"
                      className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:from-blue-600 hover:to-blue-700 transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/20"
                    >
                      <FaPlus /> Add your first college
                    </Link>
                  </div>
                ) : (
                  <div
                    className={`rounded-xl p-4 ${
                      theme === "dark"
                        ? "bg-gradient-to-br from-[#141414] to-[#1a1a1a] border border-neutral-700/50"
                        : "bg-white border border-gray-200"
                    }`}
                  >
                    <div className="space-y-3">
                      {applications
                        .sort((a, b) => {
                          // Sort by updated_at (most recent first), fallback to created_at if not available
                          const dateA = new Date(
                            a.updated_at || a.created_at || 0
                          ).getTime();
                          const dateB = new Date(
                            b.updated_at || b.created_at || 0
                          ).getTime();
                          return dateB - dateA;
                        })
                        .slice(0, 5)
                        .map((app) => {
                          const websiteUrl = app.websites?.[0];
                          let faviconUrl = null;

                          if (websiteUrl) {
                            try {
                              const url = new URL(websiteUrl);
                              faviconUrl = `https://www.google.com/s2/favicons?domain=${url.hostname}&sz=64`;
                            } catch (e) {
                              // Invalid URL, use null
                              faviconUrl = null;
                            }
                          }

                          // Calculate progress from checklists if not provided by backend
                          const progress =
                            app.progress ??
                            (() => {
                              // If application is submitted or beyond, consider it 100% complete
                              const submittedStatuses = [
                                "submitted",
                                "under_review",
                                "accepted",
                                "rejected",
                                "waitlisted",
                                "deferred",
                              ];
                              if (
                                app.status &&
                                submittedStatuses.includes(
                                  app.status.toLowerCase()
                                )
                              ) {
                                return 100;
                              }

                              if (
                                !app.checklists ||
                                app.checklists.length === 0
                              )
                                return 0;
                              const totalTasks = app.checklists.reduce(
                                (acc, checklist) =>
                                  acc + checklist.tasks.length,
                                0
                              );
                              const completedTasks = app.checklists.reduce(
                                (acc, checklist) =>
                                  acc +
                                  checklist.tasks.filter(
                                    (task) => task.completed
                                  ).length,
                                0
                              );
                              return totalTasks > 0
                                ? Math.round(
                                    (completedTasks / totalTasks) * 100
                                  )
                                : 0;
                            })();

                          // Calculate days until deadline
                          const daysUntilDeadline = app.deadline
                            ? Math.ceil(
                                (new Date(app.deadline).getTime() -
                                  new Date().getTime()) /
                                  (1000 * 60 * 60 * 24)
                              )
                            : null;

                          // Status badge color
                          const statusColors: {
                            [key: string]: { bg: string; text: string };
                          } = {
                            not_started: {
                              bg: "bg-neutral-500/20",
                              text: "text-neutral-300",
                            },
                            in_progress: {
                              bg: "bg-amber-500/20",
                              text: "text-amber-300",
                            },
                            submitted: {
                              bg: "bg-blue-500/20",
                              text: "text-blue-300",
                            },
                            under_review: {
                              bg: "bg-purple-500/20",
                              text: "text-purple-300",
                            },
                            accepted: {
                              bg: "bg-green-500/20",
                              text: "text-green-300",
                            },
                            rejected: {
                              bg: "bg-red-500/20",
                              text: "text-red-300",
                            },
                            waitlisted: {
                              bg: "bg-yellow-500/20",
                              text: "text-yellow-300",
                            },
                            deferred: {
                              bg: "bg-orange-500/20",
                              text: "text-orange-300",
                            },
                          };

                          const statusStyle =
                            statusColors[app.status] ||
                            statusColors.not_started;

                          return (
                            <Link
                              key={app.id}
                              href={`/dashboard/colleges/${app.id}`}
                              className={`group flex items-center gap-4 p-5 rounded-2xl transition-all ${
                                theme === "dark"
                                  ? "bg-white/[0.02] border border-neutral-700/30 hover:border-white/20 hover:bg-white/[0.04]"
                                  : "bg-gray-50 border border-gray-200 hover:border-blue-300 hover:bg-blue-50"
                              }`}
                            >
                              {/* College Icon */}
                              <div className="flex-shrink-0">
                                {faviconUrl ? (
                                  <img
                                    src={faviconUrl}
                                    alt={`${app.name} logo`}
                                    className={`w-14 h-14 rounded-xl object-cover ${
                                      theme === "dark"
                                        ? "bg-white/5 border border-neutral-700/50"
                                        : "bg-gray-100 border border-gray-200"
                                    }`}
                                    onError={(e) => {
                                      e.currentTarget.style.display = "none";
                                      const fallback = e.currentTarget
                                        .nextElementSibling as HTMLElement;
                                      if (fallback)
                                        fallback.classList.remove("hidden");
                                    }}
                                    onLoad={(e) => {
                                      const img = e.currentTarget;
                                      if (
                                        img.naturalWidth <= 16 ||
                                        img.naturalHeight <= 16
                                      ) {
                                        img.style.display = "none";
                                        const fallback =
                                          img.nextElementSibling as HTMLElement;
                                        if (fallback)
                                          fallback.classList.remove("hidden");
                                      }
                                    }}
                                  />
                                ) : null}
                                <div
                                  className={`${
                                    faviconUrl ? "hidden" : ""
                                  } w-14 h-14 bg-blue-500/10 rounded-xl flex items-center justify-center border border-blue-500/30`}
                                >
                                  <FaUniversity className="text-2xl text-blue-400" />
                                </div>
                              </div>

                              {/* College Info */}
                              <div className="flex-1 min-w-0">
                                <h4
                                  className={`text-lg font-bold mb-1 group-hover:text-blue-400 transition-colors ${
                                    theme === "dark"
                                      ? "text-white"
                                      : "text-gray-900"
                                  }`}
                                >
                                  {app.name}
                                </h4>
                                <p
                                  className={`text-sm ${
                                    theme === "dark"
                                      ? "text-white/50"
                                      : "text-gray-500"
                                  }`}
                                >
                                  {app.major || "Undecided"} •{" "}
                                  {app.application_type
                                    ?.replace(/_/g, " ")
                                    .split(" ")
                                    .map(
                                      (w) =>
                                        w.charAt(0).toUpperCase() + w.slice(1)
                                    )
                                    .join(" ")}
                                </p>
                              </div>

                              {/* Deadline and Status */}
                              <div className="flex items-center gap-4 flex-shrink-0">
                                {app.deadline && (
                                  <div className="flex items-center gap-1.5 text-sm">
                                    {daysUntilDeadline !== null &&
                                      daysUntilDeadline <= 30 &&
                                      daysUntilDeadline >= 0 && (
                                        <span className="text-orange-400">
                                          ⚠
                                        </span>
                                      )}
                                    <span
                                      className={`uppercase text-xs font-semibold tracking-wider ${
                                        theme === "dark"
                                          ? "text-white/40"
                                          : "text-gray-400"
                                      }`}
                                    >
                                      DEADLINE
                                    </span>
                                    <span
                                      className={`font-semibold ${
                                        theme === "dark"
                                          ? "text-white"
                                          : "text-gray-900"
                                      }`}
                                    >
                                      {new Date(
                                        app.deadline
                                      ).toLocaleDateString("en-US", {
                                        month: "short",
                                        day: "numeric",
                                        year: "numeric",
                                      })}
                                    </span>
                                  </div>
                                )}

                                {/* Status Badge */}
                                <span
                                  className={`px-3 py-1.5 rounded-full text-sm font-medium ${statusStyle.bg} ${statusStyle.text}`}
                                >
                                  {app.status
                                    ?.replace(/_/g, " ")
                                    .split(" ")
                                    .map(
                                      (w) =>
                                        w.charAt(0).toUpperCase() + w.slice(1)
                                    )
                                    .join(" ")}
                                </span>
                              </div>

                              {/* Arrow */}
                              <FaChevronRight className="text-white/30 group-hover:text-white/50 transition-colors flex-shrink-0" />
                            </Link>
                          );
                        })}
                    </div>
                  </div>
                )}
              </div>

              {
                /* Upcoming Deadlines - Takes 1 column */
                <div className="lg:col-span-1">
                  {dataLoading ? (
                    <div className="flex items-center justify-center py-12">
                      <FaSpinner className="text-white/50 animate-spin text-3xl" />
                    </div>
                  ) : calendarEvents.filter((event) => {
                      if (!event.date) return false;
                      const eventDate = new Date(event.date);
                      const now = new Date();
                      return eventDate >= now;
                    }).length === 0 ? (
                    <div className="bg-gradient-to-br from-[#141414] to-[#1a1a1a] border border-neutral-700/50 rounded-xl p-8 text-center">
                      <FaCalendar className="text-4xl text-white/30 mx-auto mb-3" />
                      <p
                        className={`text-sm mb-3 ${
                          theme === "dark" ? "text-white/60" : "text-gray-600"
                        }`}
                      >
                        No upcoming deadlines
                      </p>
                      <Link
                        href="/dashboard/calendar"
                        className="text-green-400 text-sm hover:text-green-300 inline-flex items-center gap-1"
                      >
                        Add an event <FaArrowRight className="text-xs" />
                      </Link>
                    </div>
                  ) : (
                    <div
                      className={`rounded-xl p-4 ${
                        theme === "dark"
                          ? "bg-gradient-to-br from-[#141414] to-[#1a1a1a] border border-neutral-700/50"
                          : "bg-white border border-gray-200"
                      }`}
                    >
                      <h3
                        className={`text-lg font-semibold mb-4 flex items-center gap-2 ${
                          theme === "dark" ? "text-white" : "text-gray-900"
                        }`}
                      >
                        <FaCalendar className="text-green-400" />
                        Upcoming Deadlines
                      </h3>
                      <div className="space-y-3">
                        {calendarEvents
                          .filter((event) => {
                            if (!event.date) return false;
                            const eventDate = new Date(event.date);
                            const now = new Date();
                            return eventDate >= now;
                          })
                          .sort(
                            (a, b) =>
                              new Date(a.date!).getTime() -
                              new Date(b.date!).getTime()
                          )
                          .slice(0, 3)
                          .map((event, index) => {
                            const eventDate = new Date(event.date!);
                            const daysUntil = Math.ceil(
                              (eventDate.getTime() - new Date().getTime()) /
                                (1000 * 60 * 60 * 24)
                            );

                            // Cycle through colors for variety
                            const colors = [
                              { bg: "bg-red-500/15", text: "text-red-400" },
                              { bg: "bg-blue-500/15", text: "text-blue-400" },
                              {
                                bg: "bg-purple-500/15",
                                text: "text-purple-400",
                              },
                            ];
                            const colorScheme = colors[index % colors.length];

                            return (
                              <Link
                                key={event.id}
                                href={`/dashboard/calendar`}
                                className={`flex items-start gap-3 p-3 rounded-xl transition-all group ${
                                  theme === "dark"
                                    ? "bg-white/[0.02] border border-neutral-700/30 hover:border-white/20 hover:bg-white/[0.04]"
                                    : "bg-gray-50 border border-gray-200 hover:border-blue-300 hover:bg-blue-50"
                                }`}
                              >
                                {/* Date Box */}
                                <div
                                  className={`flex-shrink-0 p-2 ${colorScheme.bg} rounded-lg transition-transform group-hover:scale-105`}
                                >
                                  <div className="w-10 h-10 flex flex-col items-center justify-center">
                                    <div
                                      className={`text-[9px] font-semibold ${colorScheme.text} uppercase tracking-wider mb-0.5`}
                                    >
                                      {eventDate.toLocaleDateString("en-US", {
                                        month: "short",
                                      })}
                                    </div>
                                    <div
                                      className={`text-xl font-bold ${colorScheme.text} leading-none`}
                                    >
                                      {eventDate
                                        .getDate()
                                        .toString()
                                        .padStart(2, "0")}
                                    </div>
                                  </div>
                                </div>

                                {/* Event Details */}
                                <div className="flex-1 min-w-0">
                                  <h4
                                    className={`text-sm font-bold mb-0.5 group-hover:text-blue-400 transition-colors line-clamp-1 ${
                                      theme === "dark"
                                        ? "text-white"
                                        : "text-gray-900"
                                    }`}
                                  >
                                    {event.title}
                                  </h4>
                                  <p
                                    className={`text-xs leading-relaxed line-clamp-2 ${
                                      theme === "dark"
                                        ? "text-white/50"
                                        : "text-gray-500"
                                    }`}
                                  >
                                    {event.description ||
                                      "No description provided."}
                                  </p>
                                </div>
                              </Link>
                            );
                          })}
                      </div>
                    </div>
                  )}
                </div>
              }
            </div>
          </div>

          {/* Recent Essays & Extracurriculars */}
          <div className="mb-10">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Recent Essays */}
              <div className="bg-gradient-to-br from-[#141414] to-[#1a1a1a] border border-neutral-700/50 rounded-xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                    <div className="p-2 bg-purple-500/10 rounded-lg">
                      <FaPen className="text-purple-400" />
                    </div>
                    Recent Essays
                  </h3>
                  <Link
                    href="/dashboard/essays"
                    className="text-sm text-purple-400 hover:text-purple-300 flex items-center gap-1"
                  >
                    View All <FaArrowRight className="text-xs" />
                  </Link>
                </div>
                {dataLoading ? (
                  <div className="flex items-center justify-center py-8">
                    <FaSpinner
                      className={`animate-spin text-2xl ${
                        theme === "dark" ? "text-white/50" : "text-gray-400"
                      }`}
                    />
                  </div>
                ) : essays.length === 0 ? (
                  <div className="text-center py-8">
                    <FaPen
                      className={`text-4xl mx-auto mb-3 ${
                        theme === "dark" ? "text-white/30" : "text-gray-300"
                      }`}
                    />
                    <p
                      className={`text-sm mb-3 ${
                        theme === "dark" ? "text-white/60" : "text-gray-600"
                      }`}
                    >
                      No essays yet
                    </p>
                    <Link
                      href="/dashboard/essays"
                      className="text-purple-400 text-sm hover:text-purple-300 inline-flex items-center gap-1"
                    >
                      Write your first essay{" "}
                      <FaArrowRight className="text-xs" />
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {essays.slice(0, 3).map((essay) => (
                      <Link
                        key={essay.id}
                        href={`/dashboard/essays/${essay.id}`}
                        className={`block p-3 rounded-lg transition-colors ${
                          theme === "dark"
                            ? "bg-white/[0.02] border border-neutral-700/30 hover:border-white/20 hover:bg-white/[0.04]"
                            : "bg-gray-50 border border-gray-200 hover:border-blue-300 hover:bg-blue-50"
                        }`}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h4
                              className={`font-medium mb-1 line-clamp-1 ${
                                theme === "dark"
                                  ? "text-white"
                                  : "text-gray-900"
                              }`}
                            >
                              {essay.title}
                            </h4>
                            <p
                              className={`text-xs ${
                                theme === "dark"
                                  ? "text-white/60"
                                  : "text-gray-600"
                              }`}
                            >
                              {essay.content?.split(/\s+/).length || 0} words •{" "}
                              {essay.college_name || "Common App"}
                            </p>
                          </div>
                          <span
                            className={`text-xs px-2 py-1 rounded-full whitespace-nowrap ${
                              essay.status === EssayStatus.COMPLETED
                                ? "bg-green-500/20 text-green-300"
                                : essay.status === EssayStatus.IN_PROGRESS
                                ? "bg-blue-500/20 text-blue-300"
                                : essay.status === EssayStatus.REVIEW_NEEDED
                                ? "bg-amber-500/20 text-amber-300"
                                : "bg-neutral-500/20 text-neutral-300"
                            }`}
                          >
                            {essay.status?.replace(/_/g, " ")}
                          </span>
                        </div>
                      </Link>
                    ))}
                  </div>
                )}
              </div>

              {/* Extracurriculars */}
              <div
                className={`rounded-xl p-6 ${
                  theme === "dark"
                    ? "bg-gradient-to-br from-[#141414] to-[#1a1a1a] border border-neutral-700/50"
                    : "bg-white border border-gray-200"
                }`}
              >
                <div className="flex items-center justify-between mb-4">
                  <h3
                    className={`text-lg font-semibold flex items-center gap-2 ${
                      theme === "dark" ? "text-white" : "text-gray-900"
                    }`}
                  >
                    <div className="p-2 bg-amber-500/10 rounded-lg">
                      <FaTrophy className="text-amber-400" />
                    </div>
                    Extracurriculars
                  </h3>
                  <Link
                    href="/dashboard/extracurriculars"
                    className="text-sm text-amber-400 hover:text-amber-300 flex items-center gap-1"
                  >
                    View All <FaArrowRight className="text-xs" />
                  </Link>
                </div>
                {dataLoading ? (
                  <div className="flex items-center justify-center py-8">
                    <FaSpinner
                      className={`animate-spin text-2xl ${
                        theme === "dark" ? "text-white/50" : "text-gray-400"
                      }`}
                    />
                  </div>
                ) : extracurriculars.length === 0 ? (
                  <div className="text-center py-8">
                    <FaTrophy
                      className={`text-4xl mx-auto mb-3 ${
                        theme === "dark" ? "text-white/30" : "text-gray-300"
                      }`}
                    />
                    <p
                      className={`text-sm mb-3 ${
                        theme === "dark" ? "text-white/60" : "text-gray-600"
                      }`}
                    >
                      No activities yet
                    </p>
                    <Link
                      href="/dashboard/extracurriculars"
                      className="text-amber-400 text-sm hover:text-amber-300 inline-flex items-center gap-1"
                    >
                      Add an activity <FaArrowRight className="text-xs" />
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {extracurriculars.slice(0, 3).map((activity) => (
                      <Link
                        key={activity.id}
                        href={`/dashboard/extracurriculars/${activity.id}`}
                        className={`block p-3 rounded-lg transition-colors ${
                          theme === "dark"
                            ? "bg-white/[0.02] border border-neutral-700/30 hover:border-white/20 hover:bg-white/[0.04]"
                            : "bg-gray-50 border border-gray-200 hover:border-blue-300 hover:bg-blue-50"
                        }`}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h4
                              className={`font-medium mb-1 line-clamp-1 ${
                                theme === "dark"
                                  ? "text-white"
                                  : "text-gray-900"
                              }`}
                            >
                              {activity.activity_name}
                            </h4>
                            <p
                              className={`text-xs ${
                                theme === "dark"
                                  ? "text-white/60"
                                  : "text-gray-600"
                              }`}
                            >
                              {activity.category
                                ?.replace(/_/g, " ")
                                .replace(/\b\w/g, (l) => l.toUpperCase())}
                              {activity.position && " • " + activity.position}
                            </p>
                          </div>
                          {activity.hours_per_week && (
                            <span className="text-xs px-2 py-1 rounded-full bg-amber-500/20 text-amber-300 whitespace-nowrap">
                              {activity.hours_per_week}h/week
                            </span>
                          )}
                        </div>
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Profile Completion - Real User Data */}
          {currentUser && currentUser.profileCompletion < 100 && (
            <div
              className={`rounded-xl p-8 shadow-xl ${
                theme === "dark"
                  ? "bg-gradient-to-br from-[#141414] to-[#1a1a1a] border border-white/20"
                  : "bg-white border border-gray-200"
              }`}
            >
              <div className="flex items-start justify-between mb-6">
                <div>
                  <h3
                    className={`text-2xl font-semibold mb-2 flex items-center gap-2 ${
                      theme === "dark" ? "text-white" : "text-gray-900"
                    }`}
                  >
                    <FaCog className="text-xl" />
                    Complete Your Profile
                  </h3>
                  <p
                    className={`text-sm ${
                      theme === "dark" ? "text-white/70" : "text-gray-600"
                    }`}
                  >
                    A complete profile helps us provide better recommendations
                  </p>
                </div>
                <div
                  className={`text-3xl font-bold ${
                    theme === "dark" ? "text-white" : "text-gray-900"
                  }`}
                >
                  {currentUser.profileCompletion}%
                </div>
              </div>

              <div className="mb-6">
                <div
                  className={`w-full rounded-full h-3 overflow-hidden ${
                    theme === "dark" ? "bg-neutral-800" : "bg-gray-200"
                  }`}
                >
                  <div
                    className="bg-gradient-to-r from-[white] via-[#E5D5B7] to-[white] h-3 rounded-full transition-all duration-500 animate-pulse"
                    style={{ width: `${currentUser.profileCompletion}%` }}
                  ></div>
                </div>
              </div>

              {user && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                  <div
                    className={`rounded-lg p-4 ${
                      theme === "dark"
                        ? "bg-[#0a0a0a]/50 border border-neutral-700/30"
                        : "bg-gray-50 border border-gray-200"
                    }`}
                  >
                    <div
                      className={`text-xs mb-1 ${
                        theme === "dark" ? "text-white/50" : "text-gray-500"
                      }`}
                    >
                      School
                    </div>
                    <div
                      className={`font-medium ${
                        theme === "dark" ? "text-white" : "text-gray-900"
                      }`}
                    >
                      {currentUser.school}
                    </div>
                  </div>
                  <div
                    className={`rounded-lg p-4 ${
                      theme === "dark"
                        ? "bg-[#0a0a0a]/50 border border-neutral-700/30"
                        : "bg-gray-50 border border-gray-200"
                    }`}
                  >
                    <div
                      className={`text-xs mb-1 ${
                        theme === "dark" ? "text-white/50" : "text-gray-500"
                      }`}
                    >
                      Graduation Year
                    </div>
                    <div
                      className={`font-medium ${
                        theme === "dark" ? "text-white" : "text-gray-900"
                      }`}
                    >
                      {currentUser.graduationYear}
                    </div>
                  </div>
                  <div
                    className={`rounded-lg p-4 ${
                      theme === "dark"
                        ? "bg-[#0a0a0a]/50 border border-neutral-700/30"
                        : "bg-gray-50 border border-gray-200"
                    }`}
                  >
                    <div
                      className={`text-xs mb-1 ${
                        theme === "dark" ? "text-white/50" : "text-gray-500"
                      }`}
                    >
                      Member Since
                    </div>
                    <div
                      className={`font-medium ${
                        theme === "dark" ? "text-white" : "text-gray-900"
                      }`}
                    >
                      {currentUser.memberSince}
                    </div>
                  </div>
                </div>
              )}

              <Link
                href="/dashboard/settings"
                className="inline-flex items-center gap-2 bg-gradient-to-r from-[white] to-[#E5D5B7] text-[#141414] px-6 py-3 rounded-lg font-semibold hover:from-[#E5D5B7] hover:to-[white] transition-all duration-300 hover:shadow-lg hover:shadow-[white]/20 hover:-translate-y-0.5"
              >
                <FaCog />
                Complete Profile
                <FaArrowRight />
              </Link>
            </div>
          )}

          {/* Get Started Guide for New Users */}
          {!dataLoading &&
            getActiveApplicationsCount() === 0 &&
            getTotalEssaysCount() === 0 &&
            extracurriculars.length === 0 && (
              <div
                className={`mt-8 rounded-xl p-8 ${
                  theme === "dark"
                    ? "bg-gradient-to-r from-blue-900/20 to-purple-900/20 border border-blue-500/30"
                    : "bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200"
                }`}
              >
                <h3
                  className={`text-2xl font-semibold mb-4 flex items-center gap-2 ${
                    theme === "dark" ? "text-white" : "text-gray-900"
                  }`}
                >
                  <FaCheckCircle className="text-blue-400" />
                  Welcome to Paccy! 🎉
                </h3>
                <p
                  className={`mb-6 text-lg ${
                    theme === "dark" ? "text-white/80" : "text-gray-700"
                  }`}
                >
                  You're all set to start your college application journey.
                  Here's how to get started:
                </p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div
                    className={`rounded-lg p-5 ${
                      theme === "dark"
                        ? "bg-[#0a0a0a]/50 border border-neutral-700/30"
                        : "bg-white border border-gray-200"
                    }`}
                  >
                    <div className="text-2xl font-bold text-blue-400 mb-2">
                      1
                    </div>
                    <h4
                      className={`font-semibold mb-2 ${
                        theme === "dark" ? "text-white" : "text-gray-900"
                      }`}
                    >
                      Add Your First College
                    </h4>
                    <p
                      className={`text-sm mb-3 ${
                        theme === "dark" ? "text-white/70" : "text-gray-600"
                      }`}
                    >
                      Start tracking your dream universities
                    </p>
                    <Link
                      href="/dashboard/colleges"
                      className="text-blue-400 text-sm hover:text-blue-300 inline-flex items-center gap-1"
                    >
                      Go to Colleges <FaArrowRight className="text-xs" />
                    </Link>
                  </div>
                  <div
                    className={`rounded-lg p-5 ${
                      theme === "dark"
                        ? "bg-[#0a0a0a]/50 border border-neutral-700/30"
                        : "bg-white border border-gray-200"
                    }`}
                  >
                    <div className="text-2xl font-bold text-purple-400 mb-2">
                      2
                    </div>
                    <h4
                      className={`font-semibold mb-2 ${
                        theme === "dark" ? "text-white" : "text-gray-900"
                      }`}
                    >
                      Import a Template
                    </h4>
                    <p
                      className={`text-sm mb-3 ${
                        theme === "dark" ? "text-white/70" : "text-gray-600"
                      }`}
                    >
                      Get pre-built checklists for your target country
                    </p>
                    <Link
                      href="/dashboard/templates"
                      className="text-purple-400 text-sm hover:text-purple-300 inline-flex items-center gap-1"
                    >
                      Browse Templates <FaArrowRight className="text-xs" />
                    </Link>
                  </div>
                  <div
                    className={`rounded-lg p-5 ${
                      theme === "dark"
                        ? "bg-[#0a0a0a]/50 border border-neutral-700/30"
                        : "bg-white border border-gray-200"
                    }`}
                  >
                    <div className="text-2xl font-bold text-green-400 mb-2">
                      3
                    </div>
                    <h4
                      className={`font-semibold mb-2 ${
                        theme === "dark" ? "text-white" : "text-gray-900"
                      }`}
                    >
                      Start Writing Essays
                    </h4>
                    <p
                      className={`text-sm mb-3 ${
                        theme === "dark" ? "text-white/70" : "text-gray-600"
                      }`}
                    >
                      Craft compelling essays for your applications
                    </p>
                    <Link
                      href="/dashboard/essays"
                      className="text-green-400 text-sm hover:text-green-300 inline-flex items-center gap-1"
                    >
                      Create Essay <FaArrowRight className="text-xs" />
                    </Link>
                  </div>
                </div>
              </div>
            )}
        </div>
      </div>
    </div>
  );
}
