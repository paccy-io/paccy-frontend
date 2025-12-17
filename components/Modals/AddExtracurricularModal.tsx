import React from "react";
import {
  FaTimes,
  FaStar,
  FaPlus,
  FaCalendar,
  FaAward,
  FaUsers,
  FaMapMarkerAlt,
} from "react-icons/fa";
import {
  Extracurricular,
  CreateExtracurricularDTO,
  ExtracurricularCategory,
} from "../../lib/types";

interface AddExtracurricularModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (activity: CreateExtracurricularDTO) => void;
}

const categories = [
  { value: ExtracurricularCategory.ACADEMIC, label: "Academic" },
  { value: ExtracurricularCategory.SPORTS, label: "Sports" },
  { value: ExtracurricularCategory.MUSIC, label: "Music" },
  { value: ExtracurricularCategory.ARTS, label: "Arts" },
  {
    value: ExtracurricularCategory.COMMUNITY_SERVICE,
    label: "Community Service",
  },
  { value: ExtracurricularCategory.LEADERSHIP, label: "Leadership" },
  { value: ExtracurricularCategory.TECHNOLOGY, label: "Technology" },
  { value: ExtracurricularCategory.VOLUNTEERING, label: "Volunteering" },
  { value: ExtracurricularCategory.CLUBS, label: "Clubs" },
  { value: ExtracurricularCategory.WORK_EXPERIENCE, label: "Work Experience" },
  { value: ExtracurricularCategory.RESEARCH, label: "Research" },
  { value: ExtracurricularCategory.OTHER, label: "Other" },
];

const commonSkills = [
  "Leadership",
  "Teamwork",
  "Communication",
  "Problem Solving",
  "Time Management",
  "Organization",
  "Public Speaking",
  "Research",
  "Critical Thinking",
  "Creativity",
  "Collaboration",
  "Project Management",
];

// Generate years from current year - 10 to current year + 5
const generateYears = () => {
  const currentYear = new Date().getFullYear();
  const years = [];
  for (let year = currentYear - 10; year <= currentYear + 5; year++) {
    years.push(year.toString());
  }
  return years;
};

const months = [
  { value: "01", label: "January" },
  { value: "02", label: "February" },
  { value: "03", label: "March" },
  { value: "04", label: "April" },
  { value: "05", label: "May" },
  { value: "06", label: "June" },
  { value: "07", label: "July" },
  { value: "08", label: "August" },
  { value: "09", label: "September" },
  { value: "10", label: "October" },
  { value: "11", label: "November" },
  { value: "12", label: "December" },
];

export default function AddExtracurricularModal({
  isOpen,
  onClose,
  onSave,
}: AddExtracurricularModalProps) {
  const [formData, setFormData] = React.useState({
    activity_name: "",
    category: ExtracurricularCategory.ACADEMIC,
    position: "",
    description: "",
    start_date: "",
    end_date: "",
    location: "",
    hours_per_week: 1,
    website: "",
    achievements: [] as string[],
    skills: [] as string[],
  });

  const [newAchievement, setNewAchievement] = React.useState("");
  const [customSkill, setCustomSkill] = React.useState("");
  const [startYear, setStartYear] = React.useState("");
  const [startMonth, setStartMonth] = React.useState("");
  const [endYear, setEndYear] = React.useState("");
  const [endMonth, setEndMonth] = React.useState("");
  const [isOngoing, setIsOngoing] = React.useState(false);

  // Add validation state for hours per week
  const [hoursInputValue, setHoursInputValue] = React.useState("1");
  const [hoursError, setHoursError] = React.useState("");

  // Update start_date and end_date when year/month changes
  React.useEffect(() => {
    if (startYear && startMonth) {
      setFormData((prev) => ({
        ...prev,
        start_date: `${startYear}-${startMonth}`,
      }));
    }
  }, [startYear, startMonth]);

  React.useEffect(() => {
    if (isOngoing) {
      setFormData((prev) => ({
        ...prev,
        end_date: "present",
      }));
    } else if (endYear && endMonth) {
      setFormData((prev) => ({
        ...prev,
        end_date: `${endYear}-${endMonth}`,
      }));
    }
  }, [endYear, endMonth, isOngoing]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Basic validation
    if (!formData.activity_name.trim()) {
      alert("Activity name is required");
      return;
    }
    if (!formData.position.trim()) {
      alert("Position is required");
      return;
    }
    if (hoursError) {
      alert("Please fix the hours per week field");
      return;
    }
    if (!hoursInputValue.trim()) {
      alert("Hours per week is required");
      return;
    }

    onSave(formData);

    // Reset form
    setFormData({
      activity_name: "",
      category: ExtracurricularCategory.ACADEMIC,
      position: "",
      description: "",
      start_date: "",
      end_date: "",
      location: "",
      hours_per_week: 1,
      website: "",
      achievements: [],
      skills: [],
    });
    setNewAchievement("");
    setCustomSkill("");
    setStartYear("");
    setStartMonth("");
    setEndYear("");
    setEndMonth("");
    setIsOngoing(false);
    // Reset hours validation state
    setHoursInputValue("1");
    setHoursError("");
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

  // Dedicated handler for hours per week with validation
  const handleHoursChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setHoursInputValue(value);

    // Clear previous error
    setHoursError("");

    // Validate input
    if (value === "") {
      setHoursError("Hours per week is required");
      return;
    }

    const numValue = parseFloat(value);
    if (isNaN(numValue)) {
      setHoursError("Please enter a valid number");
      return;
    }

    if (numValue <= 0) {
      setHoursError("Hours must be greater than 0");
      return;
    }

    if (numValue > 168) {
      setHoursError("Hours cannot exceed 168 (hours in a week)");
      return;
    }

    // If validation passes, update form data
    setFormData((prev) => ({
      ...prev,
      hours_per_week: numValue,
    }));
  };

  const addAchievement = () => {
    if (newAchievement.trim()) {
      setFormData((prev) => ({
        ...prev,
        achievements: [...prev.achievements, newAchievement.trim()],
      }));
      setNewAchievement("");
    }
  };

  const removeAchievement = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      achievements: prev.achievements.filter((_, i) => i !== index),
    }));
  };

  const addSkill = (skill: string) => {
    if (skill && !formData.skills.includes(skill)) {
      setFormData((prev) => ({
        ...prev,
        skills: [...prev.skills, skill],
      }));
    }
  };

  const removeSkill = (skillToRemove: string) => {
    setFormData((prev) => ({
      ...prev,
      skills: prev.skills.filter((skill) => skill !== skillToRemove),
    }));
  };

  const addCustomSkill = () => {
    if (customSkill.trim()) {
      addSkill(customSkill.trim());
      setCustomSkill("");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-[#141414] border border-neutral-700/50 rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-neutral-700/50">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <FaStar className="text-purple-400 text-xl" />
              <h2 className="text-xl font-bold text-white">
                Add Extracurricular Activity
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
          {/* Basic Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-white/70 mb-2">
                Activity Name *
              </label>
              <input
                type="text"
                name="activity_name"
                value={formData.activity_name}
                onChange={handleChange}
                required
                className="w-full bg-[#1A1A1A] border border-neutral-700/50 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-500 transition-colors"
                placeholder="e.g., Student Government, Debate Club, Varsity Basketball"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-white/70 mb-2">
                Category
              </label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="w-full bg-[#1A1A1A] border border-neutral-700/50 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-500 transition-colors"
              >
                {categories.map((category) => (
                  <option key={category.value} value={category.value}>
                    {category.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-white/70 mb-2">
                Your Role/Position
              </label>
              <input
                type="text"
                name="position"
                value={formData.position}
                onChange={handleChange}
                className="w-full bg-[#1A1A1A] border border-neutral-700/50 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-500 transition-colors"
                placeholder="e.g., President, Member, Captain, Volunteer"
              />
            </div>

            {/* Date Range */}
            <div className="md:col-span-2">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-white/70 mb-2 flex items-center gap-2">
                    <FaCalendar className="text-blue-400" />
                    Start Date *
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <select
                      value={startYear}
                      onChange={(e) => setStartYear(e.target.value)}
                      required
                      className="w-full bg-[#1A1A1A] border border-neutral-700/50 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-blue-500 transition-colors"
                    >
                      <option value="">Year</option>
                      {generateYears().map((year) => (
                        <option key={year} value={year}>
                          {year}
                        </option>
                      ))}
                    </select>
                    <select
                      value={startMonth}
                      onChange={(e) => setStartMonth(e.target.value)}
                      required
                      className="w-full bg-[#1A1A1A] border border-neutral-700/50 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-blue-500 transition-colors"
                    >
                      <option value="">Month</option>
                      {months.map((month) => (
                        <option key={month.value} value={month.value}>
                          {month.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium text-white/70 mb-2 flex items-center gap-2">
                    <FaCalendar className="text-blue-400" />
                    End Date
                  </label>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={isOngoing}
                        onChange={(e) => setIsOngoing(e.target.checked)}
                        className="w-4 h-4 text-white bg-[#1A1A1A] border border-neutral-700/50 rounded focus:ring-blue-500"
                      />
                      <label className="text-sm text-white/70">
                        Currently ongoing
                      </label>
                    </div>
                    {!isOngoing && (
                      <div className="grid grid-cols-2 gap-2">
                        <select
                          value={endYear}
                          onChange={(e) => setEndYear(e.target.value)}
                          className="w-full bg-[#1A1A1A] border border-neutral-700/50 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-blue-500 transition-colors"
                        >
                          <option value="">Year</option>
                          {generateYears().map((year) => (
                            <option key={year} value={year}>
                              {year}
                            </option>
                          ))}
                        </select>
                        <select
                          value={endMonth}
                          onChange={(e) => setEndMonth(e.target.value)}
                          className="w-full bg-[#1A1A1A] border border-neutral-700/50 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-blue-500 transition-colors"
                        >
                          <option value="">Month</option>
                          {months.map((month) => (
                            <option key={month.value} value={month.value}>
                              {month.label}
                            </option>
                          ))}
                        </select>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div>
              <label className="text-sm font-medium text-white/70 mb-2 flex items-center gap-2">
                <FaMapMarkerAlt className="text-green-400" />
                Location (Optional)
              </label>
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleChange}
                className="w-full bg-[#1A1A1A] border border-neutral-700/50 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-500 transition-colors"
                placeholder="e.g., City, State"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-white/70 mb-2">
                Hours per Week *
              </label>
              <input
                type="text"
                name="hours_per_week"
                value={hoursInputValue}
                onChange={handleHoursChange}
                className={`w-full bg-[#1A1A1A] border rounded-lg px-4 py-2 text-white focus:outline-none transition-colors ${
                  hoursError
                    ? "border-red-500 focus:border-red-500"
                    : "border-neutral-700/50 focus:border-blue-500 transition-colors"
                }`}
                placeholder="e.g., 5, 10, 2.5"
              />
              {hoursError && (
                <p className="text-red-400 text-xs mt-1 flex items-center gap-1">
                  <span>⚠️</span>
                  {hoursError}
                </p>
              )}
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-white/70 mb-2">
              Description
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={3}
              className="w-full bg-[#1A1A1A] border border-neutral-700/50 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-500 transition-colors"
              placeholder="Describe what you do in this activity, your responsibilities, and what you've learned..."
            />
          </div>

          {/* Achievements */}
          <div>
            <label className="block text-sm font-medium text-white/70 mb-2">
              Achievements & Awards
            </label>
            <div className="flex gap-2 mb-3">
              <input
                type="text"
                value={newAchievement}
                onChange={(e) => setNewAchievement(e.target.value)}
                placeholder="Add an achievement or award"
                className="flex-1 bg-[#1A1A1A] border border-neutral-700/50 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-500 transition-colors"
                onKeyPress={(e) =>
                  e.key === "Enter" && (e.preventDefault(), addAchievement())
                }
              />
              <button
                type="button"
                onClick={addAchievement}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center gap-2"
              >
                <FaPlus size={12} />
                Add
              </button>
            </div>
            {formData.achievements.length > 0 && (
              <div className="space-y-2">
                {Array.isArray(formData.achievements) &&
                  formData.achievements.map((achievement, index) => (
                    <div
                      key={index}
                      className="bg-[#1A1A1A] rounded-lg p-3 flex items-center justify-between border border-neutral-700/50"
                    >
                      <div className="flex items-center gap-2">
                        <FaAward className="text-yellow-400" size={14} />
                        <span className="text-white">{achievement}</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeAchievement(index)}
                        className="text-red-400 hover:text-red-300 transition-colors"
                      >
                        <FaTimes size={14} />
                      </button>
                    </div>
                  ))}
              </div>
            )}
          </div>

          {/* Skills */}
          <div>
            <label className="block text-sm font-medium text-white/70 mb-2">
              Skills Developed
            </label>

            {/* Common Skills */}
            <div className="flex flex-wrap gap-2 mb-3">
              {commonSkills.map((skill) => (
                <button
                  key={skill}
                  type="button"
                  onClick={() => addSkill(skill)}
                  className={`px-3 py-1 rounded-full text-sm transition-colors ${
                    formData.skills.includes(skill)
                      ? "bg-blue-600 text-white"
                      : "bg-[#1A1A1A] text-white/70 hover:bg-neutral-600 border border-neutral-700/50"
                  }`}
                >
                  {skill}
                </button>
              ))}
            </div>

            {/* Custom Skill Input */}
            <div className="flex gap-2 mb-3">
              <input
                type="text"
                value={customSkill}
                onChange={(e) => setCustomSkill(e.target.value)}
                placeholder="Add custom skill"
                className="flex-1 bg-[#1A1A1A] border border-neutral-700/50 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-500 transition-colors"
                onKeyPress={(e) =>
                  e.key === "Enter" && (e.preventDefault(), addCustomSkill())
                }
              />
              <button
                type="button"
                onClick={addCustomSkill}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors"
              >
                Add
              </button>
            </div>

            {/* Selected Skills */}
            {formData.skills.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {Array.isArray(formData.skills) &&
                  formData.skills.map((skill) => (
                    <span
                      key={skill}
                      className="bg-blue-500/20 text-blue-400 px-3 py-1 rounded-full text-sm flex items-center gap-2"
                    >
                      {skill}
                      <button
                        type="button"
                        onClick={() => removeSkill(skill)}
                        className="hover:text-red-400 transition-colors"
                      >
                        <FaTimes size={12} />
                      </button>
                    </span>
                  ))}
              </div>
            )}
          </div>

          {/* Preview */}
          <div className="bg-[#1A1A1A] rounded-lg p-4 border border-neutral-700/50">
            <h4 className="text-white font-medium mb-3">Preview</h4>
            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2">
                <FaStar className="text-purple-400" size={14} />
                <span className="text-white font-medium">
                  {formData.activity_name || "Activity Name"}
                </span>
                <span className="text-white/50">•</span>
                <span className="text-white/70">
                  {formData.position || "Role"}
                </span>
              </div>
              <div className="flex items-center gap-4 text-white/60">
                <span className="flex items-center gap-1">
                  <FaCalendar size={12} />
                  {formData.start_date
                    ? `${formData.start_date} - ${
                        formData.end_date === "present"
                          ? "Present"
                          : formData.end_date || "Present"
                      }`
                    : "Date Range"}
                </span>
                <span className="flex items-center gap-1">
                  <FaUsers size={12} />
                  {formData.hours_per_week} hrs/week
                </span>
              </div>
              {formData.description && (
                <p className="text-white/70 mt-2">{formData.description}</p>
              )}
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
              className="flex-1 bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
            >
              Add Activity
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
