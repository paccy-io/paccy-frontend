import React from "react";
import {
  FaTimes,
  FaGraduationCap,
  FaChartLine,
  FaCalendarAlt,
} from "react-icons/fa";

interface Term {
  id: number;
  name: string;
  year: number;
  season: string;
  startDate: string;
  endDate: string;
  gpa: number;
  credits: number;
  status: string;
}

interface AddTermModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (term: Omit<Term, "id">) => void;
}

const seasonOptions = ["Fall", "Spring", "Summer", "Winter"];

const statusOptions = ["Upcoming", "In Progress", "Completed", "Cancelled"];

export default function AddTermModal({
  isOpen,
  onClose,
  onSave,
}: AddTermModalProps) {
  const [formData, setFormData] = React.useState({
    name: "",
    year: new Date().getFullYear(),
    season: "Fall",
    startDate: "",
    endDate: "",
    gpa: 0,
    credits: 0,
    status: "Upcoming",
  });

  // Validation states for number inputs
  const [yearInputValue, setYearInputValue] = React.useState(
    new Date().getFullYear().toString()
  );
  const [yearError, setYearError] = React.useState("");
  const [gpaInputValue, setGpaInputValue] = React.useState("");
  const [gpaError, setGpaError] = React.useState("");
  const [creditsInputValue, setCreditsInputValue] = React.useState("");
  const [creditsError, setCreditsError] = React.useState("");

  // Validation handlers
  const handleYearChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setYearInputValue(value);

    if (value === "") {
      setYearError("Year is required");
      return;
    }

    const num = parseInt(value, 10);
    if (isNaN(num)) {
      setYearError("Please enter a valid year");
      return;
    }

    if (num < 2020 || num > 2030) {
      setYearError("Year must be between 2020 and 2030");
      return;
    }

    setYearError("");
    setFormData((prev) => ({ ...prev, year: num }));
  };

  const handleGpaChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setGpaInputValue(value);

    if (value === "") {
      setGpaError("");
      setFormData((prev) => ({ ...prev, gpa: 0 }));
      return;
    }

    const num = parseFloat(value);
    if (isNaN(num)) {
      setGpaError("Please enter a valid GPA");
      return;
    }

    if (num < 0 || num > 4) {
      setGpaError("GPA must be between 0.00 and 4.00");
      return;
    }

    setGpaError("");
    setFormData((prev) => ({ ...prev, gpa: num }));
  };

  const handleCreditsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setCreditsInputValue(value);

    if (value === "") {
      setCreditsError("");
      setFormData((prev) => ({ ...prev, credits: 0 }));
      return;
    }

    const num = parseInt(value, 10);
    if (isNaN(num)) {
      setCreditsError("Please enter a valid number of credits");
      return;
    }

    if (num < 0 || num > 30) {
      setCreditsError("Credits must be between 0 and 30");
      return;
    }

    setCreditsError("");
    setFormData((prev) => ({ ...prev, credits: num }));
  };

  React.useEffect(() => {
    // Auto-generate term name when season or year changes
    if (formData.season && formData.year) {
      setFormData((prev) => ({
        ...prev,
        name: `${prev.season} ${prev.year}`,
      }));
    }
  }, [formData.season, formData.year]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Check for validation errors before submitting
    if (yearError || gpaError || creditsError) {
      return;
    }

    onSave(formData);

    // Reset form
    setFormData({
      name: "",
      year: new Date().getFullYear(),
      season: "Fall",
      startDate: "",
      endDate: "",
      gpa: 0,
      credits: 0,
      status: "Upcoming",
    });

    // Reset validation states
    setYearInputValue(new Date().getFullYear().toString());
    setYearError("");
    setGpaInputValue("");
    setGpaError("");
    setCreditsInputValue("");
    setCreditsError("");

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
      [name]: type === "number" ? parseFloat(value) || 0 : value,
    }));
  };

  const getTermDuration = () => {
    if (formData.startDate && formData.endDate) {
      const start = new Date(formData.startDate);
      const end = new Date(formData.endDate);
      const diffTime = Math.abs(end.getTime() - start.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      const weeks = Math.round(diffDays / 7);
      return `${weeks} weeks (${diffDays} days)`;
    }
    return null;
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-[#141414] border border-neutral-700 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-neutral-700">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <FaGraduationCap className="text-green-400 text-xl" />
              <h2 className="text-xl font-bold text-[#FEEBD8]">
                Add Academic Term
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
                Season *
              </label>
              <select
                name="season"
                value={formData.season}
                onChange={handleChange}
                required
                className="w-full bg-neutral-800 border border-neutral-700 rounded-lg px-4 py-2 text-[#FEEBD8] focus:outline-none focus:border-[#FEEBD8]"
              >
                {seasonOptions.map((season) => (
                  <option key={season} value={season}>
                    {season}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-[#FEEBD8]/70 mb-2">
                Year *
              </label>
              <input
                type="text"
                name="year"
                value={yearInputValue}
                onChange={handleYearChange}
                required
                className={`w-full bg-neutral-800 border rounded-lg px-4 py-2 text-[#FEEBD8] focus:outline-none transition-colors ${
                  yearError
                    ? "border-red-500 focus:border-red-500"
                    : "border-neutral-700 focus:border-[#FEEBD8]"
                }`}
                placeholder="2020 - 2030"
              />
              {yearError && (
                <p className="text-red-400 text-xs mt-1 flex items-center gap-1">
                  <span>⚠️</span>
                  {yearError}
                </p>
              )}
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-[#FEEBD8]/70 mb-2">
                Term Name
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full bg-neutral-800 border border-neutral-700 rounded-lg px-4 py-2 text-[#FEEBD8] focus:outline-none focus:border-[#FEEBD8]"
                placeholder="e.g., Fall 2024"
              />
              <p className="text-xs text-[#FEEBD8]/50 mt-1">
                Auto-generated based on season and year, but you can customize
                it
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-[#FEEBD8]/70 mb-2">
                Start Date
              </label>
              <input
                type="date"
                name="startDate"
                value={formData.startDate}
                onChange={handleChange}
                className="w-full bg-neutral-800 border border-neutral-700 rounded-lg px-4 py-2 text-[#FEEBD8] focus:outline-none focus:border-[#FEEBD8]"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[#FEEBD8]/70 mb-2">
                End Date
              </label>
              <input
                type="date"
                name="endDate"
                value={formData.endDate}
                onChange={handleChange}
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
                {statusOptions.map((status) => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-[#FEEBD8]/70 mb-2">
                Target GPA
              </label>
              <input
                type="text"
                name="gpa"
                value={gpaInputValue}
                onChange={handleGpaChange}
                className={`w-full bg-neutral-800 border rounded-lg px-4 py-2 text-[#FEEBD8] focus:outline-none transition-colors ${
                  gpaError
                    ? "border-red-500 focus:border-red-500"
                    : "border-neutral-700 focus:border-[#FEEBD8]"
                }`}
                placeholder="0.00 - 4.00"
              />
              {gpaError && (
                <p className="text-red-400 text-xs mt-1 flex items-center gap-1">
                  <span>⚠️</span>
                  {gpaError}
                </p>
              )}
              <p className="text-xs text-[#FEEBD8]/50 mt-1">
                Leave empty if not applicable or not yet determined
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-[#FEEBD8]/70 mb-2">
                Planned Credits
              </label>
              <input
                type="text"
                name="credits"
                value={creditsInputValue}
                onChange={handleCreditsChange}
                className={`w-full bg-neutral-800 border rounded-lg px-4 py-2 text-[#FEEBD8] focus:outline-none transition-colors ${
                  creditsError
                    ? "border-red-500 focus:border-red-500"
                    : "border-neutral-700 focus:border-[#FEEBD8]"
                }`}
                placeholder="0 - 30"
              />
              {creditsError && (
                <p className="text-red-400 text-xs mt-1 flex items-center gap-1">
                  <span>⚠️</span>
                  {creditsError}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-[#FEEBD8]/70 mb-2">
                Course Load
              </label>
              <select
                className="w-full bg-neutral-800 border border-neutral-700 rounded-lg px-4 py-2 text-[#FEEBD8] focus:outline-none focus:border-[#FEEBD8]"
                disabled
              >
                <option>
                  {formData.credits === 0
                    ? "Not Set"
                    : formData.credits < 12
                    ? "Part-time"
                    : formData.credits <= 16
                    ? "Full-time"
                    : "Overload"}
                </option>
              </select>
            </div>
          </div>

          {/* Term Duration */}
          {getTermDuration() && (
            <div className="bg-neutral-800 rounded-lg p-4">
              <h4 className="text-[#FEEBD8] font-medium mb-2">Term Duration</h4>
              <div className="flex items-center gap-2 text-[#FEEBD8]/70">
                <FaCalendarAlt size={14} />
                <span>{getTermDuration()}</span>
              </div>
            </div>
          )}

          {/* Term Preview */}
          <div className="bg-neutral-800 rounded-lg p-4">
            <h4 className="text-[#FEEBD8] font-medium mb-3">Term Preview</h4>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <FaGraduationCap className="text-green-400" size={16} />
                <div>
                  <div className="text-[#FEEBD8] font-medium">
                    {formData.name || `${formData.season} ${formData.year}`}
                  </div>
                  <div className="text-sm text-[#FEEBD8]/70">
                    {formData.startDate && formData.endDate
                      ? `${new Date(
                          formData.startDate
                        ).toLocaleDateString()} - ${new Date(
                          formData.endDate
                        ).toLocaleDateString()}`
                      : "Dates not set"}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <FaChartLine className="text-blue-400" size={14} />
                  <span className="text-[#FEEBD8]/70">Target GPA:</span>
                  <span className="text-[#FEEBD8] font-semibold">
                    {formData.gpa ? formData.gpa.toFixed(2) : "Not set"}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[#FEEBD8]/70">Credits:</span>
                  <span className="text-[#FEEBD8] font-semibold">
                    {formData.credits || "Not set"}
                  </span>
                </div>
              </div>

              <div className="flex justify-center">
                <span
                  className={`px-3 py-1 rounded-full text-sm ${
                    formData.status === "Completed"
                      ? "bg-green-500/20 text-green-400"
                      : formData.status === "In Progress"
                      ? "bg-blue-500/20 text-blue-400"
                      : formData.status === "Upcoming"
                      ? "bg-yellow-500/20 text-yellow-400"
                      : "bg-red-500/20 text-red-400"
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
              disabled={!!(yearError || gpaError || creditsError)}
              className="flex-1 bg-[#FEEBD8] text-[#141414] px-6 py-3 rounded-lg font-medium hover:bg-[#E5D5B7] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Add Term
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
