"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { useToast } from "../../../../lib/hooks/useToast";
import { essaysApi } from "../../../../lib/api/essays";
import { collegeApplicationsApi } from "../../../../lib/api/college-applications";
import { Essay, EssayStatus, CollegeApplication } from "../../../../lib/types";
import {
  FaArrowLeft,
  FaSave,
  FaSpinner,
  FaClock,
  FaCheckCircle,
  FaExclamationTriangle,
  FaInfoCircle,
} from "react-icons/fa";

export default function EssayEditorPage() {
  const router = useRouter();
  const params = useParams();
  const essayId = params.id as string;
  const { success: showSuccess, error: showError } = useToast();

  const [essay, setEssay] = useState<Essay | null>(null);
  const [colleges, setColleges] = useState<CollegeApplication[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  // Form fields
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [prompt, setPrompt] = useState("");
  const [status, setStatus] = useState<EssayStatus>(EssayStatus.NOT_STARTED);
  const [collegeApplicationId, setCollegeApplicationId] = useState<string>("");
  const [wordLimit] = useState<number>(650);

  const autoSaveTimerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    loadData();
  }, [essayId]);

  // Auto-save functionality
  useEffect(() => {
    if (!hasUnsavedChanges || !essay) return;

    if (autoSaveTimerRef.current) {
      clearTimeout(autoSaveTimerRef.current);
    }

    autoSaveTimerRef.current = setTimeout(() => {
      handleSave(true);
    }, 3000); // Auto-save after 3 seconds of inactivity

    return () => {
      if (autoSaveTimerRef.current) {
        clearTimeout(autoSaveTimerRef.current);
      }
    };
  }, [title, content, prompt, status, collegeApplicationId, hasUnsavedChanges]);

  const loadData = async () => {
    try {
      setIsLoading(true);
      const [essayData, collegesData] = await Promise.all([
        essaysApi.getById(essayId),
        collegeApplicationsApi.getAll(),
      ]);

      setEssay(essayData);
      setColleges(collegesData);
      setTitle(essayData.title);
      setContent(essayData.content || "");
      setPrompt(essayData.prompt || "");
      setStatus(essayData.status);
      setCollegeApplicationId(essayData.college_application_id || "");
    } catch (error) {
      console.error("Failed to load essay:", error);
      showError("Failed to load essay");
      router.push("/dashboard/essays");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async (isAutoSave = false) => {
    try {
      setIsSaving(true);
      await essaysApi.update(essayId, {
        title,
        content,
        prompt,
        status,
      });

      setHasUnsavedChanges(false);
      if (!isAutoSave) {
        showSuccess("Essay saved successfully!");
      }
    } catch (error) {
      console.error("Failed to save essay:", error);
      if (!isAutoSave) {
        showError("Failed to save essay");
      }
    } finally {
      setIsSaving(false);
    }
  };

  const handleFieldChange = (field: string, value: any) => {
    setHasUnsavedChanges(true);
    switch (field) {
      case "title":
        setTitle(value);
        break;
      case "content":
        setContent(value);
        break;
      case "prompt":
        setPrompt(value);
        break;
      case "status":
        setStatus(value);
        break;
      case "college":
        setCollegeApplicationId(value);
        break;
    }
  };

  const getWordCount = () => {
    return content
      .trim()
      .split(/\s+/)
      .filter((w) => w).length;
  };

  const getWordCountColor = () => {
    const count = getWordCount();
    const percentage = (count / wordLimit) * 100;

    if (percentage > 100) return "text-red-400";
    if (percentage > 95) return "text-orange-400";
    if (percentage > 80) return "text-yellow-400";
    return "text-white/60";
  };

  const getStatusConfig = (status: EssayStatus) => {
    switch (status) {
      case EssayStatus.COMPLETED:
        return {
          icon: FaCheckCircle,
          color: "text-green-400",
          bg: "bg-green-500/20",
        };
      case EssayStatus.IN_PROGRESS:
        return { icon: FaClock, color: "text-blue-400", bg: "bg-blue-500/20" };
      case EssayStatus.REVIEW_NEEDED:
        return {
          icon: FaExclamationTriangle,
          color: "text-orange-400",
          bg: "bg-orange-500/20",
        };
      case EssayStatus.SUBMITTED:
        return {
          icon: FaCheckCircle,
          color: "text-emerald-400",
          bg: "bg-emerald-500/20",
        };
      default:
        return {
          icon: FaClock,
          color: "text-neutral-400",
          bg: "bg-neutral-500/20",
        };
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
        <FaSpinner className="text-purple-400 animate-spin text-4xl" />
      </div>
    );
  }

  const statusConfig = getStatusConfig(status);
  const StatusIcon = statusConfig.icon;
  const wordCount = getWordCount();
  const wordCountPercentage = (wordCount / wordLimit) * 100;

  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-[#0a0a0a]/95 backdrop-blur-sm border-b border-neutral-700/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link
                href="/dashboard/essays"
                className="text-white/70 hover:text-white transition-colors p-2 hover:bg-white/5 rounded-lg"
              >
                <FaArrowLeft size={18} />
              </Link>
              <div>
                <h1 className="text-xl font-semibold text-white">
                  {title || "Untitled Essay"}
                </h1>
                <p className="text-xs text-white/50 mt-1">Essay Editor</p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              {isSaving ? (
                <div className="flex items-center gap-2 text-xs text-white/60">
                  <FaSpinner className="animate-spin" />
                  <span>Saving...</span>
                </div>
              ) : hasUnsavedChanges ? (
                <span className="text-xs text-white/40">Unsaved changes</span>
              ) : (
                <span className="text-xs text-white/40">All changes saved</span>
              )}

              <button
                onClick={() => handleSave(false)}
                disabled={!hasUnsavedChanges || isSaving}
                className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-5 py-2.5 rounded-xl font-semibold hover:from-blue-600 hover:to-blue-700 transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/20 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <FaSave />
                <span>Save</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Main Editor - Full Width Content */}
          <div className="lg:col-span-3 space-y-6">
            {/* Essay Title - Editable */}
            <div className="bg-gradient-to-br from-[#141414] to-[#1a1a1a] border border-neutral-700/50 rounded-xl p-6">
              <label className="text-white/60 text-xs mb-2 block uppercase tracking-wide font-semibold">
                Essay Title
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => handleFieldChange("title", e.target.value)}
                placeholder="Untitled Essay"
                className="w-full bg-[#0a0a0a]/50 border border-neutral-700/50 rounded-lg px-4 py-3 text-2xl font-bold text-white placeholder:text-white/30 focus:outline-none focus:border-blue-500/50 transition-all"
              />
            </div>

            {/* Essay Prompt - Editable */}
            <div className="bg-gradient-to-br from-[#141414] to-[#1a1a1a] border border-neutral-700/50 rounded-xl p-6">
              <label className="text-white font-semibold mb-3 block">
                Essay Prompt
              </label>
              <textarea
                value={prompt}
                onChange={(e) => handleFieldChange("prompt", e.target.value)}
                placeholder="Enter the essay prompt or question..."
                rows={3}
                className="w-full bg-[#0a0a0a]/50 border border-neutral-700/50 rounded-lg px-4 py-3 text-white placeholder:text-white/30 focus:outline-none focus:border-blue-500/50 transition-all resize-none"
              />
            </div>

            {/* Main Editor - Essay Content */}
            <div className="bg-gradient-to-br from-[#141414] to-[#1a1a1a] border border-neutral-700/50 rounded-xl p-8">
              <label className="text-white font-semibold mb-4 block text-lg">
                Essay Content
              </label>
              <textarea
                value={content}
                onChange={(e) => handleFieldChange("content", e.target.value)}
                placeholder="Start writing your essay here..."
                rows={32}
                className="w-full bg-[#0a0a0a]/50 border border-neutral-700/50 rounded-lg px-6 py-4 text-white placeholder:text-white/30 focus:outline-none focus:border-blue-500/50 transition-all resize-none leading-relaxed"
              />
            </div>
          </div>

          {/* Sidebar - Details & Statistics */}
          <div className="lg:col-span-1 space-y-6">
            {/* Essay Details */}
            <div className="bg-gradient-to-br from-[#141414] to-[#1a1a1a] border border-neutral-700/50 rounded-xl p-6">
              <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
                <FaInfoCircle className="text-blue-400" />
                Details
              </h3>

              <div className="space-y-4">
                <div>
                  <label className="text-white/60 text-xs mb-2 block uppercase tracking-wide">
                    Status
                  </label>
                  <select
                    value={status}
                    onChange={(e) =>
                      handleFieldChange("status", e.target.value as EssayStatus)
                    }
                    className="w-full bg-[#0a0a0a]/50 border border-neutral-700/50 rounded-lg px-3 py-2.5 text-white text-sm focus:outline-none focus:border-blue-500/50 transition-all"
                  >
                    <option value={EssayStatus.NOT_STARTED}>Not Started</option>
                    <option value={EssayStatus.IN_PROGRESS}>In Progress</option>
                    <option value={EssayStatus.REVIEW_NEEDED}>
                      Review Needed
                    </option>
                    <option value={EssayStatus.NOT_SUBMITTED}>
                      Not Submitted
                    </option>
                    <option value={EssayStatus.SUBMITTED}>Submitted</option>
                    <option value={EssayStatus.COMPLETED}>Completed</option>
                  </select>
                </div>

                <div>
                  <label className="text-white/60 text-xs mb-2 block uppercase tracking-wide">
                    College Application
                  </label>
                  <select
                    value={collegeApplicationId}
                    onChange={(e) =>
                      handleFieldChange("college", e.target.value)
                    }
                    className="w-full bg-[#0a0a0a]/50 border border-neutral-700/50 rounded-lg px-3 py-2.5 text-white text-sm focus:outline-none focus:border-blue-500/50 transition-all"
                  >
                    <option value="">Common App / Personal</option>
                    {colleges.map((college) => (
                      <option key={college.id} value={college.id}>
                        {college.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Word Count & Statistics */}
            <div className="bg-gradient-to-br from-[#141414] to-[#1a1a1a] border border-neutral-700/50 rounded-xl p-6">
              <h3 className="text-white font-semibold mb-4">Statistics</h3>
              <div className="space-y-4">
                <div>
                  <div className="flex items-baseline justify-between mb-2">
                    <span className="text-white/60 text-sm">Word Count</span>
                    <span
                      className={`text-2xl font-bold ${getWordCountColor()}`}
                    >
                      {wordCount}
                    </span>
                  </div>
                  <div className="flex justify-between text-xs text-white/40 mb-2">
                    <span>0</span>
                    <span>{wordLimit}</span>
                  </div>
                  <div className="w-full bg-neutral-700/30 rounded-full h-2 overflow-hidden">
                    <div
                      className={`h-full transition-all duration-300 ${
                        wordCountPercentage > 100
                          ? "bg-red-500"
                          : wordCountPercentage > 95
                          ? "bg-orange-500"
                          : wordCountPercentage > 80
                          ? "bg-yellow-500"
                          : "bg-blue-500"
                      }`}
                      style={{
                        width: `${Math.min(wordCountPercentage, 100)}%`,
                      }}
                    />
                  </div>
                  {wordCountPercentage > 100 && (
                    <p className="text-red-400 text-xs mt-2">
                      {wordCount - wordLimit} words over limit
                    </p>
                  )}
                </div>

                <div className="flex justify-between items-center text-sm pt-4 border-t border-neutral-700/50">
                  <span className="text-white/60">Characters</span>
                  <span className="text-white font-medium">
                    {content.length}
                  </span>
                </div>

                <div className="flex justify-between items-center text-sm">
                  <span className="text-white/60">Estimated Pages</span>
                  <span className="text-white font-medium">
                    {Math.ceil(wordCount / 250)}
                  </span>
                </div>

                {/* AI Evaluation Section */}
                <div className="pt-4 border-t border-neutral-700/50">
                  <h4 className="text-white/80 font-medium text-sm mb-3">
                    AI Evaluation
                  </h4>
                  {(essay?.ai_score && essay.ai_score > 0) ||
                  (essay?.ai_feedbacks && essay.ai_feedbacks.length > 0) ||
                  essay?.ai_suggestion ? (
                    <div className="space-y-3">
                      {essay?.ai_score && essay.ai_score > 0 && (
                        <div className="flex justify-between items-center text-sm">
                          <span className="text-white/60">AI Score</span>
                          <span
                            className={`font-bold ${
                              essay.ai_score >= 8
                                ? "text-green-400"
                                : essay.ai_score >= 6
                                ? "text-yellow-400"
                                : "text-orange-400"
                            }`}
                          >
                            {essay.ai_score}/10
                          </span>
                        </div>
                      )}
                      {essay?.ai_feedbacks && essay.ai_feedbacks.length > 0 && (
                        <div className="text-sm">
                          <span className="text-white/60 block mb-2">
                            AI Feedback
                          </span>
                          <ul className="space-y-1">
                            {essay.ai_feedbacks.map((feedback, idx) => (
                              <li
                                key={idx}
                                className="text-white/80 text-xs flex gap-2"
                              >
                                <span className="text-blue-400">•</span>
                                <span>{feedback}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                      {essay?.ai_suggestion && (
                        <div className="text-sm">
                          <span className="text-white/60 block mb-2">
                            AI Suggestion
                          </span>
                          <p className="text-white/80 text-xs">
                            {essay.ai_suggestion}
                          </p>
                        </div>
                      )}
                    </div>
                  ) : (
                    <p className="text-white/40 text-xs italic">
                      Not evaluated by AI yet
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Status Badge */}
            <div
              className={`${statusConfig.bg} border border-neutral-700/50 rounded-xl p-4`}
            >
              <div className="flex items-center gap-3">
                <StatusIcon className={`${statusConfig.color} text-xl`} />
                <div>
                  <div className="text-xs text-white/60 uppercase tracking-wide">
                    Current Status
                  </div>
                  <div
                    className={`text-sm font-semibold ${statusConfig.color}`}
                  >
                    {status
                      .replace(/_/g, " ")
                      .replace(/\b\w/g, (l) => l.toUpperCase())}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
