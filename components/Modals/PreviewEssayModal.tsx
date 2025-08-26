import React from "react";
import {
  FaTimes,
  FaEye,
  FaEdit,
  FaDownload,
  FaShare,
  FaCopy,
  FaUniversity,
  FaCalendar,
  FaChartLine,
} from "react-icons/fa";
import { Essay } from "../../lib/types";

interface PreviewEssayModalProps {
  isOpen: boolean;
  onClose: () => void;
  onEdit: () => void;
  essay: Essay | null;
}

export default function PreviewEssayModal({
  isOpen,
  onClose,
  onEdit,
  essay,
}: PreviewEssayModalProps) {
  const [copied, setCopied] = React.useState(false);

  // Disable body scroll when modal is open
  React.useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = "unset";
      };
    }
  }, [isOpen]);

  if (!isOpen || !essay) return null;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(essay.content || "");
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy text");
    }
  };

  const getAIScoreColor = (score: number) => {
    if (score >= 8) return "text-green-400";
    if (score >= 6) return "text-yellow-400";
    return "text-red-400";
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Complete":
        return "bg-green-500/20 text-green-400";
      case "In Progress":
        return "bg-yellow-500/20 text-yellow-400";
      case "Review Needed":
        return "bg-orange-500/20 text-orange-400";
      case "Not Started":
        return "bg-gray-500/20 text-gray-400";
      default:
        return "bg-blue-500/20 text-blue-400";
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-2 sm:p-4 overflow-y-auto">
      <div className="bg-[#141414] border border-neutral-700 rounded-lg max-w-4xl w-full max-h-[95vh] sm:max-h-[90vh] overflow-hidden flex flex-col my-4 sm:my-0">
        {/* Header */}
        <div className="p-4 sm:p-6 border-b border-neutral-700">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <FaEye className="text-blue-400 text-xl" />
              <div className="min-w-0 flex-1">
                <h2 className="text-lg sm:text-xl font-bold text-[#FEEBD8] truncate">
                  {essay.title}
                </h2>
                <p className="text-[#FEEBD8]/70 text-sm truncate">
                  {essay.college_name}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 flex-shrink-0">
              <button
                onClick={onEdit}
                className="bg-[#FEEBD8] text-[#141414] px-3 sm:px-4 py-2 rounded-lg font-medium hover:bg-[#E5D5B7] transition-colors flex items-center gap-2 text-sm"
              >
                <FaEdit size={14} />
                <span className="hidden sm:inline">Edit</span>
              </button>
              <button
                onClick={onClose}
                className="text-[#FEEBD8]/60 hover:text-[#FEEBD8] transition-colors p-2"
              >
                <FaTimes size={20} />
              </button>
            </div>
          </div>
        </div>

        {/* Compact Stats Bar */}
        <div className="px-4 sm:px-6 py-3 bg-neutral-800/30 border-b border-neutral-700">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 text-sm">
            <div className="flex flex-wrap items-center gap-3 sm:gap-6">
              <div className="flex items-center gap-2">
                <span className="text-[#FEEBD8]/70">Words:</span>
                <span className="font-medium text-[#FEEBD8]">
                  {essay.content
                    ? essay.content.split(" ").filter((word) => word.length > 0)
                        .length
                    : 0}
                </span>
              </div>
              {essay.ai_score && (
                <div className="flex items-center gap-2">
                  <span className="text-[#FEEBD8]/70">AI Score:</span>
                  <span
                    className={`font-medium ${getAIScoreColor(essay.ai_score)}`}
                  >
                    {essay.ai_score}/10
                  </span>
                </div>
              )}
              <div className="flex items-center gap-2">
                <span className="text-[#FEEBD8]/70">Created:</span>
                <span className="font-medium text-[#FEEBD8]">
                  {new Date(essay.created_at).toLocaleDateString()}
                </span>
              </div>
            </div>
            <div className="flex-shrink-0">
              <span
                className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(
                  essay.status
                )}`}
              >
                {essay.status}
              </span>
            </div>
          </div>
        </div>

        {/* Compact Prompt Section */}
        {essay.prompt && (
          <div className="px-4 sm:px-6 py-3 border-b border-neutral-700 bg-neutral-800/20">
            <div className="flex flex-col sm:flex-row sm:items-start gap-2 sm:gap-3">
              <span className="text-[#FEEBD8]/70 text-sm font-medium flex-shrink-0">
                Prompt:
              </span>
              <p className="text-[#FEEBD8]/80 text-sm italic break-words">
                "{essay.prompt}"
              </p>
            </div>
          </div>
        )}

        {/* Essay Content - Main Focus */}
        <div className="flex-1 overflow-y-auto min-h-0">
          <div className="p-4 sm:p-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 mb-4">
              <h3 className="text-[#FEEBD8] font-semibold text-lg">
                Essay Content
              </h3>
              <div className="flex gap-2 flex-shrink-0">
                <button
                  onClick={handleCopy}
                  className="bg-neutral-700 text-[#FEEBD8] px-3 py-2 rounded-lg text-sm font-medium hover:bg-neutral-600 transition-colors flex items-center gap-2"
                >
                  <FaCopy size={12} />
                  <span>{copied ? "Copied!" : "Copy"}</span>
                </button>
                <button className="bg-neutral-700 text-[#FEEBD8] px-3 py-2 rounded-lg text-sm font-medium hover:bg-neutral-600 transition-colors flex items-center gap-2">
                  <FaDownload size={12} />
                  <span className="hidden sm:inline">Export</span>
                </button>
              </div>
            </div>

            <div className="bg-white rounded-lg p-4 sm:p-8 text-gray-800 leading-relaxed shadow-lg">
              {essay.content ? (
                essay.content
                  .split("\n\n")
                  .map((paragraph: string, index: number) => (
                    <p
                      key={index}
                      className="mb-4 sm:mb-6 last:mb-0 text-sm sm:text-base"
                    >
                      {paragraph}
                    </p>
                  ))
              ) : (
                <div className="text-center py-8 sm:py-12 text-gray-500">
                  <p className="text-base sm:text-lg mb-2">
                    No content available
                  </p>
                  <p className="text-sm">
                    This essay doesn't have any content yet.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* AI Feedback Section */}
        {essay.ai_feedbacks && essay.ai_feedbacks.length > 0 && (
          <div className="px-4 sm:px-6 py-3 border-t border-neutral-700 bg-blue-500/5 max-h-48 overflow-y-auto">
            <h3 className="text-[#FEEBD8] font-medium mb-2 flex items-center gap-2 text-sm">
              <FaChartLine className="text-blue-400" size={14} />
              AI Feedback
            </h3>
            <div className="space-y-2">
              {essay.ai_feedbacks.map((feedback, index) => (
                <div
                  key={index}
                  className="bg-blue-500/20 text-blue-300 px-3 py-2 rounded text-xs border border-blue-500/30 break-words"
                >
                  {feedback}
                </div>
              ))}
            </div>
            {essay.ai_suggestion && (
              <div className="mt-3 bg-green-500/10 border border-green-500/20 rounded-lg p-3">
                <p className="text-green-300 text-sm break-words">
                  <span className="font-medium">Suggestion:</span>{" "}
                  {essay.ai_suggestion}
                </p>
              </div>
            )}
          </div>
        )}

        {/* Compact Action Buttons */}
        <div className="px-4 sm:px-6 py-4 border-t border-neutral-700 flex flex-col sm:flex-row gap-3">
          <button
            onClick={onClose}
            className="flex-1 bg-neutral-700 text-[#FEEBD8] px-4 py-2 rounded-lg font-medium hover:bg-neutral-600 transition-colors"
          >
            Close
          </button>
          <button
            onClick={onEdit}
            className="flex-1 bg-[#FEEBD8] text-[#141414] px-4 py-2 rounded-lg font-medium hover:bg-[#E5D5B7] transition-colors flex items-center justify-center gap-2"
          >
            <FaEdit size={14} />
            <span>Edit Essay</span>
          </button>
        </div>
      </div>
    </div>
  );
}
