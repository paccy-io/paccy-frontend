import React from "react";
import {
  FaTimes,
  FaCalendar,
  FaClock,
  FaFlag,
  FaUniversity,
  FaPen,
} from "react-icons/fa";

interface Event {
  id: number;
  title: string;
  date: string;
  time: string;
  type: string;
  priority: string;
  description: string;
  college?: string;
}

interface AddEventModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (event: Omit<Event, "id">) => void;
  selectedDate?: string;
}

const eventTypes = [
  "Application Deadline",
  "Interview",
  "Campus Visit",
  "Test Date",
  "Scholarship Deadline",
  "Essay Due",
  "Transcript Request",
  "Recommendation Letter",
  "Financial Aid",
  "Other",
];

const priorities = [
  { value: "High", color: "text-red-400" },
  { value: "Medium", color: "text-yellow-400" },
  { value: "Low", color: "text-green-400" },
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

export default function AddEventModal({
  isOpen,
  onClose,
  onSave,
  selectedDate,
}: AddEventModalProps) {
  const [formData, setFormData] = React.useState({
    title: "",
    date: selectedDate || "",
    time: "",
    type: "Application Deadline",
    priority: "Medium",
    description: "",
    college: "",
  });

  React.useEffect(() => {
    if (selectedDate) {
      setFormData((prev) => ({ ...prev, date: selectedDate }));
    }
  }, [selectedDate]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
    setFormData({
      title: "",
      date: "",
      time: "",
      type: "Application Deadline",
      priority: "Medium",
      description: "",
      college: "",
    });
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

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-[#141414] border border-neutral-700 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-neutral-700">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <FaCalendar className="text-green-400 text-xl" />
              <h2 className="text-xl font-bold text-[#FEEBD8]">
                Add New Event
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
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-[#FEEBD8]/70 mb-2">
                Event Title *
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
                className="w-full bg-neutral-800 border border-neutral-700 rounded-lg px-4 py-2 text-[#FEEBD8] focus:outline-none focus:border-[#FEEBD8]"
                placeholder="e.g., Stanford Application Deadline"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[#FEEBD8]/70 mb-2">
                Date *
              </label>
              <input
                type="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                required
                className="w-full bg-neutral-800 border border-neutral-700 rounded-lg px-4 py-2 text-[#FEEBD8] focus:outline-none focus:border-[#FEEBD8]"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[#FEEBD8]/70 mb-2">
                Time
              </label>
              <input
                type="time"
                name="time"
                value={formData.time}
                onChange={handleChange}
                className="w-full bg-neutral-800 border border-neutral-700 rounded-lg px-4 py-2 text-[#FEEBD8] focus:outline-none focus:border-[#FEEBD8]"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[#FEEBD8]/70 mb-2">
                Event Type
              </label>
              <select
                name="type"
                value={formData.type}
                onChange={handleChange}
                className="w-full bg-neutral-800 border border-neutral-700 rounded-lg px-4 py-2 text-[#FEEBD8] focus:outline-none focus:border-[#FEEBD8]"
              >
                {eventTypes.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-[#FEEBD8]/70 mb-2">
                Priority
              </label>
              <select
                name="priority"
                value={formData.priority}
                onChange={handleChange}
                className="w-full bg-neutral-800 border border-neutral-700 rounded-lg px-4 py-2 text-[#FEEBD8] focus:outline-none focus:border-[#FEEBD8]"
              >
                {priorities.map((priority) => (
                  <option key={priority.value} value={priority.value}>
                    {priority.value} Priority
                  </option>
                ))}
              </select>
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-[#FEEBD8]/70 mb-2">
                Related College (Optional)
              </label>
              <select
                name="college"
                value={formData.college}
                onChange={handleChange}
                className="w-full bg-neutral-800 border border-neutral-700 rounded-lg px-4 py-2 text-[#FEEBD8] focus:outline-none focus:border-[#FEEBD8]"
              >
                <option value="">No specific college</option>
                {colleges.map((college) => (
                  <option key={college} value={college}>
                    {college}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-[#FEEBD8]/70 mb-2">
              Description
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={4}
              className="w-full bg-neutral-800 border border-neutral-700 rounded-lg px-4 py-2 text-[#FEEBD8] focus:outline-none focus:border-[#FEEBD8]"
              placeholder="Add any additional details about this event..."
            />
          </div>

          {/* Preview */}
          <div className="bg-neutral-800 rounded-lg p-4">
            <h4 className="text-[#FEEBD8] font-medium mb-2">Preview</h4>
            <div className="flex items-start gap-3">
              <div
                className={`p-2 rounded-lg ${
                  formData.priority === "High"
                    ? "bg-red-500/20"
                    : formData.priority === "Medium"
                    ? "bg-yellow-500/20"
                    : "bg-green-500/20"
                }`}
              >
                <FaFlag
                  className={
                    formData.priority === "High"
                      ? "text-red-400"
                      : formData.priority === "Medium"
                      ? "text-yellow-400"
                      : "text-green-400"
                  }
                />
              </div>
              <div className="flex-1">
                <h5 className="text-[#FEEBD8] font-medium">
                  {formData.title || "Event Title"}
                </h5>
                <p className="text-[#FEEBD8]/60 text-sm">
                  {formData.type}
                  {formData.college && ` • ${formData.college}`}
                </p>
                <p className="text-[#FEEBD8]/60 text-sm">
                  {formData.date
                    ? new Date(formData.date).toLocaleDateString()
                    : "Date not set"}
                  {formData.time && ` at ${formData.time}`}
                </p>
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
              Add Event
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
