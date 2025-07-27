import React from "react";
import {
  FaTimes,
  FaStar,
  FaPlus,
  FaCalendar,
  FaAward,
  FaUsers,
} from "react-icons/fa";

interface Extracurricular {
  id: number;
  name: string;
  category: string;
  role: string;
  description: string;
  duration: string;
  hoursPerWeek: number;
  achievements: string[];
  skills: string[];
  impact: string;
  status: string;
}

interface AddExtracurricularModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (activity: Omit<Extracurricular, "id">) => void;
}

const categories = [
  "Academic",
  "Sports",
  "Music",
  "Arts",
  "Community Service",
  "Leadership",
  "Technology",
  "Volunteering",
  "Clubs",
  "Work Experience",
  "Research",
  "Other",
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

export default function AddExtracurricularModal({
  isOpen,
  onClose,
  onSave,
}: AddExtracurricularModalProps) {
  const [formData, setFormData] = React.useState({
    name: "",
    category: "Academic",
    role: "",
    description: "",
    duration: "",
    hoursPerWeek: 1,
    achievements: [] as string[],
    skills: [] as string[],
    impact: "",
    status: "Active",
  });

  const [newAchievement, setNewAchievement] = React.useState("");
  const [customSkill, setCustomSkill] = React.useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);

    // Reset form
    setFormData({
      name: "",
      category: "Academic",
      role: "",
      description: "",
      duration: "",
      hoursPerWeek: 1,
      achievements: [],
      skills: [],
      impact: "",
      status: "Active",
    });
    setNewAchievement("");
    setCustomSkill("");
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
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-[#141414] border border-neutral-700 rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-neutral-700">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <FaStar className="text-purple-400 text-xl" />
              <h2 className="text-xl font-bold text-[#FEEBD8]">
                Add Extracurricular Activity
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
          {/* Basic Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-[#FEEBD8]/70 mb-2">
                Activity Name *
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full bg-neutral-800 border border-neutral-700 rounded-lg px-4 py-2 text-[#FEEBD8] focus:outline-none focus:border-[#FEEBD8]"
                placeholder="e.g., Student Government, Debate Club, Varsity Basketball"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[#FEEBD8]/70 mb-2">
                Category
              </label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="w-full bg-neutral-800 border border-neutral-700 rounded-lg px-4 py-2 text-[#FEEBD8] focus:outline-none focus:border-[#FEEBD8]"
              >
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-[#FEEBD8]/70 mb-2">
                Your Role/Position
              </label>
              <input
                type="text"
                name="role"
                value={formData.role}
                onChange={handleChange}
                className="w-full bg-neutral-800 border border-neutral-700 rounded-lg px-4 py-2 text-[#FEEBD8] focus:outline-none focus:border-[#FEEBD8]"
                placeholder="e.g., President, Member, Captain, Volunteer"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[#FEEBD8]/70 mb-2">
                Duration
              </label>
              <input
                type="text"
                name="duration"
                value={formData.duration}
                onChange={handleChange}
                className="w-full bg-neutral-800 border border-neutral-700 rounded-lg px-4 py-2 text-[#FEEBD8] focus:outline-none focus:border-[#FEEBD8]"
                placeholder="e.g., 9th-12th grade, Summer 2023, 2 years"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[#FEEBD8]/70 mb-2">
                Hours per Week
              </label>
              <input
                type="number"
                name="hoursPerWeek"
                value={formData.hoursPerWeek}
                onChange={handleChange}
                min="1"
                max="40"
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
                <option value="Active">Active</option>
                <option value="Completed">Completed</option>
                <option value="Planned">Planned</option>
              </select>
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-[#FEEBD8]/70 mb-2">
              Description
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={3}
              className="w-full bg-neutral-800 border border-neutral-700 rounded-lg px-4 py-2 text-[#FEEBD8] focus:outline-none focus:border-[#FEEBD8]"
              placeholder="Describe what you do in this activity, your responsibilities, and what you've learned..."
            />
          </div>

          {/* Achievements */}
          <div>
            <label className="block text-sm font-medium text-[#FEEBD8]/70 mb-2">
              Achievements & Awards
            </label>
            <div className="flex gap-2 mb-3">
              <input
                type="text"
                value={newAchievement}
                onChange={(e) => setNewAchievement(e.target.value)}
                placeholder="Add an achievement or award"
                className="flex-1 bg-neutral-800 border border-neutral-700 rounded-lg px-4 py-2 text-[#FEEBD8] focus:outline-none focus:border-[#FEEBD8]"
                onKeyPress={(e) =>
                  e.key === "Enter" && (e.preventDefault(), addAchievement())
                }
              />
              <button
                type="button"
                onClick={addAchievement}
                className="bg-[#FEEBD8] text-[#141414] px-4 py-2 rounded-lg font-medium hover:bg-[#E5D5B7] transition-colors flex items-center gap-2"
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
                      className="bg-neutral-800 rounded-lg p-3 flex items-center justify-between"
                    >
                      <div className="flex items-center gap-2">
                        <FaAward className="text-yellow-400" size={14} />
                        <span className="text-[#FEEBD8]">{achievement}</span>
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
            <label className="block text-sm font-medium text-[#FEEBD8]/70 mb-2">
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
                      ? "bg-[#FEEBD8] text-[#141414]"
                      : "bg-neutral-700 text-[#FEEBD8]/70 hover:bg-neutral-600"
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
                className="flex-1 bg-neutral-800 border border-neutral-700 rounded-lg px-4 py-2 text-[#FEEBD8] focus:outline-none focus:border-[#FEEBD8]"
                onKeyPress={(e) =>
                  e.key === "Enter" && (e.preventDefault(), addCustomSkill())
                }
              />
              <button
                type="button"
                onClick={addCustomSkill}
                className="bg-[#FEEBD8] text-[#141414] px-4 py-2 rounded-lg font-medium hover:bg-[#E5D5B7] transition-colors"
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

          {/* Impact */}
          <div>
            <label className="block text-sm font-medium text-[#FEEBD8]/70 mb-2">
              Impact & Outcomes
            </label>
            <textarea
              name="impact"
              value={formData.impact}
              onChange={handleChange}
              rows={3}
              className="w-full bg-neutral-800 border border-neutral-700 rounded-lg px-4 py-2 text-[#FEEBD8] focus:outline-none focus:border-[#FEEBD8]"
              placeholder="Describe the impact of your involvement, what you accomplished, how you made a difference..."
            />
          </div>

          {/* Preview */}
          <div className="bg-neutral-800 rounded-lg p-4">
            <h4 className="text-[#FEEBD8] font-medium mb-3">Preview</h4>
            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2">
                <FaStar className="text-purple-400" size={14} />
                <span className="text-[#FEEBD8] font-medium">
                  {formData.name || "Activity Name"}
                </span>
                <span className="text-[#FEEBD8]/50">•</span>
                <span className="text-[#FEEBD8]/70">
                  {formData.role || "Role"}
                </span>
              </div>
              <div className="flex items-center gap-4 text-[#FEEBD8]/60">
                <span className="flex items-center gap-1">
                  <FaCalendar size={12} />
                  {formData.duration || "Duration"}
                </span>
                <span className="flex items-center gap-1">
                  <FaUsers size={12} />
                  {formData.hoursPerWeek} hrs/week
                </span>
              </div>
              {formData.description && (
                <p className="text-[#FEEBD8]/70 mt-2">{formData.description}</p>
              )}
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
              Add Activity
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
