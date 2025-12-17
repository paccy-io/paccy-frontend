import React from "react";
import {
  FaTimes,
  FaGraduationCap,
  FaChartLine,
  FaCalendarAlt,
  FaInfo,
} from "react-icons/fa";
import DatePicker from "../DatePicker";

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
  const [activeTab, setActiveTab] = React.useState("basic");
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

  // Validation states
  const [errors, setErrors] = React.useState<Record<string, string>>({});

  React.useEffect(() => {
    if (formData.season && formData.year) {
      setFormData((prev) => ({
        ...prev,
        name: `${prev.season} ${prev.year}`,
      }));
    }
  }, [formData.season, formData.year]);

  const validateField = (name: string, value: any) => {
    const newErrors = { ...errors };

    switch (name) {
      case "year":
        const yearNum = parseInt(value);
        if (isNaN(yearNum) || yearNum < 2020 || yearNum > 2030) {
          newErrors.year = "Year must be between 2020-2030";
        } else {
          delete newErrors.year;
        }
        break;
      case "gpa":
        const gpaNum = parseFloat(value);
        if (value !== "" && (isNaN(gpaNum) || gpaNum < 0 || gpaNum > 4)) {
          newErrors.gpa = "GPA must be between 0.00-4.00";
        } else {
          delete newErrors.gpa;
        }
        break;
      case "credits":
        const creditsNum = parseInt(value);
        if (
          value !== "" &&
          (isNaN(creditsNum) || creditsNum < 0 || creditsNum > 30)
        ) {
          newErrors.credits = "Credits must be between 0-30";
        } else {
          delete newErrors.credits;
        }
        break;
      default:
        break;
    }

    setErrors(newErrors);
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;

    validateField(name, value);

    setFormData((prev) => ({
      ...prev,
      [name]:
        name === "year"
          ? parseInt(value) || new Date().getFullYear()
          : name === "gpa"
          ? parseFloat(value) || 0
          : name === "credits"
          ? parseInt(value) || 0
          : value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (Object.keys(errors).length > 0) return;

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
    setErrors({});
    setActiveTab("basic");
    onClose();
  };

  const getTermDuration = () => {
    if (formData.startDate && formData.endDate) {
      const start = new Date(formData.startDate);
      const end = new Date(formData.endDate);
      const diffTime = Math.abs(end.getTime() - start.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      const weeks = Math.round(diffDays / 7);
      return `${weeks} weeks`;
    }
    return null;
  };

  const tabs = [
    { id: "basic", label: "Basic Info", icon: FaInfo },
    { id: "dates", label: "Dates", icon: FaCalendarAlt },
    { id: "academic", label: "Academic", icon: FaChartLine },
  ];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-gradient-to-br from-[#141414] to-[#1a1a1a] border border-neutral-700/50 rounded-xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="p-6 border-b border-neutral-700/50">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-neutral-800">
                <FaGraduationCap className="text-white" size={18} />
              </div>
              <h2 className="text-xl font-semibold text-white">
                Add Academic Term
              </h2>
            </div>
            <button
              onClick={onClose}
              className="text-white/60 hover:text-white transition-colors"
            >
              <FaTimes size={18} />
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="border-b border-neutral-700/50">
          <div className="flex">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 text-sm font-medium transition-colors ${
                    activeTab === tab.id
                      ? "text-white border-b-2 border-blue-500 bg-neutral-800/50"
                      : "text-white/60 hover:text-white hover:bg-neutral-800/30"
                  }`}
                >
                  <Icon size={14} />
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="p-6 space-y-4 max-h-[60vh] overflow-y-auto">
            {/* Basic Info Tab */}
            {activeTab === "basic" && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-white/70 mb-2">
                      Season *
                    </label>
                    <select
                      name="season"
                      value={formData.season}
                      onChange={handleChange}
                      required
                      className="w-full bg-neutral-800 border border-neutral-700/50 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-blue-500 transition-colors"
                    >
                      {seasonOptions.map((season) => (
                        <option key={season} value={season}>
                          {season}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-white/70 mb-2">
                      Year *
                    </label>
                    <input
                      type="number"
                      name="year"
                      value={formData.year}
                      onChange={handleChange}
                      required
                      min="2020"
                      max="2030"
                      className={`w-full bg-neutral-800 border rounded-lg px-3 py-2 text-white focus:outline-none transition-colors ${
                        errors.year
                          ? "border-red-500 focus:border-red-500"
                          : "border-neutral-700/50 focus:border-blue-500 transition-colors"
                      }`}
                    />
                    {errors.year && (
                      <p className="text-red-400 text-xs mt-1">{errors.year}</p>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-white/70 mb-2">
                    Term Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full bg-neutral-800 border border-neutral-700/50 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-blue-500 transition-colors"
                    placeholder="Auto-generated"
                  />
                  <p className="text-xs text-white/50 mt-1">
                    Auto-generated from season and year
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-white/70 mb-2">
                    Status
                  </label>
                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleChange}
                    className="w-full bg-neutral-800 border border-neutral-700/50 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-blue-500 transition-colors"
                  >
                    {statusOptions.map((status) => (
                      <option key={status} value={status}>
                        {status}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            )}

            {/* Dates Tab */}
            {activeTab === "dates" && (
              <div className="space-y-4">
                <DatePicker
                  label="Start Date"
                  value={formData.startDate}
                  onChange={(date) =>
                    setFormData((prev) => ({ ...prev, startDate: date }))
                  }
                  placeholder="Select start date"
                  maxDate={formData.endDate || undefined}
                />

                <DatePicker
                  label="End Date"
                  value={formData.endDate}
                  onChange={(date) =>
                    setFormData((prev) => ({ ...prev, endDate: date }))
                  }
                  placeholder="Select end date"
                  minDate={formData.startDate || undefined}
                />

                {getTermDuration() && (
                  <div className="bg-neutral-800 rounded-lg p-3">
                    <div className="flex items-center gap-2 text-white/70">
                      <FaCalendarAlt size={14} />
                      <span>Duration: {getTermDuration()}</span>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Academic Tab */}
            {activeTab === "academic" && (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-white/70 mb-2">
                    Target GPA
                  </label>
                  <input
                    type="number"
                    name="gpa"
                    value={formData.gpa || ""}
                    onChange={handleChange}
                    step="0.01"
                    min="0"
                    max="4"
                    className={`w-full bg-neutral-800 border rounded-lg px-3 py-2 text-white focus:outline-none transition-colors ${
                      errors.gpa
                        ? "border-red-500 focus:border-red-500"
                        : "border-neutral-700/50 focus:border-blue-500 transition-colors"
                    }`}
                    placeholder="0.00 - 4.00"
                  />
                  {errors.gpa && (
                    <p className="text-red-400 text-xs mt-1">{errors.gpa}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-white/70 mb-2">
                    Planned Credits
                  </label>
                  <input
                    type="number"
                    name="credits"
                    value={formData.credits || ""}
                    onChange={handleChange}
                    min="0"
                    max="30"
                    className={`w-full bg-neutral-800 border rounded-lg px-3 py-2 text-white focus:outline-none transition-colors ${
                      errors.credits
                        ? "border-red-500 focus:border-red-500"
                        : "border-neutral-700/50 focus:border-blue-500 transition-colors"
                    }`}
                    placeholder="0 - 30"
                  />
                  {errors.credits && (
                    <p className="text-red-400 text-xs mt-1">
                      {errors.credits}
                    </p>
                  )}
                </div>

                <div className="bg-neutral-800 rounded-lg p-3">
                  <div className="text-sm text-white/70">
                    Course Load:{" "}
                    <span className="text-white">
                      {formData.credits === 0
                        ? "Not Set"
                        : formData.credits < 12
                        ? "Part-time"
                        : formData.credits <= 16
                        ? "Full-time"
                        : "Overload"}
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="p-6 border-t border-neutral-700/50">
            <div className="flex gap-3">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 bg-neutral-700 text-white px-4 py-2 rounded-lg font-medium hover:bg-neutral-600 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={Object.keys(errors).length > 0}
                className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Add Term
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
