import React, { useState, useEffect } from "react";
import {
  FaTimes,
  FaUsers,
  FaCalendarAlt,
  FaTrophy,
  FaMapMarkerAlt,
  FaGlobe,
  FaPlus,
} from "react-icons/fa";
import {
  Extracurricular,
  UpdateExtracurricularDTO,
  ExtracurricularCategory,
} from "../../lib/types";

interface EditExtracurricularModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (extracurricular: UpdateExtracurricularDTO) => void; // Already correct - supports partial updates
  extracurricular: Extracurricular | null;
}

const categoryOptions = [
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

const EditExtracurricularModal: React.FC<EditExtracurricularModalProps> = ({
  isOpen,
  onClose,
  onSave,
  extracurricular,
}) => {
  const [formData, setFormData] = useState({
    activity_name: "",
    category: ExtracurricularCategory.ACADEMIC,
    position: "",
    description: "",
    start_date: "",
    end_date: "",
    hours_per_week: 1,
    achievements: [] as string[],
    location: "",
    website: "",
    skills: [] as string[],
  });

  // Track original data to compare changes
  const [originalData, setOriginalData] = useState({
    activity_name: "",
    category: ExtracurricularCategory.ACADEMIC,
    position: "",
    description: "",
    start_date: "",
    end_date: "",
    hours_per_week: 1,
    achievements: [] as string[],
    location: "",
    website: "",
    skills: [] as string[],
  });

  const [newAchievement, setNewAchievement] = useState("");
  const [newSkill, setNewSkill] = useState("");
  const [startYear, setStartYear] = useState("");
  const [startMonth, setStartMonth] = useState("");
  const [endYear, setEndYear] = useState("");
  const [endMonth, setEndMonth] = useState("");
  const [isOngoing, setIsOngoing] = useState(false);

  // Add validation state for hours per week
  const [hoursInputValue, setHoursInputValue] = useState("");
  const [hoursError, setHoursError] = useState("");

  // Update form data when extracurricular prop changes
  useEffect(() => {
    if (extracurricular) {
      const initialData = {
        activity_name: extracurricular.activity_name || "",
        category: extracurricular.category || ExtracurricularCategory.ACADEMIC,
        position: extracurricular.position || "",
        description: extracurricular.description || "",
        start_date: extracurricular.start_date || "",
        end_date: extracurricular.end_date || "",
        hours_per_week: extracurricular.hours_per_week || 1,
        achievements: extracurricular.achievements || [],
        location: extracurricular.location || "",
        website: extracurricular.website || "",
        skills: extracurricular.skills || [],
      };

      setFormData(initialData);
      setOriginalData(initialData); // Track original data for comparison

      // Set initial hours input value
      setHoursInputValue(String(extracurricular.hours_per_week || 1));
      setHoursError(""); // Clear any previous errors

      // Parse existing dates
      if (extracurricular.start_date) {
        const [year, month] = extracurricular.start_date.split("-");
        setStartYear(year);
        setStartMonth(month);
      }

      if (extracurricular.end_date && extracurricular.end_date !== "Present") {
        const [year, month] = extracurricular.end_date.split("-");
        setEndYear(year);
        setEndMonth(month);
        setIsOngoing(false);
      } else if (extracurricular.end_date === "Present") {
        setIsOngoing(true);
      }
    }
  }, [extracurricular]);

  // Update startDate and endDate when year/month changes
  useEffect(() => {
    if (startYear && startMonth) {
      setFormData((prev) => ({
        ...prev,
        start_date: `${startYear}-${startMonth}`,
      }));
    }
  }, [startYear, startMonth]);

  useEffect(() => {
    if (isOngoing) {
      setFormData((prev) => ({
        ...prev,
        end_date: "Present",
      }));
    } else if (endYear && endMonth) {
      setFormData((prev) => ({
        ...prev,
        end_date: `${endYear}-${endMonth}`,
      }));
    }
  }, [endYear, endMonth, isOngoing]);

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

  if (!isOpen || !extracurricular) return null;

  // Helper function to compare arrays
  const arraysEqual = (a: string[], b: string[]) => {
    return a.length === b.length && a.every((val, index) => val === b[index]);
  };

  // Get only the fields that have changed
  const getChangedFields = () => {
    const changedFields: Partial<typeof formData> = {};

    // Compare each field
    if (formData.activity_name !== originalData.activity_name) {
      changedFields.activity_name = formData.activity_name;
    }
    if (formData.category !== originalData.category) {
      changedFields.category = formData.category;
    }
    if (formData.position !== originalData.position) {
      changedFields.position = formData.position;
    }
    if (formData.description !== originalData.description) {
      changedFields.description = formData.description;
    }
    if (formData.start_date !== originalData.start_date) {
      changedFields.start_date = formData.start_date;
    }
    if (formData.end_date !== originalData.end_date) {
      changedFields.end_date = formData.end_date;
    }
    if (formData.hours_per_week !== originalData.hours_per_week) {
      changedFields.hours_per_week = formData.hours_per_week;
    }
    if (formData.location !== originalData.location) {
      changedFields.location = formData.location;
    }
    if (formData.website !== originalData.website) {
      changedFields.website = formData.website;
    }
    if (!arraysEqual(formData.achievements, originalData.achievements)) {
      changedFields.achievements = formData.achievements;
    }
    if (!arraysEqual(formData.skills, originalData.skills)) {
      changedFields.skills = formData.skills;
    }

    return changedFields;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validate hours per week before processing
    if (hoursError) {
      alert("Please fix the hours per week field");
      return;
    }
    if (!hoursInputValue.trim()) {
      alert("Hours per week is required");
      return;
    }

    const changedFields = getChangedFields();

    // Only submit if there are actually changes
    if (Object.keys(changedFields).length === 0) {
      onClose(); // Just close the modal if no changes
      return;
    }

    onSave(changedFields);
  };

  const addAchievement = () => {
    if (newAchievement.trim()) {
      setFormData({
        ...formData,
        achievements: [...formData.achievements, newAchievement.trim()],
      });
      setNewAchievement("");
    }
  };

  const removeAchievement = (index: number) => {
    setFormData({
      ...formData,
      achievements: formData.achievements.filter((_, i) => i !== index),
    });
  };

  const addSkill = () => {
    if (newSkill.trim()) {
      setFormData({
        ...formData,
        skills: [...formData.skills, newSkill.trim()],
      });
      setNewSkill("");
    }
  };

  const removeSkill = (index: number) => {
    setFormData({
      ...formData,
      skills: formData.skills.filter((_, i) => i !== index),
    });
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-[#141414] border border-neutral-700/50 rounded-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-neutral-700/50">
          <h2 className="text-xl font-semibold text-[#FEEBD8] flex items-center gap-2">
            <FaUsers className="text-purple-400" />
            Edit Extracurricular Activity
          </h2>
          <button
            onClick={onClose}
            className="text-neutral-400 hover:text-neutral-300 transition-colors"
          >
            <FaTimes />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Basic Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-[#FEEBD8] text-sm font-medium mb-2">
                Activity Name *
              </label>
              <input
                type="text"
                value={formData.activity_name}
                onChange={(e) =>
                  setFormData({ ...formData, activity_name: e.target.value })
                }
                className="w-full bg-[#1A1A1A] border border-neutral-700/50 rounded-lg px-3 py-2 text-white placeholder-neutral-400 focus:outline-none focus:border-[#FEEBD8] transition-colors"
                required
              />
            </div>

            <div>
              <label className="block text-[#FEEBD8] text-sm font-medium mb-2">
                Category *
              </label>
              <select
                value={formData.category}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    category: e.target.value as ExtracurricularCategory,
                  })
                }
                className="w-full bg-[#1A1A1A] border border-neutral-700/50 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-[#FEEBD8] transition-colors"
                required
              >
                {categoryOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-[#FEEBD8] text-sm font-medium mb-2">
                Role/Position *
              </label>
              <input
                type="text"
                value={formData.position}
                onChange={(e) =>
                  setFormData({ ...formData, position: e.target.value })
                }
                className="w-full bg-[#1A1A1A] border border-neutral-700/50 rounded-lg px-3 py-2 text-white placeholder-neutral-400 focus:outline-none focus:border-[#FEEBD8] transition-colors"
                required
              />
            </div>

            <div>
              <label className="block text-[#FEEBD8] text-sm font-medium mb-2">
                Hours per Week *
              </label>
              <input
                type="text"
                value={hoursInputValue}
                onChange={handleHoursChange}
                className={`w-full bg-[#1A1A1A] border rounded-lg px-3 py-2 text-white placeholder-neutral-400 focus:outline-none transition-colors ${
                  hoursError
                    ? "border-red-500 focus:border-red-500"
                    : "border-neutral-700/50 focus:border-[#FEEBD8]"
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

          {/* Date Range */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-[#FEEBD8] text-sm font-medium mb-2 flex items-center gap-2">
                <FaCalendarAlt className="text-blue-400" />
                Start Date *
              </label>
              <div className="grid grid-cols-2 gap-2">
                <select
                  value={startYear}
                  onChange={(e) => setStartYear(e.target.value)}
                  required
                  className="w-full bg-[#1A1A1A] border border-neutral-700/50 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-[#FEEBD8] transition-colors"
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
                  className="w-full bg-[#1A1A1A] border border-neutral-700/50 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-[#FEEBD8] transition-colors"
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
              <label className="text-[#FEEBD8] text-sm font-medium mb-2 flex items-center gap-2">
                <FaCalendarAlt className="text-blue-400" />
                End Date
              </label>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={isOngoing}
                    onChange={(e) => setIsOngoing(e.target.checked)}
                    className="w-4 h-4 text-[#FEEBD8] bg-[#1A1A1A] border border-neutral-700/50 rounded focus:ring-[#FEEBD8]"
                  />
                  <label className="text-sm text-[#FEEBD8]/70">
                    Currently ongoing
                  </label>
                </div>
                {!isOngoing && (
                  <div className="grid grid-cols-2 gap-2">
                    <select
                      value={endYear}
                      onChange={(e) => setEndYear(e.target.value)}
                      className="w-full bg-[#1A1A1A] border border-neutral-700/50 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-[#FEEBD8] transition-colors"
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
                      className="w-full bg-[#1A1A1A] border border-neutral-700/50 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-[#FEEBD8] transition-colors"
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

          {/* Location and Website */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-[#FEEBD8] text-sm font-medium mb-2 flex items-center gap-2">
                <FaMapMarkerAlt className="text-green-400" />
                Location (Optional)
              </label>
              <input
                type="text"
                value={formData.location}
                onChange={(e) =>
                  setFormData({ ...formData, location: e.target.value })
                }
                className="w-full bg-[#1A1A1A] border border-neutral-700/50 rounded-lg px-3 py-2 text-white placeholder-neutral-400 focus:outline-none focus:border-[#FEEBD8] transition-colors"
                placeholder="City, State"
              />
            </div>

            <div>
              <label className="text-[#FEEBD8] text-sm font-medium mb-2 flex items-center gap-2">
                <FaGlobe className="text-cyan-400" />
                Website (Optional)
              </label>
              <input
                type="url"
                value={formData.website}
                onChange={(e) =>
                  setFormData({ ...formData, website: e.target.value })
                }
                className="w-full bg-[#1A1A1A] border border-neutral-700/50 rounded-lg px-3 py-2 text-white placeholder-neutral-400 focus:outline-none focus:border-[#FEEBD8] transition-colors"
                placeholder="https://..."
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-[#FEEBD8] text-sm font-medium mb-2">
              Description
            </label>
            <textarea
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              className="w-full bg-[#1A1A1A] border border-neutral-700/50 rounded-lg px-3 py-2 text-white placeholder-neutral-400 focus:outline-none focus:border-[#FEEBD8] transition-colors h-24 resize-none"
              placeholder="Describe your role and responsibilities..."
            />
          </div>

          {/* Achievements */}
          <div>
            <label className="text-[#FEEBD8] text-sm font-medium mb-2 flex items-center gap-2">
              <FaTrophy className="text-yellow-400" />
              Achievements & Awards
            </label>
            <div className="space-y-2">
              {Array.isArray(formData.achievements) &&
                formData.achievements.map((achievement, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-2 bg-[#1A1A1A] p-2 rounded-lg border border-neutral-700/50"
                  >
                    <span className="text-white flex-1">{achievement}</span>
                    <button
                      type="button"
                      onClick={() => removeAchievement(index)}
                      className="text-red-400 hover:text-red-300 transition-colors"
                    >
                      <FaTimes />
                    </button>
                  </div>
                ))}
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newAchievement}
                  onChange={(e) => setNewAchievement(e.target.value)}
                  className="flex-1 bg-[#1A1A1A] border border-neutral-700/50 rounded-lg px-3 py-2 text-white placeholder-neutral-400 focus:outline-none focus:border-[#FEEBD8] transition-colors"
                  placeholder="Add an achievement..."
                  onKeyPress={(e) => e.key === "Enter" && addAchievement()}
                />
                <button
                  type="button"
                  onClick={addAchievement}
                  className="bg-[#FEEBD8] text-[#141414] px-4 py-2 rounded-lg font-medium hover:bg-[#E5D5B7] transition-colors"
                >
                  <FaPlus />
                </button>
              </div>
            </div>
          </div>

          {/* Skills */}
          <div>
            <label className="block text-[#FEEBD8] text-sm font-medium mb-2">
              Skills Developed
            </label>
            <div className="space-y-2">
              <div className="flex flex-wrap gap-2">
                {Array.isArray(formData.skills) &&
                  formData.skills.map((skill, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-2 bg-blue-500/20 text-blue-400 px-3 py-1 rounded-full"
                    >
                      <span className="text-blue-400 text-sm">{skill}</span>
                      <button
                        type="button"
                        onClick={() => removeSkill(index)}
                        className="text-red-400 hover:text-red-300 transition-colors text-sm"
                      >
                        <FaTimes />
                      </button>
                    </div>
                  ))}
              </div>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newSkill}
                  onChange={(e) => setNewSkill(e.target.value)}
                  className="flex-1 bg-[#1A1A1A] border border-neutral-700/50 rounded-lg px-3 py-2 text-white placeholder-neutral-400 focus:outline-none focus:border-[#FEEBD8] transition-colors"
                  placeholder="Add a skill..."
                  onKeyPress={(e) => e.key === "Enter" && addSkill()}
                />
                <button
                  type="button"
                  onClick={addSkill}
                  className="bg-[#FEEBD8] text-[#141414] px-4 py-2 rounded-lg font-medium hover:bg-[#E5D5B7] transition-colors"
                >
                  <FaPlus />
                </button>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 bg-neutral-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-neutral-700 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 bg-[#FEEBD8] text-[#141414] px-4 py-2 rounded-lg font-medium hover:bg-[#E5D5B7] transition-colors"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditExtracurricularModal;
