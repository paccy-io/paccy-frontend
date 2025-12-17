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
  CreateEssayDTO,
  CollegeApplication,
} from "../../lib/types";
import { collegeApplicationsApi } from "../../lib/api/college-applications";

interface AddEssayModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (essay: CreateEssayDTO) => void;
}

const essayTypes = [
  "Personal Statement",
  "Supplemental Essay",
  "Why This College",
  "Why This Major",
  "Activity Essay",
  "Community Essay",
  "Scholarship Essay",
  "Transfer Essay",
];

export default function AddEssayModal({
  isOpen,
  onClose,
  onSave,
}: AddEssayModalProps) {
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
      // Disable body scroll when modal is open
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = "unset";
      };
    }
  }, [isOpen]);

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
    if (!formData.college_application_id || !formData.title.trim()) {
      return;
    }

    onSave({
      title: formData.title,
      college_application_id: formData.college_application_id,
      status: formData.status,
      prompt: formData.prompt || undefined,
      content: formData.content || undefined,
    });

    // Reset form
    setFormData({
      title: "",
      college_application_id: "",
      prompt: "",
      content: "",
      status: EssayStatus.NOT_STARTED,
    });
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
      [name]: name === "maxWords" ? parseInt(value) || 0 : value,
    }));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-gradient-to-br from-[#141414] to-[#1a1a1a] border border-neutral-700/50 rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
        <div className="p-6 border-b border-neutral-700/50">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <FaPen className="text-purple-400 text-xl" />
              <h2 className="text-xl font-bold text-white">Add New Essay</h2>
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
            <div>
              <label className="block text-sm font-medium text-white/70 mb-2">
                Essay Title *
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
                className="w-full bg-neutral-800 border border-neutral-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-500 transition-colors"
                placeholder="e.g., Personal Statement for Stanford"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-white/70 mb-2">
                College Application *
              </label>
              <select
                name="college_application_id"
                value={formData.college_application_id}
                onChange={handleChange}
                required
                disabled={loading}
                className="w-full bg-neutral-800 border border-neutral-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-500 disabled:opacity-50 transition-colors"
              >
                <option value="">Select a college application...</option>
                {collegeApplications.map((app) => {
                  // Check if there are multiple applications with the same college name
                  const sameName = collegeApplications.filter(
                    (c) => c.name === app.name
                  );
                  const displayName =
                    sameName.length > 1 && app.major
                      ? `${app.name} [${app.major}]`
                      : app.name;

                  return (
                    <option key={app.id} value={app.id}>
                      {displayName}
                    </option>
                  );
                })}
              </select>
              {loading && (
                <p className="text-neutral-400 text-sm mt-1">
                  Loading applications...
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-white/70 mb-2">
                Status
              </label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="w-full bg-neutral-800 border border-neutral-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-500 transition-colors"
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
            <label className="block text-sm font-medium text-white/70 mb-2">
              Essay Prompt
            </label>
            <textarea
              name="prompt"
              value={formData.prompt}
              onChange={handleChange}
              rows={3}
              className="w-full bg-neutral-800 border border-neutral-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-500 transition-colors"
              placeholder="Paste the essay prompt here..."
            />
          </div>

          {/* Content */}
          <div>
            <label className="block text-sm font-medium text-white/70 mb-2">
              Essay Content
            </label>
            <textarea
              name="content"
              value={formData.content}
              onChange={handleChange}
              rows={12}
              className="w-full bg-neutral-800 border border-neutral-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-500 transition-colors"
              placeholder="Start writing your essay here..."
            />
            <div className="mt-2 text-sm text-white/60">
              Words:{" "}
              {
                formData.content.split(" ").filter((word) => word.length > 0)
                  .length
              }
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
              Add Essay
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
