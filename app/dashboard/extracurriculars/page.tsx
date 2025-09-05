"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Navbar from "../../../components/Navbar";
import Footer from "../../../components/Footer";
import AddExtracurricularModal from "../../../components/Modals/AddExtracurricularModal";
import EditExtracurricularModal from "../../../components/Modals/EditExtracurricularModal";
import { extracurricularsApi } from "../../../lib/api/extracurriculars";
import {
  Extracurricular,
  CreateExtracurricularDTO,
  UpdateExtracurricularDTO,
  ExtracurricularCategory,
} from "../../../lib/types";
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
  const [extracurriculars, setExtracurriculars] = useState<Extracurricular[]>(
    []
  );
  const [loading, setLoading] = useState(true);
  const [showAddActivityModal, setShowAddActivityModal] = useState(false);
  const [showEditActivityModal, setShowEditActivityModal] = useState(false);
  const [selectedActivity, setSelectedActivity] =
    useState<Extracurricular | null>(null);
  const { success: showSuccessToast, error: showErrorToast } = useToast();

  useEffect(() => {
    document.title = "Extracurriculars | Paccy";
    console.log("Extracurriculars page mounted");
    console.log(
      "Auth token in localStorage:",
      localStorage.getItem("auth-token")
    );
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

  const handleAddActivity = async (activityData: CreateExtracurricularDTO) => {
    console.log("handleAddActivity called with:", activityData);
    try {
      console.log("Making API call to create extracurricular...");
      const newActivity = await extracurricularsApi.create(activityData);
      console.log("API call successful, new activity:", newActivity);
      setExtracurriculars((prev) => [newActivity, ...prev]);
      setShowAddActivityModal(false);
      showSuccessToast("Extracurricular activity added successfully!");
    } catch (error) {
      console.error("Failed to add extracurricular:", error);
      showErrorToast("Failed to add extracurricular activity");
    }
  };

  const handleEditActivity = (activity: Extracurricular) => {
    setSelectedActivity(activity);
    setShowEditActivityModal(true);
  };

  const handleUpdateActivity = async (
    activityData: UpdateExtracurricularDTO
  ) => {
    if (!selectedActivity) return;

    console.log("handleUpdateActivity called with:", activityData);
    console.log("selectedActivity:", selectedActivity);
    try {
      console.log("Making API call to update extracurricular...");
      const updatedActivity = await extracurricularsApi.update(
        selectedActivity.id,
        activityData
      );
      console.log("API call successful, updated activity:", updatedActivity);
      setExtracurriculars((prev) =>
        prev.map((item) =>
          item.id === selectedActivity.id ? updatedActivity : item
        )
      );
      setShowEditActivityModal(false);
      setSelectedActivity(null);
      showSuccessToast("Extracurricular activity updated successfully!");
    } catch (error) {
      console.error("Failed to update extracurricular:", error);
      showErrorToast("Failed to update extracurricular activity");
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
        prev.filter((item) => item.id !== activityId)
      );
      showSuccessToast("Extracurricular activity deleted successfully!");
    } catch (error) {
      console.error("Failed to delete extracurricular:", error);
      showErrorToast("Failed to delete extracurricular activity");
    }
  };

  return (
    <div className="min-h-screen bg-[#141414] text-white">
      <Navbar />

      <div className="pt-24 pb-8 px-4">
        {/* Background decorative elements */}
        <div className="absolute top-20 left-10 w-32 h-32 bg-[#FEEBD8]/10 rounded-full blur-xl"></div>
        <div className="absolute bottom-32 right-16 w-48 h-48 bg-blue-400/10 rounded-full blur-xl"></div>
        <div className="absolute top-1/2 left-1/3 w-24 h-24 bg-purple-500/10 rounded-full blur-xl"></div>

        <div className="max-w-6xl mx-auto relative z-10">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <Link
                href="/dashboard"
                className="text-[#FEEBD8] hover:text-[#E5D5B7] transition-colors flex items-center gap-2 mb-4"
              >
                <FaArrowLeft />
                <span>Back to Dashboard</span>
              </Link>
              <h1 className="text-4xl font-bold text-[#FEEBD8]">
                Extracurricular Activities
              </h1>
              <p className="text-white/70 text-lg">
                Track and manage your extracurricular activities and
                achievements
              </p>
            </div>
            <button
              onClick={() => setShowAddActivityModal(true)}
              className="bg-[#FEEBD8] text-[#141414] px-6 py-3 rounded-lg font-medium hover:bg-[#E5D5B7] transition-colors flex items-center gap-2"
            >
              <FaPlus />
              <span>Add Activity</span>
            </button>
          </div>

          {/* Statistics */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-[#141414] border border-neutral-700/50 rounded-xl p-6 hover:border-[#FEEBD8]/30 transition-colors">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-2xl font-bold text-[#FEEBD8]">
                    {extracurriculars.length}
                  </p>
                  <p className="text-white/70 text-sm">Total Activities</p>
                </div>
                <FaUsers className="text-purple-400 text-2xl" />
              </div>
            </div>

            <div className="bg-[#141414] border border-neutral-700/50 rounded-xl p-6 hover:border-[#FEEBD8]/30 transition-colors">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-2xl font-bold text-[#FEEBD8]">
                    {extracurriculars.reduce(
                      (total, activity) => total + activity.hours_per_week,
                      0
                    )}
                  </p>
                  <p className="text-white/70 text-sm">Hours per Week</p>
                </div>
                <FaClock className="text-blue-400 text-2xl" />
              </div>
            </div>

            <div className="bg-[#141414] border border-neutral-700/50 rounded-xl p-6 hover:border-[#FEEBD8]/30 transition-colors">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-2xl font-bold text-[#FEEBD8]">
                    {
                      new Set(
                        extracurriculars.map((activity) => activity.category)
                      ).size
                    }
                  </p>
                  <p className="text-white/70 text-sm">Active Categories</p>
                </div>
                <FaStar className="text-yellow-400 text-2xl" />
              </div>
            </div>

            <div className="bg-[#141414] border border-neutral-700/50 rounded-xl p-6 hover:border-[#FEEBD8]/30 transition-colors">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-2xl font-bold text-[#FEEBD8]">
                    {extracurriculars.reduce(
                      (total, activity) =>
                        total + (activity.achievements?.length || 0),
                      0
                    )}
                  </p>
                  <p className="text-white/70 text-sm">Achievements</p>
                </div>
                <FaTrophy className="text-orange-400 text-2xl" />
              </div>
            </div>
          </div>

          {/* Activities List */}
          <div className="space-y-6">
            {loading ? (
              <div className="bg-[#141414] border border-neutral-700/50 rounded-xl p-12 text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#FEEBD8] mx-auto mb-4"></div>
                <p className="text-white/70">
                  Loading extracurricular activities...
                </p>
              </div>
            ) : extracurriculars.length === 0 ? (
              <div className="bg-[#141414] border border-neutral-700/50 rounded-xl p-12 text-center">
                <FaStar className="text-6xl text-white/30 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-[#FEEBD8] mb-2">
                  No Activities Yet
                </h3>
                <p className="text-white/70 mb-6">
                  Start building your profile by adding your extracurricular
                  activities, volunteer work, and achievements.
                </p>
                <button
                  onClick={() => setShowAddActivityModal(true)}
                  className="bg-[#FEEBD8] text-[#141414] px-6 py-3 rounded-lg font-medium hover:bg-[#E5D5B7] transition-colors flex items-center gap-2 mx-auto"
                >
                  <FaPlus />
                  <span>Add Your First Activity</span>
                </button>
              </div>
            ) : (
              extracurriculars.map((activity) => (
                <div
                  key={activity.id}
                  className="bg-[#141414] border border-neutral-700/50 rounded-xl p-6 hover:border-[#FEEBD8]/30 transition-colors"
                >
                  <div className="flex flex-col lg:flex-row gap-6">
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center gap-4">
                          <div className="text-3xl">
                            {categoryIcons[activity.category]}
                          </div>
                          <div>
                            <div className="flex items-center gap-3 mb-2">
                              <h3 className="text-xl font-semibold text-[#FEEBD8]">
                                {activity.activity_name}
                              </h3>
                              <span
                                className={`px-3 py-1 rounded-full text-xs font-medium ${
                                  categoryColors[activity.category]
                                }`}
                              >
                                {formatCategoryName(activity.category)}
                              </span>
                              {renderAiScoreBadge(activity.ai_score)}
                            </div>
                            <p className="text-white/80 font-medium">
                              {activity.position}
                              {activity.location && ` • ${activity.location}`}
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                        <div className="flex items-center gap-2 text-sm text-white/70">
                          <FaCalendarAlt />
                          <span>
                            {activity.start_date} -{" "}
                            {activity.end_date === "present"
                              ? "Present"
                              : activity.end_date}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-white/70">
                          <FaClock />
                          <span>{activity.hours_per_week} hours/week</span>
                        </div>
                        {activity.website && (
                          <div className="flex items-center gap-2 text-sm text-white/70">
                            <FaGlobe />
                            <a
                              href={activity.website}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-[#FEEBD8] hover:underline"
                            >
                              Website
                            </a>
                          </div>
                        )}
                      </div>

                      <p className="text-white/80 mb-4">
                        {activity.description}
                      </p>

                      {activity.achievements &&
                        activity.achievements.length > 0 && (
                          <div className="mb-4">
                            <h4 className="text-[#FEEBD8] font-medium mb-2 flex items-center gap-2">
                              <FaTrophy className="text-yellow-400" />
                              Key Achievements
                            </h4>
                            <ul className="space-y-1">
                              {activity.achievements?.map(
                                (achievement, index) => (
                                  <li
                                    key={index}
                                    className="text-white/80 text-sm flex items-center gap-2"
                                  >
                                    <div className="w-1.5 h-1.5 bg-[#FEEBD8] rounded-full" />
                                    {achievement}
                                  </li>
                                )
                              )}
                            </ul>
                          </div>
                        )}

                      {activity.skills && activity.skills.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                          {activity.skills.map((skill, index) => (
                            <span
                              key={index}
                              className="bg-[#2A2A2A] text-[#FEEBD8] px-3 py-1 rounded-full text-sm"
                            >
                              {skill}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>

                    <div className="flex lg:flex-col gap-2">
                      <button
                        onClick={() => handleEditActivity(activity)}
                        className="bg-[#FEEBD8] text-[#141414] px-4 py-2 rounded-lg font-medium hover:bg-[#E5D5B7] transition-colors flex items-center gap-2"
                      >
                        <FaEdit />
                        <span>Edit</span>
                      </button>
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
      </div>

      <Footer />

      {/* Modals */}
      {showAddActivityModal && (
        <AddExtracurricularModal
          isOpen={showAddActivityModal}
          onClose={() => setShowAddActivityModal(false)}
          onSave={handleAddActivity}
        />
      )}

      {showEditActivityModal && selectedActivity && (
        <EditExtracurricularModal
          isOpen={showEditActivityModal}
          onClose={() => {
            setShowEditActivityModal(false);
            setSelectedActivity(null);
          }}
          extracurricular={selectedActivity}
          onSave={handleUpdateActivity}
        />
      )}
    </div>
  );
}
