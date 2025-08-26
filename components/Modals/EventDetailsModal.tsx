import React from "react";
import {
  FaTimes,
  FaCalendar,
  FaClock,
  FaFlag,
  FaUniversity,
  FaEdit,
  FaTrash,
  FaInfoCircle,
} from "react-icons/fa";
import { CalendarEvent, EventType, EventPriority } from "../../lib/types";

interface EventDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onEdit: () => void;
  onDelete: (id: string) => void;
  event: CalendarEvent | null;
}

const eventTypeLabels = {
  [EventType.DEADLINE]: "Application Deadline",
  [EventType.INTERVIEW]: "Interview",
  [EventType.VISIT]: "Campus Visit",
  [EventType.TEST]: "Test Date",
  [EventType.REMINDER]: "Reminder",
  [EventType.OTHER]: "Other",
};

const priorityLabels = {
  [EventPriority.HIGH]: "High",
  [EventPriority.MEDIUM]: "Medium",
  [EventPriority.LOW]: "Low",
};

export default function EventDetailsModal({
  isOpen,
  onClose,
  onEdit,
  onDelete,
  event,
}: EventDetailsModalProps) {
  const [showDeleteConfirm, setShowDeleteConfirm] = React.useState(false);

  const handleDelete = () => {
    if (!event) return;
    onDelete(event.id);
    setShowDeleteConfirm(false);
    onClose();
  };

  if (!isOpen || !event) return null;

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const formatTime = (time: string) => {
    return new Date(`2000-01-01T${time}`).toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  };

  const getPriorityColor = (priority: EventPriority) => {
    switch (priority) {
      case EventPriority.HIGH:
        return "text-red-400 bg-red-500/20";
      case EventPriority.MEDIUM:
        return "text-yellow-400 bg-yellow-500/20";
      case EventPriority.LOW:
        return "text-green-400 bg-green-500/20";
      default:
        return "text-gray-400 bg-gray-500/20";
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-[#141414] border border-neutral-700 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-neutral-700">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <FaInfoCircle className="text-blue-400 text-xl" />
              <h2 className="text-xl font-bold text-[#FEEBD8]">
                Event Details
              </h2>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={onEdit}
                className="text-blue-400 hover:text-blue-300 transition-colors p-2"
                title="Edit Event"
              >
                <FaEdit size={16} />
              </button>
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

        <div className="p-6 space-y-6">
          {/* Event Header */}
          <div className="flex items-start gap-4">
            <div
              className={`p-3 rounded-lg ${getPriorityColor(event.priority)}`}
            >
              <FaFlag size={20} />
            </div>
            <div className="flex-1">
              <h3 className="text-2xl font-bold text-[#FEEBD8] mb-2">
                {event.title}
              </h3>
              <div className="flex items-center gap-4 text-[#FEEBD8]/70">
                <span className="bg-neutral-800 px-3 py-1 rounded-full text-sm">
                  {eventTypeLabels[event.type]}
                </span>
                <span
                  className={`px-3 py-1 rounded-full text-sm ${getPriorityColor(
                    event.priority
                  )}`}
                >
                  {priorityLabels[event.priority]} Priority
                </span>
              </div>
            </div>
          </div>

          {/* Event Details Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Date & Time */}
            <div className="space-y-4">
              <h4 className="text-lg font-semibold text-[#FEEBD8] border-b border-neutral-700 pb-2">
                Schedule
              </h4>

              {event.date ? (
                <div className="flex items-center gap-3">
                  <FaCalendar className="text-green-400" />
                  <div>
                    <p className="text-[#FEEBD8] font-medium">
                      {formatDate(event.date)}
                    </p>
                    <p className="text-[#FEEBD8]/60 text-sm">Date</p>
                  </div>
                </div>
              ) : (
                <div className="flex items-center gap-3">
                  <FaCalendar className="text-neutral-500" />
                  <div>
                    <p className="text-neutral-500 font-medium">No date set</p>
                    <p className="text-neutral-600 text-sm">In inbox</p>
                  </div>
                </div>
              )}

              {event.time && (
                <div className="flex items-center gap-3">
                  <FaClock className="text-blue-400" />
                  <div>
                    <p className="text-[#FEEBD8] font-medium">
                      {formatTime(event.time)}
                    </p>
                    <p className="text-[#FEEBD8]/60 text-sm">Time</p>
                  </div>
                </div>
              )}
            </div>

            {/* College Information */}
            <div className="space-y-4">
              <h4 className="text-lg font-semibold text-[#FEEBD8] border-b border-neutral-700 pb-2">
                Details
              </h4>

              {event.college ? (
                <div className="flex items-center gap-3">
                  <FaUniversity className="text-purple-400" />
                  <div>
                    <p className="text-[#FEEBD8] font-medium">
                      {event.college}
                    </p>
                    <p className="text-[#FEEBD8]/60 text-sm">Related College</p>
                  </div>
                </div>
              ) : (
                <div className="flex items-center gap-3">
                  <FaUniversity className="text-neutral-500" />
                  <div>
                    <p className="text-neutral-500 font-medium">
                      No college specified
                    </p>
                    <p className="text-neutral-600 text-sm">General event</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Description */}
          {event.description && (
            <div className="space-y-4">
              <h4 className="text-lg font-semibold text-[#FEEBD8] border-b border-neutral-700 pb-2">
                Description
              </h4>
              <div className="bg-neutral-800 rounded-lg p-4">
                <p className="text-[#FEEBD8]/80 whitespace-pre-wrap leading-relaxed">
                  {event.description}
                </p>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4 border-t border-neutral-700">
            <button
              onClick={onClose}
              className="flex-1 bg-neutral-700 text-[#FEEBD8] px-6 py-3 rounded-lg font-medium hover:bg-neutral-600 transition-colors"
            >
              Close
            </button>
            <button
              onClick={onEdit}
              className="flex-1 bg-[#FEEBD8] text-[#141414] px-6 py-3 rounded-lg font-medium hover:bg-[#E5D5B7] transition-colors flex items-center justify-center gap-2"
            >
              <FaEdit size={16} />
              Edit Event
            </button>
          </div>
        </div>
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
