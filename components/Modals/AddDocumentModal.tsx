import React from "react";
import { FaTimes, FaFile, FaUpload, FaUniversity, FaTag } from "react-icons/fa";

interface Document {
  id: number;
  name: string;
  type: string;
  size: string;
  uploadDate: string;
  college: string;
  tags: string[];
  status: string;
}

interface AddDocumentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (document: Omit<Document, "id" | "uploadDate">) => void;
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

export default function AddDocumentModal({
  isOpen,
  onClose,
  onSave,
}: AddDocumentModalProps) {
  const [formData, setFormData] = React.useState({
    name: "",
    type: "Essay",
    size: "",
    college: "",
    tags: [] as string[],
    status: "Pending",
  });

  const [selectedFile, setSelectedFile] = React.useState<File | null>(null);
  const [customTag, setCustomTag] = React.useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Calculate file size if file is selected
    let fileSize = formData.size;
    if (selectedFile) {
      const sizeInMB = (selectedFile.size / (1024 * 1024)).toFixed(2);
      fileSize = `${sizeInMB} MB`;
    }

    onSave({
      ...formData,
      name: formData.name || selectedFile?.name || "Untitled Document",
      size: fileSize,
    });

    // Reset form
    setFormData({
      name: "",
      type: "Essay",
      size: "",
      college: "",
      tags: [],
      status: "Pending",
    });
    setSelectedFile(null);
    setCustomTag("");
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

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      if (!formData.name) {
        setFormData((prev) => ({ ...prev, name: file.name }));
      }
    }
  };

  const addTag = (tag: string) => {
    if (tag && !formData.tags.includes(tag)) {
      setFormData((prev) => ({
        ...prev,
        tags: [...prev.tags, tag],
      }));
    }
  };

  const removeTag = (tagToRemove: string) => {
    setFormData((prev) => ({
      ...prev,
      tags: prev.tags.filter((tag) => tag !== tagToRemove),
    }));
  };

  const addCustomTag = () => {
    if (customTag.trim()) {
      addTag(customTag.trim());
      setCustomTag("");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-[#141414] border border-neutral-700 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-neutral-700">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <FaFile className="text-yellow-400 text-xl" />
              <h2 className="text-xl font-bold text-[#FEEBD8]">
                Add New Document
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
          {/* File Upload */}
          <div>
            <label className="block text-sm font-medium text-[#FEEBD8]/70 mb-2">
              Upload File
            </label>
            <div className="border-2 border-dashed border-neutral-600 rounded-lg p-6 text-center hover:border-[#FEEBD8]/50 transition-colors">
              <input
                type="file"
                onChange={handleFileChange}
                className="hidden"
                id="file-upload"
                accept=".pdf,.doc,.docx,.txt,.jpg,.jpeg,.png"
              />
              <label
                htmlFor="file-upload"
                className="cursor-pointer flex flex-col items-center gap-2"
              >
                <FaUpload className="text-[#FEEBD8]/60 text-2xl" />
                <span className="text-[#FEEBD8]/70">
                  {selectedFile
                    ? selectedFile.name
                    : "Click to upload or drag and drop"}
                </span>
                <span className="text-[#FEEBD8]/50 text-sm">
                  PDF, DOC, DOCX, TXT, JPG, PNG up to 10MB
                </span>
              </label>
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
            {formData.tags.length > 0 && (
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

          {/* File Info Preview */}
          {selectedFile && (
            <div className="bg-neutral-800 rounded-lg p-4">
              <h4 className="text-[#FEEBD8] font-medium mb-2">
                File Information
              </h4>
              <div className="space-y-1 text-sm text-[#FEEBD8]/70">
                <p>Name: {selectedFile.name}</p>
                <p>Size: {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB</p>
                <p>Type: {selectedFile.type}</p>
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
              Add Document
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
