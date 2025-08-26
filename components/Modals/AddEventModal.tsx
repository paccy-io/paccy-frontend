import React from "react";
import {
  FaTimes,
  FaCalendar,
  FaClock,
  FaFlag,
  FaUniversity,
  FaPen,
} from "react-icons/fa";
import {
  CalendarEvent,
  EventType,
  EventPriority,
  CreateEventDTO,
  CollegeApplication,
} from "../../lib/types";
import { collegeApplicationsApi } from "../../lib/api/college-applications";

interface AddEventModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (event: CreateEventDTO) => void;
  selectedDate?: string;
}

const eventTypes = [
  { value: EventType.DEADLINE, label: "Application Deadline" },
  { value: EventType.INTERVIEW, label: "Interview" },
  { value: EventType.VISIT, label: "Campus Visit" },
  { value: EventType.TEST, label: "Test Date" },
  { value: EventType.REMINDER, label: "Reminder" },
  { value: EventType.OTHER, label: "Other" },
];

const priorities = [
  { value: EventPriority.HIGH, label: "High", color: "text-red-400" },
  { value: EventPriority.MEDIUM, label: "Medium", color: "text-yellow-400" },
  { value: EventPriority.LOW, label: "Low", color: "text-green-400" },
];

export default function AddEventModal({
  isOpen,
  onClose,
  onSave,
  selectedDate,
}: AddEventModalProps) {
  const [collegeApplications, setCollegeApplications] = React.useState<
    CollegeApplication[]
  >([]);
  const [loading, setLoading] = React.useState(false);

  // Get today's date in YYYY-MM-DD format
  const today = new Date().toISOString().split("T")[0];

  const [formData, setFormData] = React.useState({
    title: "",
    date: selectedDate || today,
    time: "23:59",
    type: EventType.DEADLINE,
    priority: EventPriority.MEDIUM,
    description: "",
    college: "",
  });

  React.useEffect(() => {
    if (isOpen) {
      loadCollegeApplications();
      // Reset form with defaults when modal opens
      setFormData({
        title: "",
        date: selectedDate || today,
        time: "23:59",
        type: EventType.DEADLINE,
        priority: EventPriority.MEDIUM,
        description: "",
        college: "",
      });
    }
  }, [isOpen, selectedDate, today]);

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

    const eventData: CreateEventDTO = {
      ...formData,
      date: formData.date || undefined, // Convert empty string to undefined for undated events
    };

    onSave(eventData);

    // Reset form with defaults
    setFormData({
      title: "",
      date: today,
      time: "23:59",
      type: EventType.DEADLINE,
      priority: EventPriority.MEDIUM,
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
                  <option key={type.value} value={type.value}>
                    {type.label}
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
                    {priority.label} Priority
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
                disabled={loading}
                className="w-full bg-neutral-800 border border-neutral-700 rounded-lg px-4 py-2 text-[#FEEBD8] focus:outline-none focus:border-[#FEEBD8] disabled:opacity-50"
              >
                <option value="">No specific college</option>
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
                    <option key={app.id} value={displayName}>
                      {displayName}
                    </option>
                  );
                })}
              </select>
              {loading && (
                <p className="text-neutral-400 text-sm mt-1">
                  Loading colleges...
                </p>
              )}
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
                  formData.priority === EventPriority.HIGH
                    ? "bg-red-500/20"
                    : formData.priority === EventPriority.MEDIUM
                    ? "bg-yellow-500/20"
                    : "bg-green-500/20"
                }`}
              >
                <FaFlag
                  className={
                    formData.priority === EventPriority.HIGH
                      ? "text-red-400"
                      : formData.priority === EventPriority.MEDIUM
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
