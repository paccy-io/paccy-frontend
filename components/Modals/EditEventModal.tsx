import React from "react";
import {
  FaTimes,
  FaCalendar,
  FaClock,
  FaFlag,
  FaUniversity,
  FaEdit,
  FaTrash,
} from "react-icons/fa";
import {
  CalendarEvent,
  EventType,
  EventPriority,
  UpdateEventDTO,
  CollegeApplication,
} from "../../lib/types";
import { collegeApplicationsApi } from "../../lib/api/college-applications";

interface EditEventModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (id: string, event: UpdateEventDTO) => void;
  onDelete: (id: string) => void;
  event: CalendarEvent | null;
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

export default function EditEventModal({
  isOpen,
  onClose,
  onSave,
  onDelete,
  event,
}: EditEventModalProps) {
  const [collegeApplications, setCollegeApplications] = React.useState<
    CollegeApplication[]
  >([]);
  const [loading, setLoading] = React.useState(false);

  const [formData, setFormData] = React.useState({
    title: "",
    date: "",
    time: "",
    type: EventType.APPLICATION_DEADLINE,
    priority: EventPriority.MEDIUM,
    description: "",
    college_id: "",
  });

  const [showDeleteConfirm, setShowDeleteConfirm] = React.useState(false);

  React.useEffect(() => {
    if (event) {
      let dateStr = "";
      let timeStr = "";

      // Extract date and time from ISO string if event has a date
      if (event.date) {
        try {
          // If the date includes timezone info, parse it accordingly
          // If it's in UTC format (ending with Z), convert to local time
          // If it's in local timezone format (with offset), parse as is
          const date = new Date(event.date);

          // Extract the components from the parsed date (which will be in local time after parsing)
          const year = date.getFullYear();
          const month = String(date.getMonth() + 1).padStart(2, "0");
          const day = String(date.getDate()).padStart(2, "0");
          const hours = String(date.getHours()).padStart(2, "0");
          const minutes = String(date.getMinutes()).padStart(2, "0");

          dateStr = `${year}-${month}-${day}`; // YYYY-MM-DD
          timeStr = `${hours}:${minutes}`; // HH:MM
        } catch {
          // If date parsing fails, leave fields empty
        }
      }

      setFormData({
        title: event.title || "",
        date: dateStr,
        time: timeStr,
        type: event.type || EventType.APPLICATION_DEADLINE,
        priority: event.priority || EventPriority.MEDIUM,
        description: event.description || "",
        college_id: event.college_id || "",
      });
    }
  }, [event]);

  React.useEffect(() => {
    if (isOpen) {
      loadCollegeApplications();
      // Disable body scroll when modal is open
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = "unset";
      };
    }
  }, [isOpen]);

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
    if (!event) return;

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

    const updateData: UpdateEventDTO = {
      title: formData.title,
      description: formData.description,
      date: formattedDate, // ISO 8601 format with timezone information
      type: formData.type,
      priority: formData.priority,
      college_id: formData.college_id === "" ? null : formData.college_id,
    };

    onSave(event.id, updateData);
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

  const handleDelete = () => {
    if (!event) return;
    onDelete(event.id);
    setShowDeleteConfirm(false);
    onClose();
  };

  if (!isOpen || !event) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-[#141414] border border-neutral-700 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-neutral-700">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <FaEdit className="text-blue-400 text-xl" />
              <h2 className="text-xl font-bold text-[#FEEBD8]">Edit Event</h2>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowDeleteConfirm(true)}
                className="text-red-400 hover:text-red-300 transition-colors p-2"
                title="Delete Event"
              >
                <FaTrash size={16} />
              </button>
              <button
                onClick={onClose}
                className="text-[#FEEBD8]/60 hover:text-[#FEEBD8] transition-colors p-2"
              >
                <FaTimes size={20} />
              </button>
            </div>
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
                Date{" "}
                <span className="text-neutral-500">
                  (leave empty for inbox)
                </span>
              </label>
              <input
                type="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
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
                name="college_id"
                value={formData.college_id}
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

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-60 p-4">
          <div className="bg-[#141414] border border-red-500/50 rounded-lg max-w-md w-full">
            <div className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <FaTrash className="text-red-400 text-xl" />
                <h3 className="text-lg font-bold text-[#FEEBD8]">
                  Delete Event
                </h3>
              </div>
              <p className="text-[#FEEBD8]/70 mb-6">
                Are you sure you want to delete "{event?.title}"? This action
                cannot be undone.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowDeleteConfirm(false)}
                  className="flex-1 bg-neutral-700 text-[#FEEBD8] px-4 py-2 rounded-lg font-medium hover:bg-neutral-600 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDelete}
                  className="flex-1 bg-red-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-red-700 transition-colors"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
