import React from "react";
import {
  FaTimes,
  FaChartLine,
  FaBook,
  FaCalendarAlt,
  FaClipboardList,
} from "react-icons/fa";

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
  examToEdit?: {
    id: string;
    type: string;
    name: string;
    score: string;
    max_score: string;
    exam_date: string;
    notes?: string;
  } | null;
}

const testTypes = [
  "SAT",
  "ACT",
  "SAT Subject Test",
  "AP",
  "IB",
  "TOEFL",
  "IELTS",
  "GRE",
  "GMAT",
  "LSAT",
  "MCAT",
  "other",
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
  AP: [
    // Arts
    "Art History",
    "Music Theory",
    "Studio Art: 2-D Design",
    "Studio Art: 3-D Design",
    "Studio Art: Drawing",

    // English
    "English Language and Composition",
    "English Literature and Composition",

    // History & Social Science
    "Comparative Government and Politics",
    "European History",
    "Human Geography",
    "Macroeconomics",
    "Microeconomics",
    "Psychology",
    "United States Government and Politics",
    "United States History",
    "World History: Modern",

    // Math & Computer Science
    "Calculus AB",
    "Calculus BC",
    "Computer Science A",
    "Computer Science Principles",
    "Precalculus",
    "Statistics",

    // Sciences
    "Biology",
    "Chemistry",
    "Environmental Science",
    "Physics 1: Algebra-Based",
    "Physics 2: Algebra-Based",
    "Physics C: Electricity and Magnetism",
    "Physics C: Mechanics",

    // World Languages & Cultures
    "Chinese Language and Culture",
    "French Language and Culture",
    "German Language and Culture",
    "Italian Language and Culture",
    "Japanese Language and Culture",
    "Latin",
    "Spanish Language and Culture",
    "Spanish Literature and Culture",
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
  examToEdit,
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

  // Initialize form data when editing
  React.useEffect(() => {
    if (examToEdit) {
      setFormData({
        testType: examToEdit.type,
        subject: examToEdit.name !== examToEdit.type ? examToEdit.name : "",
        score: parseFloat(examToEdit.score),
        maxScore: parseFloat(examToEdit.max_score),
        testDate: examToEdit.exam_date,
        retakeDate: "",
        notes: examToEdit.notes || "",
      });
    } else {
      // Reset to default when adding new
      setFormData({
        testType: "SAT",
        subject: "",
        score: 0,
        maxScore: 1600,
        testDate: "",
        retakeDate: "",
        notes: "",
      });
    }
    setErrors({});
    setActiveTab("basic");
  }, [examToEdit, isOpen]);

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
      case "testDate":
        if (!value || value.trim() === "") {
          newErrors.testDate = "Exam date is required";
        } else {
          // Validate YYYY-MM format
          const dateRegex = /^\d{4}-\d{2}$/;
          if (!dateRegex.test(value)) {
            newErrors.testDate = "Invalid date format (YYYY-MM required)";
          } else {
            delete newErrors.testDate;
          }
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
          case "AP":
            updated.maxScore = 5;
            break;
          case "IB":
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

    // Validate all required fields before submission
    validateField("score", formData.score);
    validateField("maxScore", formData.maxScore);
    validateField("testDate", formData.testDate);

    if (
      Object.keys(errors).length > 0 ||
      formData.score === 0 ||
      !formData.testDate
    )
      return;

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
      <div className="bg-gradient-to-br from-[#141414] to-[#1a1a1a] border border-neutral-700/50 rounded-xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="p-6 border-b border-neutral-700/50">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-neutral-800">
                <FaChartLine className="text-white" size={18} />
              </div>
              <h2 className="text-xl font-semibold text-white">
                {examToEdit ? "Edit Exam Score" : "Add Exam Score"}
              </h2>
            </div>
            <button
              onClick={onClose}
              className="text-white/60 hover:text-white transition-colors"
            >
              <FaTimes size={18} />
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="border-b border-neutral-700/50">
          <div className="flex">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 text-sm font-medium transition-colors ${
                    activeTab === tab.id
                      ? "text-white border-b-2 border-blue-500 bg-neutral-800/50"
                      : "text-white/60 hover:text-white hover:bg-neutral-800/30"
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
                  <label className="block text-sm font-medium text-white/70 mb-2">
                    Test Type *
                  </label>
                  <select
                    name="testType"
                    value={formData.testType}
                    onChange={handleChange}
                    required
                    className="w-full bg-neutral-800 border border-neutral-700/50 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-blue-500 transition-colors"
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
                    <label className="block text-sm font-medium text-white/70 mb-2">
                      Subject
                    </label>
                    <select
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      className="w-full bg-neutral-800 border border-neutral-700/50 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-blue-500 transition-colors"
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
                    <label className="block text-sm font-medium text-white/70 mb-2">
                      Name (Optional)
                    </label>
                    <input
                      type="text"
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      className="w-full bg-neutral-800 border border-neutral-700/50 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-blue-500 transition-colors"
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
                  <h3 className="text-base font-medium text-white mb-3">
                    Total Score
                  </h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-white/70 mb-2">
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
                        className={`w-full bg-neutral-800 border rounded-lg px-3 py-2 text-white focus:outline-none transition-colors ${
                          errors.score
                            ? "border-red-500 focus:border-red-500"
                            : "border-neutral-700/50 focus:border-blue-500 transition-colors"
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
                      <label className="block text-sm font-medium text-white/70 mb-2">
                        Max Score *
                      </label>
                      <input
                        type="number"
                        name="maxScore"
                        value={formData.maxScore}
                        onChange={handleChange}
                        required
                        min="1"
                        className={`w-full bg-neutral-800 border rounded-lg px-3 py-2 text-white focus:outline-none transition-colors ${
                          errors.maxScore
                            ? "border-red-500 focus:border-red-500"
                            : "border-neutral-700/50 focus:border-blue-500 transition-colors"
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
                        <div className="text-lg font-semibold text-white mb-1">
                          {getScorePercentage()}% •{" "}
                          <span className={getScoreCategory().color}>
                            {getScoreCategory().label}
                          </span>
                        </div>
                        <div className="text-sm text-white/70">
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
                <div>
                  <label className="block text-sm font-medium text-white/70 mb-2">
                    Exam Date (Month & Year) *
                  </label>
                  <input
                    type="month"
                    name="testDate"
                    value={formData.testDate}
                    onChange={handleChange}
                    required
                    className={`w-full bg-neutral-800 border rounded-lg px-3 py-2 text-white focus:outline-none transition-colors ${
                      errors.testDate
                        ? "border-red-500 focus:border-red-500"
                        : "border-neutral-700/50 focus:border-blue-500 transition-colors"
                    }`}
                    placeholder="YYYY-MM"
                  />
                  {errors.testDate && (
                    <p className="text-red-400 text-xs mt-1">
                      {errors.testDate}
                    </p>
                  )}
                  <p className="text-white/50 text-xs mt-1">
                    Select the month and year when you took this exam
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-white/70 mb-2">
                    Notes (recommended for subscores)
                  </label>
                  <textarea
                    name="notes"
                    value={formData.notes}
                    onChange={handleChange}
                    rows={4}
                    className="w-full bg-neutral-800 border border-neutral-700/50 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-blue-500 transition-colors"
                    placeholder="Any additional notes about this test score..."
                  />
                </div>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="p-6 border-t border-neutral-700/50">
            <div className="flex gap-3">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 bg-neutral-700 text-white px-4 py-2 rounded-lg font-medium hover:bg-neutral-600 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={
                  Object.keys(errors).length > 0 ||
                  formData.score === 0 ||
                  !formData.testDate
                }
                className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {examToEdit ? "Update Score" : "Add Score"}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
