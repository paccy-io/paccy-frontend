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

interface Essay {
  id: number;
  title: string;
  college: string;
  prompt: string;
  status: string;
  wordCount: number;
  maxWords: number;
  lastModified: string;
  aiScore: number | null;
  feedback: string | null;
  content?: string;
  type?: string;
}

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

  // Mock content for demonstration - in real app this would come from the essay data
  const mockContent =
    essay.content ||
    `Dear Admissions Committee,

I am writing to express my sincere interest in joining ${essay.college}. Throughout my academic journey, I have been driven by a passion for learning and a commitment to excellence that I believe aligns perfectly with the values of your institution.

My experiences have shaped me into a well-rounded individual with strong analytical skills and a deep appreciation for diverse perspectives. During my time in high school, I have maintained a rigorous academic schedule while actively participating in extracurricular activities that have broadened my understanding of the world.

One particular experience that stands out was my involvement in the debate team, where I learned the importance of thorough research, critical thinking, and effective communication. These skills have not only improved my academic performance but have also prepared me for the challenges of higher education.

At ${essay.college}, I am particularly excited about the opportunity to explore interdisciplinary studies and engage with a diverse community of scholars. I am confident that my dedication, curiosity, and unique perspective will contribute positively to the campus community.

I look forward to the opportunity to discuss my application further and demonstrate my commitment to academic excellence and personal growth.

Thank you for your consideration.

Sincerely,
[Your Name]`;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(mockContent);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy text");
    }
  };

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
                <p className="text-[#FEEBD8]/70 text-sm">{essay.college}</p>
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

        {/* Stats Bar */}
        <div className="px-6 py-4 bg-neutral-800/30 border-b border-neutral-700">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div>
              <div
                className={`text-lg font-bold ${getWordCountColor(
                  essay.wordCount,
                  essay.maxWords
                )}`}
              >
                {essay.wordCount}/{essay.maxWords}
              </div>
              <div className="text-xs text-[#FEEBD8]/70">Words</div>
            </div>
            {essay.aiScore && (
              <div>
                <div
                  className={`text-lg font-bold ${getAIScoreColor(
                    essay.aiScore
                  )}`}
                >
                  {essay.aiScore}/10
                </div>
                <div className="text-xs text-[#FEEBD8]/70">AI Score</div>
              </div>
            )}
            <div>
              <div className="text-lg font-bold text-[#FEEBD8]">
                {essay.lastModified
                  ? new Date(essay.lastModified).toLocaleDateString()
                  : "N/A"}
              </div>
              <div className="text-xs text-[#FEEBD8]/70">Last Modified</div>
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

        {/* Prompt Section */}
        <div className="p-6 border-b border-neutral-700">
          <h3 className="text-[#FEEBD8] font-semibold mb-2">Essay Prompt</h3>
          <div className="bg-neutral-800/50 rounded-lg p-4">
            <p className="text-[#FEEBD8]/80 text-sm italic">"{essay.prompt}"</p>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto">
          <div className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-[#FEEBD8] font-semibold">Essay Content</h3>
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
                <button className="bg-neutral-700 text-[#FEEBD8] px-3 py-2 rounded-lg text-sm font-medium hover:bg-neutral-600 transition-colors flex items-center gap-2">
                  <FaShare size={12} />
                  <span>Share</span>
                </button>
              </div>
            </div>

            <div className="bg-white rounded-lg p-6 text-gray-800 leading-relaxed">
              {mockContent.split("\n\n").map((paragraph, index) => (
                <p key={index} className="mb-4 last:mb-0">
                  {paragraph}
                </p>
              ))}
            </div>
          </div>
        </div>

        {/* AI Feedback Section */}
        {essay.feedback && (
          <div className="p-6 border-t border-neutral-700 bg-blue-500/5">
            <h3 className="text-[#FEEBD8] font-semibold mb-2 flex items-center gap-2">
              <FaChartLine className="text-blue-400" size={16} />
              AI Feedback & Suggestions
            </h3>
            <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4">
              <p className="text-blue-300 text-sm">{essay.feedback}</p>
              <div className="mt-3 flex gap-2">
                <span className="px-2 py-1 bg-green-500/20 text-green-400 text-xs rounded">
                  Strong Opening
                </span>
                <span className="px-2 py-1 bg-yellow-500/20 text-yellow-400 text-xs rounded">
                  Needs Examples
                </span>
                <span className="px-2 py-1 bg-blue-500/20 text-blue-400 text-xs rounded">
                  Good Structure
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="p-6 border-t border-neutral-700 flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 bg-neutral-700 text-[#FEEBD8] px-6 py-3 rounded-lg font-medium hover:bg-neutral-600 transition-colors"
          >
            Close
          </button>
          <button
            onClick={onEdit}
            className="flex-1 bg-[#FEEBD8] text-[#141414] px-6 py-3 rounded-lg font-medium hover:bg-[#E5D5B7] transition-colors flex items-center justify-center gap-2"
          >
            <FaEdit size={16} />
            <span>Edit Essay</span>
          </button>
        </div>
      </div>
    </div>
  );
}
