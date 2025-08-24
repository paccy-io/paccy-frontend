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
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-[#141414] border border-neutral-700 rounded-lg max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="p-6 border-b border-neutral-700">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <FaEye className="text-blue-400 text-xl" />
              <div>
                <h2 className="text-xl font-bold text-[#FEEBD8]">
                  {essay.title}
                </h2>
                <p className="text-[#FEEBD8]/70 text-sm">
                  {essay.college_name}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={onEdit}
                className="bg-[#FEEBD8] text-[#141414] px-4 py-2 rounded-lg font-medium hover:bg-[#E5D5B7] transition-colors flex items-center gap-2"
              >
                <FaEdit size={14} />
                <span>Edit</span>
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
        <div className="px-6 py-3 bg-neutral-800/30 border-b border-neutral-700">
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-6">
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
            <div>
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
          <div className="px-6 py-3 border-b border-neutral-700 bg-neutral-800/20">
            <div className="flex items-start gap-3">
              <span className="text-[#FEEBD8]/70 text-sm font-medium min-w-0 flex-shrink-0">
                Prompt:
              </span>
              <p className="text-[#FEEBD8]/80 text-sm italic overflow-hidden text-ellipsis whitespace-nowrap max-w-md">
                "{essay.prompt}"
              </p>
            </div>
          </div>
        )}

        {/* Essay Content - Main Focus */}
        <div className="flex-1 overflow-y-auto">
          <div className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-[#FEEBD8] font-semibold text-lg">
                Essay Content
              </h3>
              <div className="flex gap-2">
                <button
                  onClick={handleCopy}
                  className="bg-neutral-700 text-[#FEEBD8] px-3 py-2 rounded-lg text-sm font-medium hover:bg-neutral-600 transition-colors flex items-center gap-2"
                >
                  <FaCopy size={12} />
                  <span>{copied ? "Copied!" : "Copy"}</span>
                </button>
                <button className="bg-neutral-700 text-[#FEEBD8] px-3 py-2 rounded-lg text-sm font-medium hover:bg-neutral-600 transition-colors flex items-center gap-2">
                  <FaDownload size={12} />
                  <span>Export</span>
                </button>
              </div>
            </div>

            <div className="bg-white rounded-lg p-8 text-gray-800 leading-relaxed shadow-lg">
              {essay.content ? (
                essay.content
                  .split("\n\n")
                  .map((paragraph: string, index: number) => (
                    <p key={index} className="mb-6 last:mb-0 text-base">
                      {paragraph}
                    </p>
                  ))
              ) : (
                <div className="text-center py-12 text-gray-500">
                  <p className="text-lg mb-2">No content available</p>
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
          <div className="px-6 py-3 border-t border-neutral-700 bg-blue-500/5">
            <h3 className="text-[#FEEBD8] font-medium mb-2 flex items-center gap-2 text-sm">
              <FaChartLine className="text-blue-400" size={14} />
              AI Feedback
            </h3>
            <div className="flex flex-wrap gap-2">
              {essay.ai_feedbacks.map((feedback, index) => (
                <span
                  key={index}
                  className="inline-block bg-blue-500/20 text-blue-300 px-2 py-1 rounded text-xs border border-blue-500/30"
                  title={feedback}
                >
                  {feedback.length > 40
                    ? `${feedback.substring(0, 40)}...`
                    : feedback}
                </span>
              ))}
            </div>
            {essay.ai_suggestion && (
              <div className="mt-3 bg-green-500/10 border border-green-500/20 rounded-lg p-3">
                <p className="text-green-300 text-sm">
                  <span className="font-medium">Suggestion:</span>{" "}
                  {essay.ai_suggestion}
                </p>
              </div>
            )}
          </div>
        )}

        {/* Compact Action Buttons */}
        <div className="px-6 py-4 border-t border-neutral-700 flex gap-3">
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
