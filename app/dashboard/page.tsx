"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import { useAuth } from "../../components/AuthProvider";
import { collegeApplicationsApi } from "../../lib/api/college-applications";
import { essaysApi } from "../../lib/api/essays";
import { Essay, CollegeApplication, EssayStatus } from "../../lib/types";
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

// Mock user data - fallback when no real data is available
const mockUser = {
  name: "John Doe",
  email: "john@example.com",
  profileCompletion: 75,
  memberSince: "January 2025",
  applications: 3,
  saved: 8,
  profileViews: 12,
  school: "Not specified",
  graduationYear: "Not specified",
  bio: "No bio added yet",
  theme: "dark",
  verificationLevel: 1,
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

export default function Dashboard() {
  const router = useRouter();
  const { isAuthenticated, user, loading, verifyTokenAndFetchUser } = useAuth();

  // State for real data
  const [applications, setApplications] = useState<CollegeApplication[]>([]);
  const [essays, setEssays] = useState<Essay[]>([]);
  const [dataLoading, setDataLoading] = useState(true);

  useEffect(() => {
    document.title = "Dashboard | Paccy";
  }, []);

  // Load real data
  const loadDashboardData = async () => {
    try {
      setDataLoading(true);
      const [applicationsData, essaysData] = await Promise.all([
        collegeApplicationsApi.getAll().catch(() => []),
        essaysApi.getAll().catch(() => []),
      ]);
      setApplications(applicationsData);
      setEssays(essaysData);
    } catch (error) {
      console.warn("Failed to load dashboard data:", error);
      // Use empty arrays as fallback
      setApplications([]);
      setEssays([]);
    } finally {
      setDataLoading(false);
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

  const getTotalEssaysCount = () => {
    if (!essays || !Array.isArray(essays)) return 0;
    return essays.length;
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

  // Get current user data (real or mock)
  const getCurrentUser = () => {
    if (user) {
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
        applications: dataLoading ? "..." : getActiveApplicationsCount(),
        essays: dataLoading ? "..." : getEssaysInProgressCount(),
        totalEssays: dataLoading ? "..." : getTotalEssaysCount(),
        saved: 8, // Mock data - would come from API
        profileViews: 12, // Mock data - would come from API
        school: user.profile?.school || "Not specified",
        graduationYear: user.profile?.graduation_year || "Not specified",
        bio: user.profile?.bio || "No bio added yet",
        theme: user.preferences?.theme || "dark",
        verificationLevel: user.verification_level || 1,
      };
    }
    return {
      ...mockUser,
      applications: dataLoading ? "..." : getActiveApplicationsCount(),
      essays: dataLoading ? "..." : getEssaysInProgressCount(),
      totalEssays: dataLoading ? "..." : getTotalEssaysCount(),
    };
  };

  // Show loading state - only while auth is loading
  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
        <div className="text-center">
          <div className="text-[#FEEBD8] text-lg mb-4">
            Loading your dashboard...
          </div>
          <div className="text-[#FEEBD8]/60 text-sm">
            This should only take a moment
          </div>
        </div>
      </div>
    );
  }

  const currentUser = getCurrentUser();

  // Dynamic dashboard sections with real data
  const getDashboardSections = () => [
    {
      title: "College Tracker",
      description: "Manage your university applications",
      icon: <FaUniversity className="w-8 h-8" />,
      link: "/dashboard/colleges",
      stats: dataLoading
        ? "Loading..."
        : `${getActiveApplicationsCount()} Active Applications`,
    },
    {
      title: "Essay Manager",
      description: "Write and organize your essays",
      icon: <FaPen className="w-8 h-8" />,
      link: "/dashboard/essays",
      stats: dataLoading
        ? "Loading..."
        : `${getTotalEssaysCount()} Total • ${getEssaysInProgressCount()} in Progress`,
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
      stats: `Profile ${currentUser.profileCompletion}% Complete`,
    },
  ];

  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      <Navbar />

      <div className="max-w-screen-2xl mx-auto px-4 md:px-10 py-8 pt-28">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-[#FEEBD8] mb-2">
            Welcome back, {currentUser.name}! 👋
          </h1>
          <p className="text-[#FEEBD8]/70 text-lg">
            Let's continue building your future together.
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-[#141414] border border-neutral-700/50 rounded-lg p-6 hover:border-[#FEEBD8]/30 transition-colors">
            <div className="text-2xl font-bold text-[#FEEBD8] mb-1">
              {currentUser.applications}
            </div>
            <div className="text-[#FEEBD8]/70 text-sm">Active Applications</div>
          </div>

          <div className="bg-[#141414] border border-neutral-700/50 rounded-lg p-6 hover:border-[#FEEBD8]/30 transition-colors">
            <div className="text-2xl font-bold text-[#FEEBD8] mb-1">
              {currentUser.totalEssays}
            </div>
            <div className="text-[#FEEBD8]/70 text-sm">Total Essays</div>
          </div>

          <div className="bg-[#141414] border border-neutral-700/50 rounded-lg p-6 hover:border-[#FEEBD8]/30 transition-colors">
            <div className="text-2xl font-bold text-[#FEEBD8] mb-1">
              {currentUser.essays}
            </div>
            <div className="text-[#FEEBD8]/70 text-sm">Essays in Progress</div>
          </div>

          <div className="bg-[#141414] border border-neutral-700/50 rounded-lg p-6 hover:border-[#FEEBD8]/30 transition-colors">
            <div className="text-2xl font-bold text-[#FEEBD8] mb-1">
              {currentUser.profileCompletion}%
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
            {getDashboardSections().map((section, index) => (
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
              <span>{currentUser.profileCompletion}%</span>
            </div>
            <div className="w-full bg-neutral-700 rounded-full h-2">
              <div
                className="bg-gradient-to-r from-[#FEEBD8] to-[#E5D5B7] h-2 rounded-full transition-all duration-300"
                style={{ width: `${currentUser.profileCompletion}%` }}
              ></div>
            </div>
          </div>
          {user && (
            <div className="mb-4 space-y-2 text-sm text-[#FEEBD8]/70">
              <div>School: {currentUser.school}</div>
              <div>Graduation Year: {currentUser.graduationYear}</div>
              <div>Member Since: {currentUser.memberSince}</div>
              {user.verification_level && (
                <div>Verification Level: {user.verification_level}</div>
              )}
            </div>
          )}
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
