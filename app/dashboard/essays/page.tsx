"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import Navbar from "../../../components/Navbar";
import Footer from "../../../components/Footer";
import AddEssayModal from "../../../components/Modals/AddEssayModal";
import EditEssayModal from "../../../components/Modals/EditEssayModal";
import PreviewEssayModal from "../../../components/Modals/PreviewEssayModal";
import { useToast } from "../../../lib/hooks/useToast";
import { essaysApi } from "../../../lib/api/essays";
import { collegeApplicationsApi } from "../../../lib/api/college-applications";
import { Essay, EssayStatus, CollegeApplication } from "../../../lib/types";
import {
  FaPlus,
  FaSearch,
  FaEdit,
  FaTrash,
  FaEye,
  FaArrowLeft,
  FaClock,
  FaCheckCircle,
  FaExclamationTriangle,
} from "react-icons/fa";

const statusColors: Record<string, string> = {
  not_started: "bg-gray-500",
  in_progress: "bg-yellow-500",
  not_submitted: "bg-orange-500",
  review_needed: "bg-blue-500",
  submitted: "bg-green-500",
  completed: "bg-emerald-500",
};

const getStatusIcon = (status: string) => {
  switch (status) {
    case "completed":
    case "submitted":
      return <FaCheckCircle className="text-green-400" />;
    case "review_needed":
      return <FaExclamationTriangle className="text-blue-400" />;
    case "not_submitted":
      return <FaExclamationTriangle className="text-orange-400" />;
    case "in_progress":
      return <FaClock className="text-yellow-400" />;
    default:
      return <FaClock className="text-gray-400" />;
  }
};

const getStatusDisplayName = (status: string) => {
  const statusMap: Record<string, string> = {
    not_started: "Not Started",
    in_progress: "In Progress",
    not_submitted: "Not Submitted",
    review_needed: "Review Needed",
    submitted: "Submitted",
    completed: "Completed",
  };
  return statusMap[status] || status;
};

export default function EssayManager() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
          <div className="text-[#FEEBD8] text-lg">Loading essays...</div>
        </div>
      }
    >
      <EssayManagerContent />
    </Suspense>
  );
}

function EssayManagerContent() {
  const { success: showSuccess, error: showError } = useToast();
  const searchParams = useSearchParams();
  const router = useRouter();
  const [essays, setEssays] = useState<Essay[]>([]);
  const [colleges, setColleges] = useState<CollegeApplication[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("All");
  const [filterCollege, setFilterCollege] = useState("All");
  const [isAddEssayModalOpen, setIsAddEssayModalOpen] = useState(false);
  const [isEditEssayModalOpen, setIsEditEssayModalOpen] = useState(false);
  const [isPreviewEssayModalOpen, setIsPreviewEssayModalOpen] = useState(false);
  const [selectedEssay, setSelectedEssay] = useState<Essay | null>(null);

  useEffect(() => {
    document.title = "Essay Manager | Paccy";
    loadData();
  }, []);

  // Handle URL parameters for filtering
  useEffect(() => {
    const collegeParam = searchParams.get("college");
    const majorParam = searchParams.get("major");

    if (collegeParam) {
      // If both college and major are provided, create the bracketed format
      if (majorParam) {
        setFilterCollege(
          `${decodeURIComponent(collegeParam)} [${decodeURIComponent(
            majorParam
          )}]`
        );
      } else {
        setFilterCollege(decodeURIComponent(collegeParam));
      }
    }
  }, [searchParams]);

  const loadData = async () => {
    try {
      setIsLoading(true);
      const [essaysData, collegesData] = await Promise.all([
        essaysApi.getAll(),
        collegeApplicationsApi.getAll(),
      ]);
      setEssays(essaysData);
      setColleges(collegesData);
    } catch (error) {
      console.error("Failed to load data:", error);
      showError("Failed to load essays and college applications");
    } finally {
      setIsLoading(false);
    }
  };

  // Handle college filter change and clear URL parameters
  const handleCollegeFilterChange = (value: string) => {
    setFilterCollege(value);

    // Clear URL parameters when user manually changes filter
    if (searchParams.get("college") || searchParams.get("major")) {
      const url = new URL(window.location.href);
      url.searchParams.delete("college");
      url.searchParams.delete("major");
      router.replace(url.pathname, { scroll: false });
    }
  };

  const filteredEssays = essays.filter((essay) => {
    const matchesSearch =
      essay.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (essay.college_name &&
        essay.college_name.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesStatus =
      filterStatus === "All" || essay.status === filterStatus;
    const matchesCollege =
      filterCollege === "All" ||
      (() => {
        // If filter has brackets (college + major), match exactly
        if (filterCollege.includes("[")) {
          const collegeApp = colleges.find(
            (c) => c.id === essay.college_application_id
          );
          if (collegeApp) {
            const expectedFormat = `${collegeApp.name} [${collegeApp.major}]`;
            return expectedFormat === filterCollege;
          }
          return false;
        }
        // Otherwise, match just by college name
        return essay.college_name === filterCollege;
      })();

    return matchesSearch && matchesStatus && matchesCollege;
  });

  const getWordCountColor = (current: number, max: number) => {
    const percentage = (current / max) * 100;
    if (percentage >= 95) return "text-red-400";
    if (percentage >= 80) return "text-yellow-400";
    return "text-green-400";
  };

  const getAIScoreColor = (score: number) => {
    if (score >= 8) return "text-green-400";
    if (score >= 6) return "text-yellow-400";
    return "text-red-400";
  };

  const collegeNames = Array.from(
    new Set(
      essays
        .map((essay) => {
          if (!essay.college_name) return null;

          // Find college application to get major
          const collegeApp = colleges.find(
            (c) => c.id === essay.college_application_id
          );

          // Check if there are multiple applications with the same college name
          const sameName = colleges.filter(
            (c) => c.name === essay.college_name
          );

          if (sameName.length > 1 && collegeApp?.major) {
            return `${essay.college_name} [${collegeApp.major}]`;
          }

          return essay.college_name;
        })
        .filter(Boolean)
    )
  ).filter((name): name is string => name !== null);

  const handleAddEssay = async (newEssayData: any) => {
    try {
      const createdEssay = await essaysApi.create({
        title: newEssayData.title,
        college_application_id: newEssayData.college_application_id,
        status: newEssayData.status || EssayStatus.NOT_STARTED,
        prompt: newEssayData.prompt,
        content: newEssayData.content,
      });
      setEssays((prev) => [...prev, createdEssay]);
      showSuccess("Essay created successfully!");
    } catch (error) {
      console.error("Failed to create essay:", error);
      showError("Failed to create essay");
    }
  };

  const handleEditEssay = async (updatedEssay: Essay) => {
    try {
      const updated = await essaysApi.update(updatedEssay.id, {
        title: updatedEssay.title,
        status: updatedEssay.status,
        prompt: updatedEssay.prompt,
        content: updatedEssay.content,
      });
      setEssays((prev) =>
        prev.map((essay) => (essay.id === updated.id ? updated : essay))
      );
      setSelectedEssay(null);
      showSuccess("Essay updated successfully!");
    } catch (error) {
      console.error("Failed to update essay:", error);
      showError("Failed to update essay");
    }
  };

  const handleDeleteEssay = async (essayId: string) => {
    if (!confirm("Are you sure you want to delete this essay?")) {
      return;
    }

    try {
      await essaysApi.delete(essayId);
      setEssays((prev) => prev.filter((essay) => essay.id !== essayId));
      showSuccess("Essay deleted successfully!");
    } catch (error) {
      console.error("Failed to delete essay:", error);
      showError("Failed to delete essay");
    }
  };

  const handleEditClick = (essay: any) => {
    setSelectedEssay(essay);
    setIsEditEssayModalOpen(true);
  };

  const handlePreviewClick = (essay: any) => {
    setSelectedEssay(essay);
    setIsPreviewEssayModalOpen(true);
  };

  const handlePreviewEdit = () => {
    setIsPreviewEssayModalOpen(false);
    setIsEditEssayModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      <Navbar />

      <div className="max-w-screen-2xl mx-auto px-4 md:px-10 py-8 pt-28">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <Link
              href="/dashboard"
              className="text-[#FEEBD8]/70 hover:text-[#FEEBD8] transition-colors"
            >
              <FaArrowLeft size={20} />
            </Link>
            <div>
              <h1 className="text-4xl font-bold text-[#FEEBD8]">
                Essay Manager
              </h1>
              <p className="text-[#FEEBD8]/70 mt-2">
                Write and organize your application essays
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsAddEssayModalOpen(true)}
            className="bg-[#FEEBD8] text-[#141414] px-6 py-3 rounded-lg font-medium hover:bg-[#E5D5B7] transition-colors flex items-center space-x-2"
          >
            <FaPlus />
            <span>New Essay</span>
          </button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-[#141414] border border-neutral-700/50 rounded-lg p-6">
            <div className="text-2xl font-bold text-[#FEEBD8] mb-1">
              {essays.length}
            </div>
            <div className="text-[#FEEBD8]/70 text-sm">Total Essays</div>
          </div>

          <div className="bg-[#141414] border border-neutral-700/50 rounded-lg p-6">
            <div className="text-2xl font-bold text-green-400 mb-1">
              {essays.filter((e) => e.status === EssayStatus.COMPLETED).length}
            </div>
            <div className="text-[#FEEBD8]/70 text-sm">Complete</div>
          </div>

          <div className="bg-[#141414] border border-neutral-700/50 rounded-lg p-6">
            <div className="text-2xl font-bold text-yellow-400 mb-1">
              {
                essays.filter((e) => e.status === EssayStatus.IN_PROGRESS)
                  .length
              }
            </div>
            <div className="text-[#FEEBD8]/70 text-sm">In Progress</div>
          </div>

          <div className="bg-[#141414] border border-neutral-700/50 rounded-lg p-6">
            <div className="text-2xl font-bold text-orange-400 mb-1">
              {
                essays.filter((e) => e.status === EssayStatus.REVIEW_NEEDED)
                  .length
              }
            </div>
            <div className="text-[#FEEBD8]/70 text-sm">Need Review</div>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="bg-[#141414] border border-neutral-700/50 rounded-lg p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#FEEBD8]/50" />
              <input
                type="text"
                placeholder="Search essays by title or college..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-neutral-800 border border-neutral-700 rounded-lg pl-10 pr-4 py-2 text-[#FEEBD8] focus:outline-none focus:border-[#FEEBD8]"
              />
            </div>

            {/* Status Filter */}
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="bg-neutral-800 border border-neutral-700 rounded-lg px-4 py-2 text-[#FEEBD8] focus:outline-none focus:border-[#FEEBD8]"
            >
              <option value="All">All Statuses</option>
              <option value={EssayStatus.NOT_STARTED}>Not Started</option>
              <option value={EssayStatus.IN_PROGRESS}>In Progress</option>
              <option value={EssayStatus.NOT_SUBMITTED}>Not Submitted</option>
              <option value={EssayStatus.REVIEW_NEEDED}>Review Needed</option>
              <option value={EssayStatus.SUBMITTED}>Submitted</option>
              <option value={EssayStatus.COMPLETED}>Completed</option>
            </select>

            {/* College Filter */}
            <select
              value={filterCollege}
              onChange={(e) => handleCollegeFilterChange(e.target.value)}
              className="bg-neutral-800 border border-neutral-700 rounded-lg px-4 py-2 text-[#FEEBD8] focus:outline-none focus:border-[#FEEBD8]"
            >
              <option value="All">All Colleges</option>
              {collegeNames.map((collegeName) => (
                <option key={collegeName} value={collegeName}>
                  {collegeName}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Essays Grid */}
        <div className="grid gap-6">
          {filteredEssays.map((essay) => (
            <div
              key={essay.id}
              className="bg-[#141414] border border-neutral-700/50 rounded-lg p-6 hover:border-[#FEEBD8]/30 transition-colors"
            >
              <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-xl font-semibold text-[#FEEBD8]">
                      {essay.title}
                    </h3>
                    {getStatusIcon(essay.status)}
                    <span
                      className={`px-2 py-1 rounded-full text-xs text-white ${
                        statusColors[essay.status]
                      }`}
                    >
                      {essay.status}
                    </span>
                  </div>

                  <p className="text-[#FEEBD8]/70 text-sm mb-3">
                    {essay.college_name}
                  </p>

                  <div className="bg-neutral-800/50 rounded-lg p-3 mb-4">
                    <p className="text-[#FEEBD8]/80 text-sm italic">
                      "
                      {essay.prompt
                        ? essay.prompt.substring(0, 120) + "..."
                        : "No prompt provided"}
                      "
                    </p>
                  </div>

                  <div className="flex flex-wrap gap-4 mb-3">
                    {/* Content Length */}
                    <div className="text-sm">
                      <span className="text-[#FEEBD8]/70">Word Count: </span>
                      <span className="text-[#FEEBD8]">
                        {essay.content ? essay.content.split(" ").length : 0}
                      </span>
                    </div>
                    {/* AI Score */}
                    <div className="text-sm">
                      <span className="text-[#FEEBD8]/70">AI Score: </span>
                      <span className={getAIScoreColor(essay.ai_score || 0)}>
                        {essay.ai_score || 0}/10
                      </span>
                    </div>
                    {/* Created Date */}
                    <div className="text-sm text-[#FEEBD8]/70">
                      Created: {new Date(essay.created_at).toLocaleDateString()}
                    </div>
                  </div>

                  {/* AI Feedbacks */}
                  {essay.ai_suggestion && (
                    <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-3">
                      <p className="text-blue-300 text-sm">
                        <strong>AI Feedback:</strong> {essay.ai_suggestion}
                      </p>
                    </div>
                  )}
                </div>

                <div className="flex lg:flex-col gap-2">
                  <button
                    onClick={() => handleEditClick(essay)}
                    className="bg-[#FEEBD8] text-[#141414] px-4 py-2 rounded-lg font-medium hover:bg-[#E5D5B7] transition-colors flex items-center gap-2"
                  >
                    <FaEdit />
                    <span>Edit</span>
                  </button>
                  <button
                    onClick={() => handlePreviewClick(essay)}
                    className="bg-blue-500/20 text-blue-400 px-4 py-2 rounded-lg font-medium hover:bg-blue-500/30 transition-colors flex items-center gap-2"
                  >
                    <FaEye />
                    <span>Preview</span>
                  </button>
                  <button
                    onClick={() => handleDeleteEssay(essay.id)}
                    className="bg-red-500/20 text-red-400 px-4 py-2 rounded-lg font-medium hover:bg-red-500/30 transition-colors flex items-center gap-2"
                  >
                    <FaTrash />
                    <span>Delete</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredEssays.length === 0 && (
          <div className="text-center py-12">
            <p className="text-[#FEEBD8]/50 text-lg">
              No essays found matching your criteria.
            </p>
          </div>
        )}
      </div>

      <Footer />

      {/* Modals */}
      <AddEssayModal
        isOpen={isAddEssayModalOpen}
        onClose={() => setIsAddEssayModalOpen(false)}
        onSave={handleAddEssay}
      />

      <EditEssayModal
        isOpen={isEditEssayModalOpen}
        onClose={() => setIsEditEssayModalOpen(false)}
        onSave={handleEditEssay}
        essay={selectedEssay}
      />

      <PreviewEssayModal
        isOpen={isPreviewEssayModalOpen}
        onClose={() => setIsPreviewEssayModalOpen(false)}
        onEdit={handlePreviewEdit}
        essay={selectedEssay}
      />
    </div>
  );
}
