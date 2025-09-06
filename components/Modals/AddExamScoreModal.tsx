import React from "react";
import {
  FaTimes,
  FaChartLine,
  FaBook,
  FaCalendarAlt,
  FaClipboardList,
} from "react-icons/fa";
import DatePicker from "../DatePicker";

interface ExamScore {
  id: number;
  testType: string;
  subject: string;
  score: number;
  maxScore: number;
  testDate: string;
  retakeDate?: string;
  notes: string;
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

const commonSubjects = {
  "SAT Subject Test": [
    "Math Level 1",
    "Math Level 2",
    "Biology E/M",
    "Chemistry",
    "Physics",
    "U.S. History",
    "World History",
    "Literature",
  ],
  "AP Exam": [
    "Biology",
    "Calculus AB",
    "Calculus BC",
    "Chemistry",
    "Computer Science A",
    "English Language",
    "English Literature",
    "Physics 1",
    "Physics 2",
    "Psychology",
    "Statistics",
    "U.S. History",
    "World History",
  ],
};

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
  const [activeTab, setActiveTab] = React.useState("basic");
  const [formData, setFormData] = React.useState({
    testType: "SAT",
    subject: "",
    score: 0,
    maxScore: 1600,
    testDate: "",
    retakeDate: "",
    notes: "",
  });

  const [errors, setErrors] = React.useState<Record<string, string>>({});

  const validateField = (name: string, value: any) => {
    const newErrors = { ...errors };

    switch (name) {
      case "score":
        const scoreNum = parseFloat(value);
        if (value === "" || isNaN(scoreNum) || scoreNum < 0) {
          newErrors.score = "Valid score required";
        } else if (scoreNum > formData.maxScore) {
          newErrors.score = `Score cannot exceed ${formData.maxScore}`;
        } else {
          delete newErrors.score;
        }
        break;
      case "maxScore":
        const maxNum = parseFloat(value);
        if (value === "" || isNaN(maxNum) || maxNum <= 0) {
          newErrors.maxScore = "Valid max score required";
        } else {
          delete newErrors.maxScore;
        }
        break;
      default:
        break;
    }

    setErrors(newErrors);
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;

    validateField(name, value);

    setFormData((prev) => {
      const updated = { ...prev };

      if (name === "testType") {
        // Update test type and auto-set max score based on test type and reset subscores
        updated.testType = value;
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
          case "GRE":
            updated.maxScore = 340; // Verbal + Quantitative combined
            updated.subject = "";
            break;
          case "GMAT":
            updated.maxScore = 800;
            updated.subject = "";
            break;
          default:
            updated.maxScore = 100;
            break;
        }
        updated.score = 0;
        return updated;
      }

      // Handle different field types
      if (name === "score") {
        updated.score = parseFloat(value) || 0;
      } else if (name === "maxScore") {
        updated.maxScore = parseFloat(value) || 0;
      } else if (name === "testDate") {
        updated.testDate = value;
      } else if (name === "retakeDate") {
        updated.retakeDate = value;
      } else if (name === "notes") {
        updated.notes = value;
      } else if (name === "subject") {
        updated.subject = value;
      }

      return updated;
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (Object.keys(errors).length > 0 || formData.score === 0) return;

    onSave(formData);

    // Reset form
    setFormData({
      testType: "SAT",
      subject: "",
      score: 0,
      maxScore: 1600,
      testDate: "",
      retakeDate: "",
      notes: "",
    });
    setErrors({});
    setActiveTab("basic");
    onClose();
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
    return (
      commonSubjects[formData.testType as keyof typeof commonSubjects] || []
    );
  };

  const tabs = [
    { id: "basic", label: "Test Info", icon: FaBook },
    { id: "scores", label: "Scores", icon: FaChartLine },
    { id: "details", label: "Details", icon: FaCalendarAlt },
  ];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-[#141414] border border-neutral-700 rounded-lg max-w-lg w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="p-6 border-b border-neutral-700">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-neutral-800">
                <FaChartLine className="text-[#FEEBD8]" size={18} />
              </div>
              <h2 className="text-xl font-semibold text-[#FEEBD8]">
                Add Exam Score
              </h2>
            </div>
            <button
              onClick={onClose}
              className="text-[#FEEBD8]/60 hover:text-[#FEEBD8] transition-colors"
            >
              <FaTimes size={18} />
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="border-b border-neutral-700">
          <div className="flex">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 text-sm font-medium transition-colors ${
                    activeTab === tab.id
                      ? "text-[#FEEBD8] border-b-2 border-[#FEEBD8] bg-neutral-800/50"
                      : "text-[#FEEBD8]/60 hover:text-[#FEEBD8] hover:bg-neutral-800/30"
                  }`}
                >
                  <Icon size={14} />
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="p-6 space-y-4 max-h-[60vh] overflow-y-auto">
            {/* Basic Info Tab */}
            {activeTab === "basic" && (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-[#FEEBD8]/70 mb-2">
                    Test Type *
                  </label>
                  <select
                    name="testType"
                    value={formData.testType}
                    onChange={handleChange}
                    required
                    className="w-full bg-neutral-800 border border-neutral-700 rounded-lg px-3 py-2 text-[#FEEBD8] focus:outline-none focus:border-[#FEEBD8]"
                  >
                    {testTypes.map((type) => (
                      <option key={type} value={type}>
                        {type}
                      </option>
                    ))}
                  </select>
                </div>

                {getSubjectOptions().length > 0 ? (
                  <div>
                    <label className="block text-sm font-medium text-[#FEEBD8]/70 mb-2">
                      Subject
                    </label>
                    <select
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      className="w-full bg-neutral-800 border border-neutral-700 rounded-lg px-3 py-2 text-[#FEEBD8] focus:outline-none focus:border-[#FEEBD8]"
                    >
                      <option value="">Select Subject</option>
                      {getSubjectOptions().map((subject) => (
                        <option key={subject} value={subject}>
                          {subject}
                        </option>
                      ))}
                    </select>
                  </div>
                ) : (
                  <div>
                    <label className="block text-sm font-medium text-[#FEEBD8]/70 mb-2">
                      Name (Optional)
                    </label>
                    <input
                      type="text"
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      className="w-full bg-neutral-800 border border-neutral-700 rounded-lg px-3 py-2 text-[#FEEBD8] focus:outline-none focus:border-[#FEEBD8]"
                      placeholder="e.g., Math, Reading, Science"
                    />
                  </div>
                )}
              </div>
            )}

            {/* Scores Tab */}
            {activeTab === "scores" && (
              <div className="space-y-6">
                {/* Total Score Section */}
                <div>
                  <h3 className="text-base font-medium text-[#FEEBD8] mb-3">
                    Total Score
                  </h3>
                  <div className="grid grid-cols-2 gap-4">
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
                        className={`w-full bg-neutral-800 border rounded-lg px-3 py-2 text-[#FEEBD8] focus:outline-none transition-colors ${
                          errors.score
                            ? "border-red-500 focus:border-red-500"
                            : "border-neutral-700 focus:border-[#FEEBD8]"
                        }`}
                        placeholder={`0 - ${formData.maxScore}`}
                      />
                      {errors.score && (
                        <p className="text-red-400 text-xs mt-1">
                          {errors.score}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-[#FEEBD8]/70 mb-2">
                        Max Score *
                      </label>
                      <input
                        type="number"
                        name="maxScore"
                        value={formData.maxScore}
                        onChange={handleChange}
                        required
                        min="1"
                        className={`w-full bg-neutral-800 border rounded-lg px-3 py-2 text-[#FEEBD8] focus:outline-none transition-colors ${
                          errors.maxScore
                            ? "border-red-500 focus:border-red-500"
                            : "border-neutral-700 focus:border-[#FEEBD8]"
                        }`}
                      />
                      {errors.maxScore && (
                        <p className="text-red-400 text-xs mt-1">
                          {errors.maxScore}
                        </p>
                      )}
                    </div>
                  </div>

                  {formData.score > 0 && (
                    <div className="bg-neutral-800 rounded-lg p-3 mt-3">
                      <div className="text-center">
                        <div className="text-lg font-semibold text-[#FEEBD8] mb-1">
                          {getScorePercentage()}% •{" "}
                          <span className={getScoreCategory().color}>
                            {getScoreCategory().label}
                          </span>
                        </div>
                        <div className="text-sm text-[#FEEBD8]/70">
                          {formData.score} / {formData.maxScore}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Details Tab */}
            {activeTab === "details" && (
              <div className="space-y-4">
                <DatePicker
                  label="Test Date"
                  value={formData.testDate}
                  onChange={(date) =>
                    setFormData((prev) => ({ ...prev, testDate: date }))
                  }
                  placeholder="Select test date"
                />

                <div>
                  <label className="block text-sm font-medium text-[#FEEBD8]/70 mb-2">
                    Notes (recommended for subscores)
                  </label>
                  <textarea
                    name="notes"
                    value={formData.notes}
                    onChange={handleChange}
                    rows={4}
                    className="w-full bg-neutral-800 border border-neutral-700 rounded-lg px-3 py-2 text-[#FEEBD8] focus:outline-none focus:border-[#FEEBD8]"
                    placeholder="Any additional notes about this test score..."
                  />
                </div>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="p-6 border-t border-neutral-700">
            <div className="flex gap-3">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 bg-neutral-700 text-[#FEEBD8] px-4 py-2 rounded-lg font-medium hover:bg-neutral-600 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={
                  Object.keys(errors).length > 0 || formData.score === 0
                }
                className="flex-1 bg-[#FEEBD8] text-[#141414] px-4 py-2 rounded-lg font-medium hover:bg-[#E5D5B7] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Add Score
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
