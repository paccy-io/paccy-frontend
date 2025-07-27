import React from "react";
import {
  FaTimes,
  FaUniversity,
  FaCalendar,
  FaMapMarkerAlt,
  FaDollarSign,
  FaGraduationCap,
} from "react-icons/fa";

interface College {
  id: number;
  name: string;
  location: string;
  status: string;
  deadline: string;
  applicationFee: number;
  acceptance: number;
  ranking: number;
  major: string;
  notes: string;
}

interface AddCollegeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (college: Omit<College, "id">) => void;
}

export default function AddCollegeModal({
  isOpen,
  onClose,
  onSave,
}: AddCollegeModalProps) {
  const [formData, setFormData] = React.useState({
    name: "",
    location: "",
    status: "Researching",
    deadline: "",
    applicationFee: 0,
    acceptance: 0,
    ranking: 0,
    major: "",
    notes: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
    setFormData({
      name: "",
      location: "",
      status: "Researching",
      deadline: "",
      applicationFee: 0,
      acceptance: 0,
      ranking: 0,
      major: "",
      notes: "",
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
      [name]:
        name === "applicationFee" || name === "acceptance" || name === "ranking"
          ? parseFloat(value) || 0
          : value,
    }));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-[#141414] border border-neutral-700 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-neutral-700">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <FaUniversity className="text-blue-400 text-xl" />
              <h2 className="text-xl font-bold text-[#FEEBD8]">
                Add New College
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
                College Name *
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full bg-neutral-800 border border-neutral-700 rounded-lg px-4 py-2 text-[#FEEBD8] focus:outline-none focus:border-[#FEEBD8]"
                placeholder="e.g., Stanford University"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[#FEEBD8]/70 mb-2">
                Location
              </label>
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleChange}
                className="w-full bg-neutral-800 border border-neutral-700 rounded-lg px-4 py-2 text-[#FEEBD8] focus:outline-none focus:border-[#FEEBD8]"
                placeholder="e.g., Stanford, CA"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[#FEEBD8]/70 mb-2">
                Application Status
              </label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="w-full bg-neutral-800 border border-neutral-700 rounded-lg px-4 py-2 text-[#FEEBD8] focus:outline-none focus:border-[#FEEBD8]"
              >
                <option value="Researching">Researching</option>
                <option value="Planning">Planning to Apply</option>
                <option value="In Progress">Application in Progress</option>
                <option value="Submitted">Application Submitted</option>
                <option value="Interview">Interview Scheduled</option>
                <option value="Accepted">Accepted</option>
                <option value="Rejected">Rejected</option>
                <option value="Waitlisted">Waitlisted</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-[#FEEBD8]/70 mb-2">
                Application Deadline
              </label>
              <input
                type="date"
                name="deadline"
                value={formData.deadline}
                onChange={handleChange}
                className="w-full bg-neutral-800 border border-neutral-700 rounded-lg px-4 py-2 text-[#FEEBD8] focus:outline-none focus:border-[#FEEBD8]"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[#FEEBD8]/70 mb-2">
                Application Fee ($)
              </label>
              <input
                type="number"
                name="applicationFee"
                value={formData.applicationFee}
                onChange={handleChange}
                min="0"
                className="w-full bg-neutral-800 border border-neutral-700 rounded-lg px-4 py-2 text-[#FEEBD8] focus:outline-none focus:border-[#FEEBD8]"
                placeholder="75"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[#FEEBD8]/70 mb-2">
                Acceptance Rate (%)
              </label>
              <input
                type="number"
                name="acceptance"
                value={formData.acceptance}
                onChange={handleChange}
                min="0"
                max="100"
                step="0.1"
                className="w-full bg-neutral-800 border border-neutral-700 rounded-lg px-4 py-2 text-[#FEEBD8] focus:outline-none focus:border-[#FEEBD8]"
                placeholder="15.5"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[#FEEBD8]/70 mb-2">
                US News Ranking
              </label>
              <input
                type="number"
                name="ranking"
                value={formData.ranking}
                onChange={handleChange}
                min="0"
                className="w-full bg-neutral-800 border border-neutral-700 rounded-lg px-4 py-2 text-[#FEEBD8] focus:outline-none focus:border-[#FEEBD8]"
                placeholder="5"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[#FEEBD8]/70 mb-2">
                Intended Major
              </label>
              <input
                type="text"
                name="major"
                value={formData.major}
                onChange={handleChange}
                className="w-full bg-neutral-800 border border-neutral-700 rounded-lg px-4 py-2 text-[#FEEBD8] focus:outline-none focus:border-[#FEEBD8]"
                placeholder="e.g., Computer Science"
              />
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="block text-sm font-medium text-[#FEEBD8]/70 mb-2">
              Notes
            </label>
            <textarea
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              rows={4}
              className="w-full bg-neutral-800 border border-neutral-700 rounded-lg px-4 py-2 text-[#FEEBD8] focus:outline-none focus:border-[#FEEBD8]"
              placeholder="Add any additional notes about this college..."
            />
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
              Add College
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
