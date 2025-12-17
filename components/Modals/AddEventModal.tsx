import React from "react";
import {
  FaTimes,
  FaCalendar,
  FaClock,
  FaFlag,
  FaUniversity,
  FaPen,
} from "react-icons/fa";
import DatePicker from "../DatePicker";
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
  selectedTime?: string;
}

const eventTypes = [
  { value: EventType.APPLICATION_DEADLINE, label: "Application Deadline" },
  { value: EventType.INTERVIEW, label: "Interview" },
  { value: EventType.CAMPUS_VISIT, label: "Campus Visit" },
  { value: EventType.TEST_DATE, label: "Test Date" },
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
  selectedTime,
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
    time: selectedTime || "23:59",
    type: EventType.APPLICATION_DEADLINE,
    priority: EventPriority.MEDIUM,
    description: "",
    college_id: "",
  });

  React.useEffect(() => {
    if (isOpen) {
      loadCollegeApplications();
      // Reset form with defaults when modal opens
      setFormData({
        title: "",
        date: selectedDate || today,
        time: selectedTime || "23:59",
        type: EventType.APPLICATION_DEADLINE,
        priority: EventPriority.MEDIUM,
        description: "",
        college_id: "",
      });

      // Disable body scroll when modal is open
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = "unset";
      };
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

    // Format date and time into ISO 8601 format with local timezone
    let formattedDate: string | undefined = undefined;

    if (formData.date) {
      const dateStr = formData.date; // YYYY-MM-DD format
      const timeStr = formData.time || "00:00"; // HH:MM format, default to midnight

      // Create a temporary date to get timezone offset
      const tempDate = new Date();
      const timezoneOffset = tempDate.getTimezoneOffset();
      const offsetHours = Math.floor(Math.abs(timezoneOffset) / 60);
      const offsetMinutes = Math.abs(timezoneOffset) % 60;
      const offsetSign = timezoneOffset <= 0 ? "+" : "-";
      const offsetString = `${offsetSign}${offsetHours
        .toString()
        .padStart(2, "0")}:${offsetMinutes.toString().padStart(2, "0")}`;

      // Combine date and time with local timezone offset
      formattedDate = `${dateStr}T${timeStr}:00${offsetString}`;
    }

    const eventData: CreateEventDTO = {
      title: formData.title,
      description: formData.description,
      date: formattedDate, // ISO 8601 format with timezone information
      type: formData.type,
      priority: formData.priority,
      college_id: formData.college_id === "" ? null : formData.college_id,
    };

    onSave(eventData);

    // Reset form with defaults
    setFormData({
      title: "",
      date: today,
      time: "23:59",
      type: EventType.APPLICATION_DEADLINE,
      priority: EventPriority.MEDIUM,
      description: "",
      college_id: "",
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
      <div className="bg-gradient-to-br from-[#141414] to-[#1a1a1a] border border-neutral-700/50 rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-neutral-700/50">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <FaCalendar className="text-green-400 text-xl" />
              <h2 className="text-xl font-bold text-white">
                Add New Event
              </h2>
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
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-white/70 mb-2">
                Event Title *
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
                className="w-full bg-neutral-800 border border-neutral-700/50 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-500 transition-colors"
                placeholder="e.g., Stanford Application Deadline"
              />
            </div>

            <DatePicker
              label="Date *"
              value={formData.date}
              onChange={(date) => setFormData((prev) => ({ ...prev, date }))}
              placeholder="Select event date"
            />

            <div>
              <label className="block text-sm font-medium text-white/70 mb-2">
                Time
              </label>
              <input
                type="time"
                name="time"
                value={formData.time}
                onChange={handleChange}
                className="w-full bg-neutral-800 border border-neutral-700/50 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-500 transition-colors"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-white/70 mb-2">
                Event Type
              </label>
              <select
                name="type"
                value={formData.type}
                onChange={handleChange}
                className="w-full bg-neutral-800 border border-neutral-700/50 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-500 transition-colors"
              >
                {eventTypes.map((type) => (
                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-white/70 mb-2">
                Priority
              </label>
              <select
                name="priority"
                value={formData.priority}
                onChange={handleChange}
                className="w-full bg-neutral-800 border border-neutral-700/50 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-500 transition-colors"
              >
                {priorities.map((priority) => (
                  <option key={priority.value} value={priority.value}>
                    {priority.label} Priority
                  </option>
                ))}
              </select>
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-white/70 mb-2">
                Related College (Optional)
              </label>
              <select
                name="college_id"
                value={formData.college_id}
                onChange={handleChange}
                disabled={loading}
                className="w-full bg-neutral-800 border border-neutral-700/50 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-500 disabled:opacity-50"
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
                    <option key={app.id} value={app.id}>
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
            <label className="block text-sm font-medium text-white/70 mb-2">
              Description
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={4}
              className="w-full bg-neutral-800 border border-neutral-700/50 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-500 transition-colors"
              placeholder="Add any additional details about this event..."
            />
          </div>

          {/* Preview */}
          <div className="bg-neutral-800 rounded-lg p-4">
            <h4 className="text-white font-medium mb-2">Preview</h4>
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
                <h5 className="text-white font-medium">
                  {formData.title || "Event Title"}
                </h5>
                <p className="text-white/60 text-sm">
                  {formData.type}
                  {/* College preview removed, as college_id is now used */}
                </p>
                <p className="text-white/60 text-sm">
                  {formData.date
                    ? new Date(formData.date).toLocaleDateString()
                    : "Date not set"}
                  {formData.time && ` at ${formData.time}`}
                </p>
              </div>
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
              Add Event
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
