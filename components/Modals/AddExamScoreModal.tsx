import React from "react";
import {
  FaTimes,
  FaChartLine,
  FaBook,
  FaCalendarAlt,
  FaGraduationCap,
} from "react-icons/fa";

interface ExamScore {
  id: number;
  testType: string;
  subject: string;
  score: number;
  maxScore: number;
  percentile: number;
  testDate: string;
  retakeDate?: string;
  notes: string;
  status: string;
}

interface AddExamScoreModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (exam: Omit<ExamScore, "id">) => void;
}

const testTypes = [
  "SAT",
  "ACT",
  "SAT Subject Test",
  "AP Exam",
  "IB Exam",
  "TOEFL",
  "IELTS",
  "GRE",
  "GMAT",
  "LSAT",
  "MCAT",
  "Other",
];

const satSubjects = [
  "Math Level 1",
  "Math Level 2",
  "Biology E/M",
  "Chemistry",
  "Physics",
  "U.S. History",
  "World History",
  "Literature",
  "French",
  "Spanish",
  "German",
  "Chinese",
  "Japanese",
  "Korean",
  "Hebrew",
  "Latin",
];

const apSubjects = [
  "Biology",
  "Calculus AB",
  "Calculus BC",
  "Chemistry",
  "Computer Science A",
  "Computer Science Principles",
  "English Language",
  "English Literature",
  "Environmental Science",
  "European History",
  "French Language",
  "German Language",
  "Government and Politics",
  "Human Geography",
  "Macroeconomics",
  "Microeconomics",
  "Music Theory",
  "Physics 1",
  "Physics 2",
  "Physics C",
  "Psychology",
  "Spanish Language",
  "Statistics",
  "Studio Art",
  "U.S. History",
  "World History",
];

const statusOptions = [
  "Completed",
  "Scheduled",
  "Cancelled",
  "Planning to Retake",
];

export default function AddExamScoreModal({
  isOpen,
  onClose,
  onSave,
}: AddExamScoreModalProps) {
  const [formData, setFormData] = React.useState({
    testType: "SAT",
    subject: "",
    score: 0,
    maxScore: 1600,
    percentile: 0,
    testDate: "",
    retakeDate: "",
    notes: "",
    status: "Completed",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);

    // Reset form
    setFormData({
      testType: "SAT",
      subject: "",
      score: 0,
      maxScore: 1600,
      percentile: 0,
      testDate: "",
      retakeDate: "",
      notes: "",
      status: "Completed",
    });
    onClose();
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value, type } = e.target;
    let newValue: string | number =
      type === "number" ? parseFloat(value) || 0 : value;

    setFormData((prev) => {
      const updated = { ...prev, [name]: newValue };

      // Auto-set max score based on test type
      if (name === "testType") {
        switch (value) {
          case "SAT":
            updated.maxScore = 1600;
            updated.subject = "";
            break;
          case "ACT":
            updated.maxScore = 36;
            updated.subject = "";
            break;
          case "SAT Subject Test":
            updated.maxScore = 800;
            break;
          case "AP Exam":
            updated.maxScore = 5;
            break;
          case "IB Exam":
            updated.maxScore = 7;
            break;
          case "TOEFL":
            updated.maxScore = 120;
            updated.subject = "";
            break;
          case "IELTS":
            updated.maxScore = 9;
            updated.subject = "";
            break;
          default:
            updated.maxScore = 100;
            break;
        }
        updated.score = 0;
        updated.percentile = 0;
      }

      return updated;
    });
  };

  const getScorePercentage = () => {
    if (formData.maxScore > 0) {
      return ((formData.score / formData.maxScore) * 100).toFixed(1);
    }
    return "0";
  };

  const getScoreCategory = () => {
    const percentage = parseFloat(getScorePercentage());
    if (percentage >= 95)
      return { label: "Excellent", color: "text-green-400" };
    if (percentage >= 85) return { label: "Very Good", color: "text-blue-400" };
    if (percentage >= 75) return { label: "Good", color: "text-yellow-400" };
    if (percentage >= 60) return { label: "Average", color: "text-orange-400" };
    return { label: "Below Average", color: "text-red-400" };
  };

  const getSubjectOptions = () => {
    switch (formData.testType) {
      case "SAT Subject Test":
        return satSubjects;
      case "AP Exam":
        return apSubjects;
      default:
        return [];
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-[#141414] border border-neutral-700 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-neutral-700">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <FaChartLine className="text-red-400 text-xl" />
              <h2 className="text-xl font-bold text-[#FEEBD8]">
                Add Exam Score
              </h2>
            </div>
            <button
              onClick={onClose}
              className="text-[#FEEBD8]/60 hover:text-[#FEEBD8] transition-colors"
            >
              <FaTimes size={20} />
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Test Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-[#FEEBD8]/70 mb-2">
                Test Type *
              </label>
              <select
                name="testType"
                value={formData.testType}
                onChange={handleChange}
                required
                className="w-full bg-neutral-800 border border-neutral-700 rounded-lg px-4 py-2 text-[#FEEBD8] focus:outline-none focus:border-[#FEEBD8]"
              >
                {testTypes.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </div>

            {getSubjectOptions().length > 0 && (
              <div>
                <label className="block text-sm font-medium text-[#FEEBD8]/70 mb-2">
                  Subject
                </label>
                <select
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  className="w-full bg-neutral-800 border border-neutral-700 rounded-lg px-4 py-2 text-[#FEEBD8] focus:outline-none focus:border-[#FEEBD8]"
                >
                  <option value="">Select Subject</option>
                  {getSubjectOptions().map((subject) => (
                    <option key={subject} value={subject}>
                      {subject}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {getSubjectOptions().length === 0 && (
              <div>
                <label className="block text-sm font-medium text-[#FEEBD8]/70 mb-2">
                  Subject/Section (Optional)
                </label>
                <input
                  type="text"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  className="w-full bg-neutral-800 border border-neutral-700 rounded-lg px-4 py-2 text-[#FEEBD8] focus:outline-none focus:border-[#FEEBD8]"
                  placeholder="e.g., Math, Reading, Science"
                />
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-[#FEEBD8]/70 mb-2">
                Score *
              </label>
              <input
                type="number"
                name="score"
                value={formData.score || ""}
                onChange={handleChange}
                required
                min="0"
                max={formData.maxScore}
                className="w-full bg-neutral-800 border border-neutral-700 rounded-lg px-4 py-2 text-[#FEEBD8] focus:outline-none focus:border-[#FEEBD8]"
                placeholder={`0 - ${formData.maxScore}`}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[#FEEBD8]/70 mb-2">
                Max Score
              </label>
              <input
                type="number"
                name="maxScore"
                value={formData.maxScore}
                onChange={handleChange}
                min="1"
                className="w-full bg-neutral-800 border border-neutral-700 rounded-lg px-4 py-2 text-[#FEEBD8] focus:outline-none focus:border-[#FEEBD8]"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[#FEEBD8]/70 mb-2">
                Percentile (Optional)
              </label>
              <input
                type="number"
                name="percentile"
                value={formData.percentile || ""}
                onChange={handleChange}
                min="1"
                max="99"
                className="w-full bg-neutral-800 border border-neutral-700 rounded-lg px-4 py-2 text-[#FEEBD8] focus:outline-none focus:border-[#FEEBD8]"
                placeholder="e.g., 95"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[#FEEBD8]/70 mb-2">
                Test Date
              </label>
              <input
                type="date"
                name="testDate"
                value={formData.testDate}
                onChange={handleChange}
                className="w-full bg-neutral-800 border border-neutral-700 rounded-lg px-4 py-2 text-[#FEEBD8] focus:outline-none focus:border-[#FEEBD8]"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[#FEEBD8]/70 mb-2">
                Status
              </label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="w-full bg-neutral-800 border border-neutral-700 rounded-lg px-4 py-2 text-[#FEEBD8] focus:outline-none focus:border-[#FEEBD8]"
              >
                {statusOptions.map((status) => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}
              </select>
            </div>

            {formData.status === "Planning to Retake" && (
              <div>
                <label className="block text-sm font-medium text-[#FEEBD8]/70 mb-2">
                  Planned Retake Date
                </label>
                <input
                  type="date"
                  name="retakeDate"
                  value={formData.retakeDate}
                  onChange={handleChange}
                  className="w-full bg-neutral-800 border border-neutral-700 rounded-lg px-4 py-2 text-[#FEEBD8] focus:outline-none focus:border-[#FEEBD8]"
                />
              </div>
            )}
          </div>

          {/* Notes */}
          <div>
            <label className="block text-sm font-medium text-[#FEEBD8]/70 mb-2">
              Notes
            </label>
            <textarea
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              rows={3}
              className="w-full bg-neutral-800 border border-neutral-700 rounded-lg px-4 py-2 text-[#FEEBD8] focus:outline-none focus:border-[#FEEBD8]"
              placeholder="Any additional notes about this test score..."
            />
          </div>

          {/* Score Analysis */}
          {formData.score > 0 && (
            <div className="bg-neutral-800 rounded-lg p-4">
              <h4 className="text-[#FEEBD8] font-medium mb-3">
                Score Analysis
              </h4>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                <div>
                  <div className="text-2xl font-bold text-[#FEEBD8]">
                    {formData.score}
                  </div>
                  <div className="text-sm text-[#FEEBD8]/70">Score</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-[#FEEBD8]">
                    {getScorePercentage()}%
                  </div>
                  <div className="text-sm text-[#FEEBD8]/70">Percentage</div>
                </div>
                {formData.percentile > 0 && (
                  <div>
                    <div className="text-2xl font-bold text-[#FEEBD8]">
                      {formData.percentile}
                    </div>
                    <div className="text-sm text-[#FEEBD8]/70">Percentile</div>
                  </div>
                )}
                <div>
                  <div
                    className={`text-lg font-bold ${getScoreCategory().color}`}
                  >
                    {getScoreCategory().label}
                  </div>
                  <div className="text-sm text-[#FEEBD8]/70">Category</div>
                </div>
              </div>
            </div>
          )}

          {/* Exam Preview */}
          <div className="bg-neutral-800 rounded-lg p-4">
            <h4 className="text-[#FEEBD8] font-medium mb-3">Exam Preview</h4>
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <FaGraduationCap className="text-red-400" size={16} />
                <div>
                  <div className="text-[#FEEBD8] font-medium">
                    {formData.testType}
                    {formData.subject && (
                      <span className="text-[#FEEBD8]/60 ml-2">
                        - {formData.subject}
                      </span>
                    )}
                  </div>
                  <div className="text-sm text-[#FEEBD8]/70">
                    Score: {formData.score || 0} / {formData.maxScore}
                    {formData.percentile > 0 && (
                      <span className="ml-2">
                        ({formData.percentile}th percentile)
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-4 text-sm text-[#FEEBD8]/60">
                {formData.testDate && (
                  <span className="flex items-center gap-1">
                    <FaCalendarAlt size={12} />
                    {new Date(formData.testDate).toLocaleDateString()}
                  </span>
                )}
                <span
                  className={`px-2 py-1 rounded text-xs ${
                    formData.status === "Completed"
                      ? "bg-green-500/20 text-green-400"
                      : formData.status === "Scheduled"
                      ? "bg-blue-500/20 text-blue-400"
                      : formData.status === "Planning to Retake"
                      ? "bg-yellow-500/20 text-yellow-400"
                      : "bg-red-500/20 text-red-400"
                  }`}
                >
                  {formData.status}
                </span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4 border-t border-neutral-700">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 bg-neutral-700 text-[#FEEBD8] px-6 py-3 rounded-lg font-medium hover:bg-neutral-600 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 bg-[#FEEBD8] text-[#141414] px-6 py-3 rounded-lg font-medium hover:bg-[#E5D5B7] transition-colors"
            >
              Add Exam Score
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
