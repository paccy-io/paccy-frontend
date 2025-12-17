"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { extracurricularsApi } from "../../../../lib/api/extracurriculars";
import {
  Extracurricular,
  CreateExtracurricularDTO,
  UpdateExtracurricularDTO,
  ExtracurricularCategory,
} from "../../../../lib/types";
import { useToast } from "../../../../lib/hooks/useToast";
import { FaArrowLeft, FaPlus, FaTimes, FaTrash } from "react-icons/fa";

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

export default function ExtracurricularDetailPage() {
  const router = useRouter();
  const params = useParams();
  const activityId = params?.id as string;
  const isNew = activityId === "new";

  const [loading, setLoading] = useState(!isNew);
  const [saving, setSaving] = useState(false);
  const { success: showSuccessToast, error: showErrorToast } = useToast();

  const [formData, setFormData] = useState({
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

  const [newAchievement, setNewAchievement] = useState("");
  const [customSkill, setCustomSkill] = useState("");
  const [startYear, setStartYear] = useState("");
  const [startMonth, setStartMonth] = useState("");
  const [endYear, setEndYear] = useState("");
  const [endMonth, setEndMonth] = useState("");
  const [isOngoing, setIsOngoing] = useState(false);
  const [hoursInputValue, setHoursInputValue] = useState("1");
  const [hoursError, setHoursError] = useState("");

  useEffect(() => {
    if (!isNew) {
      loadActivity();
    }
  }, [activityId, isNew]);

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
        end_date: "present",
      }));
    } else if (endYear && endMonth) {
      setFormData((prev) => ({
        ...prev,
        end_date: `${endYear}-${endMonth}`,
      }));
    }
  }, [endYear, endMonth, isOngoing]);

  const loadActivity = async () => {
    try {
      setLoading(true);
      const activity = await extracurricularsApi.getById(activityId);
      setFormData({
        activity_name: activity.activity_name,
        category: activity.category,
        position: activity.position,
        description: activity.description || "",
        start_date: activity.start_date,
        end_date: activity.end_date,
        location: activity.location || "",
        hours_per_week: activity.hours_per_week,
        website: activity.website || "",
        achievements: activity.achievements || [],
        skills: activity.skills || [],
      });

      // Parse dates
      if (activity.start_date) {
        const [year, month] = activity.start_date.split("-");
        setStartYear(year);
        setStartMonth(month);
      }
      if (activity.end_date === "present") {
        setIsOngoing(true);
      } else if (activity.end_date) {
        const [year, month] = activity.end_date.split("-");
        setEndYear(year);
        setEndMonth(month);
      }
      setHoursInputValue(activity.hours_per_week.toString());
    } catch (error) {
      console.error("Failed to load activity:", error);
      showErrorToast("Failed to load activity");
      router.push("/dashboard/extracurriculars");
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!formData.activity_name.trim()) {
      showErrorToast("Activity name is required");
      return;
    }
    if (!formData.position.trim()) {
      showErrorToast("Position is required");
      return;
    }
    if (hoursError) {
      showErrorToast("Please fix the hours per week field");
      return;
    }
    if (!hoursInputValue.trim()) {
      showErrorToast("Hours per week is required");
      return;
    }

    try {
      setSaving(true);
      if (isNew) {
        await extracurricularsApi.create(formData);
        showSuccessToast("Activity added successfully!");
      } else {
        await extracurricularsApi.update(activityId, formData);
        showSuccessToast("Activity updated successfully!");
      }
      router.push("/dashboard/extracurriculars");
    } catch (error) {
      console.error("Failed to save activity:", error);
      showErrorToast("Failed to save activity");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this activity?")) {
      return;
    }

    try {
      setSaving(true);
      await extracurricularsApi.delete(activityId);
      showSuccessToast("Activity deleted successfully!");
      router.push("/dashboard/extracurriculars");
    } catch (error) {
      console.error("Failed to delete activity:", error);
      showErrorToast("Failed to delete activity");
    } finally {
      setSaving(false);
    }
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

  const handleHoursChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setHoursInputValue(value);

    if (value.trim() === "") {
      setHoursError("Hours per week is required");
      return;
    }

    const numValue = parseInt(value);
    if (isNaN(numValue) || numValue < 1 || numValue > 168) {
      setHoursError("Please enter a number between 1 and 168");
    } else {
      setHoursError("");
      setFormData((prev) => ({
        ...prev,
        hours_per_week: numValue,
      }));
    }
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

  const toggleSkill = (skill: string) => {
    setFormData((prev) => ({
      ...prev,
      skills: prev.skills.includes(skill)
        ? prev.skills.filter((s) => s !== skill)
        : [...prev.skills, skill],
    }));
  };

  const addCustomSkill = () => {
    if (customSkill.trim() && !formData.skills.includes(customSkill.trim())) {
      setFormData((prev) => ({
        ...prev,
        skills: [...prev.skills, customSkill.trim()],
      }));
      setCustomSkill("");
    }
  };

  const removeSkill = (skill: string) => {
    setFormData((prev) => ({
      ...prev,
      skills: prev.skills.filter((s) => s !== skill),
    }));
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
        <div className="text-white">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      <div className="max-w-5xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/dashboard/extracurriculars"
            className="text-blue-400 hover:text-blue-300 transition-colors flex items-center gap-2 mb-4 font-medium"
          >
            <FaArrowLeft />
            <span>Back to Extracurriculars</span>
          </Link>
          <div className="flex items-center justify-between">
            <h1 className="text-4xl font-bold text-white">
              {isNew ? "Add Activity" : "Edit Activity"}
            </h1>
            {!isNew && (
              <button
                onClick={handleDelete}
                disabled={saving}
                className="bg-red-500/20 text-red-400 px-4 py-2 rounded-lg font-medium hover:bg-red-500/30 transition-colors flex items-center gap-2 border border-red-500/30 disabled:opacity-50"
              >
                <FaTrash />
                <span>Delete</span>
              </button>
            )}
          </div>
        </div>

        {/* Form */}
        <div className="space-y-6">
          {/* Basic Information */}
          <div className="bg-gradient-to-br from-[#141414] to-[#1a1a1a] border border-neutral-700/50 rounded-xl p-6">
            <h2 className="text-xl font-semibold text-white mb-6">
              Basic Information
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-white/70 text-sm mb-2">
                  Activity Name *
                </label>
                <input
                  type="text"
                  name="activity_name"
                  value={formData.activity_name}
                  onChange={handleChange}
                  className="w-full bg-neutral-800/50 border border-neutral-700/50 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-blue-500/50"
                  placeholder="e.g., Student Council, Basketball Team"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-white/70 text-sm mb-2">
                    Category *
                  </label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    className="w-full bg-neutral-800/50 border border-neutral-700/50 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-blue-500/50"
                  >
                    {categories.map((cat) => (
                      <option key={cat.value} value={cat.value}>
                        {cat.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-white/70 text-sm mb-2">
                    Your Position/Role *
                  </label>
                  <input
                    type="text"
                    name="position"
                    value={formData.position}
                    onChange={handleChange}
                    className="w-full bg-neutral-800/50 border border-neutral-700/50 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-blue-500/50"
                    placeholder="e.g., President, Team Captain"
                  />
                </div>
              </div>

              <div>
                <label className="block text-white/70 text-sm mb-2">
                  Description
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows={4}
                  className="w-full bg-neutral-800/50 border border-neutral-700/50 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-blue-500/50 resize-none"
                  placeholder="Describe your role, responsibilities, and impact..."
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-white/70 text-sm mb-2">
                    Location
                  </label>
                  <input
                    type="text"
                    name="location"
                    value={formData.location}
                    onChange={handleChange}
                    className="w-full bg-neutral-800/50 border border-neutral-700/50 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-blue-500/50"
                    placeholder="City, State"
                  />
                </div>

                <div>
                  <label className="block text-white/70 text-sm mb-2">
                    Website
                  </label>
                  <input
                    type="url"
                    name="website"
                    value={formData.website}
                    onChange={handleChange}
                    className="w-full bg-neutral-800/50 border border-neutral-700/50 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-blue-500/50"
                    placeholder="https://..."
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Time Commitment */}
          <div className="bg-gradient-to-br from-[#141414] to-[#1a1a1a] border border-neutral-700/50 rounded-xl p-6">
            <h2 className="text-xl font-semibold text-white mb-6">
              Time Commitment
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-white/70 text-sm mb-2">
                  Hours per Week *
                </label>
                <input
                  type="number"
                  value={hoursInputValue}
                  onChange={handleHoursChange}
                  min="1"
                  max="168"
                  className={`w-full bg-neutral-800/50 border rounded-lg px-4 py-3 text-white focus:outline-none ${
                    hoursError
                      ? "border-red-500/50 focus:border-red-500"
                      : "border-neutral-700/50 focus:border-blue-500/50"
                  }`}
                  placeholder="e.g., 5"
                />
                {hoursError && (
                  <p className="text-red-400 text-sm mt-1">{hoursError}</p>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-white/70 text-sm mb-2">
                    Start Date
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <select
                      value={startMonth}
                      onChange={(e) => setStartMonth(e.target.value)}
                      className="bg-neutral-800/50 border border-neutral-700/50 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-blue-500/50"
                    >
                      <option value="">Month</option>
                      {months.map((m) => (
                        <option key={m.value} value={m.value}>
                          {m.label}
                        </option>
                      ))}
                    </select>
                    <select
                      value={startYear}
                      onChange={(e) => setStartYear(e.target.value)}
                      className="bg-neutral-800/50 border border-neutral-700/50 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-blue-500/50"
                    >
                      <option value="">Year</option>
                      {generateYears().map((year) => (
                        <option key={year} value={year}>
                          {year}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-white/70 text-sm mb-2">
                    End Date
                  </label>
                  <div className="space-y-2">
                    <label className="flex items-center gap-2 text-white/70 text-sm">
                      <input
                        type="checkbox"
                        checked={isOngoing}
                        onChange={(e) => setIsOngoing(e.target.checked)}
                        className="rounded"
                      />
                      Currently participating
                    </label>
                    {!isOngoing && (
                      <div className="grid grid-cols-2 gap-2">
                        <select
                          value={endMonth}
                          onChange={(e) => setEndMonth(e.target.value)}
                          className="bg-neutral-800/50 border border-neutral-700/50 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-blue-500/50"
                        >
                          <option value="">Month</option>
                          {months.map((m) => (
                            <option key={m.value} value={m.value}>
                              {m.label}
                            </option>
                          ))}
                        </select>
                        <select
                          value={endYear}
                          onChange={(e) => setEndYear(e.target.value)}
                          className="bg-neutral-800/50 border border-neutral-700/50 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-blue-500/50"
                        >
                          <option value="">Year</option>
                          {generateYears().map((year) => (
                            <option key={year} value={year}>
                              {year}
                            </option>
                          ))}
                        </select>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Achievements */}
          <div className="bg-gradient-to-br from-[#141414] to-[#1a1a1a] border border-neutral-700/50 rounded-xl p-6">
            <h2 className="text-xl font-semibold text-white mb-6">
              Key Achievements
            </h2>
            <div className="space-y-4">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newAchievement}
                  onChange={(e) => setNewAchievement(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && addAchievement()}
                  className="flex-1 bg-neutral-800/50 border border-neutral-700/50 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-blue-500/50"
                  placeholder="Add an achievement..."
                />
                <button
                  type="button"
                  onClick={addAchievement}
                  className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-3 rounded-lg transition-colors"
                >
                  <FaPlus />
                </button>
              </div>
              {formData.achievements.length > 0 && (
                <div className="space-y-2">
                  {formData.achievements.map((achievement, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between bg-neutral-800/50 border border-neutral-700/50 rounded-lg px-4 py-3"
                    >
                      <span className="text-white">{achievement}</span>
                      <button
                        type="button"
                        onClick={() => removeAchievement(index)}
                        className="text-red-400 hover:text-red-300"
                      >
                        <FaTimes />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Skills */}
          <div className="bg-gradient-to-br from-[#141414] to-[#1a1a1a] border border-neutral-700/50 rounded-xl p-6">
            <h2 className="text-xl font-semibold text-white mb-6">
              Skills Developed
            </h2>
            <div className="space-y-4">
              <div className="flex flex-wrap gap-2">
                {commonSkills.map((skill) => (
                  <button
                    key={skill}
                    type="button"
                    onClick={() => toggleSkill(skill)}
                    className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                      formData.skills.includes(skill)
                        ? "bg-blue-500 text-white"
                        : "bg-neutral-800/50 text-white/70 hover:bg-neutral-700/50"
                    }`}
                  >
                    {skill}
                  </button>
                ))}
              </div>

              <div className="flex gap-2">
                <input
                  type="text"
                  value={customSkill}
                  onChange={(e) => setCustomSkill(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && addCustomSkill()}
                  className="flex-1 bg-neutral-800/50 border border-neutral-700/50 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-blue-500/50"
                  placeholder="Add custom skill..."
                />
                <button
                  type="button"
                  onClick={addCustomSkill}
                  className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-3 rounded-lg transition-colors"
                >
                  <FaPlus />
                </button>
              </div>

              {formData.skills.filter((s) => !commonSkills.includes(s)).length >
                0 && (
                <div className="flex flex-wrap gap-2">
                  {formData.skills
                    .filter((s) => !commonSkills.includes(s))
                    .map((skill) => (
                      <div
                        key={skill}
                        className="flex items-center gap-2 bg-blue-500 text-white px-4 py-2 rounded-lg"
                      >
                        <span>{skill}</span>
                        <button
                          type="button"
                          onClick={() => removeSkill(skill)}
                          className="hover:text-red-300"
                        >
                          <FaTimes />
                        </button>
                      </div>
                    ))}
                </div>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-4">
            <Link
              href="/dashboard/extracurriculars"
              className="bg-neutral-800 hover:bg-neutral-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
            >
              Cancel
            </Link>
            <button
              onClick={handleSave}
              disabled={saving}
              className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition-all duration-200 shadow-lg shadow-blue-500/20 hover:shadow-blue-500/40 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {saving
                ? "Saving..."
                : isNew
                ? "Create Activity"
                : "Save Changes"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
