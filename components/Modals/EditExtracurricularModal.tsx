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

interface Extracurricular {
  id: number;
  name: string;
  category: string;
  role: string;
  organization?: string;
  description: string;
  startDate: string;
  endDate: string;
  hoursPerWeek: number;
  achievements: string[];
  location?: string;
  website?: string;
  impact: string;
  skills: string[];
}

interface EditExtracurricularModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (extracurricular: Omit<Extracurricular, "id">) => void;
  extracurricular: Extracurricular;
}

const typeOptions = [
  "Sports",
  "Music",
  "Academic Club",
  "Community Service",
  "Leadership",
  "Arts",
  "Work Experience",
  "Research",
  "Other",
];

const EditExtracurricularModal: React.FC<EditExtracurricularModalProps> = ({
  isOpen,
  onClose,
  onSave,
  extracurricular,
}) => {
  const [formData, setFormData] = useState({
    name: "",
    category: "Academic",
    role: "",
    description: "",
    startDate: "",
    endDate: "",
    hoursPerWeek: 1,
    achievements: [] as string[],
    location: "",
    website: "",
    impact: "",
    skills: [] as string[],
  });

  const [newAchievement, setNewAchievement] = useState("");
  const [newSkill, setNewSkill] = useState("");

  // Update form data when extracurricular prop changes
  useEffect(() => {
    if (extracurricular) {
      setFormData({
        name: extracurricular.name || "",
        category: extracurricular.category || "Academic",
        role: extracurricular.role || "",
        description: extracurricular.description || "",
        startDate: extracurricular.startDate || "",
        endDate: extracurricular.endDate || "",
        hoursPerWeek: extracurricular.hoursPerWeek || 1,
        achievements: extracurricular.achievements || [],
        location: extracurricular.location || "",
        website: extracurricular.website || "",
        impact: extracurricular.impact || "",
        skills: extracurricular.skills || [],
      });
    }
  }, [extracurricular]);

  if (!isOpen || !extracurricular) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
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
      <div className="bg-[#1A1A1A] border border-[#333] rounded-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-[#333]">
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
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                className="w-full bg-[#2A2A2A] border border-[#444] rounded-lg px-3 py-2 text-white placeholder-neutral-400 focus:outline-none focus:border-[#FEEBD8]"
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
                  setFormData({ ...formData, category: e.target.value })
                }
                className="w-full bg-[#2A2A2A] border border-[#444] rounded-lg px-3 py-2 text-white focus:outline-none focus:border-[#FEEBD8]"
                required
              >
                {typeOptions.map((type) => (
                  <option key={type} value={type}>
                    {type}
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
                value={formData.role}
                onChange={(e) =>
                  setFormData({ ...formData, role: e.target.value })
                }
                className="w-full bg-[#2A2A2A] border border-[#444] rounded-lg px-3 py-2 text-white placeholder-neutral-400 focus:outline-none focus:border-[#FEEBD8]"
                required
              />
            </div>

            <div>
              <label className="block text-[#FEEBD8] text-sm font-medium mb-2">
                Hours per Week
              </label>
              <input
                type="number"
                value={formData.hoursPerWeek}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    hoursPerWeek: parseInt(e.target.value) || 0,
                  })
                }
                className="w-full bg-[#2A2A2A] border border-[#444] rounded-lg px-3 py-2 text-white placeholder-neutral-400 focus:outline-none focus:border-[#FEEBD8]"
                min="0"
              />
            </div>
          </div>

          {/* Date Range */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-[#FEEBD8] text-sm font-medium mb-2 flex items-center gap-2">
                <FaCalendarAlt className="text-blue-400" />
                Start Date *
              </label>
              <input
                type="date"
                value={formData.startDate}
                onChange={(e) =>
                  setFormData({ ...formData, startDate: e.target.value })
                }
                className="w-full bg-[#2A2A2A] border border-[#444] rounded-lg px-3 py-2 text-white focus:outline-none focus:border-[#FEEBD8]"
                required
              />
            </div>

            <div>
              <label className="text-[#FEEBD8] text-sm font-medium mb-2 flex items-center gap-2">
                <FaCalendarAlt className="text-blue-400" />
                End Date
              </label>
              <input
                type="date"
                value={formData.endDate}
                onChange={(e) =>
                  setFormData({ ...formData, endDate: e.target.value })
                }
                className="w-full bg-[#2A2A2A] border border-[#444] rounded-lg px-3 py-2 text-white focus:outline-none focus:border-[#FEEBD8]"
              />
            </div>
          </div>

          {/* Location and Website */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-[#FEEBD8] text-sm font-medium mb-2 flex items-center gap-2">
                <FaMapMarkerAlt className="text-green-400" />
                Location
              </label>
              <input
                type="text"
                value={formData.location}
                onChange={(e) =>
                  setFormData({ ...formData, location: e.target.value })
                }
                className="w-full bg-[#2A2A2A] border border-[#444] rounded-lg px-3 py-2 text-white placeholder-neutral-400 focus:outline-none focus:border-[#FEEBD8]"
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
                className="w-full bg-[#2A2A2A] border border-[#444] rounded-lg px-3 py-2 text-white placeholder-neutral-400 focus:outline-none focus:border-[#FEEBD8]"
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
              className="w-full bg-[#2A2A2A] border border-[#444] rounded-lg px-3 py-2 text-white placeholder-neutral-400 focus:outline-none focus:border-[#FEEBD8] h-24 resize-none"
              placeholder="Describe your role and responsibilities..."
            />
          </div>

          {/* Impact */}
          <div>
            <label className="block text-[#FEEBD8] text-sm font-medium mb-2">
              Impact & Contribution
            </label>
            <textarea
              value={formData.impact}
              onChange={(e) =>
                setFormData({ ...formData, impact: e.target.value })
              }
              className="w-full bg-[#2A2A2A] border border-[#444] rounded-lg px-3 py-2 text-white placeholder-neutral-400 focus:outline-none focus:border-[#FEEBD8] h-24 resize-none"
              placeholder="Describe the impact you made..."
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
                    className="flex items-center gap-2 bg-[#2A2A2A] p-2 rounded-lg"
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
                  className="flex-1 bg-[#2A2A2A] border border-[#444] rounded-lg px-3 py-2 text-white placeholder-neutral-400 focus:outline-none focus:border-[#FEEBD8]"
                  placeholder="Add an achievement..."
                  onKeyPress={(e) => e.key === "Enter" && addAchievement()}
                />
                <button
                  type="button"
                  onClick={addAchievement}
                  className="bg-[#FEEBD8] text-[#141414] px-4 py-2 rounded-lg hover:bg-[#E5D5B7] transition-colors"
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
                      className="flex items-center gap-2 bg-[#2A2A2A] px-3 py-1 rounded-full"
                    >
                      <span className="text-white text-sm">{skill}</span>
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
                  className="flex-1 bg-[#2A2A2A] border border-[#444] rounded-lg px-3 py-2 text-white placeholder-neutral-400 focus:outline-none focus:border-[#FEEBD8]"
                  placeholder="Add a skill..."
                  onKeyPress={(e) => e.key === "Enter" && addSkill()}
                />
                <button
                  type="button"
                  onClick={addSkill}
                  className="bg-[#FEEBD8] text-[#141414] px-4 py-2 rounded-lg hover:bg-[#E5D5B7] transition-colors"
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
