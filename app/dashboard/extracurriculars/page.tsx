"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Footer from "../../../components/Footer";
import { useTheme } from "../../../components/ThemeProvider";
import { extracurricularsApi } from "../../../lib/api/extracurriculars";
import { Extracurricular } from "../../../lib/types";
import { useToast } from "../../../lib/hooks/useToast";
import {
  FaArrowLeft,
  FaUsers,
  FaPlus,
  FaEdit,
  FaTrash,
  FaTrophy,
  FaClock,
  FaCalendarAlt,
  FaStar,
  FaHeart,
  FaBriefcase,
  FaGraduationCap,
  FaMusic,
  FaRunning,
  FaGlobe,
  FaEye,
  FaTimes,
} from "react-icons/fa";

// Category icons mapping

const categoryIcons: Record<string, React.ReactNode> = {
  academic: <FaGraduationCap className="text-blue-400" />,
  sports: <FaRunning className="text-green-400" />,
  music: <FaMusic className="text-purple-400" />,
  arts: <FaMusic className="text-purple-400" />,
  community_service: <FaHeart className="text-red-400" />,
  leadership: <FaTrophy className="text-yellow-400" />,
  technology: <FaBriefcase className="text-cyan-400" />,
  volunteering: <FaHeart className="text-red-400" />,
  clubs: <FaUsers className="text-cyan-400" />,
  work_experience: <FaBriefcase className="text-orange-400" />,
  research: <FaGraduationCap className="text-blue-400" />,
  other: <FaStar className="text-gray-400" />,
};

const impactColors: Record<string, string> = {
  High: "bg-green-500",
  Medium: "bg-yellow-500",
  Low: "bg-blue-500",
};

const categoryColors: Record<string, string> = {
  academic: "bg-blue-500/20 text-blue-400",
  sports: "bg-green-500/20 text-green-400",
  music: "bg-purple-500/20 text-purple-400",
  arts: "bg-purple-500/20 text-purple-400",
  community_service: "bg-red-500/20 text-red-400",
  leadership: "bg-yellow-500/20 text-yellow-400",
  technology: "bg-cyan-500/20 text-cyan-400",
  volunteering: "bg-red-500/20 text-red-400",
  clubs: "bg-cyan-500/20 text-cyan-400",
  work_experience: "bg-orange-500/20 text-orange-400",
  research: "bg-blue-500/20 text-blue-400",
  other: "bg-gray-500/20 text-gray-400",
};

// AI Score styling configuration
const aiScoreConfig: Record<
  string,
  { bg: string; text: string; border: string; icon: string; label: string }
> = {
  high: {
    bg: "bg-emerald-500/20",
    text: "text-emerald-400",
    border: "border-emerald-500/30",
    icon: "⭐",
    label: "High Impact",
  },
  medium: {
    bg: "bg-amber-500/20",
    text: "text-amber-400",
    border: "border-amber-500/30",
    icon: "✨",
    label: "Medium Impact",
  },
  low: {
    bg: "bg-slate-500/20",
    text: "text-slate-400",
    border: "border-slate-500/30",
    icon: "💫",
    label: "Low Impact",
  },
};

// Helper function to format category names for display
const formatCategoryName = (category: string) => {
  return category.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase());
};

// Helper function to render AI score badge
const renderAiScoreBadge = (aiScore?: string) => {
  if (!aiScore || !["high", "medium", "low"].includes(aiScore.toLowerCase())) {
    return null;
  }

  const scoreKey = aiScore.toLowerCase() as "high" | "medium" | "low";
  const config = aiScoreConfig[scoreKey];

  return (
    <div
      className={`px-3 py-1 rounded-full text-xs font-medium ${config.bg} ${config.text} border ${config.border} flex items-center gap-1.5 shadow-sm`}
    >
      <span className="text-sm">{config.icon}</span>
      <span>{config.label}</span>
    </div>
  );
};

export default function ExtracurricularsPage() {
  const router = useRouter();
  const { theme } = useTheme();
  const [extracurriculars, setExtracurriculars] = useState<Extracurricular[]>(
    [],
  );
  const [loading, setLoading] = useState(true);
  const [previewActivity, setPreviewActivity] =
    useState<Extracurricular | null>(null);
  const { success: showSuccessToast, error: showErrorToast } = useToast();

  useEffect(() => {
    document.title = "Extracurriculars | Paccy";
    loadExtracurriculars();
  }, []);

  const loadExtracurriculars = async () => {
    try {
      setLoading(true);
      const data = await extracurricularsApi.getAll();
      setExtracurriculars(data);
    } catch (error) {
      console.error("Failed to load extracurriculars:", error);
      showErrorToast("Failed to load extracurricular activities");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteActivity = async (activityId: string) => {
    if (
      !confirm("Are you sure you want to delete this extracurricular activity?")
    ) {
      return;
    }

    try {
      await extracurricularsApi.delete(activityId);
      setExtracurriculars((prev) =>
        prev.filter((item) => item.id !== activityId),
      );
      showSuccessToast("Extracurricular activity deleted successfully!");
    } catch (error) {
      console.error("Failed to delete extracurricular:", error);
      showErrorToast("Failed to delete extracurricular activity");
    }
  };

  return (
    <div
      className={`min-h-screen ${
        theme === "dark"
          ? "bg-[#0a0a0a] text-white"
          : "bg-gray-50 text-gray-900"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Link
              href="/dashboard"
              className={`${
                theme === "dark"
                  ? "text-white/70 hover:text-white"
                  : "text-gray-600 hover:text-gray-900"
              } transition-colors`}
            >
              <FaArrowLeft size={20} />
            </Link>
            <div className="flex-1 min-w-0">
              <h1
                className={`text-2xl sm:text-3xl lg:text-4xl font-bold ${
                  theme === "dark" ? "text-white" : "text-gray-900"
                }`}
              >
                Extracurricular Activities
              </h1>
              <p
                className={`mt-2 text-sm sm:text-base ${
                  theme === "dark" ? "text-white/70" : "text-gray-600"
                }`}
              >
                Track and manage your extracurricular activities and
                achievements
              </p>
            </div>
          </div>
          <Link
            href="/dashboard/extracurriculars/new"
            className="bg-gradient-to-r from-green-500 to-green-600 text-white px-6 py-3 rounded-xl font-semibold hover:from-green-600 hover:to-green-700 transition-all duration-300 hover:shadow-lg hover:shadow-green-500/20 flex items-center gap-2"
          >
            <FaPlus />
            <span>New Activity</span>
          </Link>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6 sm:mb-8">
          <div
            className={`bg-gradient-to-br ${
              theme === "dark"
                ? "from-[#141414] to-[#1a1a1a] border-neutral-700/50"
                : "from-gray-50 to-gray-100 border-gray-200"
            } border rounded-lg sm:rounded-xl p-4 sm:p-6`}
          >
            <div className="flex items-center justify-between">
              <div>
                <div
                  className={`text-2xl sm:text-3xl font-bold mb-0.5 sm:mb-1 ${
                    theme === "dark" ? "text-white" : "text-gray-900"
                  }`}
                >
                  {extracurriculars.length}
                </div>
                <div
                  className={`text-xs sm:text-sm ${
                    theme === "dark" ? "text-white/60" : "text-gray-600"
                  }`}
                >
                  Total Activities
                </div>
              </div>
              <div className="p-2 sm:p-3 bg-purple-500/10 rounded-lg">
                <FaUsers className="text-xl sm:text-2xl text-purple-400" />
              </div>
            </div>
          </div>

          <div
            className={`bg-gradient-to-br ${
              theme === "dark"
                ? "from-[#141414] to-[#1a1a1a] border-neutral-700/50"
                : "from-gray-50 to-gray-100 border-gray-200"
            } border rounded-xl p-6`}
          >
            <div className="flex items-center justify-between">
              <div>
                <div className="text-3xl font-bold text-blue-400 mb-1">
                  {extracurriculars.reduce(
                    (total, activity) => total + activity.hours_per_week,
                    0,
                  )}
                </div>
                <div
                  className={`text-sm ${
                    theme === "dark" ? "text-white/60" : "text-gray-600"
                  }`}
                >
                  Hours per Week
                </div>
              </div>
              <div className="p-3 bg-blue-500/10 rounded-lg">
                <FaClock className="text-2xl text-blue-400" />
              </div>
            </div>
          </div>

          <div
            className={`bg-gradient-to-br ${
              theme === "dark"
                ? "from-[#141414] to-[#1a1a1a] border-neutral-700/50"
                : "from-gray-50 to-gray-100 border-gray-200"
            } border rounded-xl p-6`}
          >
            <div className="flex items-center justify-between">
              <div>
                <div className="text-3xl font-bold text-yellow-400 mb-1">
                  {
                    new Set(
                      extracurriculars.map((activity) => activity.category),
                    ).size
                  }
                </div>
                <div
                  className={`text-sm ${
                    theme === "dark" ? "text-white/60" : "text-gray-600"
                  }`}
                >
                  Active Categories
                </div>
              </div>
              <div className="p-3 bg-yellow-500/10 rounded-lg">
                <FaStar className="text-2xl text-yellow-400" />
              </div>
            </div>
          </div>

          <div
            className={`bg-gradient-to-br ${
              theme === "dark"
                ? "from-[#141414] to-[#1a1a1a] border-neutral-700/50 hover:border-blue-500/30"
                : "from-gray-50 to-gray-100 border-gray-200 hover:border-blue-400"
            } border rounded-xl p-6 transition-colors`}
          >
            <div className="flex items-center justify-between mb-3">
              <div className="p-2 bg-green-500/10 rounded-lg">
                <FaTrophy className="text-green-400" />
              </div>
            </div>
            <div
              className={`text-2xl font-bold ${
                theme === "dark" ? "text-white" : "text-gray-900"
              }`}
            >
              {extracurriculars.reduce(
                (total, activity) =>
                  total + (activity.achievements?.length || 0),
                0,
              )}
            </div>
            <div
              className={`text-sm ${
                theme === "dark" ? "text-white/70" : "text-gray-600"
              }`}
            >
              Achievements
            </div>
          </div>
        </div>

        {/* Activities List */}
        <div className="space-y-6">
          {loading ? (
            <div
              className={`bg-gradient-to-br ${
                theme === "dark"
                  ? "from-[#141414] to-[#1a1a1a] border-neutral-700/50"
                  : "from-gray-50 to-gray-100 border-gray-200"
              } border rounded-xl p-12 text-center`}
            >
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
              <p
                className={`${
                  theme === "dark" ? "text-white/70" : "text-gray-600"
                }`}
              >
                Loading extracurricular activities...
              </p>
            </div>
          ) : extracurriculars.length === 0 ? (
            <div
              className={`bg-gradient-to-br ${
                theme === "dark"
                  ? "from-[#141414] to-[#1a1a1a] border-neutral-700/50"
                  : "from-gray-50 to-gray-100 border-gray-200"
              } border rounded-xl p-12 text-center`}
            >
              <FaStar
                className={`text-6xl mx-auto mb-4 ${
                  theme === "dark" ? "text-white/30" : "text-gray-300"
                }`}
              />
              <h3
                className={`text-xl font-semibold mb-2 ${
                  theme === "dark" ? "text-white" : "text-gray-900"
                }`}
              >
                No Activities Yet
              </h3>
              <p
                className={`mb-6 ${
                  theme === "dark" ? "text-white/70" : "text-gray-600"
                }`}
              >
                Start building your profile by adding your extracurricular
                activities, volunteer work, and achievements.
              </p>
              <Link
                href="/dashboard/extracurriculars/new"
                className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg font-medium transition-colors flex items-center gap-2 mx-auto"
              >
                <FaPlus />
                <span>Add Your First Activity</span>
              </Link>
            </div>
          ) : (
            extracurriculars.map((activity) => (
              <div
                key={activity.id}
                className={`group bg-gradient-to-br ${
                  theme === "dark"
                    ? "from-[#141414] to-[#1a1a1a] border-neutral-700/50 hover:border-green-500/50"
                    : "from-gray-50 to-gray-100 border-gray-200 hover:border-green-400"
                } border rounded-lg sm:rounded-xl p-4 sm:p-6 hover:shadow-lg hover:shadow-green-500/10 transition-all duration-300`}
              >
                <div className="flex flex-col lg:flex-row gap-4 sm:gap-6">
                  <div className="flex-1">
                    <div className="flex flex-col sm:flex-row items-start justify-between gap-3 sm:gap-4 mb-3 sm:mb-4">
                      <div className="flex items-start gap-3 sm:gap-4 w-full sm:w-auto">
                        <div className="p-2 sm:p-3 bg-green-500/10 rounded-lg flex-shrink-0 group-hover:bg-green-500/20 transition-colors">
                          {categoryIcons[activity.category]}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex flex-wrap items-center gap-2 sm:gap-3 mb-1 sm:mb-2">
                            <h3
                              className={`text-base sm:text-lg md:text-xl font-semibold group-hover:text-green-400 transition-colors break-words ${
                                theme === "dark"
                                  ? "text-white"
                                  : "text-gray-900"
                              }`}
                            >
                              {activity.activity_name}
                            </h3>
                            <span
                              className={`px-2 sm:px-3 py-0.5 sm:py-1 rounded-full text-[10px] sm:text-xs font-medium ${
                                categoryColors[activity.category]
                              }`}
                            >
                              {formatCategoryName(activity.category)}
                            </span>
                            {renderAiScoreBadge(activity.ai_score)}
                          </div>
                          <p
                            className={`font-medium text-xs sm:text-sm md:text-base break-words ${
                              theme === "dark"
                                ? "text-white/80"
                                : "text-gray-700"
                            }`}
                          >
                            {activity.position}
                            {activity.location && ` • ${activity.location}`}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 sm:gap-4 mb-3 sm:mb-4">
                      <div
                        className={`flex items-center gap-2 text-xs sm:text-sm ${
                          theme === "dark" ? "text-white/70" : "text-gray-600"
                        }`}
                      >
                        <FaCalendarAlt />
                        <span>
                          {activity.start_date} -{" "}
                          {activity.end_date === "present"
                            ? "Present"
                            : activity.end_date}
                        </span>
                      </div>
                      <div
                        className={`flex items-center gap-2 text-sm ${
                          theme === "dark" ? "text-white/70" : "text-gray-600"
                        }`}
                      >
                        <FaClock />
                        <span>{activity.hours_per_week} hours/week</span>
                      </div>
                      {activity.website && (
                        <div
                          className={`flex items-center gap-2 text-sm ${
                            theme === "dark" ? "text-white/70" : "text-gray-600"
                          }`}
                        >
                          <FaGlobe />
                          <a
                            href={activity.website}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={`hover:underline ${
                              theme === "dark" ? "text-white" : "text-gray-900"
                            }`}
                          >
                            Website
                          </a>
                        </div>
                      )}
                    </div>

                    <p
                      className={`mb-3 sm:mb-4 text-sm sm:text-base ${
                        theme === "dark" ? "text-white/80" : "text-gray-700"
                      }`}
                    >
                      {activity.description}
                    </p>

                    {activity.achievements &&
                      activity.achievements.length > 0 && (
                        <div className="mb-4">
                          <h4
                            className={`font-medium mb-2 flex items-center gap-2 ${
                              theme === "dark" ? "text-white" : "text-gray-900"
                            }`}
                          >
                            <FaTrophy className="text-yellow-400" />
                            Key Achievements
                          </h4>
                          <ul className="space-y-1">
                            {activity.achievements?.map(
                              (achievement, index) => (
                                <li
                                  key={index}
                                  className={`text-sm flex items-center gap-2 ${
                                    theme === "dark"
                                      ? "text-white/80"
                                      : "text-gray-700"
                                  }`}
                                >
                                  <div className="w-1.5 h-1.5 bg-blue-500 rounded-full" />
                                  {achievement}
                                </li>
                              ),
                            )}
                          </ul>
                        </div>
                      )}

                    {activity.skills && activity.skills.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {activity.skills.map((skill, index) => (
                          <span
                            key={index}
                            className={`px-3 py-1 rounded-full text-sm border ${
                              theme === "dark"
                                ? "bg-neutral-800/50 text-white border-neutral-700/30"
                                : "bg-gray-100 text-gray-900 border-gray-300"
                            }`}
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="flex lg:flex-col gap-2">
                    <button
                      onClick={() => setPreviewActivity(activity)}
                      className="bg-blue-500/10 text-blue-400 px-4 py-2 rounded-lg font-medium hover:bg-blue-500/20 transition-colors flex items-center gap-2 border border-blue-500/30"
                    >
                      <FaEye />
                      <span>View</span>
                    </button>
                    <Link
                      href={`/dashboard/extracurriculars/${activity.id}`}
                      className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2"
                    >
                      <FaEdit />
                      <span>Edit</span>
                    </Link>
                    <button
                      onClick={() => handleDeleteActivity(activity.id)}
                      className="bg-red-500/20 text-red-400 px-4 py-2 rounded-lg font-medium hover:bg-red-500/30 transition-colors flex items-center gap-2 border border-red-500/30"
                    >
                      <FaTrash />
                      <span>Remove</span>
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Preview Modal */}
      {previewActivity && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div
            className={`bg-gradient-to-br ${
              theme === "dark"
                ? "from-[#141414] to-[#1a1a1a] border-neutral-700/50"
                : "from-gray-50 to-gray-100 border-gray-200"
            } border rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto`}
          >
            {/* Modal Header */}
            <div
              className={`sticky top-0 bg-gradient-to-br ${
                theme === "dark"
                  ? "from-[#141414] to-[#1a1a1a] border-neutral-700/50"
                  : "from-gray-50 to-gray-100 border-gray-200"
              } border-b p-6 flex items-center justify-between`}
            >
              <div className="flex items-center gap-4">
                <div className="text-3xl">
                  {categoryIcons[previewActivity.category]}
                </div>
                <div>
                  <h2
                    className={`text-2xl font-bold ${
                      theme === "dark" ? "text-white" : "text-gray-900"
                    }`}
                  >
                    {previewActivity.activity_name}
                  </h2>
                  <p
                    className={`${
                      theme === "dark" ? "text-white/70" : "text-gray-600"
                    }`}
                  >
                    {previewActivity.position}
                    {previewActivity.location &&
                      ` • ${previewActivity.location}`}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setPreviewActivity(null)}
                className={`transition-colors p-2 ${
                  theme === "dark"
                    ? "text-white/70 hover:text-white"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                <FaTimes size={24} />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6 space-y-6">
              {/* Category and AI Score */}
              <div className="flex items-center gap-3">
                <span
                  className={`px-3 py-1 rounded-full text-xs font-medium ${
                    categoryColors[previewActivity.category]
                  }`}
                >
                  {formatCategoryName(previewActivity.category)}
                </span>
                {renderAiScoreBadge(previewActivity.ai_score)}
              </div>

              {/* Time Details */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div
                  className={`rounded-lg p-4 ${
                    theme === "dark" ? "bg-neutral-800/30" : "bg-gray-100"
                  }`}
                >
                  <div
                    className={`flex items-center gap-2 text-sm mb-1 ${
                      theme === "dark" ? "text-white/70" : "text-gray-600"
                    }`}
                  >
                    <FaCalendarAlt />
                    <span>Duration</span>
                  </div>
                  <div
                    className={`font-medium ${
                      theme === "dark" ? "text-white" : "text-gray-900"
                    }`}
                  >
                    {previewActivity.start_date} -{" "}
                    {previewActivity.end_date === "present"
                      ? "Present"
                      : previewActivity.end_date}
                  </div>
                </div>
                <div
                  className={`rounded-lg p-4 ${
                    theme === "dark" ? "bg-neutral-800/30" : "bg-gray-100"
                  }`}
                >
                  <div
                    className={`flex items-center gap-2 text-sm mb-1 ${
                      theme === "dark" ? "text-white/70" : "text-gray-600"
                    }`}
                  >
                    <FaClock />
                    <span>Time Commitment</span>
                  </div>
                  <div
                    className={`font-medium ${
                      theme === "dark" ? "text-white" : "text-gray-900"
                    }`}
                  >
                    {previewActivity.hours_per_week} hours/week
                  </div>
                </div>
                {previewActivity.website && (
                  <div
                    className={`rounded-lg p-4 ${
                      theme === "dark" ? "bg-neutral-800/30" : "bg-gray-100"
                    }`}
                  >
                    <div
                      className={`flex items-center gap-2 text-sm mb-1 ${
                        theme === "dark" ? "text-white/70" : "text-gray-600"
                      }`}
                    >
                      <FaGlobe />
                      <span>Website</span>
                    </div>
                    <a
                      href={previewActivity.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-400 hover:text-blue-300 font-medium"
                    >
                      Visit
                    </a>
                  </div>
                )}
              </div>

              {/* Description */}
              {previewActivity.description && (
                <div>
                  <h3
                    className={`font-semibold mb-2 ${
                      theme === "dark" ? "text-white" : "text-gray-900"
                    }`}
                  >
                    Description
                  </h3>
                  <p
                    className={`leading-relaxed ${
                      theme === "dark" ? "text-white/80" : "text-gray-700"
                    }`}
                  >
                    {previewActivity.description}
                  </p>
                </div>
              )}

              {/* Achievements */}
              {previewActivity.achievements &&
                previewActivity.achievements.length > 0 && (
                  <div>
                    <h3
                      className={`font-semibold mb-3 flex items-center gap-2 ${
                        theme === "dark" ? "text-white" : "text-gray-900"
                      }`}
                    >
                      <FaTrophy className="text-yellow-400" />
                      Key Achievements
                    </h3>
                    <ul className="space-y-2">
                      {previewActivity.achievements.map(
                        (achievement, index) => (
                          <li
                            key={index}
                            className={`flex items-start gap-3 ${
                              theme === "dark"
                                ? "text-white/80"
                                : "text-gray-700"
                            }`}
                          >
                            <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 flex-shrink-0" />
                            <span>{achievement}</span>
                          </li>
                        ),
                      )}
                    </ul>
                  </div>
                )}

              {/* Skills */}
              {previewActivity.skills && previewActivity.skills.length > 0 && (
                <div>
                  <h3
                    className={`font-semibold mb-3 ${
                      theme === "dark" ? "text-white" : "text-gray-900"
                    }`}
                  >
                    Skills Developed
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {previewActivity.skills.map((skill, index) => (
                      <span
                        key={index}
                        className={`px-4 py-2 rounded-lg text-sm border ${
                          theme === "dark"
                            ? "bg-neutral-800/50 text-white border-neutral-700/50"
                            : "bg-gray-100 text-gray-900 border-gray-300"
                        }`}
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div
                className={`flex gap-3 pt-4 border-t ${
                  theme === "dark" ? "border-neutral-700/50" : "border-gray-200"
                }`}
              >
                <Link
                  href={`/dashboard/extracurriculars/${previewActivity.id}`}
                  className="flex-1 bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold transition-colors flex items-center justify-center gap-2"
                >
                  <FaEdit />
                  <span>Edit Activity</span>
                </Link>
                <button
                  onClick={() => setPreviewActivity(null)}
                  className={`px-6 py-3 rounded-lg font-semibold transition-colors ${
                    theme === "dark"
                      ? "bg-neutral-800 hover:bg-neutral-700 text-white"
                      : "bg-gray-200 hover:bg-gray-300 text-gray-900"
                  }`}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
