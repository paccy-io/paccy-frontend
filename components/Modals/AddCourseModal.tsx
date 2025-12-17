import React from "react";
import {
  FaTimes,
  FaBook,
  FaCalendarAlt,
  FaGraduationCap,
  FaPlus,
} from "react-icons/fa";

interface Course {
  id: number;
  name: string;
  code: string;
  credits: number;
  instructor: string;
  term: string;
  year: number;
  grade: string;
  status: string;
}

interface AddCourseModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (course: Omit<Course, "id">) => void;
}

const gradeOptions = [
  "A+",
  "A",
  "A-",
  "B+",
  "B",
  "B-",
  "C+",
  "C",
  "C-",
  "D+",
  "D",
  "D-",
  "F",
  "P",
  "NP",
  "W",
  "I",
];

const termOptions = ["Fall", "Spring", "Summer", "Winter"];

const statusOptions = [
  "Completed",
  "In Progress",
  "Planned",
  "Dropped",
  "Withdrawn",
];

export default function AddCourseModal({
  isOpen,
  onClose,
  onSave,
}: AddCourseModalProps) {
  const [formData, setFormData] = React.useState({
    name: "",
    code: "",
    credits: 3,
    instructor: "",
    term: "Fall",
    year: new Date().getFullYear(),
    grade: "",
    status: "In Progress",
  });

  // Validation states for number inputs
  const [creditsInputValue, setCreditsInputValue] = React.useState("3");
  const [creditsError, setCreditsError] = React.useState("");
  const [yearInputValue, setYearInputValue] = React.useState(
    new Date().getFullYear().toString()
  );
  const [yearError, setYearError] = React.useState("");

  // Validation handlers
  const handleCreditsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setCreditsInputValue(value);

    if (value === "") {
      setCreditsError("Credits is required");
      return;
    }

    const num = parseInt(value, 10);
    if (isNaN(num)) {
      setCreditsError("Please enter a valid number of credits");
      return;
    }

    if (num < 1 || num > 12) {
      setCreditsError("Credits must be between 1 and 12");
      return;
    }

    setCreditsError("");
    setFormData((prev) => ({ ...prev, credits: num }));
  };

  const handleYearChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setYearInputValue(value);

    if (value === "") {
      setYearError("Year is required");
      return;
    }

    const num = parseInt(value, 10);
    if (isNaN(num)) {
      setYearError("Please enter a valid year");
      return;
    }

    if (num < 2020 || num > 2030) {
      setYearError("Year must be between 2020 and 2030");
      return;
    }

    setYearError("");
    setFormData((prev) => ({ ...prev, year: num }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Check for validation errors before submitting
    if (creditsError || yearError) {
      return;
    }

    onSave(formData);

    // Reset form
    setFormData({
      name: "",
      code: "",
      credits: 3,
      instructor: "",
      term: "Fall",
      year: new Date().getFullYear(),
      grade: "",
      status: "In Progress",
    });

    // Reset validation states
    setCreditsInputValue("3");
    setCreditsError("");
    setYearInputValue(new Date().getFullYear().toString());
    setYearError("");

    onClose();
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "number" ? parseInt(value) || 0 : value,
    }));
  };

  const getGradePoints = (grade: string): number => {
    const gradeMap: Record<string, number> = {
      "A+": 4.0,
      A: 4.0,
      "A-": 3.7,
      "B+": 3.3,
      B: 3.0,
      "B-": 2.7,
      "C+": 2.3,
      C: 2.0,
      "C-": 1.7,
      "D+": 1.3,
      D: 1.0,
      "D-": 0.7,
      F: 0.0,
    };
    return gradeMap[grade] || 0;
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-gradient-to-br from-[#141414] to-[#1a1a1a] border border-neutral-700/50 rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-neutral-700/50">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <FaBook className="text-blue-400 text-xl" />
              <h2 className="text-xl font-bold text-white">
                Add New Course
              </h2>
            </div>
            <button
              onClick={onClose}
              className="text-white/60 hover:text-white transition-colors"
            >
              <FaTimes size={20} />
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Course Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-white/70 mb-2">
                Course Name *
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full bg-neutral-800 border border-neutral-700/50 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-500 transition-colors"
                placeholder="e.g., Introduction to Computer Science"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-white/70 mb-2">
                Course Code
              </label>
              <input
                type="text"
                name="code"
                value={formData.code}
                onChange={handleChange}
                className="w-full bg-neutral-800 border border-neutral-700/50 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-500 transition-colors"
                placeholder="e.g., CS 101"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-white/70 mb-2">
                Credits
              </label>
              <input
                type="text"
                name="credits"
                value={creditsInputValue}
                onChange={handleCreditsChange}
                className={`w-full bg-neutral-800 border rounded-lg px-4 py-2 text-white focus:outline-none transition-colors ${
                  creditsError
                    ? "border-red-500 focus:border-red-500"
                    : "border-neutral-700/50 focus:border-blue-500 transition-colors"
                }`}
                placeholder="1 - 12"
              />
              {creditsError && (
                <p className="text-red-400 text-xs mt-1 flex items-center gap-1">
                  <span>⚠️</span>
                  {creditsError}
                </p>
              )}
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-white/70 mb-2">
                Instructor
              </label>
              <input
                type="text"
                name="instructor"
                value={formData.instructor}
                onChange={handleChange}
                className="w-full bg-neutral-800 border border-neutral-700/50 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-500 transition-colors"
                placeholder="e.g., Dr. Smith, Prof. Johnson"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-white/70 mb-2">
                Term
              </label>
              <select
                name="term"
                value={formData.term}
                onChange={handleChange}
                className="w-full bg-neutral-800 border border-neutral-700/50 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-500 transition-colors"
              >
                {termOptions.map((term) => (
                  <option key={term} value={term}>
                    {term}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-white/70 mb-2">
                Year
              </label>
              <input
                type="text"
                name="year"
                value={yearInputValue}
                onChange={handleYearChange}
                className={`w-full bg-neutral-800 border rounded-lg px-4 py-2 text-white focus:outline-none transition-colors ${
                  yearError
                    ? "border-red-500 focus:border-red-500"
                    : "border-neutral-700/50 focus:border-blue-500 transition-colors"
                }`}
                placeholder="2020 - 2030"
              />
              {yearError && (
                <p className="text-red-400 text-xs mt-1 flex items-center gap-1">
                  <span>⚠️</span>
                  {yearError}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-white/70 mb-2">
                Grade
              </label>
              <select
                name="grade"
                value={formData.grade}
                onChange={handleChange}
                className="w-full bg-neutral-800 border border-neutral-700/50 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-500 transition-colors"
              >
                <option value="">Not Graded Yet</option>
                {gradeOptions.map((grade) => (
                  <option key={grade} value={grade}>
                    {grade}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-white/70 mb-2">
                Status
              </label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="w-full bg-neutral-800 border border-neutral-700/50 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-500 transition-colors"
              >
                {statusOptions.map((status) => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Grade Information */}
          {formData.grade && (
            <div className="bg-neutral-800 rounded-lg p-4">
              <h4 className="text-white font-medium mb-2">
                Grade Information
              </h4>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="text-white/70">Grade Points:</span>
                  <span className="ml-2 text-white font-semibold">
                    {getGradePoints(formData.grade).toFixed(1)}
                  </span>
                </div>
                <div>
                  <span className="text-white/70">Quality Points:</span>
                  <span className="ml-2 text-white font-semibold">
                    {(
                      getGradePoints(formData.grade) * formData.credits
                    ).toFixed(1)}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Course Preview */}
          <div className="bg-neutral-800 rounded-lg p-4">
            <h4 className="text-white font-medium mb-3">Course Preview</h4>
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <FaBook className="text-blue-400" size={16} />
                <div>
                  <div className="text-white font-medium">
                    {formData.name || "Course Name"}
                    {formData.code && (
                      <span className="text-white/60 ml-2">
                        ({formData.code})
                      </span>
                    )}
                  </div>
                  <div className="text-sm text-white/70">
                    {formData.instructor || "Instructor"} • {formData.credits}{" "}
                    credits
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-4 text-sm text-white/60">
                <span className="flex items-center gap-1">
                  <FaCalendarAlt size={12} />
                  {formData.term} {formData.year}
                </span>
                {formData.grade && (
                  <span className="flex items-center gap-1">
                    <FaGraduationCap size={12} />
                    Grade: {formData.grade}
                  </span>
                )}
                <span
                  className={`px-2 py-1 rounded text-xs ${
                    formData.status === "Completed"
                      ? "bg-green-500/20 text-green-400"
                      : formData.status === "In Progress"
                      ? "bg-blue-500/20 text-blue-400"
                      : formData.status === "Planned"
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
          <div className="flex gap-3 pt-4 border-t border-neutral-700/50">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 bg-neutral-700 text-white px-6 py-3 rounded-lg font-medium hover:bg-neutral-600 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!!(creditsError || yearError)}
              className="flex-1 bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Add Course
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
