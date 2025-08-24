import React, { useState, useEffect } from "react";
import {
  FaTimes,
  FaPen,
  FaUniversity,
  FaEdit,
  FaFileAlt,
} from "react-icons/fa";
import {
  Essay,
  EssayStatus,
  UpdateEssayDTO,
  CollegeApplication,
} from "../../lib/types";
import { collegeApplicationsApi } from "../../lib/api/college-applications";

interface EditEssayModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (essay: Essay) => void;
  essay: Essay | null;
}

export default function EditEssayModal({
  isOpen,
  onClose,
  onSave,
  essay,
}: EditEssayModalProps) {
  const [collegeApplications, setCollegeApplications] = useState<
    CollegeApplication[]
  >([]);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    college_application_id: "",
    prompt: "",
    content: "",
    status: EssayStatus.NOT_STARTED,
  });

  useEffect(() => {
    if (isOpen) {
      loadCollegeApplications();
    }
  }, [isOpen]);

  useEffect(() => {
    if (essay) {
      setFormData({
        title: essay.title || "",
        college_application_id: essay.college_application_id || "",
        prompt: essay.prompt || "",
        content: essay.content || "",
        status: essay.status || EssayStatus.NOT_STARTED,
      });
    }
  }, [essay]);

  const loadCollegeApplications = async () => {
    setLoading(true);
    try {
      const applications = await collegeApplicationsApi.getAll();
      setCollegeApplications(applications);
    } catch (error) {
      console.error("Error loading college applications:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!essay || !formData.title.trim()) {
      return;
    }

    const updatedEssay: Essay = {
      ...essay,
      title: formData.title,
      college_application_id: formData.college_application_id,
      prompt: formData.prompt || "",
      content: formData.content || "",
      status: formData.status,
      updated_at: new Date().toISOString(),
    };

    onSave(updatedEssay);
    onClose();
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  if (!isOpen || !essay) return null;

  const currentWordCount = formData.content
    ? formData.content.split(" ").filter((word) => word.length > 0).length
    : 0;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-[#141414] border border-neutral-700 rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-neutral-700">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <FaPen className="text-purple-400 text-xl" />
              <h2 className="text-xl font-bold text-[#FEEBD8]">Edit Essay</h2>
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
            <div>
              <label className="block text-sm font-medium text-[#FEEBD8]/70 mb-2">
                Essay Title *
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
                className="w-full bg-neutral-800 border border-neutral-700 rounded-lg px-4 py-2 text-[#FEEBD8] focus:outline-none focus:border-[#FEEBD8]"
                placeholder="e.g., Personal Statement for Stanford"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[#FEEBD8]/70 mb-2">
                College Application (Read-only)
              </label>
              <select
                name="college_application_id"
                value={formData.college_application_id}
                onChange={handleChange}
                required
                disabled={true}
                className="w-full bg-neutral-700/50 border border-neutral-600 rounded-lg px-4 py-2 text-[#FEEBD8]/70 cursor-not-allowed opacity-75"
              >
                <option value="">Select a college application...</option>
                {collegeApplications.map((app) => (
                  <option key={app.id} value={app.id}>
                    {app.name}
                  </option>
                ))}
              </select>
              <p className="text-neutral-400 text-xs mt-1">
                College application cannot be changed when editing
              </p>
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-[#FEEBD8]/70 mb-2">
                Status
              </label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="w-full bg-neutral-800 border border-neutral-700 rounded-lg px-4 py-2 text-[#FEEBD8] focus:outline-none focus:border-[#FEEBD8]"
              >
                <option value={EssayStatus.NOT_STARTED}>Not Started</option>
                <option value={EssayStatus.IN_PROGRESS}>In Progress</option>
                <option value={EssayStatus.NOT_SUBMITTED}>Not Submitted</option>
                <option value={EssayStatus.REVIEW_NEEDED}>Review Needed</option>
                <option value={EssayStatus.SUBMITTED}>Submitted</option>
                <option value={EssayStatus.COMPLETED}>Completed</option>
              </select>
            </div>
          </div>

          {/* Prompt */}
          <div>
            <label className="block text-sm font-medium text-[#FEEBD8]/70 mb-2">
              Essay Prompt
            </label>
            <textarea
              name="prompt"
              value={formData.prompt}
              onChange={handleChange}
              rows={3}
              className="w-full bg-neutral-800 border border-neutral-700 rounded-lg px-4 py-2 text-[#FEEBD8] focus:outline-none focus:border-[#FEEBD8]"
              placeholder="Paste the essay prompt here..."
            />
          </div>

          {/* Content */}
          <div>
            <label className="block text-sm font-medium text-[#FEEBD8]/70 mb-2">
              Essay Content
            </label>
            <textarea
              name="content"
              value={formData.content}
              onChange={handleChange}
              rows={12}
              className="w-full bg-neutral-800 border border-neutral-700 rounded-lg px-4 py-2 text-[#FEEBD8] focus:outline-none focus:border-[#FEEBD8]"
              placeholder="Start writing your essay here..."
            />
            <div className="mt-2 text-sm text-[#FEEBD8]/60">
              Words: {currentWordCount}
            </div>
          </div>

          {/* AI Score Display */}
          {essay?.ai_score && (
            <div className="bg-neutral-800 rounded-lg p-4">
              <h4 className="text-[#FEEBD8] font-medium mb-2">
                AI Feedback Score
              </h4>
              <div className="flex items-center gap-3">
                <div className="flex-1 bg-neutral-700 rounded-full h-2">
                  <div
                    className="bg-gradient-to-r from-red-500 via-yellow-500 to-green-500 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${(essay.ai_score / 10) * 100}%` }}
                  />
                </div>
                <span className="text-[#FEEBD8] font-semibold">
                  {essay.ai_score}/10
                </span>
              </div>
            </div>
          )}

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
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
