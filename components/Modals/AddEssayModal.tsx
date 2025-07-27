import React from "react";
import {
  FaTimes,
  FaPen,
  FaUniversity,
  FaEdit,
  FaFileAlt,
} from "react-icons/fa";

interface Essay {
  id: number;
  title: string;
  type: string;
  college: string;
  prompt: string;
  content: string;
  wordCount: number;
  maxWords: number;
  status: string;
  aiScore: number;
  lastEdited: string;
}

interface AddEssayModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (
    essay: Omit<Essay, "id" | "wordCount" | "aiScore" | "lastEdited">
  ) => void;
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

const colleges = [
  "Stanford University",
  "Harvard University",
  "MIT",
  "UC Berkeley",
  "Princeton University",
  "Yale University",
  "Columbia University",
  "University of Chicago",
];

export default function AddEssayModal({
  isOpen,
  onClose,
  onSave,
}: AddEssayModalProps) {
  const [formData, setFormData] = React.useState({
    title: "",
    type: "Personal Statement",
    college: "",
    prompt: "",
    content: "",
    maxWords: 650,
    status: "Planning",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
    setFormData({
      title: "",
      type: "Personal Statement",
      college: "",
      prompt: "",
      content: "",
      maxWords: 650,
      status: "Planning",
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
      <div className="bg-[#141414] border border-neutral-700 rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-neutral-700">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <FaPen className="text-purple-400 text-xl" />
              <h2 className="text-xl font-bold text-[#FEEBD8]">
                Add New Essay
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
                Essay Type
              </label>
              <select
                name="type"
                value={formData.type}
                onChange={handleChange}
                className="w-full bg-neutral-800 border border-neutral-700 rounded-lg px-4 py-2 text-[#FEEBD8] focus:outline-none focus:border-[#FEEBD8]"
              >
                {essayTypes.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-[#FEEBD8]/70 mb-2">
                Target College
              </label>
              <select
                name="college"
                value={formData.college}
                onChange={handleChange}
                className="w-full bg-neutral-800 border border-neutral-700 rounded-lg px-4 py-2 text-[#FEEBD8] focus:outline-none focus:border-[#FEEBD8]"
              >
                <option value="">Select a college</option>
                {colleges.map((college) => (
                  <option key={college} value={college}>
                    {college}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-[#FEEBD8]/70 mb-2">
                Word Limit
              </label>
              <input
                type="number"
                name="maxWords"
                value={formData.maxWords}
                onChange={handleChange}
                min="1"
                className="w-full bg-neutral-800 border border-neutral-700 rounded-lg px-4 py-2 text-[#FEEBD8] focus:outline-none focus:border-[#FEEBD8]"
                placeholder="650"
              />
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
                <option value="Planning">Planning</option>
                <option value="Drafting">Drafting</option>
                <option value="Reviewing">Reviewing</option>
                <option value="Editing">Editing</option>
                <option value="Final">Final</option>
                <option value="Submitted">Submitted</option>
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
              Words:{" "}
              {
                formData.content.split(" ").filter((word) => word.length > 0)
                  .length
              }{" "}
              / {formData.maxWords}
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
              Add Essay
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
