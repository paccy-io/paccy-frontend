"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import Footer from "../../../components/Footer";
import { useToast } from "../../../lib/hooks/useToast";
import { essaysApi } from "../../../lib/api/essays";
import { collegeApplicationsApi } from "../../../lib/api/college-applications";
import { Essay, EssayStatus, CollegeApplication } from "../../../lib/types";
import {
  FaPlus,
  FaSearch,
  FaTrash,
  FaArrowLeft,
  FaClock,
  FaCheckCircle,
  FaExclamationTriangle,
  FaPen,
  FaFileAlt,
  FaFilter,
  FaSpinner,
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

  const handleCreateEssay = async () => {
    try {
      const createdEssay = await essaysApi.create({
        title: "Untitled Essay",
        status: EssayStatus.NOT_STARTED,
        prompt: "",
        content: "",
        college_application_id: "",
      });
      showSuccess("Essay created successfully!");
      router.push(`/dashboard/essays/${createdEssay.id}`);
    } catch (error) {
      console.error("Failed to create essay:", error);
      showError("Failed to create essay");
    }
  };

  const handleDeleteEssay = async (essayId: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

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

  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Link
              href="/dashboard"
              className="text-white/70 hover:text-white transition-colors"
            >
              <FaArrowLeft size={20} />
            </Link>
            <div className="flex-1 min-w-0">
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white">
                Essays
              </h1>
              <p className="text-white/70 mt-2 text-sm sm:text-base">
                Write and organize your application essays
              </p>
            </div>
          </div>
          <button
            onClick={handleCreateEssay}
            className="bg-gradient-to-r from-purple-500 to-purple-600 text-white px-6 py-3 rounded-xl font-semibold hover:from-purple-600 hover:to-purple-700 transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/20 flex items-center gap-2"
          >
            <FaPlus />
            <span>New Essay</span>
          </button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="bg-gradient-to-br from-[#141414] to-[#1a1a1a] border border-neutral-700/50 rounded-xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-3xl font-bold text-white mb-1">
                  {essays.length}
                </div>
                <div className="text-white/60 text-sm">Total Essays</div>
              </div>
              <div className="p-3 bg-purple-500/10 rounded-lg">
                <FaFileAlt className="text-2xl text-purple-400" />
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-[#141414] to-[#1a1a1a] border border-neutral-700/50 rounded-xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-3xl font-bold text-green-400 mb-1">
                  {
                    essays.filter((e) => e.status === EssayStatus.COMPLETED)
                      .length
                  }
                </div>
                <div className="text-white/60 text-sm">Completed</div>
              </div>
              <div className="p-3 bg-green-500/10 rounded-lg">
                <FaCheckCircle className="text-2xl text-green-400" />
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-[#141414] to-[#1a1a1a] border border-neutral-700/50 rounded-xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-3xl font-bold text-blue-400 mb-1">
                  {
                    essays.filter((e) => e.status === EssayStatus.IN_PROGRESS)
                      .length
                  }
                </div>
                <div className="text-white/60 text-sm">In Progress</div>
              </div>
              <div className="p-3 bg-blue-500/10 rounded-lg">
                <FaClock className="text-2xl text-blue-400" />
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-[#141414] to-[#1a1a1a] border border-neutral-700/50 rounded-xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-3xl font-bold text-orange-400 mb-1">
                  {
                    essays.filter((e) => e.status === EssayStatus.REVIEW_NEEDED)
                      .length
                  }
                </div>
                <div className="text-white/60 text-sm">Need Review</div>
              </div>
              <div className="p-3 bg-orange-500/10 rounded-lg">
                <FaExclamationTriangle className="text-2xl text-orange-400" />
              </div>
            </div>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="bg-gradient-to-br from-[#141414] to-[#1a1a1a] border border-neutral-700/50 rounded-xl p-6 mb-8">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white/40" />
              <input
                type="text"
                placeholder="Search essays by title or college..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-[#0a0a0a]/50 border border-neutral-700/50 rounded-xl pl-11 pr-4 py-3 text-white placeholder:text-white/40 focus:outline-none focus:border-purple-500/50 focus:bg-[#0a0a0a]/80 transition-all"
              />
            </div>

            {/* Status Filter */}
            <div className="relative">
              <FaFilter className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white/40 pointer-events-none" />
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="bg-[#0a0a0a]/50 border border-neutral-700/50 rounded-xl pl-11 pr-10 py-3 text-white focus:outline-none focus:border-purple-500/50 focus:bg-[#0a0a0a]/80 transition-all appearance-none cursor-pointer min-w-[160px]"
              >
                <option value="All">All Statuses</option>
                <option value={EssayStatus.NOT_STARTED}>Not Started</option>
                <option value={EssayStatus.IN_PROGRESS}>In Progress</option>
                <option value={EssayStatus.NOT_SUBMITTED}>Not Submitted</option>
                <option value={EssayStatus.REVIEW_NEEDED}>Review Needed</option>
                <option value={EssayStatus.SUBMITTED}>Submitted</option>
                <option value={EssayStatus.COMPLETED}>Completed</option>
              </select>
            </div>

            {/* College Filter */}
            <select
              value={filterCollege}
              onChange={(e) => handleCollegeFilterChange(e.target.value)}
              className="bg-[#0a0a0a]/50 border border-neutral-700/50 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-purple-500/50 focus:bg-[#0a0a0a]/80 transition-all cursor-pointer min-w-[180px]"
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

        {/* Loading State */}
        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <FaSpinner className="text-purple-400 animate-spin text-4xl" />
          </div>
        ) : filteredEssays.length === 0 ? (
          <div className="bg-gradient-to-br from-[#141414] to-[#1a1a1a] border border-neutral-700/50 rounded-xl p-12 text-center">
            <FaFileAlt className="text-5xl text-white/20 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">
              {essays.length === 0 ? "No essays yet" : "No essays found"}
            </h3>
            <p className="text-white/60 mb-6">
              {essays.length === 0
                ? "Start writing your first essay to get started"
                : "Try adjusting your filters or search criteria"}
            </p>
            {essays.length === 0 && (
              <button
                onClick={handleCreateEssay}
                className="bg-gradient-to-r from-purple-500 to-purple-600 text-white px-6 py-3 rounded-xl font-semibold hover:from-purple-600 hover:to-purple-700 transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/20 inline-flex items-center gap-2"
              >
                <FaPlus />
                Create your first essay
              </button>
            )}
          </div>
        ) : (
          /* Essays Grid */
          <div className="grid gap-4">
            {filteredEssays.map((essay) => {
              const wordCount = essay.content
                ? essay.content.split(/\s+/).filter((w) => w).length
                : 0;

              return (
                <Link
                  key={essay.id}
                  href={`/dashboard/essays/${essay.id}`}
                  className="group bg-gradient-to-br from-[#141414] to-[#1a1a1a] border border-neutral-700/50 rounded-xl p-6 hover:border-purple-500/50 hover:shadow-lg hover:shadow-purple-500/10 transition-all duration-300"
                >
                  <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start gap-3 mb-3">
                        <div className="p-2 bg-purple-500/10 rounded-lg flex-shrink-0 group-hover:bg-purple-500/20 transition-colors">
                          <FaPen className="text-purple-400 text-lg" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="text-xl font-semibold text-white mb-1 group-hover:text-purple-400 transition-colors truncate">
                            {essay.title}
                          </h3>
                          {essay.college_name && (
                            <p className="text-white/50 text-sm">
                              {essay.college_name}
                            </p>
                          )}
                        </div>
                        <span
                          className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap flex-shrink-0 ${
                            essay.status === EssayStatus.COMPLETED
                              ? "bg-green-500/20 text-green-300"
                              : essay.status === EssayStatus.IN_PROGRESS
                              ? "bg-blue-500/20 text-blue-300"
                              : essay.status === EssayStatus.REVIEW_NEEDED
                              ? "bg-orange-500/20 text-orange-300"
                              : essay.status === EssayStatus.SUBMITTED
                              ? "bg-emerald-500/20 text-emerald-300"
                              : "bg-neutral-500/20 text-neutral-300"
                          }`}
                        >
                          {getStatusDisplayName(essay.status)}
                        </span>
                      </div>

                      {essay.prompt && (
                        <div className="bg-[#0a0a0a]/50 rounded-lg p-3 mb-3 border border-neutral-700/30">
                          <p className="text-white/60 text-sm italic line-clamp-2">
                            "{essay.prompt}"
                          </p>
                        </div>
                      )}

                      <div className="flex flex-wrap items-center gap-4 text-sm">
                        <div className="flex items-center gap-1.5 text-white/50">
                          <span className="font-medium">{wordCount}</span>
                          <span>words</span>
                        </div>
                        {essay.ai_score !== undefined &&
                          essay.ai_score !== null && (
                            <div className="flex items-center gap-1.5">
                              <span className="text-white/50">AI Score:</span>
                              <span className={getAIScoreColor(essay.ai_score)}>
                                {essay.ai_score}/10
                              </span>
                            </div>
                          )}
                        <div className="text-white/40 text-xs">
                          Updated{" "}
                          {new Date(
                            essay.updated_at || essay.created_at
                          ).toLocaleDateString()}
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={(e) => handleDeleteEssay(essay.id, e)}
                      className="flex-shrink-0 p-2 text-white/40 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                      title="Delete essay"
                    >
                      <FaTrash />
                    </button>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}
