import React from "react";
import {
  FaTimes,
  FaFile,
  FaDownload,
  FaUniversity,
  FaTag,
  FaCalendar,
} from "react-icons/fa";

interface Document {
  id: number;
  name: string;
  type: string;
  size: string;
  uploadDate: string;
  colleges?: string[];
  tags?: string[];
  status: string;
}

interface EditDocumentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (document: Document) => void;
  document: Document | null;
}

const documentTypes = [
  "Transcript",
  "Essay",
  "Letter of Recommendation",
  "Resume",
  "Test Scores",
  "Portfolio",
  "Financial Documents",
  "Application Form",
  "Scholarship Application",
  "Other",
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

const commonTags = [
  "Official",
  "Draft",
  "Final",
  "Urgent",
  "Personal",
  "Academic",
  "Financial",
  "Required",
  "Optional",
  "Backup",
];

export default function EditDocumentModal({
  isOpen,
  onClose,
  onSave,
  document,
}: EditDocumentModalProps) {
  const [formData, setFormData] = React.useState({
    name: "",
    type: "Essay",
    size: "",
    college: "",
    tags: [] as string[],
    status: "Pending",
  });

  const [customTag, setCustomTag] = React.useState("");

  React.useEffect(() => {
    if (document) {
      setFormData({
        name: document.name || "",
        type: document.type || "Essay",
        size: document.size || "",
        college:
          document.colleges &&
          Array.isArray(document.colleges) &&
          document.colleges.length > 0
            ? document.colleges[0]
            : "",
        tags:
          document.tags && Array.isArray(document.tags)
            ? [...document.tags]
            : [],
        status: document.status || "Pending",
      });
    }
  }, [document]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (document) {
      onSave({
        ...document,
        ...formData,
      });
    }

    onClose();
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const addTag = (tag: string) => {
    const currentTags = Array.isArray(formData.tags) ? formData.tags : [];
    if (tag && !currentTags.includes(tag)) {
      setFormData((prev) => ({
        ...prev,
        tags: [...currentTags, tag],
      }));
    }
  };

  const removeTag = (tagToRemove: string) => {
    setFormData((prev) => ({
      ...prev,
      tags: Array.isArray(prev.tags)
        ? prev.tags.filter((tag) => tag !== tagToRemove)
        : [],
    }));
  };

  const addCustomTag = () => {
    if (customTag.trim()) {
      addTag(customTag.trim());
      setCustomTag("");
    }
  };

  if (!isOpen || !document) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-[#141414] border border-neutral-700 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-neutral-700">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <FaFile className="text-yellow-400 text-xl" />
              <h2 className="text-xl font-bold text-[#FEEBD8]">
                Edit Document
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
          {/* Document Info Header */}
          <div className="bg-neutral-800 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-[#FEEBD8] font-medium mb-1">
                  Current Document
                </h4>
                <div className="flex items-center gap-4 text-sm text-[#FEEBD8]/70">
                  <span className="flex items-center gap-1">
                    <FaFile size={12} />
                    {document.size}
                  </span>
                  <span className="flex items-center gap-1">
                    <FaCalendar size={12} />
                    Uploaded {document.uploadDate}
                  </span>
                </div>
              </div>
              <button
                type="button"
                className="bg-blue-500 text-white px-3 py-2 rounded-lg text-sm font-medium hover:bg-blue-600 transition-colors flex items-center gap-2"
              >
                <FaDownload size={12} />
                Download
              </button>
            </div>
          </div>

          {/* Basic Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-[#FEEBD8]/70 mb-2">
                Document Name *
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full bg-neutral-800 border border-neutral-700 rounded-lg px-4 py-2 text-[#FEEBD8] focus:outline-none focus:border-[#FEEBD8]"
                placeholder="e.g., Personal Statement Final"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[#FEEBD8]/70 mb-2">
                Document Type
              </label>
              <select
                name="type"
                value={formData.type}
                onChange={handleChange}
                className="w-full bg-neutral-800 border border-neutral-700 rounded-lg px-4 py-2 text-[#FEEBD8] focus:outline-none focus:border-[#FEEBD8]"
              >
                {documentTypes.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-[#FEEBD8]/70 mb-2">
                Related College
              </label>
              <select
                name="college"
                value={formData.college}
                onChange={handleChange}
                className="w-full bg-neutral-800 border border-neutral-700 rounded-lg px-4 py-2 text-[#FEEBD8] focus:outline-none focus:border-[#FEEBD8]"
              >
                <option value="">All Colleges</option>
                {colleges.map((college) => (
                  <option key={college} value={college}>
                    {college}
                  </option>
                ))}
              </select>
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
                <option value="Pending">Pending</option>
                <option value="In Review">In Review</option>
                <option value="Approved">Approved</option>
                <option value="Submitted">Submitted</option>
                <option value="Rejected">Rejected</option>
              </select>
            </div>
          </div>

          {/* Tags */}
          <div>
            <label className="block text-sm font-medium text-[#FEEBD8]/70 mb-2">
              Tags
            </label>

            {/* Common Tags */}
            <div className="flex flex-wrap gap-2 mb-3">
              {commonTags.map((tag) => (
                <button
                  key={tag}
                  type="button"
                  onClick={() => addTag(tag)}
                  className={`px-3 py-1 rounded-full text-sm transition-colors ${
                    formData.tags.includes(tag)
                      ? "bg-[#FEEBD8] text-[#141414]"
                      : "bg-neutral-700 text-[#FEEBD8]/70 hover:bg-neutral-600"
                  }`}
                >
                  {tag}
                </button>
              ))}
            </div>

            {/* Custom Tag Input */}
            <div className="flex gap-2 mb-3">
              <input
                type="text"
                value={customTag}
                onChange={(e) => setCustomTag(e.target.value)}
                placeholder="Add custom tag"
                className="flex-1 bg-neutral-800 border border-neutral-700 rounded-lg px-4 py-2 text-[#FEEBD8] focus:outline-none focus:border-[#FEEBD8]"
                onKeyPress={(e) =>
                  e.key === "Enter" && (e.preventDefault(), addCustomTag())
                }
              />
              <button
                type="button"
                onClick={addCustomTag}
                className="bg-[#FEEBD8] text-[#141414] px-4 py-2 rounded-lg font-medium hover:bg-[#E5D5B7] transition-colors"
              >
                Add
              </button>
            </div>

            {/* Selected Tags */}
            {Array.isArray(formData.tags) && formData.tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {formData.tags.map((tag) => (
                  <span
                    key={tag}
                    className="bg-blue-500/20 text-blue-400 px-3 py-1 rounded-full text-sm flex items-center gap-2"
                  >
                    {tag}
                    <button
                      type="button"
                      onClick={() => removeTag(tag)}
                      className="hover:text-red-400 transition-colors"
                    >
                      <FaTimes size={12} />
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Status History */}
          <div className="bg-neutral-800 rounded-lg p-4">
            <h4 className="text-[#FEEBD8] font-medium mb-3">Status History</h4>
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-[#FEEBD8]/70">Uploaded</span>
                <span className="text-green-400">{document.uploadDate}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-[#FEEBD8]/70">Last Modified</span>
                <span className="text-blue-400">Today</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-[#FEEBD8]/70">Current Status</span>
                <span
                  className={`px-2 py-1 rounded text-xs ${
                    formData.status === "Approved"
                      ? "bg-green-500/20 text-green-400"
                      : formData.status === "Submitted"
                      ? "bg-blue-500/20 text-blue-400"
                      : formData.status === "In Review"
                      ? "bg-yellow-500/20 text-yellow-400"
                      : formData.status === "Rejected"
                      ? "bg-red-500/20 text-red-400"
                      : "bg-gray-500/20 text-gray-400"
                  }`}
                >
                  {formData.status}
                </span>
              </div>
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
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
