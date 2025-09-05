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

interface EditCollegeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (college: College) => void;
  college: College | null;
}

export default function EditCollegeModal({
  isOpen,
  onClose,
  onSave,
  college,
}: EditCollegeModalProps) {
  const [formData, setFormData] = React.useState<College>({
    id: 0,
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

  // Validation states for number inputs
  const [applicationFeeInputValue, setApplicationFeeInputValue] =
    React.useState("");
  const [applicationFeeError, setApplicationFeeError] = React.useState("");
  const [acceptanceInputValue, setAcceptanceInputValue] = React.useState("");
  const [acceptanceError, setAcceptanceError] = React.useState("");
  const [rankingInputValue, setRankingInputValue] = React.useState("");
  const [rankingError, setRankingError] = React.useState("");

  // Validation handlers
  const handleApplicationFeeChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = e.target.value;
    setApplicationFeeInputValue(value);

    if (value === "") {
      setApplicationFeeError("");
      setFormData((prev) => ({ ...prev, applicationFee: 0 }));
      return;
    }

    const num = parseFloat(value);
    if (isNaN(num)) {
      setApplicationFeeError("Please enter a valid fee amount");
      return;
    }

    if (num < 0) {
      setApplicationFeeError("Application fee cannot be negative");
      return;
    }

    setApplicationFeeError("");
    setFormData((prev) => ({ ...prev, applicationFee: num }));
  };

  const handleAcceptanceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setAcceptanceInputValue(value);

    if (value === "") {
      setAcceptanceError("");
      setFormData((prev) => ({ ...prev, acceptance: 0 }));
      return;
    }

    const num = parseFloat(value);
    if (isNaN(num)) {
      setAcceptanceError("Please enter a valid acceptance rate");
      return;
    }

    if (num < 0 || num > 100) {
      setAcceptanceError("Acceptance rate must be between 0 and 100");
      return;
    }

    setAcceptanceError("");
    setFormData((prev) => ({ ...prev, acceptance: num }));
  };

  const handleRankingChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setRankingInputValue(value);

    if (value === "") {
      setRankingError("");
      setFormData((prev) => ({ ...prev, ranking: 0 }));
      return;
    }

    const num = parseInt(value, 10);
    if (isNaN(num)) {
      setRankingError("Please enter a valid ranking");
      return;
    }

    if (num < 0) {
      setRankingError("Ranking cannot be negative");
      return;
    }

    setRankingError("");
    setFormData((prev) => ({ ...prev, ranking: num }));
  };

  React.useEffect(() => {
    if (college) {
      setFormData(college);
      // Set input values for number fields
      setApplicationFeeInputValue(
        college.applicationFee > 0 ? college.applicationFee.toString() : ""
      );
      setAcceptanceInputValue(
        college.acceptance > 0 ? college.acceptance.toString() : ""
      );
      setRankingInputValue(
        college.ranking > 0 ? college.ranking.toString() : ""
      );
      // Clear any existing errors
      setApplicationFeeError("");
      setAcceptanceError("");
      setRankingError("");
    }
  }, [college]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Check for validation errors before submitting
    if (applicationFeeError || acceptanceError || rankingError) {
      return;
    }

    onSave(formData);
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

  if (!isOpen || !college) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-[#141414] border border-neutral-700 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-neutral-700">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <FaUniversity className="text-blue-400 text-xl" />
              <h2 className="text-xl font-bold text-[#FEEBD8]">Edit College</h2>
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
                type="text"
                name="applicationFee"
                value={applicationFeeInputValue}
                onChange={handleApplicationFeeChange}
                className={`w-full bg-neutral-800 border rounded-lg px-4 py-2 text-[#FEEBD8] focus:outline-none transition-colors ${
                  applicationFeeError
                    ? "border-red-500 focus:border-red-500"
                    : "border-neutral-700 focus:border-[#FEEBD8]"
                }`}
                placeholder="e.g., 75"
              />
              {applicationFeeError && (
                <p className="text-red-400 text-xs mt-1 flex items-center gap-1">
                  <span>⚠️</span>
                  {applicationFeeError}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-[#FEEBD8]/70 mb-2">
                Acceptance Rate (%)
              </label>
              <input
                type="text"
                name="acceptance"
                value={acceptanceInputValue}
                onChange={handleAcceptanceChange}
                className={`w-full bg-neutral-800 border rounded-lg px-4 py-2 text-[#FEEBD8] focus:outline-none transition-colors ${
                  acceptanceError
                    ? "border-red-500 focus:border-red-500"
                    : "border-neutral-700 focus:border-[#FEEBD8]"
                }`}
                placeholder="0 - 100"
              />
              {acceptanceError && (
                <p className="text-red-400 text-xs mt-1 flex items-center gap-1">
                  <span>⚠️</span>
                  {acceptanceError}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-[#FEEBD8]/70 mb-2">
                US News Ranking
              </label>
              <input
                type="text"
                name="ranking"
                value={rankingInputValue}
                onChange={handleRankingChange}
                className={`w-full bg-neutral-800 border rounded-lg px-4 py-2 text-[#FEEBD8] focus:outline-none transition-colors ${
                  rankingError
                    ? "border-red-500 focus:border-red-500"
                    : "border-neutral-700 focus:border-[#FEEBD8]"
                }`}
                placeholder="e.g., 5"
              />
              {rankingError && (
                <p className="text-red-400 text-xs mt-1 flex items-center gap-1">
                  <span>⚠️</span>
                  {rankingError}
                </p>
              )}
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
              disabled={
                !!(applicationFeeError || acceptanceError || rankingError)
              }
              className="flex-1 bg-[#FEEBD8] text-[#141414] px-6 py-3 rounded-lg font-medium hover:bg-[#E5D5B7] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
